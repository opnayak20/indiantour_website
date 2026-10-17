<?php
// backend/helpers/auth_helper.php

class AuthHelper {
    private static function getSecret() {
        $secret = getenv('APP_SECRET');
        if (empty($secret)) {
            error_log("Security error: APP_SECRET environment variable is not configured.");
            if (function_exists('sendResponse')) {
                sendResponse(500, null, "Server configuration error: Authentication secret is not set.");
            }
            throw new RuntimeException("APP_SECRET is not configured.");
        }
        return $secret;
    }

    // Generate a secure lightweight payload token
    public static function generateToken($user) {
        $secret = self::getSecret();
        $payload = [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'exp' => time() + (86400 * 30) // 30 days
        ];
        
        $base64Payload = base64_encode(json_encode($payload));
        $signature = hash_hmac('sha256', $base64Payload, $secret);
        return $base64Payload . '.' . $signature;
    }

    // Validate token and return decoded payload
    public static function validateToken($token) {
        if (!$token) return false;
        
        $parts = explode('.', $token);
        if (count($parts) !== 2) return false;

        $base64Payload = $parts[0];
        $signature = $parts[1];

        $secret = getenv('APP_SECRET');
        if (empty($secret)) {
            return false;
        }

        $expectedSig = hash_hmac('sha256', $base64Payload, $secret);
        if (!hash_equals($expectedSig, $signature)) {
            return false;
        }

        $payload = json_decode(base64_decode($base64Payload), true);
        if (!$payload || !isset($payload['exp']) || (int)$payload['exp'] < time()) {
            return false;
        }

        return $payload;
    }

    // Ensure auth_throttle table exists (cross-compatible SQLite & MySQL)
    public static function ensureThrottleTable($db) {
        $sql = "
            CREATE TABLE IF NOT EXISTS auth_throttle (
                id VARCHAR(64) PRIMARY KEY,
                action_type VARCHAR(32) NOT NULL,
                identifier VARCHAR(150) NOT NULL,
                attempts INT DEFAULT 1,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL
            );
        ";
        $db->exec($sql);
    }

    // Check rate limit for send_otp (max 3 requests per email per 10 minutes)
    public static function checkSendOtpThrottle($db, $email) {
        self::ensureThrottleTable($db);
        $now = date('Y-m-d H:i:s');
        $stmt = $db->prepare("SELECT id, attempts, created_at FROM auth_throttle WHERE action_type = 'send_otp' AND identifier = ?");
        $stmt->execute([$email]);
        $record = $stmt->fetch();

        if ($record) {
            $elapsed = time() - strtotime($record['created_at']);
            if ($elapsed > 600) {
                // Window expired: reset window
                $up = $db->prepare("UPDATE auth_throttle SET attempts = 1, created_at = ?, updated_at = ? WHERE id = ?");
                $up->execute([$now, $now, $record['id']]);
                return true;
            }
            if ((int)$record['attempts'] >= 3) {
                return false;
            }
            $up = $db->prepare("UPDATE auth_throttle SET attempts = attempts + 1, updated_at = ? WHERE id = ?");
            $up->execute([$now, $record['id']]);
            return true;
        } else {
            $id = 'th_' . bin2hex(random_bytes(16));
            $ins = $db->prepare("INSERT INTO auth_throttle (id, action_type, identifier, attempts, created_at, updated_at) VALUES (?, 'send_otp', ?, 1, ?, ?)");
            $ins->execute([$id, $email, $now, $now]);
            return true;
        }
    }

    // Check if verify_otp is blocked (>= 5 failed attempts)
    public static function isVerifyOtpBlocked($db, $email) {
        self::ensureThrottleTable($db);
        $stmt = $db->prepare("SELECT attempts FROM auth_throttle WHERE action_type = 'verify_otp' AND identifier = ?");
        $stmt->execute([$email]);
        $record = $stmt->fetch();
        if ($record && (int)$record['attempts'] >= 5) {
            return true;
        }
        return false;
    }

    // Record a failed verify_otp attempt. If reaches 5, invalidates OTPs for the email and returns false.
    public static function recordFailedVerifyOtp($db, $email) {
        self::ensureThrottleTable($db);
        $now = date('Y-m-d H:i:s');
        $stmt = $db->prepare("SELECT id, attempts FROM auth_throttle WHERE action_type = 'verify_otp' AND identifier = ?");
        $stmt->execute([$email]);
        $record = $stmt->fetch();

        if ($record) {
            $attempts = (int)$record['attempts'] + 1;
            $up = $db->prepare("UPDATE auth_throttle SET attempts = ?, updated_at = ? WHERE id = ?");
            $up->execute([$attempts, $now, $record['id']]);
        } else {
            $attempts = 1;
            $id = 'th_' . bin2hex(random_bytes(16));
            $ins = $db->prepare("INSERT INTO auth_throttle (id, action_type, identifier, attempts, created_at, updated_at) VALUES (?, 'verify_otp', ?, 1, ?, ?)");
            $ins->execute([$id, $email, $now, $now]);
        }

        if ($attempts >= 5) {
            // Invalidate OTPs for this email immediately
            $del = $db->prepare("DELETE FROM email_otps WHERE email = ?");
            $del->execute([$email]);
            return false;
        }
        return true;
    }

    // Clear verify_otp throttle upon successful verification or when new OTP is sent
    public static function clearVerifyOtpThrottle($db, $email) {
        self::ensureThrottleTable($db);
        $del = $db->prepare("DELETE FROM auth_throttle WHERE action_type = 'verify_otp' AND identifier = ?");
        $del->execute([$email]);
    }

    // Check if password login is blocked (max 5 failed attempts within 15 minutes per email+IP)
    public static function isPasswordLoginBlocked($db, $email, $ip = null) {
        self::ensureThrottleTable($db);
        $clientIp = $ip ?: ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
        $identifier = hash('sha256', strtolower($email) . '|' . $clientIp);
        $stmt = $db->prepare("SELECT id, attempts, updated_at FROM auth_throttle WHERE action_type = 'login_password' AND identifier = ?");
        $stmt->execute([$identifier]);
        $record = $stmt->fetch();

        if ($record) {
            $elapsed = time() - strtotime($record['updated_at']);
            if ($elapsed > 900) {
                // Window expired (15 minutes), clear lockout
                $del = $db->prepare("DELETE FROM auth_throttle WHERE id = ?");
                $del->execute([$record['id']]);
                return false;
            }
            if ((int)$record['attempts'] >= 5) {
                return true;
            }
        }
        return false;
    }

    // Record a failed password login attempt
    public static function recordFailedPasswordLogin($db, $email, $ip = null) {
        self::ensureThrottleTable($db);
        $clientIp = $ip ?: ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
        $identifier = hash('sha256', strtolower($email) . '|' . $clientIp);
        $now = date('Y-m-d H:i:s');
        $stmt = $db->prepare("SELECT id, attempts, updated_at FROM auth_throttle WHERE action_type = 'login_password' AND identifier = ?");
        $stmt->execute([$identifier]);
        $record = $stmt->fetch();

        if ($record) {
            $elapsed = time() - strtotime($record['updated_at']);
            $attempts = ($elapsed > 900) ? 1 : ((int)$record['attempts'] + 1);
            $up = $db->prepare("UPDATE auth_throttle SET attempts = ?, updated_at = ? WHERE id = ?");
            $up->execute([$attempts, $now, $record['id']]);
        } else {
            $id = 'th_' . bin2hex(random_bytes(16));
            $ins = $db->prepare("INSERT INTO auth_throttle (id, action_type, identifier, attempts, created_at, updated_at) VALUES (?, 'login_password', ?, 1, ?, ?)");
            $ins->execute([$id, $identifier, $now, $now]);
        }
    }

    // Clear failed password attempts on successful login
    public static function clearPasswordLoginThrottle($db, $email, $ip = null) {
        self::ensureThrottleTable($db);
        $clientIp = $ip ?: ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
        $identifier = hash('sha256', strtolower($email) . '|' . $clientIp);
        $del = $db->prepare("DELETE FROM auth_throttle WHERE action_type = 'login_password' AND identifier = ?");
        $del->execute([$identifier]);
    }

    // Get current authenticated user from Bearer header
    public static function getAuthUser($db) {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        if (empty($headers)) {
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                }
            }
        }
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return null;
        }

        $token = $matches[1];
        $payload = self::validateToken($token);
        if (!$payload) return null;

        $stmt = $db->prepare("SELECT id, name, email, phone, role, avatar, address, created_at FROM users WHERE id = ?");
        $stmt->execute([$payload['id']]);
        $user = $stmt->fetch();

        return $user ?: null;
    }

    public static function requireAuth($db) {
        $user = self::getAuthUser($db);
        if (!$user) {
            sendResponse(401, null, "Unauthorized: Please log in to proceed.");
        }
        return $user;
    }

    public static function requireAdmin($db) {
        $user = self::requireAuth($db);
        if ($user['role'] !== 'admin') {
            sendResponse(403, null, "Forbidden: Admin privileges required.");
        }
        return $user;
    }
}

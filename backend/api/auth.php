<?php
// backend/api/auth.php - Unified Authentication Endpoint (F1)

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/auth_helper.php';
require_once __DIR__ . '/../helpers/mailer.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: Session validation via Bearer token
if ($method === 'GET') {
    $user = AuthHelper::requireAuth($db);
    sendResponse(200, ['user' => $user], "Session active.");
}

// 2. POST: Action-based unified handling (send_otp, verify_otp, login)
if ($method === 'POST') {
    $input = getJsonInput();
    $action = $input['action'] ?? ($_POST['action'] ?? 'login');

    // ---------------------------------------------------------
    // ACTION: send_otp
    // ---------------------------------------------------------
    if ($action === 'send_otp') {
        $email = strtolower(trim($input['email'] ?? ($_POST['email'] ?? '')));
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(400, null, "A valid email address is required.");
        }

        // S3: Rate limit - max 3 send_otp requests per email per 10 minutes
        if (!AuthHelper::checkSendOtpThrottle($db, $email)) {
            sendResponse(429, null, "Too many OTP requests. Please wait a few minutes before trying again.");
        }
        AuthHelper::clearVerifyOtpThrottle($db, $email);

        // AUTH-8: Admin accounts must use password authentication only
        $checkAdminStmt = $db->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
        $checkAdminStmt->execute([$email]);
        $existingAdminCheck = $checkAdminStmt->fetch();
        if ($existingAdminCheck && $existingAdminCheck['role'] === 'admin') {
            sendResponse(403, null, "Administrator accounts must authenticate using password login.");
        }

        // Resolve recipient name: input -> existing user name -> email local-part
        $name = trim($input['name'] ?? ($_POST['name'] ?? ''));
        if (empty($name)) {
            $userStmt = $db->prepare("SELECT name FROM users WHERE email = ? LIMIT 1");
            $userStmt->execute([$email]);
            $existingUser = $userStmt->fetch();
            if ($existingUser && !empty($existingUser['name'])) {
                $name = $existingUser['name'];
            } else {
                $parts = explode('@', $email);
                $name = ucfirst($parts[0] ?: 'Adventurer');
            }
        }

        // Generate 6-digit cryptographic OTP (10 minute expiry)
        $otp = (string)random_int(100000, 999999);
        $expiresAt = date('Y-m-d H:i:s', time() + 600);

        // Single active OTP: delete old OTPs for this email
        $delStmt = $db->prepare("DELETE FROM email_otps WHERE email = ?");
        $delStmt->execute([$email]);

        // Insert new OTP record
        $insStmt = $db->prepare("INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)");
        $insStmt->execute([$email, $otp, $expiresAt]);

        // Send OTP via Mailer
        $mailSent = Mailer::sendOtpEmail($email, $otp, $name);

        if ($mailSent) {
            sendResponse(200, [
                'email' => $email,
                'otp_dispatched' => true,
                'expires_in' => '10 minutes'
            ], "Verification OTP sent to {$email}.");
        } else {
            error_log("Failed to send OTP email to {$email}");

            // S1: Never return OTP in production. Only allowed if APP_ENV === 'local' AND host is localhost/127.0.0.1
            $appEnv = getenv('APP_ENV');
            $hostHeader = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? '');
            $hostName = parse_url('http://' . $hostHeader, PHP_URL_HOST) ?: $hostHeader;
            $isLocalHost = in_array(strtolower($hostName), ['localhost', '127.0.0.1'], true);

            if ($appEnv === 'local' && $isLocalHost) {
                sendResponse(200, [
                    'email' => $email,
                    'otp_dispatched' => false,
                    'preview_otp' => $otp,
                    'expires_in' => '10 minutes'
                ], "OTP generated (local development mode).");
            } else {
                sendResponse(500, null, "Could not send verification email. Please try again later.");
            }
        }
    }

    // ---------------------------------------------------------
    // ACTION: verify_otp
    // ---------------------------------------------------------
    if ($action === 'verify_otp') {
        $email = strtolower(trim($input['email'] ?? ($_POST['email'] ?? '')));
        $otp = trim($input['otp'] ?? ($input['code'] ?? ($_POST['otp'] ?? ($_POST['code'] ?? ''))));

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(400, null, "A valid email address is required.");
        }
        if (empty($otp)) {
            sendResponse(400, null, "Verification code is required.");
        }

        // S3: Block if failed attempts >= 5
        if (AuthHelper::isVerifyOtpBlocked($db, $email)) {
            sendResponse(400, null, "Too many failed attempts. Verification code has been invalidated. Please request a new code.");
        }

        $now = date('Y-m-d H:i:s');
        $otpStmt = $db->prepare("
            SELECT id, expires_at FROM email_otps 
            WHERE email = ? AND otp = ? AND expires_at > ?
            ORDER BY id DESC LIMIT 1
        ");
        $otpStmt->execute([$email, $otp, $now]);
        $validOtp = $otpStmt->fetch();

        if (!$validOtp) {
            $withinLimit = AuthHelper::recordFailedVerifyOtp($db, $email);
            if (!$withinLimit) {
                sendResponse(400, null, "Too many failed attempts. Verification code has been invalidated. Please request a new code.");
            }
            sendResponse(400, null, "Invalid or expired verification code.");
        }

        // OTP is valid: single-use cleanup
        $delStmt = $db->prepare("DELETE FROM email_otps WHERE email = ?");
        $delStmt->execute([$email]);
        AuthHelper::clearVerifyOtpThrottle($db, $email);

        // Find existing user or auto-create account
        $uStmt = $db->prepare("SELECT id, name, email, phone, role, avatar, address, created_at FROM users WHERE email = ? LIMIT 1");
        $uStmt->execute([$email]);
        $user = $uStmt->fetch();

        // AUTH-8: Block OTP login for admin accounts
        if ($user && $user['role'] === 'admin') {
            sendResponse(403, null, "Administrator accounts cannot authenticate via OTP. Please use password login.");
        }

        if (!$user) {
            // Auto-create new user with role 'user' (never admin)
            $parts = explode('@', $email);
            $autoName = ucfirst($parts[0] ?: 'Adventurer');
            $randomPassword = password_hash(bin2hex(random_bytes(16)), PASSWORD_BCRYPT);

            $insStmt = $db->prepare("
                INSERT INTO users (name, email, password, role, is_verified, created_at, updated_at)
                VALUES (?, ?, ?, 'user', 1, ?, ?)
            ");
            $insStmt->execute([$autoName, $email, $randomPassword, $now, $now]);
            $userId = (int)$db->lastInsertId();

            $user = [
                'id' => $userId,
                'name' => $autoName,
                'email' => $email,
                'phone' => null,
                'role' => 'user',
                'avatar' => null,
                'address' => null,
                'created_at' => $now
            ];
        }

        unset($user['password']);
        $token = AuthHelper::generateToken($user);

        sendResponse(200, [
            'user' => $user,
            'token' => $token
        ], "Authentication successful.");
    }

    // ---------------------------------------------------------
    // ACTION: login (password authentication)
    // ---------------------------------------------------------
    if ($action === 'login') {
        $email = strtolower(trim($input['email'] ?? ($_POST['email'] ?? '')));
        $password = $input['password'] ?? ($_POST['password'] ?? '');

        if (empty($email)) {
            sendResponse(400, null, "Email is required.");
        }
        if (empty($password)) {
            sendResponse(400, null, "Password is required.");
        }

        // AUTH-7: Check password rate limiting / lockout
        if (AuthHelper::isPasswordLoginBlocked($db, $email)) {
            sendResponse(429, null, "Too many failed login attempts. Account temporarily locked for 15 minutes. Please try again later.");
        }

        $stmt = $db->prepare("SELECT id, name, email, password, phone, role, avatar, address, created_at FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            AuthHelper::recordFailedPasswordLogin($db, $email);
            sendResponse(401, null, "Invalid credentials.");
        }

        AuthHelper::clearPasswordLoginThrottle($db, $email);

        unset($user['password']);
        $token = AuthHelper::generateToken($user);

        sendResponse(200, [
            'user' => $user,
            'token' => $token
        ], "Login successful.");
    }

    sendResponse(400, null, "Invalid action requested.");
}

// Any other method
sendResponse(405, null, "Method not allowed.");

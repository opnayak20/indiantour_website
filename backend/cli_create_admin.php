<?php
// backend/cli_create_admin.php
// Secure CLI utility to provision or reset an Administrator account

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    die("CLI execution only.\n");
}

require_once __DIR__ . '/config/database.php';

$email = $argv[1] ?? 'admin@indiatour.com';
$password = $argv[2] ?? null;
$name = $argv[3] ?? 'India Tour Administrator';

if (!$password) {
    echo "Usage: php cli_create_admin.php <email> <password> [name]\n";
    echo "Example: php cli_create_admin.php admin@indiatour.com MySecurePass#2026 'India Tour Admin'\n";
    exit(1);
}

if (strlen($password) < 8) {
    echo "Error: Password must be at least 8 characters long for security.\n";
    exit(1);
}

try {
    $db = (new Database())->getConnection();
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $now = date('Y-m-d H:i:s');

    $stmt = $db->prepare("SELECT id, role FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        $upd = $db->prepare("UPDATE users SET password = ?, role = 'admin', name = ?, updated_at = ? WHERE id = ?");
        $upd->execute([$hash, $name, $now, $existing['id']]);
        echo "SUCCESS: Existing user '{$email}' (ID: {$existing['id']}) updated to role 'admin' with new password.\n";
    } else {
        $ins = $db->prepare("
            INSERT INTO users (name, email, password, role, is_verified, address, created_at, updated_at)
            VALUES (?, ?, ?, 'admin', 1, 'Ahmedabad HQ', ?, ?)
        ");
        $ins->execute([$name, $email, $hash, $now, $now]);
        echo "SUCCESS: New administrator '{$email}' successfully provisioned.\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}

<?php
// backend/api/auth/register.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, null, "Method not allowed");
}

$input = getJsonInput();

$name = trim($input['name'] ?? '');
$email = strtolower(trim($input['email'] ?? ''));
$phone = trim($input['phone'] ?? '');
$password = $input['password'] ?? '';
$otp = trim($input['otp'] ?? '');

if (empty($name) || empty($email) || empty($phone) || empty($password)) {
    sendResponse(400, null, "Name, Email, Phone number, and Password are all required.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(400, null, "Invalid email address format.");
}

if (strlen($password) < 6) {
    sendResponse(400, null, "Password must be at least 6 characters long.");
}

$database = new Database();
$db = $database->getConnection();

// 1. Verify OTP with anti-bruteforce protection (AUTH-6 / Issue #14)
if (empty($otp)) {
    sendResponse(400, null, "Email verification OTP is required for one-time registration.");
}

if (AuthHelper::isVerifyOtpBlocked($db, $email)) {
    sendResponse(400, null, "Too many failed verification attempts. Verification code invalidated. Please request a new code.");
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
    sendResponse(400, null, "Invalid or expired OTP code. Please request a new OTP.");
}

// Clean up verified OTP and throttle counter
$delOtp = $db->prepare("DELETE FROM email_otps WHERE email = ?");
$delOtp->execute([$email]);
AuthHelper::clearVerifyOtpThrottle($db, $email);

// 2. Check if email already exists
$stmt = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    sendResponse(409, null, "An account with this email address already exists. Please login instead.");
}

// 3. Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// 4. Create User Record
$insertStmt = $db->prepare("
    INSERT INTO users (name, email, phone, password, role, is_verified, created_at)
    VALUES (?, ?, ?, ?, 'user', 1, ?)
");

if ($insertStmt->execute([$name, $email, $phone, $hashedPassword, $now])) {
    $userId = $db->lastInsertId();
    $user = [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'role' => 'user',
        'is_verified' => 1,
        'avatar' => null,
        'address' => null
    ];

    $token = AuthHelper::generateToken($user);

    sendResponse(201, [
        'user' => $user,
        'token' => $token
    ], "Account successfully registered and verified! You can now log in anytime with your email & password.");
} else {
    sendResponse(500, null, "Failed to create account. Please try again.");
}

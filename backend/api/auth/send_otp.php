<?php
// backend/api/auth/send_otp.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';
require_once __DIR__ . '/../../helpers/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, null, "Method not allowed");
}

$input = getJsonInput();
$email = strtolower(trim($input['email'] ?? ''));
$name = trim($input['name'] ?? 'Adventurer');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(400, null, "A valid email address is required.");
}

$database = new Database();
$db = $database->getConnection();

// S3: Rate limit - max 3 send_otp requests per email per 10 minutes
if (!AuthHelper::checkSendOtpThrottle($db, $email)) {
    sendResponse(429, null, "Too many OTP requests. Please wait a few minutes before requesting another code.");
}
AuthHelper::clearVerifyOtpThrottle($db, $email);

// Check if user is already registered
$stmt = $db->prepare("SELECT id, role FROM users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$existingUser = $stmt->fetch();
if ($existingUser) {
    if ($existingUser['role'] === 'admin') {
        sendResponse(403, null, "Administrator accounts must authenticate using password login.");
    }
    sendResponse(409, null, "An account with this email is already registered. Please proceed to sign in.");
}

// Generate 6-digit cryptographic OTP
$otp = (string)random_int(100000, 999999);
$expiresAt = date('Y-m-d H:i:s', time() + 600); // 10 minutes expiry

// Delete existing OTPs for this email
$delStmt = $db->prepare("DELETE FROM email_otps WHERE email = ?");
$delStmt->execute([$email]);

// Insert new OTP record
$insStmt = $db->prepare("INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)");
$insStmt->execute([$email, $otp, $expiresAt]);

// Dispatch Real OTP Email via Gmail SMTP / Mailer
$mailSent = Mailer::sendOtpEmail($email, $otp, $name);

if (!$mailSent) {
    error_log("Failed to send OTP email to {$email}");
    sendResponse(500, [
        'email' => $email,
        'smtp_dispatched' => false
    ], "Could not send verification email. Please try again later.");
}

sendResponse(200, [
    'email' => $email,
    'smtp_dispatched' => true,
    'expires_in' => '10 minutes'
], "Verification OTP email sent to {$email}. Please check your inbox and spam folder.");

<?php
// backend/api/enquiries/create.php

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
$destination = trim($input['destination'] ?? 'General Trekking / Tour');
$travelers = intval($input['travelers'] ?? 1);
$date = !empty($input['date']) ? $input['date'] : null;
$message = trim($input['message'] ?? '');

if (empty($name) || empty($phone)) {
    sendResponse(400, null, "Name and Phone Number are required.");
}

$database = new Database();
$db = $database->getConnection();

// Check if user is logged in
$authUser = AuthHelper::getAuthUser($db);
$userId = $authUser ? $authUser['id'] : null;

// If user is logged in and email is not provided, use user's email
if (empty($email) && $authUser) {
    $email = $authUser['email'];
}

$now = date('Y-m-d H:i:s');
$stmt = $db->prepare("
    INSERT INTO enquiries (user_id, name, email, phone, destination, travelers, date, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
");

if ($stmt->execute([$userId, $name, $email, $phone, $destination, $travelers, $date, $message, $now])) {
    $enquiryId = $db->lastInsertId();
    sendResponse(201, [
        'enquiry_id' => $enquiryId,
        'destination' => $destination,
        'message' => 'Thank you! Our expedition specialist will contact you shortly.'
    ], "Enquiry submitted successfully!");
} else {
    sendResponse(500, null, "Failed to submit enquiry. Please try again.");
}

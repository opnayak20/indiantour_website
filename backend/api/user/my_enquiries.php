<?php
// backend/api/user/my_enquiries.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(405, null, "Method not allowed");
}

$database = new Database();
$db = $database->getConnection();
$authUser = AuthHelper::requireAuth($db);

// Retrieve user's enquiries by matching user_id or email
$stmt = $db->prepare("
    SELECT id, destination, travelers, date, message, status, notes, created_at 
    FROM enquiries 
    WHERE user_id = ? OR email = ? 
    ORDER BY created_at DESC
");
$stmt->execute([$authUser['id'], $authUser['email']]);
$enquiries = $stmt->fetchAll();

// Retrieve user's bookings if any
$bookingStmt = $db->prepare("
    SELECT id, package_name, travel_date, travelers, total_price, booking_status, payment_status, created_at 
    FROM bookings 
    WHERE user_id = ? 
    ORDER BY created_at DESC
");
$bookingStmt->execute([$authUser['id']]);
$bookings = $bookingStmt->fetchAll();

sendResponse(200, [
    'enquiries' => $enquiries,
    'bookings' => $bookings
], "User activities retrieved.");

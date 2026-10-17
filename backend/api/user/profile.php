<?php
// backend/api/user/profile.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$database = new Database();
$db = $database->getConnection();
$authUser = AuthHelper::requireAuth($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("
        SELECT id, name, email, phone, role, avatar, address, created_at, updated_at 
        FROM users WHERE id = ?
    ");
    $stmt->execute([$authUser['id']]);
    $user = $stmt->fetch();
    sendResponse(200, ['user' => $user]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    
    $name = trim($input['name'] ?? $authUser['name']);
    $phone = trim($input['phone'] ?? $authUser['phone']);
    $address = trim($input['address'] ?? $authUser['address']);
    $avatar = trim($input['avatar'] ?? $authUser['avatar']);
    $newPassword = $input['password'] ?? null;

    if (empty($name)) {
        sendResponse(400, null, "Name cannot be empty.");
    }

    $now = date('Y-m-d H:i:s');
    if (!empty($newPassword)) {
        if (strlen($newPassword) < 6) {
            sendResponse(400, null, "Password must be at least 6 characters.");
        }
        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt = $db->prepare("
            UPDATE users 
            SET name = ?, phone = ?, address = ?, avatar = ?, password = ?, updated_at = ? 
            WHERE id = ?
        ");
        $stmt->execute([$name, $phone, $address, $avatar, $hashed, $now, $authUser['id']]);
    } else {
        $stmt = $db->prepare("
            UPDATE users 
            SET name = ?, phone = ?, address = ?, avatar = ?, updated_at = ? 
            WHERE id = ?
        ");
        $stmt->execute([$name, $phone, $address, $avatar, $now, $authUser['id']]);
    }

    $updatedUserStmt = $db->prepare("SELECT id, name, email, phone, role, avatar, address, created_at FROM users WHERE id = ?");
    $updatedUserStmt->execute([$authUser['id']]);
    $updatedUser = $updatedUserStmt->fetch();

    sendResponse(200, ['user' => $updatedUser], "Profile updated successfully!");
}

sendResponse(405, null, "Method not allowed");

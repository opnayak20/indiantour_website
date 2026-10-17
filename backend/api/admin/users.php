<?php
// backend/api/admin/users.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$database = new Database();
$db = $database->getConnection();
$currentUser = AuthHelper::requireAdmin($db);

// GET all registered users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->query("
        SELECT id, name, email, phone, role, avatar, address, created_at, updated_at 
        FROM users 
        ORDER BY created_at DESC
    ");
    $users = $stmt->fetchAll();
    sendResponse(200, ['users' => $users]);
}

// PUT / POST to update user role
if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    $id = intval($input['id'] ?? 0);
    $role = trim($input['role'] ?? '');

    if (!$id || !in_array($role, ['user', 'admin'], true)) {
        sendResponse(400, null, "Valid user ID and role ('user' or 'admin') are required.");
    }

    // USR-3: Block self-demotion
    if ($role !== 'admin' && $id === intval($currentUser['id'])) {
        sendResponse(400, null, "Security restriction: You cannot demote your own administrator account.");
    }

    // USR-3: Block demoting the last administrator
    if ($role !== 'admin') {
        $countStmt = $db->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin' AND id != ?");
        $countStmt->execute([$id]);
        $remainingAdmins = (int)$countStmt->fetchColumn();
        if ($remainingAdmins < 1) {
            sendResponse(400, null, "Security restriction: Cannot demote the last remaining administrator account.");
        }
    }

    $now = date('Y-m-d H:i:s');
    $stmt = $db->prepare("UPDATE users SET role = ?, updated_at = ? WHERE id = ?");
    $stmt->execute([$role, $now, $id]);

    sendResponse(200, null, "User role updated successfully.");
}

sendResponse(405, null, "Method not allowed");

<?php
// backend/api/auth/me.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(405, null, "Method not allowed");
}

$database = new Database();
$db = $database->getConnection();
$user = AuthHelper::requireAuth($db);

sendResponse(200, ['user' => $user], "User profile retrieved.");

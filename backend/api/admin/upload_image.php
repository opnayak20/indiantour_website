<?php
// backend/api/admin/upload_image.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$database = new Database();
$db = $database->getConnection();
AuthHelper::requireAdmin($db);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, null, "Only POST method allowed");
}

// 1. File Upload (multipart/form-data)
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName = $_FILES['image']['name'];
    $fileSize = $_FILES['image']['size'];
    $maxSize = 5 * 1024 * 1024; // 5MB limit
    if ($fileSize > $maxSize) {
        sendResponse(400, null, "File size exceeds maximum allowed limit of 5MB.");
    }

    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedMimes = [
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png'  => ['png'],
        'image/webp' => ['webp'],
        'image/avif' => ['avif']
    ];

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $detectedMime = $finfo->file($fileTmpPath);

    if (!array_key_exists($detectedMime, $allowedMimes)) {
        sendResponse(400, null, "Invalid image file type. Please upload a valid JPG, PNG, WEBP, or AVIF image.");
    }

    if (!in_array($fileExtension, $allowedMimes[$detectedMime], true)) {
        sendResponse(400, null, "File extension does not match its detected image content type.");
    }
    
    // Create uploads directory in backend/uploads
    $uploadDir = __DIR__ . '/../../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $newFileName = 'pkg_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $fileExtension;
    $destPath = $uploadDir . $newFileName;
    
    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $serverProtocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
        $imageUrl = $serverProtocol . $host . '/uploads/' . $newFileName;
        
        sendResponse(200, [
            'url' => $imageUrl,
            'filename' => $newFileName
        ], "Image uploaded successfully!");
    } else {
        sendResponse(500, null, "Failed to save uploaded image.");
    }
}

// 2. Direct URL Input (Issue #15: Require https:// URL)
$input = getJsonInput();
if (!empty($input['imageUrl'])) {
    $url = trim($input['imageUrl']);
    if (!filter_var($url, FILTER_VALIDATE_URL) || !str_starts_with(strtolower($url), 'https://')) {
        sendResponse(400, null, "Invalid image URL. Only secure HTTPS image URLs are accepted.");
    }
    sendResponse(200, ['url' => $url], "Image URL registered!");
}

sendResponse(400, null, "No image file or URL received.");

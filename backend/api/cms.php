<?php
// backend/api/cms.php - Public endpoint to retrieve CMS configurations
// Supports ?section=header|homepage|footer|pages or returns all sections

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/database.php';

$section = strtolower(trim($_GET['section'] ?? ''));
$dataFile = __DIR__ . '/../data/cms_settings.json';

$allData = [];

// 1. Try reading from database settings table
try {
    $database = new Database();
    $db = $database->getConnection();
    if ($db) {
        $db->exec("
            CREATE TABLE IF NOT EXISTS settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        if (!empty($section)) {
            $stmt = $db->prepare("SELECT setting_value FROM settings WHERE setting_key = ? LIMIT 1");
            $stmt->execute(['cms_' . $section]);
            $row = $stmt->fetch();
            if ($row && !empty($row['setting_value'])) {
                $parsed = json_decode($row['setting_value'], true);
                if (is_array($parsed)) {
                    sendResponse(200, $parsed, "CMS {$section} settings retrieved");
                }
            }
        } else {
            $stmt = $db->prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key LIKE 'cms_%'");
            $stmt->execute();
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $key = str_replace('cms_', '', $row['setting_key']);
                $parsed = json_decode($row['setting_value'], true);
                if (is_array($parsed)) {
                    $allData[$key] = $parsed;
                }
            }
            if (!empty($allData)) {
                sendResponse(200, $allData, "All CMS settings retrieved");
            }
        }
    }
} catch (Exception $e) {
    // Fall back to JSON file
}

// 2. Fall back to JSON file if present
if (file_exists($dataFile)) {
    $content = @file_get_contents($dataFile);
    if ($content) {
        $parsed = json_decode($content, true);
        if (is_array($parsed)) {
            if (!empty($section)) {
                sendResponse(200, $parsed[$section] ?? [], "CMS {$section} settings from file");
            } else {
                sendResponse(200, $parsed, "CMS settings from file");
            }
        }
    }
}

// 3. Fallback empty response
if (!empty($section)) {
    sendResponse(200, [], "CMS section {$section} default");
} else {
    sendResponse(200, [], "CMS settings default");
}

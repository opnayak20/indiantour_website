<?php
// backend/api/admin/cms.php - Admin endpoint to retrieve and persist CMS content
// Supports GET and POST/PUT

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$dataFile = __DIR__ . '/../../data/cms_settings.json';
$dataDir = dirname($dataFile);
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$database = new Database();
$db = $database->getConnection();
AuthHelper::requireAdmin($db);

$method = $_SERVER['REQUEST_METHOD'];

// Helper to ensure settings table exists
function ensureSettingsTable($db) {
    if (!$db) return;
    $db->exec("
        CREATE TABLE IF NOT EXISTS settings (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
}

// GET: Retrieve all or specific section
if ($method === 'GET') {
    $section = strtolower(trim($_GET['section'] ?? ''));
    $result = [];

    try {
        if ($db) {
            ensureSettingsTable($db);
            if (!empty($section)) {
                $stmt = $db->prepare("SELECT setting_value FROM settings WHERE setting_key = ? LIMIT 1");
                $stmt->execute(['cms_' . $section]);
                $row = $stmt->fetch();
                if ($row && !empty($row['setting_value'])) {
                    $parsed = json_decode($row['setting_value'], true);
                    if (is_array($parsed)) {
                        sendResponse(200, $parsed, "CMS section {$section} retrieved");
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
                        $result[$key] = $parsed;
                    }
                }
                if (!empty($result)) {
                    sendResponse(200, $result, "All CMS sections retrieved");
                }
            }
        }
    } catch (Exception $e) {
        // Fall back to file
    }

    if (file_exists($dataFile)) {
        $content = @file_get_contents($dataFile);
        if ($content) {
            $parsed = json_decode($content, true);
            if (is_array($parsed)) {
                if (!empty($section)) {
                    sendResponse(200, $parsed[$section] ?? [], "CMS section {$section} from file");
                }
                sendResponse(200, $parsed, "CMS settings from file");
            }
        }
    }

    sendResponse(200, [], "Default CMS state");
}

// POST / PUT: Save section or all sections
if ($method === 'POST' || $method === 'PUT') {
    $input = getJsonInput();
    if (empty($input)) {
        sendResponse(400, null, "Invalid JSON payload provided");
    }

    $section = strtolower(trim($input['section'] ?? ($_GET['section'] ?? '')));
    $data = $input['data'] ?? $input;

    if (empty($section)) {
        sendResponse(400, null, "Section name is required (e.g. 'footer', 'header', 'homepage', 'pages')");
    }

    // Save to Database
    $dbSaved = false;
    try {
        if ($db) {
            ensureSettingsTable($db);
            $jsonStr = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            $stmt = $db->prepare("
                INSERT INTO settings (setting_key, setting_value, updated_at) 
                VALUES (?, ?, NOW())
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()
            ");
            // If MySQL syntax fails (e.g. SQLite), fallback to REPLACE INTO
            try {
                $stmt->execute(['cms_' . $section, $jsonStr]);
                $dbSaved = true;
            } catch (Exception $sqlex) {
                $rep = $db->prepare("REPLACE INTO settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)");
                $rep->execute(['cms_' . $section, $jsonStr]);
                $dbSaved = true;
            }
        }
    } catch (Exception $e) {
        error_log("CMS Database Save Error: " . $e->getMessage());
    }

    // Also persist to JSON file for high availability
    try {
        $existing = [];
        if (file_exists($dataFile)) {
            $raw = @file_get_contents($dataFile);
            if ($raw) {
                $existing = json_decode($raw, true) ?: [];
            }
        }
        $existing[$section] = $data;
        @file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    } catch (Exception $e) {
        error_log("CMS File Save Error: " . $e->getMessage());
    }

    sendResponse(200, [
        'section' => $section,
        'data' => $data,
        'db_saved' => $dbSaved
    ], "CMS section '{$section}' published and saved successfully!");
}

sendResponse(405, null, "Method not allowed");

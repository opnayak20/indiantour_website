<?php
// backend/api/admin/popup_settings.php - Admin endpoint to read & save Lead Popup configuration

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$defaultSettings = [
    'enabled' => true,
    'triggerOnGroupTrips' => false,
    'triggerOnCreatorTrips' => false,
    'triggerOnPackageClick' => true,
    'delaySeconds' => 20,
    'showFrequency' => 'always',
    'defaultTitle' => 'Meghalaya Tour Package',
    'defaultDuration' => '6 Days 5 Nights',
    'defaultSubtitle' => 'Krem Chympe, Waterfalls & Root Bridges',
    'defaultImage' => '/meghalaya_root_bridge.jpg',
    'badgeText' => 'No Cost EMI options available ↗',
    'badgeAction' => 'open_emi_modal',
    'formHeading' => 'Plan Your Next Trip',
    'buttonText' => 'Connect with Expert',
    'buttonColor' => '#e52b2b',
    'whatsappNumber' => '+919099599331',
    'tripOverrides' => []
];

$dataFile = __DIR__ . '/../../data/popup_settings.json';

$database = new Database();
$db = $database->getConnection();
AuthHelper::requireAdmin($db);

$method = $_SERVER['REQUEST_METHOD'];

// GET: Retrieve current settings
if ($method === 'GET') {
    try {
        if ($db) {
            $db->exec("
                CREATE TABLE IF NOT EXISTS settings (
                    setting_key VARCHAR(100) PRIMARY KEY,
                    setting_value TEXT NOT NULL,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ");
            $stmt = $db->prepare("SELECT setting_value FROM settings WHERE setting_key = 'popup_settings' LIMIT 1");
            $stmt->execute();
            $row = $stmt->fetch();
            if ($row && !empty($row['setting_value'])) {
                $parsed = json_decode($row['setting_value'], true);
                if (is_array($parsed)) {
                    $merged = array_merge($defaultSettings, $parsed);
                    sendResponse(200, $merged, "Popup settings retrieved successfully");
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
                $merged = array_merge($defaultSettings, $parsed);
                sendResponse(200, $merged, "Popup settings retrieved from backup file");
            }
        }
    }

    sendResponse(200, $defaultSettings, "Default settings loaded");
}

// POST or PUT: Save updated settings
if ($method === 'POST' || $method === 'PUT') {
    $input = getJsonInput();
    if (!is_array($input)) {
        sendResponse(400, null, "Invalid request payload");
    }

    $cleanSettings = [
        'enabled' => isset($input['enabled']) ? (bool)$input['enabled'] : true,
        'triggerOnGroupTrips' => isset($input['triggerOnGroupTrips']) ? (bool)$input['triggerOnGroupTrips'] : false,
        'triggerOnCreatorTrips' => isset($input['triggerOnCreatorTrips']) ? (bool)$input['triggerOnCreatorTrips'] : false,
        'triggerOnPackageClick' => isset($input['triggerOnPackageClick']) ? (bool)$input['triggerOnPackageClick'] : true,
        'delaySeconds' => isset($input['delaySeconds']) ? floatval($input['delaySeconds']) : 20.0,
        'showFrequency' => !empty($input['showFrequency']) ? trim($input['showFrequency']) : 'session',
        'defaultTitle' => !empty($input['defaultTitle']) ? trim($input['defaultTitle']) : 'Meghalaya Tour Package',
        'defaultDuration' => !empty($input['defaultDuration']) ? trim($input['defaultDuration']) : '6 Days 5 Nights',
        'defaultSubtitle' => !empty($input['defaultSubtitle']) ? trim($input['defaultSubtitle']) : 'Krem Chympe, Waterfalls & Root Bridges',
        'defaultImage' => !empty($input['defaultImage']) ? trim($input['defaultImage']) : '/meghalaya_root_bridge.jpg',
        'badgeText' => !empty($input['badgeText']) ? trim($input['badgeText']) : 'No Cost EMI options available ↗',
        'badgeAction' => !empty($input['badgeAction']) ? trim($input['badgeAction']) : 'open_emi_modal',
        'formHeading' => !empty($input['formHeading']) ? trim($input['formHeading']) : 'Plan Your Next Trip',
        'buttonText' => !empty($input['buttonText']) ? trim($input['buttonText']) : 'Connect with Expert',
        'buttonColor' => !empty($input['buttonColor']) ? trim($input['buttonColor']) : '#e52b2b',
        'whatsappNumber' => !empty($input['whatsappNumber']) ? trim($input['whatsappNumber']) : '+919099599331',
        'tripOverrides' => (isset($input['tripOverrides']) && is_array($input['tripOverrides'])) ? $input['tripOverrides'] : []
    ];

    $jsonString = json_encode($cleanSettings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    // Save to database
    $dbSaved = false;
    try {
        if ($db) {
            $db->exec("
                CREATE TABLE IF NOT EXISTS settings (
                    setting_key VARCHAR(100) PRIMARY KEY,
                    setting_value TEXT NOT NULL,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ");

            // SQLite / MySQL UPSERT or REPLACE
            $driver = $db->getAttribute(PDO::ATTR_DRIVER_NAME);
            if ($driver === 'sqlite') {
                $stmt = $db->prepare("
                    INSERT INTO settings (setting_key, setting_value, updated_at)
                    VALUES ('popup_settings', ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(setting_key) DO UPDATE SET
                        setting_value = excluded.setting_value,
                        updated_at = CURRENT_TIMESTAMP
                ");
            } else {
                $stmt = $db->prepare("
                    INSERT INTO settings (setting_key, setting_value, updated_at)
                    VALUES ('popup_settings', ?, NOW())
                    ON DUPLICATE KEY UPDATE
                        setting_value = VALUES(setting_value),
                        updated_at = NOW()
                ");
            }
            $dbSaved = $stmt->execute([$jsonString]);
        }
    } catch (Exception $e) {
        $dbSaved = false;
    }

    // Always also persist to backup JSON file in backend/data
    $dataDir = dirname($dataFile);
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }
    @file_put_contents($dataFile, $jsonString);

    sendResponse(200, $cleanSettings, "Popup configuration saved successfully!");
}

sendResponse(405, null, "Method not allowed");

<?php
// backend/api/popup_settings.php - Public endpoint to retrieve Lead Popup configuration

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/database.php';

$defaultSettings = [
    'enabled' => true,
    'triggerOnGroupTrips' => false,
    'triggerOnCreatorTrips' => false,
    'triggerOnPackageClick' => true,
    'delaySeconds' => 10,
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

$dataFile = __DIR__ . '/../data/popup_settings.json';

// Try reading from database settings table first
try {
    $database = new Database();
    $db = $database->getConnection();
    if ($db) {
        // Ensure settings table exists
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
                sendResponse(200, $merged, "Popup settings loaded");
            }
        }
    }
} catch (Exception $e) {
    // Fall back to JSON file or defaults
}

// Fallback to JSON file if present
if (file_exists($dataFile)) {
    $content = @file_get_contents($dataFile);
    if ($content) {
        $parsed = json_decode($content, true);
        if (is_array($parsed)) {
            $merged = array_merge($defaultSettings, $parsed);
            sendResponse(200, $merged, "Popup settings loaded from file");
        }
    }
}

// Return defaults
sendResponse(200, $defaultSettings, "Default popup settings loaded");

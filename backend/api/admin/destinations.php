<?php
// backend/api/admin/destinations.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Ensure destinations table exists with base columns
$createTableQuery = "
    CREATE TABLE IF NOT EXISTS destinations (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'domestic' or 'international'
        region VARCHAR(100),
        count VARCHAR(100),
        tag VARCHAR(150),
        badge VARCHAR(100),
        image TEXT,
        description TEXT,
        price VARCHAR(100) DEFAULT '₹14,999',
        priceOriginal VARCHAR(100) DEFAULT '₹18,500',
        basePriceNum INT DEFAULT 14999,
        duration VARCHAR(100) DEFAULT '5 Days / 4 Nights',
        altitude VARCHAR(100) DEFAULT 'Scenic Region',
        rating DECIMAL(3,2) DEFAULT 4.92,
        reviewsCount INT DEFAULT 88,
        overview TEXT,
        quickInfo TEXT,
        accommodationData TEXT,
        activities TEXT,
        itinerary TEXT,
        inclusions TEXT,
        exclusions TEXT,
        faqs TEXT,
        reviews TEXT,
        highlights TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
";
$db->exec($createTableQuery);

// Helper function to safely add missing columns to SQLite / MySQL table
function ensureDestinationColumnsExist($db) {
    $columnsToAdd = [
        'price' => 'VARCHAR(100) DEFAULT "₹14,999"',
        'priceOriginal' => 'VARCHAR(100) DEFAULT "₹18,500"',
        'basePriceNum' => 'INT DEFAULT 14999',
        'duration' => 'VARCHAR(100) DEFAULT "5 Days / 4 Nights"',
        'altitude' => 'VARCHAR(100) DEFAULT "Scenic Region"',
        'rating' => 'DECIMAL(3,2) DEFAULT 4.92',
        'reviewsCount' => 'INT DEFAULT 88',
        'overview' => 'TEXT',
        'quickInfo' => 'TEXT',
        'accommodationData' => 'TEXT',
        'activities' => 'TEXT',
        'itinerary' => 'TEXT',
        'inclusions' => 'TEXT',
        'exclusions' => 'TEXT',
        'faqs' => 'TEXT',
        'reviews' => 'TEXT',
        'highlights' => 'TEXT'
    ];
    foreach ($columnsToAdd as $col => $definition) {
        try {
            $db->exec("ALTER TABLE destinations ADD COLUMN {$col} {$definition}");
        } catch (Exception $e) {
            // Column already exists, ignore
        }
    }
}
ensureDestinationColumnsExist($db);

// Format output destination row by decoding JSON fields if strings
function formatDestinationRow($dest) {
    $jsonFields = ['quickInfo', 'accommodationData', 'activities', 'itinerary', 'inclusions', 'exclusions', 'faqs', 'reviews', 'highlights'];
    foreach ($jsonFields as $field) {
        if (isset($dest[$field]) && is_string($dest[$field]) && !empty($dest[$field])) {
            $decoded = json_decode($dest[$field], true);
            if ($decoded !== null) {
                $dest[$field] = $decoded;
            }
        }
    }
    return $dest;
}

// 1. GET DESTINATIONS
if ($method === 'GET') {
    $id = $_GET['id'] ?? '';
    if (!empty($id)) {
        $stmt = $db->prepare("SELECT * FROM destinations WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $dest = $stmt->fetch();
        if ($dest) {
            sendResponse(200, ['destination' => formatDestinationRow($dest)], "Destination details fetched successfully");
        } else {
            sendResponse(404, null, "Destination not found");
        }
    }

    $type = $_GET['type'] ?? '';
    if (!empty($type)) {
        $stmt = $db->prepare("SELECT * FROM destinations WHERE type = ? ORDER BY id ASC");
        $stmt->execute([$type]);
    } else {
        $stmt = $db->query("SELECT * FROM destinations ORDER BY type ASC, id ASC");
    }
    $rawDestinations = $stmt->fetchAll();
    $destinations = array_map('formatDestinationRow', $rawDestinations);
    sendResponse(200, ['destinations' => $destinations], "Destinations fetched successfully");
}

// Authentication required for modifications
AuthHelper::requireAdmin($db);

// 2. CREATE OR UPDATE DESTINATION
if ($method === 'POST' || $method === 'PUT') {
    $input = getJsonInput();
    
    $id = trim($input['id'] ?? '');
    $name = trim($input['name'] ?? '');
    $type = trim($input['type'] ?? 'domestic'); // 'domestic' or 'international'
    $region = trim($input['region'] ?? 'North');
    $count = trim($input['count'] ?? '10 Trips');
    $tag = trim($input['tag'] ?? 'Custom Itinerary · Enquire');
    $badge = trim($input['badge'] ?? 'Trending');
    $image = trim($input['image'] ?? '');
    $description = trim($input['description'] ?? '');

    // Rich content fields
    $price = trim($input['price'] ?? '₹14,999');
    $priceOriginal = trim($input['priceOriginal'] ?? '₹18,500');
    $basePriceNum = intval($input['basePriceNum'] ?? 14999);
    $duration = trim($input['duration'] ?? '5 Days / 4 Nights');
    $altitude = trim($input['altitude'] ?? ($region . ' Region'));
    $rating = floatval($input['rating'] ?? 4.92);
    $reviewsCount = intval($input['reviewsCount'] ?? 88);
    $overview = trim($input['overview'] ?? $description);

    $encodeField = function($val) {
        if ($val === null) return null;
        if (is_array($val) || is_object($val)) {
            return json_encode($val, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
        return $val;
    };

    $quickInfo = isset($input['quickInfo']) ? $encodeField($input['quickInfo']) : null;
    $accommodationData = isset($input['accommodationData']) ? $encodeField($input['accommodationData']) : null;
    $activities = isset($input['activities']) ? $encodeField($input['activities']) : null;
    $itinerary = isset($input['itinerary']) ? $encodeField($input['itinerary']) : null;
    $inclusions = isset($input['inclusions']) ? $encodeField($input['inclusions']) : null;
    $exclusions = isset($input['exclusions']) ? $encodeField($input['exclusions']) : null;
    $faqs = isset($input['faqs']) ? $encodeField($input['faqs']) : null;
    $reviews = isset($input['reviews']) ? $encodeField($input['reviews']) : null;
    $highlights = isset($input['highlights']) ? $encodeField($input['highlights']) : null;

    if (empty($name)) {
        sendResponse(400, null, "Destination name is required.");
    }

    if (empty($id)) {
        $id = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
    }

    // Sync price and basePriceNum
    $rawBase = $input['basePriceNum'] ?? null;
    $rawPrice = trim($input['price'] ?? '');
    if ($rawBase !== null && is_numeric($rawBase)) {
        $basePriceNum = max(0, intval($rawBase));
        if (empty($rawPrice) || $rawPrice === '₹14,999') {
            $price = '₹' . number_format($basePriceNum);
        } else {
            $price = $rawPrice;
        }
    } else {
        $extractedDigits = preg_replace('/[^0-9]/', '', $rawPrice);
        $basePriceNum = !empty($extractedDigits) ? intval($extractedDigits) : 14999;
        $price = !empty($rawPrice) ? $rawPrice : ('₹' . number_format($basePriceNum));
    }

    $checkStmt = $db->prepare("SELECT id FROM destinations WHERE id = ?");
    $checkStmt->execute([$id]);
    $exists = $checkStmt->fetch();

    $isExplicitUpdate = ($method === 'PUT') || !empty($input['is_update']) || !empty($input['is_edit']);

    // DEST-6: 409 Conflict if ID exists when creating a new destination
    if ($exists && !$isExplicitUpdate) {
        sendResponse(409, ['id' => $id], "A destination with ID '{$id}' already exists. Please edit the existing destination or choose a different name.");
    }

    $now = date('Y-m-d H:i:s');

    if ($exists) {
        $stmt = $db->prepare("
            UPDATE destinations SET 
                name = ?, type = ?, region = ?, count = ?, 
                tag = ?, badge = ?, image = ?, description = ?,
                price = ?, priceOriginal = ?, basePriceNum = ?, duration = ?, altitude = ?,
                rating = ?, reviewsCount = ?, overview = ?,
                quickInfo = ?, accommodationData = ?, activities = ?, itinerary = ?,
                inclusions = ?, exclusions = ?, faqs = ?, reviews = ?, highlights = ?,
                updated_at = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $name, $type, $region, $count, 
            $tag, $badge, $image, $description,
            $price, $priceOriginal, $basePriceNum, $duration, $altitude,
            $rating, $reviewsCount, $overview,
            $quickInfo, $accommodationData, $activities, $itinerary,
            $inclusions, $exclusions, $faqs, $reviews, $highlights,
            $now, $id
        ]);
        sendResponse(200, ['id' => $id], "Destination updated successfully!");
    } else {
        $stmt = $db->prepare("
            INSERT INTO destinations (
                id, name, type, region, count, tag, badge, image, description,
                price, priceOriginal, basePriceNum, duration, altitude,
                rating, reviewsCount, overview,
                quickInfo, accommodationData, activities, itinerary,
                inclusions, exclusions, faqs, reviews, highlights,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id, $name, $type, $region, $count, $tag, $badge, $image, $description,
            $price, $priceOriginal, $basePriceNum, $duration, $altitude,
            $rating, $reviewsCount, $overview,
            $quickInfo, $accommodationData, $activities, $itinerary,
            $inclusions, $exclusions, $faqs, $reviews, $highlights,
            $now, $now
        ]);
        sendResponse(201, ['id' => $id], "Destination created successfully!");
    }
}

// 3. DELETE DESTINATION
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        $input = getJsonInput();
        $id = $input['id'] ?? '';
    }
    
    if (empty($id)) {
        sendResponse(400, null, "Destination ID required.");
    }

    $stmt = $db->prepare("DELETE FROM destinations WHERE id = ?");
    $stmt->execute([$id]);
    sendResponse(200, null, "Destination deleted successfully.");
}

sendResponse(405, null, "Method not allowed");

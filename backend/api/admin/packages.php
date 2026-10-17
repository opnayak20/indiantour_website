<?php
// backend/api/admin/packages.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Ensure packages table exists with all rich details columns
$createTableQuery = "
    CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        badge VARCHAR(100),
        duration VARCHAR(100),
        altitude VARCHAR(100),
        difficulty VARCHAR(100),
        location VARCHAR(200),
        price VARCHAR(100),
        priceOriginal VARCHAR(100),
        basePriceNum INT DEFAULT 0,
        pricePerPerson VARCHAR(100),
        season VARCHAR(100),
        rating DECIMAL(3,2) DEFAULT 4.9,
        reviewsCount INT DEFAULT 120,
        image TEXT,
        gallery TEXT,
        overview TEXT,
        featured TINYINT(1) DEFAULT 0,
        quickInfo TEXT,
        accommodationData TEXT,
        activities TEXT,
        itinerary TEXT,
        inclusions TEXT,
        exclusions TEXT,
        faqs TEXT,
        reviews TEXT,
        highlights TEXT,
        batches TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
";
$db->exec($createTableQuery);

// Helper function to safely add missing columns to SQLite / MySQL table
function ensureColumnsExist($db) {
    $columnsToAdd = [
        'rating' => 'DECIMAL(3,2) DEFAULT 4.9',
        'reviewsCount' => 'INT DEFAULT 120',
        'gallery' => 'TEXT',
        'quickInfo' => 'TEXT',
        'accommodationData' => 'TEXT',
        'activities' => 'TEXT',
        'itinerary' => 'TEXT',
        'inclusions' => 'TEXT',
        'exclusions' => 'TEXT',
        'faqs' => 'TEXT',
        'reviews' => 'TEXT',
        'highlights' => 'TEXT',
        'batches' => 'TEXT'
    ];
    foreach ($columnsToAdd as $col => $definition) {
        try {
            $db->exec("ALTER TABLE packages ADD COLUMN {$col} {$definition}");
        } catch (Exception $e) {
            // Column already exists, ignore
        }
    }
}
ensureColumnsExist($db);

// Format output package by decoding JSON fields if they are strings
function formatPackageRow($pkg) {
    $jsonFields = ['gallery', 'quickInfo', 'accommodationData', 'activities', 'itinerary', 'inclusions', 'exclusions', 'faqs', 'reviews', 'highlights', 'batches'];
    foreach ($jsonFields as $field) {
        if (isset($pkg[$field]) && is_string($pkg[$field]) && !empty($pkg[$field])) {
            $decoded = json_decode($pkg[$field], true);
            if ($decoded !== null) {
                $pkg[$field] = $decoded;
            }
        }
    }
    return $pkg;
}

// 1. GET ALL PACKAGES (Public or Admin view)
if ($method === 'GET') {
    $id = $_GET['id'] ?? '';
    if (!empty($id)) {
        $stmt = $db->prepare("SELECT * FROM packages WHERE id = ? OR slug = ? LIMIT 1");
        $stmt->execute([$id, $id]);
        $pkg = $stmt->fetch();
        if ($pkg) {
            sendResponse(200, ['package' => formatPackageRow($pkg)], "Package details fetched");
        } else {
            sendResponse(404, null, "Package not found");
        }
    }

    $stmt = $db->query("SELECT * FROM packages ORDER BY updated_at DESC, id ASC");
    $rawPackages = $stmt->fetchAll();
    $packages = array_map('formatPackageRow', $rawPackages);
    sendResponse(200, ['packages' => $packages], "Packages fetched successfully");
}

// Authentication required for modifications
AuthHelper::requireAdmin($db);

// 2. CREATE OR UPDATE PACKAGE
if ($method === 'POST' || $method === 'PUT') {
    $input = getJsonInput();
    
    $id = trim($input['id'] ?? '');
    if (empty($id)) {
        $id = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', trim($input['title'] ?? 'pkg-' . time())));
    }
    
    $title = trim($input['title'] ?? '');
    $category = trim($input['category'] ?? 'Himalayan Trek');
    $badge = trim($input['badge'] ?? 'Trending');
    $duration = trim($input['duration'] ?? '5 Days / 4 Nights');
    $altitude = trim($input['altitude'] ?? '12,000 ft');
    $difficulty = trim($input['difficulty'] ?? 'Moderate');
    $location = trim($input['location'] ?? 'Uttarakhand / Himachal');
    // PKG-10: Keep price and basePriceNum in sync
    $rawBase = $input['basePriceNum'] ?? null;
    $rawPrice = trim($input['price'] ?? '');

    if ($rawBase !== null && is_numeric($rawBase)) {
        $basePriceNum = max(0, intval($rawBase));
        if (empty($rawPrice) || $rawPrice === '₹9,999') {
            $price = '₹' . number_format($basePriceNum);
        } else {
            $price = $rawPrice;
        }
    } else {
        $extractedDigits = preg_replace('/[^0-9]/', '', $rawPrice);
        $basePriceNum = !empty($extractedDigits) ? intval($extractedDigits) : 9999;
        $price = !empty($rawPrice) ? $rawPrice : ('₹' . number_format($basePriceNum));
    }

    $priceOriginal = trim($input['priceOriginal'] ?? ('₹' . number_format(round($basePriceNum * 1.3))));
    $pricePerPerson = trim($input['pricePerPerson'] ?? ($price . '/person'));
    $season = trim($input['season'] ?? 'May - Oct');
    $rating = max(0.0, min(5.0, floatval($input['rating'] ?? 4.9)));
    $reviewsCount = max(0, intval($input['reviewsCount'] ?? 120));
    $image = trim($input['image'] ?? '');
    $overview = trim($input['overview'] ?? '');
    $featured = !empty($input['featured']) ? 1 : 0;

    // Helper to serialize array/object/string into valid JSON string
    $encodeField = function($val) {
        if ($val === null) return null;
        if (is_string($val)) {
            json_decode($val);
            if (json_last_error() === JSON_ERROR_NONE) return $val;
            return json_encode($val);
        }
        return json_encode($val);
    };

    $gallery = isset($input['gallery']) ? $encodeField($input['gallery']) : null;
    $quickInfo = isset($input['quickInfo']) ? $encodeField($input['quickInfo']) : null;
    $accommodationData = isset($input['accommodationData']) ? $encodeField($input['accommodationData']) : null;
    $activities = isset($input['activities']) ? $encodeField($input['activities']) : null;
    $itinerary = isset($input['itinerary']) ? $encodeField($input['itinerary']) : null;
    $inclusions = isset($input['inclusions']) ? $encodeField($input['inclusions']) : null;
    $exclusions = isset($input['exclusions']) ? $encodeField($input['exclusions']) : null;
    $faqs = isset($input['faqs']) ? $encodeField($input['faqs']) : null;
    $reviews = isset($input['reviews']) ? $encodeField($input['reviews']) : null;
    $highlights = isset($input['highlights']) ? $encodeField($input['highlights']) : null;
    $batches = isset($input['batches']) ? $encodeField($input['batches']) : null;

    if (empty($title)) {
        sendResponse(400, null, "Package title is required.");
    }

    // Check if exists
    $checkStmt = $db->prepare("SELECT id FROM packages WHERE id = ?");
    $checkStmt->execute([$id]);
    $exists = $checkStmt->fetch();

    $isExplicitUpdate = ($method === 'PUT') || !empty($input['is_update']) || !empty($input['is_edit']);

    // PKG-9: 409 Conflict if ID exists when creating a new package
    if ($exists && !$isExplicitUpdate) {
        sendResponse(409, ['id' => $id], "A package with ID '{$id}' already exists. Please edit the existing package or choose a different title.");
    }

    $now = date('Y-m-d H:i:s');

    if ($exists) {
        $stmt = $db->prepare("
            UPDATE packages SET 
                title = ?, category = ?, badge = ?, duration = ?, altitude = ?, 
                difficulty = ?, location = ?, price = ?, priceOriginal = ?, 
                basePriceNum = ?, pricePerPerson = ?, season = ?, rating = ?, reviewsCount = ?,
                image = ?, gallery = ?, overview = ?, featured = ?, 
                quickInfo = ?, accommodationData = ?, activities = ?, itinerary = ?, 
                inclusions = ?, exclusions = ?, faqs = ?, reviews = ?, highlights = ?, batches = ?,
                updated_at = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $title, $category, $badge, $duration, $altitude, 
            $difficulty, $location, $price, $priceOriginal, 
            $basePriceNum, $pricePerPerson, $season, $rating, $reviewsCount,
            $image, $gallery, $overview, $featured,
            $quickInfo, $accommodationData, $activities, $itinerary,
            $inclusions, $exclusions, $faqs, $reviews, $highlights, $batches,
            $now, $id
        ]);
        sendResponse(200, ['id' => $id], "Package updated successfully!");
    } else {
        $stmt = $db->prepare("
            INSERT INTO packages (
                id, slug, title, category, badge, duration, altitude, 
                difficulty, location, price, priceOriginal, basePriceNum, 
                pricePerPerson, season, rating, reviewsCount, image, gallery, 
                overview, featured, quickInfo, accommodationData, activities, 
                itinerary, inclusions, exclusions, faqs, reviews, highlights, batches,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id, $id, $title, $category, $badge, $duration, $altitude, 
            $difficulty, $location, $price, $priceOriginal, $basePriceNum, 
            $pricePerPerson, $season, $rating, $reviewsCount, $image, $gallery, 
            $overview, $featured, $quickInfo, $accommodationData, $activities, 
            $itinerary, $inclusions, $exclusions, $faqs, $reviews, $highlights, $batches,
            $now, $now
        ]);
        sendResponse(201, ['id' => $id], "Package created successfully!");
    }
}

// 3. DELETE PACKAGE
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        $input = getJsonInput();
        $id = $input['id'] ?? '';
    }
    
    if (empty($id)) {
        sendResponse(400, null, "Package ID is required for deletion.");
    }

    $stmt = $db->prepare("DELETE FROM packages WHERE id = ?");
    $stmt->execute([$id]);
    sendResponse(200, null, "Package deleted successfully.");
}

sendResponse(405, null, "Method not allowed");

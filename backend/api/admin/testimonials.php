<?php
// backend/api/admin/testimonials.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$database = new Database();
$db = $database->getConnection();

// Ensure testimonials table exists
$createTableQuery = "
    CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        from_location VARCHAR(255),
        trip VARCHAR(255),
        rating INT DEFAULT 5,
        avatar VARCHAR(50),
        quote TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
";
$db->exec($createTableQuery);

// Seed default testimonials if table is empty
$count = $db->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
if ($count == 0) {
    $defaults = [
        [
            'id' => 'testi-1',
            'name' => 'Rajesh & Meena Patel',
            'from_location' => 'Ahmedabad, Gujarat',
            'trip' => 'Kedarnath Yatra Batch 2025',
            'rating' => 5,
            'avatar' => 'RP',
            'quote' => 'Travelling with Adventure Nature Club for Kedarnath was the best decision for our family! The team took exceptional care of my elderly parents during the 16 km climb. Oxygen support, warm meals, and comfortable lodge stay made it a divine experience!',
            'is_active' => 1
        ],
        [
            'id' => 'testi-2',
            'name' => 'Ananya Sharma',
            'from_location' => 'Mumbai, Maharashtra',
            'trip' => 'Kashmir Great Lakes Trek',
            'rating' => 5,
            'avatar' => 'AS',
            'quote' => 'As a solo female traveler, safety and group comfort were my top priorities. ANC guides were professional, encouraging, and extremely knowledgeable about mountain trails. The campsites at Vishansar lake were magical!',
            'is_active' => 1
        ],
        [
            'id' => 'testi-3',
            'name' => 'Dr. Harshil Shah',
            'from_location' => 'Vadodara, Gujarat',
            'trip' => 'Leh-Ladakh Overland Expedition',
            'rating' => 5,
            'avatar' => 'HS',
            'quote' => 'Flawless execution from booking to the final flight out of Leh. The vehicle condition was top notch, hotel stays were cozy, and acclimatization days were planned scientifically. 10/10 recommendation!',
            'is_active' => 1
        ]
    ];
    $ins = $db->prepare("
        INSERT INTO testimonials (id, name, from_location, trip, rating, avatar, quote, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    foreach ($defaults as $d) {
        $ins->execute([$d['id'], $d['name'], $d['from_location'], $d['trip'], $d['rating'], $d['avatar'], $d['quote'], $d['is_active']]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET TESTIMONIALS (Public or Admin)
if ($method === 'GET') {
    $adminView = isset($_GET['admin']) && $_GET['admin'] === '1';
    
    if ($adminView) {
        AuthHelper::requireAdmin($db);
        $stmt = $db->query("SELECT * FROM testimonials ORDER BY created_at DESC, id ASC");
    } else {
        $stmt = $db->query("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC, id ASC");
    }
    
    $testimonials = $stmt->fetchAll();
    
    // Map from_location to from for frontend compatibility
    $formatted = array_map(function($t) {
        $t['from'] = $t['from_location'];
        return $t;
    }, $testimonials);

    sendResponse(200, ['testimonials' => $formatted], "Testimonials fetched successfully");
}

// Below routes require admin authentication
AuthHelper::requireAdmin($db);

// 2. CREATE OR UPDATE TESTIMONIAL
if ($method === 'POST' || $method === 'PUT') {
    $input = getJsonInput();
    
    $id = trim($input['id'] ?? '');
    if (empty($id)) {
        $id = 'testi-' . time();
    }
    
    $name = trim($input['name'] ?? '');
    $from = trim($input['from'] ?? $input['from_location'] ?? 'India');
    $trip = trim($input['trip'] ?? 'Himalayan Expedition');
    // TEST-6: Validate rating 1-5
    $rating = max(1, min(5, intval($input['rating'] ?? 5)));
    $avatar = trim($input['avatar'] ?? '');
    if (empty($avatar) && !empty($name)) {
        $parts = explode(' ', $name);
        $avatar = strtoupper(substr($parts[0], 0, 1) . (isset($parts[1]) ? substr($parts[1], 0, 1) : ''));
    }
    $quote = trim($input['quote'] ?? '');
    $isActive = isset($input['is_active']) ? intval($input['is_active']) : 1;

    if (empty($name) || empty($quote)) {
        sendResponse(400, null, "Name and Review quote are required.");
    }

    // Check if exists
    $check = $db->prepare("SELECT id FROM testimonials WHERE id = ?");
    $check->execute([$id]);
    $exists = $check->fetch();

    $now = date('Y-m-d H:i:s');

    if ($exists) {
        $stmt = $db->prepare("
            UPDATE testimonials 
            SET name = ?, from_location = ?, trip = ?, rating = ?, avatar = ?, quote = ?, is_active = ?, updated_at = ? 
            WHERE id = ?
        ");
        $stmt->execute([$name, $from, $trip, $rating, $avatar, $quote, $isActive, $now, $id]);
        sendResponse(200, ['id' => $id], "Testimonial updated successfully");
    } else {
        $stmt = $db->prepare("
            INSERT INTO testimonials (id, name, from_location, trip, rating, avatar, quote, is_active, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $name, $from, $trip, $rating, $avatar, $quote, $isActive, $now, $now]);
        sendResponse(201, ['id' => $id], "Testimonial created successfully");
    }
}

// 3. DELETE TESTIMONIAL
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        sendResponse(400, null, "Testimonial ID is required for deletion.");
    }

    $stmt = $db->prepare("DELETE FROM testimonials WHERE id = ?");
    $stmt->execute([$id]);

    sendResponse(200, null, "Testimonial deleted successfully");
}

sendResponse(405, null, "Method not allowed");

<?php
// backend/api/admin/stats.php

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(405, null, "Method not allowed");
}

$database = new Database();
$db = $database->getConnection();
AuthHelper::requireAdmin($db);

// Total stats queries
$userCount = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
$enquiryCount = $db->query("SELECT COUNT(*) FROM enquiries")->fetchColumn();
$newEnquiryCount = $db->query("SELECT COUNT(*) FROM enquiries WHERE status = 'new'")->fetchColumn();
$bookingCount = $db->query("SELECT COUNT(*) FROM bookings")->fetchColumn();

// DASH-5: Content counts
$packageCount = 0;
$destCount = 0;
$testimonialCount = 0;
try { $packageCount = (int)$db->query("SELECT COUNT(*) FROM packages")->fetchColumn(); } catch (Exception $e) {}
try { $destCount = (int)$db->query("SELECT COUNT(*) FROM destinations")->fetchColumn(); } catch (Exception $e) {}
try { $testimonialCount = (int)$db->query("SELECT COUNT(*) FROM testimonials")->fetchColumn(); } catch (Exception $e) {}

// Recent 6 enquiries (DASH-2)
$recentEnquiries = $db->query("
    SELECT id, name, email, phone, destination, travelers, date, status, created_at 
    FROM enquiries 
    ORDER BY created_at DESC 
    LIMIT 6
")->fetchAll();

sendResponse(200, [
    'stats' => [
        'total_users' => (int)$userCount,
        'total_enquiries' => (int)$enquiryCount,
        'new_enquiries' => (int)$newEnquiryCount,
        'total_bookings' => (int)$bookingCount,
        'total_packages' => $packageCount,
        'total_destinations' => $destCount,
        'total_testimonials' => $testimonialCount,
    ],
    'recent_enquiries' => $recentEnquiries
], "Admin statistics loaded.");

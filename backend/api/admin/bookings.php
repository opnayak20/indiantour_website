<?php
// backend/api/admin/bookings.php
// Admin Bookings API: List, Filter, Status Update, Conversion from Enquiry (BKG-1, BKG-2, BKG-3)

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$database = new Database();
$db = $database->getConnection();
AuthHelper::requireAdmin($db);

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET Bookings (with optional filters: status, payment, search)
if ($method === 'GET') {
    $bookingStatus = trim($_GET['booking_status'] ?? '');
    $paymentStatus = trim($_GET['payment_status'] ?? '');
    $search = trim($_GET['search'] ?? '');

    $query = "
        SELECT 
            b.id,
            b.user_id,
            b.package_name,
            b.travel_date,
            b.travelers,
            b.total_price,
            b.booking_status,
            b.payment_status,
            b.special_requests,
            b.created_at,
            u.name AS user_name,
            u.email AS user_email,
            u.phone AS user_phone
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE 1=1
    ";

    $params = [];

    if (!empty($bookingStatus) && $bookingStatus !== 'all') {
        $query .= " AND b.booking_status = ?";
        $params[] = $bookingStatus;
    }

    if (!empty($paymentStatus) && $paymentStatus !== 'all') {
        $query .= " AND b.payment_status = ?";
        $params[] = $paymentStatus;
    }

    if (!empty($search)) {
        $query .= " AND (b.package_name LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)";
        $wildcard = "%{$search}%";
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
    }

    $query .= " ORDER BY b.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $bookings = $stmt->fetchAll();

    sendResponse(200, [
        'bookings' => $bookings,
        'total' => count($bookings)
    ], "Bookings retrieved successfully.");
}

// 2. CREATE or CONVERT or UPDATE Booking
if ($method === 'POST' || $method === 'PUT') {
    $input = getJsonInput();
    $action = $input['action'] ?? '';

    // A. Convert enquiry into a booking (BKG-3)
    if ($action === 'convert_enquiry' || !empty($input['enquiry_id'])) {
        $enquiryId = intval($input['enquiry_id'] ?? 0);
        if (!$enquiryId) {
            sendResponse(400, null, "Valid enquiry ID is required for booking conversion.");
        }

        $enqStmt = $db->prepare("SELECT * FROM enquiries WHERE id = ?");
        $enqStmt->execute([$enquiryId]);
        $enquiry = $enqStmt->fetch();

        if (!$enquiry) {
            sendResponse(404, null, "Enquiry #{$enquiryId} not found.");
        }

        // Find or assign user_id
        $userId = intval($enquiry['user_id'] ?? 0);
        if (!$userId && !empty($enquiry['email'])) {
            $userLookup = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
            $userLookup->execute([$enquiry['email']]);
            $existingUser = $userLookup->fetch();
            if ($existingUser) {
                $userId = intval($existingUser['id']);
            } else {
                // Provision a client profile for the lead
                $randomPass = password_hash(bin2hex(random_bytes(8)), PASSWORD_BCRYPT);
                $createUserStmt = $db->prepare("
                    INSERT INTO users (name, email, password, phone, role, is_verified, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, 'user', 1, ?, ?)
                ");
                $now = date('Y-m-d H:i:s');
                $createUserStmt->execute([
                    $enquiry['name'] ?: 'Customer Lead',
                    $enquiry['email'],
                    $randomPass,
                    $enquiry['phone'] ?: null,
                    $now,
                    $now
                ]);
                $userId = intval($db->lastInsertId());
            }
        }

        $packageName = trim($input['package_name'] ?? $enquiry['destination'] ?: 'Custom Tour');
        $travelDate = !empty($input['travel_date']) ? $input['travel_date'] : ($enquiry['date'] ?: date('Y-m-d', strtotime('+7 days')));
        $travelers = intval($input['travelers'] ?? ($enquiry['travelers'] ?: 1));
        $totalPrice = floatval($input['total_price'] ?? 0.00);
        $bookingStatus = in_array($input['booking_status'] ?? '', ['pending', 'confirmed', 'completed', 'cancelled'])
            ? $input['booking_status']
            : 'confirmed';
        $paymentStatus = in_array($input['payment_status'] ?? '', ['unpaid', 'paid', 'refunded'])
            ? $input['payment_status']
            : 'unpaid';
        $specialRequests = trim($input['special_requests'] ?? ($enquiry['message'] ?? ''));

        $insertBookingStmt = $db->prepare("
            INSERT INTO bookings (
                user_id, package_name, travel_date, travelers, total_price, 
                booking_status, payment_status, special_requests, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $now = date('Y-m-d H:i:s');
        $insertBookingStmt->execute([
            $userId,
            $packageName,
            $travelDate,
            $travelers,
            $totalPrice,
            $bookingStatus,
            $paymentStatus,
            $specialRequests,
            $now
        ]);
        $bookingId = $db->lastInsertId();

        // Update enquiry to 'converted'
        $updateNote = ($enquiry['notes'] ? $enquiry['notes'] . " | " : "") . "[Converted to Booking #{$bookingId} on {$now}]";
        $updateEnqStmt = $db->prepare("UPDATE enquiries SET status = 'converted', notes = ?, updated_at = ? WHERE id = ?");
        $updateEnqStmt->execute([$updateNote, $now, $enquiryId]);

        sendResponse(201, [
            'booking_id' => $bookingId,
            'enquiry_id' => $enquiryId
        ], "Enquiry successfully converted to Booking #{$bookingId}.");
    }

    // B. Create a direct new booking
    if ($action === 'create' || empty($input['id'])) {
        $userId = intval($input['user_id'] ?? 0);
        $packageName = trim($input['package_name'] ?? '');
        $travelDate = trim($input['travel_date'] ?? date('Y-m-d'));
        $travelers = intval($input['travelers'] ?? 1);
        $totalPrice = floatval($input['total_price'] ?? 0.00);
        $bookingStatus = in_array($input['booking_status'] ?? '', ['pending', 'confirmed', 'completed', 'cancelled']) ? $input['booking_status'] : 'pending';
        $paymentStatus = in_array($input['payment_status'] ?? '', ['unpaid', 'paid', 'refunded']) ? $input['payment_status'] : 'unpaid';
        $specialRequests = trim($input['special_requests'] ?? '');

        if (!$userId || empty($packageName)) {
            sendResponse(400, null, "User ID and Package Name are required to create a booking.");
        }

        $now = date('Y-m-d H:i:s');
        $stmt = $db->prepare("
            INSERT INTO bookings (
                user_id, package_name, travel_date, travelers, total_price,
                booking_status, payment_status, special_requests, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $userId, $packageName, $travelDate, $travelers, $totalPrice,
            $bookingStatus, $paymentStatus, $specialRequests, $now
        ]);
        $id = $db->lastInsertId();

        sendResponse(201, ['id' => $id], "Booking created successfully.");
    }

    // C. Update existing booking (BKG-2)
    $id = intval($input['id'] ?? 0);
    if (!$id) {
        sendResponse(400, null, "Valid booking ID is required for update.");
    }

    $existingStmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
    $existingStmt->execute([$id]);
    $existing = $existingStmt->fetch();
    if (!$existing) {
        sendResponse(404, null, "Booking #{$id} not found.");
    }

    $bookingStatus = in_array($input['booking_status'] ?? '', ['pending', 'confirmed', 'completed', 'cancelled'])
        ? $input['booking_status']
        : $existing['booking_status'];
    $paymentStatus = in_array($input['payment_status'] ?? '', ['unpaid', 'paid', 'refunded'])
        ? $input['payment_status']
        : $existing['payment_status'];
    $travelDate = !empty($input['travel_date']) ? $input['travel_date'] : $existing['travel_date'];
    $travelers = isset($input['travelers']) ? intval($input['travelers']) : intval($existing['travelers']);
    $totalPrice = isset($input['total_price']) ? floatval($input['total_price']) : floatval($existing['total_price']);
    $specialRequests = isset($input['special_requests']) ? trim($input['special_requests']) : $existing['special_requests'];

    $updateStmt = $db->prepare("
        UPDATE bookings SET
            booking_status = ?,
            payment_status = ?,
            travel_date = ?,
            travelers = ?,
            total_price = ?,
            special_requests = ?
        WHERE id = ?
    ");
    $updateStmt->execute([$bookingStatus, $paymentStatus, $travelDate, $travelers, $totalPrice, $specialRequests, $id]);

    sendResponse(200, ['id' => $id], "Booking #{$id} updated successfully.");
}

// 3. DELETE Booking
if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) {
        $input = getJsonInput();
        $id = intval($input['id'] ?? 0);
    }

    if (!$id) {
        sendResponse(400, null, "Booking ID is required for deletion.");
    }

    $stmt = $db->prepare("DELETE FROM bookings WHERE id = ?");
    $stmt->execute([$id]);

    sendResponse(200, null, "Booking #{$id} removed successfully.");
}

sendResponse(405, null, "Method not allowed");

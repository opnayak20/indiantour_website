<?php
// backend/api/admin/enquiries.php
// Enquiry Management API (ENQ-1 through ENQ-8)

require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$database = new Database();
$db = $database->getConnection();
$currentUser = AuthHelper::requireAdmin($db);

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET enquiries (all, by status, with search)
if ($method === 'GET') {
    $statusFilter = trim($_GET['status'] ?? '');
    $search = trim($_GET['search'] ?? '');
    
    $query = "
        SELECT id, user_id, name, email, phone, destination, travelers, date, message, status, notes, created_at, updated_at 
        FROM enquiries 
        WHERE 1=1
    ";
    $params = [];

    if (!empty($statusFilter) && $statusFilter !== 'all') {
        $query .= " AND status = ?";
        $params[] = $statusFilter;
    }

    if (!empty($search)) {
        $query .= " AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR destination LIKE ?)";
        $wildcard = "%{$search}%";
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $enquiries = $stmt->fetchAll();

    sendResponse(200, [
        'enquiries' => $enquiries,
        'total' => count($enquiries)
    ]);
}

// 2. PUT / POST to update status or notes
if ($method === 'PUT' || $method === 'POST') {
    $input = getJsonInput();
    $id = intval($input['id'] ?? 0);
    $status = trim($input['status'] ?? '');
    $notes = trim($input['notes'] ?? '');
    $appendNote = trim($input['append_note'] ?? '');

    if (!$id || empty($status)) {
        sendResponse(400, null, "Enquiry ID and Status are required.");
    }

    $validStatuses = ['new', 'contacted', 'in_progress', 'converted', 'closed'];
    if (!in_array($status, $validStatuses, true)) {
        sendResponse(400, null, "Invalid status provided. Allowed values: " . implode(', ', $validStatuses));
    }

    // Fetch existing enquiry
    $stmt = $db->prepare("SELECT notes FROM enquiries WHERE id = ?");
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) {
        sendResponse(404, null, "Enquiry #{$id} not found.");
    }

    $now = date('Y-m-d H:i:s');
    $finalNotes = $notes;

    // ENQ-8: If append_note is provided, append with timestamp and admin name
    if (!empty($appendNote)) {
        $adminName = $currentUser['name'] ?? 'Admin';
        $logEntry = "[{$now} - {$adminName}]: {$appendNote}";
        $finalNotes = !empty($existing['notes']) ? ($existing['notes'] . "\n" . $logEntry) : $logEntry;
    }

    $updateStmt = $db->prepare("UPDATE enquiries SET status = ?, notes = ?, updated_at = ? WHERE id = ?");
    $updateStmt->execute([$status, $finalNotes, $now, $id]);

    sendResponse(200, [
        'id' => $id,
        'status' => $status,
        'notes' => $finalNotes
    ], "Enquiry #{$id} updated successfully.");
}

// 3. DELETE Enquiry
if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) {
        $input = getJsonInput();
        $id = intval($input['id'] ?? 0);
    }

    if (!$id) {
        sendResponse(400, null, "Enquiry ID is required for deletion.");
    }

    $stmt = $db->prepare("DELETE FROM enquiries WHERE id = ?");
    $stmt->execute([$id]);

    sendResponse(200, null, "Enquiry #{$id} deleted successfully.");
}

sendResponse(405, null, "Method not allowed");

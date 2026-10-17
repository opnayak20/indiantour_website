<?php
// backend/test_db.php
// CLI diagnostic utility only (blocked from web access)
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["status" => false, "message" => "Access denied: CLI execution only."]);
    exit();
}

require_once __DIR__ . '/config/database.php';

try {
    $db = new Database();
    $conn = $db->getConnection();
    echo "DB Connection SUCCESSFUL!\n";
    $rows = $conn->query("SELECT id, name, email, phone, destination, message, status, created_at FROM enquiries ORDER BY id DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows, JSON_PRETTY_PRINT) . "\n";
} catch (Exception $e) {
    echo "DB Error: " . $e->getMessage() . "\n";
}

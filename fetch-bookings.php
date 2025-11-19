<?php
// Fetch User Bookings
header('Content-Type: application/json');
include 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$status = $_GET['status'] ?? '';

try {
    $query = "SELECT b.id, b.item_id, b.start_date, b.end_date, b.status, b.total_price, b.created_at, i.title, i.price FROM bookings b
              JOIN items i ON b.item_id = i.id
              WHERE b.user_id = ?";
    $params = [$user_id];

    if (!empty($status)) {
        $query .= " AND b.status = ?";
        $params[] = $status;
    }

    $query .= " ORDER BY b.created_at DESC";

    $stmt = $mysqli->prepare($query);
    $stmt->execute($params);
    $bookings = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $bookings[] = $row;
    }

    echo json_encode(['success' => true, 'bookings' => $bookings, 'count' => count($bookings)]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>


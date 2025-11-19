<?php
// Fetch All Transactions (Bookings)
header('Content-Type: application/json');
include 'db.php';

try {
    $status = $_GET['status'] ?? '';

    $query = "SELECT b.id, b.item_id, b.user_id, b.start_date, b.end_date, b.status, b.total_price, b.created_at, 
                     i.title, i.owner_id, u.full_name, u.email
              FROM bookings b
              JOIN items i ON b.item_id = i.id
              JOIN users u ON b.user_id = u.id
              WHERE 1=1";
    $params = [];

    if (!empty($status)) {
        $query .= " AND b.status = ?";
        $params[] = $status;
    }

    $query .= " ORDER BY b.created_at DESC";

    $stmt = $mysqli->prepare($query);
    if (!empty($params)) {
        $stmt->execute($params);
    } else {
        $stmt->execute();
    }

    $transactions = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $transactions[] = $row;
    }

    echo json_encode(['success' => true, 'transactions' => $transactions, 'count' => count($transactions)]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

<?php
// Fetch Support Tickets
header('Content-Type: application/json');
include 'db.php';
session_start();

try {
    $user_id = $_SESSION['user_id'] ?? '';
    $status = $_GET['status'] ?? '';

    $query = "SELECT id, subject, message, status, priority, created_at FROM support_tickets WHERE 1=1";
    $params = [];

    if (!empty($user_id)) {
        $query .= " AND user_id = ?";
        $params[] = $user_id;
    }

    if (!empty($status)) {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $mysqli->prepare($query);
    $stmt->execute($params);
    $tickets = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $tickets[] = $row;
    }

    echo json_encode(['success' => true, 'tickets' => $tickets, 'count' => count($tickets)]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>


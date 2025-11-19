<?php
// Fetch All Users
header('Content-Type: application/json');
include 'db.php';

try {
    $search = $_GET['search'] ?? '';
    $status = $_GET['status'] ?? '';

    $query = "SELECT id, username, email, full_name, phone, status, created_at FROM users WHERE 1=1";
    $params = [];

    if (!empty($search)) {
        $query .= " AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)";
        $search_param = '%' . $search . '%';
        $params = [$search_param, $search_param, $search_param];
    }

    if (!empty($status)) {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $mysqli->prepare($query);
    if (!empty($params)) {
        $stmt->execute($params);
    } else {
        $stmt->execute();
    }

    $users = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $users[] = $row;
    }

    echo json_encode(['success' => true, 'users' => $users, 'count' => count($users)]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

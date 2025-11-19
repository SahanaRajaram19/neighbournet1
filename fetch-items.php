<?php
// Fetch All Items
header('Content-Type: application/json');
include 'db.php';

try {
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $status = $_GET['status'] ?? '';
    $condition = $_GET['condition'] ?? '';

    $query = "SELECT * FROM items WHERE 1=1";
    $params = [];

    if (!empty($search)) {
        $query .= " AND (title LIKE ? OR description LIKE ?)";
        $params[] = '%' . $search . '%';
        $params[] = '%' . $search . '%';
    }

    if (!empty($category)) {
        $query .= " AND category = ?";
        $params[] = $category;
    }

    if (!empty($status)) {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    if (!empty($condition)) {
        $query .= " AND condition = ?";
        $params[] = $condition;
    }

    $query .= " ORDER BY date_added DESC";

    $stmt = $mysqli->prepare($query);
    $stmt->execute($params);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'items' => $items, 'count' => count($items)]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

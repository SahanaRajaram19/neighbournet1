<?php
// Update Item
header('Content-Type: application/json');
include 'db.php';

$id = intval($_GET['id'] ?? 0);
$input = json_decode(file_get_contents('php://input'), true);

$title = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');
$category = trim($input['category'] ?? '');
$price = floatval($input['price'] ?? 0);
$status = trim($input['status'] ?? 'available');
$condition = trim($input['condition'] ?? 'good');

if ($id <= 0 || empty($title)) {
    echo json_encode(['success' => false, 'error' => 'Invalid item data']);
    exit;
}

try {
    // Update item
    $stmt = $mysqli->prepare("UPDATE items SET title = ?, description = ?, category = ?, price = ?, status = ?, condition = ? WHERE id = ?");
    
    $stmt->execute([$title, $description, $category, $price, $status, $condition, $id]);

    echo json_encode(['success' => true, 'message' => 'Item updated successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>


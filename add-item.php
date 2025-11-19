<?php
// Add New Item with Image
header('Content-Type: application/json');
include 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

$title = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');
$category = trim($input['category'] ?? '');
$price = floatval($input['price'] ?? 0);
$condition = trim($input['condition'] ?? 'good');
$status = trim($input['status'] ?? 'available');
$image_url = trim($input['image_url'] ?? ''); // From upload-image.php

// Validation
if (empty($title) || empty($category) || $price <= 0) {
    echo json_encode(['success' => false, 'error' => 'Please fill all required fields correctly']);
    exit;
}

try {
    // Insert item with image
    $stmt = $mysqli->prepare("INSERT INTO items (title, description, owner_id, owner_name, category, price, condition, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $owner_id = 1;
    $owner_name = 'Admin';
    
    $stmt->execute([$title, $description, $owner_id, $owner_name, $category, $price, $condition, $status, $image_url]);

    echo json_encode([
        'success' => true,
        'message' => 'Item added successfully'
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>


<?php
header('Content-Type: application/json');
require 'db.php';

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['item_id']) || !isset($data['image_url'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $pdo->prepare('UPDATE items SET image_url = ? WHERE id = ?');
    $stmt->execute([$data['image_url'], $data['item_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Image updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

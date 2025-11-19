<?php
// Update User Profile
header('Content-Type: application/json');
include 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$user_id = $_SESSION['user_id'];

$full_name = trim($input['full_name'] ?? '');
$phone = trim($input['phone'] ?? '');
$address = trim($input['address'] ?? '');

if (empty($full_name)) {
    echo json_encode(['success' => false, 'error' => 'Full name is required']);
    exit;
}

try {
    $stmt = $mysqli->prepare("UPDATE users SET full_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->execute([$full_name, $phone, $address, $user_id]);

    $_SESSION['full_name'] = $full_name;

    echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

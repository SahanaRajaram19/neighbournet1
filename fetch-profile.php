<?php
// Fetch User Profile
header('Content-Type: application/json');
include 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $mysqli->prepare("SELECT id, username, email, full_name, phone, address, profile_image, status, created_at FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Get user stats
        $items_stmt = $mysqli->prepare("SELECT COUNT(*) as total FROM items WHERE owner_id = ?");
        $items_stmt->execute([$user_id]);
        $items_count = $items_stmt->fetch(PDO::FETCH_ASSOC)['total'];

        $bookings_stmt = $mysqli->prepare("SELECT COUNT(*) as total FROM bookings WHERE user_id = ?");
        $bookings_stmt->execute([$user_id]);
        $bookings_count = $bookings_stmt->fetch(PDO::FETCH_ASSOC)['total'];

        $user['items_count'] = $items_count;
        $user['bookings_count'] = $bookings_count;

        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'User not found']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

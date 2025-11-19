<?php
// Create Booking
header('Content-Type: application/json');
include 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$user_id = $_SESSION['user_id'];

$item_id = $input['item_id'] ?? '';
$start_date = $input['start_date'] ?? '';
$end_date = $input['end_date'] ?? '';

if (empty($item_id) || empty($start_date) || empty($end_date)) {
    echo json_encode(['success' => false, 'error' => 'Item ID, start date, and end date are required']);
    exit;
}

try {
    // Get item details
    $item_stmt = $mysqli->prepare("SELECT price, owner_id FROM items WHERE id = ?");
    $item_stmt->execute([$item_id]);
    $item = $item_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        echo json_encode(['success' => false, 'error' => 'Item not found']);
        exit;
    }

    // Calculate total price
    $start = new DateTime($start_date);
    $end = new DateTime($end_date);
    $days = $end->diff($start)->days + 1;
    $total_price = $item['price'] * $days;

    // Create booking
    $stmt = $mysqli->prepare("INSERT INTO bookings (item_id, user_id, start_date, end_date, total_price, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$item_id, $user_id, $start_date, $end_date, $total_price, 'pending']);

    echo json_encode(['success' => true, 'message' => 'Booking created successfully', 'total_price' => $total_price, 'days' => $days]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

<?php
// Get Dashboard Statistics
header('Content-Type: application/json');
include 'db.php';

try {
    // Total users
    $stmt = $mysqli->query("SELECT COUNT(*) as count FROM users");
    $total_users = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Total items
    $stmt = $mysqli->query("SELECT COUNT(*) as count FROM items");
    $total_items = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Available items
    $stmt = $mysqli->query("SELECT COUNT(*) as count FROM items WHERE status = 'available'");
    $available_items = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Booked items
    $stmt = $mysqli->query("SELECT COUNT(*) as count FROM items WHERE status = 'booked'");
    $booked_items = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Unavailable items
    $stmt = $mysqli->query("SELECT COUNT(*) as count FROM items WHERE status = 'unavailable'");
    $unavailable_items = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Total bookings
    $stmt = $mysqli->query("SELECT COUNT(*) as count FROM bookings");
    $total_bookings = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Pending bookings
    $stmt = $mysqli->query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    $pending_bookings = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Support tickets
    $stmt = $mysqli->query("SELECT COUNT(*) as count FROM support_tickets WHERE status != 'closed'");
    $open_tickets = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_users' => $total_users,
            'total_items' => $total_items,
            'available_items' => $available_items,
            'booked_items' => $booked_items,
            'unavailable_items' => $unavailable_items,
            'total_bookings' => $total_bookings,
            'pending_bookings' => $pending_bookings,
            'open_tickets' => $open_tickets
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

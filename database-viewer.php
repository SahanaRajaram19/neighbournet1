<?php
// Database Viewer - See all data stored in SQLite
header('Content-Type: application/json');

try {
    $db_file = __DIR__ . '/neighbournet1.db';
    $mysqli = new PDO('sqlite:' . $db_file);
    $mysqli->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $table = isset($_GET['table']) ? $_GET['table'] : 'users';
    
    switch($table) {
        case 'users':
            $result = $mysqli->query("SELECT * FROM users");
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'table' => 'users', 'data' => $data, 'count' => count($data)]);
            break;
            
        case 'items':
            $result = $mysqli->query("SELECT * FROM items");
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'table' => 'items', 'data' => $data, 'count' => count($data)]);
            break;
            
        case 'bookings':
            $result = $mysqli->query("SELECT b.*, i.title as item_title, u.username as user_name FROM bookings b LEFT JOIN items i ON b.item_id = i.id LEFT JOIN users u ON b.user_id = u.id");
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'table' => 'bookings', 'data' => $data, 'count' => count($data)]);
            break;
            
        case 'support_tickets':
            $result = $mysqli->query("SELECT s.*, u.username, u.email FROM support_tickets s LEFT JOIN users u ON s.user_id = u.id");
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'table' => 'support_tickets', 'data' => $data, 'count' => count($data)]);
            break;
            
        case 'all':
            $users = $mysqli->query("SELECT COUNT(*) as count FROM users")->fetch(PDO::FETCH_ASSOC);
            $items = $mysqli->query("SELECT COUNT(*) as count FROM items")->fetch(PDO::FETCH_ASSOC);
            $bookings = $mysqli->query("SELECT COUNT(*) as count FROM bookings")->fetch(PDO::FETCH_ASSOC);
            $tickets = $mysqli->query("SELECT COUNT(*) as count FROM support_tickets")->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'summary' => [
                    'total_users' => $users['count'],
                    'total_items' => $items['count'],
                    'total_bookings' => $bookings['count'],
                    'total_support_tickets' => $tickets['count']
                ]
            ]);
            break;
            
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid table']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

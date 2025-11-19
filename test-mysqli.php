<?php
header('Content-Type: application/json');

// Test mysqli connection
try {
    $mysqli = new mysqli('localhost', 'root', '');
    
    if ($mysqli->connect_error) {
        echo json_encode([
            'success' => false,
            'error' => 'Connection failed: ' . $mysqli->connect_error
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'MySQLi connected successfully!',
            'server_info' => $mysqli->server_info
        ]);
        $mysqli->close();
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Exception: ' . $e->getMessage()
    ]);
}
?>

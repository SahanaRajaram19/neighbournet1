<?php
// Database Configuration - Using SQLite (no MySQL needed!)
// SQLite works perfectly for XAMPP and requires NO authentication

$db_file = __DIR__ . '/neighbournet1.db';

try {
    // Create or connect to SQLite database
    $mysqli = new PDO('sqlite:' . $db_file);
    $mysqli->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Enable foreign keys in SQLite
    $mysqli->exec("PRAGMA foreign_keys = ON");
    
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

?>

<?php
header('Content-Type: application/json');

$results = [];

// Test 1: Using socket connection
try {
    $pdo = new PDO('mysql:unix_socket=/tmp/mysql.sock', 'root', '');
    $results['socket'] = 'SUCCESS';
} catch (Exception $e) {
    $results['socket'] = 'FAILED: ' . $e->getMessage();
}

// Test 2: Using 127.0.0.1
try {
    $pdo = new PDO('mysql:host=127.0.0.1:3306', 'root', '');
    $results['127.0.0.1:3306'] = 'SUCCESS';
} catch (Exception $e) {
    $results['127.0.0.1:3306'] = 'FAILED: ' . $e->getMessage();
}

// Test 3: Using localhost
try {
    $pdo = new PDO('mysql:host=localhost', 'root', '');
    $results['localhost'] = 'SUCCESS';
} catch (Exception $e) {
    $results['localhost'] = 'FAILED: ' . $e->getMessage();
}

// Test 4: Using port explicitly
try {
    $pdo = new PDO('mysql:host=localhost;port=3306', 'root', '');
    $results['localhost:3306'] = 'SUCCESS';
} catch (Exception $e) {
    $results['localhost:3306'] = 'FAILED: ' . $e->getMessage();
}

// Test 5: Try with mysqli
$results['mysqli_available'] = extension_loaded('mysqli') ? 'YES' : 'NO';

echo json_encode($results, JSON_PRETTY_PRINT);
?>

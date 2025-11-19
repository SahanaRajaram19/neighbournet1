<?php
header('Content-Type: application/json');

// Simple direct test
echo json_encode([
    'step' => 'Testing MySQL connection...',
    'php_version' => phpversion(),
    'pdo_loaded' => extension_loaded('pdo'),
    'pdo_mysql_loaded' => extension_loaded('pdo_mysql')
], JSON_PRETTY_PRINT);

// Try to connect
try {
    $pdo = new PDO('mysql:host=localhost', 'root', '');
    echo json_encode(['success' => true, 'message' => 'Connected to MySQL successfully!']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

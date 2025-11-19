<?php
header('Content-Type: application/json');

// Try to connect using command line mysql
$output = shell_exec('C:\xampp\mysql\bin\mysql.exe -u root -h localhost -e "SELECT 1;" 2>&1');

if (strpos($output, 'ERROR') !== false) {
    echo json_encode([
        'success' => false,
        'error' => 'MySQL command line failed',
        'output' => $output
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => 'MySQL command line works!',
        'output' => $output
    ]);
}
?>

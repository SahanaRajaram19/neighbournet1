<?php
header('Content-Type: application/json');

/**
 * XAMPP MySQL Recovery Script
 * This attempts to fix MySQL authentication issues
 */

$xampp_path = 'C:\\xampp';
$mysql_path = $xampp_path . '\\mysql\\bin';

// Step 1: Check if MySQL is running
$processes = shell_exec('tasklist | findstr mysqld');
$mysql_running = strpos($processes, 'mysqld') !== false;

$output = [
    'mysql_running' => $mysql_running ? 'YES' : 'NO',
    'steps' => []
];

if (!$mysql_running) {
    $output['steps'][] = 'MySQL is not running - start it from XAMPP control panel';
} else {
    // Try to connect with MySQL CLI
    $cmd = '"' . $mysql_path . '\\mysql.exe" -u root -e "SHOW DATABASES;" 2>&1';
    $result = shell_exec($cmd);
    
    if (strpos($result, 'ERROR') !== false || strpos($result, 'Access denied') !== false) {
        $output['connection_status'] = 'FAILED';
        $output['error'] = trim($result);
        $output['recovery_steps'] = [
            '1. Stop MySQL from XAMPP Control Panel',
            '2. Run command: C:\\xampp\\mysql\\bin\\mysqld.exe --skip-grant-tables',
            '3. In another terminal: C:\\xampp\\mysql\\bin\\mysql.exe -u root',
            '4. Execute: FLUSH PRIVILEGES;',
            '5. Execute: ALTER USER \'root\'@\'localhost\' IDENTIFIED BY \'\';',
            '6. Exit and restart MySQL normally'
        ];
    } else {
        $output['connection_status'] = 'SUCCESS';
        $output['databases'] = $result;
    }
}

echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>

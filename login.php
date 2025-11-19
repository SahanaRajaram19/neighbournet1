<?php
// User Login
header('Content-Type: application/json');
include 'db.php';
session_start();

// Accept both POST and GET
$input = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_input = json_decode(file_get_contents('php://input'), true);
    $input = $json_input ?: $_POST;
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $input = $_GET;
}

$username = trim($input['username'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ((empty($username) && empty($email)) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Email/Username and password are required']);
    exit;
}

$login_field = !empty($email) ? $email : $username;

try {
    // Query user from database
    $stmt = $mysqli->prepare("SELECT id, username, email, password, full_name, status FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$login_field, $login_field]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        if ($user['status'] !== 'active') {
            echo json_encode(['success' => false, 'message' => 'Your account is ' . $user['status']]);
            exit;
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['full_name'] = $user['full_name'];

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user_id' => $user['id'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'email' => $user['email']
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid email/username or password']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Login failed: ' . $e->getMessage()]);
}
?>

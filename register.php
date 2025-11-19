<?php
// User Registration
header('Content-Type: application/json');
include 'db.php';

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
$full_name = trim($input['full_name'] ?? '');

// Validation
if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Username, email, and password are required']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

try {
    // Check if user already exists
    $stmt = $mysqli->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    $existing = $stmt->fetch();
    
    if ($existing) {
        echo json_encode(['success' => false, 'error' => 'Username or email already exists']);
        exit;
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Insert user
    $stmt = $mysqli->prepare("INSERT INTO users (username, email, password, full_name, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$username, $email, $hashed_password, $full_name, 'active']);

    echo json_encode(['success' => true, 'message' => 'Registration successful! Please login.']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Registration failed: ' . $e->getMessage()]);
}
?>

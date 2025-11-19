<?php
// Submit Support Ticket
header('Content-Type: application/json');
include 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$user_id = $_SESSION['user_id'];

$subject = trim($input['subject'] ?? '');
$message = trim($input['message'] ?? '');
$priority = $input['priority'] ?? 'medium';

if (empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'error' => 'Subject and message are required']);
    exit;
}

try {
    $stmt = $mysqli->prepare("INSERT INTO support_tickets (user_id, subject, message, priority, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $subject, $message, $priority, 'open']);

    echo json_encode(['success' => true, 'message' => 'Support ticket submitted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

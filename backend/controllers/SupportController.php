<?php
// Support Controller
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';

class SupportController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function submitContact($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['name']) || !isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
            throw new Exception('All fields are required', 400);
        }

        if (!AuthMiddleware::validateEmail($data['email'])) {
            throw new Exception('Invalid email format', 400);
        }

        // Insert support ticket
        $stmt = $this->db->prepare("
            INSERT INTO support_tickets (user_id, type, subject, message, priority)
            VALUES (?, 'contact', ?, ?, ?)
        ");

        $user_id = isset($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : null;
        $priority = $data['priority'] ?? 'normal';

        $stmt->execute([$user_id, $data['subject'], $data['message'], $priority]);

        $ticket_id = $this->db->lastInsertId();

        // In a real application, you would send email notifications here
        $this->sendEmailNotification($data, $ticket_id);

        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully. We will respond within 24 hours.',
            'ticket_id' => $ticket_id
        ]);
    }

    public function submitReport($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['type']) || !isset($data['name']) || !isset($data['email']) || !isset($data['description'])) {
            throw new Exception('All fields are required', 400);
        }

        if (!AuthMiddleware::validateEmail($data['email'])) {
            throw new Exception('Invalid email format', 400);
        }

        // Insert support ticket
        $stmt = $this->db->prepare("
            INSERT INTO support_tickets (user_id, type, subject, message, priority)
            VALUES (?, 'report', ?, ?, ?)
        ");

        $user_id = isset($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : null;
        $subject = 'Issue Report: ' . ucfirst($data['type']);
        $priority = isset($data['urgent']) ? 'urgent' : 'high';

        $stmt->execute([$user_id, $subject, $data['description'], $priority]);

        $ticket_id = $this->db->lastInsertId();

        // Handle file attachments if provided
        if (isset($_FILES['files'])) {
            $this->handleFileAttachments($ticket_id, $_FILES['files']);
        }

        // Send urgent notification if needed
        if ($priority === 'urgent') {
            $this->sendUrgentNotification($data, $ticket_id);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Your report has been submitted successfully. Our team will review it within 48 hours.',
            'ticket_id' => $ticket_id
        ]);
    }

    private function sendEmailNotification($data, $ticket_id) {
        // In a real application, integrate with email service like PHPMailer or SendGrid
        $to = Config::$support_email;
        $subject = 'New Contact Form Submission - Ticket #' . $ticket_id;
        $message = "
        New contact form submission:

        Name: {$data['name']}
        Email: {$data['email']}
        Subject: {$data['subject']}
        Message: {$data['message']}
        Ticket ID: $ticket_id
        ";

        // Log the email for now (replace with actual email sending)
        error_log("Email notification: $message");

        // Example with PHPMailer (you would need to install it):
        /*
        $mail = new PHPMailer\PHPMailer\PHPMailer();
        $mail->isSMTP();
        $mail->Host = Config::$smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = Config::$smtp_username;
        $mail->Password = Config::$smtp_password;
        $mail->SMTPSecure = 'tls';
        $mail->Port = Config::$smtp_port;

        $mail->setFrom($data['email'], $data['name']);
        $mail->addAddress($to);
        $mail->Subject = $subject;
        $mail->Body = $message;

        $mail->send();
        */
    }

    private function sendUrgentNotification($data, $ticket_id) {
        // Send urgent notification to admins
        $subject = 'URGENT: Issue Report - Ticket #' . $ticket_id;
        $message = "
        URGENT ISSUE REPORT:

        Reporter: {$data['name']} ({$data['email']})
        Type: {$data['type']}
        Description: {$data['description']}
        Ticket ID: $ticket_id

        Please review immediately.
        ";

        error_log("URGENT notification: $message");
    }

    private function handleFileAttachments($ticket_id, $files) {
        $upload_dir = Config::$upload_dir . 'support/';

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        $uploaded_files = [];

        foreach ($files['tmp_name'] as $key => $tmp_name) {
            if ($files['error'][$key] === UPLOAD_ERR_OK) {
                $filename = uniqid() . '_' . basename($files['name'][$key]);
                $filepath = $upload_dir . $filename;

                if (move_uploaded_file($tmp_name, $filepath)) {
                    $uploaded_files[] = $filename;
                }
            }
        }

        if (!empty($uploaded_files)) {
            $stmt = $this->db->prepare("
                UPDATE support_tickets SET files = ? WHERE id = ?
            ");
            $stmt->execute([json_encode($uploaded_files), $ticket_id]);
        }
    }

    public function getFAQs() {
        $faqs = [
            'getting-started' => [
                [
                    'question' => 'How do I create a NeighbourNet account?',
                    'answer' => 'Creating an account is simple! Click on the "Sign Up" button, fill in your details including your mobile number for verification, and complete the OTP verification process. You\'ll need to provide basic information like your name, email, and location to get started.'
                ],
                [
                    'question' => 'What information do I need to provide?',
                    'answer' => 'We require your full name, email address, mobile number, and location. For enhanced security and trust, you can also add your Aadhaar number and UPI ID. All information is kept secure and private.'
                ],
                [
                    'question' => 'How does the verification process work?',
                    'answer' => 'After signing up, you\'ll receive an OTP on your registered mobile number. Enter this code to verify your account. For additional security, you can verify your Aadhaar number and link your UPI ID for seamless transactions.'
                ]
            ],
            'borrowing' => [
                [
                    'question' => 'How do I borrow an item from a neighbour?',
                    'answer' => 'Browse available items in your area, select the item you need, and click "Request to Borrow". The item owner will receive your request and can approve or decline it. Once approved, you can arrange pickup with the owner.'
                ],
                [
                    'question' => 'What are the borrowing fees?',
                    'answer' => 'Borrowing fees are set by the item owner and vary based on the item type, duration, and owner\'s preferences. Fees are displayed clearly on each item listing. Some neighbours may offer items for free!'
                ]
            ],
            'account' => [
                [
                    'question' => 'How do I update my profile information?',
                    'answer' => 'Go to your profile page, click "Edit Profile", make your changes, and save them. You can update your name, email, location, and other details. Note that Aadhaar verification cannot be changed once completed.'
                ],
                [
                    'question' => 'How do I change my password?',
                    'answer' => 'On your profile page, click "Change Password" in the Security Settings section. Enter your current password, then set and confirm your new password. Your password must be at least 6 characters long.'
                ]
            ]
        ];

        echo json_encode([
            'success' => true,
            'faqs' => $faqs
        ]);
    }

    public function getUserTickets($user_id) {
        $stmt = $this->db->prepare("
            SELECT * FROM support_tickets
            WHERE user_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$user_id]);
        $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'tickets' => $tickets
        ]);
    }
}
?>

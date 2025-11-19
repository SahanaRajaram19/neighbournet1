<?php
// User Controller
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';

class UserController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function register($data) {
        // Validate input
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['name']) || !isset($data['email']) || !isset($data['mobile']) || !isset($data['password'])) {
            throw new Exception('Missing required fields', 400);
        }

        if (!AuthMiddleware::validateEmail($data['email'])) {
            throw new Exception('Invalid email format', 400);
        }

        if (!AuthMiddleware::validateMobile($data['mobile'])) {
            throw new Exception('Invalid mobile number', 400);
        }

        if (strlen($data['password']) < Config::$password_min_length) {
            throw new Exception('Password must be at least ' . Config::$password_min_length . ' characters', 400);
        }

        // Check if user already exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ? OR mobile = ?");
        $stmt->execute([$data['email'], $data['mobile']]);
        if ($stmt->rowCount() > 0) {
            throw new Exception('User already exists with this email or mobile', 409);
        }

        // Hash password
        $hashed_password = AuthMiddleware::hashPassword($data['password']);

        // Insert user
        $stmt = $this->db->prepare("
            INSERT INTO users (name, email, mobile, password, location, address, aadhaar, upi_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $location = $data['location'] ?? null;
        $address = $data['address'] ?? null;
        $aadhaar = $data['aadhaar'] ?? null;
        $upi_id = $data['upi_id'] ?? null;

        $stmt->execute([$data['name'], $data['email'], $data['mobile'], $hashed_password, $location, $address, $aadhaar, $upi_id]);

        $user_id = $this->db->lastInsertId();

        // Generate and send OTP
        $otp = AuthMiddleware::generateOTP();
        AuthMiddleware::sendOTP($data['mobile'], $otp);

        // Store OTP in database
        $expires_at = date('Y-m-d H:i:s', strtotime('+10 minutes'));
        $stmt = $this->db->prepare("
            INSERT INTO otp_verifications (mobile, otp, type, expires_at)
            VALUES (?, ?, 'registration', ?)
        ");
        $stmt->execute([$data['mobile'], $otp, $expires_at]);

        // Generate JWT token
        $token = AuthMiddleware::generateToken($user_id);

        echo json_encode([
            'success' => true,
            'message' => 'Registration successful. Please verify your mobile number.',
            'user_id' => $user_id,
            'token' => $token,
            'requires_otp' => true
        ]);
    }

    public function login($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['email']) || !isset($data['password'])) {
            throw new Exception('Email and password are required', 400);
        }

        // Get user
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !AuthMiddleware::verifyPassword($data['password'], $user['password'])) {
            throw new Exception('Invalid credentials', 401);
        }

        // Check if user is verified
        if (!$user['is_verified']) {
            throw new Exception('Please verify your account first', 403);
        }

        // Generate token
        $token = AuthMiddleware::generateToken($user['id']);

        // Update last login
        $stmt = $this->db->prepare("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$user['id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'avatar' => $user['avatar'],
                'rating' => $user['rating'],
                'total_transactions' => $user['total_transactions']
            ],
            'token' => $token
        ]);
    }

    public function verifyOTP($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['mobile']) || !isset($data['otp'])) {
            throw new Exception('Mobile and OTP are required', 400);
        }

        // Verify OTP
        $stmt = $this->db->prepare("
            SELECT * FROM otp_verifications
            WHERE mobile = ? AND otp = ? AND expires_at > NOW() AND type = 'registration'
            ORDER BY created_at DESC LIMIT 1
        ");
        $stmt->execute([$data['mobile'], $data['otp']]);
        $verification = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$verification) {
            throw new Exception('Invalid or expired OTP', 400);
        }

        // Update user verification status
        $stmt = $this->db->prepare("UPDATE users SET is_verified = TRUE WHERE mobile = ?");
        $stmt->execute([$data['mobile']]);

        // Delete used OTP
        $stmt = $this->db->prepare("DELETE FROM otp_verifications WHERE id = ?");
        $stmt->execute([$verification['id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Account verified successfully'
        ]);
    }

    public function forgotPassword($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['email'])) {
            throw new Exception('Email is required', 400);
        }

        if (!AuthMiddleware::validateEmail($data['email'])) {
            throw new Exception('Invalid email format', 400);
        }

        // Check if user exists
        $stmt = $this->db->prepare("SELECT id, name, mobile FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            // Don't reveal if email exists or not for security
            echo json_encode([
                'success' => true,
                'message' => 'If the email exists, you will receive a password reset link'
            ]);
            return;
        }

        // Generate OTP for password reset
        $otp = AuthMiddleware::generateOTP();
        AuthMiddleware::sendOTP($user['mobile'], $otp);

        // Store OTP
        $expires_at = date('Y-m-d H:i:s', strtotime('+10 minutes'));
        $stmt = $this->db->prepare("
            INSERT INTO otp_verifications (mobile, otp, type, expires_at)
            VALUES (?, ?, 'password_reset', ?)
        ");
        $stmt->execute([$user['mobile'], $otp, $expires_at]);

        echo json_encode([
            'success' => true,
            'message' => 'Password reset OTP sent to your mobile number'
        ]);
    }

    public function getProfile($user_id) {
        $stmt = $this->db->prepare("
            SELECT id, name, email, mobile, location, address, avatar, rating, total_transactions,
                   aadhaar_verified, upi_verified, created_at
            FROM users WHERE id = ?
        ");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            throw new Exception('User not found', 404);
        }

        echo json_encode([
            'success' => true,
            'user' => $user
        ]);
    }

    public function updateProfile($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['user_id'])) {
            throw new Exception('User ID is required', 400);
        }

        $user_id = $data['user_id'];
        unset($data['user_id']);

        // Build update query dynamically
        $fields = [];
        $values = [];

        foreach ($data as $key => $value) {
            if ($key !== 'id' && $value !== null) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }

        if (empty($fields)) {
            throw new Exception('No fields to update', 400);
        }

        $values[] = $user_id;
        $query = "UPDATE users SET " . implode(', ', $fields) . ", updated_at = CURRENT_TIMESTAMP WHERE id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->execute($values);

        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully'
        ]);
    }

    public function changePassword($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['user_id']) || !isset($data['current_password']) || !isset($data['new_password'])) {
            throw new Exception('User ID, current password, and new password are required', 400);
        }

        if (strlen($data['new_password']) < Config::$password_min_length) {
            throw new Exception('New password must be at least ' . Config::$password_min_length . ' characters', 400);
        }

        // Get current user
        $stmt = $this->db->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$data['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !AuthMiddleware::verifyPassword($data['current_password'], $user['password'])) {
            throw new Exception('Current password is incorrect', 400);
        }

        // Update password
        $hashed_password = AuthMiddleware::hashPassword($data['new_password']);
        $stmt = $this->db->prepare("UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$hashed_password, $data['user_id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }

    public function getUserStats($user_id) {
        // Get user's transaction statistics
        $stmt = $this->db->prepare("
            SELECT
                COUNT(*) as total_transactions,
                AVG(r.rating) as avg_rating,
                SUM(CASE WHEN r.reviewer_id = ? THEN 1 ELSE 0 END) as reviews_given,
                SUM(CASE WHEN r.reviewee_id = ? THEN 1 ELSE 0 END) as reviews_received
            FROM transactions t
            LEFT JOIN reviews r ON t.id = r.transaction_id
            WHERE t.owner_id = ? OR t.borrower_id = ?
        ");
        $stmt->execute([$user_id, $user_id, $user_id, $user_id]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'stats' => $stats
        ]);
    }
}
?>

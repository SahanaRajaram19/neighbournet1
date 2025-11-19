<?php
// Authentication Middleware
require_once __DIR__ . '/../config/config.php';
// require_once __DIR__ . '/../vendor/autoload.php'; // Uncomment when using Composer

// use Firebase\JWT\JWT;
// use Firebase\JWT\Key;

class AuthMiddleware {

    public static function generateToken($user_id) {
        $issued_at = time();
        $expiration_time = $issued_at + Config::$jwt_expiry;

        $payload = [
            'iat' => $issued_at,
            'exp' => $expiration_time,
            'user_id' => $user_id
        ];

        // Using custom JWT implementation for now (since Composer might not be available)
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $header_encoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));

        $payload = json_encode($payload);
        $payload_encoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', $header_encoded . "." . $payload_encoded, Config::$jwt_secret, true);
        $signature_encoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $header_encoded . "." . $payload_encoded . "." . $signature_encoded;

        // Firebase JWT implementation (when Composer is available):
        // return JWT::encode($payload, Config::$jwt_secret, 'HS256');
    }

    public static function verifyToken($token) {
        try {
            $token_parts = explode('.', $token);

            if (count($token_parts) !== 3) {
                return false;
            }

            $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $token_parts[0]));
            $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $token_parts[1]));
            $signature = $token_parts[2];

            $expected_signature = hash_hmac('sha256', $token_parts[0] . "." . $token_parts[1], Config::$jwt_secret, true);
            $expected_signature_encoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expected_signature));

            if ($signature !== $expected_signature_encoded) {
                return false;
            }

            $payload_data = json_decode($payload, true);

            if ($payload_data['exp'] < time()) {
                return false;
            }

            return $payload_data['user_id'];

            // Firebase JWT implementation (when Composer is available):
            // $decoded = JWT::decode($token, new Key(Config::$jwt_secret, 'HS256'));
            // return $decoded->user_id;

        } catch (Exception $e) {
            return false;
        }
    }

    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public static function generateOTP() {
        return str_pad(rand(100000, 999999), 6, '0', STR_PAD_LEFT);
    }

    public static function sendOTP($mobile, $otp) {
        // In a real application, integrate with SMS service like Twilio
        // For now, we'll just log it
        error_log("OTP for $mobile: $otp");

        // You can integrate with SMS services here:
        // - Twilio
        // - AWS SNS
        // - MSG91
        // - TextLocal

        return true;
    }

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function validateMobile($mobile) {
        // Indian mobile number validation
        return preg_match('/^[6-9]\d{9}$/', preg_replace('/[^0-9]/', '', $mobile));
    }

    public static function validateAadhaar($aadhaar) {
        // Aadhaar number validation (XXXX-XXXX-XXXX format)
        return preg_match('/^\d{4}-\d{4}-\d{4}$/', $aadhaar);
    }

    public static function validateUPI($upi) {
        // UPI ID validation
        return preg_match('/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/', $upi);
    }

    public static function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map([self::class, 'sanitizeInput'], $data);
        }
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
}
?>

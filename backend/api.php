<?php
// NeighbourNet Backend API
// Main entry point for all API requests

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include configuration and dependencies
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/middleware/auth.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/ItemController.php';
require_once __DIR__ . '/controllers/TransactionController.php';
require_once __DIR__ . '/controllers/SupportController.php';

// Initialize database connection
$database = new Database();
$db = $database->connect();

// Get request details
$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/neighbournet1/backend/api.php', '', $path);
$path_parts = explode('/', trim($path, '/'));

// Remove empty parts
$path_parts = array_filter($path_parts);

// Route the request
try {
    switch($request_method) {
        case 'GET':
            handleGET($path_parts, $db);
            break;
        case 'POST':
            handlePOST($path_parts, $db);
            break;
        case 'PUT':
            handlePUT($path_parts, $db);
            break;
        case 'DELETE':
            handleDELETE($path_parts, $db);
            break;
        default:
            throw new Exception('Method not allowed', 405);
    }
} catch (Exception $e) {
    http_response_code($e->getCode());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function handleGET($path_parts, $db) {
    if (empty($path_parts)) {
        // API status endpoint
        echo json_encode([
            'success' => true,
            'message' => 'NeighbourNet API is running',
            'version' => '1.0.0'
        ]);
        return;
    }

    $resource = $path_parts[0];

    switch($resource) {
        case 'items':
            $controller = new ItemController($db);
            if (isset($path_parts[1])) {
                $controller->getById($path_parts[1]);
            } else {
                $controller->getAll();
            }
            break;

        case 'categories':
            $controller = new ItemController($db);
            $controller->getCategories();
            break;

        case 'users':
            if (isset($path_parts[1])) {
                $controller = new UserController($db);
                $controller->getProfile($path_parts[1]);
            }
            break;

        case 'transactions':
            if (isset($path_parts[1])) {
                $controller = new TransactionController($db);
                $controller->getById($path_parts[1]);
            } else {
                $controller = new TransactionController($db);
                $controller->getUserTransactions();
            }
            break;

        case 'search':
            $controller = new ItemController($db);
            $query = $_GET['q'] ?? '';
            $category = $_GET['category'] ?? '';
            $location = $_GET['location'] ?? '';
            $controller->search($query, $category, $location);
            break;

        default:
            throw new Exception('Resource not found', 404);
    }
}

function handlePOST($path_parts, $db) {
    if (empty($path_parts)) {
        throw new Exception('Resource not specified', 400);
    }

    $resource = $path_parts[0];
    $input = json_decode(file_get_contents('php://input'), true);

    switch($resource) {
        case 'auth':
            $controller = new UserController($db);
            $action = $path_parts[1] ?? 'login';

            switch($action) {
                case 'login':
                    $controller->login($input);
                    break;
                case 'register':
                    $controller->register($input);
                    break;
                case 'verify-otp':
                    $controller->verifyOTP($input);
                    break;
                case 'forgot-password':
                    $controller->forgotPassword($input);
                    break;
                default:
                    throw new Exception('Auth action not found', 404);
            }
            break;

        case 'items':
            requireAuth();
            $controller = new ItemController($db);
            $controller->create($input);
            break;

        case 'transactions':
            requireAuth();
            $controller = new TransactionController($db);
            $action = $path_parts[1] ?? 'create';

            switch($action) {
                case 'create':
                    $controller->create($input);
                    break;
                case 'update-status':
                    $controller->updateStatus($input);
                    break;
                default:
                    throw new Exception('Transaction action not found', 404);
            }
            break;

        case 'reviews':
            requireAuth();
            $controller = new TransactionController($db);
            $controller->addReview($input);
            break;

        case 'support':
            $controller = new SupportController($db);
            $action = $path_parts[1] ?? 'contact';

            switch($action) {
                case 'contact':
                    $controller->submitContact($input);
                    break;
                case 'report':
                    $controller->submitReport($input);
                    break;
                default:
                    throw new Exception('Support action not found', 404);
            }
            break;

        case 'upload':
            requireAuth();
            handleFileUpload();
            break;

        default:
            throw new Exception('Resource not found', 404);
    }
}

function handlePUT($path_parts, $db) {
    if (empty($path_parts)) {
        throw new Exception('Resource not specified', 400);
    }

    $resource = $path_parts[0];
    $input = json_decode(file_get_contents('php://input'), true);

    switch($resource) {
        case 'users':
            requireAuth();
            $controller = new UserController($db);
            $controller->updateProfile($input);
            break;

        case 'items':
            requireAuth();
            $controller = new ItemController($db);
            if (isset($path_parts[1])) {
                $controller->update($path_parts[1], $input);
            }
            break;

        case 'password':
            requireAuth();
            $controller = new UserController($db);
            $controller->changePassword($input);
            break;

        default:
            throw new Exception('Resource not found', 404);
    }
}

function handleDELETE($path_parts, $db) {
    if (empty($path_parts)) {
        throw new Exception('Resource not specified', 400);
    }

    $resource = $path_parts[0];

    switch($resource) {
        case 'items':
            requireAuth();
            $controller = new ItemController($db);
            if (isset($path_parts[1])) {
                $controller->delete($path_parts[1]);
            }
            break;

        case 'transactions':
            requireAuth();
            $controller = new TransactionController($db);
            if (isset($path_parts[1])) {
                $controller->cancel($path_parts[1]);
            }
            break;

        default:
            throw new Exception('Resource not found', 404);
    }
}

function handleFileUpload() {
    if (!isset($_FILES['file'])) {
        throw new Exception('No file uploaded', 400);
    }

    $file = $_FILES['file'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    $max_size = 5 * 1024 * 1024; // 5MB

    // Validate file type
    if (!in_array($file['type'], $allowed_types)) {
        throw new Exception('Invalid file type. Only JPG, PNG, GIF, and PDF are allowed', 400);
    }

    // Validate file size
    if ($file['size'] > $max_size) {
        throw new Exception('File size too large. Maximum size is 5MB', 400);
    }

    // Create uploads directory if it doesn't exist
    $upload_dir = __DIR__ . '/../uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $filepath = $upload_dir . $filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'url' => '/neighbournet1/uploads/' . $filename
        ]);
    } else {
        throw new Exception('Failed to upload file', 500);
    }
}

function requireAuth() {
    $headers = getallheaders();
    $auth_header = $headers['Authorization'] ?? '';

    if (!$auth_header || !preg_match('/Bearer (.+)/', $auth_header, $matches)) {
        throw new Exception('Authentication required', 401);
    }

    $token = $matches[1];
    $user_id = AuthMiddleware::verifyToken($token);

    if (!$user_id) {
        throw new Exception('Invalid token', 401);
    }

    return $user_id;
}
?>

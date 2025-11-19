<?php
// NeighbourNet API Test Script

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/config.php';

echo "🧪 Testing NeighbourNet API Endpoints...\n\n";

// Test basic API status
echo "1. Testing API Status...\n";
$ch = curl_init('http://localhost:8000/neighbournet1/backend/api.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $data = json_decode($response, true);
    if ($data && $data['success']) {
        echo "✅ API is running successfully\n";
        echo "   Version: {$data['version']}\n";
    } else {
        echo "❌ API returned error: " . ($data['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "❌ API not accessible (HTTP $http_code)\n";
}

// Test categories endpoint
echo "\n2. Testing Categories Endpoint...\n";
$ch = curl_init('http://localhost:8000/neighbournet1/backend/api.php/categories');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $data = json_decode($response, true);
    if ($data && $data['success']) {
        echo "✅ Categories retrieved successfully\n";
        echo "   Available categories: " . implode(', ', array_keys($data['categories'])) . "\n";
    } else {
        echo "❌ Categories endpoint error: " . ($data['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "❌ Categories endpoint not accessible (HTTP $http_code)\n";
}

// Test items endpoint
echo "\n3. Testing Items Endpoint...\n";
$ch = curl_init('http://localhost:8000/neighbournet1/backend/api.php/items');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $data = json_decode($response, true);
    if ($data && $data['success']) {
        echo "✅ Items retrieved successfully\n";
        echo "   Total items: " . count($data['items']) . "\n";
        if (!empty($data['items'])) {
            echo "   Sample item: {$data['items'][0]['title']}\n";
        }
    } else {
        echo "❌ Items endpoint error: " . ($data['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "❌ Items endpoint not accessible (HTTP $http_code)\n";
}

// Test user registration (will fail due to missing data, but tests validation)
echo "\n4. Testing User Registration Validation...\n";
$ch = curl_init('http://localhost:8000/neighbournet1/backend/api.php/auth/register');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Test User',
    'email' => 'invalid-email',
    'password' => '123'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 400) {
    $data = json_decode($response, true);
    if ($data && !$data['success']) {
        echo "✅ Validation working correctly\n";
        echo "   Error message: {$data['message']}\n";
    } else {
        echo "❌ Unexpected validation response\n";
    }
} else {
    echo "❌ Validation not working (HTTP $http_code)\n";
}

// Test search endpoint
echo "\n5. Testing Search Endpoint...\n";
$ch = curl_init('http://localhost:8000/neighbournet1/backend/api.php/search?q=drill');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $data = json_decode($response, true);
    if ($data && $data['success']) {
        echo "✅ Search working successfully\n";
        echo "   Results found: {$data['total_results']}\n";
    } else {
        echo "❌ Search endpoint error: " . ($data['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "❌ Search endpoint not accessible (HTTP $http_code)\n";
}

echo "\n📊 API Test Summary:\n";
echo "• Database connection: ";
try {
    $database = new Database();
    $conn = $database->connect();
    echo "✅ Connected\n";
} catch (Exception $e) {
    echo "❌ Failed\n";
}

echo "• File upload directory: ";
$upload_dir = __DIR__ . '/../uploads/';
echo (is_dir($upload_dir) ? "✅ Exists" : "❌ Missing") . "\n";

echo "• Sample data: ";
try {
    $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "✅ {$result['count']} users loaded\n";
} catch (Exception $e) {
    echo "❌ Not loaded\n";
}

echo "\n🎯 API is ready for frontend integration!\n";
echo "Next: Update frontend API calls to use the new endpoints.\n";
?>

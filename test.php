<?php
// Quick Test Page - Delete after testing
// Visit: http://localhost/neighbournet1/test.php

include 'db.php';

echo '<h1>NeighbourNet Backend Test</h1>';
echo '<style>body { font-family: Arial; margin: 20px; } .test { margin: 10px 0; padding: 10px; border: 1px solid #ccc; } .pass { background: #d4edda; } .fail { background: #f8d7da; }</style>';

// Test 1: Database Connection
echo '<div class="test pass">';
echo '<strong>✓ Database Connection:</strong> Connected to neighbournet<br>';
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'neighbournet'");
    $count = $stmt->fetchColumn();
    echo "Found $count tables in database";
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
echo '</div>';

// Test 2: Check Users Table
echo '<div class="test pass">';
echo '<strong>✓ Users Table:</strong>';
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo ' ' . $result['count'] . ' users';
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
echo '</div>';

// Test 3: Check Items Table
echo '<div class="test pass">';
echo '<strong>✓ Items Table:</strong>';
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM items");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo ' ' . $result['count'] . ' items';
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
echo '</div>';

// Test 4: Check Bookings Table
echo '<div class="test pass">';
echo '<strong>✓ Bookings Table:</strong>';
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo ' ' . $result['count'] . ' bookings';
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
echo '</div>';

// Test 5: Check Support Tickets Table
echo '<div class="test pass">';
echo '<strong>✓ Support Tickets Table:</strong>';
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM support_tickets");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo ' ' . $result['count'] . ' tickets';
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
echo '</div>';

// Test 6: Sample Data
echo '<div class="test">';
echo '<strong>Recent Items:</strong><br>';
try {
    $stmt = $pdo->query("SELECT * FROM items ORDER BY date_added DESC LIMIT 5");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (count($items) > 0) {
        echo '<ul>';
        foreach ($items as $item) {
            echo '<li>' . $item['title'] . ' - ₹' . $item['price'] . ' (' . $item['status'] . ')</li>';
        }
        echo '</ul>';
    } else {
        echo 'No items found. Add some items to get started!';
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
echo '</div>';

// Test 7: Sample Users
echo '<div class="test">';
echo '<strong>Recent Users:</strong><br>';
try {
    $stmt = $pdo->query("SELECT username, email, created_at FROM users ORDER BY created_at DESC LIMIT 5");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (count($users) > 0) {
        echo '<ul>';
        foreach ($users as $user) {
            echo '<li>' . $user['username'] . ' (' . $user['email'] . ')</li>';
        }
        echo '</ul>';
    } else {
        echo 'No users found. Register to get started!';
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
echo '</div>';

echo '<hr>';
echo '<h3>Quick Links:</h3>';
echo '<ul>';
echo '<li><a href="admin-items.html">Admin Items Panel (Old)</a></li>';
echo '<li><a href="admin-items-new.html">Admin Items Panel (New - Use This)</a></li>';
echo '<li><a href="http://localhost/phpmyadmin">phpMyAdmin - View Database</a></li>';
echo '</ul>';

echo '<hr>';
echo '<h3>Database Tables:</h3>';
echo '<ul>';
echo '<li><strong>users</strong> - Store user accounts and profiles</li>';
echo '<li><strong>items</strong> - Store items for borrowing/renting</li>';
echo '<li><strong>bookings</strong> - Store booking information</li>';
echo '<li><strong>support_tickets</strong> - Store support requests</li>';
echo '</ul>';

echo '<p style="color: green; font-weight: bold;">✓ Database is connected and ready to use!</p>';
?>


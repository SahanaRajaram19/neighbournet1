<?php
// Database Setup - Create tables (SQLite)
header('Content-Type: application/json');
include 'db.php';

try {
    // Create users table
    $mysqli->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            full_name TEXT,
            phone TEXT,
            address TEXT,
            profile_image TEXT,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Create items table
    $mysqli->exec("
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            owner_id INTEGER NOT NULL,
            owner_name TEXT,
            category TEXT,
            price REAL,
            status TEXT DEFAULT 'available',
            condition TEXT DEFAULT 'good',
            bookings INTEGER DEFAULT 0,
            rating REAL DEFAULT 0,
            date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
            image_url TEXT,
            FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");

    // Create bookings table
    $mysqli->exec("
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            start_date DATE,
            end_date DATE,
            status TEXT DEFAULT 'pending',
            total_price REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");

    // Create support tickets table
    $mysqli->exec("
        CREATE TABLE IF NOT EXISTS support_tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT,
            message TEXT,
            status TEXT DEFAULT 'open',
            priority TEXT DEFAULT 'medium',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");

    echo json_encode([
        'success' => true, 
        'message' => 'Database tables created successfully!',
        'database' => 'SQLite (neighbournet1.db)',
        'tables' => ['users', 'items', 'bookings', 'support_tickets']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Error creating tables: ' . $e->getMessage()
    ]);
}
?>

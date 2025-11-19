<?php
// Application Configuration

class Config {
    // JWT Configuration
    public static $jwt_secret = 'your-super-secret-jwt-key-change-this-in-production';
    public static $jwt_expiry = 3600; // 1 hour in seconds

    // File Upload Configuration
    public static $upload_dir = __DIR__ . '/../uploads/';
    public static $max_file_size = 5 * 1024 * 1024; // 5MB
    public static $allowed_file_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    // Pagination
    public static $items_per_page = 12;

    // Email Configuration (for notifications)
    public static $smtp_host = 'smtp.gmail.com';
    public static $smtp_port = 587;
    public static $smtp_username = 'your-email@gmail.com';
    public static $smtp_password = 'your-app-password';

    // Application Settings
    public static $app_name = 'NeighbourNet';
    public static $app_url = 'http://localhost/neighbournet1';
    public static $support_email = 'support@neighbournet.com';

    // Security Settings
    public static $password_min_length = 6;
    public static $session_timeout = 1800; // 30 minutes

    // Rate Limiting
    public static $rate_limit_requests = 100;
    public static $rate_limit_window = 3600; // 1 hour

    // Categories
    public static $categories = [
        'borrow' => 'Borrow Items',
        'rent' => 'Rent Items',
        'services' => 'Local Services',
        'freelancing' => 'Freelancing'
    ];

    public static $subcategories = [
        'borrow' => [
            'tools' => 'Tools & Equipment',
            'electronics' => 'Electronics',
            'books' => 'Books & Media',
            'sports' => 'Sports & Recreation',
            'home' => 'Home & Garden',
            'clothing' => 'Clothing & Accessories',
            'other' => 'Other'
        ],
        'rent' => [
            'vehicles' => 'Vehicles',
            'equipment' => 'Equipment',
            'spaces' => 'Spaces & Venues',
            'other' => 'Other'
        ],
        'services' => [
            'home' => 'Home Services',
            'personal' => 'Personal Services',
            'professional' => 'Professional Services',
            'other' => 'Other'
        ],
        'freelancing' => [
            'design' => 'Design & Creative',
            'tech' => 'Technology',
            'writing' => 'Writing & Content',
            'marketing' => 'Marketing',
            'other' => 'Other'
        ]
    ];
}
?>

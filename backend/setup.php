<?php
// NeighbourNet Database Setup Script

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/config.php';

echo "🚀 Setting up NeighbourNet Database...\n";

try {
    $database = new Database();
    $conn = $database->connect();

    echo "✅ Connected to database successfully\n";

    // Import schema.sql file instead of using initializeDatabase method
    $schema_file = __DIR__ . '/database/schema.sql';

    if (!file_exists($schema_file)) {
        throw new Exception("Schema file not found: $schema_file");
    }

    $schema_content = file_get_contents($schema_file);

    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $schema_content)));

    foreach ($statements as $statement) {
        if (!empty($statement) && !preg_match('/^--/', $statement)) {
            try {
                $conn->exec($statement);
            } catch (PDOException $e) {
                // Skip "database already exists" errors
                if (strpos($e->getMessage(), 'database exists') === false) {
                    throw $e;
                }
            }
        }
    }

    echo "✅ Database schema imported successfully\n";
    echo "✅ Tables created with sample data\n";

    // Create uploads directory
    $upload_dir = __DIR__ . '/../uploads';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
        echo "✅ Created uploads directory\n";
    }

    $support_upload_dir = $upload_dir . '/support';
    if (!is_dir($support_upload_dir)) {
        mkdir($support_upload_dir, 0755, true);
        echo "✅ Created support uploads directory\n";
    }

    echo "\n🎉 NeighbourNet backend setup completed successfully!\n";
    echo "\n📋 Next steps:\n";
    echo "1. Start your web server: python -m http.server 8000\n";
    echo "2. Test API endpoints: http://localhost:8000/neighbournet1/backend/api.php\n";
    echo "3. Access admin dashboard: http://localhost:8000/admin.html\n";
    echo "\n🔗 Sample API endpoints to test:\n";
    echo "• GET  /neighbournet1/backend/api.php - API status\n";
    echo "• GET  /neighbournet1/backend/api.php/items - List all items\n";
    echo "• GET  /neighbournet1/backend/api.php/categories - Get categories\n";
    echo "• POST /neighbournet1/backend/api.php/auth/login - User login\n";
    echo "• POST /neighbournet1/backend/api.php/auth/register - User registration\n";

} catch (Exception $e) {
    echo "❌ Setup failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>

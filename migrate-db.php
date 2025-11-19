<?php
// Migrate database to add image_url column
header('Content-Type: application/json');

try {
    $db_file = __DIR__ . '/neighbournet1.db';
    $mysqli = new PDO('sqlite:' . $db_file);
    $mysqli->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if image_url column exists
    $result = $mysqli->query("PRAGMA table_info(items)")->fetchAll(PDO::FETCH_ASSOC);
    $has_image_url = false;
    
    foreach ($result as $col) {
        if ($col['name'] === 'image_url') {
            $has_image_url = true;
            break;
        }
    }
    
    if (!$has_image_url) {
        // Add image_url column to items table
        $mysqli->exec("ALTER TABLE items ADD COLUMN image_url TEXT");
        echo json_encode(['success' => true, 'message' => 'Added image_url column to items table']);
    } else {
        echo json_encode(['success' => true, 'message' => 'image_url column already exists']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

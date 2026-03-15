<?php
$pdo = new PDO('sqlite:neighbournet1.db');

// Update Drill Machine with the image URL
$imageUrl = 'uploads/items/drill.jpg';
$stmt = $pdo->prepare('UPDATE items SET image_url = ? WHERE title = ?');
$stmt->execute([$imageUrl, 'Drill Machine']);

echo "✅ Drill Machine image added to database!\n";

// Verify it was added
$result = $pdo->prepare('SELECT title, image_url FROM items WHERE title = ?');
$result->execute(['Drill Machine']);
$item = $result->fetch(PDO::FETCH_ASSOC);

echo "\n=== VERIFICATION ===\n";
echo "Item: " . $item['title'] . "\n";
echo "Image URL: " . $item['image_url'] . "\n";
?>

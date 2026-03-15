<?php
$pdo = new PDO('sqlite:neighbournet1.db');

// Update Sofa Set with the image URL
$imageUrl = 'uploads/items/sofa.png';
$stmt = $pdo->prepare('UPDATE items SET image_url = ? WHERE title = ?');
$stmt->execute([$imageUrl, 'Sofa Set']);

echo "✅ Image added to database!\n";

// Verify it was added
$result = $pdo->prepare('SELECT title, image_url FROM items WHERE title = ?');
$result->execute(['Sofa Set']);
$item = $result->fetch(PDO::FETCH_ASSOC);

echo "\n=== VERIFICATION ===\n";
echo "Item: " . $item['title'] . "\n";
echo "Image URL: " . $item['image_url'] . "\n";
echo "\n✅ Done! Visit your website to see the image.\n";
?>

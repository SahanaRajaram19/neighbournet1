<?php
$pdo = new PDO('sqlite:neighbournet1.db');

// Update Bicycle with image
$stmt = $pdo->prepare('UPDATE items SET image_url = ? WHERE title = ?');
$stmt->execute(['uploads/items/bicycle.jpg', 'Bicycle']);

// Update Laptop with image
$stmt->execute(['uploads/items/laptop.jpg', 'Laptop']);

echo "✅ Bicycle image added\n";
echo "✅ Laptop image added\n";
?>

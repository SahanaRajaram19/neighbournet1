<?php
$pdo = new PDO('sqlite:neighbournet1.db');

// Update Study Table with image
$stmt = $pdo->prepare('UPDATE items SET image_url = ? WHERE title = ?');
$stmt->execute(['uploads/items/study-table.jpg', 'Study Table']);

echo "✅ Study Table image added\n";
?>

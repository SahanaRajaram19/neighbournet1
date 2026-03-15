<?php
$pdo = new PDO('sqlite:neighbournet1.db');
$stmt = $pdo->query('SELECT id, title, category FROM items ORDER BY id');
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "=== ITEMS IN DATABASE ===\n\n";
foreach($items as $item) {
    echo "ID: " . $item['id'] . " | Title: " . $item['title'] . " | Category: " . $item['category'] . "\n";
}
echo "\n=== END ===\n";
?>

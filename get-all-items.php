<?php
$pdo = new PDO('sqlite:neighbournet1.db');
$stmt = $pdo->query('SELECT id, title, category FROM items ORDER BY category');
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach($items as $item) {
    echo $item['id'] . ' | ' . $item['title'] . ' | ' . $item['category'] . PHP_EOL;
}

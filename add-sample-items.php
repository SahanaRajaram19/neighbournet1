<?php
$pdo = new PDO('sqlite:neighbournet1.db');

// Sample items to add
$items = [
    ['title' => 'Sofa Set', 'description' => 'Comfortable 3-seater sofa', 'category' => 'Furniture', 'price' => 500, 'condition' => 'Like New', 'status' => 'available', 'owner_id' => 1, 'owner_name' => 'John'],
    ['title' => 'Bicycle', 'description' => 'Mountain bike in good condition', 'category' => 'Sports', 'price' => 300, 'condition' => 'Good', 'status' => 'available', 'owner_id' => 1, 'owner_name' => 'John'],
    ['title' => 'Laptop', 'description' => 'HP Laptop 15.6 inches', 'category' => 'Electronics', 'price' => 1000, 'condition' => 'Excellent', 'status' => 'available', 'owner_id' => 2, 'owner_name' => 'Sarah'],
    ['title' => 'Drill Machine', 'description' => 'Electric power drill', 'category' => 'Tools', 'price' => 200, 'condition' => 'Good', 'status' => 'available', 'owner_id' => 1, 'owner_name' => 'John'],
    ['title' => 'Study Table', 'description' => 'Wooden study desk', 'category' => 'Furniture', 'price' => 400, 'condition' => 'Like New', 'status' => 'available', 'owner_id' => 2, 'owner_name' => 'Sarah'],
    ['title' => 'Programming Books Set', 'description' => 'Java, Python, C++ books', 'category' => 'Books', 'price' => 150, 'condition' => 'Good', 'status' => 'available', 'owner_id' => 3, 'owner_name' => 'Mike'],
];

$stmt = $pdo->prepare('INSERT INTO items (title, description, category, price, condition, status, owner_id, owner_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

foreach($items as $item) {
    $stmt->execute([
        $item['title'],
        $item['description'],
        $item['category'],
        $item['price'],
        $item['condition'],
        $item['status'],
        $item['owner_id'],
        $item['owner_name']
    ]);
}

echo "✅ Added sample items to database!\n";

// Now display them
$result = $pdo->query('SELECT id, title, category FROM items ORDER BY id');
$all_items = $result->fetchAll(PDO::FETCH_ASSOC);

echo "\n=== ITEMS IN DATABASE ===\n\n";
foreach($all_items as $item) {
    echo $item['id'] . ". " . $item['title'] . " (" . $item['category'] . ")\n";
}
?>

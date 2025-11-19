<?php
// Item Controller
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';

class ItemController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAll() {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = Config::$items_per_page;
        $offset = ($page - 1) * $limit;

        $category = $_GET['category'] ?? '';
        $location = $_GET['location'] ?? '';
        $min_price = $_GET['min_price'] ?? 0;
        $max_price = $_GET['max_price'] ?? 999999;
        $condition = $_GET['condition'] ?? '';
        $sort_by = $_GET['sort_by'] ?? 'created_at';
        $sort_order = $_GET['sort_order'] ?? 'DESC';

        // Build query
        $where_conditions = ["i.is_active = TRUE"];
        $params = [];

        if ($category) {
            $where_conditions[] = "i.category = ?";
            $params[] = $category;
        }

        if ($location) {
            $where_conditions[] = "i.location LIKE ?";
            $params[] = "%$location%";
        }

        if ($min_price > 0) {
            $where_conditions[] = "i.price_per_day >= ?";
            $params[] = $min_price;
        }

        if ($max_price < 999999) {
            $where_conditions[] = "i.price_per_day <= ?";
            $params[] = $max_price;
        }

        if ($condition) {
            $where_conditions[] = "i.condition = ?";
            $params[] = $condition;
        }

        $where_clause = implode(' AND ', $where_conditions);

        // Get total count
        $count_stmt = $this->db->prepare("
            SELECT COUNT(*) as total
            FROM items i
            WHERE $where_clause
        ");
        $count_stmt->execute($params);
        $total = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Get items
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $this->db->prepare("
            SELECT
                i.*,
                u.name as owner_name,
                u.avatar as owner_avatar,
                u.rating as owner_rating,
                u.total_transactions as owner_transactions,
                (SELECT AVG(rating) FROM reviews WHERE reviewee_id = u.id) as owner_avg_rating
            FROM items i
            JOIN users u ON i.user_id = u.id
            WHERE $where_clause
            ORDER BY i.$sort_by $sort_order
            LIMIT ? OFFSET ?
        ");

        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'items' => $items,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $limit),
                'total_items' => $total,
                'items_per_page' => $limit
            ]
        ]);
    }

    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT
                i.*,
                u.name as owner_name,
                u.avatar as owner_avatar,
                u.mobile as owner_mobile,
                u.rating as owner_rating,
                u.total_transactions as owner_transactions,
                u.aadhaar_verified,
                u.upi_verified
            FROM items i
            JOIN users u ON i.user_id = u.id
            WHERE i.id = ? AND i.is_active = TRUE
        ");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) {
            throw new Exception('Item not found', 404);
        }

        // Get item reviews
        $review_stmt = $this->db->prepare("
            SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.reviewee_id = ? AND r.transaction_id IN (
                SELECT id FROM transactions WHERE item_id = ?
            )
        ");
        $review_stmt->execute([$item['user_id'], $id]);
        $reviews = $review_stmt->fetchAll(PDO::FETCH_ASSOC);

        $item['reviews'] = $reviews;

        echo json_encode([
            'success' => true,
            'item' => $item
        ]);
    }

    public function create($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['title']) || !isset($data['category']) || !isset($data['price_per_day']) || !isset($data['location'])) {
            throw new Exception('Missing required fields', 400);
        }

        if (!is_numeric($data['price_per_day']) || $data['price_per_day'] <= 0) {
            throw new Exception('Invalid price', 400);
        }

        // Insert item
        $stmt = $this->db->prepare("
            INSERT INTO items (user_id, title, description, category, subcategory, price_per_day, location, condition, guidelines)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $user_id = $_SERVER['PHP_AUTH_USER'] ?? 1; // In real implementation, get from JWT token
        $description = $data['description'] ?? '';
        $subcategory = $data['subcategory'] ?? null;
        $condition = $data['condition'] ?? 'good';
        $guidelines = $data['guidelines'] ?? '';

        $stmt->execute([$user_id, $data['title'], $description, $data['category'], $subcategory, $data['price_per_day'], $data['location'], $condition, $guidelines]);

        $item_id = $this->db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Item created successfully',
            'item_id' => $item_id
        ]);
    }

    public function update($id, $data) {
        $data = AuthMiddleware::sanitizeInput($data);

        // Check if item exists and user owns it
        $stmt = $this->db->prepare("SELECT user_id FROM items WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) {
            throw new Exception('Item not found', 404);
        }

        $user_id = $_SERVER['PHP_AUTH_USER'] ?? 1; // Get from JWT token
        if ($item['user_id'] != $user_id) {
            throw new Exception('Unauthorized to update this item', 403);
        }

        // Build update query
        $fields = [];
        $values = [];

        foreach ($data as $key => $value) {
            if ($key !== 'id' && $value !== null) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }

        if (empty($fields)) {
            throw new Exception('No fields to update', 400);
        }

        $values[] = $id;
        $query = "UPDATE items SET " . implode(', ', $fields) . ", updated_at = CURRENT_TIMESTAMP WHERE id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->execute($values);

        echo json_encode([
            'success' => true,
            'message' => 'Item updated successfully'
        ]);
    }

    public function delete($id) {
        // Check if item exists and user owns it
        $stmt = $this->db->prepare("SELECT user_id FROM items WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) {
            throw new Exception('Item not found', 404);
        }

        $user_id = $_SERVER['PHP_AUTH_USER'] ?? 1; // Get from JWT token
        if ($item['user_id'] != $user_id) {
            throw new Exception('Unauthorized to delete this item', 403);
        }

        // Soft delete by setting is_active to false
        $stmt = $this->db->prepare("UPDATE items SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode([
            'success' => true,
            'message' => 'Item deleted successfully'
        ]);
    }

    public function search($query, $category = '', $location = '') {
        if (!$query && !$category && !$location) {
            throw new Exception('Search query, category, or location is required', 400);
        }

        $where_conditions = ["i.is_active = TRUE"];
        $params = [];

        if ($query) {
            $where_conditions[] = "(i.title LIKE ? OR i.description LIKE ?)";
            $params[] = "%$query%";
            $params[] = "%$query%";
        }

        if ($category) {
            $where_conditions[] = "i.category = ?";
            $params[] = $category;
        }

        if ($location) {
            $where_conditions[] = "i.location LIKE ?";
            $params[] = "%$location%";
        }

        $where_clause = implode(' AND ', $where_conditions);

        $stmt = $this->db->prepare("
            SELECT
                i.*,
                u.name as owner_name,
                u.avatar as owner_avatar,
                u.rating as owner_rating
            FROM items i
            JOIN users u ON i.user_id = u.id
            WHERE $where_clause
            ORDER BY
                CASE
                    WHEN i.title LIKE ? THEN 1
                    WHEN i.description LIKE ? THEN 2
                    ELSE 3
                END,
                i.created_at DESC
            LIMIT 20
        ");

        if ($query) {
            $params[] = "%$query%";
            $params[] = "%$query%";
        }

        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'items' => $items,
            'query' => $query,
            'total_results' => count($items)
        ]);
    }

    public function getCategories() {
        echo json_encode([
            'success' => true,
            'categories' => Config::$categories,
            'subcategories' => Config::$subcategories
        ]);
    }

    public function getUserItems($user_id) {
        $stmt = $this->db->prepare("
            SELECT * FROM items
            WHERE user_id = ? AND is_active = TRUE
            ORDER BY created_at DESC
        ");
        $stmt->execute([$user_id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'items' => $items
        ]);
    }
}
?>

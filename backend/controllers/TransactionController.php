<?php
// Transaction Controller
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';

class TransactionController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function create($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['item_id']) || !isset($data['start_date']) || !isset($data['end_date'])) {
            throw new Exception('Item ID, start date, and end date are required', 400);
        }

        // Validate dates
        $start_date = strtotime($data['start_date']);
        $end_date = strtotime($data['end_date']);
        $today = strtotime(date('Y-m-d'));

        if ($start_date < $today) {
            throw new Exception('Start date cannot be in the past', 400);
        }

        if ($end_date <= $start_date) {
            throw new Exception('End date must be after start date', 400);
        }

        // Get item details
        $stmt = $this->db->prepare("SELECT user_id, price_per_day FROM items WHERE id = ? AND is_active = TRUE");
        $stmt->execute([$data['item_id']]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) {
            throw new Exception('Item not found or unavailable', 404);
        }

        // Check if item is available for the requested dates
        $check_stmt = $this->db->prepare("
            SELECT id FROM transactions
            WHERE item_id = ? AND status NOT IN ('cancelled', 'completed')
            AND ((start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?) OR (? BETWEEN start_date AND end_date))
        ");
        $check_stmt->execute([
            $data['item_id'], $data['start_date'], $data['end_date'],
            $data['start_date'], $data['end_date'], $data['start_date']
        ]);

        if ($check_stmt->rowCount() > 0) {
            throw new Exception('Item is not available for the selected dates', 409);
        }

        $borrower_id = $_SERVER['PHP_AUTH_USER'] ?? 1; // Get from JWT token
        $owner_id = $item['user_id'];

        // Calculate total amount
        $days = ceil(($end_date - $start_date) / (24 * 60 * 60));
        $total_amount = $days * $item['price_per_day'];
        $security_deposit = $data['security_deposit'] ?? 500; // Default security deposit

        // Create transaction
        $stmt = $this->db->prepare("
            INSERT INTO transactions (item_id, borrower_id, owner_id, start_date, end_date, total_amount, security_deposit, pickup_location, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $pickup_location = $data['pickup_location'] ?? '';
        $notes = $data['notes'] ?? '';

        $stmt->execute([
            $data['item_id'], $borrower_id, $owner_id, $data['start_date'],
            $data['end_date'], $total_amount, $security_deposit, $pickup_location, $notes
        ]);

        $transaction_id = $this->db->lastInsertId();

        // Update item status
        $update_stmt = $this->db->prepare("UPDATE items SET availability_status = 'booked' WHERE id = ?");
        $update_stmt->execute([$data['item_id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Booking request sent successfully',
            'transaction_id' => $transaction_id,
            'total_amount' => $total_amount,
            'security_deposit' => $security_deposit
        ]);
    }

    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT
                t.*,
                i.title as item_title,
                i.images as item_images,
                i.location as item_location,
                owner.name as owner_name,
                owner.avatar as owner_avatar,
                owner.mobile as owner_mobile,
                borrower.name as borrower_name,
                borrower.avatar as borrower_avatar
            FROM transactions t
            JOIN items i ON t.item_id = i.id
            JOIN users owner ON t.owner_id = owner.id
            JOIN users borrower ON t.borrower_id = borrower.id
            WHERE t.id = ?
        ");
        $stmt->execute([$id]);
        $transaction = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$transaction) {
            throw new Exception('Transaction not found', 404);
        }

        echo json_encode([
            'success' => true,
            'transaction' => $transaction
        ]);
    }

    public function getUserTransactions() {
        $user_id = $_SERVER['PHP_AUTH_USER'] ?? 1; // Get from JWT token
        $type = $_GET['type'] ?? 'all'; // all, as_borrower, as_owner

        $where_conditions = [];
        $params = [];

        switch($type) {
            case 'as_borrower':
                $where_conditions[] = "t.borrower_id = ?";
                $params[] = $user_id;
                break;
            case 'as_owner':
                $where_conditions[] = "t.owner_id = ?";
                $params[] = $user_id;
                break;
            default:
                $where_conditions[] = "(t.borrower_id = ? OR t.owner_id = ?)";
                $params[] = $user_id;
                $params[] = $user_id;
        }

        $where_clause = implode(' AND ', $where_conditions);

        $stmt = $this->db->prepare("
            SELECT
                t.*,
                i.title as item_title,
                i.images as item_images,
                CASE
                    WHEN t.borrower_id = ? THEN owner.name
                    ELSE borrower.name
                END as other_party_name,
                CASE
                    WHEN t.borrower_id = ? THEN owner.avatar
                    ELSE borrower.avatar
                END as other_party_avatar
            FROM transactions t
            JOIN items i ON t.item_id = i.id
            JOIN users owner ON t.owner_id = owner.id
            JOIN users borrower ON t.borrower_id = borrower.id
            WHERE $where_clause
            ORDER BY t.created_at DESC
        ");

        $stmt->execute($params);
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'transactions' => $transactions
        ]);
    }

    public function updateStatus($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['transaction_id']) || !isset($data['status'])) {
            throw new Exception('Transaction ID and status are required', 400);
        }

        $valid_statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
        if (!in_array($data['status'], $valid_statuses)) {
            throw new Exception('Invalid status', 400);
        }

        // Get transaction details
        $stmt = $this->db->prepare("SELECT * FROM transactions WHERE id = ?");
        $stmt->execute([$data['transaction_id']]);
        $transaction = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$transaction) {
            throw new Exception('Transaction not found', 404);
        }

        $user_id = $_SERVER['PHP_AUTH_USER'] ?? 1; // Get from JWT token

        // Check if user is authorized (owner or borrower)
        if ($transaction['owner_id'] != $user_id && $transaction['borrower_id'] != $user_id) {
            throw new Exception('Unauthorized to update this transaction', 403);
        }

        // Update transaction status
        $stmt = $this->db->prepare("
            UPDATE transactions
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([$data['status'], $data['transaction_id']]);

        // If transaction is completed, update item availability and user stats
        if ($data['status'] === 'completed') {
            // Update item availability
            $update_stmt = $this->db->prepare("UPDATE items SET availability_status = 'available' WHERE id = ?");
            $update_stmt->execute([$transaction['item_id']]);

            // Update user transaction counts
            $this->updateUserStats($transaction['owner_id']);
            $this->updateUserStats($transaction['borrower_id']);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Transaction status updated successfully'
        ]);
    }

    public function cancel($id) {
        // Get transaction details
        $stmt = $this->db->prepare("SELECT * FROM transactions WHERE id = ?");
        $stmt->execute([$id]);
        $transaction = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$transaction) {
            throw new Exception('Transaction not found', 404);
        }

        $user_id = $_SERVER['PHP_AUTH_USER'] ?? 1; // Get from JWT token

        // Check if user is authorized
        if ($transaction['owner_id'] != $user_id && $transaction['borrower_id'] != $user_id) {
            throw new Exception('Unauthorized to cancel this transaction', 403);
        }

        // Can only cancel pending transactions
        if ($transaction['status'] !== 'pending') {
            throw new Exception('Only pending transactions can be cancelled', 400);
        }

        // Update transaction status
        $stmt = $this->db->prepare("
            UPDATE transactions
            SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([$id]);

        // Update item availability
        $update_stmt = $this->db->prepare("UPDATE items SET availability_status = 'available' WHERE id = ?");
        $update_stmt->execute([$transaction['item_id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Transaction cancelled successfully'
        ]);
    }

    public function addReview($data) {
        $data = AuthMiddleware::sanitizeInput($data);

        if (!isset($data['transaction_id']) || !isset($data['rating']) || !isset($data['review_text'])) {
            throw new Exception('Transaction ID, rating, and review text are required', 400);
        }

        if (!is_numeric($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
            throw new Exception('Rating must be between 1 and 5', 400);
        }

        // Get transaction details
        $stmt = $this->db->prepare("SELECT borrower_id, owner_id FROM transactions WHERE id = ?");
        $stmt->execute([$data['transaction_id']]);
        $transaction = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$transaction) {
            throw new Exception('Transaction not found', 404);
        }

        $user_id = $_SERVER['PHP_AUTH_USER'] ?? 1; // Get from JWT token

        // Determine reviewer and reviewee
        if ($transaction['borrower_id'] == $user_id) {
            $reviewer_id = $transaction['borrower_id'];
            $reviewee_id = $transaction['owner_id'];
        } elseif ($transaction['owner_id'] == $user_id) {
            $reviewer_id = $transaction['owner_id'];
            $reviewee_id = $transaction['borrower_id'];
        } else {
            throw new Exception('Unauthorized to review this transaction', 403);
        }

        // Check if review already exists
        $check_stmt = $this->db->prepare("
            SELECT id FROM reviews WHERE transaction_id = ? AND reviewer_id = ?
        ");
        $check_stmt->execute([$data['transaction_id'], $reviewer_id]);

        if ($check_stmt->rowCount() > 0) {
            throw new Exception('Review already exists for this transaction', 409);
        }

        // Insert review
        $stmt = $this->db->prepare("
            INSERT INTO reviews (transaction_id, reviewer_id, reviewee_id, rating, review_text)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$data['transaction_id'], $reviewer_id, $reviewee_id, $data['rating'], $data['review_text']]);

        // Update reviewee's rating
        $this->updateUserRating($reviewee_id);

        echo json_encode([
            'success' => true,
            'message' => 'Review added successfully'
        ]);
    }

    private function updateUserStats($user_id) {
        $stmt = $this->db->prepare("
            UPDATE users
            SET total_transactions = (
                SELECT COUNT(*) FROM transactions
                WHERE (owner_id = ? OR borrower_id = ?) AND status = 'completed'
            ),
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([$user_id, $user_id, $user_id]);
    }

    private function updateUserRating($user_id) {
        $stmt = $this->db->prepare("
            SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewee_id = ?
        ");
        $stmt->execute([$user_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $avg_rating = $result['avg_rating'] ?? 5.00;

        $update_stmt = $this->db->prepare("
            UPDATE users SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        ");
        $update_stmt->execute([round($avg_rating, 2), $user_id]);
    }

    public function getTransactionHistory($user_id, $limit = 10) {
        $stmt = $this->db->prepare("
            SELECT
                t.*,
                i.title as item_title,
                CASE
                    WHEN t.borrower_id = ? THEN 'borrowed'
                    ELSE 'lent'
                END as user_role,
                CASE
                    WHEN t.borrower_id = ? THEN owner.name
                    ELSE borrower.name
                END as other_party_name
            FROM transactions t
            JOIN items i ON t.item_id = i.id
            JOIN users owner ON t.owner_id = owner.id
            JOIN users borrower ON t.borrower_id = borrower.id
            WHERE (t.borrower_id = ? OR t.owner_id = ?) AND t.status = 'completed'
            ORDER BY t.end_date DESC
            LIMIT ?
        ");

        $stmt->execute([$user_id, $user_id, $user_id, $user_id, $limit]);
        $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'history' => $history
        ]);
    }
}
?>

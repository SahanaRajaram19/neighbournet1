-- NeighbourNet Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS neighbournet;
USE neighbournet;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    location VARCHAR(255),
    address TEXT,
    aadhaar VARCHAR(12),
    upi_id VARCHAR(255),
    avatar VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    upi_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_transactions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price_per_day DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    `condition` ENUM('excellent', 'good', 'fair') DEFAULT 'good',
    availability_status ENUM('available', 'booked', 'unavailable') DEFAULT 'available',
    images JSON,
    guidelines TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    borrower_id INT NOT NULL,
    owner_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    security_deposit DECIMAL(10,2) DEFAULT 0,
    pickup_location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('contact', 'report') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('normal', 'high', 'urgent') DEFAULT 'normal',
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    files JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    type ENUM('registration', 'login', 'password_reset') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_condition ON items(`condition`);
CREATE INDEX idx_transactions_item_id ON transactions(item_id);
CREATE INDEX idx_transactions_borrower_id ON transactions(borrower_id);
CREATE INDEX idx_transactions_owner_id ON transactions(owner_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_reviews_transaction_id ON reviews(transaction_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Insert sample data for testing
INSERT INTO users (name, email, password, mobile, location, is_verified, aadhaar_verified, upi_verified) VALUES
('John Doe', 'john.doe@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', '9876543210', 'Mumbai, Maharashtra', TRUE, TRUE, TRUE),
('Sarah Miller', 'sarah.miller@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', '9876543211', 'Mumbai, Maharashtra', TRUE, TRUE, FALSE),
('Mike Roberts', 'mike.roberts@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', '9876543212', 'Mumbai, Maharashtra', TRUE, FALSE, TRUE);

-- Insert sample items
INSERT INTO items (user_id, title, description, category, subcategory, price_per_day, location, `condition`, availability_status) VALUES
(2, 'Professional Power Drill', 'High-quality cordless drill perfect for home improvement projects, woodworking, and DIY tasks.', 'borrow', 'tools', 50.00, 'Andheri West, Mumbai', 'excellent', 'available'),
(2, '16ft Extension Ladder', 'Aluminum extension ladder, perfect for painting and repairs. Lightweight and easy to maneuver.', 'borrow', 'tools', 30.00, 'Andheri West, Mumbai', 'good', 'available'),
(3, 'Canon DSLR Camera Kit', 'Professional DSLR camera with multiple lenses for photography enthusiasts and events.', 'borrow', 'electronics', 200.00, 'Bandra West, Mumbai', 'excellent', 'available'),
(3, 'Yamaha Acoustic Guitar', 'Beautiful acoustic guitar in excellent condition, perfect for beginners and practice sessions.', 'borrow', 'other', 25.00, 'Bandra West, Mumbai', 'good', 'available');

-- Insert sample transactions
INSERT INTO transactions (item_id, borrower_id, owner_id, start_date, end_date, total_amount, status, security_deposit) VALUES
(1, 1, 2, '2024-12-15', '2024-12-17', 100.00, 'completed', 500.00),
(2, 1, 2, '2024-12-10', '2024-12-12', 60.00, 'completed', 300.00);

-- Insert sample reviews
INSERT INTO reviews (transaction_id, reviewer_id, reviewee_id, rating, review_text) VALUES
(1, 1, 2, 5, 'Excellent drill! Worked perfectly for my home renovation project. John was very helpful and explained everything clearly.'),
(1, 2, 1, 5, 'Great borrower! Took good care of the drill and returned it in perfect condition.'),
(2, 1, 2, 4, 'Ladder was exactly as described. Good quality and very useful for my painting project.'),
(2, 2, 1, 4, 'Reliable and trustworthy borrower. Would definitely lend to again.');

-- Update user ratings based on reviews
UPDATE users SET rating = (
    SELECT AVG(rating) FROM reviews WHERE reviewee_id = users.id
) WHERE id IN (1, 2, 3);

-- Update transaction counts
UPDATE users SET total_transactions = (
    SELECT COUNT(*) FROM transactions
    WHERE (owner_id = users.id OR borrower_id = users.id) AND status = 'completed'
) WHERE id IN (1, 2, 3);

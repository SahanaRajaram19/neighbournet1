# NeighbourNet Backend API

A comprehensive PHP/MySQL backend API for the NeighbourNet platform, providing user authentication, item management, transaction handling, and support features.

## 🚀 Features

- **User Management**: Registration, authentication, profile management
- **Item Management**: CRUD operations for borrowing/lending items
- **Transaction System**: Booking, status tracking, reviews
- **Support System**: Contact forms and issue reporting
- **File Upload**: Image and document handling
- **JWT Authentication**: Secure token-based authentication
- **MySQL Database**: Complete schema with sample data

## 📋 Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx) with PHP support
- Composer (optional, for dependencies)

## 🛠️ Installation & Setup

### 1. Database Setup

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE neighbournet;
   ```

2. **Run Setup Script**:
   ```bash
   # Navigate to backend directory
   cd backend

   # Run the setup script
   php setup.php
   ```

   Or manually execute the SQL schema:
   ```bash
   mysql -u root -p neighbournet < database/schema.sql
   ```

### 2. Configuration

Update `backend/config/database.php` if needed:
```php
private $host = 'localhost';
private $db_name = 'neighbournet';
private $username = 'root';
private $password = 'your_password';
```

### 3. Directory Structure

```
backend/
├── api.php                 # Main API entry point
├── setup.php              # Database initialization script
├── config/
│   ├── database.php       # Database configuration
│   └── config.php         # Application settings
├── controllers/
│   ├── UserController.php      # User management
│   ├── ItemController.php      # Item operations
│   ├── TransactionController.php # Transaction handling
│   └── SupportController.php   # Support system
├── middleware/
│   └── auth.php           # Authentication middleware
└── database/
    └── schema.sql         # Complete database schema
```

## 🔗 API Endpoints

### Base URL
```
http://localhost/neighbournet1/backend/api.php
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "9876543210",
    "password": "password123",
    "location": "Mumbai, Maharashtra",
    "aadhaar": "1234-5678-9012",
    "upi_id": "john@upi"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "john.doe@example.com",
    "password": "password123"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
    "mobile": "9876543210",
    "otp": "123456"
}
```

### Item Endpoints

#### Get All Items
```http
GET /items?page=1&category=borrow&location=Mumbai
```

#### Get Item by ID
```http
GET /items/{id}
```

#### Create Item
```http
POST /items
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Professional Power Drill",
    "description": "High-quality cordless drill...",
    "category": "borrow",
    "subcategory": "tools",
    "price_per_day": 50.00,
    "location": "Andheri West, Mumbai",
    "condition": "excellent"
}
```

#### Search Items
```http
GET /search?q=drill&category=borrow&location=Mumbai
```

### Transaction Endpoints

#### Create Transaction
```http
POST /transactions/create
Authorization: Bearer {token}
Content-Type: application/json

{
    "item_id": 1,
    "start_date": "2024-12-15",
    "end_date": "2024-12-17",
    "pickup_location": "Owner's location",
    "notes": "Please handle with care"
}
```

#### Get User Transactions
```http
GET /transactions?type=all
Authorization: Bearer {token}
```

#### Update Transaction Status
```http
POST /transactions/update-status
Authorization: Bearer {token}
Content-Type: application/json

{
    "transaction_id": 1,
    "status": "completed"
}
```

### Support Endpoints

#### Submit Contact Form
```http
POST /support/contact
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "subject": "General Inquiry",
    "message": "I have a question about...",
    "priority": "normal"
}
```

#### Submit Issue Report
```http
POST /support/report
Content-Type: application/json

{
    "type": "scam",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "description": "Suspicious activity...",
    "urgent": false
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get a token
2. **Include token** in Authorization header:
   ```
   Authorization: Bearer your-jwt-token-here
   ```
3. **Token expires** after 1 hour (configurable)

## 📁 File Upload

#### Upload Files
```http
POST /upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (binary file data)
```

**Supported formats**: JPG, PNG, GIF, PDF
**Max size**: 5MB per file

## 🗄️ Database Schema

### Users Table
- User registration and profile management
- Verification status tracking
- Rating and transaction history

### Items Table
- Item listings with categories and pricing
- Availability status and location
- Owner information and guidelines

### Transactions Table
- Booking requests and status tracking
- Payment and security deposit handling
- Date management and notes

### Reviews Table
- User-to-user rating system
- Transaction-based reviews
- Rating aggregation

### Support Tickets Table
- Contact form submissions
- Issue reports with priority levels
- File attachment support

## 🔧 Configuration Options

### Database Settings
```php
// backend/config/database.php
private $host = 'localhost';
private $db_name = 'neighbournet';
private $username = 'root';
private $password = '';
```

### JWT Settings
```php
// backend/config/config.php
public static $jwt_secret = 'your-super-secret-jwt-key';
public static $jwt_expiry = 3600; // 1 hour
```

### File Upload Settings
```php
public static $upload_dir = __DIR__ . '/../uploads/';
public static $max_file_size = 5 * 1024 * 1024; // 5MB
```

## 🚨 Error Handling

All API endpoints return JSON responses:

**Success Response:**
```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": { ... }
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Error description",
    "code": 400
}
```

## 🧪 Testing the API

### Using cURL

```bash
# Test API status
curl http://localhost/neighbournet1/backend/api.php

# Get all items
curl http://localhost/neighbournet1/backend/api.php/items

# Register user
curl -X POST http://localhost/neighbournet1/backend/api.php/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","mobile":"9876543210","password":"password123"}'

# Login
curl -X POST http://localhost/neighbournet1/backend/api.php/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Using Postman

1. Import the provided Postman collection
2. Set base URL to `http://localhost/neighbournet1/backend/api.php`
3. Test endpoints with proper authentication headers

## 🔒 Security Features

- **Input Sanitization**: All user inputs are sanitized
- **Password Hashing**: Bcrypt hashing for passwords
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Configurable request rate limiting
- **File Upload Validation**: Type and size restrictions
- **SQL Injection Prevention**: Prepared statements throughout

## 📧 Email Integration (Optional)

For production use, configure SMTP settings in `config/config.php`:

```php
public static $smtp_host = 'smtp.gmail.com';
public static $smtp_port = 587;
public static $smtp_username = 'your-email@gmail.com';
public static $smtp_password = 'your-app-password';
```

## 🚀 Deployment

1. **Upload files** to your web server
2. **Configure database** connection settings
3. **Set up file permissions** for upload directories
4. **Configure web server** to handle PHP files
5. **Set environment variables** for production secrets
6. **Test all endpoints** before going live

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL server is running
   - Verify database credentials
   - Ensure database exists

2. **File Upload Not Working**
   - Check upload directory permissions
   - Verify file size limits in PHP configuration
   - Ensure proper Content-Type headers

3. **JWT Token Issues**
   - Check JWT secret key configuration
   - Verify token expiration settings
   - Ensure proper Authorization header format

## 📞 Support

For technical support or questions:
- Email: support@neighbournet.com
- Documentation: [Link to docs]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the NeighbourNet community**

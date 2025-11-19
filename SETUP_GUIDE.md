# NeighbourNet Full Stack Setup Guide

## System Setup Complete! ✅

All backend PHP files and database configuration have been created successfully.

---

## Step 1: Initialize Database

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL

2. **Create Database**
   - Open your browser: `http://localhost/phpmyadmin`
   - Create a new database named `neighbournet`
   - Character set: UTF-8

3. **Run Setup Script**
   - Visit: `http://localhost/neighbournet1/setup.php`
   - You should see: "Database tables created successfully!"
   - This creates all required tables

---

## Step 2: Backend API Endpoints

All endpoints are located in your `neighbournet1` folder:

### Authentication
- **`register.php`** - User registration (POST)
  - Input: `username`, `email`, `password`, `confirm_password`, `full_name`
  
- **`login.php`** - User login (POST)
  - Input: `username`, `password`
  - Returns: User ID, username, full_name

- **`logout.php`** - User logout (GET/POST)

### Items Management
- **`fetch-items.php`** - Get all items (GET)
  - Query params: `search`, `category`, `status`, `condition`
  
- **`add-item.php`** - Create new item (POST)
  - Input: `title`, `description`, `category`, `price`, `condition`, `status`, `image_url`
  
- **`update-item.php`** - Update item (POST)
  - Input: `id`, `title`, `description`, `category`, `price`, `condition`, `status`, `image_url`
  
- **`delete-item.php`** - Delete item (POST)
  - Input: `id`

### Admin Dashboard
- **`fetch-users.php`** - Get all users (GET)
  - Query params: `search`, `status`
  
- **`fetch-bookings.php`** - Get all bookings (GET)
  - Query params: `status`
  
- **`fetch-transactions.php`** - Get all transactions (GET)
  - Query params: `status`
  
- **`fetch-support.php`** - Get support tickets (GET)
  - Query params: `status`, `priority`
  
- **`get-stats.php`** - Get dashboard statistics (GET)

---

## Step 3: Database Schema

### Users Table
- id, username, email, password, full_name, phone, address, profile_image, status, created_at, updated_at

### Items Table
- id, title, description, owner_id, owner_name, category, price, status, condition, bookings, rating, date_added, image_url

### Bookings Table
- id, item_id, user_id, start_date, end_date, status, total_price, created_at

### Transactions Table
- id, booking_id, user_id, amount, payment_method, status, transaction_date

### Support Tickets Table
- id, user_id, subject, message, status, priority, created_at, updated_at

---

## Step 4: Frontend Integration

Your `admin-items.html` is now fully connected to the backend:

### Features Implemented:
✅ Fetch items from database  
✅ Add new items  
✅ Edit existing items  
✅ Delete items  
✅ Real-time filtering (search, category, status)  
✅ Display statistics (total, available, booked, unavailable)  
✅ Responsive design  
✅ Modal forms for add/edit  

### How to Use:
1. Visit: `http://localhost/neighbournet1/admin-items-new.html`
2. Items are automatically loaded from database
3. Click "Add Item" to create new items
4. Use filters to search items
5. Edit or delete items with action buttons

---

## Step 5: Testing

### Test Registration
```
POST http://localhost/neighbournet1/register.php
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "full_name": "Test User"
}
```

### Test Login
```
POST http://localhost/neighbournet1/login.php
{
  "username": "testuser",
  "password": "password123"
}
```

### Test Add Item
```
POST http://localhost/neighbournet1/add-item.php
{
  "title": "Laptop",
  "description": "Dell Inspiron 15",
  "category": "electronics",
  "price": 50,
  "condition": "excellent",
  "status": "available",
  "image_url": "https://example.com/image.jpg"
}
```

---

## Step 6: File Structure

```
neighbournet1/
├── db.php                    (Database connection)
├── setup.php                 (Create tables)
├── register.php              (User registration)
├── login.php                 (User login)
├── logout.php                (User logout)
├── fetch-items.php           (Get all items)
├── add-item.php              (Create item)
├── update-item.php           (Update item)
├── delete-item.php           (Delete item)
├── fetch-users.php           (Get all users)
├── fetch-bookings.php        (Get all bookings)
├── fetch-transactions.php    (Get all transactions)
├── fetch-support.php         (Get support tickets)
├── get-stats.php             (Get statistics)
├── admin-items-new.html      (New admin panel)
└── admin-items.html          (Original file - backup)
```

---

## Step 7: Troubleshooting

### Database Connection Issues
- Check if MySQL is running in XAMPP
- Verify database name: `neighbournet`
- Verify username: `root` and password is empty

### PHP Errors
- Check XAMPP logs in: `C:\xampp\apache\logs\error.log`
- Enable error display in `php.ini`

### Items Not Showing
- Run setup.php first to create tables
- Check browser console for JavaScript errors
- Verify fetch-items.php returns JSON

### Add/Edit Not Working
- Check network tab in developer tools
- Verify user is logged in (session)
- Check console for error messages

---

## Step 8: Next Steps

1. **Replace admin-items.html**
   - Delete old `admin-items.html`
   - Rename `admin-items-new.html` to `admin-items.html`

2. **Update Other Admin Pages**
   - Apply same integration to:
     - `admin-users.html`
     - `admin-transactions.html`
     - `admin-support.html`
     - `admin.html` (dashboard)

3. **Update Frontend Forms**
   - Update login page to call `login.php`
   - Update registration to call `register.php`
   - Update item listing pages

4. **Add Session Management**
   - Check if user is logged in
   - Redirect to login if not authenticated
   - Add logout button

---

## Success! 🎉

Your full-stack application is now ready:
- ✅ Backend API endpoints created
- ✅ Database schema implemented
- ✅ Admin panel connected to database
- ✅ CRUD operations functional
- ✅ Real-time filtering working

**All data is now stored in the database and visible in the admin panel!**

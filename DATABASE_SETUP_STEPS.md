# Complete Database Setup Guide (From Start)

## 📋 Database Tables (WITHOUT Transactions)

Your database will have these tables:
1. **Users** - Store user information
2. **Items** - Store items for borrowing/renting
3. **Bookings** - Store booking information
4. **Support Tickets** - Store support requests

---

## ✅ STEP-BY-STEP SETUP

### **STEP 1: Start XAMPP** 
**Time: 2 minutes**

1. Open **XAMPP Control Panel**
   - Windows: Search "XAMPP Control Panel" in Start Menu
   - Or open: `C:\xampp\xampp-control.exe`

2. **Start Apache**
   - Find the row with "Apache"
   - Click the **Start** button
   - Wait until it shows **GREEN background**

3. **Start MySQL**
   - Find the row with "MySQL"
   - Click the **Start** button
   - Wait until it shows **GREEN background**

**Expected Result:**
```
Apache          [Stop] [Admin]  ← GREEN
MySQL           [Stop] [Admin]  ← GREEN
```

---

### **STEP 2: Open phpMyAdmin**
**Time: 1 minute**

1. Open your web browser (Chrome, Firefox, Edge)
2. Go to: `http://localhost/phpmyadmin`
3. **Left side**, you should see "New" button at the top
4. If you see login screen, use:
   - Username: `root`
   - Password: (leave blank)
   - Click **Go**

**Expected Result:** You see phpMyAdmin interface with database list on the left

---

### **STEP 3: Create Database**
**Time: 2 minutes**

1. In phpMyAdmin, click **New** button (top left)
2. In "Database name:" field, type: `neighbournet`
3. In "Collation:" dropdown, select: `utf8mb4_unicode_ci`
4. Click **Create** button

**Expected Result:** 
- Success message appears
- `neighbournet` database shows in left sidebar

---

### **STEP 4: Create All Tables Automatically**
**Time: 1 minute**

1. Open new browser tab
2. Go to: `http://localhost/neighbournet1/setup.php`
3. **Wait for page to load**

**Expected Result:**
```
{"success":true,"message":"Database tables created successfully! Tables: users, items, bookings, support_tickets"}
```

If you see an error, go back to Step 1 and verify MySQL is running.

---

### **STEP 5: Verify Database Created**
**Time: 2 minutes**

1. Go back to phpMyAdmin: `http://localhost/phpmyadmin`
2. **Left sidebar**, click on `neighbournet` database
3. You should see 4 tables:
   - `users`
   - `items`
   - `bookings`
   - `support_tickets`

**Expected Result:**
```
Database: neighbournet
├── users
├── items
├── bookings
└── support_tickets
```

Click on each table to view its structure.

---

### **STEP 6: Test Backend Connection**
**Time: 2 minutes**

1. Open new browser tab
2. Go to: `http://localhost/neighbournet1/test.php`

**Expected Result:** You should see all green checkmarks:
```
✓ Database Connection: Connected to neighbournet
✓ Users Table: 0 users
✓ Items Table: 0 items
✓ Recent Items: No items found
✓ Recent Users: No users found
```

If all green → **Backend is connected!** ✅

---

### **STEP 7: Test Admin Panel**
**Time: 3 minutes**

1. Open new browser tab
2. Go to: `http://localhost/neighbournet1/admin-items-new.html`

**You should see:**
- Admin dashboard with stats
- Empty items table
- "Add Item" button

3. **Click "Add Item" button**
4. **Fill in the form:**
   - Item Title: `Test Laptop`
   - Description: `A test item`
   - Category: `Electronics`
   - Price: `50`
   - Condition: `Good`
   - Status: `Available`

5. **Click "Save Item"**

**Expected Result:**
- Success message appears
- Item shows up in table immediately
- Statistics update (Total Items: 1)

---

### **STEP 8: Verify Item in Database**
**Time: 2 minutes**

1. Go back to phpMyAdmin: `http://localhost/phpmyadmin`
2. Click on `neighbournet` database
3. Click on `items` table
4. **You should see your test item** with all details

**Expected Result:**
```
id  title         description    category      price  status
1   Test Laptop   A test item    Electronics   50     available
```

---

### **STEP 9: Test More Features**
**Time: 5 minutes**

#### Test Adding Multiple Items:
1. Go to admin panel: `http://localhost/neighbournet1/admin-items-new.html`
2. Add 3-4 more test items with different categories
3. Verify all appear in the table

#### Test Searching:
1. Type in search box: "laptop"
2. Only items with "laptop" should show

#### Test Filtering:
1. Select Category: "Electronics"
2. Only electronic items should show

#### Test Editing:
1. Click edit icon (pencil) on any item
2. Change the price
3. Click Save
4. Verify price updated

#### Test Deleting:
1. Click delete icon (trash) on any item
2. Click OK to confirm
3. Item should disappear from table

---

### **STEP 10: Verify Everything in Database**
**Time: 2 minutes**

1. Go to phpMyAdmin
2. Check `items` table - all your items should be there
3. Check `users` table - empty (no registrations yet)
4. Check `bookings` table - empty (no bookings yet)
5. Check `support_tickets` table - empty (no tickets yet)

---

## 📊 Database Schema

### **Users Table**
```
id              - Auto ID
username        - Unique username
email           - Unique email
password        - Hashed password
full_name       - User's full name
phone           - Phone number
address         - User's address
profile_image   - Profile image URL
status          - active/inactive/blocked
created_at      - Registration date
updated_at      - Last updated date
```

### **Items Table**
```
id              - Auto ID
title           - Item name
description     - Item details
owner_id        - User who owns item
owner_name      - Owner's name
category        - Item category
price           - Daily rental price
status          - available/booked/unavailable
condition       - excellent/good/fair/poor
bookings        - Number of bookings
rating          - Item rating
date_added      - When item was added
image_url       - Item image URL
```

### **Bookings Table**
```
id              - Auto ID
item_id         - Which item is booked
user_id         - Who booked it
start_date      - Booking start date
end_date        - Booking end date
status          - pending/approved/rejected/completed/cancelled
total_price     - Total cost
created_at      - Booking date
```

### **Support Tickets Table**
```
id              - Auto ID
user_id         - Who created ticket
subject         - Ticket subject
message         - Ticket message
status          - open/in_progress/resolved/closed
priority        - low/medium/high
created_at      - When created
updated_at      - Last updated
```

---

## 🔗 Backend API Endpoints

All files are in: `C:\xampp\htdocs\neighbournet1\`

### **Users**
- `register.php` - Create new user
- `login.php` - User login
- `logout.php` - User logout
- `fetch-users.php` - Get all users

### **Items**
- `fetch-items.php` - Get all items
- `add-item.php` - Create item
- `update-item.php` - Update item
- `delete-item.php` - Delete item

### **Admin**
- `fetch-bookings.php` - Get all bookings
- `fetch-support.php` - Get support tickets
- `get-stats.php` - Get dashboard stats

---

## 🎯 Quick Reference

| Action | URL |
|--------|-----|
| PHPMyAdmin | http://localhost/phpmyadmin |
| Setup Script | http://localhost/neighbournet1/setup.php |
| Test Page | http://localhost/neighbournet1/test.php |
| Admin Panel | http://localhost/neighbournet1/admin-items-new.html |
| XAMPP Control | C:\xampp\xampp-control.exe |

---

## ✅ Checklist

- [ ] XAMPP Apache running (green)
- [ ] XAMPP MySQL running (green)
- [ ] Created `neighbournet` database
- [ ] Setup script ran successfully
- [ ] Verified 4 tables exist
- [ ] Test page shows all green
- [ ] Admin panel loads
- [ ] Added test item
- [ ] Item appears in database
- [ ] Can search items
- [ ] Can filter items
- [ ] Can edit items
- [ ] Can delete items

**All checked? Congratulations! 🎉 Your database and backend are fully operational!**

---

## ⚠️ Troubleshooting

### MySQL Not Starting
- Check if port 3306 is already in use
- Try restarting XAMPP
- Check logs: `C:\xampp\mysql\data\mysql_error.log`

### Setup.php Shows Error
- Verify MySQL is running (green in XAMPP)
- Verify database `neighbournet` was created
- Check phpMyAdmin can connect

### Admin Panel Not Loading Items
- Open browser developer tools (F12)
- Check Console tab for errors
- Verify fetch-items.php returns JSON

### Can't Connect to phpMyAdmin
- Verify Apache is running (green)
- Try: `http://localhost/phpmyadmin`
- If still error, restart Apache

---

**Need Help? Check the error message and refer back to the corresponding step!**

# Quick Command Reference

## 🚀 FASTEST WAY TO GET STARTED

### Copy & Paste These Steps

#### Step 1: Start Everything
```
1. Open: C:\xampp\xampp-control.exe
2. Click Start on Apache (wait for GREEN)
3. Click Start on MySQL (wait for GREEN)
```

#### Step 2: Create Database
```
1. Open browser: http://localhost/phpmyadmin
2. Click: New
3. Type name: neighbournet
4. Select collation: utf8mb4_unicode_ci
5. Click: Create
```

#### Step 3: Create Tables
```
1. Open: http://localhost/neighbournet1/setup.php
2. Wait for success message
```

#### Step 4: Test Connection
```
1. Open: http://localhost/neighbournet1/test.php
2. Verify all green checkmarks
```

#### Step 5: Use Admin Panel
```
1. Open: http://localhost/neighbournet1/admin-items-new.html
2. Click: Add Item
3. Fill form, Save
4. Done!
```

---

## 📋 FILES STRUCTURE

```
C:\xampp\htdocs\neighbournet1\
│
├── BACKEND FILES
│   ├── db.php                    ← Database connection
│   ├── setup.php                 ← Create tables (run once)
│   ├── register.php              ← User registration
│   ├── login.php                 ← User login
│   ├── logout.php                ← User logout
│   ├── fetch-items.php           ← Get all items
│   ├── add-item.php              ← Create item
│   ├── update-item.php           ← Update item
│   ├── delete-item.php           ← Delete item
│   ├── fetch-users.php           ← Get users
│   ├── fetch-bookings.php        ← Get bookings
│   ├── fetch-support.php         ← Get support
│   └── get-stats.php             ← Get statistics
│
├── FRONTEND FILES
│   ├── admin-items-new.html      ← NEW ADMIN PANEL ⭐
│   └── admin-items.html          ← OLD ADMIN (backup)
│
├── TESTING FILES
│   └── test.php                  ← Test connection
│
└── DOCUMENTATION FILES
    ├── README.md                 ← Start here!
    ├── QUICK_START.md            ← 10 steps
    ├── CHECKLIST.md              ← Follow this
    ├── DATABASE_SETUP_STEPS.md   ← Detailed guide
    ├── COMPLETE_REFERENCE.md     ← Full reference
    ├── VISUAL_GUIDE.md           ← With diagrams
    ├── SETUP_GUIDE.md            ← Comprehensive
    └── SETUP_DATABASE.md         ← This file
```

---

## 🎯 URLS TO BOOKMARK

```
XAMPP Control
C:\xampp\xampp-control.exe

Admin Panel (USE THIS)
http://localhost/neighbournet1/admin-items-new.html

Database Management
http://localhost/phpmyadmin

Setup Script (Run once)
http://localhost/neighbournet1/setup.php

Test Connection
http://localhost/neighbournet1/test.php
```

---

## 📊 DATABASE TABLES

### users (11 columns)
```
id, username, email, password, full_name, phone, address, 
profile_image, status, created_at, updated_at
```

### items (13 columns)
```
id, title, description, owner_id, owner_name, category, price, 
status, condition, bookings, rating, date_added, image_url
```

### bookings (8 columns)
```
id, item_id, user_id, start_date, end_date, status, 
total_price, created_at
```

### support_tickets (8 columns)
```
id, user_id, subject, message, status, priority, 
created_at, updated_at
```

---

## 🔗 API ENDPOINTS (All in neighbournet1 folder)

### User Operations
- `POST register.php` - Create user
- `POST login.php` - Login user
- `GET logout.php` - Logout user
- `GET fetch-users.php` - Get all users

### Item Operations
- `GET fetch-items.php` - Get items
- `POST add-item.php` - Create item
- `POST update-item.php` - Update item
- `POST delete-item.php` - Delete item

### Booking Operations
- `GET fetch-bookings.php` - Get bookings
- `POST add-booking.php` - Create booking (if added)

### Support & Admin
- `GET fetch-support.php` - Get tickets
- `GET get-stats.php` - Get statistics

---

## ✅ VERIFICATION CHECKLIST

Quick check after setup:

- [ ] Apache running (GREEN)
- [ ] MySQL running (GREEN)
- [ ] neighbournet database created
- [ ] 4 tables created
- [ ] test.php shows all green
- [ ] Admin panel loads items
- [ ] Can add items
- [ ] Items save to database
- [ ] Search works
- [ ] Filters work
- [ ] Edit works
- [ ] Delete works

---

## 🆘 QUICK FIXES

### MySQL Not Starting
```
1. Close XAMPP
2. Open Task Manager
3. Find mysqld.exe, End Task
4. Reopen XAMPP, Start MySQL
```

### Setup.php Error
```
1. Create neighbournet database first
2. Then run setup.php
3. Or delete database and try again
```

### Admin Panel Shows No Items
```
1. Press F12 (open developer tools)
2. Check Console tab for errors
3. Make sure test.php works
4. Refresh the page
```

### Can't Open phpMyAdmin
```
1. Verify Apache is GREEN
2. Try: http://localhost/phpmyadmin
3. Restart Apache
```

---

## 📱 DAILY USE

### Start Development
```
1. Open XAMPP Control
2. Start Apache
3. Start MySQL
4. Open Admin Panel: http://localhost/neighbournet1/admin-items-new.html
5. Start building!
```

### Check Database
```
1. Open: http://localhost/phpmyadmin
2. Click: neighbournet database
3. Click: table name (users, items, etc.)
4. View data
```

### Test Changes
```
1. Open: http://localhost/neighbournet1/test.php
2. Should show 4 green checkmarks
3. Ready to go!
```

### Add Test Data
```
1. Open Admin Panel
2. Click: Add Item
3. Fill form
4. Save
5. Item appears both in panel and database
```

---

## 🎓 LEARNING RESOURCES

### Understanding the System

**Frontend to Backend:**
```
User clicks "Add Item" in Admin Panel
          ↓
JavaScript sends data to add-item.php
          ↓
PHP validates and saves to database
          ↓
Response sent back to JavaScript
          ↓
Admin Panel refreshes and fetches fresh data
          ↓
User sees item immediately
```

**Data Storage:**
```
All user data → users table
All item data → items table
All bookings → bookings table
All support tickets → support_tickets table
```

**Real-Time Updates:**
```
When you add/edit/delete in Admin Panel
→ Database updates immediately
→ Admin Panel fetches fresh data
→ Page refreshes with new data
```

---

## 🚀 WHAT'S INCLUDED

### Complete Backend
- ✅ Database connection
- ✅ User authentication
- ✅ Item management (CRUD)
- ✅ Booking system
- ✅ Support tickets
- ✅ Admin statistics

### Complete Frontend
- ✅ Admin panel with dashboard
- ✅ Real-time item management
- ✅ Advanced search & filtering
- ✅ Live statistics
- ✅ Responsive design

### Complete Documentation
- ✅ Quick start guide
- ✅ Step-by-step setup
- ✅ Visual guides
- ✅ Complete reference
- ✅ Troubleshooting

---

## ⚡ TIME ESTIMATES

| Task | Time |
|------|------|
| Start XAMPP | 2 min |
| Create database | 2 min |
| Create tables | 1 min |
| Test connection | 1 min |
| Add test item | 2 min |
| **Total Setup** | **~8 min** |

---

## 🎉 YOU'RE READY!

Everything is set up and working.

**Next Step:** Open your admin panel and start adding items!

```
URL: http://localhost/neighbournet1/admin-items-new.html
```

---

## 💬 REMEMBER

- All data is stored in the database
- Real-time synchronization working
- Admin panel fully functional
- Backend API ready
- Everything is integrated

**Start building your application! 🚀**

# Visual Step-by-Step Setup Guide

## STEP 1: START XAMPP ⭐

```
┌─────────────────────────────────────┐
│      XAMPP Control Panel            │
├─────────────────────────────────────┤
│ Apache                              │
│   Port: 80                          │
│   [Start]  [Stop]  [Admin]          │
│   Status: RUNNING ✓ GREEN           │
├─────────────────────────────────────┤
│ MySQL                               │
│   Port: 3306                        │
│   [Start]  [Stop]  [Admin]          │
│   Status: RUNNING ✓ GREEN           │
└─────────────────────────────────────┘
```

**Action:**
1. Open XAMPP Control Panel
2. Click Start for Apache (wait for GREEN)
3. Click Start for MySQL (wait for GREEN)

---

## STEP 2: OPEN phpMyAdmin 🔐

```
Browser URL: http://localhost/phpmyadmin

┌────────────────────────────────────────┐
│         phpMyAdmin                     │
├────────────────────────────────────────┤
│                                        │
│  Username: root                        │
│  Password: [leave blank]               │
│                                        │
│           [Go]                         │
│                                        │
└────────────────────────────────────────┘
```

**Action:**
1. Open browser
2. Go to: http://localhost/phpmyadmin
3. Login (username: root, password: blank)

---

## STEP 3: CREATE DATABASE 📊

```
Browser: http://localhost/phpmyadmin

┌──────────────────────────────────────────┐
│ Left Sidebar          │   Main Area      │
├──────────────────────────────────────────┤
│                       │ New Database     │
│ [+] New              │ Name: ___________│
│                       │ neighbournet    │
│ information_schema   │                  │
│ mysql                 │ Collation:      │
│ performance_schema   │ utf8mb4_unicode_│
│ phpmyadmin           │      _ci ✓      │
│ test                 │                  │
│                       │   [Create]      │
└──────────────────────────────────────────┘
```

**Action:**
1. Click "New" button
2. Database name: neighbournet
3. Collation: utf8mb4_unicode_ci
4. Click Create

**Result:**
```
Left Sidebar:
├── information_schema
├── mysql
├── neighbournet  ← NEW!
└── phpmyadmin
```

---

## STEP 4: CREATE TABLES 📋

```
Browser: http://localhost/neighbournet1/setup.php

┌─────────────────────────────────────────┐
│          Response:                      │
│                                         │
│ {                                       │
│   "success": true,                      │
│   "message": "Database tables          │
│    created successfully! Tables:        │
│    users, items, bookings,              │
│    support_tickets"                     │
│ }                                       │
│                                         │
│ ✓ SUCCESS                               │
└─────────────────────────────────────────┘
```

**Action:**
1. Open: http://localhost/neighbournet1/setup.php
2. Wait for success message

---

## STEP 5: VERIFY TABLES ✓

```
phpMyAdmin → neighbournet

┌────────────────────────────────────────┐
│ Database: neighbournet                 │
├────────────────────────────────────────┤
│ ✓ users                                │
│   ├── id                               │
│   ├── username                         │
│   ├── email                            │
│   ├── password                         │
│   └── ... (11 total columns)          │
│                                        │
│ ✓ items                                │
│   ├── id                               │
│   ├── title                            │
│   ├── price                            │
│   └── ... (13 total columns)          │
│                                        │
│ ✓ bookings                             │
│   ├── id                               │
│   ├── item_id                          │
│   ├── user_id                          │
│   └── ... (8 total columns)           │
│                                        │
│ ✓ support_tickets                      │
│   ├── id                               │
│   ├── user_id                          │
│   ├── subject                          │
│   └── ... (8 total columns)           │
└────────────────────────────────────────┘
```

**Action:**
1. Go to phpMyAdmin
2. Click neighbournet database
3. Verify all 4 tables exist

---

## STEP 6: TEST CONNECTION 🧪

```
Browser: http://localhost/neighbournet1/test.php

┌──────────────────────────────────────────┐
│ NeighbourNet Backend Test               │
├──────────────────────────────────────────┤
│ ✓ Database Connection:                   │
│   Connected to neighbournet              │
│   Found 4 tables                         │
│                                          │
│ ✓ Users Table:                           │
│   0 users                                │
│                                          │
│ ✓ Items Table:                           │
│   0 items                                │
│                                          │
│ ✓ Bookings Table:                        │
│   0 bookings                             │
│                                          │
│ ✓ Support Tickets Table:                │
│   0 tickets                              │
│                                          │
│ ✓ Database is connected and ready!       │
└──────────────────────────────────────────┘
```

**Action:**
1. Open: http://localhost/neighbournet1/test.php
2. Verify all green checkmarks

---

## STEP 7: OPEN ADMIN PANEL 🎛️

```
Browser: http://localhost/neighbournet1/admin-items-new.html

┌─────────────────────────────────────────────┐
│     NeighbourNet Item Management            │
├─────────────────────────────────────────────┤
│ [Dashboard] [Users] [Items] [Bookings]     │
├─────────────────────────────────────────────┤
│                                             │
│ Total Items: 0    Available: 0              │
│ Booked: 0         Unavailable: 0           │
│                                             │
├─────────────────────────────────────────────┤
│ [Search]  [Category ▼] [Status ▼] [+Add]  │
├─────────────────────────────────────────────┤
│                                             │
│ Item | Owner | Category | Price | Status   │
│ ─────────────────────────────────────────   │
│ (empty table)                               │
│                                             │
└─────────────────────────────────────────────┘
```

**Action:**
1. Open: http://localhost/neighbournet1/admin-items-new.html
2. Admin panel loads
3. See empty items table

---

## STEP 8: ADD TEST ITEM 🛒

```
Click [+Add Item] button

┌──────────────────────────────────────┐
│   Add New Item (Modal)               │
├──────────────────────────────────────┤
│                                      │
│ Item Title *                         │
│ [Test Laptop_____________]           │
│                                      │
│ Description *                        │
│ [This is a test item___]             │
│                                      │
│ Category * [Electronics ▼]           │
│                                      │
│ Price (per day) * [50_______]        │
│                                      │
│ Condition * [Good ▼]                 │
│                                      │
│ Status * [Available ▼]               │
│                                      │
│ Image URL                            │
│ [________________]                   │
│                                      │
│        [Cancel]  [Save Item]         │
│                                      │
└──────────────────────────────────────┘
```

**Action:**
1. Click "Add Item" button
2. Fill in all fields
3. Click "Save Item"

---

## STEP 9: ITEM ADDED TO TABLE ✅

```
Admin Panel

┌──────────────────────────────────────────────────┐
│ Total Items: 1    Available: 1                   │
│ Booked: 0         Unavailable: 0                │
├──────────────────────────────────────────────────┤
│ Success: Item added successfully                │
├──────────────────────────────────────────────────┤
│ [Search] [Category ▼] [Status ▼] [+Add]         │
├──────────────────────────────────────────────────┤
│                                                  │
│ Item           | Owner | Category    | Price    │
│ ────────────────────────────────────────────────│
│ [IMG]          |       | Electronics | ₹50      │
│ Test Laptop    |       |             |          │
│ This is a...   |       |             |          │
│ Status: Available | [Edit] [Delete]  |          │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Action:**
1. Item appears in table
2. Statistics update (1 item, 1 available)
3. Success message shows

---

## STEP 10: VERIFY IN DATABASE 🔍

```
phpMyAdmin → neighbournet → items

┌─────────────────────────────────────────┐
│ items table                             │
├─────────────────────────────────────────┤
│ id | title      | description | price  │
│ ─────────────────────────────────────── │
│ 1  | Test Laptop| This is a...| 50     │
│ ─────────────────────────────────────── │
│                                         │
│ owner_id | category    | status      │
│ ────────────────────────────────────── │
│ 1        | Electronics | available   │
│ ────────────────────────────────────── │
│                                         │
│ More columns: condition, rating,       │
│ date_added, image_url, etc.           │
│                                         │
└─────────────────────────────────────────┘
```

**Action:**
1. Open phpMyAdmin
2. Click neighbournet database
3. Click items table
4. Verify your test item appears!

---

## ✅ COMPLETE! 🎉

```
┌────────────────────────────────────────┐
│      Setup Successful!                 │
│                                        │
│ ✓ XAMPP Running                        │
│ ✓ Database Created                     │
│ ✓ Tables Created                       │
│ ✓ Connection Verified                  │
│ ✓ Admin Panel Working                  │
│ ✓ Items Stored in Database             │
│                                        │
│ Your backend is READY! 🚀              │
│                                        │
│ Next: Add more items, test features    │
└────────────────────────────────────────┘
```

---

## 📱 Quick Links During Development

```
┌──────────────────────────────────────────────┐
│ Bookmarks                                    │
├──────────────────────────────────────────────┤
│ 📊 phpMyAdmin                                │
│    http://localhost/phpmyadmin               │
│                                              │
│ 🎛️  Admin Panel                              │
│    http://localhost/neighbournet1/           │
│    admin-items-new.html                      │
│                                              │
│ 🧪 Test Page                                 │
│    http://localhost/neighbournet1/test.php   │
│                                              │
│ 🔧 Setup (Run Once)                          │
│    http://localhost/neighbournet1/setup.php  │
│                                              │
│ 📁 XAMPP Control                             │
│    C:\xampp\xampp-control.exe                │
└──────────────────────────────────────────────┘
```

---

## 🎯 Summary of What You Have

```
DATABASE: neighbournet
├── 4 Tables Created
├── Foreign Keys Setup
├── Proper Timestamps
└── Ready for Production

BACKEND: PHP Files
├── Database Connection (db.php)
├── User Management (register, login, logout)
├── Item Management (CRUD operations)
├── Booking Management (fetch, manage)
├── Support Tickets (create, manage)
└── Admin Stats (dashboard data)

FRONTEND: Admin Panel
├── Real-time Data Fetching
├── Add/Edit/Delete Items
├── Advanced Filtering
├── Live Statistics
└── Search Functionality

ALL DATA STORED IN DATABASE ✓
```

---

**🎉 Everything is Set Up and Working!**

You now have a fully functional full-stack application with database, backend, and frontend integrated!

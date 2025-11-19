# Setup Checklist - Follow This Step by Step

## ✅ Pre-Setup Checks

- [ ] XAMPP is installed (C:\xampp folder exists)
- [ ] Have access to: C:\xampp\xampp-control.exe
- [ ] Have access to: C:\xampp\htdocs\neighbournet1 folder
- [ ] All PHP files are present in neighbournet1 folder

---

## ⚙️ PHASE 1: Start Services (5 minutes)

### Step 1: Open XAMPP
- [ ] Open: `C:\xampp\xampp-control.exe`
- [ ] Wait for control panel to appear

### Step 2: Start Apache
- [ ] Find row with "Apache"
- [ ] Click "Start" button
- [ ] Wait 5-10 seconds
- [ ] Background should turn GREEN
- [ ] Port 80 should show

### Step 3: Start MySQL
- [ ] Find row with "MySQL"
- [ ] Click "Start" button
- [ ] Wait 5-10 seconds
- [ ] Background should turn GREEN
- [ ] Port 3306 should show

### Verification
- [ ] Apache shows GREEN background
- [ ] MySQL shows GREEN background
- [ ] Both rows show running

---

## 🗄️ PHASE 2: Create Database (5 minutes)

### Step 1: Open phpMyAdmin
- [ ] Open browser (Chrome, Firefox, Edge)
- [ ] Go to: `http://localhost/phpmyadmin`
- [ ] Wait for page to load

### Step 2: Login (if prompted)
- [ ] Username: `root`
- [ ] Password: (leave blank)
- [ ] Click "Go"

### Step 3: Create Database
- [ ] Look for "New" button on top left
- [ ] Click "New"
- [ ] In "Database name" field, type: `neighbournet`
- [ ] In "Collation" dropdown, find: `utf8mb4_unicode_ci`
- [ ] Click "Create"
- [ ] See success message

### Verification
- [ ] Left sidebar shows: `neighbournet` database
- [ ] No error messages appear
- [ ] Database appears in the list

---

## 📋 PHASE 3: Create Tables (2 minutes)

### Step 1: Run Setup Script
- [ ] Open new browser tab
- [ ] Go to: `http://localhost/neighbournet1/setup.php`
- [ ] Wait for page to load

### Step 2: Verify Success
- [ ] See this JSON response:
```
{"success":true,"message":"Database tables created successfully! Tables: users, items, bookings, support_tickets"}
```
- [ ] No error messages
- [ ] No red text

### Step 3: Refresh phpMyAdmin
- [ ] Go back to phpMyAdmin tab
- [ ] Click on `neighbournet` database
- [ ] Refresh page (F5)

### Verification
- [ ] See 4 tables in left side:
  - [ ] users
  - [ ] items
  - [ ] bookings
  - [ ] support_tickets
- [ ] Each table has the correct columns
- [ ] No errors displayed

---

## 🧪 PHASE 4: Test Connection (3 minutes)

### Step 1: Open Test Page
- [ ] Open new browser tab
- [ ] Go to: `http://localhost/neighbournet1/test.php`
- [ ] Wait for page to load

### Step 2: Verify All Tests Pass
- [ ] ✓ Database Connection: Connected to neighbournet
- [ ] ✓ Users Table: X users
- [ ] ✓ Items Table: X items
- [ ] ✓ Bookings Table: X bookings
- [ ] ✓ Support Tickets Table: X tickets
- [ ] ✓ At bottom: "Database is connected and ready!"

### Verification
- [ ] All items have GREEN checkmarks (✓)
- [ ] No RED X marks (✗)
- [ ] Green success message at bottom
- [ ] No error messages

---

## 🎛️ PHASE 5: Open Admin Panel (2 minutes)

### Step 1: Open Admin Panel
- [ ] Open new browser tab
- [ ] Go to: `http://localhost/neighbournet1/admin-items-new.html`
- [ ] Wait for page to load

### Step 2: Check Interface
- [ ] Title: "NeighbourNet Item Management" visible
- [ ] Navigation menu visible
- [ ] Statistics cards visible (showing 0 items)
- [ ] Search box visible
- [ ] Filters visible
- [ ] "Add Item" button visible (top right)
- [ ] Empty items table visible

### Verification
- [ ] No JavaScript errors (F12 console)
- [ ] Page fully loaded
- [ ] All elements visible
- [ ] No 404 errors

---

## 🛒 PHASE 6: Test Adding Item (3 minutes)

### Step 1: Open Add Item Modal
- [ ] Click "Add Item" button (top right)
- [ ] Modal popup appears

### Step 2: Fill Form
- [ ] Item Title: `Test Laptop`
- [ ] Description: `This is a test item`
- [ ] Category: Select `Electronics`
- [ ] Price: `50`
- [ ] Condition: Select `Good`
- [ ] Status: Select `Available`
- [ ] Image URL: (leave blank)

### Step 3: Submit Form
- [ ] Click "Save Item" button
- [ ] Wait 1-2 seconds

### Verification
- [ ] Success message appears
- [ ] Modal closes automatically
- [ ] Item appears in table
- [ ] Statistics update (Total Items: 1)
- [ ] Item details visible in table

---

## 🔍 PHASE 7: Verify in Database (3 minutes)

### Step 1: Go to phpMyAdmin
- [ ] Switch to phpMyAdmin tab
- [ ] Refresh page (F5)

### Step 2: Navigate to Items
- [ ] Click on `neighbournet` database
- [ ] Click on `items` table
- [ ] View table data

### Verification
- [ ] Your test item appears in table
- [ ] Columns show: id, title, description, price, etc.
- [ ] Data matches what you entered
- [ ] Item ID is 1
- [ ] Status shows: available
- [ ] Price shows: 50

---

## ✨ PHASE 8: Test More Features (5 minutes)

### Test Adding Multiple Items
- [ ] Add 3-4 more test items
- [ ] Use different categories
- [ ] All items appear in admin panel
- [ ] All items appear in database

### Test Search Feature
- [ ] Type in search box: "laptop"
- [ ] Only items with "laptop" show
- [ ] Clear search, all items show again

### Test Filtering
- [ ] Select category: "Electronics"
- [ ] Only electronics show
- [ ] Select another category, items change
- [ ] Select "All Categories", all show

### Test Edit Function
- [ ] Click edit icon (pencil) on any item
- [ ] Modal opens with item data
- [ ] Change the price
- [ ] Click Save
- [ ] Price updates in table

### Test Delete Function
- [ ] Click delete icon (trash) on any item
- [ ] Confirm deletion
- [ ] Item disappears from table
- [ ] Statistics update

### Verification
- [ ] All features work as expected
- [ ] No errors in console (F12)
- [ ] Database updates immediately
- [ ] Admin panel stays responsive

---

## ✅ PHASE 9: Final Verification (2 minutes)

### Database Verification
- [ ] phpMyAdmin loads: `http://localhost/phpmyadmin`
- [ ] `neighbournet` database exists
- [ ] All 4 tables exist
- [ ] All tables have data (if items added)

### Backend Verification
- [ ] Test page loads: `http://localhost/neighbournet1/test.php`
- [ ] All tests show green checkmarks
- [ ] Database tables count is correct

### Admin Panel Verification
- [ ] Admin panel loads: `http://localhost/neighbournet1/admin-items-new.html`
- [ ] All items display
- [ ] Statistics are correct
- [ ] Search/filters work
- [ ] CRUD operations work

---

## 🎉 COMPLETE! 

### Success Indicators
- [ ] All tests passed
- [ ] No errors anywhere
- [ ] Admin panel fully functional
- [ ] Database storing data correctly
- [ ] Real-time updates working

### You Now Have
- [ ] ✅ Complete database
- [ ] ✅ Full backend API
- [ ] ✅ Functional admin panel
- [ ] ✅ Data persistence
- [ ] ✅ Real-time synchronization

---

## 📚 Next Actions

### Continue Development
- [ ] Connect login page to backend
- [ ] Connect registration to backend
- [ ] Update item listing pages
- [ ] Add booking system
- [ ] Add support tickets

### For Help
- [ ] Read: `README.md`
- [ ] Read: `QUICK_START.md`
- [ ] Read: `COMPLETE_REFERENCE.md`
- [ ] Read: `VISUAL_GUIDE.md`

### Important URLs
- Admin Panel: `http://localhost/neighbournet1/admin-items-new.html`
- phpMyAdmin: `http://localhost/phpmyadmin`
- Test Page: `http://localhost/neighbournet1/test.php`
- XAMPP Control: `C:\xampp\xampp-control.exe`

---

## 🆘 Troubleshooting

### "MySQL won't start"
- [ ] Close other MySQL services
- [ ] Restart XAMPP
- [ ] Check port 3306 availability

### "Setup.php shows error"
- [ ] Verify MySQL is GREEN
- [ ] Verify database created first
- [ ] Check phpMyAdmin can connect

### "Admin panel shows no items"
- [ ] Open F12 developer tools
- [ ] Check Console for errors
- [ ] Verify test.php works
- [ ] Refresh page

### "Can't connect to phpMyAdmin"
- [ ] Verify Apache is GREEN
- [ ] Try: `http://localhost/phpmyadmin`
- [ ] Restart Apache

---

**✅ You're All Set!**

Every item checked = System is working perfectly!

Start adding items and testing your full-stack application! 🚀

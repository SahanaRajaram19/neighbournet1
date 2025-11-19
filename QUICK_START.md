# Quick Start Guide - 10 Steps

## Step 1️⃣ Start XAMPP

**Open:** `C:\xampp\xampp-control.exe`

```
Apache      [Start]   → Wait for GREEN
MySQL       [Start]   → Wait for GREEN
```

---

## Step 2️⃣ Open phpMyAdmin

**In Browser:** `http://localhost/phpmyadmin`

- If asked to login: Username = `root`, Password = (blank)
- Click **New** button

---

## Step 3️⃣ Create Database

**In phpMyAdmin:**
1. Database name: `neighbournet`
2. Collation: `utf8mb4_unicode_ci`
3. Click **Create**

**Result:** Database `neighbournet` appears on left sidebar ✓

---

## Step 4️⃣ Create Tables

**In Browser:** `http://localhost/neighbournet1/setup.php`

**Wait for:**
```
{"success":true,"message":"Database tables created successfully! ..."}
```

---

## Step 5️⃣ Verify Tables

**In phpMyAdmin:**
- Click `neighbournet` database
- You should see 4 tables:
  - users
  - items
  - bookings
  - support_tickets

---

## Step 6️⃣ Test Connection

**In Browser:** `http://localhost/neighbournet1/test.php`

**You should see:**
- ✓ Database Connection
- ✓ Users Table
- ✓ Items Table
- ✓ Bookings Table
- ✓ Support Tickets Table

---

## Step 7️⃣ Open Admin Panel

**In Browser:** `http://localhost/neighbournet1/admin-items-new.html`

**You should see:**
- Dashboard with stats
- Empty items table
- "Add Item" button

---

## Step 8️⃣ Add Test Item

**Click "Add Item"**
- Title: `Test Item`
- Description: `This is a test`
- Category: `Electronics`
- Price: `50`
- Condition: `Good`
- Status: `Available`

**Click "Save Item"**

---

## Step 9️⃣ Verify in Table

**Admin Panel should show:**
- Item appears in table
- Stats update (Total Items: 1)
- All details visible

---

## Step 🔟 Verify in Database

**In phpMyAdmin:**
- Click `neighbournet` → `items` table
- You should see your test item!

---

## 🎉 Done!

Your database and backend are fully operational!

**Next Steps:**
- Add more test items
- Test search and filters
- Test edit and delete functions
- Register users
- Create bookings

---

## 🔗 Important URLs

| What | URL |
|------|-----|
| phpMyAdmin | http://localhost/phpmyadmin |
| Setup | http://localhost/neighbournet1/setup.php |
| Test | http://localhost/neighbournet1/test.php |
| Admin | http://localhost/neighbournet1/admin-items-new.html |

---

## ⚠️ If Something Goes Wrong

### "Database connection failed"
→ Check MySQL is running (GREEN in XAMPP)

### Setup page shows error
→ Verify you created `neighbournet` database first

### Admin page doesn't load items
→ Open F12 (Developer Tools) → Check Console for errors

### Can't access phpMyAdmin
→ Verify Apache is running (GREEN in XAMPP)

---

**Everything working? Perfect! 🚀**

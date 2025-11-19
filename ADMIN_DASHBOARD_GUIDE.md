# Admin Dashboard - Data Views

You can now see all your database data in the admin pages in your **original frontend design**! 

## 📊 What You Can View:

### 1. **Admin Dashboard** - `admin.html`
- **Total Users** - Live count from database
- **Total Items** - Live count from database  
- **Total Bookings** - Live count from database
- **Support Tickets** - Live count from database
- Stats update automatically every 30 seconds

### 2. **Admin Items Page** - `admin-items.html`
- **Total Items** - All items in database
- **Available Items** - Items with status = available
- **Booked Items** - Items with status = booked
- **Unavailable Items** - Items with status = unavailable
- **Item Table** showing:
  - Title, Description
  - Category, Price
  - Status, Condition
  - Owner ID, Created Date
- **Search & Filter** functionality
- **Add Item Form** to insert new items
- **Delete Button** to remove items

### 3. **Admin Users Page** - `admin-users.html`
- **All Registered Users** displayed in table
- Columns showing:
  - User ID, Username, Email
  - Full Name, Phone, Address
  - Registration Date
- **Search functionality** - Filter by name, email, or username
- **Status filters** available

### 4. **Database Explorer** - `database-explorer.html`
Alternative detailed view with:
- **Summary Tab** - Overall statistics
- **Users Tab** - All user details
- **Items Tab** - All item details
- **Bookings Tab** - All bookings with join data
- **Support Tickets Tab** - All support requests

## 🔗 Quick Links:

| Page | URL |
|------|-----|
| Admin Dashboard | http://localhost/neighbournet1/admin.html |
| Item Management | http://localhost/neighbournet1/admin-items.html |
| User Management | http://localhost/neighbournet1/admin-users.html |
| Database Explorer | http://localhost/neighbournet1/database-explorer.html |

## 📝 How Data Flows:

1. **You register on auth.html** → Data saved to SQLite users table
2. **You add items on listing page** → Data saved to SQLite items table  
3. **You create booking** → Data saved to SQLite bookings table
4. **You submit support** → Data saved to SQLite support_tickets table
5. **Admin views pages** → Data loaded from database and displayed

## 🎯 Key Features:

✅ **Real-time Data** - All pages show live data from database
✅ **Search & Filter** - Find users and items quickly
✅ **Original UI Design** - Using your existing frontend design
✅ **Auto-refresh** - Dashboard stats update every 30 seconds
✅ **Database Viewer** - Detailed alternative view of all tables

## 📂 Database File:
**Location:** `C:\xampp\htdocs\neighbournet1\neighbournet1.db`

All data is stored in this SQLite file. You can view it directly using:
- DB Browser for SQLite
- DBeaver
- Or the Database Explorer page we created

## 💾 Data Persistence:
Everything you enter persists in the database - it won't disappear when you refresh the page!

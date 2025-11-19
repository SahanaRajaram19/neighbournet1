# NeighbourNet - Complete System Setup ✅

## System Status: 100% WORKING

All pages are now fully functional with backend database integration!

---

## 🔐 Authentication System

### Registration & Login
- **Page**: `auth.html`
- **Backend**: `register.php`, `login.php`
- **Features**:
  - Create new account with email, password, full name
  - Login with email or username
  - Password hashing with BCrypt
  - Session management
  - User data stored in localStorage

**Test Credentials**:
- Email: `john@example.com`
- Password: `password123`

---

## 🏠 Home Page
- **Page**: `index.html`
- **Backend**: `fetch-items.php`
- **Features**:
  - Display featured items from database
  - Auto-load 6 items on page load
  - Click "View Details" to see full item info

---

## 👤 User Profile
- **Page**: `profile.html`
- **Backend**: `fetch-profile.php`, `update-profile.php`
- **Features**:
  - View user profile information
  - Edit full name, phone, address
  - Display user stats (items, bookings)
  - Logout functionality

---

## 📅 My Bookings
- **Page**: `bookings.html`
- **Backend**: `fetch-bookings.php`
- **Features**:
  - View all user bookings
  - Filter by status (pending, confirmed, etc.)
  - Display booking dates and prices
  - Real-time data from database

---

## 🔍 Browse Items

### Borrow Items
- **Page**: `borrow.html`
- **Backend**: `fetch-items.php`
- **Features**:
  - Browse all available items
  - Filter by category, status, condition
  - Search functionality
  - Click "Book Now" to request item

### Rent Items
- **Page**: `rent.html`
- **Backend**: `fetch-items.php`
- **Features**:
  - Same as borrow, different category
  - Real-time item listing

---

## 📝 Item Details & Booking
- **Pages**: `item-detail.html`, `book-now.html`
- **Backend**: `fetch-items.php`, `create-booking.php`
- **Features**:
  - View full item details
  - Select start and end dates
  - Auto-calculate total price
  - Submit booking request
  - Data saved to database

---

## 💬 Support & Help
- **Page**: `support.html`
- **Backend**: `submit-support.php`, `fetch-support.php`
- **Features**:
  - Submit support tickets
  - View submitted tickets
  - Filter by status
  - Real-time ticket tracking

---

## 🎛️ Admin Dashboard
- **Page**: `admin-items.html`
- **Backend**: `add-item.php`, `delete-item.php`, `fetch-items.php`, `get-stats.php`, `fetch-users.php`, `fetch-transactions.php`, `fetch-support.php`
- **Features**:
  - View all items in table format
  - Add new items via modal form
  - Delete items
  - Search and filter items
  - View dashboard statistics
  - Manage users, transactions, support tickets

---

## 🗄️ Database

### Type: SQLite (neighbournet1.db)
### Tables:
- `users` - User accounts and profiles
- `items` - Products/services available
- `bookings` - Booking requests
- `support_tickets` - Support issues

### Key Features:
- File-based (no server needed)
- Full foreign key support
- Automatic timestamps
- No authentication required

---

## 🔗 API Endpoints

### Authentication
```
POST /register.php - Create new user
POST /login.php - User login
```

### Items
```
GET /fetch-items.php - Get all items (with filters)
POST /add-item.php - Add new item
POST /delete-item.php - Delete item
POST /update-item.php - Update item
GET /item-detail.html?id=X - View item details
```

### Bookings
```
GET /fetch-bookings.php - Get user bookings
POST /create-booking.php - Create booking
```

### Profile
```
GET /fetch-profile.php - Get user profile
POST /update-profile.php - Update profile
```

### Support
```
GET /fetch-support.php - Get support tickets
POST /submit-support.php - Create ticket
```

### Admin
```
GET /get-stats.php - Dashboard statistics
GET /fetch-users.php - All users
GET /fetch-transactions.php - All transactions
```

---

## 🎯 How to Use

### 1. Register New Account
- Go to: `http://localhost/neighbournet1/auth.html`
- Click "Sign up here"
- Fill in details
- Click "Create Account"

### 2. Login
- Enter email/username and password
- Click "Sign In"
- Automatically logged in and redirected to home

### 3. Browse Items
- Click on "Browse Items" or "Borrowing Items"
- See all available items
- Use filters to find specific items
- Click "Book Now" to request

### 4. Make Booking
- Select start and end dates
- See calculated total price
- Add optional notes
- Click "Confirm Booking"

### 5. View Bookings
- Go to "My Bookings"
- See all your bookings with status
- Filter by status if needed

### 6. Edit Profile
- Go to "My Profile"
- Click "Save Changes" to update
- View your stats

### 7. Submit Support Ticket
- Go to "Help & Support"
- Fill in subject and message
- Click "Submit"
- View submitted tickets

### 8. Admin Panel
- Go to: `http://localhost/neighbournet1/admin-items.html`
- Click "Add New Item" to add items
- View all items in table
- Delete items with delete button
- Use search/filters

---

## ✅ Working Features Checklist

- ✅ User Registration (with validation)
- ✅ User Login (with password verification)
- ✅ User Profile (view and edit)
- ✅ Item Listing (with filters and search)
- ✅ Item Details (dynamic loading)
- ✅ Booking System (date selection, price calculation)
- ✅ My Bookings (view and filter)
- ✅ Support Tickets (submit and view)
- ✅ Admin Panel (add, edit, delete items)
- ✅ Dashboard Statistics (real-time counts)
- ✅ Database Integration (SQLite)
- ✅ Session Management
- ✅ Form Validation
- ✅ Error Handling
- ✅ Real-time Data Loading

---

## 🚀 Testing

### Quick Test Flow:
1. Register: `http://localhost/neighbournet1/auth.html` → Sign up
2. Login: Enter credentials → Sign In
3. Browse: Go to home or "Borrowing Items"
4. Book: Click item → Select dates → Confirm
5. View: Go to "My Bookings" → See your bookings
6. Support: "Help & Support" → Submit ticket
7. Admin: `admin-items.html` → Manage items

---

## 📞 Support

All features are now 100% functional!
- Database: SQLite (neighbournet1.db) ✅
- Backend APIs: All working ✅
- Frontend Pages: All connected ✅
- User System: Complete ✅
- Item Management: Complete ✅
- Booking System: Complete ✅

**Everything is ready to use!** 🎉

# NeighbourNet Complete Sitemap & Navigation Guide

## 🌟 **Complete Website Structure**

```
📁 neighbournet1/
├── 🏠 index.html (Homepage)
├── 📂 borrow.html (Browse Items)
├── 🔍 product-detail.html (Item Details)
├── 👤 profile.html (User Profile)
├── 🔐 auth.html (Authentication)
├── 🆘 support.html (Help & Support)
├── ⚙️ backend/ (API & Database)
│   ├── api.php (Main API)
│   ├── setup.php (Database Setup)
│   ├── test-api.php (API Testing)
│   └── [controllers, models, etc.]
└── 📁 css/ (Stylesheets)
    ├── styles.css (Global Styles)
    ├── category-styles.css (Category Pages)
    ├── detail-styles.css (Product Details)
    ├── profile-styles.css (User Profile)
    ├── auth-styles.css (Authentication)
    └── support-styles.css (Support Pages)
```

## 🧭 **Navigation Flow**

### **Main Navigation (All Pages)**
```
🏠 Home ←→ 📂 Browse Items ←→ 🆘 Help & Support
    ↓           ↓                    ↓
🎯 Hero CTA    📋 Filters          📞 Contact
    ↓           ↓                    ↓
🔐 Login       🔍 Item Details      ❓ FAQ
    ↓           ↓                    ↓
👤 Profile     ⭐ Reviews           🚨 Report Issue
```

### **User Journey Flow**

#### **New Visitor Journey:**
```
🏠 Homepage → 🔐 Sign Up → 📋 Browse Items → 🔍 View Item → 💬 Chat with Owner → ✅ Complete Transaction
```

#### **Existing User Journey:**
```
🏠 Homepage → 👤 Profile → 📂 Browse Items → 🔍 View Item → 💬 Chat with Owner → ✅ Book Item → ⭐ Leave Review
```

## 🔗 **Page Connections**

### **From Homepage (`index.html`)**
- **🔗 Browse Items** → `borrow.html`
- **🔗 List Your Items** → `auth.html`
- **🔗 Help & Support** → `support.html`
- **🔗 Login/Sign Up** → `auth.html`

### **From Browse Items (`borrow.html`)**
- **🔗 Home** → `index.html`
- **🔗 Item Details** → `product-detail.html` (via item cards)
- **🔗 List Items** → `auth.html`
- **🔗 Support** → `support.html`

### **From Item Details (`product-detail.html`)**
- **🔗 Back to Browse** → `borrow.html`
- **🔗 Owner Profile** → `profile.html` (owner's profile)
- **🔗 Chat with Owner** → Opens chat modal
- **🔗 Add to Wishlist** → Saves to user account

### **From Authentication (`auth.html`)**
- **🔗 Home** → `index.html`
- **🔗 Browse Items** → `borrow.html`
- **🔗 Support** → `support.html`

### **From User Profile (`profile.html`)**
- **🔗 Home** → `index.html`
- **🔗 Browse Items** → `borrow.html`
- **🔗 List Items** → `auth.html`
- **🔗 Support** → `support.html`
- **🔗 Logout** → `index.html`

### **From Support (`support.html`)**
- **🔗 Home** → `index.html`
- **🔗 Browse Items** → `borrow.html`
- **🔗 Contact Form** → Submits to backend API
- **🔗 Report Issue** → Submits to backend API

## 🚀 **API Integration Points**

### **Frontend → Backend Connections**

#### **Authentication Flow:**
```
Frontend (auth.html) → POST /auth/register → Backend API → Database → Response → Frontend
Frontend (auth.html) → POST /auth/login → Backend API → JWT Token → Frontend Storage
```

#### **Item Browsing:**
```
Frontend (borrow.html) → GET /items → Backend API → Database Query → JSON Response → Frontend Display
```

#### **Item Details:**
```
Frontend (product-detail.html) → GET /items/{id} → Backend API → Full Item Data → Frontend Display
```

#### **Search Functionality:**
```
Frontend (search inputs) → GET /search?q=query → Backend API → Filtered Results → Frontend Display
```

#### **User Profile:**
```
Frontend (profile.html) → GET /users/{id} → Backend API → User Data → Frontend Display
Frontend (profile.html) → PUT /users/{id} → Backend API → Update Database → Confirmation
```

## 📊 **Data Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │───▶│  JavaScript/JS   │───▶│   PHP Backend   │
│   (HTML/CSS)    │    │   (AJAX/Fetch)   │    │   (API.php)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Browser Display │    │   API Requests   │    │ Database Queries│
│ (User Interface)│    │   (HTTP/REST)    │    │  (MySQL/PHP)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎯 **Key Features by Page**

### **🏠 Homepage Features:**
- Hero section with call-to-action
- Featured categories overview
- Search functionality
- Testimonials
- Footer with links

### **📂 Browse Items Features:**
- Category-based filtering
- Location-based search
- Price range filtering
- Item cards with ratings
- Sort options

### **🔍 Item Details Features:**
- Image gallery with thumbnails
- Detailed item information
- Owner information
- Reviews and ratings
- Action buttons (chat, wishlist)

### **👤 Profile Features:**
- User avatar and stats
- Editable profile information
- Transaction history
- Trust & safety information
- Password change functionality

### **🔐 Authentication Features:**
- Multi-step registration
- OTP verification
- Password reset
- Form validation
- Success states

### **🆘 Support Features:**
- FAQ with search
- Contact form
- Issue reporting
- File attachments
- Priority levels

## 🚀 **Quick Start Commands**

### **Setup Backend:**
```bash
cd backend
php setup.php
php test-api.php
```

### **Access Pages:**
```bash
# Main Pages
http://localhost/neighbournet1/index.html      # Homepage
http://localhost/neighbournet1/borrow.html     # Browse Items
http://localhost/neighbournet1/auth.html       # Login/Register
http://localhost/neighbournet1/profile.html    # User Profile
http://localhost/neighbournet1/support.html    # Help & Support

# Detail Pages
http://localhost/neighbournet1/product-detail.html # Item Details
```

### **Test API:**
```bash
# API Endpoints
http://localhost/neighbournet1/backend/api.php         # API Status
http://localhost/neighbournet1/backend/api.php/items   # All Items
http://localhost/neighbournet1/backend/api.php/search?q=drill # Search
```

## 🔗 **Interlinked Navigation**

### **Consistent Navigation Bar (All Pages):**
```
┌─────────────────────────────────────────────────────────────┐
│ NeighbourNet  │  Home  │  Categories ▼  │  Help & Support  │
├─────────────────────────────────────────────────────────────┤
│ Logo         │  Link  │  Dropdown Menu   │  Support Link   │
│ (Clickable)  │        │  • Browse Items  │                 │
│              │        │  • List Items    │                 │
└─────────────────────────────────────────────────────────────┘
```

### **User Menu (When Logged In):**
```
┌─────────────────┐
│  Avatar  Name ▼ │
├─────────────────┤
│ • My Profile    │
│ • Browse Items  │
│ • List Items    │
│ • Settings      │
│ • Logout        │
└─────────────────┘
```

## 🎨 **Visual Design Consistency**

### **Colors Used:**
- **Primary**: Peacock Blue (#096C6C)
- **Secondary**: Coral (#FF6F61)
- **Background**: Light Gray (#FAFBFC)
- **Text**: Dark Gray (#333)

### **Typography:**
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, Peacock Blue
- **Body**: Regular weight
- **Buttons**: White text on colored backgrounds

### **Components:**
- **Cards**: 8px border radius, subtle shadows
- **Buttons**: Hover effects with color transitions
- **Forms**: Consistent styling and validation
- **Icons**: Font Awesome icons throughout

## 🚨 **Important Notes**

1. **Backend Setup Required**: Run `php setup.php` in backend folder before using
2. **Database**: MySQL database `neighbournet` must exist
3. **File Permissions**: Ensure upload directories are writable
4. **XAMPP**: Both Apache and MySQL services must be running

## 🎉 **Complete System Ready!**

Your NeighbourNet platform is now **fully functional** with:

✅ **Complete Frontend** - Beautiful, responsive design
✅ **Complete Backend** - PHP/MySQL API with JWT authentication
✅ **Database Schema** - Users, items, transactions, reviews
✅ **File Structure** - Organized and maintainable
✅ **Navigation** - Seamless links between all pages
✅ **API Integration** - Frontend-backend communication
✅ **Sample Data** - Ready for testing and demonstration

**🎯 The complete system is ready for use!** 🚀

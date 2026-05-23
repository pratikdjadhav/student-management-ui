# 🎓 Student Management System - Frontend
# Fully Made Using AI

A clean and responsive frontend for the Student Management System built with **HTML**, **CSS**, **Bootstrap**, and **JavaScript**. Designed for coaching centers to manage students, courses, and fee tracking through a beautiful web interface.

🌐 **Live App:** https://student-management-system-ui.netlify.app
🔗 **Backend API:** https://student-management-backend-production-98f6.up.railway.app
📖 **API Docs:** https://student-management-backend-production-98f6.up.railway.app/swagger-ui/index.html
💻 **GitHub:** https://github.com/pratikdjadhav

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Custom Styling |
| JavaScript (ES6+) | Logic & API calls |
| Bootstrap 5 | UI Components & Responsive Design |
| Font Awesome | Icons |
| Netlify | Frontend Deployment |

---

## 📁 Project Structure

```
student-management-ui/
├── index.html          # Login & Register page
├── dashboard.html      # Main dashboard with stats
├── students.html       # Students management page
├── courses.html        # Courses management page
├── css/
│   └── style.css       # Custom styles
└── js/
    ├── auth.js         # Authentication & shared functions
    ├── dashboard.js    # Dashboard logic
    ├── students.js     # Students page logic
    └── courses.js      # Courses page logic
```

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT token based authentication
- Auto logout on browser close (sessionStorage)
- Protected routes — redirect to login if not authenticated

### 📊 Dashboard
- Total students count
- Total courses count
- Total fees collected (₹)
- Total fees pending (₹)
- Recent students table with fee status

### 👨‍🎓 Student Management
- Add new students with enrollment details
- Edit existing student information
- Delete students
- View all students with pagination
- Filter students by course
- Sort students by name or email
- Fee tracking per student (course fees, paid, pending)
- Student status (Active/Inactive)

### 📚 Course Management
- Add new courses with fees
- View all courses
- Delete courses
- Course fee management

---

## 🚀 Getting Started Locally

### Prerequisites
- Any modern web browser
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension (recommended)
- Student Management Backend running locally

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/pratikdjadhav/student-management-ui.git
cd student-management-ui
```

2. **Update API URL** in `js/auth.js`:
```javascript
const API_URL = "http://localhost:8080"; // for local development
```

3. **Open with Live Server**
- Right click on `index.html`
- Click "Open with Live Server"

---

## 📸 Screenshots

### Login Page
- Clean authentication UI with login/register tabs
- Gradient purple background

### Dashboard
- 4 colorful stat cards showing key metrics
- Recent students table with fee status

### Students Page
- Full student table with fees breakdown
- Add/Edit/Delete functionality
- Filter by course, sort options, pagination

### Courses Page
- Course listing with fees
- Add new course modal

---

## 🔄 How It Works

```
User Login → JWT Token stored in sessionStorage
        ↓
Dashboard loads → Fetches stats from API
        ↓
Students page → Fetches paginated students
        ↓
Add/Edit/Delete → Calls respective API endpoints
        ↓
Logout → Clears sessionStorage → Redirects to login
```

---

## 🔐 Security Features

- JWT token stored in `sessionStorage` (cleared on browser close)
- Token validation on every page load
- Auto redirect to login on 401 response
- No sensitive data stored in browser

---

## 👨‍💻 Author

**Pratik Jadhav**
- GitHub: [@pratikdjadhav](https://github.com/pratikdjadhav)
- LinkedIn: [Pratik Jadhav](https://linkedin.com/in/jadhavpratikd)
- Live App: [student-management-system-ui.netlify.app](https://student-management-system-ui.netlify.app)

---

⭐ If you found this project helpful, please give it a star!

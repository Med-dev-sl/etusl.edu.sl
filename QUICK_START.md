# ETUSL Staff Authentication - Quick Start

## 📋 Execution Steps

### Step 1: Setup MySQL Database
Run these commands in MySQL client:

```bash
# Option A: Using the SQL file
mysql -u root -p your_database < backend/setup-staff.sql

# Option B: Direct commands in MySQL
mysql -u root -p
mysql> USE your_database_name;
mysql> [Paste contents of backend/STAFF_SQL_COMMANDS.sql]
```

**Test Data Available:**
| Staff ID | Password | Name | Department |
|----------|----------|------|------------|
| ETUSL0000 | P@$$W0RD | Admin User | Administration |
| ETUSL0001 | P@$$W0RD | Dr. John Smith | Computer Science |
| ETUSL0002 | P@$$W0RD | Mrs. Sarah Johnson | English Department |
| ETUSL0003 | P@$$W0RD | Prof. Ahmed Hassan | Mathematics |

### Step 2: Start Backend Server
```bash
cd backend
npm install  # if dependencies not installed
npm start
# Server runs on http://localhost:4000
```

### Step 3: Start Frontend (New Terminal)
```bash
npm start
# Frontend runs on http://localhost:3000
```

### Step 4: Test Staff Login
1. Open browser: `http://localhost:3000`
2. Click "Staff Login" in the Quick Links dropdown menu
3. Enter credentials:
   - **Staff ID:** ETUSL0001
   - **Password:** P@$$W0RD
4. Click "Sign In"
5. You should be redirected to the Staff Dashboard

## 🎯 Staff Dashboard Features

Once logged in, you can access:
- **Overview**: Statistics and recent activity
- **Profile**: Your staff information
- **Courses**: Manage your courses
- **Students**: View and manage students
- **Logout**: Secure logout

## 🔒 Authentication Flow

```
1. User enters credentials on StaffLogin page
   ↓
2. Frontend sends POST request to /api/auth/staff-login
   ↓
3. Backend queries MySQL staff table
   ↓
4. Password validation (plaintext comparison)
   ↓
5. If valid: Return staff data, store in localStorage
   ↓
6. Frontend navigates to /staff-dashboard
   ↓
7. StaffDashboard retrieves data from localStorage
```

## 🛠 Backend Endpoints

### POST /api/auth/staff-login
**Request:**
```json
{
  "staffId": "ETUSL0001",
  "password": "P@$$W0RD"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "staff": {
    "id": 1,
    "staffId": "ETUSL0001",
    "name": "Dr. John Smith",
    "email": "john.smith@etusl.edu.sl",
    "department": "Computer Science"
  }
}
```

**Response (Failure - 401):**
```json
{
  "error": "Invalid staff ID or password"
}
```

### GET /api/auth/staff/:staffId
Get staff profile information

## 📁 New Files Created

- `backend/setup-staff.sql` - Database schema and sample data
- `backend/STAFF_SQL_COMMANDS.sql` - Quick SQL reference
- `src/pages/staff/StaffDashboard.js` - Staff dashboard component
- `src/pages/staff/StaffDashboard.css` - Dashboard styling
- `STAFF_AUTH_SETUP.md` - Comprehensive setup guide

## 📝 Modified Files

- `backend/server.js` - Added staff authentication endpoints
- `src/App.js` - Added staff dashboard route and state management
- `src/pages/StaffLogin.js` - Connected to backend API

## ⚠️ Important Notes

1. **Development Only**: Passwords are stored as plaintext
2. **Port Requirements**: Backend on 4000, Frontend on 3000
3. **CORS Enabled**: Currently allows all origins (not production-ready)
4. **localStorage**: Staff data stored client-side (not secure for production)

## 🔐 Production Security TODO

- [ ] Implement bcrypt password hashing
- [ ] Add JWT token authentication
- [ ] Enable HTTPS/SSL
- [ ] Implement session timeout
- [ ] Add rate limiting on login attempts
- [ ] Use environment variables for secrets
- [ ] Add CSRF protection
- [ ] Implement secure HttpOnly cookies

## 💡 Example Login Attempts

**Valid Login:**
```
Staff ID: ETUSL0001
Password: P@$$W0RD
Result: ✅ Redirects to dashboard
```

**Invalid Staff ID:**
```
Staff ID: INVALID123
Password: P@$$W0RD
Result: ❌ "Invalid staff ID or password"
```

**Wrong Password:**
```
Staff ID: ETUSL0001
Password: WrongPassword
Result: ❌ "Invalid staff ID or password"
```

## 🐛 Troubleshooting

**Q: Backend not responding?**
A: Ensure MySQL is running and database credentials are in `.env`

**Q: Staff data not loading in dashboard?**
A: Check localStorage in DevTools > Application > Local Storage

**Q: Styling looks broken?**
A: Ensure CSS files are in correct location: `src/pages/staff/StaffDashboard.css`

**Q: Cannot connect to localhost:4000?**
A: Check if port 4000 is already in use with: `netstat -ano | findstr :4000`

---

**Ready to test?** Execute Step 1-4 above and test the login with ETUSL0001 / P@$$W0RD

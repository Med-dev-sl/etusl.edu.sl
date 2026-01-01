# ETUSL Staff Authentication Setup Guide

## Overview
This guide explains how to set up the staff authentication system for ETUSL (Educational Technology University) with backend and MySQL database integration.

## Components Created

### 1. Backend Authentication (`backend/server.js`)
- **Endpoint:** `POST /api/auth/staff-login`
- **Request Body:**
  ```json
  {
    "staffId": "ETUSL0001",
    "password": "P@$$W0RD"
  }
  ```
- **Response (Success):**
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

### 2. MySQL Database Setup
Run the SQL script to create the staff table:

```bash
mysql -u root -p < backend/setup-staff.sql
```

**Sample Staff Data (all with password: P@$$W0RD):**
- `ETUSL0001` - Dr. John Smith (Computer Science)
- `ETUSL0002` - Mrs. Sarah Johnson (English Department)
- `ETUSL0003` - Prof. Ahmed Hassan (Mathematics)
- `ETUSL0000` - Admin User (Administration)

### 3. Frontend Components

#### StaffLogin.js (`src/pages/StaffLogin.js`)
- Harvard-styled login form
- Backend API integration with error handling
- Redirects to staff dashboard on successful login
- Stores staff data in localStorage

#### StaffDashboard.js (`src/pages/staff/StaffDashboard.js`)
- Multi-tab staff dashboard
- **Tabs:**
  - Overview: Statistics and recent activity
  - Profile: Staff information display
  - Courses: Course management
  - Students: Student management table
- Logout functionality with localStorage cleanup

## Getting Started

### 1. Setup Database
```bash
# Navigate to backend directory
cd backend

# Run SQL setup script
mysql -u root -p < setup-staff.sql
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm start
```
The server runs on `http://localhost:4000`

### 3. Start Frontend
```bash
cd src
npm start
```
The frontend runs on `http://localhost:3000`

## Testing Staff Login

1. **Navigate to Staff Login:** Click "Staff Login" from Quick Links dropdown
2. **Enter Credentials:**
   - Staff ID: `ETUSL0001`
   - Password: `P@$$W0RD`
3. **Expected Result:** Redirects to Staff Dashboard with staff information displayed

## API Endpoints

### Staff Authentication
**POST** `/api/auth/staff-login`
- Authenticates staff member
- Returns staff data excluding password

**GET** `/api/auth/staff/:staffId`
- Retrieves staff profile information
- Returns staff details for given staff ID

## Security Notes

⚠️ **Current Implementation:**
- Passwords are stored as plaintext (for development only)
- CORS is enabled for all origins
- No JWT token implementation yet

⚠️ **Production Recommendations:**
1. Use `bcrypt` to hash passwords
2. Implement JWT tokens instead of simple localStorage
3. Add HTTPS/SSL encryption
4. Implement rate limiting on login endpoint
5. Add session timeout
6. Use environment variables for sensitive data

## File Structure

```
project/
├── backend/
│   ├── server.js           # Express server with auth endpoints
│   ├── db.js               # MySQL connection pool
│   ├── setup-staff.sql     # Database schema and sample data
│   └── .env                # Environment variables
├── src/
│   ├── pages/
│   │   ├── StaffLogin.js   # Login form component
│   │   └── staff/
│   │       ├── StaffDashboard.js    # Dashboard component
│   │       └── StaffDashboard.css   # Dashboard styling
│   ├── App.js              # Main app with routing
│   └── App.css             # App styling
```

## Troubleshooting

### "Connection error. Please make sure the server is running."
- Verify backend server is running on port 4000
- Check firewall settings
- Ensure CORS is enabled on backend

### "Invalid staff ID or password"
- Verify staff record exists in database
- Check credentials: `ETUSL0001` / `P@$$W0RD`
- Run: `mysql> SELECT * FROM staff;` to list all staff

### Staff Dashboard not displaying
- Check localStorage: Open DevTools → Application → Local Storage
- Verify `staffToken` and `staff` keys are present
- Check browser console for errors

## Next Steps

1. **Enhance Password Security**
   - Implement bcrypt hashing
   - Add password reset functionality

2. **Implement JWT Authentication**
   - Generate JWT tokens on login
   - Validate tokens on protected endpoints

3. **Add Role-Based Access Control (RBAC)**
   - Define staff roles (admin, faculty, staff)
   - Restrict dashboard access based on roles

4. **Implement Session Management**
   - Add session timeout
   - Implement refresh token rotation

5. **Add Audit Logging**
   - Log login attempts
   - Track staff actions on dashboard

## Support
For issues or questions, please contact the development team.

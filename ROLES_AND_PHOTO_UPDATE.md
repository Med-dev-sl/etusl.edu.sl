# ETUSL Staff Authentication - Updated with Roles & Photo Upload

## 🆕 New Features Added

### 1. **Staff Roles System**
- **SUPERADMIN**: Full access to entire university portal, can manage all staff members
- **ADMIN**: Administrative access with limited staff management
- **FACULTY**: Faculty member access (teachers, professors)
- **STAFF**: Regular staff access

### 2. **Profile Photo Upload**
- Upload profile photo directly from dashboard
- Circular photo display with 150px x 150px
- Supports JPG, PNG, GIF formats
- Max 5MB file size
- Photos stored in `backend/uploads/` directory

### 3. **SUPERADMIN Staff Management**
- View all staff members in a table
- Edit staff details
- Delete staff members
- Add new staff members with role assignment
- Manage staff access and roles
- Control CRUD permissions

### 4. **Enhanced Database Schema**
New columns added to staff table:
- `role`: ENUM (SUPERADMIN, ADMIN, FACULTY, STAFF)
- `profile_photo`: VARCHAR (photo path)
- `bio`: TEXT (staff bio/description)
- `office_location`: VARCHAR (office address)
- `status`: ENUM (active, inactive, on_leave)

## 📋 Database Setup

### Step 1: Update Database Schema
Run this SQL to update existing staff table:

```sql
-- Drop existing staff table and recreate with new schema
DROP TABLE IF EXISTS staff;

-- Create new staff table with roles and photo support
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staffId VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('SUPERADMIN', 'ADMIN', 'FACULTY', 'STAFF') DEFAULT 'STAFF',
  profile_photo VARCHAR(255),
  bio TEXT,
  office_location VARCHAR(100),
  status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO staff (staffId, name, email, department, password, phone, role, office_location) VALUES 
('ETUSL0000', 'Admin User', 'admin@etusl.edu.sl', 'Administration', 'P@$$W0RD', '+232-123-4570', 'SUPERADMIN', 'Building A, Room 101'),
('ETUSL0001', 'Dr. John Smith', 'john.smith@etusl.edu.sl', 'Computer Science', 'P@$$W0RD', '+232-123-4567', 'FACULTY', 'Building B, Room 201'),
('ETUSL0002', 'Mrs. Sarah Johnson', 'sarah.johnson@etusl.edu.sl', 'English Department', 'P@$$W0RD', '+232-123-4568', 'FACULTY', 'Building C, Room 301'),
('ETUSL0003', 'Prof. Ahmed Hassan', 'ahmed.hassan@etusl.edu.sl', 'Mathematics', 'P@$$W0RD', '+232-123-4569', 'ADMIN', 'Building A, Room 205');
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install multer
npm start
```

## 🔐 Login Credentials

| Staff ID | Password | Role |
|----------|----------|------|
| ETUSL0000 | P@$$W0RD | SUPERADMIN |
| ETUSL0001 | P@$$W0RD | FACULTY |
| ETUSL0002 | P@$$W0RD | FACULTY |
| ETUSL0003 | P@$$W0RD | ADMIN |

## 🚀 Testing the New Features

### 1. **Login as SUPERADMIN**
```
Staff ID: ETUSL0000
Password: P@$$W0RD
```

### 2. **Upload Profile Photo**
- Click on profile photo placeholder
- Select a JPG/PNG image
- Click "Upload"
- Photo will be saved and displayed

### 3. **Access Staff Management** (SUPERADMIN Only)
- Click "Staff Management" in menu
- View all staff members
- Add new staff member using the form
- Edit/Delete staff members

## 📡 New API Endpoints

### Staff Management (SUPERADMIN)

**GET** `/api/staff`
- Get all staff members
- Returns: Array of staff objects

**GET** `/api/staff/:id`
- Get single staff member details
- Returns: Single staff object

**POST** `/api/staff`
- Add new staff member
- Body: `{ staffId, name, email, password, department, phone, role, office_location }`

**PUT** `/api/staff/:id`
- Update staff member
- Body: `{ name, email, department, phone, role, office_location, bio, status }`

**DELETE** `/api/staff/:id`
- Delete staff member

**POST** `/api/staff/:id/upload-photo`
- Upload profile photo
- Body: FormData with 'photo' file
- Returns: `{ photoPath: "/uploads/profile_ETUSL0000_123456.jpg" }`

**POST** `/api/staff/:id/change-password`
- Change staff password
- Body: `{ currentPassword, newPassword }`

## 📁 File Structure

```
backend/
├── server.js                    # Updated with multer & staff endpoints
├── package.json                 # Added multer dependency
├── uploads/                     # Profile photos stored here (auto-created)
└── setup-staff.sql             # Updated schema

src/
└── pages/
    └── staff/
        ├── StaffDashboard.js   # Updated with photo upload & staff mgmt
        └── StaffDashboard.css  # Updated styles for new features
```

## 🎯 SUPERADMIN Dashboard Features

### Overview Tab
- Statistics cards (courses, students, assignments, ratings)
- Recent activity feed

### Profile Tab
- Display all staff information
- Show office location
- Display bio

### Courses Tab
- List assigned courses
- Course details and student count

### Students Tab
- Student management table
- Grade tracking

### Staff Management Tab (SUPERADMIN ONLY)
- **Staff Table**: View all staff with roles and status
- **Staff Details**: Edit staff information
- **Add New Staff**: Form to add new staff members with role assignment
- **Delete Staff**: Remove staff members
- **Role Colors**:
  - 🔴 SUPERADMIN (Red)
  - 🟠 ADMIN (Orange)
  - 🔵 FACULTY (Blue)
  - ⚫ STAFF (Gray)

## 🖼️ Profile Photo Management

### Supported Formats
- JPG/JPEG
- PNG
- GIF

### Specifications
- Max size: 5MB
- Display size: 150x150px (circular)
- Storage: `backend/uploads/` directory
- Naming: `profile_STAFFID_TIMESTAMP.ext`

### Upload Steps
1. Click profile photo section
2. Select image file
3. Click "Upload" button
4. Photo updates in real-time

## ⚠️ Important Notes

1. **Database Migration**: Run the SQL script to update the staff table schema
2. **Uploads Directory**: Backend automatically creates `backend/uploads/` on startup
3. **Backend Restart**: After installing multer, restart backend with `npm start`
4. **CORS**: Enabled for localhost - update for production
5. **Security**: Passwords still plaintext - implement bcrypt for production

## 🔧 Configuration Files

### `.env` File
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=etusl_db
PORT=4000
```

### Upload Configuration
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/gif
- Storage path: `backend/uploads/`

## 🚨 Troubleshooting

**Q: Photo upload fails?**
- Check backend is running
- Verify uploads directory permissions
- Check file size < 5MB

**Q: Staff Management tab not showing?**
- Ensure logged in as SUPERADMIN (ETUSL0000)
- Check localStorage for staff data with role

**Q: Can't see uploaded photos?**
- Photos served from `/uploads` endpoint
- Verify backend server.js has static middleware
- Check photo path in database

**Q: New staff table not working?**
- Run the updated setup-staff.sql
- Clear old table: `DROP TABLE staff;`
- Restart backend server

## ✅ Next Steps

1. ✅ Update database schema
2. ✅ Install multer: `npm install multer`
3. ✅ Restart backend: `npm start`
4. ✅ Login as SUPERADMIN (ETUSL0000)
5. ✅ Test profile photo upload
6. ✅ Add new staff members
7. ✅ Manage staff roles and permissions

---

**Version**: 2.0 with Roles & Photo Upload  
**Last Updated**: January 2026

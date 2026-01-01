# ETUSL Update - Quick Command Reference

## 🔄 Database Update Commands

### 1. Update Staff Table Schema
```bash
mysql -u root -p
```

Then run:
```sql
DROP TABLE IF EXISTS staff;

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

INSERT INTO staff (staffId, name, email, department, password, phone, role, office_location) VALUES 
('ETUSL0000', 'Admin User', 'admin@etusl.edu.sl', 'Administration', 'P@$$W0RD', '+232-123-4570', 'SUPERADMIN', 'Building A, Room 101'),
('ETUSL0001', 'Dr. John Smith', 'john.smith@etusl.edu.sl', 'Computer Science', 'P@$$W0RD', '+232-123-4567', 'FACULTY', 'Building B, Room 201'),
('ETUSL0002', 'Mrs. Sarah Johnson', 'sarah.johnson@etusl.edu.sl', 'English Department', 'P@$$W0RD', '+232-123-4568', 'FACULTY', 'Building C, Room 301'),
('ETUSL0003', 'Prof. Ahmed Hassan', 'ahmed.hassan@etusl.edu.sl', 'Mathematics', 'P@$$W0RD', '+232-123-4569', 'ADMIN', 'Building A, Room 205');

SELECT * FROM staff;
EXIT;
```

## 📦 Backend Setup

### 2. Install Multer (File Upload)
```bash
cd backend
npm install multer
```

### 3. Start Backend
```bash
npm start
```
Server runs on: `http://localhost:4000`

## 🎨 Frontend Setup

### 4. Start Frontend (New Terminal)
```bash
# From root directory
npm start
```
Frontend runs on: `http://localhost:3000`

## 🧪 Testing

### Login as SUPERADMIN
1. Open `http://localhost:3000`
2. Click "Staff Login" from Quick Links
3. Enter:
   - **Staff ID**: ETUSL0000
   - **Password**: P@$$W0RD
4. Click "Sign In"

### Test Profile Photo Upload
1. Once logged in, click on profile photo placeholder
2. Select a JPG/PNG image
3. Click "Upload" button
4. Photo displays in circular frame

### Access Staff Management
1. Click "Staff Management" in left menu
2. View all staff members in table
3. Add new staff member using form below
4. Edit/Delete staff as needed

## 📊 Sample Test Data

| Staff ID | Name | Department | Role | Password |
|----------|------|-----------|------|----------|
| ETUSL0000 | Admin User | Administration | SUPERADMIN | P@$$W0RD |
| ETUSL0001 | Dr. John Smith | Computer Science | FACULTY | P@$$W0RD |
| ETUSL0002 | Mrs. Sarah Johnson | English Department | FACULTY | P@$$W0RD |
| ETUSL0003 | Prof. Ahmed Hassan | Mathematics | ADMIN | P@$$W0RD |

## 🆕 New API Endpoints

```
GET    /api/staff                      # Get all staff
GET    /api/staff/:id                  # Get single staff
POST   /api/staff                      # Add new staff
PUT    /api/staff/:id                  # Update staff
DELETE /api/staff/:id                  # Delete staff
POST   /api/staff/:id/upload-photo     # Upload profile photo
POST   /api/staff/:id/change-password  # Change password
```

## 📝 Files Updated

```
✅ backend/server.js              - Added multer, staff endpoints
✅ backend/package.json           - Added multer dependency
✅ backend/setup-staff.sql        - Updated schema with roles/photo
✅ src/pages/staff/StaffDashboard.js  - Added photo upload, staff mgmt
✅ src/pages/staff/StaffDashboard.css - Added styling for new features
```

## 📁 New Directories

```
📂 backend/uploads/               - Auto-created for profile photos
```

## 🎯 Key Features

✅ **Staff Roles**
- SUPERADMIN: Full university portal access
- ADMIN: Administrative functions
- FACULTY: Faculty access
- STAFF: Basic staff access

✅ **Profile Photos**
- Upload JPG/PNG/GIF
- Max 5MB
- Circular display (150x150px)
- Auto-saved to backend/uploads/

✅ **Staff Management** (SUPERADMIN Only)
- View all staff members
- Edit staff details
- Delete staff
- Add new staff with role assignment
- Manage access and permissions

## 🔗 Quick Links

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **Staff API**: http://localhost:4000/api/staff

## ⚠️ Important

1. **MySQL must have no password** (or update .env)
2. **Port 4000 must be available** for backend
3. **Port 3000 must be available** for frontend
4. **Database must be created**: `CREATE DATABASE etusl_db;`
5. **Run SQL setup script** to create staff table with new schema

## 🚨 If Something Goes Wrong

### Backend won't start?
```bash
# Check port 4000 is free
netstat -ano | findstr :4000

# Kill process if needed
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force

# Try again
npm start
```

### Photos not uploading?
- Check `backend/uploads/` directory exists
- Verify backend is running
- Check file size < 5MB
- Check file format (JPG/PNG/GIF)

### Staff Management tab not showing?
- Login as ETUSL0000 (SUPERADMIN)
- Check browser console for errors
- Verify staff data in localStorage

## 📞 Support

For detailed information, see:
- `ROLES_AND_PHOTO_UPDATE.md` - Comprehensive guide
- `backend/setup-staff.sql` - Database schema
- `src/pages/staff/StaffDashboard.js` - Implementation details

---

**Ready to test?** Follow steps 1-4 above! 🚀

-- Staff Table Schema with Roles and Profile Photo
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

-- Sample Data (password: P@$$W0RD)
-- SUPERADMIN has full access to portal
INSERT INTO staff (staffId, name, email, department, password, phone, role, office_location) VALUES 
('ETUSL0000', 'Admin User', 'admin@etusl.edu.sl', 'Administration', 'P@$$W0RD', '+232-123-4570', 'SUPERADMIN', 'Building A, Room 101'),
('ETUSL0001', 'Dr. John Smith', 'john.smith@etusl.edu.sl', 'Computer Science', 'P@$$W0RD', '+232-123-4567', 'FACULTY', 'Building B, Room 201'),
('ETUSL0002', 'Mrs. Sarah Johnson', 'sarah.johnson@etusl.edu.sl', 'English Department', 'P@$$W0RD', '+232-123-4568', 'FACULTY', 'Building C, Room 301'),
('ETUSL0003', 'Prof. Ahmed Hassan', 'ahmed.hassan@etusl.edu.sl', 'Mathematics', 'P@$$W0RD', '+232-123-4569', 'ADMIN', 'Building A, Room 205');


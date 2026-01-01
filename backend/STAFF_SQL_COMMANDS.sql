-- Quick Setup Commands for ETUSL Staff Table

-- Step 1: Create the staff table
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staffId VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 2: Insert sample staff data (All with password: P@$$W0RD)
INSERT INTO staff (staffId, name, email, department, password, phone) VALUES 
('ETUSL0001', 'Dr. John Smith', 'john.smith@etusl.edu.sl', 'Computer Science', 'P@$$W0RD', '+232-123-4567'),
('ETUSL0002', 'Mrs. Sarah Johnson', 'sarah.johnson@etusl.edu.sl', 'English Department', 'P@$$W0RD', '+232-123-4568'),
('ETUSL0003', 'Prof. Ahmed Hassan', 'ahmed.hassan@etusl.edu.sl', 'Mathematics', 'P@$$W0RD', '+232-123-4569'),
('ETUSL0000', 'Admin User', 'admin@etusl.edu.sl', 'Administration', 'P@$$W0RD', '+232-123-4570');

-- Step 3: Verify the data was inserted
SELECT * FROM staff;

-- Step 4: To test login, use these credentials:
-- Username: ETUSL0001
-- Password: P@$$W0RD

-- Step 5: To update a staff member's password (future use):
-- UPDATE staff SET password = 'NewPassword123' WHERE staffId = 'ETUSL0001';

-- Step 6: To delete a staff member:
-- DELETE FROM staff WHERE staffId = 'ETUSL0001';

-- Step 7: View all staff ordered by date created:
-- SELECT * FROM staff ORDER BY created_at DESC;

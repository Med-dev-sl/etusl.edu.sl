# MySQL Connection Setup Guide

## The Problem
Your `.env` file has `DB_PASSWORD=your_db_password` which is a placeholder.
The actual MySQL root password is needed to connect.

## Solution

### Option 1: If MySQL Root has NO Password (Default)
Edit `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=etusl_db
PORT=4000
```

### Option 2: If MySQL Root has a Password
Replace `your_actual_password` with your MySQL root password:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=etusl_db
PORT=4000
```

### Option 3: Create a New MySQL User (Recommended)
Run these commands in MySQL:

```sql
-- Create new user for ETUSL app
CREATE USER 'etusl_user'@'localhost' IDENTIFIED BY 'etusl_password_123';

-- Grant all privileges to etusl_db
GRANT ALL PRIVILEGES ON etusl_db.* TO 'etusl_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Test connection
mysql -u etusl_user -p etusl_db
```

Then update `.env`:
```
DB_HOST=localhost
DB_USER=etusl_user
DB_PASSWORD=etusl_password_123
DB_NAME=etusl_db
PORT=4000
```

## Quick Check - What's Your MySQL Root Password?

### Find your MySQL root password:
1. **Windows XAMPP**: Usually blank (empty password)
2. **Windows MySQL Installer**: Password you set during installation
3. **Docker**: Check your docker run command or docker-compose
4. **WSL/Linux**: Check /root/.mysql_history or your setup notes

### Test MySQL Connection:
```bash
# Test with no password
mysql -u root

# Test with password
mysql -u root -p

# Then just press Enter to connect and run:
SELECT 1;
```

## Fix Instructions

1. **Update your `.env` file with the correct password**
2. **Ensure MySQL database exists:**
   ```sql
   CREATE DATABASE IF NOT EXISTS etusl_db;
   ```
3. **Create the staff table:**
   ```bash
   mysql -u root -p etusl_db < backend/setup-staff.sql
   ```
4. **Restart the backend server:**
   ```bash
   cd backend
   npm start
   ```

---

**Need help?** Check what MySQL version and root password you have, then update `.env` accordingly.

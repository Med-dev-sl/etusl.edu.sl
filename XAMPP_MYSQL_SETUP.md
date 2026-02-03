# XAMPP MySQL External Access Setup

## Overview

Using XAMPP to run MySQL locally and expose it externally via ngrok.

## Step 1: Install XAMPP

1. Download from https://www.apachefriends.org/
2. Run installer
3. Install components:
   - ✅ Apache
   - ✅ MySQL
   - ✅ PHP
   - ❌ Perl (optional)

## Step 2: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Click **Start** for:
   - Apache
   - MySQL

Status should show **Running** in green

## Step 3: Configure MySQL for External Access

### Edit MySQL Config File

1. Open XAMPP Control Panel
2. Click **Config** button next to MySQL
3. Select **my.ini**
4. Find this line:
   ```ini
   bind-address = 127.0.0.1
   ```
5. Change to:
   ```ini
   bind-address = 0.0.0.0
   ```
6. Save file
7. Restart MySQL in XAMPP Control Panel:
   - Click **Stop**
   - Wait 3 seconds
   - Click **Start**

### Verify Configuration

```bash
# Check if MySQL is listening on all interfaces
netstat -an | findstr :3306

# Should show:
# TCP    0.0.0.0:3306    0.0.0.0:0    LISTENING
```

## Step 4: Access XAMPP MySQL

### Local Access

```bash
# Using XAMPP MySQL
cd C:\xampp\mysql\bin
mysql -u root -p
# No password by default, just press Enter

# Or using MySQL command line:
mysql -h 127.0.0.1 -u root
```

### Create Your Database

```sql
CREATE DATABASE IF NOT EXISTS etusl_db;
SHOW DATABASES;
```

## Step 5: Expose MySQL via ngrok

### Terminal 1: Start Backend

```bash
cd backend
npm start
# Runs on localhost:4000
```

### Terminal 2: Expose MySQL

```bash
ngrok tcp 3306
```

Output:
```
Forwarding    tcp://X.tcp.ngrok.io:12345 -> localhost:3306
```

### Terminal 3: Expose Backend (Optional)

```bash
# If you want to also expose backend
ngrok http 4000
```

## Step 6: Use ngrok Tunnel for Database Connection

### Backend Configuration

Edit `backend/.env`:

```env
# For ngrok MySQL access
DB_HOST=X.tcp.ngrok.io
DB_PORT=12345              # Port from ngrok output
DB_USER=root
DB_PASSWORD=               # XAMPP default is empty
DB_NAME=etusl_db

# Server
PORT=4000
NODE_ENV=development
```

### Update backend/db.js

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'etusl_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { pool, query };
```

## Step 7: Test Database Setup

### Create Tables

Run all setup scripts:

```bash
cd backend
node setup-policies.js
node setup-announcements.js
node setup-staff.sql
# etc. for other tables
```

### Verify Connection

```bash
# Test from command line
mysql -h X.tcp.ngrok.io -P 12345 -u root etusl_db
# Should connect successfully
```

### Verify from Node.js

```bash
# In backend folder
node -e "
const db = require('./db.js');
db.query('SELECT 1 as test').then(rows => {
  console.log('Connected:', rows);
}).catch(err => {
  console.error('Error:', err.message);
});
"
```

## Manage XAMPP MySQL Data

### XAMPP Folders

- **Data**: `C:\xampp\mysql\data\`
- **Backups**: Create your own backup folder
- **Config**: `C:\xampp\mysql\bin\my.ini`

### Backup Database

```bash
# From command line
cd C:\xampp\mysql\bin
mysqldump -u root etusl_db > C:\backup\etusl_db_backup.sql

# Or use phpMyAdmin (easier):
# 1. Go to http://localhost/phpmyadmin
# 2. Select etusl_db database
# 3. Click "Export"
# 4. Download SQL file
```

### Restore Database

```bash
mysql -u root etusl_db < C:\backup\etusl_db_backup.sql
```

## Use phpMyAdmin (Web GUI)

### Access phpMyAdmin

1. Keep XAMPP running
2. Go to http://localhost/phpmyadmin
3. Username: `root`
4. Password: (leave blank)
5. Click Login

### Create Database

1. Click **New** database
2. Name: `etusl_db`
3. Click Create

### Run SQL Queries

1. Select database: `etusl_db`
2. Click **SQL** tab
3. Paste your SQL commands
4. Click Execute

### Example: Create Policies Table

```sql
CREATE TABLE IF NOT EXISTS policies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  content LONGTEXT,
  status ENUM('active', 'inactive') DEFAULT 'inactive',
  author_id INT,
  author_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Architecture: XAMPP + ngrok

```
┌─────────────────┐
│ React Frontend  │  (Firebase)
│ (Firebase)      │
└────────┬────────┘
         │
         ↓ REACT_APP_API_URL
┌─────────────────────────────────┐
│ ngrok http 4000                 │
│ https://xxxx.ngrok-free.dev     │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Node.js Backend                 │
│ localhost:4000                  │
└────────┬────────────────────────┘
         │
         ↓ DB_HOST, DB_PORT
┌─────────────────────────────────┐
│ ngrok tcp 3306                  │
│ X.tcp.ngrok.io:12345            │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ XAMPP MySQL Database            │
│ localhost:3306                  │
│ etusl_db                        │
└─────────────────────────────────┘
```

## Complete Startup Sequence

### Every Time You Start:

**Terminal 1** - Start XAMPP
```bash
# Open XAMPP Control Panel
# Click Start → Apache
# Click Start → MySQL
# Wait for green status
```

**Terminal 2** - Start Backend
```bash
cd backend
npm start
# Output: Server listening on port 4000
```

**Terminal 3** - Expose MySQL
```bash
ngrok tcp 3306
# Copy the assigned port (e.g., 12345)
```

**Terminal 4** - Expose Backend (Optional)
```bash
ngrok http 4000
# Copy the HTTPS URL
```

**Update .env Files**
- `backend/.env`: Add DB_HOST and DB_PORT from ngrok
- React `.env`: Add REACT_APP_API_URL from ngrok

**Start Frontend**
```bash
npm start
# Or deploy to Firebase
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MySQL won't start | Check if port 3306 is already in use: `netstat -ano \| findstr :3306` |
| Can't connect remotely | Verify bind-address=0.0.0.0 in my.ini; Restart MySQL |
| ngrok connection refused | Check backend is running on 4000; Check MySQL is running |
| "Access denied for user 'root'" | XAMPP has no password by default; Leave password empty |
| phpMyAdmin shows error | Restart Apache in XAMPP Control Panel |
| High latency from ngrok | This is normal on free tier; Consider upgrading to ngrok Pro |

## Advantages & Disadvantages

### ✅ Advantages
- Free
- No special configuration needed
- Easy to manage via GUI (phpMyAdmin)
- Good for development/testing
- Works offline (except ngrok part)

### ❌ Disadvantages
- Requires local machine always running
- ngrok URL changes every restart (free tier)
- Limited to ngrok's 40 concurrent connections
- Only for development, not production

## When to Use XAMPP

- ✅ Development environment
- ✅ Learning and testing
- ✅ Local backup of production data
- ✅ Quick prototyping
- ❌ NOT for production

## Move to Production

When ready for production, migrate to:

**Option 1: Render + PlanetScale**
- See: `RENDER_DEPLOYMENT_GUIDE.md`
- Permanent backend hosting
- Professional MySQL hosting
- Both free tier available

**Option 2: AWS + RDS**
- Free tier: 12 months
- Professional managed database
- Scalable infrastructure

**Option 3: Azure + MySQL Flexible Server**
- Free tier available
- Enterprise support
- Global redundancy

---

**Current Setup**: XAMPP (local) + ngrok (external access) = Development environment

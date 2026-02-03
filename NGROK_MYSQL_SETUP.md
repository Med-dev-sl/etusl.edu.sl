# ngrok + MySQL External Access Setup

## Quick Setup (2 Steps)

You're already using ngrok to expose localhost! Here's how to also expose MySQL:

### Step 1: Check MySQL is Running

```bash
# Verify MySQL is running on port 3306
netstat -an | findstr :3306

# Or in a new terminal:
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -p
# If it connects, MySQL is running!
```

### Step 2: Expose MySQL via ngrok

**Terminal 1** (Already running - Web/Backend):
```bash
ngrok http 4000  # Your Node.js backend (or whatever port)
```

**Terminal 2** (New - MySQL):
```bash
ngrok tcp 3306  # MySQL port
```

You'll see:
```
Forwarding    tcp://X.tcp.ngrok.io:XXXXX -> localhost:3306
```

## Update Backend to Use ngrok MySQL Tunnel

### For Local Testing (Keep as is):
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=etusl_db
```

### For Remote Access (Use ngrok tunnel):
```bash
DB_HOST=X.tcp.ngrok.io  # From ngrok output above
DB_PORT=XXXXX            # Port number from ngrok
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=etusl_db
```

## Configure MySQL for Remote Connections

### Step 1: Find MySQL Config File

**Windows XAMPP:**
```
C:\xampp\mysql\bin\my.ini
```

**Windows MySQL Server:**
```
C:\Program Files\MySQL\MySQL Server 8.0\my.ini
```

### Step 2: Edit my.ini

Find this line:
```ini
bind-address = 127.0.0.1
```

Change to:
```ini
bind-address = 0.0.0.0
```

### Step 3: Restart MySQL

```bash
# If using XAMPP:
# 1. Open XAMPP Control Panel
# 2. Click "Stop" on MySQL
# 3. Click "Start" on MySQL

# If using MySQL Service:
net stop MySQL80
net start MySQL80
```

## Test Remote MySQL Connection

### Option 1: Using MySQL Workbench

1. New Connection
2. Connection Name: `ngrok-mysql`
3. Hostname: `X.tcp.ngrok.io` (from ngrok)
4. Port: `XXXXX` (from ngrok)
5. Username: `root`
6. Password: your MySQL password
7. Test Connection

### Option 2: Using Command Line

```bash
# Replace with your ngrok values
mysql -h X.tcp.ngrok.io -P XXXXX -u root -p
```

If it connects, MySQL is accessible externally!

## Update Your Backend Code

Edit `backend/db.js`:

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,  // Add this line
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'etusl_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// rest of file...
```

Update `backend/.env`:

```
DB_HOST=X.tcp.ngrok.io
DB_PORT=XXXXX
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=etusl_db
```

## Deploy This Way (ngrok + MySQL)

### Architecture:
```
React Frontend (Firebase)
        ↓
   ngrok http 4000 (Backend)
        ↓
Node.js Express Backend (localhost:4000)
        ↓
   ngrok tcp 3306 (MySQL)
        ↓
MySQL Database (localhost:3306)
```

### To Deploy:

1. **Terminal 1** - Start Backend:
```bash
cd backend
npm start  # Runs on localhost:4000
```

2. **Terminal 2** - Expose Backend via ngrok:
```bash
ngrok http 4000
# Copy HTTPS URL: https://xxxx-xxxx-xxxx.ngrok-free.dev
```

3. **Terminal 3** - Expose MySQL via ngrok:
```bash
ngrok tcp 3306
# Copy TCP URL: X.tcp.ngrok.io:XXXXX
```

4. Update `.env`:
```
DB_HOST=X.tcp.ngrok.io
DB_PORT=XXXXX
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=etusl_db
NODE_ENV=production
```

5. Update React `.env`:
```
REACT_APP_API_URL=https://xxxx-xxxx-xxxx.ngrok-free.dev
```

## Important Notes

⚠️ **ngrok Free Tier Limitations:**
- Session expires every 2-8 hours
- Public tunnel (anyone can access with URL)
- 40 concurrent connections limit
- Rate limited to 20 requests/minute

✅ **Advantages:**
- No additional cost
- Works from home
- Great for testing before Render/production
- Bypasses NAT and firewalls

## Keep Sessions Running

To prevent ngrok sessions from expiring:

**Option 1: ngrok Web Dashboard**
- Go to http://127.0.0.1:4040
- Monitor connections in real-time

**Option 2: Use ngrok Config**
Create `C:\Users\Princess Magbie\.ngrok2\ngrok.yml`:
```yaml
authtoken: your-ngrok-authtoken
region: eu
tunnels:
  backend:
    proto: http
    addr: 4000
  mysql:
    proto: tcp
    addr: 3306
```

Then run both tunnels at once:
```bash
ngrok start --all
```

## Production Alternative: Upgrade ngrok

For production, consider:
- **ngrok Pro** ($10/month) - Custom URLs, longer sessions
- **Switch to Render** (free tier available) - Permanent backend hosting
- **AWS RDS** - Professional MySQL hosting

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Ensure MySQL is running (`netstat -an \| findstr :3306`) |
| "Too many connections" | Reduce connection pool or restart MySQL |
| ngrok URL changes | This is normal on free tier - update config each time |
| Can't connect remotely | Check MySQL bind-address is 0.0.0.0 in my.ini |
| Port already in use | Kill process using port: `netstat -ano \| findstr :3306` |

---

This setup keeps your MySQL and backend running locally while exposing them externally via ngrok - perfect for development and testing!

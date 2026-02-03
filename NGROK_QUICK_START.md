# Quick Start: ngrok + XAMPP + MySQL (Today)

## You Already Have

✅ ngrok running on http 4000
✅ XAMPP installed  
✅ Node.js backend ready
✅ MySQL database

## What You Need to Do (10 Minutes)

### Step 1: Configure XAMPP MySQL (2 min)

**Open XAMPP Control Panel:**
1. Make sure **MySQL** shows "Running" (green)
2. Click **Config** button next to MySQL
3. Select **my.ini**
4. Find: `bind-address = 127.0.0.1`
5. Change to: `bind-address = 0.0.0.0`
6. Save
7. In XAMPP: Click **Stop** MySQL → Wait → Click **Start** MySQL

### Step 2: Start ngrok for MySQL (2 min)

**Open new Terminal/PowerShell:**
```powershell
# Navigate anywhere
ngrok tcp 3306
```

**You'll see:**
```
Forwarding    tcp://X.tcp.ngrok.io:12345 -> localhost:3306
```

**Save these values:**
- DB_HOST = `X.tcp.ngrok.io`
- DB_PORT = `12345` (the number after colon)

### Step 3: Update Backend Config (2 min)

**Edit `backend/.env`:**
```env
DB_HOST=X.tcp.ngrok.io
DB_PORT=12345
DB_USER=root
DB_PASSWORD=
DB_NAME=etusl_db
PORT=4000
NODE_ENV=development
```

### Step 4: Start Backend (2 min)

**In Terminal (in `backend` folder):**
```powershell
npm start
```

**Should show:**
```
Server listening on port 4000
```

### Step 5: Test Connection (2 min)

**In PowerShell:**
```powershell
# Test MySQL connection
mysql -h X.tcp.ngrok.io -P 12345 -u root

# Should connect!
# If not, check:
# 1. MySQL is running in XAMPP (green status)
# 2. You used correct ngrok host and port
# 3. No typos in .env file
```

## Done! 

Your setup is now:
```
React Frontend (localhost:3000)
         ↓
Node Backend (localhost:4000) 
         ↓
XAMPP MySQL (via ngrok tunnel)
```

## Test Your API

```bash
curl http://localhost:4000/health
# Should return: {"status":"ok"}

curl http://localhost:4000/api/policies/active
# Should return: {"items":[...]}
```

## Troubleshooting

### "Connection refused" error

1. Check MySQL is running:
   ```powershell
   netstat -an | findstr :3306
   ```
   Should show: `TCP    0.0.0.0:3306    0.0.0.0:0    LISTENING`

2. Check bind-address is 0.0.0.0 in my.ini

3. Restart MySQL in XAMPP

### "Access denied for user 'root'"

XAMPP MySQL has no password by default:
- Leave `DB_PASSWORD=` empty (or remove it)

### ngrok URL keeps changing

This is normal on free tier. Every time you restart ngrok, it gets a new URL.

**Solution:** Get the new URL and update `.env`

### Still not working?

**Check logs:**
```bash
# In backend folder
npm start
# Look for error messages
```

**Check database:**
```bash
# Can you connect locally?
mysql -u root
```

---

## Next Steps

1. **Today**: Finish setup (10 min)
2. **Test**: Verify backend connects to MySQL
3. **Create Data**: Run setup scripts
4. **Test APIs**: Verify endpoints work
5. **Frontend**: Connect React to backend

## Files Reference

- `NGROK_MYSQL_SETUP.md` - Detailed ngrok guide
- `XAMPP_MYSQL_SETUP.md` - XAMPP configuration
- `backend/.env.example` - Environment variables template

---

## Real-Time Monitoring

While developing:

1. **XAMPP Control Panel**: Keep open to monitor MySQL status
2. **ngrok Web UI**: Go to http://127.0.0.1:4040 to see all connections
3. **Terminal**: Keep Node.js running, watch for error messages

---

## Terminal Layout

Recommended terminal setup:

```
Terminal 1: npm start (backend)
Terminal 2: ngrok tcp 3306 (MySQL)
Terminal 3: ngrok http 4000 (Backend, optional)
Terminal 4: mysql -h ... (testing)
XAMPP Control Panel: Keep open
```

---

You're all set! Continue to `MYSQL_HOSTING_OPTIONS.md` for next steps when ready.

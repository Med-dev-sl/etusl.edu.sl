# MySQL External Access - One Page Reference

## Current Setup (What You Have)

```
✅ XAMPP (MySQL local)
✅ ngrok (tunneling)
✅ Node.js backend
✅ React frontend (Firebase)
```

---

## To Make MySQL Accessible Externally

### Option A: ngrok + XAMPP (Fastest - 10 min)

```bash
# Terminal 1: Start XAMPP
# Open XAMPP Control Panel → Click Start (Apache & MySQL)

# Terminal 2: Expose MySQL
ngrok tcp 3306
# Shows: tcp://X.tcp.ngrok.io:12345

# Terminal 3: Start backend
cd backend
npm start

# Update backend/.env:
DB_HOST=X.tcp.ngrok.io
DB_PORT=12345
DB_USER=root
DB_PASSWORD=
DB_NAME=etusl_db
```

**Result:** MySQL accessible from anywhere via ngrok tunnel
**Cost:** $0
**Duration:** Temporary (URL changes on restart)

---

### Option B: Cloud Database (Professional)

| Service | Cost | Effort | Best For |
|---------|------|--------|----------|
| **PlanetScale** | Free | 5 min | Testing |
| **AWS RDS** | Free (12 mo) | 15 min | Professional |
| **Azure MySQL** | Free ($12) | 10 min | Enterprise |

**Recommended:** PlanetScale (free, easy, professional)

```
1. Go to planetscale.com
2. Create database
3. Get connection string
4. Update backend/.env
```

---

## XAMPP MySQL Configuration

Edit: `C:\xampp\mysql\bin\my.ini`

```ini
# Find this:
bind-address = 127.0.0.1

# Change to:
bind-address = 0.0.0.0
```

Then restart MySQL in XAMPP Control Panel.

---

## Test Connection

```bash
# From command line
mysql -h X.tcp.ngrok.io -P 12345 -u root

# Or test via backend
npm start
curl http://localhost:4000/health
# Should return: {"status":"ok"}
```

---

## Environment Variables

```env
# For ngrok:
DB_HOST=X.tcp.ngrok.io
DB_PORT=12345

# For PlanetScale:
DB_HOST=your-host.psdb.cloud
DB_PORT=3306

# Always:
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=etusl_db
```

---

## Tunnels Needed

| Service | Port | Command |
|---------|------|---------|
| **MySQL** | 3306 | `ngrok tcp 3306` |
| **Backend** (optional) | 4000 | `ngrok http 4000` |
| **Frontend** (local) | 3000 | `npm start` |

---

## Complete Startup Sequence

```bash
# 1. XAMPP Control Panel
#    Click Start: Apache, MySQL
#    → Wait for green status

# 2. Terminal 1: Backend
cd backend
npm start
→ Runs on localhost:4000

# 3. Terminal 2: MySQL Tunnel
ngrok tcp 3306
→ Shows X.tcp.ngrok.io:12345

# 4. Update backend/.env
DB_HOST=X.tcp.ngrok.io
DB_PORT=12345
# (restart backend if needed)

# 5. Test
curl http://localhost:4000/health
→ {"status":"ok"}

# 6. Frontend (separate)
npm start
→ Runs on localhost:3000
```

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| MySQL won't start | Check XAMPP, click Stop then Start |
| Connection refused | Verify bind-address=0.0.0.0 in my.ini |
| ngrok keeps timing out | ngrok free tier has limits; restart it |
| Can't connect from Node.js | Update .env, restart npm start |
| "Access denied" | XAMPP has no password; leave empty |

---

## Files to Read

**Quick Setup (5 min):** `NGROK_QUICK_START.md`

**Detailed Guide (20 min):** `NGROK_MYSQL_SETUP.md`

**XAMPP Configuration (15 min):** `XAMPP_MYSQL_SETUP.md`

**Compare Options (10 min):** `MYSQL_HOSTING_OPTIONS.md`

**Full Index:** `DATABASE_AND_HOSTING_INDEX.md`

---

## Architecture Diagram

```
React Frontend
    ↓
Node.js Backend (localhost:4000)
    ↓
ngrok tcp 3306 (X.tcp.ngrok.io:12345)
    ↓
XAMPP MySQL (localhost:3306)
```

---

## Backend Already Configured ✅

- [x] Uses process.env.DB_HOST, DB_PORT
- [x] Fallback to localhost:3306
- [x] npm start script ready
- [x] Health endpoint /health
- [x] All APIs ready

See: `backend/db.js` and `backend/.env.example`

---

## Next Steps

1. **Now:** Configure XAMPP MySQL (bind-address = 0.0.0.0)
2. **Now:** Start ngrok tcp 3306
3. **Now:** Update .env with ngrok values
4. **Today:** Test backend connection
5. **This Week:** Test all APIs
6. **Next Week:** Migrate to cloud database (PlanetScale)
7. **Next Month:** Deploy to production (Render)

---

## Status

✅ **Ready:** Backend, XAMPP, ngrok  
🔵 **Needed:** External MySQL access (set up above)  
🟢 **Later:** Cloud deployment  

---

**Time to Set Up:** 10 minutes  
**Difficulty:** Easy  
**Cost:** Free  
**Duration:** Temporary (ngrok free tier)  

👉 **Start with:** `NGROK_QUICK_START.md`

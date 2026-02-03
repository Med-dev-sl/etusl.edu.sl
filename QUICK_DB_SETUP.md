# Database Setup - Quick Reference Card

## 3 Ways to Get Free MySQL

### 🥇 PlanetScale (BEST - Free Forever)
```
Website: https://planetscale.com
Time: 5 minutes
Cost: Free
Production Ready: YES

Quick Setup:
1. Sign up (free account)
2. Create database "etusl_db"
3. Create password
4. Copy connection string
5. Add to Render environment

Connection Details in Render:
DB_HOST = host.region.psdb.cloud
DB_USER = [username]
DB_PASSWORD = [password]
DB_NAME = etusl_db
```

### 🥈 Railway (Good Alternative)
```
Website: https://railway.app
Time: 10 minutes
Cost: Free ($5/mo credit)
Production Ready: YES

Quick Setup:
1. Sign up (GitHub login)
2. New Project → Add MySQL
3. Wait 2-3 minutes
4. Copy connection variables
5. Add to Render environment

Connection Details in Render:
DB_HOST = [MYSQLHOST]
DB_USER = [MYSQLUSER]
DB_PASSWORD = [MYSQLPASSWORD]
DB_NAME = [MYSQL_DB]
```

### 🥉 ngrok + Local XAMPP (Testing Only)
```
Website: https://ngrok.com
Time: 5 minutes
Cost: Free (with limitations)
Production Ready: NO

Quick Setup:
1. Download and install ngrok
2. Keep XAMPP MySQL running
3. Run: ngrok tcp 3306
4. Copy the URL shown
5. Add to Render environment

Connection Details in Render:
DB_HOST = 0.tcp.ngrok.io
DB_PORT = [port shown by ngrok]
DB_USER = root
DB_PASSWORD = [your XAMPP password]
DB_NAME = etusl_db

⚠️ URL changes on disconnect!
⚠️ Must keep XAMPP running 24/7!
```

---

## Fast Decision

**Use PlanetScale** if you want:
- ✅ Simplest setup
- ✅ Free forever
- ✅ Production-ready
- ✅ No maintenance

**Use Railway** if you want:
- ✅ Alternative option
- ✅ Good backup
- ✅ Free credits
- ✅ Still reliable

**Use ngrok** if you want:
- ❌ To test temporarily
- ❌ Without migrating data
- ❌ NOT for production

---

## Environment Variables for Render

```
# For PlanetScale
DB_HOST = xxxxx.us-east-1.psdb.cloud
DB_USER = [copy from PlanetScale]
DB_PASSWORD = [copy from PlanetScale]
DB_NAME = etusl_db
NODE_ENV = production

# For Railway
DB_HOST = [from MYSQLHOST]
DB_USER = [from MYSQLUSER]
DB_PASSWORD = [from MYSQLPASSWORD]
DB_NAME = [from MYSQL_DB]
NODE_ENV = production

# For ngrok
DB_HOST = 0.tcp.ngrok.io
DB_PORT = 12345 (whatever ngrok shows)
DB_USER = root
DB_PASSWORD = [your XAMPP password]
DB_NAME = etusl_db
NODE_ENV = production
```

---

## Test Commands

```bash
# Test Render health check
curl https://etusl-backend.onrender.com/health

# Test database connection (from Render logs)
# Go to Render dashboard → Service → Logs tab
# Look for database connection success message

# Test from command line (optional)
mysql -h [DB_HOST] -u [DB_USER] -p[DB_PASSWORD] [DB_NAME]
```

---

## Recommended Path

1. **PlanetScale** (5 min) → Most reliable ✅
2. Configure Render (2 min) → Add credentials
3. Test `/health` (1 min) → Verify connection
4. Done! → Backend is live

---

## Cost Summary (Monthly)

| Option | Cost | Suitable For |
|--------|------|-------------|
| PlanetScale | $0 | Production |
| Railway | $0 (with credit) | Production |
| ngrok | $0 | Testing only |

**Total Cost**: $0/month for full backend + database setup

---

## Important Files

- ✅ Backend ready: `backend/db.js` supports `DB_PORT`
- ✅ Environment template: `backend/.env.example`
- ✅ Full guides: See other documentation files

---

## Next Step

**→ Choose one option above and get your database URL**

Then come back and we'll add it to Render in 2 minutes.

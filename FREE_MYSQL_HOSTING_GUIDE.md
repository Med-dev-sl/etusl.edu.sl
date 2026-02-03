# Free MySQL Hosting & XAMPP External Access

## Option 1: PlanetScale (Recommended) ⭐

**Why**: Free tier, reliable, secure, no credit card needed initially

### Setup Steps:

1. **Sign up**: https://planetscale.com (click "Sign up")
2. **Create Organization**: Enter name and click "Create Organization"
3. **Create Database**:
   - Click "Create a new database"
   - Name: `etusl_db`
   - Region: Select closest to you
   - Click "Create database"

4. **Get Connection String**:
   - Go to your database → "Connect" button
   - Select "Node.js" from dropdown
   - Copy the connection string (looks like):
     ```
     mysql://xxxx:xxxxx@xxx.us-east-1.psdb.cloud/etusl_db?sslaccept=strict
     ```

5. **Extract Details**:
   - Click "Create password" if needed
   - You'll see something like:
     ```
     User: user-xxxxx
     Password: pscale_pw_xxxxx
     Host: xxxxx.us-east-1.psdb.cloud
     Database: etusl_db
     ```

6. **Use in Render**:
   - `DB_HOST`: `xxxxx.us-east-1.psdb.cloud`
   - `DB_USER`: `user-xxxxx`
   - `DB_PASSWORD`: `pscale_pw_xxxxx`
   - `DB_NAME`: `etusl_db`

### Import Existing Data (Optional):

If you want to transfer your local XAMPP data to PlanetScale:

```bash
# Export from local MySQL
mysqldump -u root -p etusl_db > backup.sql

# Import to PlanetScale
mysql -h xxxxx.us-east-1.psdb.cloud -u user-xxxxx -p etusl_db < backup.sql
# When prompted, paste your PlanetScale password
```

---

## Option 2: Railway ✈️

**Why**: Free $5/month credit, simple setup, generous limits

### Setup Steps:

1. **Sign up**: https://railway.app (GitHub login recommended)
2. **Create Project**: Click "New Project" → "Provision MySQL"
3. **Wait** for database to start (2-3 minutes)
4. **Get Variables**: Click database → "Connect" tab
5. **Copy Details**:
   - Look for `DATABASE_URL` or individual variables:
     - `MYSQLHOST`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
     - `MYSQL_DB`

6. **Use in Render**:
   - `DB_HOST`: from `MYSQLHOST`
   - `DB_USER`: from `MYSQLUSER`
   - `DB_PASSWORD`: from `MYSQLPASSWORD`
   - `DB_NAME`: from `MYSQL_DB`

**Cost**: Free ($5/month credit, enough for testing)

---

## Option 3: Make XAMPP MySQL Accessible Externally 🌐

**If you want to use your local XAMPP database:**

### Method A: ngrok (Easiest - Free)

1. **Install ngrok**: https://ngrok.com/download
   - Download and extract to a folder
   - Add to PATH or use full path

2. **Start MySQL** in XAMPP (Control Panel → MySQL → Start)

3. **Expose MySQL via ngrok**:
   ```powershell
   ngrok tcp 3306
   ```
   - This outputs something like:
     ```
     tcp://0.tcp.ngrok.io:12345
     ```

4. **Use in Render**:
   - `DB_HOST`: `0.tcp.ngrok.io`
   - `DB_PORT`: `12345` (the port shown)
   - `DB_USER`: `root`
   - `DB_PASSWORD`: `` (empty)
   - `DB_NAME`: `etusl_db`

5. **Update backend/db.js** to support custom port:
   ```javascript
   const port = process.env.DB_PORT || 3306;
   
   const pool = mysql.createPool({
     host: process.env.DB_HOST || 'localhost',
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || '',
     database: process.env.DB_NAME || 'etusl_db',
     port: port,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
   });
   ```

6. **Add to Render Environment**:
   - `DB_HOST`: `0.tcp.ngrok.io`
   - `DB_PORT`: `12345`
   - `DB_USER`: `root`
   - `DB_PASSWORD`: `` (leave empty)
   - `DB_NAME`: `etusl_db`

**⚠️ Limitations**:
- ngrok tunnel disconnects when you close terminal
- ngrok URL changes each time (free tier)
- Can't keep running 24/7
- Perfect for testing, not production

### Method B: Port Forwarding (Advanced)

If you have a static IP and router access:

1. **Find your public IP**: https://whatsmyipaddress.com
2. **Router setup**:
   - Login to router (usually 192.168.1.1)
   - Port forwarding section
   - Forward port 3306 to your PC's local IP
3. **Use in Render**:
   - `DB_HOST`: Your public IP (e.g., `203.0.113.45`)
   - `DB_USER`: `root`
   - `DB_PASSWORD`: Your XAMPP password
   - `DB_NAME`: `etusl_db`

**⚠️ Not recommended** (security risk, requires static IP, firewall issues)

### Method C: Ngrok with Fixed Domain (Paid)

If you upgrade ngrok to a paid plan:
- Get a fixed ngrok domain
- Never changes
- Costs $5-20/month

---

## Recommendation Summary

| Option | Cost | Setup Time | Reliability | Best For |
|--------|------|-----------|------------|----------|
| **PlanetScale** ⭐ | Free | 5 min | ⭐⭐⭐⭐⭐ | Production & Testing |
| **Railway** | Free ($5/mo) | 5 min | ⭐⭐⭐⭐ | Testing & Development |
| **ngrok** | Free | 5 min | ⭐⭐⭐ | Quick Testing |
| **Port Forward** | Free | 30 min | ⭐⭐ | Not Recommended |

---

## Quick Decision Tree

```
Do you want to:

1. Use cloud database (RECOMMENDED)
   └─→ PlanetScale (simplest, free forever)
   └─→ Railway (good alternative, free credit)

2. Keep XAMPP locally but expose externally
   └─→ Use ngrok (easiest for temporary)
   └─→ Use port forwarding (advanced users only)
```

---

## Complete Setup Example: PlanetScale + Render

### 1. Create PlanetScale Database (5 min)
```
1. Sign up at https://planetscale.com
2. Create database "etusl_db"
3. Create password
4. Copy connection string
```

### 2. Update Render Environment Variables
```
DB_HOST = xxxxx.us-east-1.psdb.cloud
DB_USER = [username]
DB_PASSWORD = [password]
DB_NAME = etusl_db
NODE_ENV = production
```

### 3. Test Connection
```bash
# From your local machine, verify connection works:
mysql -h xxxxx.us-east-1.psdb.cloud -u [user] -p[password] etusl_db

# Should show MySQL prompt if successful
```

### 4. Deploy to Render
- Render will automatically deploy and connect

### 5. Test Render Backend
```
curl https://etusl-backend.onrender.com/health
# Should return: {"status":"ok"}
```

---

## Next Steps

1. **Choose your option** (PlanetScale recommended ⭐)
2. **Set up database** (5-10 minutes)
3. **Get connection details**
4. **Add to Render environment variables**
5. **Test `/health` endpoint**
6. **Update frontend with Render URL**

---

## Need Help?

- **PlanetScale Docs**: https://planetscale.com/docs/concepts/connection-strings
- **Railway Docs**: https://docs.railway.app/guides/mysql
- **ngrok Docs**: https://ngrok.com/docs
- **Render Docs**: https://render.com/docs

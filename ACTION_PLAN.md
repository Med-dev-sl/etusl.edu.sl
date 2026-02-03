# Action Plan: Deploy to Production

## 🎯 Goal
Get your app live on the internet with free hosting

## Current State
- ✅ Backend code ready (Render will host)
- ✅ Frontend ready (Firebase already hosting)
- ⏳ Database pending (choose one option)
- ⏳ Backend waiting for database connection

## Next 30 Minutes: Complete Setup

### Phase 1: Database (5 minutes) 🗄️

**Choose ONE option:**

#### Option A: PlanetScale ⭐ (Recommended)
```
1. Open: https://planetscale.com
2. Click: Sign up (no credit card needed)
3. Create: Organization → Database "etusl_db"
4. Click: "Connect" button
5. Select: Node.js from dropdown
6. Copy: Connection string
7. Extract: DB_HOST, DB_USER, DB_PASSWORD
⏱️  Takes: 5 minutes
💰 Cost: $0
```

#### Option B: Railway (Alternative)
```
1. Open: https://railway.app
2. Click: "Start a new project" → "Provision MySQL"
3. Wait: Database starts (2-3 min)
4. Click: Database → "Connect" tab
5. Copy: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD
⏱️  Takes: 10 minutes
💰 Cost: $0 (with $5/mo credit)
```

#### Option C: ngrok (Testing Only)
```
1. Open: https://ngrok.com/download
2. Download: and extract ngrok
3. Start XAMPP: MySQL → Start
4. Run: ngrok tcp 3306
5. Copy: The URL shown (e.g., 0.tcp.ngrok.io:12345)
⏱️  Takes: 5 minutes
💰 Cost: $0
⚠️  WARNING: Must keep XAMPP running 24/7!
```

**→ RECOMMENDATION: Choose PlanetScale (easiest, best for production)**

---

### Phase 2: Configure Render (2 minutes) 🚀

```
1. Go to: https://dashboard.render.com
2. Find: Your "etusl-backend" service
3. Click: "Environment" tab
4. Add these 6 variables:
   
   DB_HOST = [from database]
   DB_PORT = 3306 (or from ngrok)
   DB_USER = [from database]
   DB_PASSWORD = [from database]
   DB_NAME = etusl_db
   NODE_ENV = production

5. Save → Render auto-redeploys
⏱️  Takes: 2 minutes
```

**What to do while Render deploys (2-3 min):**
```
✓ Copy Render backend URL (looks like: https://etusl-backend.onrender.com)
✓ Prepare for Phase 3
```

---

### Phase 3: Verify Backend (1 minute) ✅

**Test health endpoint:**
```bash
curl https://etusl-backend.onrender.com/health
```

**Expected response:**
```json
{"status":"ok"}
```

**If it fails:**
1. Check Render logs (Service → Logs tab)
2. Verify database credentials
3. Ensure database allows external connections

---

### Phase 4: Update Frontend (5 minutes) ⚙️

**Create `.env` file in project root:**
```
Create file: .env (in same folder as package.json)

Content:
REACT_APP_API_URL=https://etusl-backend.onrender.com
```

**Update these 3 files:**

1. **`src/pages/policies/Policies.js`**
   - Find: `const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';`
   - Then: `const response = await fetch(`${API_URL}/api/policies/active`);`

2. **`src/pages/partners/Partners.js`**
   - Find: `const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';`
   - Then: `const response = await fetch(`${API_URL}/api/affiliates/active`);`

3. **`src/pages/staff/StaffDashboard.js`**
   - Find: All instances of `fetch('http://localhost:4000/api/...`
   - Replace with: `fetch(`${API_URL}/api/...`)` where `const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';`

---

### Phase 5: Deploy Frontend (5 minutes) 📦

**From terminal in project root:**
```bash
# Build React app
npm run build

# Deploy to Firebase
firebase deploy
```

**Wait for completion (usually 2-3 minutes)**

---

### Phase 6: Test Everything (5 minutes) 🧪

**Test 1: Health Check**
```bash
curl https://etusl-backend.onrender.com/health
# Expected: {"status":"ok"}
```

**Test 2: Database Query**
```bash
curl https://etusl-backend.onrender.com/api/policies/active
# Expected: {"items":[...]} or {"items":[]}
```

**Test 3: Frontend Load**
- Open your Firebase URL
- Check if pages load without errors
- Press F12 → Console tab → Look for errors

**Test 4: API Calls**
- Press F12 → Network tab
- Click on Policies page
- Should see request to backend returning data

**Test 5: Staff Dashboard**
- Login with staff credentials
- Try managing policies/partners
- Should all work with backend

---

## Summary Table

| Phase | Task | Time | Check |
|-------|------|------|-------|
| 1 | Set up database | 5 min | Have credentials ✓ |
| 2 | Configure Render | 2 min | Service says "Live" ✓ |
| 3 | Verify backend | 1 min | `/health` returns ok ✓ |
| 4 | Update frontend | 5 min | `.env` file created ✓ |
| 5 | Deploy frontend | 5 min | Firebase shows success ✓ |
| 6 | Test everything | 5 min | All pages work ✓ |
| **Total** | | **~25 min** | **Ready for production** |

---

## Troubleshooting Quick Reference

### Database Connection Failed
```
✓ Check credentials in Render environment tab
✓ Verify database is "active" (PlanetScale/Railway)
✓ Check firewall isn't blocking (if self-hosted)
✓ Read Render logs for specific error
```

### Frontend Not Connecting to Backend
```
✓ Verify REACT_APP_API_URL in .env file
✓ Check Network tab in DevTools (F12)
✓ Verify API_URL is used in fetch calls
✓ Check CORS settings (should be auto-enabled)
```

### ngrok URL Not Working
```
⚠️ ngrok URL changes every time you restart
⚠️ Must update Render environment variables
⚠️ Free tier generates new URL on disconnect
✓ Keep terminal running with ngrok active
```

### Render Shows "Build Failed"
```
✓ Check build logs (Service → Deploy tab)
✓ Verify build command: cd backend && npm install
✓ Verify start command: cd backend && npm start
✓ Ensure backend/package.json exists
```

---

## Files You'll Need

✅ Already prepared:
- `backend/server.js` - Ready to go
- `backend/db.js` - Supports environment variables
- `backend/.env.example` - Reference template
- `render.yaml` - Deployment config
- All documentation files

⏳ You'll create:
- `.env` in project root (for frontend)

---

## Go-Live Checklist

- [ ] **Phase 1**: Database credentials obtained
- [ ] **Phase 2**: Render environment variables set
- [ ] **Phase 3**: Backend `/health` endpoint working
- [ ] **Phase 4**: Frontend `.env` file created and updated
- [ ] **Phase 5**: Frontend deployed to Firebase
- [ ] **Phase 6**: All tests passing

---

## Success Criteria

Your app is ready when:
1. ✅ Backend responds at `https://etusl-backend.onrender.com/health`
2. ✅ Frontend loads at `https://your-domain.web.app`
3. ✅ Policies page shows data from backend
4. ✅ Partners page shows data from backend
5. ✅ Staff can login and manage content
6. ✅ No errors in browser console (F12)

---

## Production Tips

**Keep running:**
- Monitor Render logs for errors
- Set up email alerts if backend goes down
- Backup database weekly (PlanetScale has automatic backups)

**Before going live:**
- Change XAMPP password (if using ngrok)
- Rotate database credentials
- Test all critical workflows
- Mobile test on real devices

**After going live:**
- Share URL with stakeholders
- Monitor for bugs
- Plan for scaling if needed

---

## Next Action

**👉 START NOW: Choose your database option (PlanetScale recommended)**

Then follow the 6 phases above in order. Total time: ~25 minutes.

---

**Questions? Check:**
- `QUICK_DB_SETUP.md` - Quick reference
- `FREE_MYSQL_HOSTING_GUIDE.md` - Database details
- `RENDER_DEPLOYMENT_GUIDE.md` - Render specific
- `DEPLOYMENT_FLOWCHART.md` - Visual guide

**You're ready! Let's go live! 🚀**

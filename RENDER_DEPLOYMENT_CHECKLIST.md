# Render Deployment Checklist

## Pre-Deployment (Local)

- [ ] Verify `backend/package.json` has `"start": "node server.js"`
- [ ] Ensure `backend/db.js` uses environment variables
- [ ] Test backend locally with `npm start` in backend folder
- [ ] Verify health endpoint: `http://localhost:4000/health`
- [ ] Commit all code to GitHub `main` branch

## Database Setup (Choose One)

### PlanetScale (Recommended - Free)
- [ ] Create PlanetScale account (https://planetscale.com)
- [ ] Create new MySQL database
- [ ] Go to "Connect" → select Node.js
- [ ] Copy connection string
- [ ] Extract values:
  - [ ] DB_HOST = `xxxxx.us-east-1.psdb.cloud`
  - [ ] DB_USER = `root`
  - [ ] DB_PASSWORD = `xxxxx`
  - [ ] DB_NAME = `etusl_db`

### AWS RDS
- [ ] Create RDS MySQL instance (free tier)
- [ ] Set Master username and password
- [ ] Get Endpoint (DB_HOST)
- [ ] Configure security group to allow inbound 3306

### Azure Database for MySQL
- [ ] Create Azure MySQL Flexible Server
- [ ] Note Server name (becomes DB_HOST)
- [ ] Create admin user
- [ ] Configure Firewall to allow Render IP

## Render Setup

- [ ] Create Render account (https://render.com)
- [ ] Connect GitHub account
- [ ] Create New Web Service
  - [ ] Select repository
  - [ ] Service name: `etusl-backend`
  - [ ] Environment: `Node`
  - [ ] Build Command: `cd backend && npm install`
  - [ ] Start Command: `cd backend && npm start`
  
- [ ] Add Environment Variables:
  - [ ] DB_HOST = `[your-database-host]`
  - [ ] DB_USER = `[your-db-user]`
  - [ ] DB_PASSWORD = `[your-db-password]`
  - [ ] DB_NAME = `etusl_db`
  - [ ] NODE_ENV = `production`

- [ ] Deploy and wait for "Live" status
- [ ] Copy deployment URL (e.g., `https://etusl-backend.onrender.com`)

## Post-Deployment

- [ ] Test health endpoint: `https://etusl-backend.onrender.com/health`
- [ ] Check logs in Render dashboard for errors
- [ ] Test API endpoints (e.g., `/api/policies/active`)
- [ ] Update frontend `.env` with backend URL

## Frontend Updates

- [ ] Create `.env` in project root:
  ```
  REACT_APP_API_URL=https://etusl-backend.onrender.com
  ```
- [ ] Update all fetch calls to use environment variable:
  ```javascript
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const response = await fetch(`${API_URL}/api/endpoint`);
  ```
- [ ] Test all API calls (policies, partners, staff, etc.)
- [ ] Deploy frontend to Firebase

## Files to Check

- [x] `backend/server.js` - Uses `process.env.PORT || 4000`
- [x] `backend/db.js` - Uses environment variables with fallbacks
- [x] `backend/package.json` - Has correct start script
- [ ] `.env.example` - Documents all required variables
- [ ] `render.yaml` - Deployment configuration

## Useful Commands

```bash
# Test backend locally
cd backend
npm install
npm start

# After deployment, test API
curl https://etusl-backend.onrender.com/health

# View Render logs
# → Go to Render dashboard → Select service → Logs tab
```

## Support Links

- Render Docs: https://render.com/docs
- PlanetScale Docs: https://planetscale.com/docs
- AWS RDS Docs: https://docs.aws.amazon.com/rds/
- Azure MySQL Docs: https://docs.microsoft.com/azure/mysql/

---

**Expected Timeline:**
- Database setup: 5-10 minutes
- Render deployment: 2-5 minutes (first time, auto on future commits)
- Frontend update: 5 minutes
- Total: ~15-20 minutes

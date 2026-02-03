# Render Deployment Guide

## Prerequisites

- Render account (https://render.com)
- GitHub repository with your code
- MySQL database (local or hosted, e.g., PlanetScale, AWS RDS, Azure Database for MySQL)
- Backend code in `/backend` folder

## Backend Setup on Render

### Step 1: Create a Web Service on Render

1. **Login to Render**: Go to https://render.com and sign in
2. **Create New Service**: Click "New +" → "Web Service"
3. **Connect Repository**: 
   - Select your GitHub repository
   - Choose the branch (e.g., `main`)

### Step 2: Configure Service Settings

Fill in the following:

| Field | Value |
|-------|-------|
| **Name** | `etusl-backend` |
| **Environment** | `Node` |
| **Region** | Select closest region (e.g., `us-east-1`) |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | `Free` (or `Starter` for better performance) |

### Step 3: Add Environment Variables

In the "Environment" section, add:

```
DB_HOST = your-mysql-host.example.com
DB_USER = your-database-user
DB_PASSWORD = your-database-password
DB_NAME = etusl_db
NODE_ENV = production
```

**Important**: 
- Get `DB_HOST`, `DB_USER`, `DB_PASSWORD` from your MySQL provider
- The `PORT` is automatically set by Render (don't add it)
- Keep these values secure - never commit `.env` to GitHub

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically:
   - Clone your repository
   - Install dependencies via `npm install`
   - Build the application
   - Start the server with `npm start`
3. Once deployed, you'll see the live URL (e.g., `https://etusl-backend.onrender.com`)

### Step 5: Verify Deployment

Test the health endpoint:
```
https://etusl-backend.onrender.com/health
```

Should return: `{ "status": "ok" }`

## MySQL Database Setup

### Option A: PlanetScale (Recommended - Free Tier)

1. Go to https://planetscale.com
2. Create account and new database
3. Get connection string (looks like: `user:password@host.us-east-1.psdb.cloud/database`)
4. Extract values:
   - `DB_HOST`: `your-host.us-east-1.psdb.cloud`
   - `DB_USER`: `root`
   - `DB_PASSWORD`: Your password
   - `DB_NAME`: `etusl_db`

### Option B: AWS RDS

1. Create RDS MySQL instance (free tier available)
2. Get endpoint URL and connection details
3. Use similar extraction as PlanetScale

### Option C: Azure Database for MySQL

1. Create Azure MySQL Flexible Server
2. Configure firewall to allow Render IP
3. Get connection details from Azure portal

## Updating Frontend API Base URL

After deployment, update your React frontend to use the new backend URL:

### 1. Create `.env` file in project root:
```
REACT_APP_API_URL=https://etusl-backend.onrender.com
```

### 2. Update API calls in your components:

Example in `src/pages/policies/Policies.js`:
```javascript
// Old:
const response = await fetch('http://localhost:4000/api/policies/active');

// New:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const response = await fetch(`${API_URL}/api/policies/active`);
```

## Monitoring Deployment

1. **View Logs**: In Render dashboard → Select service → "Logs" tab
2. **Check Status**: 
   - "Live" = Running
   - "Deploying" = In progress
   - "Failed" = Check logs for errors

## Common Issues

| Issue | Solution |
|-------|----------|
| **Database connection fails** | Verify DB credentials in environment variables; Check if MySQL allows connections from Render IP |
| **Build fails** | Check Build Command; ensure `package.json` exists in `backend/` folder |
| **Port error** | Don't set PORT environment variable manually; Render assigns it automatically |
| **Cold starts** | Free tier has 15-min inactivity limit; use Starter tier for production |

## Database Initialization

After deployment, you may need to run setup scripts:

```bash
# SSH into Render (available on Starter plan+)
# Or use local MySQL client:
mysql -h your-host -u your-user -p your-database < backend/setup-policies.js
```

## Monitoring and Logs

Real-time logs are available in Render dashboard:
- Select your service
- Click "Logs" tab
- Filter by "All Logs", "Build", "Deploy"

## Updating Your Application

Every commit to `main` branch triggers automatic deployment:

1. Update code locally
2. Commit and push to GitHub
3. Render automatically redeploys
4. Check logs to verify deployment success

## Cost Estimation

- **Free Tier**: 
  - 1 Web Service (512 MB RAM, 0.5 CPU)
  - ~750 hours/month free
  - 5-minute deployment delay
  
- **Starter ($7/month)**:
  - Instant deployments
  - Better performance
  - Recommended for production

## Next Steps

1. Set up MySQL database (PlanetScale recommended for free tier)
2. Update Render environment variables
3. Verify `/health` endpoint
4. Update frontend `.env` with backend URL
5. Test API endpoints from frontend
6. Monitor logs for errors

For more details: https://render.com/docs

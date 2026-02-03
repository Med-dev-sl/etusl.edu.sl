# Backend Deployment to Render - Complete Guide

## Quick Start (5 Steps)

### 1️⃣ Set Up Database (Choose One)

**PlanetScale (Recommended - Free)**
- Sign up: https://planetscale.com
- Create database → Get connection details
- Note: DB_HOST, DB_USER, DB_PASSWORD

**OR AWS RDS / Azure MySQL** (see RENDER_DEPLOYMENT_GUIDE.md)

### 2️⃣ Deploy to Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Fill in:
   - **Name**: `etusl-backend`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

### 3️⃣ Add Environment Variables on Render

In service settings, add:
```
DB_HOST = your-database-host
DB_USER = your-database-user
DB_PASSWORD = your-database-password
DB_NAME = etusl_db
NODE_ENV = production
```

### 4️⃣ Deploy & Test

1. Click "Create Web Service"
2. Wait for "Live" status
3. Test: `https://etusl-backend.onrender.com/health`

### 5️⃣ Update Frontend

Create `.env` in project root:
```
REACT_APP_API_URL=https://etusl-backend.onrender.com
```

Update these files to use `process.env.REACT_APP_API_URL`:
- `src/pages/policies/Policies.js`
- `src/pages/partners/Partners.js`
- `src/pages/staff/StaffDashboard.js`

Then: `npm run build && firebase deploy`

---

## Key Files Created

| File | Purpose |
|------|---------|
| `render.yaml` | Render deployment configuration |
| `RENDER_DEPLOYMENT_GUIDE.md` | Detailed setup instructions |
| `RENDER_DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `FRONTEND_API_CONFIGURATION.md` | Frontend updates needed |
| `backend/.env.example` | Example environment variables |

---

## Backend Already Configured For

✅ Environment variables (db.js uses `process.env.*`)
✅ Correct npm start script
✅ Health check endpoint `/health`
✅ All API endpoints ready
✅ File upload support

---

## Architecture

```
┌─────────────────────────────────────────┐
│  Firebase (Frontend)                    │
│  - React App                            │
│  - Public Pages                         │
│  - Staff Dashboard                      │
│  https://your-domain.web.app            │
└──────────────┬──────────────────────────┘
               │ REACT_APP_API_URL
               ▼
┌─────────────────────────────────────────┐
│  Render (Backend)                       │
│  - Express.js API                       │
│  - File Uploads (multer)                │
│  - All CRUD Operations                  │
│  https://etusl-backend.onrender.com     │
└──────────────┬──────────────────────────┘
               │ MySQL Queries
               ▼
┌─────────────────────────────────────────┐
│  MySQL Database                         │
│  - PlanetScale / AWS RDS / Azure        │
│  - All content & user data              │
│  your-host.psdb.cloud (PlanetScale)     │
└─────────────────────────────────────────┘
```

---

## Next Steps

1. **Today**: Set up database (PlanetScale recommended)
2. **Today**: Deploy backend to Render
3. **Today**: Test API endpoints
4. **Today**: Update frontend .env and deploy
5. **Ongoing**: Monitor Render logs for errors

---

## Support

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **View Logs**: Render Dashboard → Service → Logs tab

---

## Estimated Costs

- **Backend**: $0 - $7/month (free tier available)
- **Database**: $0 - $29/month (free tier available)
- **Frontend**: $0 - Free tier on Firebase
- **Total**: $0 - $36/month for full production setup

---

**Status**: ✅ All files prepared and ready for deployment

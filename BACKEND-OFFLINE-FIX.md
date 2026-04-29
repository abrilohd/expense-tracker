# 🔌 Backend Server Offline - Fix Guide

## Problem
Frontend shows: **"Backend server is offline. Please try again later."**

## Root Cause
The backend Railway URL is not responding because:
1. ❌ PostgreSQL database not added to Railway
2. ❌ Required environment variables not set
3. ❌ Backend failed to start due to missing config

---

## ✅ Solution (5 Minutes)

### Step 1: Add PostgreSQL to Railway
```
1. Go to: https://railway.app
2. Open your project
3. Click "+ New" → "Database" → "Add PostgreSQL"
4. Wait 30 seconds
5. DATABASE_URL is auto-created
```

### Step 2: Set Required Environment Variables
```
Go to: Backend Service → Variables tab

Add these:
SECRET_KEY=<run in terminal: openssl rand -hex 32>
ALLOWED_ORIGINS=https://expense-tracker-app-tau-rust.vercel.app
```

### Step 3: Wait for Deployment
```
Railway will auto-redeploy (takes 2-3 minutes)
Watch the Logs tab for: "Database engine created successfully"
```

### Step 4: Test Backend
```bash
curl https://expense-tracker-production-419e.up.railway.app/health
```

Expected response:
```json
{"status":"ok","service":"expense-tracker-api"}
```

### Step 5: Set Vercel Environment Variables
```
Go to: Vercel Dashboard → Frontend Project → Settings → Environment Variables

Add for Production:
VITE_API_URL=https://expense-tracker-production-419e.up.railway.app
```

### Step 6: Redeploy Frontend
```
Vercel → Deployments → "..." → "Redeploy"
Wait 2 minutes
```

### Step 7: Test Frontend
```
1. Visit: https://expense-tracker-app-tau-rust.vercel.app
2. Click "Register"
3. Create account
4. Should see dashboard (not "Backend server is offline")
```

---

## 🔍 Debugging

### Check Railway Logs
```
Railway → Backend Service → Logs tab
Look for errors
```

### Check Browser Console
```
1. Open frontend in browser
2. Press F12 → Console tab
3. Look for:
   - "API Client Configuration" log
   - "Backend Connection Error" log
4. Check the apiUrl value
```

### Verify Environment Variables
```
Railway:
- DATABASE_URL (auto-created by PostgreSQL)
- SECRET_KEY (you must set this)
- ALLOWED_ORIGINS (you must set this)

Vercel:
- VITE_API_URL (you must set this)
```

---

## 📊 Expected Logs

### Railway Logs (Success)
```
INFO:     Using PostgreSQL database: ...@containers-us-west-xxx.railway.app:5432/railway
INFO:     Configuring PostgreSQL engine with connection pooling
INFO:     Database engine created successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Browser Console (Success)
```
🔧 API Client Configuration: {
  baseURL: "https://expense-tracker-production-419e.up.railway.app",
  isDev: false,
  isProd: true
}
```

### Railway Logs (Failure)
```
ERROR: SECRET_KEY environment variable is required
ERROR: Could not connect to database
ModuleNotFoundError: No module named 'jose'
```

---

## ⚡ Quick Fix Commands

### Generate SECRET_KEY
```bash
# On Mac/Linux:
openssl rand -hex 32

# On Windows (PowerShell):
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

### Test Backend Health
```bash
curl https://expense-tracker-production-419e.up.railway.app/health
```

### Check if Backend is Reachable
```bash
curl -I https://expense-tracker-production-419e.up.railway.app
```

---

## 🎯 Success Criteria

✅ Railway health endpoint returns 200 OK  
✅ Frontend can register new users  
✅ Frontend can login  
✅ Dashboard loads without "Backend server is offline"  
✅ Can add expenses  
✅ Can view expenses list  

---

## 📞 Still Not Working?

1. Share Railway logs (last 50 lines)
2. Share browser console errors
3. Verify all environment variables are set
4. Check if Railway backend URL is accessible

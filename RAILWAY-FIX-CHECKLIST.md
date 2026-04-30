# 🚀 Railway Deployment Fix Checklist

## ❌ Current Issues

### Issue 1: CORS Error (CRITICAL)
```
Access to XMLHttpRequest blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
```

### Issue 2: Database Tables Missing (CRITICAL)
```
sqlalchemy.exc.ProgrammingError: relation "users" does not exist
```

---

## ✅ STEP-BY-STEP FIX

### 🔧 STEP 1: Fix Railway Environment Variables

**Go to Railway Dashboard → Your Project → Variables Tab**

#### ⚠️ CRITICAL CHANGES NEEDED:

1. **ADD this new variable:**
   ```
   ALLOWED_ORIGINS=https://expense-tracker-app-tau-rust.vercel.app
   ```

2. **RENAME `JWT_SECRET_KEY` to `SECRET_KEY`:**
   - Copy the value from `JWT_SECRET_KEY`
   - Create new variable: `SECRET_KEY=<paste the value>`
   - Delete the old `JWT_SECRET_KEY` variable

3. **Verify these variables exist:**
   ```
   SECRET_KEY=<your secret key>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DATABASE_URL=<auto-created by Railway>
   FRONTEND_URL=https://expense-tracker-app-tau-rust.vercel.app
   ```

4. **Optional (if using Google OAuth):**
   ```
   GOOGLE_CLIENT_ID=<your client id>
   GOOGLE_CLIENT_SECRET=<your client secret>
   GOOGLE_REDIRECT_URI=https://expense-tracker-production-419e.up.railway.app/auth/google/callback
   ```

**After making changes, Railway will automatically redeploy.**

---

### 🗄️ STEP 2: Initialize Database Tables

The `backend/init_db.py` script has been committed and pushed to GitHub.

**Option A: Let Auto-Migration Work (Recommended)**
1. After fixing environment variables in STEP 1, Railway will redeploy
2. The `lifespan` function in `main.py` should create tables automatically
3. Wait 2-3 minutes for deployment to complete
4. Check Railway logs for: `Database tables created successfully`

**Option B: Manual Initialization (If Option A Fails)**
1. Go to Railway Dashboard → Your Project → Backend Service
2. Click "Deploy" tab → "Run Command"
3. Run: `python init_db.py`
4. Check output for: `✅ Database tables created successfully!`

---

### 🧪 STEP 3: Verify Backend is Working

**Test the health endpoint:**
```bash
curl https://expense-tracker-production-419e.up.railway.app/health
```

**Expected response:**
```json
{
  "status": "ok",
  "service": "expense-tracker-api"
}
```

**Check Railway logs for:**
- ✅ `Using PostgreSQL database: ...@...`
- ✅ `Database engine created successfully`
- ✅ `Application startup complete`
- ❌ NO CORS errors
- ❌ NO "relation does not exist" errors

---

### 🌐 STEP 4: Verify Frontend Connection

1. Open: https://expense-tracker-app-tau-rust.vercel.app
2. Try to register a new account
3. After registration, you should see the dashboard
4. Check browser console (F12) for:
   - ✅ NO CORS errors
   - ✅ Successful API calls to Railway backend
   - ✅ Dashboard data loads

---

## 🔍 Troubleshooting

### If CORS errors persist:
1. Verify `ALLOWED_ORIGINS` is set correctly in Railway
2. Check Railway logs for: `allow_origins=['https://expense-tracker-app-tau-rust.vercel.app']`
3. Make sure there are NO trailing slashes in the URL

### If database errors persist:
1. Check Railway logs for database connection errors
2. Verify `DATABASE_URL` is set (should be auto-created)
3. Try manual initialization (Option B in STEP 2)
4. Check PostgreSQL service is running in Railway

### If backend won't start:
1. Check Railway logs for Python errors
2. Verify all environment variables are set
3. Check `requirements.txt` has all dependencies
4. Verify `Procfile` and `railway.json` are correct

---

## 📋 Environment Variables Summary

### Railway (Backend):
```bash
ALLOWED_ORIGINS=https://expense-tracker-app-tau-rust.vercel.app
SECRET_KEY=<your secret key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=<auto-created>
FRONTEND_URL=https://expense-tracker-app-tau-rust.vercel.app
```

### Vercel (Frontend):
```bash
VITE_API_URL=https://expense-tracker-production-419e.up.railway.app
VITE_APP_URL=https://expense-tracker-app-tau-rust.vercel.app
VITE_LANDING_URL=https://expense-tracker-landing-k4qsr35ie-abrsh067-7150s-projects.vercel.app
```

---

## ✅ Success Criteria

- [ ] Railway backend deploys without errors
- [ ] Health endpoint returns `{"status": "ok"}`
- [ ] Frontend can register new users
- [ ] Frontend can login
- [ ] Dashboard loads without "Backend server is offline" error
- [ ] No CORS errors in browser console
- [ ] No database errors in Railway logs

---

## 📞 Next Steps After Fix

1. Test user registration and login
2. Test expense creation and listing
3. Test dashboard data display
4. Test insights page
5. Monitor Railway logs for any errors
6. Update landing page if needed

---

**Last Updated:** 2026-04-30
**Status:** Ready to deploy

# 🚀 Deployment Verification Checklist

## ✅ Pre-Deployment Verification for Vercel + Railway

This checklist ensures your deployment will be successful without errors.

---

## 🔍 Critical Checks Before Deployment

### 1. Backend (Railway) Verification ✅

#### Check 1: Environment Variables
```bash
# Verify all required environment variables are documented
cat backend/.env.example

# Required variables:
✅ DATABASE_URL (Railway provides automatically)
✅ SECRET_KEY (generate new for production)
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ GOOGLE_REDIRECT_URI (must be Railway URL)
✅ FRONTEND_URL (must be Vercel URL)
✅ ALLOWED_ORIGINS (must include Vercel URL)
✅ RESEND_API_KEY
✅ RESEND_FROM_EMAIL
✅ APP_NAME
✅ APP_URL (must be Vercel URL)
✅ DEBUG=False (IMPORTANT for production)
```

#### Check 2: Dependencies
```bash
# Verify requirements.txt is complete
cat backend/requirements.txt | grep -E "fastapi|sqlalchemy|resend|google-auth"

# Should show:
✅ fastapi>=0.115.0
✅ sqlalchemy>=2.0.36
✅ resend>=2.0.0
✅ google-auth==2.27.0
```

#### Check 3: Database Migrations
```bash
# Verify migration script exists
ls backend/scripts/migrate.py

# Should exist: ✅
```

#### Check 4: No Hardcoded URLs
```bash
# Check for localhost references
grep -r "localhost" backend/app/ --exclude-dir=__pycache__

# Should only be in config defaults, not hardcoded
```

---

### 2. Frontend (Vercel) Verification ✅

#### Check 1: Build Configuration
```bash
# Verify package.json has build script
cat frontend/package.json | grep "build"

# Should show:
✅ "build": "tsc && vite build"
```

#### Check 2: Environment Variables
```bash
# Verify .env.example exists
cat frontend/.env.example

# Required variables:
✅ VITE_API_URL (must be Railway URL)
```

#### Check 3: TypeScript Configuration
```bash
# Verify tsconfig.json is valid
cat frontend/tsconfig.json | grep "strict"

# Should show:
✅ "strict": true
```

#### Check 4: No Hardcoded URLs
```bash
# Check for localhost references
grep -r "localhost" frontend/src/ --exclude-dir=node_modules

# Should only be in config/constants.ts with environment variable fallback
```

---

### 3. Google OAuth Configuration ✅

#### Check 1: Google Cloud Console
- [ ] OAuth 2.0 Client ID created
- [ ] Production redirect URI added:
  ```
  https://your-backend.railway.app/auth/google/callback
  ```
- [ ] Production JavaScript origins added:
  ```
  https://your-app.vercel.app
  https://your-backend.railway.app
  ```

#### Check 2: OAuth Callback Route
```bash
# Verify callback route exists in frontend
grep -r "auth/google/callback" frontend/src/App.tsx

# Should show:
✅ <Route path="/auth/google/callback" element={<GoogleCallback />} />
```

#### Check 3: OAuth Redirect URL
```bash
# Verify backend redirects to frontend callback
grep -r "auth/google/callback" backend/app/routes/google_auth.py

# Should show:
✅ redirect_url = f"{settings.frontend_url}/auth/google/callback?token={jwt_token}"
```

---

### 4. Email Service (Resend) Verification ✅

#### Check 1: Resend API Key
- [ ] API key obtained from https://resend.com
- [ ] API key starts with `re_`
- [ ] API key is valid and active

#### Check 2: Email Templates
```bash
# Verify email service exists
ls backend/app/services/email_service.py

# Should exist: ✅
```

#### Check 3: Email Configuration
```bash
# Verify email service is configured
grep -r "RESEND_API_KEY" backend/app/services/email_service.py

# Should show:
✅ resend.api_key = os.getenv("RESEND_API_KEY", "")
```

---

## 🚨 Common Deployment Issues & Fixes

### Issue 1: CORS Errors in Production

**Symptom:** Frontend can't connect to backend

**Fix:**
```bash
# In Railway, set ALLOWED_ORIGINS to include ALL Vercel URLs:
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://your-app-git-main-yourname.vercel.app

# Note: No spaces after commas!
```

---

### Issue 2: Google OAuth Redirect Mismatch

**Symptom:** "redirect_uri_mismatch" error

**Fix:**
1. Go to Google Cloud Console
2. Add EXACT Railway callback URL:
   ```
   https://your-backend.railway.app/auth/google/callback
   ```
3. Wait 5 minutes for changes to propagate
4. Try again

---

### Issue 3: Database Not Initialized

**Symptom:** "no such table" errors

**Fix:**
```bash
# After Railway deployment, run migrations:
railway run python scripts/migrate.py

# Or use Railway CLI:
railway shell
python scripts/migrate.py
exit
```

---

### Issue 4: Environment Variables Not Set

**Symptom:** "OAuth not configured" or "Email service not configured"

**Fix:**
1. Go to Railway dashboard
2. Click on your project
3. Go to Variables tab
4. Add all required variables from `.env.example`
5. Redeploy

---

### Issue 5: Frontend Can't Find Backend

**Symptom:** Network errors, API calls fail

**Fix:**
```bash
# In Vercel, verify VITE_API_URL is set correctly:
VITE_API_URL=https://your-backend.railway.app

# Note: No trailing slash!
```

---

## 📋 Deployment Steps (Correct Order)

### Step 1: Deploy Backend to Railway FIRST

**Why First?** Frontend needs the backend URL.

```bash
1. Push code to GitHub
2. Create Railway project from GitHub
3. Add PostgreSQL database
4. Set environment variables (see list below)
5. Deploy
6. Wait for deployment to complete
7. Copy Railway URL (e.g., https://your-backend.railway.app)
8. Run migrations: railway run python scripts/migrate.py
9. Create admin user: railway run python scripts/create_admin.py
```

**Required Environment Variables for Railway:**
```bash
# Application
DEBUG=False
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (Auto-provided by Railway when you add PostgreSQL)
DATABASE_URL=postgresql://...

# CORS (IMPORTANT: Add ALL Vercel URLs)
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/auth/google/callback
FRONTEND_URL=https://your-app.vercel.app

# Email Service
RESEND_API_KEY=re_YourAPIKey
RESEND_FROM_EMAIL=noreply@yourdomain.com
APP_NAME=ExpenseTracker
APP_URL=https://your-app.vercel.app
```

---

### Step 2: Update Google Cloud Console

```bash
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Add Authorized JavaScript origins:
   - https://your-app.vercel.app
   - https://your-backend.railway.app
5. Add Authorized redirect URIs:
   - https://your-backend.railway.app/auth/google/callback
6. Save changes
7. Wait 5 minutes for changes to propagate
```

---

### Step 3: Deploy Frontend to Vercel

**Why Second?** Frontend needs the backend URL from Railway.

```bash
1. Go to Vercel dashboard
2. Import GitHub repository
3. Set Root Directory to "frontend"
4. Set Framework Preset to "Vite"
5. Add environment variable:
   VITE_API_URL=https://your-backend.railway.app
6. Deploy
7. Wait for deployment to complete
8. Copy Vercel URL (e.g., https://your-app.vercel.app)
```

---

### Step 4: Update Backend CORS

**Why?** Backend needs to allow requests from Vercel URL.

```bash
1. Go to Railway dashboard
2. Update ALLOWED_ORIGINS to include Vercel URL:
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
3. Update FRONTEND_URL:
   FRONTEND_URL=https://your-app.vercel.app
4. Update APP_URL:
   APP_URL=https://your-app.vercel.app
5. Redeploy backend
```

---

### Step 5: Test Everything

```bash
1. Test backend health:
   curl https://your-backend.railway.app/

2. Test frontend:
   Open https://your-app.vercel.app

3. Test email/password login:
   - Go to login page
   - Enter credentials
   - Should login successfully

4. Test Google OAuth:
   - Go to login page
   - Click "Continue with Google"
   - Sign in with Google
   - Should redirect to dashboard

5. Test password reset:
   - Go to login page
   - Click "Forgot Password?"
   - Enter email
   - Check email inbox
   - Click reset link
   - Reset password
   - Login with new password

6. Test all features:
   - Dashboard loads
   - Can add expenses
   - Can add income
   - Can create budgets
   - Can create savings goals
   - Charts render
   - Reports generate
   - Profile updates
   - Logout works
```

---

## ✅ Final Verification Checklist

### Backend (Railway)
- [ ] Deployed successfully
- [ ] Health check passes: `curl https://your-backend.railway.app/`
- [ ] API docs accessible: `https://your-backend.railway.app/docs`
- [ ] Database connected (no errors in logs)
- [ ] Migrations run successfully
- [ ] Admin user created
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] Google OAuth configured
- [ ] Email service configured
- [ ] No errors in Railway logs

### Frontend (Vercel)
- [ ] Deployed successfully
- [ ] Site loads: `https://your-app.vercel.app`
- [ ] Login page accessible
- [ ] No console errors
- [ ] API calls work (check Network tab)
- [ ] Environment variables set
- [ ] Build completed without errors
- [ ] No TypeScript errors
- [ ] No ESLint warnings

### Google OAuth
- [ ] Google Cloud Console configured
- [ ] Production redirect URI added
- [ ] Production JavaScript origins added
- [ ] OAuth flow works end-to-end
- [ ] User can sign in with Google
- [ ] User redirected to dashboard
- [ ] Profile shows Google picture
- [ ] No "redirect_uri_mismatch" errors

### Email Service
- [ ] Resend API key configured
- [ ] Password reset email sends
- [ ] Email received in inbox
- [ ] Email template looks good
- [ ] Reset link works
- [ ] Can reset password
- [ ] Can login with new password

### Features
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] Password reset works
- [ ] Dashboard loads
- [ ] Can add expenses
- [ ] Can add income
- [ ] Can create budgets
- [ ] Can create savings goals
- [ ] Charts render
- [ ] Reports generate
- [ ] Profile updates
- [ ] Logout works
- [ ] Dark mode works
- [ ] Responsive design works

---

## 🔧 Quick Fixes for Common Issues

### Fix 1: Generate Secure SECRET_KEY
```bash
# Run this command to generate a secure key:
openssl rand -hex 32

# Copy the output and use it as SECRET_KEY in Railway
```

### Fix 2: Check Railway Logs
```bash
# Install Railway CLI:
npm install -g @railway/cli

# Login:
railway login

# View logs:
railway logs

# Look for errors like:
# - "GOOGLE_CLIENT_ID is not set"
# - "Database connection failed"
# - "CORS error"
```

### Fix 3: Check Vercel Logs
```bash
# Go to Vercel dashboard
# Click on your project
# Click on "Deployments"
# Click on latest deployment
# Click on "View Function Logs"
# Look for errors
```

### Fix 4: Test API Connection
```bash
# Test if frontend can reach backend:
curl -X POST https://your-backend.railway.app/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test1234"

# Should return JWT token or error message
```

---

## 📊 Expected Deployment Timeline

```
Backend Deployment (Railway):     5-10 minutes
Frontend Deployment (Vercel):     3-5 minutes
Google OAuth Configuration:       5 minutes
Testing:                          10-15 minutes
Total:                            25-35 minutes
```

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Backend health check passes
2. ✅ Frontend loads without errors
3. ✅ Email/password login works
4. ✅ Google OAuth login works
5. ✅ Password reset works
6. ✅ All features accessible
7. ✅ No CORS errors
8. ✅ No console errors
9. ✅ Charts render correctly
10. ✅ Reports generate successfully
11. ✅ Profile updates work
12. ✅ Logout works
13. ✅ Dark mode works
14. ✅ Responsive design works
15. ✅ No errors in logs

---

## 📞 Need Help?

### Check Logs
- **Railway**: `railway logs` or Railway dashboard
- **Vercel**: Vercel dashboard → Deployments → View Logs
- **Browser**: F12 → Console tab

### Common Error Messages

**"redirect_uri_mismatch"**
→ Update Google Cloud Console with correct Railway URL

**"CORS error"**
→ Update ALLOWED_ORIGINS in Railway to include Vercel URL

**"OAuth not configured"**
→ Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Railway

**"Email service not configured"**
→ Set RESEND_API_KEY in Railway

**"Database connection failed"**
→ Ensure PostgreSQL is added in Railway

**"No such table"**
→ Run migrations: `railway run python scripts/migrate.py`

---

## 🎉 Ready to Deploy!

If all checks pass, you're ready to deploy!

**Deployment Order:**
1. 🚀 Deploy Backend to Railway
2. 🔧 Update Google Cloud Console
3. 🚀 Deploy Frontend to Vercel
4. 🔧 Update Backend CORS
5. 🧪 Test Everything
6. ✅ Launch!

---

**Last Updated**: May 25, 2026  
**Status**: ✅ Ready for Deployment  
**Estimated Time**: 25-35 minutes

🚀 **Good luck with your deployment!**

# 🧪 Pre-Deployment Testing Instructions

## Quick Start

### Automated Testing (Recommended)

**On Linux/Mac:**
```bash
chmod +x test-deployment.sh
./test-deployment.sh
```

**On Windows:**
```bash
test-deployment.bat
```

### Manual Testing (Detailed)

Follow the steps below for comprehensive testing.

---

## Manual Test Procedures

### TEST 1: Backend Starts Correctly

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies (if not already installed)
pip install -r requirements.txt

# 3. Start the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXXX] using WatchFiles
INFO:     Started server process [XXXXX]
INFO:     Waiting for application startup.
✅ OAuth configured: Client ID loaded (269702079191-305itou...)
INFO:     Application startup complete.
```

**Verify:**
- ✅ No import errors
- ✅ No missing module errors
- ✅ OAuth configuration message appears
- ✅ Server starts successfully

**Test Health Endpoint:**
```bash
# In a new terminal:
curl http://localhost:8000/health
```

**Expected Response:**
```json
{"status":"ok","service":"expense-tracker-api"}
```

---

### TEST 2: Backend API Endpoints

Keep the backend running and test each endpoint:

#### 1. Root Endpoint
```bash
curl http://localhost:8000/
```
**Expected:** `{"message":"Expense Tracker API","version":"1.0.0","status":"running"}`

#### 2. OAuth Status
```bash
curl http://localhost:8000/auth/oauth-status
```
**Expected:** `{"oauth_configured":true,"client_id_present":true,...}`

#### 3. Register User
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}'
```
**Expected:** Status 200/201 with user data and token

#### 4. Login User
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@test.com&password=Test1234!"
```
**Expected:** `{"access_token":"...","token_type":"bearer"}`

**Save the token for next tests:**
```bash
TOKEN="<paste-your-token-here>"
```

#### 5. Get Expenses (Protected)
```bash
curl http://localhost:8000/expenses \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** Status 200 with array (may be empty: `[]`)

#### 6. Create Expense (Protected)
```bash
curl -X POST http://localhost:8000/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Expense",
    "amount": 10.50,
    "category": "Food",
    "date": "2026-04-28"
  }'
```
**Expected:** Status 201 with created expense data

#### 7. Get Dashboard (Protected)
```bash
curl http://localhost:8000/dashboard \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** Status 200 with dashboard statistics

#### 8. Get Insights (Protected)
```bash
curl http://localhost:8000/insights \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** Status 200 with spending insights

**Verification Checklist:**
- [ ] All endpoints return expected status codes
- [ ] JWT token is generated on login
- [ ] Protected endpoints reject requests without token (401)
- [ ] No 500 Internal Server Errors

---

### TEST 3: Frontend Builds

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Build the frontend
npm run build
```

**Expected Output:**
```
✓ 2616 modules transformed
✓ built in 1.15s

dist/index.html                    1.83 kB │ gzip:  0.70 kB
dist/assets/index-IVVG4Qst.css    74.57 kB │ gzip: 13.01 kB
...
✓ built in 1.15s
```

**Verify:**
- [ ] Build completes without errors
- [ ] `dist/` directory created
- [ ] `dist/index.html` exists
- [ ] Total bundle size under 5MB (should be ~937 KB uncompressed, ~281 KB gzipped)
- [ ] No TypeScript errors
- [ ] No missing module errors

---

### TEST 4: Frontend Dev Server

```bash
# 1. Make sure backend is running on port 8000
# 2. Start frontend dev server
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v8.0.9  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open Browser:** `http://localhost:5173`

**Test Pages:**
1. **Login Page** - `http://localhost:5173/login`
   - [ ] Page loads without errors
   - [ ] Form is visible
   - [ ] Theme toggle works
   - [ ] Google OAuth button visible

2. **Register Page** - `http://localhost:5173/register`
   - [ ] Page loads without errors
   - [ ] Form is visible
   - [ ] Password strength indicator works

3. **Dashboard** (requires login) - `http://localhost:5173/`
   - [ ] Redirects to login if not authenticated
   - [ ] After login, shows dashboard
   - [ ] Charts render
   - [ ] No console errors

4. **Expenses** - `http://localhost:5173/expenses`
   - [ ] Page loads
   - [ ] Can view expenses list
   - [ ] Can add new expense
   - [ ] Can edit expense
   - [ ] Can delete expense

5. **Insights** - `http://localhost:5173/insights`
   - [ ] Page loads
   - [ ] AI insights display
   - [ ] No console errors

6. **Profile** - `http://localhost:5173/profile`
   - [ ] Page loads
   - [ ] User info displays
   - [ ] Can update password

**Browser Console Checks:**
- [ ] No 404 errors for assets
- [ ] No CORS errors
- [ ] API calls go to `http://localhost:8000`
- [ ] No React errors
- [ ] Config logs show correct URLs:
  ```
  Frontend Config: {
    appUrl: "http://localhost:5173",
    apiUrl: "http://localhost:8000",
    landingUrl: "http://localhost:8080",
    environment: "development"
  }
  ```

**Network Tab Checks:**
- [ ] API calls use `http://localhost:8000` as base URL
- [ ] Responses include CORS headers
- [ ] 401 errors for unauthenticated requests (expected)
- [ ] 200/201 responses for authenticated requests

---

### TEST 5: Landing Page

```bash
# Option 1: Using npx serve
npx serve landing-page -p 3001

# Option 2: Using Python
cd landing-page
python -m http.server 3001
```

**Open Browser:** `http://localhost:3001`

**Visual Checks:**
- [ ] Page loads without errors
- [ ] Hero section visible with video/poster
- [ ] Features section visible
- [ ] Dashboard preview image loads
- [ ] Stats section visible
- [ ] CTA section visible
- [ ] Footer visible
- [ ] Theme toggle works (sun/moon icon)
- [ ] Mobile menu works (hamburger icon)

**Console Checks:**
```javascript
// Expected in console:
Landing Page Config: {
  environment: "development",
  appUrl: "http://localhost:5173",
  apiUrl: "http://localhost:8000"
}

Router initialized: X CTA buttons found
App URL: http://localhost:5173
```

**CTA Button Tests:**
1. Click "Get Started" in hero section
   - **Expected:** Redirects to `http://localhost:5173/register`
   
2. Click "Get Started Free" in CTA section
   - **Expected:** Redirects to `http://localhost:5173/register`
   
3. Click "Get Started" in footer
   - **Expected:** Redirects to `http://localhost:5173/register`

**Navigation Tests:**
- [ ] Click "Features" → Scrolls to features section
- [ ] Click "Dashboard" → Scrolls to dashboard section
- [ ] Click "Testimonials" → Scrolls to stats section
- [ ] Click "Back to Top" → Scrolls to hero section

**Asset Checks (Browser DevTools → Network Tab):**
- [ ] No 404 errors
- [ ] No manifest.json errors
- [ ] All images load (200 status)
- [ ] Videos load or fallback gracefully
- [ ] Favicon loads

**Theme Toggle Test:**
- [ ] Click sun/moon icon
- [ ] Theme switches between dark and light
- [ ] Reload page → Theme persists

**Mobile Responsive Test:**
- [ ] Open DevTools → Toggle device toolbar
- [ ] Test on mobile size (375px width)
- [ ] Hamburger menu appears
- [ ] Click hamburger → Menu opens
- [ ] Click menu item → Menu closes

---

### TEST 6: Environment Variables

#### Backend Environment Variables

```bash
# Check backend/.env exists
ls backend/.env

# Verify required variables (don't show values)
grep -E "DATABASE_URL|SECRET_KEY|ALGORITHM|GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET|GOOGLE_REDIRECT_URI|FRONTEND_URL" backend/.env
```

**Required Variables:**
- [ ] `DATABASE_URL` - Set
- [ ] `SECRET_KEY` - Set (⚠️ Change for production!)
- [ ] `ALGORITHM` - Set
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES` - Set
- [ ] `GOOGLE_CLIENT_ID` - Set
- [ ] `GOOGLE_CLIENT_SECRET` - Set
- [ ] `GOOGLE_REDIRECT_URI` - Set
- [ ] `FRONTEND_URL` - Set

#### Frontend Environment Variables

```bash
# Check frontend/.env exists
ls frontend/.env

# Verify required variables
grep -E "VITE_APP_URL|VITE_API_URL|VITE_LANDING_URL" frontend/.env
```

**Required Variables:**
- [ ] `VITE_APP_URL` - Set
- [ ] `VITE_API_URL` - Set
- [ ] `VITE_LANDING_URL` - Set

#### Landing Page Environment Variables

**Status:** Optional - config.js provides fallbacks

---

## Test Results Table

| Test | Status | Issue | Notes |
|------|--------|-------|-------|
| Backend Starts | ⬜ | | |
| Health Endpoint | ⬜ | | |
| API Endpoints | ⬜ | | |
| Frontend Build | ✅ | None | Verified successful |
| Frontend Dev | ⬜ | | |
| Landing Page | ⬜ | | |
| Env Variables | ✅ | SECRET_KEY | Change for production |

**Legend:**
- ✅ PASS
- ❌ FAIL
- ⬜ NOT TESTED
- ⚠️ WARNING

---

## Common Issues & Solutions

### Issue: Backend won't start
**Solution:** 
```bash
cd backend
pip install -r requirements.txt
# Make sure you're in the backend directory
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Issue: Frontend build fails
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: API calls fail with CORS error
**Solution:** 
- Make sure backend is running
- Check backend console for CORS configuration
- Verify `ALLOWED_ORIGINS` includes frontend URL

### Issue: 404 on frontend routes
**Solution:** 
- This is expected in production without vercel.json
- vercel.json is already configured for deployment

### Issue: Landing page CTA doesn't work
**Solution:**
- Check browser console for config logs
- Verify config.js is loaded before router.js
- Check that APP_CONFIG is defined

---

## Pre-Deployment Checklist

Before deploying, ensure:

### Backend:
- [ ] All tests pass
- [ ] Health endpoint responds
- [ ] API endpoints work
- [ ] Generate new SECRET_KEY for production
- [ ] Remove test variables from .env (access_token, token_type)
- [ ] PostgreSQL driver installed (psycopg2-binary)

### Frontend:
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] All pages load in dev mode
- [ ] API integration works
- [ ] Environment variables configured

### Landing Page:
- [ ] Page loads without errors
- [ ] CTA buttons work
- [ ] Theme toggle works
- [ ] All assets load

---

## Next Steps After Testing

1. **If all tests pass:**
   - Proceed to deployment
   - Follow deployment guides:
     - `RAILWAY-DEPLOYMENT-READY.md` (Backend)
     - `VERCEL-DEPLOYMENT-READY.md` (Frontend)
     - `LANDING-PAGE-DEPLOYMENT-READY.md` (Landing Page)

2. **If tests fail:**
   - Fix issues
   - Re-run tests
   - Document any changes made

3. **Production Configuration:**
   - Generate new SECRET_KEY
   - Update production URLs
   - Configure environment variables in Railway/Vercel
   - Update Google OAuth URLs

---

**Good luck with deployment!** 🚀

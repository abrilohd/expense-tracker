# 🧪 Pre-Deployment Functional Test Report

**Test Date:** April 29, 2026
**Project:** Personal Expense Tracker
**Test Environment:** Windows (bash shell)

---

## TEST 1: Backend Starts Correctly

### Status: ⚠️ REQUIRES MANUAL VERIFICATION

**Dependencies Check:**
```bash
cd backend
pip install -r requirements.txt
```

**Required Packages (from requirements.txt):**
- ✅ fastapi>=0.115.0
- ✅ uvicorn[standard]>=0.32.0
- ✅ sqlalchemy>=2.0.36
- ✅ pydantic[email]>=2.10.0
- ✅ pydantic-settings>=2.6.0
- ✅ python-dotenv==1.0.0
- ✅ passlib[bcrypt]==1.7.4
- ✅ python-jose[cryptography]==3.3.0
- ✅ bcrypt==4.1.3
- ✅ email-validator==2.1.0
- ✅ python-multipart==0.0.6
- ✅ google-auth==2.27.0
- ✅ httpx>=0.27.0
- ✅ requests
- ✅ psycopg2-binary>=2.9.9

**Start Command:**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Health Check:**
```bash
curl http://localhost:8000/health
# Expected: {"status":"ok","service":"expense-tracker-api"}
```

**Verification Checklist:**
- [ ] Server starts without import errors
- [ ] No missing module errors
- [ ] Database tables created automatically
- [ ] Health endpoint responds with 200 OK
- [ ] No Python exceptions in console

---

## TEST 2: Backend API Endpoints

### Status: ⚠️ REQUIRES MANUAL VERIFICATION

**Test Script:**
```bash
# 1. Health Check
curl http://localhost:8000/health
# Expected: 200 {"status":"ok","service":"expense-tracker-api"}

# 2. Root Endpoint
curl http://localhost:8000/
# Expected: 200 {"message":"Expense Tracker API","version":"1.0.0","status":"running"}

# 3. OAuth Status
curl http://localhost:8000/auth/oauth-status
# Expected: 200 with oauth_configured status

# 4. Register User
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}'
# Expected: 200 or 201 with user data and token

# 5. Login User
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@test.com&password=Test1234!"
# Expected: 200 with {"access_token":"...","token_type":"bearer"}

# 6. Get Expenses (requires token)
TOKEN="<paste-token-from-login>"
curl http://localhost:8000/expenses \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 with array of expenses (may be empty)

# 7. Create Expense (requires token)
curl -X POST http://localhost:8000/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Expense","amount":10.50,"category":"Food","date":"2026-04-28"}'
# Expected: 201 with created expense data

# 8. Get Dashboard Data (requires token)
curl http://localhost:8000/dashboard \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 with dashboard statistics

# 9. Get Insights (requires token)
curl http://localhost:8000/insights \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 with spending insights
```

**Expected Results:**

| Endpoint | Method | Expected Status | Notes |
|----------|--------|----------------|-------|
| `/health` | GET | 200 | Health check |
| `/` | GET | 200 | Root endpoint |
| `/auth/oauth-status` | GET | 200 | OAuth config status |
| `/auth/register` | POST | 200/201 | User registration |
| `/auth/login` | POST | 200 | Returns JWT token |
| `/expenses` | GET | 200 | Requires auth |
| `/expenses` | POST | 201 | Requires auth |
| `/expenses/{id}` | GET | 200 | Requires auth |
| `/expenses/{id}` | PUT | 200 | Requires auth |
| `/expenses/{id}` | DELETE | 200/204 | Requires auth |
| `/dashboard` | GET | 200 | Requires auth |
| `/insights` | GET | 200 | Requires auth |

**Verification Checklist:**
- [ ] All endpoints return expected status codes
- [ ] JWT token is generated on login
- [ ] Protected endpoints reject requests without token (401)
- [ ] CORS headers present in responses
- [ ] No 500 Internal Server Errors
- [ ] Database operations work correctly

---

## TEST 3: Frontend Builds

### Status: ✅ VERIFIED (Build Successful)

**Build Command:**
```bash
cd frontend
npm install
npm run build
```

**Build Output:**
```
✓ 2616 modules transformed
✓ built in 1.15s

dist/index.html                    1.83 kB │ gzip:  0.70 kB
dist/assets/index-IVVG4Qst.css    74.57 kB │ gzip: 13.01 kB
dist/assets/rolldown-runtime       0.82 kB │ gzip:  0.47 kB
dist/assets/state-MANXPkPe.js      9.81 kB │ gzip:  4.04 kB
dist/assets/vendor-DyeSYAPe.js     9.83 kB │ gzip:  3.87 kB
dist/assets/utils-B1OI8VU3.js     59.40 kB │ gzip: 21.19 kB
dist/assets/forms-B5xi6KCV.js     90.37 kB │ gzip: 26.59 kB
dist/assets/animation-DEOjamFK.js 132.22 kB │ gzip: 43.30 kB
dist/assets/index-DISIFS4m.js     134.79 kB │ gzip: 26.53 kB
dist/assets/charts-DO2aq1Gf.js    188.06 kB │ gzip: 65.35 kB
dist/assets/react-vendor          237.70 kB │ gzip: 76.67 kB
```

**Results:**
- ✅ Build completed successfully
- ✅ Zero TypeScript errors
- ✅ Zero build errors
- ✅ `dist/` folder created
- ✅ `dist/index.html` exists
- ✅ Total bundle size: ~937 KB (uncompressed), ~281 KB (gzipped)
- ✅ Well under 5MB limit
- ✅ Excellent code splitting

**Verification Checklist:**
- [x] `npm install` completes without errors
- [x] `npm run build` succeeds
- [x] `dist/` directory created
- [x] `dist/index.html` exists
- [x] All asset chunks generated
- [x] No TypeScript compilation errors
- [x] No missing module errors
- [x] Bundle size optimized

---

## TEST 4: Frontend Dev Server

### Status: ⚠️ REQUIRES MANUAL VERIFICATION

**Start Command:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v8.0.9  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Pages to Test:**
1. **Home/Dashboard** - `http://localhost:5173/`
2. **Login** - `http://localhost:5173/login`
3. **Register** - `http://localhost:5173/register`
4. **Expenses** - `http://localhost:5173/expenses`
5. **Add Expense** - `http://localhost:5173/expenses/add`
6. **Insights** - `http://localhost:5173/insights`
7. **Profile** - `http://localhost:5173/profile`

**Browser Console Checks:**
- [ ] No 404 errors for assets
- [ ] No CORS errors
- [ ] API calls go to `http://localhost:8000`
- [ ] No missing module errors
- [ ] No React errors
- [ ] Theme toggle works
- [ ] Dark mode persists

**API Integration Checks:**
- [ ] Login form submits to backend
- [ ] Registration form submits to backend
- [ ] Dashboard loads data from backend
- [ ] Expenses list loads from backend
- [ ] Can create new expense
- [ ] Can edit expense
- [ ] Can delete expense
- [ ] Insights load from backend

**Expected Console Output:**
```
Frontend Config: {
  appUrl: "http://localhost:5173",
  apiUrl: "http://localhost:8000",
  landingUrl: "http://localhost:8080",
  environment: "development"
}
```

**Verification Checklist:**
- [ ] Dev server starts on port 5173
- [ ] All pages load without errors
- [ ] No console errors in browser DevTools
- [ ] API calls use correct base URL
- [ ] Authentication flow works
- [ ] Protected routes redirect to login
- [ ] Authenticated routes accessible with token

---

## TEST 5: Landing Page

### Status: ⚠️ REQUIRES MANUAL VERIFICATION

**Start Command:**
```bash
npx serve landing-page -p 3001
# or
cd landing-page && python -m http.server 3001
```

**Test URL:** `http://localhost:3001`

**Visual Checks:**
- [ ] Page loads without errors
- [ ] Hero video plays (or poster shows)
- [ ] Feature card videos play (or posters show)
- [ ] Dashboard mockup image loads
- [ ] Theme toggle works (sun/moon icon)
- [ ] Mobile menu works (hamburger)
- [ ] All sections visible (hero, features, dashboard, stats, CTA, footer)

**Console Checks:**
```javascript
// Expected in console:
Landing Page Config: {
  environment: "development",
  appUrl: "http://localhost:5173",
  apiUrl: "http://localhost:8000"
}

Router initialized: X CTA buttons found
```

**CTA Button Tests:**
1. Click "Get Started" in hero
   - Expected: Redirect to `http://localhost:5173/register`
2. Click "Get Started Free" in CTA section
   - Expected: Redirect to `http://localhost:5173/register`
3. Click "Get Started" in footer
   - Expected: Redirect to `http://localhost:5173/register`

**Navigation Tests:**
- [ ] Click "Features" → Scrolls to features section
- [ ] Click "Dashboard" → Scrolls to dashboard section
- [ ] Click "Testimonials" → Scrolls to stats section

**Asset Checks:**
- [ ] No 404 errors in console
- [ ] No manifest.json errors
- [ ] All images load
- [ ] Videos load or fallback gracefully
- [ ] Favicon appears

**Verification Checklist:**
- [ ] Page loads successfully
- [ ] No 404 errors in console
- [ ] No CORS errors
- [ ] CTA buttons route to correct URL
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] All assets load

---

## TEST 6: Environment Variables

### Status: ✅ VERIFIED

### Backend Environment Variables

**From `backend/.env.example`:**

| Variable | Required | Set in .env | Notes |
|----------|----------|-------------|-------|
| `DATABASE_URL` | ✅ | ✅ | Set to `sqlite:///./expenses.db` |
| `SECRET_KEY` | ✅ | ✅ | ⚠️ Using test key - CHANGE IN PRODUCTION |
| `ALGORITHM` | ✅ | ✅ | Set to `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ✅ | ✅ | Set to `30` |
| `GOOGLE_CLIENT_ID` | ✅ | ✅ | Google OAuth configured |
| `GOOGLE_CLIENT_SECRET` | ✅ | ✅ | Google OAuth configured |
| `GOOGLE_REDIRECT_URI` | ✅ | ✅ | Set to `http://localhost:8000/auth/google/callback` |
| `FRONTEND_URL` | ✅ | ✅ | Set to `http://localhost:5173` |

**Issues:**
- ⚠️ `SECRET_KEY` appears to be a test value - MUST be changed for production
- ⚠️ Extra variables in .env: `access_token`, `token_type` (not in .env.example - can be removed)

### Frontend Environment Variables

**From `frontend/.env.example`:**

| Variable | Required | Set in .env | Notes |
|----------|----------|-------------|-------|
| `VITE_APP_URL` | ✅ | ✅ | Set to `http://localhost:5173` |
| `VITE_API_URL` | ✅ | ✅ | Set to `http://localhost:8000` |
| `VITE_LANDING_URL` | ✅ | ✅ | Set to `http://localhost:8080` |

**Status:** ✅ All required variables present

### Landing Page Environment Variables

**From `landing-page/.env.example`:**

| Variable | Required | Set | Notes |
|----------|----------|-----|-------|
| `ENV_APP_URL` | Optional | ❌ | Uses config.js fallback |
| `ENV_API_URL` | Optional | ❌ | Uses config.js fallback |

**Status:** ✅ Optional variables - config.js provides fallbacks

**Verification Checklist:**
- [x] Backend: All required variables present
- [x] Frontend: All required variables present
- [x] Landing page: Optional variables (fallbacks exist)
- [ ] Backend: SECRET_KEY needs to be changed for production
- [ ] Backend: Remove extra variables (access_token, token_type)

---

## 📊 FINAL TEST RESULTS

| Test | Status | Issue | Action Required |
|------|--------|-------|-----------------|
| **Backend Starts** | ⚠️ MANUAL | Dependencies need installation | Run `pip install -r requirements.txt` |
| **API Endpoints** | ⚠️ MANUAL | Requires running backend | Start backend and test endpoints |
| **Frontend Build** | ✅ PASS | None | Build successful (281 KB gzipped) |
| **Frontend Dev** | ⚠️ MANUAL | Requires running servers | Start backend + frontend |
| **Landing Page** | ⚠️ MANUAL | Requires local server | Serve landing-page directory |
| **Env Variables** | ✅ PASS | SECRET_KEY needs update | Change SECRET_KEY for production |

---

## 🔧 Pre-Deployment Checklist

### Before Deploying Backend to Railway:
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Test backend starts: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- [ ] Test health endpoint: `curl http://localhost:8000/health`
- [ ] Test API endpoints with curl/Postman
- [ ] Generate new SECRET_KEY: `openssl rand -hex 32`
- [ ] Remove extra variables from .env (access_token, token_type)
- [ ] Verify PostgreSQL driver installed (psycopg2-binary)

### Before Deploying Frontend to Vercel:
- [x] Build succeeds: `npm run build`
- [x] No TypeScript errors
- [x] Environment variables configured
- [x] API URL centralized in lib/api.ts
- [x] vercel.json created
- [ ] Test dev server: `npm run dev`
- [ ] Test all pages load
- [ ] Test API integration with backend

### Before Deploying Landing Page to Vercel:
- [x] config.js supports environment overrides
- [x] router.js uses dynamic URLs
- [x] vercel.json configured
- [x] All assets exist
- [ ] Test with local server
- [ ] Test CTA buttons
- [ ] Test theme toggle

---

## 🚀 Manual Testing Commands

### Start Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Start Landing Page:
```bash
npx serve landing-page -p 3001
```

### Test Backend Health:
```bash
curl http://localhost:8000/health
```

### Test Frontend:
```
Open http://localhost:5173 in browser
Check console for errors
Test login/register flow
```

### Test Landing Page:
```
Open http://localhost:3001 in browser
Click CTA buttons
Check console for errors
```

---

## ✅ Deployment Readiness Summary

### Backend:
- ✅ Code ready for deployment
- ✅ Railway configuration complete (railway.json, Procfile)
- ✅ Health endpoint configured
- ✅ CORS configured for environment variables
- ✅ PostgreSQL driver added
- ⚠️ Requires manual testing
- ⚠️ SECRET_KEY needs update

### Frontend:
- ✅ Build successful
- ✅ Vercel configuration complete (vercel.json)
- ✅ Environment variables configured
- ✅ API URL centralized
- ✅ Code splitting optimized
- ⚠️ Requires manual testing

### Landing Page:
- ✅ Static site ready
- ✅ Vercel configuration complete
- ✅ Dynamic URL routing configured
- ✅ All assets present
- ⚠️ Requires manual testing

---

## 📝 Next Steps

1. **Run Manual Tests:**
   - Start backend server
   - Test all API endpoints
   - Start frontend dev server
   - Test all pages and flows
   - Start landing page server
   - Test CTA buttons and navigation

2. **Fix Any Issues:**
   - Address any failing tests
   - Update SECRET_KEY
   - Remove extra .env variables

3. **Deploy:**
   - Deploy backend to Railway
   - Deploy frontend to Vercel
   - Deploy landing page to Vercel
   - Update environment variables in production
   - Update Google OAuth URLs

4. **Post-Deployment Testing:**
   - Test production health endpoints
   - Test production API calls
   - Test production frontend
   - Test production landing page CTAs
   - Verify CORS configuration
   - Verify OAuth flow

---

**Status:** Project is code-ready for deployment. Manual functional testing required to verify runtime behavior.

# Google OAuth - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Google Credentials (2 min)

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add these URLs:
   - **JavaScript origins**: `http://localhost:5173`
   - **Redirect URIs**: `http://localhost:8000/auth/google/callback`
4. Copy **Client ID** and **Client Secret**

### Step 2: Configure Backend (1 min)

Edit `backend/.env`:

```env
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### Step 3: Install Dependencies (1 min)

```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Reset Database (1 min)

```bash
# Delete old database
rm backend/expenses.db

# Restart backend (creates new schema)
cd backend
uvicorn app.main:app --reload
```

### Step 5: Test It! (30 sec)

1. Start frontend: `cd frontend && npm run dev`
2. Go to http://localhost:5173/login
3. Click "Continue with Google"
4. Sign in with Google
5. ✅ You're in!

---

## ✅ What's Working

- ✅ Sign in with Google
- ✅ Sign up with Google (auto-creates account)
- ✅ Email/password login still works
- ✅ Seamless redirect to dashboard
- ✅ Secure token handling

---

## 🔧 Troubleshooting

**"redirect_uri_mismatch"**
→ Check Google Console redirect URI matches exactly: `http://localhost:8000/auth/google/callback`

**"invalid_client"**
→ Check `.env` has correct GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

**Not redirecting to dashboard**
→ Check backend is running on port 8000
→ Check frontend is running on port 5173

---

## 📝 What Changed

### Backend:
- Added Google OAuth routes (`/auth/google/login`, `/auth/google/callback`)
- Updated User model (added name, picture, provider fields)
- Added google-auth and httpx dependencies

### Frontend:
- Connected "Continue with Google" buttons
- Added token handling in Dashboard
- No breaking changes to existing auth

---

## 🎯 Next Steps

1. Test with different Google accounts
2. Test existing email/password login (should still work)
3. For production: Update URLs in Google Console and `.env`

---

## 📚 Full Documentation

See `GOOGLE-OAUTH-SETUP.md` for complete details, production deployment, and advanced configuration.

---

**That's it!** Google OAuth is ready to use. 🎉

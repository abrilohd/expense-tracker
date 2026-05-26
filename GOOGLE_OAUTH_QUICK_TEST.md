# 🧪 Google OAuth Quick Test Guide

## ✅ Status: Ready to Test

The Google OAuth flow has been fixed and is ready for testing.

---

## 🔧 What Was Fixed

### Backend Changes
1. ✅ Updated redirect URL to `/auth/google/callback` (frontend route)
2. ✅ OAuth routes properly configured
3. ✅ User creation/login logic working

### Frontend Changes
1. ✅ Created `GoogleCallback.tsx` component
2. ✅ Added `/auth/google/callback` route to App.tsx
3. ✅ Added `setToken` method to authStore
4. ✅ Token extraction and storage implemented
5. ✅ Loading state during OAuth completion

---

## 🚀 Quick Test (Local Development)

### Step 1: Start Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 3: Test OAuth Flow

1. **Open Browser**
   - Go to: http://localhost:5173/login

2. **Click "Continue with Google"**
   - Should redirect to Google sign-in page
   - URL should be: `https://accounts.google.com/o/oauth2/v2/auth?...`

3. **Sign in with Google**
   - Enter your Google credentials
   - Click "Continue" or "Allow"

4. **OAuth Callback**
   - Should redirect to: `http://localhost:5173/auth/google/callback?token=...`
   - Should see "Completing sign in..." loading screen
   - Should show success toast: "Successfully signed in with Google!"

5. **Dashboard**
   - Should redirect to: `http://localhost:5173/dashboard`
   - Should see your dashboard with data
   - Profile should show your Google name and picture

6. **Verify Login**
   - Check browser localStorage: `expense_token` should exist
   - Profile menu should show your Google profile picture
   - All protected routes should be accessible

---

## 🐛 Troubleshooting

### Issue: "This site can't be reached"

**Cause:** Frontend is not running on http://localhost:5173

**Solution:**
```bash
# Make sure frontend is running
cd frontend
npm run dev

# Should see:
# ➜  Local:   http://localhost:5173/
```

---

### Issue: Redirects to Login Page

**Cause:** Token not being saved or callback handler not working

**Debug Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Continue with Google"
4. After OAuth, check console for errors
5. Check Network tab for failed requests
6. Check Application tab → Local Storage → `expense_token`

**Check URL:**
- After Google OAuth, URL should be: `http://localhost:5173/auth/google/callback?token=eyJ...`
- If token is missing, check backend logs

---

### Issue: Backend Error

**Check Backend Logs:**
```bash
# In backend terminal, look for errors like:
ERROR:    Exception in ASGI application
```

**Common Issues:**
1. `GOOGLE_CLIENT_ID` not set
2. `GOOGLE_CLIENT_SECRET` not set
3. `GOOGLE_REDIRECT_URI` mismatch
4. Database error

**Solution:**
```bash
# Verify environment variables
cd backend
cat .env | grep GOOGLE

# Should show:
# GOOGLE_CLIENT_ID=269702079191-...
# GOOGLE_CLIENT_SECRET=GOCSPX-...
# GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
# FRONTEND_URL=http://localhost:5173
```

---

### Issue: Google OAuth Error

**Error:** "redirect_uri_mismatch"

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   ```
   http://localhost:8000/auth/google/callback
   ```
5. Save changes
6. Wait 5 minutes for changes to propagate
7. Try again

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Can access login page
- [ ] "Continue with Google" button visible
- [ ] Clicking button redirects to Google
- [ ] Can sign in with Google account
- [ ] Redirects back to app
- [ ] Shows "Completing sign in..." screen
- [ ] Shows success toast message
- [ ] Redirects to dashboard
- [ ] User is logged in
- [ ] Profile shows Google picture
- [ ] Token in localStorage
- [ ] Can access all protected routes
- [ ] Logout works

---

## 📊 Expected Backend Logs

```
INFO:     127.0.0.1:xxxxx - "GET /auth/google/login HTTP/1.1" 307 Temporary Redirect
INFO:     Google OAuth Login Debug:
INFO:        Client ID: 269702079191-305itou...
INFO:        Redirect URI: http://localhost:8000/auth/google/callback
INFO:        Redirecting to: https://accounts.google.com/o/oauth2/v2/auth?...
INFO:     127.0.0.1:xxxxx - "GET /auth/google/callback?code=... HTTP/1.1" 307 Temporary Redirect
```

---

## 📊 Expected Frontend Console

```
[GoogleCallback] Token received: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[GoogleCallback] Token saved to localStorage
[GoogleCallback] Loading user data...
[GoogleCallback] User loaded successfully
[GoogleCallback] Redirecting to dashboard...
```

---

## 🎯 Test Different Scenarios

### Scenario 1: New User (First Time Google Sign-in)
1. Use a Google account that hasn't signed up before
2. Click "Continue with Google"
3. Sign in with Google
4. **Expected:** New user created in database
5. **Expected:** Redirected to dashboard
6. **Expected:** Profile shows Google name and picture

### Scenario 2: Existing User (Returning User)
1. Use a Google account that has signed in before
2. Click "Continue with Google"
3. Sign in with Google
4. **Expected:** User logged in (not created)
5. **Expected:** Redirected to dashboard
6. **Expected:** Profile shows updated Google info

### Scenario 3: User Denies Permission
1. Click "Continue with Google"
2. On Google consent screen, click "Cancel" or "Deny"
3. **Expected:** Redirected to login page
4. **Expected:** Error message shown
5. **Expected:** Not logged in

---

## 🚀 Production Testing

### Before Production Deployment

1. **Update Google Cloud Console:**
   - Add production redirect URI:
     ```
     https://your-backend.railway.app/auth/google/callback
     ```
   - Add production JavaScript origins:
     ```
     https://your-app.vercel.app
     https://your-backend.railway.app
     ```

2. **Update Railway Environment Variables:**
   ```bash
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   GOOGLE_REDIRECT_URI=https://your-backend.railway.app/auth/google/callback
   FRONTEND_URL=https://your-app.vercel.app
   ```

3. **Update Vercel Environment Variables:**
   ```bash
   VITE_API_URL=https://your-backend.railway.app
   ```

4. **Test Production:**
   - Go to: https://your-app.vercel.app/login
   - Click "Continue with Google"
   - Sign in with Google
   - Should redirect to dashboard
   - Verify user is logged in

---

## 📝 Quick Commands

### Start Both Services
```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Check if Services are Running
```bash
# Check backend
curl http://localhost:8000/

# Check frontend
curl http://localhost:5173/
```

### View Logs
```bash
# Backend logs are in the terminal where uvicorn is running
# Frontend logs are in the terminal where npm run dev is running
```

---

## 🎉 Success!

If all steps pass, your Google OAuth is working correctly!

**Next Steps:**
1. ✅ Test with multiple Google accounts
2. ✅ Test logout and re-login
3. ✅ Deploy to production
4. ✅ Test production OAuth flow
5. ✅ Monitor for any issues

---

**Last Updated:** May 25, 2026  
**Status:** ✅ Ready to Test  
**Environment:** Development (localhost)

🚀 **Happy Testing!**

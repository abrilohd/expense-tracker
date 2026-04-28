# 🚨 URGENT: Fix OAuth CORS Issue

## Problem
Your backend is running on `127.0.0.1:8000` but Google OAuth is configured for `localhost:8000`. These are different origins!

## ✅ What I've Fixed
1. ✅ Updated CORS in `backend/app/main.py` to allow both `localhost` and `127.0.0.1`
2. ✅ Updated `backend/.env` to use `127.0.0.1` URLs

## 🔧 What YOU Need to Do (2 minutes)

### Step 1: Update Google Cloud Console

Go to your OAuth client in Google Cloud Console:
**URL:** https://console.cloud.google.com/apis/credentials/oauthclient/199412317897-qmg571f724l5mnsiiit2bc3ldlaefhst.apps.googleusercontent.com

#### Add these to "Authorized JavaScript origins":
```
http://127.0.0.1:5173
http://127.0.0.1:8000
```

**Keep the existing ones too:**
- `http://localhost:5173`
- `http://localhost:8000`

#### Add this to "Authorized redirect URIs":
```
http://127.0.0.1:8000/auth/google/callback
```

**Keep the existing one too:**
- `http://localhost:8000/auth/google/callback`

**Click "SAVE"**

---

### Step 2: Restart Backend

```bash
# Stop your backend (Ctrl+C)

# Start it again
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

### Step 3: Update Frontend to Use 127.0.0.1

Your frontend should use `127.0.0.1` instead of `localhost` to match the backend.

**Option A: Update frontend/.env**
```env
VITE_API_URL=http://127.0.0.1:8000
```

**Option B: Access frontend via 127.0.0.1**
Instead of `http://localhost:5173`, use `http://127.0.0.1:5173`

---

### Step 4: Test OAuth

1. **Open:** http://127.0.0.1:5173/login
2. **Click:** "Continue with Google"
3. **You should see:** Google's consent screen (no more CORS error!)

---

## 🎯 Quick Summary

**The Issue:**
- `localhost` and `127.0.0.1` are treated as different origins
- Your backend runs on `127.0.0.1:8000`
- Google OAuth was only configured for `localhost`
- CORS was blocking the request

**The Fix:**
1. ✅ Backend CORS updated (done)
2. ✅ Backend .env updated (done)
3. ⏳ Google Cloud Console needs updating (you need to do this)
4. ⏳ Restart backend (you need to do this)
5. ⏳ Test with 127.0.0.1 URLs (you need to do this)

---

## 📸 Google Cloud Console - What to Add

In your OAuth client settings, you should have:

**Authorized JavaScript origins:**
- http://localhost:5173
- http://localhost:8000
- http://127.0.0.1:5173  ← ADD THIS
- http://127.0.0.1:8000  ← ADD THIS

**Authorized redirect URIs:**
- http://localhost:8000/auth/google/callback
- http://127.0.0.1:8000/auth/google/callback  ← ADD THIS

---

## ✅ Verification

After making these changes, verify:

```bash
cd backend
python verify_oauth_config.py
```

Should show:
- ✅ Redirect URI: http://127.0.0.1:8000/auth/google/callback
- ✅ Frontend URL: http://127.0.0.1:5173

---

## 🐛 If Still Not Working

### Check 1: Backend is running on correct port
```bash
# Should show backend running on port 8000
netstat -ano | findstr :8000
```

### Check 2: CORS is configured
Open http://127.0.0.1:8000/docs and check if it loads

### Check 3: Google Cloud Console saved
Make sure you clicked "SAVE" after adding the URLs

### Check 4: Browser cache
Clear browser cache or use incognito mode

---

## 🎉 Success!

Once you complete these steps, OAuth will work!

You'll know it's working when:
1. ✅ No CORS error in browser console
2. ✅ Clicking "Continue with Google" shows Google consent screen
3. ✅ After authorizing, you're redirected to dashboard

---

**Need help?** Check browser console (F12) for any remaining errors.

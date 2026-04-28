# 🚀 START HERE - Fix Google OAuth in 5 Minutes

## ⚡ The Fastest Way to Fix Your OAuth Error

### Current Error:
```
Sign in with Google
Access blocked: Authorization Error
Missing required parameter: client_id
Error 400: invalid_request
```

### The Fix (5 Steps):

---

## Step 1: Create Google OAuth Credentials (2 minutes)

1. **Open:** https://console.cloud.google.com/apis/credentials

2. **Click:** "+ CREATE CREDENTIALS" → "OAuth client ID"

3. **If prompted to configure consent screen:**
   - Click "CONFIGURE CONSENT SCREEN"
   - Choose "External"
   - Fill in:
     - App name: `ExpenseTracker`
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE" (3 times)
   - Click "BACK TO DASHBOARD"
   - Go back to "Credentials" and click "+ CREATE CREDENTIALS" again

4. **Configure OAuth Client:**
   - Application type: **Web application**
   - Name: `ExpenseTracker Web Client`
   
   **Authorized JavaScript origins** (click "+ ADD URI" for each):
   ```
   http://localhost:5173
   http://localhost:8000
   ```
   
   **Authorized redirect URIs** (click "+ ADD URI"):
   ```
   http://localhost:8000/auth/google/callback
   ```

5. **Click:** "CREATE"

6. **COPY** the Client ID and Client Secret shown in the popup

---

## Step 2: Update Backend Configuration (1 minute)

1. **Open:** `backend/.env` file

2. **Find these lines:**
   ```env
   GOOGLE_CLIENT_ID=269702079191-305itouics3dmod93gmnvk5t9tl2h9qh.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_ID
   ```

3. **Replace with YOUR credentials from Step 1:**
   ```env
   GOOGLE_CLIENT_ID=paste-your-client-id-here
   GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
   ```

4. **Save the file**

---

## Step 3: Verify Configuration (30 seconds)

**Run this command:**

```bash
cd backend
python verify_oauth_config.py
```

**Expected output:** All green checkmarks ✅

**If you see errors:** The script will tell you what's wrong. Fix it and run again.

---

## Step 4: Restart Backend (30 seconds)

**Stop your backend** (press Ctrl+C in the terminal where it's running)

**Start it again:**

```bash
cd backend
# Activate virtual environment first
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Wait for:** "Application startup complete"

---

## Step 5: Test OAuth (1 minute)

1. **Make sure frontend is running:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser:** http://localhost:5173/login

3. **Click:** "Continue with Google"

4. **You should see:** Google's consent screen (blue Google page)

5. **Select your Google account** and authorize

6. **You should be:** Redirected to your dashboard, logged in!

---

## ✅ Success!

If you made it here, OAuth is working! 🎉

---

## 🐛 Troubleshooting

### Still getting "Missing required parameter: client_id"?

**Problem:** Backend didn't reload the new .env file

**Fix:**
1. Make sure you saved `backend/.env`
2. Stop backend (Ctrl+C)
3. Start backend again
4. Try again

---

### Getting "redirect_uri_mismatch"?

**Problem:** The redirect URI doesn't match Google Cloud Console

**Fix:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Click on your OAuth client
3. Make sure "Authorized redirect URIs" includes EXACTLY:
   ```
   http://localhost:8000/auth/google/callback
   ```
4. Save and try again

---

### Getting "Access blocked: Authorization Error" (but different message)?

**Problem:** You need to add yourself as a test user

**Fix:**
1. Go to https://console.cloud.google.com/apis/credentials/consent
2. Scroll down to "Test users"
3. Click "+ ADD USERS"
4. Enter your Google email
5. Click "SAVE"
6. Try again

---

### Backend won't start?

**Problem:** Port 8000 might be in use

**Fix:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

Then start backend again.

---

### Frontend won't start?

**Problem:** Port 5173 might be in use

**Fix:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

Then start frontend again.

---

## 🎯 Quick Verification Checklist

Before testing, make sure:

- [ ] Created OAuth 2.0 Client ID in Google Cloud Console
- [ ] Added `http://localhost:5173` to Authorized JavaScript origins
- [ ] Added `http://localhost:8000` to Authorized JavaScript origins  
- [ ] Added `http://localhost:8000/auth/google/callback` to Authorized redirect URIs
- [ ] Copied Client ID to `backend/.env`
- [ ] Copied Client Secret to `backend/.env`
- [ ] Saved `backend/.env` file
- [ ] Restarted backend server
- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 5173
- [ ] Added your email as test user (if app not published)

---

## 📞 Still Having Issues?

### Run the diagnostic scripts:

```bash
# Verify configuration
cd backend
python verify_oauth_config.py

# Test OAuth endpoint
python test_oauth_endpoint.py
```

These will tell you exactly what's wrong.

---

### Check the logs:

**Backend logs:** Look at the terminal where backend is running

**Frontend logs:** Open browser DevTools (F12) → Console tab

**Look for:** Error messages that tell you what's wrong

---

### Common mistakes:

- ❌ Forgot to save `backend/.env` after editing
- ❌ Forgot to restart backend after changing `.env`
- ❌ Copied Client ID/Secret incorrectly (extra spaces, missing characters)
- ❌ URLs in Google Console don't match exactly (check for typos)
- ❌ Backend not running when testing
- ❌ Frontend not running when testing
- ❌ Using wrong port numbers

---

## 📚 Want More Details?

This is the quick fix. For complete documentation:

- **Quick Fix Guide:** `OAUTH-QUICK-FIX.md`
- **Complete Setup Guide:** `GOOGLE-OAUTH-SETUP-GUIDE.md`
- **Deployment Checklist:** `OAUTH-DEPLOYMENT-CHECKLIST.md`
- **Overview:** `OAUTH-SETUP-SUMMARY.md`

---

## 🚀 For Production Deployment

**Don't use these credentials in production!**

When deploying to production:

1. Create **separate** OAuth credentials with production URLs
2. Use **HTTPS** (not HTTP)
3. Update environment variables with production values
4. Follow the deployment checklist

See `GOOGLE-OAUTH-SETUP-GUIDE.md` for production setup.

---

## 🎉 You're Done!

Once OAuth is working:

1. ✅ You can sign in with Google
2. ✅ Users are created in your database
3. ✅ You're ready to continue development

**Next:** Build your app features!

**For production:** Follow the deployment guide when ready.

---

**Questions?** Check the troubleshooting section above or read the detailed guides.

**Good luck! 🚀**

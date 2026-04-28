# Google OAuth Quick Fix Guide

## 🚨 Current Error
**Error:** "Missing required parameter: client_id"

This means your Google OAuth credentials are not properly configured.

---

## ⚡ Quick Fix (5 Minutes)

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account

2. **Create or Select Project**
   - If you don't have a project, click "CREATE PROJECT"
   - Name it: `expense-tracker`
   - Click "CREATE"

3. **Configure OAuth Consent Screen** (First time only)
   - Click "OAuth consent screen" in left sidebar
   - Choose "External"
   - Fill in:
     - App name: `ExpenseTracker`
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE" through all steps

4. **Create OAuth Client ID**
   - Click "Credentials" in left sidebar
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Name: `ExpenseTracker Web Client`
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   http://localhost:8000
   http://127.0.0.1:5173
   http://127.0.0.1:8000
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:8000/auth/google/callback
   http://127.0.0.1:8000/auth/google/callback
   ```
   
   - Click "CREATE"
   - **COPY** the Client ID and Client Secret shown

### Step 2: Update Backend Environment Variables

1. **Open `backend/.env` file**

2. **Replace these lines:**
   ```env
   GOOGLE_CLIENT_ID=269702079191-305itouics3dmod93gmnvk5t9tl2h9qh.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_ID
   ```

3. **With your NEW credentials from Google Cloud Console:**
   ```env
   GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID_HERE
   GOOGLE_CLIENT_SECRET=YOUR_NEW_CLIENT_SECRET_HERE
   ```

4. **Verify these are correct:**
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```

### Step 3: Verify Configuration

Run the verification script:

```bash
cd backend
python verify_oauth_config.py
```

This will check if everything is configured correctly.

### Step 4: Restart Backend Server

```bash
# Stop the current backend (Ctrl+C)

# Restart it
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Test OAuth Flow

1. Open your browser to: http://localhost:5173/login
2. Click "Continue with Google"
3. You should see Google's consent screen
4. After authorizing, you should be redirected back to your app

---

## 🔍 Troubleshooting

### Still getting "Missing required parameter: client_id"?

**Check 1: Environment variables loaded?**
```bash
cd backend
python -c "from app.core.config import settings; print(f'Client ID: {settings.google_client_id}')"
```

If it prints empty or placeholder, your .env file is not being read.

**Check 2: .env file in correct location?**
```bash
cd backend
ls -la .env  # Should show the file
```

**Check 3: Restart backend after changing .env**
- Always restart the server after modifying .env file

### Getting "redirect_uri_mismatch"?

**The redirect URI in your code must EXACTLY match Google Cloud Console.**

Check your Google Cloud Console:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth client
3. Verify "Authorized redirect URIs" includes:
   ```
   http://localhost:8000/auth/google/callback
   ```

### Getting "Access blocked: Authorization Error"?

**You need to add yourself as a test user:**

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Scroll to "Test users"
3. Click "ADD USERS"
4. Add your Google email
5. Click "SAVE"

### Getting "invalid_client"?

**Your client secret is wrong:**

1. Go to Google Cloud Console
2. Delete the old OAuth client
3. Create a new one
4. Update both Client ID and Secret in .env
5. Restart backend

---

## 📋 Verification Checklist

Before testing, verify:

- [ ] Created OAuth 2.0 Client ID in Google Cloud Console
- [ ] Added `http://localhost:5173` to Authorized JavaScript origins
- [ ] Added `http://localhost:8000` to Authorized JavaScript origins
- [ ] Added `http://localhost:8000/auth/google/callback` to Authorized redirect URIs
- [ ] Copied Client ID to `backend/.env`
- [ ] Copied Client Secret to `backend/.env`
- [ ] Verified `GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback`
- [ ] Verified `FRONTEND_URL=http://localhost:5173`
- [ ] Ran `python verify_oauth_config.py` successfully
- [ ] Restarted backend server
- [ ] Added your email as test user (if app not published)

---

## 🚀 For Production Deployment

When deploying to production, you need to:

1. **Create separate OAuth credentials for production**
   - Use your production domain URLs
   - Example: `https://api.yourdomain.com/auth/google/callback`

2. **Update environment variables**
   ```env
   GOOGLE_CLIENT_ID=production_client_id
   GOOGLE_CLIENT_SECRET=production_client_secret
   GOOGLE_REDIRECT_URI=https://api.yourdomain.com/auth/google/callback
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Update Google Cloud Console**
   - Add production URLs to Authorized JavaScript origins
   - Add production callback URL to Authorized redirect URIs
   - Update OAuth consent screen with production URLs

4. **Use HTTPS only in production**
   - Never use HTTP for OAuth in production
   - Set up SSL/TLS certificates

See **GOOGLE-OAUTH-SETUP-GUIDE.md** for complete production deployment instructions.

---

## 🆘 Still Having Issues?

1. **Check backend logs** for detailed error messages
2. **Check browser console** (F12) for frontend errors
3. **Verify URLs match exactly** (case-sensitive, no trailing slashes)
4. **Try with a different Google account**
5. **Clear browser cookies** and try again
6. **Make sure backend is running** on port 8000
7. **Make sure frontend is running** on port 5173

---

## 📞 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| Missing required parameter: client_id | Client ID not set in .env | Update GOOGLE_CLIENT_ID in backend/.env |
| redirect_uri_mismatch | URI doesn't match Google Console | Add exact URI to Google Cloud Console |
| Access blocked | Not a test user | Add email to test users in OAuth consent screen |
| invalid_client | Wrong client secret | Regenerate credentials in Google Cloud Console |
| unauthorized_client | App not configured | Complete OAuth consent screen setup |

---

**Need the full guide?** See `GOOGLE-OAUTH-SETUP-GUIDE.md` for comprehensive instructions.

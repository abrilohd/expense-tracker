# 🚂 Railway Environment Variables for Google OAuth

## ✅ REQUIRED: Set These in Railway Dashboard

Go to: **Railway Dashboard → Your Backend Project → Variables Tab**

Add or update these **4 environment variables**:

### 1. GOOGLE_CLIENT_ID
```
[Your Google OAuth Client ID from Google Cloud Console]
```
Format: `123456789-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`

### 2. GOOGLE_CLIENT_SECRET
```
[Your Google OAuth Client Secret from Google Cloud Console]
```
Format: `GOCSPX-xxxxxxxxxxxxxxxxxxxx`

### 3. GOOGLE_REDIRECT_URI
```
https://expense-tracker-production-419e.up.railway.app/auth/google/callback
```

### 4. FRONTEND_URL ⚠️ **THIS IS THE KEY FIX**
```
https://expense-tracker-app-tau-rust.vercel.app
```

---

## 🔧 How to Set Variables in Railway

1. Go to: https://railway.app/dashboard
2. Click on your **expense-tracker-backend** project
3. Click **Variables** tab
4. For each variable:
   - Click **+ New Variable**
   - Enter **Variable Name** (e.g., `FRONTEND_URL`)
   - Enter **Value** (e.g., `https://expense-tracker-app-tau-rust.vercel.app`)
   - Click **Add**
5. Railway will **automatically redeploy** after adding variables

---

## 🔑 Getting Google OAuth Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create or select your OAuth 2.0 Client ID
3. Copy the **Client ID** and **Client Secret**
4. Add **Authorized redirect URIs**:
   - `https://expense-tracker-production-419e.up.railway.app/auth/google/callback`
5. Add **Authorized JavaScript origins**:
   - `https://expense-tracker-app-tau-rust.vercel.app`

---

## ✅ Verification

After setting variables and redeployment completes:

### 1. Check Railway Logs
Look for:
```
OAuth configured: Client ID loaded (123456789-...)
```

### 2. Test OAuth Status Endpoint
```bash
curl https://expense-tracker-production-419e.up.railway.app/auth/oauth-status
```

**Expected response:**
```json
{
  "oauth_configured": true,
  "client_id_present": true,
  "client_id_preview": "123456789-...",
  "redirect_uri": "https://expense-tracker-production-419e.up.railway.app/auth/google/callback",
  "frontend_url": "https://expense-tracker-app-tau-rust.vercel.app"
}
```

### 3. Test Google OAuth Flow
1. Go to: https://expense-tracker-app-tau-rust.vercel.app/login
2. Click "Continue with Google"
3. Sign in with Google
4. **Should redirect to:** `https://expense-tracker-app-tau-rust.vercel.app/dashboard?token=...`
5. Dashboard should load with your account

---

## 🐛 Troubleshooting

### Issue: Still redirects to localhost

**Check:**
1. Railway variables are saved (refresh Variables tab)
2. Deployment completed after adding variables
3. Check Railway logs for: `frontend_url: https://expense-tracker-app-tau-rust.vercel.app`

**If still wrong:**
```bash
# Check what Railway is using
curl https://expense-tracker-production-419e.up.railway.app/debug/cors
```

Look for `"frontend_url"` in the response.

### Issue: Google OAuth error

**Check Google Cloud Console:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Verify **Authorized redirect URIs** includes:
   ```
   https://expense-tracker-production-419e.up.railway.app/auth/google/callback
   ```
4. Verify **Authorized JavaScript origins** includes:
   ```
   https://expense-tracker-app-tau-rust.vercel.app
   ```

---

## 📋 Complete Railway Variables Checklist

Your Railway backend should have these variables:

```bash
# Database (auto-set by Railway if using Railway PostgreSQL)
DATABASE_URL=postgresql://...

# JWT
SECRET_KEY=your-super-secret-key-change-in-production

# CORS
ALLOWED_ORIGINS=https://expense-tracker-app-tau-rust.vercel.app,https://expense-tracker-landing-three.vercel.app,http://localhost:5173

# Google OAuth (REQUIRED FOR OAUTH TO WORK)
GOOGLE_CLIENT_ID=[Your Client ID from Google Cloud Console]
GOOGLE_CLIENT_SECRET=[Your Client Secret from Google Cloud Console]
GOOGLE_REDIRECT_URI=https://expense-tracker-production-419e.up.railway.app/auth/google/callback
FRONTEND_URL=https://expense-tracker-app-tau-rust.vercel.app
```

---

## 🎯 What This Fixes

### Before (Broken):
```
User clicks "Continue with Google"
→ Google authenticates
→ Backend redirects to: http://localhost:5173/dashboard?token=...
→ ❌ FAILS (localhost not accessible in production)
```

### After (Fixed):
```
User clicks "Continue with Google"
→ Google authenticates
→ Backend redirects to: https://expense-tracker-app-tau-rust.vercel.app/dashboard?token=...
→ ✅ SUCCESS (production frontend URL)
```

---

## ⏱️ Timeline

1. **Set variables in Railway** (2 minutes)
2. **Railway auto-redeploys** (2 minutes)
3. **Test OAuth flow** (1 minute)

**Total: 5 minutes** ✅

---

**Status**: ✅ **READY TO SET IN RAILWAY**

After setting these 4 variables, Google OAuth will work perfectly!

# Google OAuth Setup Guide - Complete Step-by-Step

This guide will help you set up Google OAuth authentication from scratch for deployment.

## 🎯 Overview

The error "Missing required parameter: client_id" occurs because:
1. Google OAuth credentials are not properly configured in Google Cloud Console
2. The redirect URIs don't match between your app and Google Cloud Console
3. Environment variables are not correctly set

## 📋 Prerequisites

- Google Account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Your deployment URLs (production domain)

---

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click the project dropdown at the top
   - Click "NEW PROJECT"
   - Enter project name: `expense-tracker-app` (or your preferred name)
   - Click "CREATE"
   - Wait for project creation (takes a few seconds)
   - Select your new project from the dropdown

---

## Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" → "Library"
   - Or visit: https://console.cloud.google.com/apis/library

2. **Enable Required APIs**
   - Search for "Google+ API"
   - Click on "Google+ API"
   - Click "ENABLE"
   - Also search for "Google OAuth2 API" and enable it

---

## Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Left sidebar: "APIs & Services" → "OAuth consent screen"
   - Or visit: https://console.cloud.google.com/apis/credentials/consent

2. **Choose User Type**
   - Select "External" (for public apps)
   - Click "CREATE"

3. **Fill App Information**
   
   **App information:**
   - App name: `ExpenseTracker` (or your app name)
   - User support email: Your email address
   - App logo: (Optional) Upload your app logo

   **App domain:**
   - Application home page: `https://yourdomain.com` (your production URL)
   - Application privacy policy link: `https://yourdomain.com/privacy` (create this page)
   - Application terms of service link: `https://yourdomain.com/terms` (create this page)

   **Authorized domains:**
   - Add your domain: `yourdomain.com` (without https://)
   - For local testing, you can skip this initially

   **Developer contact information:**
   - Email addresses: Your email address

   Click "SAVE AND CONTINUE"

4. **Scopes**
   - Click "ADD OR REMOVE SCOPES"
   - Select these scopes:
     - `openid`
     - `email`
     - `profile`
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

5. **Test Users** (if using External)
   - Add your email and any test user emails
   - Click "ADD USERS"
   - Click "SAVE AND CONTINUE"

6. **Summary**
   - Review your settings
   - Click "BACK TO DASHBOARD"

---

## Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Left sidebar: "APIs & Services" → "Credentials"
   - Or visit: https://console.cloud.google.com/apis/credentials

2. **Create OAuth Client ID**
   - Click "CREATE CREDENTIALS" → "OAuth client ID"

3. **Configure OAuth Client**
   
   **Application type:**
   - Select "Web application"

   **Name:**
   - Enter: `ExpenseTracker Web Client`

   **Authorized JavaScript origins:**
   Add these URLs (one per line):
   ```
   http://localhost:5173
   http://localhost:8000
   http://127.0.0.1:5173
   http://127.0.0.1:8000
   https://yourdomain.com
   https://api.yourdomain.com
   ```

   **Authorized redirect URIs:**
   Add these URLs (one per line):
   ```
   http://localhost:8000/auth/google/callback
   http://127.0.0.1:8000/auth/google/callback
   https://api.yourdomain.com/auth/google/callback
   ```

   ⚠️ **IMPORTANT:** 
   - Replace `yourdomain.com` with your actual domain
   - Replace `api.yourdomain.com` with your actual API domain
   - URIs must match EXACTLY (including http/https, trailing slashes matter)
   - For production, remove localhost URLs

4. **Create and Save Credentials**
   - Click "CREATE"
   - A popup will show your credentials:
     - **Client ID**: `269702079191-xxxxxxxxxx.apps.googleusercontent.com`
     - **Client Secret**: `YOUR_GOOGLE_OAUTH_CLIENT_ID`
   - Click "DOWNLOAD JSON" (save this file securely)
   - Click "OK"

---

## Step 5: Update Environment Variables

### Backend Configuration

1. **Edit `backend/.env`**

```env
# Database Configuration
DATABASE_URL=sqlite:///./expenses.db

# JWT Authentication
SECRET_KEY=your-super-secret-key-change-in-production-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

2. **For Production `backend/.env.production`**

```env
# Database Configuration (use PostgreSQL for production)
DATABASE_URL=postgresql://username:password@host:5432/database

# JWT Authentication (generate new secret key!)
SECRET_KEY=generate-new-secret-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/auth/google/callback
FRONTEND_URL=https://yourdomain.com
```

### Frontend Configuration

1. **Edit `frontend/.env`**

```env
# Frontend App URL
VITE_APP_URL=http://localhost:5173

# Backend API URL
VITE_API_URL=http://localhost:8000

# Landing Page URL
VITE_LANDING_URL=http://localhost:8080
```

2. **For Production `frontend/.env.production`**

```env
# Frontend App URL
VITE_APP_URL=https://yourdomain.com

# Backend API URL
VITE_API_URL=https://api.yourdomain.com

# Landing Page URL
VITE_LANDING_URL=https://yourdomain.com
```

---

## Step 6: Update CORS Settings

Make sure your backend allows requests from your frontend domain.

**Edit `backend/app/core/config.py`:**

```python
class Settings(BaseSettings):
    # ... other settings ...
    
    # CORS configuration
    cors_origins: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://yourdomain.com",  # Add your production domain
    ]
```

---

## Step 7: Test Locally

1. **Start Backend**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test OAuth Flow**
   - Go to http://localhost:5173/login
   - Click "Continue with Google"
   - You should be redirected to Google's consent screen
   - After authorization, you should be redirected back to your app

4. **Check for Errors**
   - Open browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

---

## Step 8: Deployment Checklist

### Before Deploying:

- [ ] Update all environment variables with production values
- [ ] Generate new SECRET_KEY for production
- [ ] Update GOOGLE_REDIRECT_URI to production URL
- [ ] Update FRONTEND_URL to production URL
- [ ] Remove localhost URLs from Google Cloud Console
- [ ] Add production URLs to Google Cloud Console
- [ ] Update CORS origins in backend config
- [ ] Test OAuth flow in production environment
- [ ] Set up HTTPS/SSL certificates
- [ ] Update OAuth consent screen with production URLs

### Google Cloud Console Updates:

1. **Update Authorized JavaScript origins:**
   - Remove: `http://localhost:5173`, `http://localhost:8000`
   - Keep: `https://yourdomain.com`, `https://api.yourdomain.com`

2. **Update Authorized redirect URIs:**
   - Remove: `http://localhost:8000/auth/google/callback`
   - Keep: `https://api.yourdomain.com/auth/google/callback`

3. **Update OAuth Consent Screen:**
   - Update home page URL to production
   - Verify authorized domains

---

## 🔧 Troubleshooting

### Error: "Missing required parameter: client_id"

**Causes:**
- Environment variables not loaded
- Client ID is empty or incorrect
- Backend not reading .env file

**Solutions:**
1. Verify `.env` file exists in backend directory
2. Check `GOOGLE_CLIENT_ID` is set correctly
3. Restart backend server after changing .env
4. Print config values to verify they're loaded:
   ```python
   print(f"Client ID: {settings.google_client_id}")
   ```

### Error: "redirect_uri_mismatch"

**Causes:**
- Redirect URI in code doesn't match Google Cloud Console
- Missing trailing slash or protocol mismatch

**Solutions:**
1. Check exact URI in Google Cloud Console
2. Ensure URIs match exactly (case-sensitive)
3. Check for trailing slashes
4. Verify http vs https

### Error: "Access blocked: Authorization Error"

**Causes:**
- App not verified by Google
- User not added to test users
- OAuth consent screen not configured

**Solutions:**
1. Add user email to test users in OAuth consent screen
2. Complete OAuth consent screen configuration
3. For production, submit app for verification

### Error: "invalid_client"

**Causes:**
- Client secret is incorrect
- Client ID doesn't match secret

**Solutions:**
1. Regenerate credentials in Google Cloud Console
2. Update both client ID and secret in .env
3. Restart backend server

---

## 🔒 Security Best Practices

1. **Never commit credentials to Git**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for templates

2. **Use different credentials for dev/prod**
   - Create separate OAuth clients for development and production

3. **Rotate secrets regularly**
   - Generate new SECRET_KEY periodically
   - Update Google OAuth credentials if compromised

4. **Use HTTPS in production**
   - Never use OAuth over HTTP in production
   - Set up SSL/TLS certificates

5. **Limit OAuth scopes**
   - Only request necessary permissions (email, profile)
   - Don't request unnecessary Google API access

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

## ✅ Quick Verification Checklist

Before going live, verify:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Authorized JavaScript origins added
- [ ] Authorized redirect URIs added
- [ ] Environment variables updated
- [ ] Backend can read GOOGLE_CLIENT_ID
- [ ] Frontend redirects to correct backend URL
- [ ] CORS configured correctly
- [ ] Local testing successful
- [ ] Production URLs updated in Google Cloud Console
- [ ] HTTPS enabled for production
- [ ] Test users can authenticate
- [ ] Error handling works correctly

---

## 🚀 Next Steps

After completing this setup:

1. Test the complete OAuth flow locally
2. Deploy to staging environment and test
3. Update production environment variables
4. Deploy to production
5. Test OAuth flow in production
6. Monitor for errors in production logs
7. Consider submitting app for Google verification (for public release)

---

**Need Help?**

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for detailed error messages
3. Verify all URLs match exactly
4. Test with a different Google account
5. Clear browser cookies and try again

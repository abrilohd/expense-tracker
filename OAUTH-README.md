# 🔐 Google OAuth Setup - Start Here

## 🚨 Current Error

**Error Message:** "Missing required parameter: client_id"

**What it means:** Your Google OAuth credentials are not configured.

**Time to fix:** 5-10 minutes

---

## 🎯 Quick Start (3 Options)

### Option 1: Automated Setup (Easiest) ⚡

**Windows:**
```bash
setup_oauth.bat
```

**Mac/Linux:**
```bash
./setup_oauth.sh
```

This script will:
- Check your configuration
- Prompt for your Google OAuth credentials
- Update your .env file
- Verify everything is correct

### Option 2: Manual Setup (Recommended) 📖

Follow the step-by-step guide:

1. **Read:** `OAUTH-QUICK-FIX.md`
2. **Follow:** Steps 1-5
3. **Test:** OAuth flow

### Option 3: Complete Documentation 📚

For production deployment or detailed understanding:

1. **Read:** `GOOGLE-OAUTH-SETUP-GUIDE.md` (Complete guide)
2. **Use:** `OAUTH-DEPLOYMENT-CHECKLIST.md` (Before deploying)
3. **Reference:** `OAUTH-SETUP-SUMMARY.md` (Overview)

---

## 📁 Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **OAUTH-QUICK-FIX.md** | Quick 5-minute fix | Fix current error, get OAuth working locally |
| **GOOGLE-OAUTH-SETUP-GUIDE.md** | Complete setup guide | First-time setup, production deployment |
| **OAUTH-DEPLOYMENT-CHECKLIST.md** | Deployment checklist | Before deploying to production |
| **OAUTH-SETUP-SUMMARY.md** | Overview & summary | Understanding the big picture |
| **OAUTH-README.md** | This file | Starting point |

---

## 🛠️ Helper Scripts

| Script | Purpose | How to Run |
|--------|---------|------------|
| `setup_oauth.bat` (Windows) | Automated setup | `setup_oauth.bat` |
| `setup_oauth.sh` (Mac/Linux) | Automated setup | `./setup_oauth.sh` |
| `backend/verify_oauth_config.py` | Verify configuration | `cd backend && python verify_oauth_config.py` |
| `backend/test_oauth_endpoint.py` | Test OAuth endpoint | `cd backend && python test_oauth_endpoint.py` |

---

## 🔧 What You Need

### 1. Google Cloud Console Setup

You need to create OAuth credentials in Google Cloud Console:

**URL:** https://console.cloud.google.com/apis/credentials

**What to create:**
- OAuth 2.0 Client ID (Web application)

**What to configure:**
- Authorized JavaScript origins: `http://localhost:5173`, `http://localhost:8000`
- Authorized redirect URIs: `http://localhost:8000/auth/google/callback`

**What you'll get:**
- Client ID (format: `123456789-xxx.apps.googleusercontent.com`)
- Client Secret (format: `YOUR_GOOGLE_OAUTH_CLIENT_ID`)

### 2. Backend Configuration

Update `backend/.env` with your credentials:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_ID
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Verification Steps

### Step 1: Verify Configuration

```bash
cd backend
python verify_oauth_config.py
```

**Expected output:** All green checkmarks ✅

### Step 2: Test OAuth Endpoint

```bash
cd backend
python test_oauth_endpoint.py
```

**Expected output:** "OAuth endpoint is configured correctly!"

### Step 3: Test Complete Flow

1. Start backend: `cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
2. Start frontend: `cd frontend && npm run dev`
3. Open: http://localhost:5173/login
4. Click: "Continue with Google"
5. **Expected:** Google consent screen appears

---

## 🐛 Troubleshooting

### Error: "Missing required parameter: client_id"

**Cause:** Client ID not set in backend/.env

**Fix:**
1. Open `backend/.env`
2. Set `GOOGLE_CLIENT_ID=your-actual-client-id`
3. Restart backend server

### Error: "redirect_uri_mismatch"

**Cause:** Redirect URI doesn't match Google Cloud Console

**Fix:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth client
3. Add: `http://localhost:8000/auth/google/callback`
4. Save changes

### Error: "Access blocked: Authorization Error"

**Cause:** You're not added as a test user

**Fix:**
1. Go to https://console.cloud.google.com/apis/credentials/consent
2. Scroll to "Test users"
3. Click "ADD USERS"
4. Add your email
5. Save

### Backend not reading .env file

**Cause:** Server not restarted after changing .env

**Fix:**
1. Stop backend (Ctrl+C)
2. Start again: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

---

## 📊 Configuration Checklist

Quick checklist to verify everything is set up:

**Google Cloud Console:**
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized JavaScript origins added
- [ ] Authorized redirect URIs added
- [ ] OAuth consent screen configured
- [ ] Test users added (if not published)

**Backend:**
- [ ] `backend/.env` file exists
- [ ] `GOOGLE_CLIENT_ID` set with actual value
- [ ] `GOOGLE_CLIENT_SECRET` set with actual value
- [ ] `GOOGLE_REDIRECT_URI` correct
- [ ] `FRONTEND_URL` correct
- [ ] Backend server restarted

**Testing:**
- [ ] `verify_oauth_config.py` passes
- [ ] `test_oauth_endpoint.py` passes
- [ ] OAuth flow works from frontend
- [ ] User can authenticate with Google

---

## 🚀 Next Steps

### For Local Development:

1. ✅ Complete the quick fix
2. ✅ Test OAuth flow
3. ✅ Start building features

### For Production Deployment:

1. ✅ Complete local setup first
2. ✅ Read `GOOGLE-OAUTH-SETUP-GUIDE.md`
3. ✅ Follow `OAUTH-DEPLOYMENT-CHECKLIST.md`
4. ✅ Deploy to production

---

## 📞 Need Help?

### Check these in order:

1. **Error messages** - They usually tell you what's wrong
2. **Verification scripts** - Run them to see what's misconfigured
3. **Browser console** - Check for frontend errors (F12)
4. **Backend logs** - Check for detailed error messages
5. **Documentation** - Read the relevant guide

### Common Mistakes:

- ❌ Forgot to restart backend after changing .env
- ❌ URLs don't match exactly (http vs https)
- ❌ Using placeholder values instead of actual credentials
- ❌ Not adding test users in OAuth consent screen
- ❌ Backend not running when testing

---

## 🎓 Understanding OAuth Flow

```
User clicks "Continue with Google"
    ↓
Frontend redirects to Backend /auth/google/login
    ↓
Backend redirects to Google OAuth consent screen
    ↓
User authorizes app on Google
    ↓
Google redirects back to Backend /auth/google/callback
    ↓
Backend exchanges code for access token
    ↓
Backend gets user info from Google
    ↓
Backend creates/updates user in database
    ↓
Backend redirects to Frontend /dashboard with JWT token
    ↓
User is logged in!
```

---

## 🔒 Security Notes

### Development:
- ✅ Use localhost URLs
- ✅ Keep credentials in .env (not committed to Git)
- ✅ Use test users for testing

### Production:
- ✅ Use HTTPS only (never HTTP)
- ✅ Use separate OAuth credentials
- ✅ Generate new SECRET_KEY
- ✅ Remove localhost URLs from Google Console
- ✅ Set up proper CORS
- ✅ Enable monitoring and logging

---

## 📚 Additional Resources

- **Google OAuth Documentation:** https://developers.google.com/identity/protocols/oauth2
- **Google Cloud Console:** https://console.cloud.google.com/
- **OAuth 2.0 Playground:** https://developers.google.com/oauthplayground/

---

## ✨ Quick Command Reference

### Verify Configuration
```bash
cd backend
python verify_oauth_config.py
```

### Test OAuth Endpoint
```bash
cd backend
python test_oauth_endpoint.py
```

### Start Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Generate Secret Key
```bash
openssl rand -hex 32
```

---

## 🎉 Success!

You'll know OAuth is working when:

1. ✅ Verification scripts pass
2. ✅ Clicking "Continue with Google" shows Google's consent screen
3. ✅ After authorizing, you're redirected to dashboard
4. ✅ User data is saved in database
5. ✅ You can log in with multiple Google accounts

---

**Ready to start?** Choose one of the 3 options at the top of this file!

**Questions?** Check the troubleshooting section or read the detailed guides.

**Good luck! 🚀**

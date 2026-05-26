# Production Deployment Checklist - Password Reset Feature

## ✅ Complete Deployment Guide for Vercel + Railway

This guide ensures your password reset functionality works perfectly in production.

---

## 🎯 Overview

The password reset feature requires:
1. **Backend API** (Railway) - Handles token generation and validation
2. **Email Service** (Resend) - Sends password reset emails
3. **Frontend** (Vercel) - User interface for requesting and resetting passwords

---

## 📋 Pre-Deployment Checklist

### ✅ Backend Fixes Applied
- [x] Fixed timezone comparison error in `reset_password` function
- [x] Updated to use `datetime.now(timezone.utc).replace(tzinfo=None)` (non-deprecated)
- [x] Proper naive datetime handling for SQLite compatibility
- [x] Email service gracefully handles missing configuration
- [x] Development mode returns reset token when email not configured
- [x] Production mode sends email via Resend API

### ✅ Code Quality
- [x] All syntax errors fixed
- [x] Proper error handling implemented
- [x] Logging configured (no print statements)
- [x] Security best practices followed

---

## 🚀 Step-by-Step Deployment

### Step 1: Configure Resend Email Service

#### 1.1 Get Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the API key (starts with `re_`)

#### 1.2 Verify Domain (Optional but Recommended)

For production, verify your domain to send emails from your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend
5. Wait for verification (usually 5-10 minutes)
6. Once verified, you can send from `noreply@yourdomain.com`

**Note:** Without domain verification, you can still send emails from `onboarding@resend.dev` (Resend's default)

---

### Step 2: Deploy Backend to Railway

#### 2.1 Prepare Railway Environment Variables

In Railway dashboard, add these environment variables:

```bash
# Application Mode
DEBUG=False

# Database (Railway provides this automatically when you add PostgreSQL)
DATABASE_URL=postgresql://...  # Auto-provided by Railway

# JWT Authentication
SECRET_KEY=<generate-secure-key>  # Generate: openssl rand -hex 32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins (Add your Vercel frontend URLs)
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-landing.vercel.app

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/auth/google/callback
FRONTEND_URL=https://your-app.vercel.app

# Resend Email Configuration (CRITICAL FOR PASSWORD RESET)
RESEND_API_KEY=re_YourResendAPIKey
RESEND_FROM_EMAIL=noreply@yourdomain.com  # Or onboarding@resend.dev
APP_NAME=ExpenseTracker
APP_URL=https://your-app.vercel.app
```

#### 2.2 Generate Secure SECRET_KEY

Run this command locally to generate a secure key:

```bash
openssl rand -hex 32
```

Copy the output and use it as your `SECRET_KEY` in Railway.

#### 2.3 Deploy to Railway

1. Push your code to GitHub
2. In Railway dashboard:
   - Click **New Project**
   - Select **Deploy from GitHub repo**
   - Choose your repository
   - Railway will auto-detect Python and deploy
3. Add PostgreSQL database:
   - Click **New** → **Database** → **PostgreSQL**
   - Railway will automatically set `DATABASE_URL`
4. Set all environment variables from Step 2.1
5. Redeploy if needed

#### 2.4 Verify Backend Deployment

Test your backend API:

```bash
# Check health
curl https://your-backend.railway.app/

# Check API docs
curl https://your-backend.railway.app/docs
```

---

### Step 3: Deploy Frontend to Vercel

#### 3.1 Configure Frontend Environment Variables

In Vercel dashboard, add:

```bash
VITE_API_URL=https://your-backend.railway.app
```

#### 3.2 Deploy to Vercel

1. Push your code to GitHub
2. In Vercel dashboard:
   - Click **New Project**
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`
   - Set **Framework Preset** to `Vite`
   - Add environment variable: `VITE_API_URL`
3. Click **Deploy**

#### 3.3 Update Backend CORS

After Vercel deployment, update Railway environment variables:

```bash
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
APP_URL=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy Railway backend after updating CORS.

---

### Step 4: Test Password Reset Flow

#### 4.1 Test Forgot Password

1. Go to your frontend: `https://your-app.vercel.app/login`
2. Click **Forgot Password?**
3. Enter your email: `israelabebe652@gmail.com`
4. Click **Send Reset Link**
5. Check your email inbox (and spam folder)

#### 4.2 Verify Email Received

You should receive an email with:
- Subject: "Reset Your ExpenseTracker Password"
- Beautiful HTML template with gradient design
- "Reset Password" button
- Link expires in 1 hour

#### 4.3 Test Password Reset

1. Click the **Reset Password** button in email
2. You'll be redirected to: `https://your-app.vercel.app/reset-password?token=...`
3. Enter new password (min 8 chars, must contain number)
4. Confirm password
5. Click **Reset Password**
6. You should see success message
7. Redirected to login page

#### 4.4 Test Login with New Password

1. Go to login page
2. Enter your email
3. Enter the NEW password you just set
4. Click **Login**
5. You should be logged in successfully

---

## 🔍 Troubleshooting

### Issue: Email Not Received

**Check:**
1. Verify `RESEND_API_KEY` is set correctly in Railway
2. Check Resend dashboard for email logs
3. Check spam/junk folder
4. Verify `RESEND_FROM_EMAIL` is valid
5. Check Railway logs: `railway logs`

**Solution:**
```bash
# In Railway, verify these are set:
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev
APP_URL=https://your-app.vercel.app
```

### Issue: "Invalid or expired reset token"

**Check:**
1. Token expires after 1 hour
2. Token can only be used once
3. Check Railway logs for errors

**Solution:**
- Request a new password reset
- Use the link within 1 hour
- Don't refresh the reset page multiple times

### Issue: CORS Error

**Check:**
1. Verify `ALLOWED_ORIGINS` in Railway includes your Vercel URL
2. No spaces after commas in `ALLOWED_ORIGINS`
3. Use HTTPS URLs (not HTTP)

**Solution:**
```bash
# In Railway:
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

### Issue: 500 Internal Server Error

**Check Railway logs:**
```bash
railway logs
```

**Common causes:**
1. Missing environment variables
2. Database connection issues
3. Timezone comparison errors (should be fixed now)

---

## 🧪 Development Mode Testing

For local testing without email configuration:

### Backend (.env)
```bash
DEBUG=True
RESEND_API_KEY=  # Leave empty or remove
APP_URL=http://localhost:5173
```

### Test Flow
1. Request password reset
2. Backend returns reset token in API response
3. Frontend shows yellow "Development Mode" box
4. Click "Reset Password Now" button
5. Reset password using the token

---

## 📊 Monitoring

### Check Email Delivery

1. Go to [Resend Dashboard](https://resend.com/emails)
2. View all sent emails
3. Check delivery status
4. View email content

### Check Backend Logs

```bash
# Railway CLI
railway logs

# Or in Railway dashboard:
# Project → Deployments → View Logs
```

### Check Frontend Logs

```bash
# Vercel CLI
vercel logs

# Or in Vercel dashboard:
# Project → Deployments → View Function Logs
```

---

## ✅ Final Verification Checklist

### Backend (Railway)
- [ ] All environment variables set
- [ ] `DEBUG=False` in production
- [ ] `RESEND_API_KEY` configured
- [ ] `APP_URL` points to Vercel frontend
- [ ] `ALLOWED_ORIGINS` includes Vercel URLs
- [ ] PostgreSQL database connected
- [ ] Backend API accessible
- [ ] `/docs` endpoint works

### Frontend (Vercel)
- [ ] `VITE_API_URL` points to Railway backend
- [ ] Frontend loads successfully
- [ ] Login page accessible
- [ ] Forgot password link works

### Email Service (Resend)
- [ ] API key valid and active
- [ ] Domain verified (optional)
- [ ] Email sending quota available
- [ ] Test email received successfully

### Password Reset Flow
- [ ] Can request password reset
- [ ] Email received within 1 minute
- [ ] Email template looks professional
- [ ] Reset link works
- [ ] Can set new password
- [ ] Can login with new password
- [ ] Old password no longer works
- [ ] Token expires after 1 hour
- [ ] Token can only be used once

---

## 🎉 Success Criteria

Your password reset is working correctly when:

1. ✅ User clicks "Forgot Password?" on login page
2. ✅ User enters email and submits
3. ✅ User receives professional email within 1 minute
4. ✅ User clicks "Reset Password" button in email
5. ✅ User is redirected to reset password page with token
6. ✅ User enters new password and confirms
7. ✅ Password is reset successfully
8. ✅ User can login with new password
9. ✅ Old password no longer works
10. ✅ Reset link expires after 1 hour

---

## 📞 Support

If you encounter issues:

1. Check Railway logs: `railway logs`
2. Check Vercel logs: `vercel logs`
3. Check Resend dashboard for email delivery status
4. Review this checklist again
5. Check `backend/app/routes/auth.py` for any errors

---

## 🔐 Security Notes

1. **Never commit `.env` files** - They contain secrets
2. **Use strong SECRET_KEY** - Generate with `openssl rand -hex 32`
3. **Set DEBUG=False in production** - Prevents exposing sensitive info
4. **Use HTTPS only** - Never use HTTP in production
5. **Rotate API keys regularly** - Update Resend API key periodically
6. **Monitor email logs** - Check for suspicious activity
7. **Rate limit password resets** - Prevent abuse (consider adding)

---

## 📝 Environment Variables Reference

### Required for Password Reset

| Variable | Example | Description |
|----------|---------|-------------|
| `DEBUG` | `False` | Set to False in production |
| `RESEND_API_KEY` | `re_abc123...` | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | `noreply@yourdomain.com` | Sender email address |
| `APP_NAME` | `ExpenseTracker` | Application name in emails |
| `APP_URL` | `https://your-app.vercel.app` | Frontend URL for reset links |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | CORS allowed origins |

### Optional but Recommended

| Variable | Example | Description |
|----------|---------|-------------|
| `SECRET_KEY` | `abc123...` | JWT secret (generate securely) |
| `DATABASE_URL` | `postgresql://...` | Database connection string |
| `GOOGLE_CLIENT_ID` | `123-abc.apps.googleusercontent.com` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | Google OAuth client secret |

---

## 🎯 Quick Commands

### Generate SECRET_KEY
```bash
openssl rand -hex 32
```

### Test Backend Locally
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

### Test Frontend Locally
```bash
cd frontend
npm run dev
```

### Deploy to Railway
```bash
git push origin main
# Railway auto-deploys on push
```

### Deploy to Vercel
```bash
cd frontend
vercel --prod
```

---

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Router Documentation](https://reactrouter.com)

---

**Last Updated:** May 25, 2026
**Status:** ✅ Ready for Production Deployment

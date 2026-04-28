# Google OAuth Deployment Checklist

Complete this checklist before deploying your application with Google OAuth.

---

## 📋 Pre-Deployment Checklist

### 1. Google Cloud Console Setup

#### OAuth 2.0 Client Configuration

- [ ] **Created OAuth 2.0 Client ID**
  - Go to: https://console.cloud.google.com/apis/credentials
  - Application type: Web application
  - Name: ExpenseTracker Web Client

- [ ] **Configured Authorized JavaScript Origins**
  
  **For Development:**
  - [ ] `http://localhost:5173`
  - [ ] `http://localhost:8000`
  - [ ] `http://127.0.0.1:5173`
  - [ ] `http://127.0.0.1:8000`
  
  **For Production:**
  - [ ] `https://yourdomain.com`
  - [ ] `https://api.yourdomain.com`
  - [ ] Remove all localhost URLs before going live

- [ ] **Configured Authorized Redirect URIs**
  
  **For Development:**
  - [ ] `http://localhost:8000/auth/google/callback`
  - [ ] `http://127.0.0.1:8000/auth/google/callback`
  
  **For Production:**
  - [ ] `https://api.yourdomain.com/auth/google/callback`
  - [ ] Remove all localhost URLs before going live

#### OAuth Consent Screen

- [ ] **Configured OAuth Consent Screen**
  - User type: External
  - App name: ExpenseTracker
  - User support email: Set
  - Developer contact email: Set

- [ ] **App Domain Configuration**
  - [ ] Application home page: `https://yourdomain.com`
  - [ ] Privacy policy link: `https://yourdomain.com/privacy`
  - [ ] Terms of service link: `https://yourdomain.com/terms`
  - [ ] Authorized domains: `yourdomain.com`

- [ ] **Scopes Configured**
  - [ ] `openid`
  - [ ] `email`
  - [ ] `profile`

- [ ] **Test Users Added** (if not published)
  - [ ] Added your email
  - [ ] Added test user emails

#### API Enablement

- [ ] **Enabled Required APIs**
  - [ ] Google+ API
  - [ ] Google OAuth2 API

---

### 2. Backend Configuration

#### Environment Variables - Development

- [ ] **Created `backend/.env` file**
- [ ] **Set Database Configuration**
  ```env
  DATABASE_URL=sqlite:///./expenses.db
  ```

- [ ] **Set JWT Configuration**
  ```env
  SECRET_KEY=<generated-secret-key>
  ALGORITHM=HS256
  ACCESS_TOKEN_EXPIRE_MINUTES=30
  ```
  - [ ] Generated secure SECRET_KEY: `openssl rand -hex 32`

- [ ] **Set Google OAuth Configuration**
  ```env
  GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=GOCSPX-<your-secret>
  GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
  FRONTEND_URL=http://localhost:5173
  ```

#### Environment Variables - Production

- [ ] **Created `backend/.env.production` file**
- [ ] **Set Production Database**
  ```env
  DATABASE_URL=postgresql://user:pass@host:5432/db
  ```

- [ ] **Generated NEW Production SECRET_KEY**
  ```env
  SECRET_KEY=<new-production-secret>
  ```
  - [ ] Different from development key
  - [ ] At least 32 characters
  - [ ] Stored securely

- [ ] **Set Production Google OAuth**
  ```env
  GOOGLE_CLIENT_ID=<production-client-id>
  GOOGLE_CLIENT_SECRET=<production-secret>
  GOOGLE_REDIRECT_URI=https://api.yourdomain.com/auth/google/callback
  FRONTEND_URL=https://yourdomain.com
  ```

#### CORS Configuration

- [ ] **Updated `backend/app/core/config.py`**
  ```python
  cors_origins: list = [
      "https://yourdomain.com",
      # Remove localhost URLs for production
  ]
  ```

#### Security

- [ ] **Added `.env` to `.gitignore`**
- [ ] **Never committed credentials to Git**
- [ ] **Used different credentials for dev/prod**
- [ ] **Stored production secrets securely**

---

### 3. Frontend Configuration

#### Environment Variables - Development

- [ ] **Created `frontend/.env` file**
  ```env
  VITE_APP_URL=http://localhost:5173
  VITE_API_URL=http://localhost:8000
  VITE_LANDING_URL=http://localhost:8080
  ```

#### Environment Variables - Production

- [ ] **Created `frontend/.env.production` file**
  ```env
  VITE_APP_URL=https://yourdomain.com
  VITE_API_URL=https://api.yourdomain.com
  VITE_LANDING_URL=https://yourdomain.com
  ```

#### OAuth Integration

- [ ] **Verified OAuth button redirects to correct backend URL**
  - Check `frontend/src/pages/Login.tsx`
  - Should use `VITE_API_URL` environment variable

---

### 4. Testing

#### Local Testing

- [ ] **Ran configuration verification**
  ```bash
  cd backend
  python verify_oauth_config.py
  ```

- [ ] **Tested OAuth endpoint**
  ```bash
  cd backend
  python test_oauth_endpoint.py
  ```

- [ ] **Started backend successfully**
  ```bash
  cd backend
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```

- [ ] **Started frontend successfully**
  ```bash
  cd frontend
  npm run dev
  ```

- [ ] **Tested complete OAuth flow**
  - [ ] Navigated to http://localhost:5173/login
  - [ ] Clicked "Continue with Google"
  - [ ] Saw Google consent screen
  - [ ] Successfully authenticated
  - [ ] Redirected back to dashboard
  - [ ] User data saved in database

- [ ] **Tested with multiple Google accounts**
- [ ] **Tested error scenarios**
  - [ ] Denied consent
  - [ ] Invalid credentials
  - [ ] Network errors

#### Staging Testing (if applicable)

- [ ] **Deployed to staging environment**
- [ ] **Updated staging OAuth credentials**
- [ ] **Tested complete OAuth flow on staging**
- [ ] **Verified HTTPS works correctly**
- [ ] **Tested from different devices/browsers**

---

### 5. Production Deployment

#### Pre-Deployment

- [ ] **SSL/TLS Certificate Installed**
  - [ ] HTTPS enabled for frontend
  - [ ] HTTPS enabled for backend API
  - [ ] Valid certificate (not self-signed)

- [ ] **DNS Configuration**
  - [ ] Frontend domain points to frontend server
  - [ ] API subdomain points to backend server
  - [ ] DNS propagated (check with `nslookup`)

- [ ] **Environment Variables Set**
  - [ ] Production .env files deployed
  - [ ] Secrets stored securely (not in code)
  - [ ] Environment-specific values correct

- [ ] **Database Setup**
  - [ ] Production database created
  - [ ] Database migrations run
  - [ ] Database backups configured

#### Google Cloud Console Updates

- [ ] **Updated OAuth Client for Production**
  - [ ] Added production JavaScript origins
  - [ ] Added production redirect URIs
  - [ ] Removed development URLs
  - [ ] Saved changes

- [ ] **Updated OAuth Consent Screen**
  - [ ] Updated home page URL
  - [ ] Updated privacy policy URL
  - [ ] Updated terms of service URL
  - [ ] Updated authorized domains

- [ ] **Verified API Quotas**
  - [ ] Checked OAuth API quotas
  - [ ] Increased if necessary

#### Deployment

- [ ] **Deployed Backend**
  - [ ] Code deployed to production server
  - [ ] Dependencies installed
  - [ ] Environment variables set
  - [ ] Service started and running
  - [ ] Health check endpoint responding

- [ ] **Deployed Frontend**
  - [ ] Code built for production
  - [ ] Static files deployed
  - [ ] Environment variables baked in
  - [ ] Service started and running

#### Post-Deployment Testing

- [ ] **Tested Production OAuth Flow**
  - [ ] Navigated to production login page
  - [ ] Clicked "Continue with Google"
  - [ ] Saw Google consent screen
  - [ ] Successfully authenticated
  - [ ] Redirected back to dashboard
  - [ ] User data saved correctly

- [ ] **Tested from Multiple Browsers**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] **Tested from Multiple Devices**
  - [ ] Desktop
  - [ ] Mobile
  - [ ] Tablet

- [ ] **Verified HTTPS**
  - [ ] No mixed content warnings
  - [ ] Valid SSL certificate
  - [ ] Secure cookies working

- [ ] **Checked Error Handling**
  - [ ] Denied consent handled gracefully
  - [ ] Network errors handled
  - [ ] Invalid tokens handled

#### Monitoring

- [ ] **Set Up Logging**
  - [ ] Backend logs OAuth events
  - [ ] Frontend logs OAuth errors
  - [ ] Logs stored securely

- [ ] **Set Up Monitoring**
  - [ ] OAuth success rate tracked
  - [ ] OAuth errors alerted
  - [ ] API response times monitored

- [ ] **Set Up Alerts**
  - [ ] High error rate alerts
  - [ ] Service down alerts
  - [ ] SSL expiry alerts

---

### 6. Documentation

- [ ] **Created Privacy Policy**
  - [ ] Explains data collection
  - [ ] Explains Google OAuth usage
  - [ ] Published at /privacy

- [ ] **Created Terms of Service**
  - [ ] Defines usage terms
  - [ ] Published at /terms

- [ ] **Updated README**
  - [ ] OAuth setup instructions
  - [ ] Deployment instructions
  - [ ] Troubleshooting guide

- [ ] **Created Runbook**
  - [ ] OAuth troubleshooting steps
  - [ ] Common error solutions
  - [ ] Emergency contacts

---

### 7. Security Review

- [ ] **Reviewed Security Practices**
  - [ ] Secrets not in code
  - [ ] HTTPS enforced
  - [ ] CORS properly configured
  - [ ] JWT tokens secure
  - [ ] Password hashing secure

- [ ] **Reviewed OAuth Scopes**
  - [ ] Only requesting necessary scopes
  - [ ] Not requesting sensitive permissions

- [ ] **Reviewed Data Handling**
  - [ ] User data encrypted at rest
  - [ ] User data encrypted in transit
  - [ ] PII handled properly

- [ ] **Reviewed Access Controls**
  - [ ] API endpoints protected
  - [ ] User data isolated
  - [ ] Admin access restricted

---

### 8. Compliance (if applicable)

- [ ] **GDPR Compliance** (if serving EU users)
  - [ ] Privacy policy compliant
  - [ ] User consent obtained
  - [ ] Data deletion process

- [ ] **CCPA Compliance** (if serving California users)
  - [ ] Privacy policy compliant
  - [ ] User rights documented

- [ ] **Google OAuth Policies**
  - [ ] Followed Google's branding guidelines
  - [ ] Followed Google's OAuth policies
  - [ ] App verification submitted (if needed)

---

### 9. App Verification (for public apps)

- [ ] **Prepared for Google Verification**
  - [ ] App fully functional
  - [ ] Privacy policy published
  - [ ] Terms of service published
  - [ ] OAuth consent screen complete

- [ ] **Submitted for Verification** (if needed)
  - [ ] Submitted verification request
  - [ ] Provided required documentation
  - [ ] Responded to Google's questions

- [ ] **Verification Approved**
  - [ ] Received approval from Google
  - [ ] Removed "unverified app" warning

---

### 10. Launch

- [ ] **Final Pre-Launch Check**
  - [ ] All tests passing
  - [ ] All monitoring active
  - [ ] All documentation complete
  - [ ] Team trained on troubleshooting

- [ ] **Launched to Production**
  - [ ] Announced to users
  - [ ] Monitoring for issues
  - [ ] Ready to respond to problems

- [ ] **Post-Launch Monitoring**
  - [ ] Watched logs for errors
  - [ ] Monitored OAuth success rate
  - [ ] Responded to user feedback

---

## 🎉 Congratulations!

If you've completed all items, your Google OAuth is ready for production!

---

## 📞 Support Resources

- **Google OAuth Documentation**: https://developers.google.com/identity/protocols/oauth2
- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth Troubleshooting**: See `OAUTH-QUICK-FIX.md`
- **Complete Setup Guide**: See `GOOGLE-OAUTH-SETUP-GUIDE.md`

---

## 🔄 Regular Maintenance

### Monthly

- [ ] Review OAuth logs for errors
- [ ] Check API quota usage
- [ ] Verify SSL certificate expiry

### Quarterly

- [ ] Rotate SECRET_KEY
- [ ] Review and update dependencies
- [ ] Review security practices

### Annually

- [ ] Regenerate OAuth credentials
- [ ] Review and update privacy policy
- [ ] Review and update terms of service

---

**Last Updated:** {{ current_date }}
**Version:** 1.0.0

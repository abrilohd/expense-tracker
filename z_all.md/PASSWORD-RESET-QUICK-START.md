# 🚀 PASSWORD RESET - QUICK START GUIDE

## ⚡ 3-Minute Setup

### Step 1: Install Dependencies (30 seconds)

```bash
cd backend
pip install resend
```

### Step 2: Verify Configuration (10 seconds)

Your `.env` file already has the Resend API key:

```env
RESEND_API_KEY=re_ex12R4Uv_2uQorZ9UUXiv4H2nbxabYQ6t
RESEND_FROM_EMAIL=onboarding@resend.dev
APP_NAME=ExpenseTracker
APP_URL=http://localhost:5173
```

✅ **No changes needed!**

### Step 3: Test Email Service (1 minute)

```bash
cd backend
python test_email.py
```

**Expected output:**
```
✅ SUCCESS! Email sent successfully
📬 Email ID: xxxxx-xxxxx-xxxxx
💡 Check your inbox at: abrsh067@gmail.com
```

**Check your email** (abrsh067@gmail.com) - you should receive:
1. Password reset email with beautiful design
2. Welcome email

### Step 4: Start Servers (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Test Full Flow (1 minute)

1. Open http://localhost:5173/login
2. Click **"Forgot password?"**
3. Enter: `abrsh067@gmail.com`
4. Click **"Send Reset Link"**
5. Check your email inbox
6. Click the reset link in email
7. Enter new password (min 8 chars, must have number)
8. Click **"Reset Password"**
9. Login with new password ✅

---

## 🎯 What Was Implemented

### Backend Files Created/Updated:
- ✅ `backend/app/services/email_service.py` - Email service with Resend
- ✅ `backend/app/routes/auth.py` - Updated with email sending
- ✅ `backend/requirements.txt` - Added `resend>=2.0.0`
- ✅ `backend/.env` - Added Resend configuration
- ✅ `backend/test_email.py` - Test script

### Frontend Files Updated:
- ✅ `frontend/src/pages/ForgotPassword.tsx` - Cleaned up UI
- ✅ `frontend/src/pages/ResetPassword.tsx` - Already working
- ✅ `frontend/src/App.tsx` - Added routes

### Features:
- ✅ Beautiful HTML email templates
- ✅ Secure token generation (256-bit)
- ✅ 1-hour token expiration
- ✅ Email enumeration protection
- ✅ OAuth account protection
- ✅ Password validation
- ✅ One-time use tokens

---

## 📧 Email Preview

**Subject:** Reset Your ExpenseTracker Password

**Design:**
- Gradient header (teal → purple → pink)
- 🔐 Lock icon + branding
- Personalized greeting
- Big "Reset Password" button
- Plain text link for copy/paste
- Expiration warning (1 hour)
- Professional footer

---

## 🚀 Deploy to Production

### Railway (Backend)

1. Add environment variables in Railway dashboard:
   ```
   RESEND_API_KEY=re_ex12R4Uv_2uQorZ9UUXiv4H2nbxabYQ6t
   RESEND_FROM_EMAIL=onboarding@resend.dev
   APP_NAME=ExpenseTracker
   APP_URL=https://expense-tracker-app-tau-rust.vercel.app
   ```

2. Deploy:
   ```bash
   git add .
   git commit -m "Add password reset with Resend"
   git push
   ```

### Vercel (Frontend)

Already configured! Just push:
```bash
cd frontend
git add .
git commit -m "Update password reset pages"
git push
```

---

## ✅ Testing Checklist

- [ ] Run `python test_email.py` - both emails received
- [ ] Start backend and frontend servers
- [ ] Navigate to `/forgot-password`
- [ ] Enter email and submit
- [ ] Receive email within 30 seconds
- [ ] Click reset link in email
- [ ] Reset password successfully
- [ ] Login with new password

---

## 🐛 Troubleshooting

### Email not received?

1. **Check spam folder** 📱
2. **Check Resend dashboard:** https://resend.com/emails
3. **Verify API key in `.env`**
4. **Run test script:** `python test_email.py`

### 404 on forgot-password?

1. **Hard refresh:** Ctrl + Shift + R
2. **Clear Vite cache:** `rm -rf node_modules/.vite`
3. **Restart dev server**

### Token invalid/expired?

1. **Request new reset link** (tokens expire after 1 hour)
2. **Check database:** Token should exist and not be expired

---

## 📊 Monitor Emails

**Resend Dashboard:** https://resend.com/emails

See:
- Sent emails
- Delivery status
- Open rates
- Bounce rates

---

## 🎉 You're Done!

Password reset is now **fully functional** with:
- ✅ Beautiful emails via Resend
- ✅ Secure token system
- ✅ Complete frontend flow
- ✅ Ready for production

**Test it now:** http://localhost:5173/forgot-password

---

**Need help?** Check `PASSWORD-RESET-COMPLETE-GUIDE.md` for detailed documentation.

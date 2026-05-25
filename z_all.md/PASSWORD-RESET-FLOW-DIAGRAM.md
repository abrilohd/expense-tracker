# 🔄 PASSWORD RESET FLOW - VISUAL DIAGRAM

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PASSWORD RESET SYSTEM                        │
│                    (Local + Production Ready)                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   FRONTEND   │         │   BACKEND    │         │   RESEND     │
│  (React TS)  │         │  (FastAPI)   │         │  (Email API) │
└──────────────┘         └──────────────┘         └──────────────┘
```

---

## 📱 USER FLOW

### Step 1: Request Password Reset

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER CLICKS "FORGOT PASSWORD?" ON LOGIN PAGE                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. REDIRECTED TO /forgot-password                               │
│    - Clean UI with email input                                  │
│    - "Send Reset Link" button                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. USER ENTERS EMAIL: abrsh067@gmail.com                        │
│    - Frontend validates email format                            │
│    - Shows loading spinner                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. FRONTEND SENDS REQUEST                                       │
│    POST /auth/forgot-password                                   │
│    { "email": "abrsh067@gmail.com" }                            │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Backend Processing

```
┌─────────────────────────────────────────────────────────────────┐
│ 5. BACKEND RECEIVES REQUEST                                     │
│    - Validates email format                                     │
│    - Searches database for user                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. USER FOUND IN DATABASE                                       │
│    - Check if OAuth user (Google) → Error if yes               │
│    - Generate secure token: secrets.token_urlsafe(32)          │
│    - Token: "abc123...xyz789" (256-bit)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. SAVE TOKEN TO DATABASE                                       │
│    user.reset_token = "abc123...xyz789"                        │
│    user.reset_token_expires = now + 1 hour                     │
│    db.commit()                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. CALL EMAIL SERVICE                                           │
│    EmailService.send_password_reset_email(                      │
│        to_email="abrsh067@gmail.com",                           │
│        reset_token="abc123...xyz789",                           │
│        user_name="Test User"                                    │
│    )                                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3: Email Sending

```
┌─────────────────────────────────────────────────────────────────┐
│ 9. EMAIL SERVICE PREPARES EMAIL                                 │
│    - Build reset URL:                                           │
│      http://localhost:5173/reset-password?token=abc123...xyz789 │
│    - Generate HTML template (gradient design)                   │
│    - Generate plain text version                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. SEND VIA RESEND API                                         │
│     resend.Emails.send({                                        │
│         from: "onboarding@resend.dev",                          │
│         to: "abrsh067@gmail.com",                               │
│         subject: "Reset Your ExpenseTracker Password",          │
│         html: <beautiful_template>                              │
│     })                                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. RESEND DELIVERS EMAIL                                       │
│     - Email sent within seconds                                 │
│     - Delivered to inbox (or spam)                              │
│     - Tracking ID returned                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 12. BACKEND RETURNS SUCCESS                                     │
│     { "message": "If the email exists, a reset link was sent" } │
│     (Always success to prevent email enumeration)               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 13. FRONTEND SHOWS SUCCESS STATE                                │
│     ✅ Check Your Email                                         │
│     "We've sent instructions to abrsh067@gmail.com"             │
│     - "Back to Login" button                                    │
│     - "Send Another Email" button                               │
└─────────────────────────────────────────────────────────────────┘
```

### Step 4: User Receives Email

```
┌─────────────────────────────────────────────────────────────────┐
│ 14. USER CHECKS EMAIL INBOX                                     │
│     📧 From: onboarding@resend.dev                              │
│     📬 Subject: Reset Your ExpenseTracker Password              │
│                                                                 │
│     ┌───────────────────────────────────────────────────────┐  │
│     │ 🔐 ExpenseTracker                                     │  │
│     │ (Gradient header: teal → purple → pink)              │  │
│     ├───────────────────────────────────────────────────────┤  │
│     │                                                       │  │
│     │ Reset Your Password                                   │  │
│     │                                                       │  │
│     │ Hi Test User,                                         │  │
│     │                                                       │  │
│     │ We received a request to reset your password.        │  │
│     │                                                       │  │
│     │ ┌─────────────────────────────────────────────────┐  │  │
│     │ │      🔘 Reset Password (Big Button)            │  │  │
│     │ └─────────────────────────────────────────────────┘  │  │
│     │                                                       │  │
│     │ Or copy this link:                                    │  │
│     │ http://localhost:5173/reset-password?token=abc123... │  │
│     │                                                       │  │
│     │ ⏰ This link expires in 1 hour                        │  │
│     │                                                       │  │
│     │ If you didn't request this, ignore this email.       │  │
│     └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 5: Reset Password

```
┌─────────────────────────────────────────────────────────────────┐
│ 15. USER CLICKS "RESET PASSWORD" BUTTON IN EMAIL                │
│     - Opens browser                                             │
│     - Navigates to reset URL with token                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 16. REDIRECTED TO /reset-password?token=abc123...xyz789         │
│     - Token extracted from URL parameter                        │
│     - Token pre-filled in form                                  │
│     - Shows password input fields                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 17. USER ENTERS NEW PASSWORD                                    │
│     New Password: ••••••••••                                    │
│     Confirm Password: ••••••••••                                │
│     - Frontend validates:                                       │
│       ✓ Min 8 characters                                        │
│       ✓ Contains number                                         │
│       ✓ Passwords match                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 18. USER CLICKS "RESET PASSWORD"                                │
│     POST /auth/reset-password                                   │
│     {                                                           │
│         "token": "abc123...xyz789",                             │
│         "new_password": "NewPassword123"                        │
│     }                                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 19. BACKEND VALIDATES TOKEN                                     │
│     - Find user by reset_token                                  │
│     - Check token exists                                        │
│     - Check token not expired (< 1 hour old)                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 20. BACKEND UPDATES PASSWORD                                    │
│     user.hashed_password = hash_password("NewPassword123")      │
│     user.reset_token = None  # Clear token                      │
│     user.reset_token_expires = None                             │
│     db.commit()                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 21. BACKEND RETURNS SUCCESS                                     │
│     { "message": "Password reset successfully" }                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 22. FRONTEND SHOWS SUCCESS STATE                                │
│     ✅ Password Reset Successful!                               │
│     "Your password has been reset. Redirecting to login..."     │
│     - Auto-redirect after 2 seconds                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 23. REDIRECTED TO /login                                        │
│     - User enters email                                         │
│     - User enters NEW password                                  │
│     - Clicks "Sign In"                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 24. LOGIN SUCCESSFUL ✅                                         │
│     - JWT token generated                                       │
│     - Redirected to dashboard                                   │
│     - User is logged in                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 SECURITY FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY MEASURES                           │
└─────────────────────────────────────────────────────────────────┘

1. TOKEN GENERATION
   ┌──────────────────────────────────────────────────────────┐
   │ secrets.token_urlsafe(32)                                │
   │ → 256-bit cryptographically secure random token          │
   │ → Example: "abc123def456ghi789jkl012mno345pqr678"        │
   └──────────────────────────────────────────────────────────┘

2. TOKEN STORAGE
   ┌──────────────────────────────────────────────────────────┐
   │ Database: users table                                    │
   │ - reset_token: "abc123..."                               │
   │ - reset_token_expires: 2026-05-23 12:00:00 UTC          │
   │ → Token stored in plain text (safe, one-time use)        │
   └──────────────────────────────────────────────────────────┘

3. TOKEN EXPIRATION
   ┌──────────────────────────────────────────────────────────┐
   │ Expires: 1 hour after generation                         │
   │ Check: reset_token_expires > datetime.now(timezone.utc)  │
   │ → Expired tokens rejected                                │
   └──────────────────────────────────────────────────────────┘

4. EMAIL ENUMERATION PROTECTION
   ┌──────────────────────────────────────────────────────────┐
   │ Always return: "If email exists, link was sent"          │
   │ → Doesn't reveal if email exists in database             │
   │ → Prevents attackers from discovering valid emails       │
   └──────────────────────────────────────────────────────────┘

5. OAUTH PROTECTION
   ┌──────────────────────────────────────────────────────────┐
   │ Check: user.provider == "local"                          │
   │ → Google OAuth users cannot reset password              │
   │ → Clear error message shown                              │
   └──────────────────────────────────────────────────────────┘

6. PASSWORD VALIDATION
   ┌──────────────────────────────────────────────────────────┐
   │ Frontend:                                                │
   │ - Min 8 characters                                       │
   │ - Must contain number                                    │
   │ - Passwords must match                                   │
   │                                                          │
   │ Backend:                                                 │
   │ - Hashed with bcrypt                                     │
   │ - Salt automatically generated                           │
   └──────────────────────────────────────────────────────────┘

7. ONE-TIME USE
   ┌──────────────────────────────────────────────────────────┐
   │ After successful reset:                                  │
   │ - reset_token = None                                     │
   │ - reset_token_expires = None                             │
   │ → Token cannot be reused                                 │
   └──────────────────────────────────────────────────────────┘
```

---

## 🎨 EMAIL TEMPLATE STRUCTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                      EMAIL TEMPLATE                              │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ HEADER (Gradient Background)                                  │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ background: linear-gradient(135deg,                     │   │
│ │   #00F5C4 0%, #7B61FF 50%, #FF6B9D 100%)               │   │
│ │                                                         │   │
│ │              🔐 ExpenseTracker                          │   │
│ │           (White text, 32px, bold)                      │   │
│ └─────────────────────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────────┤
│ CONTENT (White Background)                                     │
│                                                                │
│ Reset Your Password                                            │
│ (24px, bold, dark text)                                        │
│                                                                │
│ Hi Test User,                                                  │
│ (16px, personalized greeting)                                  │
│                                                                │
│ We received a request to reset your password for your          │
│ ExpenseTracker account. Click the button below to create       │
│ a new password:                                                │
│ (16px, gray text, line-height 1.6)                             │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │                                                         │   │
│ │         🔘 Reset Password (Big Button)                  │   │
│ │         (Gradient background, white text)               │   │
│ │         (Centered, rounded, shadow)                     │   │
│ │                                                         │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ Or copy and paste this link into your browser:                 │
│ (14px, gray text)                                              │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ http://localhost:5173/reset-password?token=abc123...    │   │
│ │ (Monospace font, light gray background, small text)     │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ ─────────────────────────────────────────────────────────────  │
│                                                                │
│ ⏰ This link will expire in 1 hour                             │
│ (14px, bold, gray text)                                        │
│                                                                │
│ If you didn't request a password reset, you can safely         │
│ ignore this email. Your password will remain unchanged.        │
│ (14px, gray text)                                              │
│                                                                │
├───────────────────────────────────────────────────────────────┤
│ FOOTER (Light Gray Background)                                │
│                                                                │
│ This email was sent by ExpenseTracker                          │
│ © 2026 ExpenseTracker. All rights reserved.                   │
│ (13px, light gray text, centered)                              │
└───────────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                      USERS TABLE                                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────┬─────────────────────────┐
│ Column               │ Type         │ Description             │
├──────────────────────┼──────────────┼─────────────────────────┤
│ id                   │ INTEGER      │ Primary key             │
│ email                │ STRING       │ User email (unique)     │
│ hashed_password      │ STRING       │ Bcrypt hashed password  │
│ name                 │ STRING       │ User full name          │
│ provider             │ STRING       │ "local" or "google"     │
│ reset_token          │ STRING       │ Password reset token    │
│ reset_token_expires  │ DATETIME     │ Token expiration time   │
│ is_active            │ BOOLEAN      │ Account active status   │
│ created_at           │ DATETIME     │ Account creation time   │
└──────────────────────┴──────────────┴─────────────────────────┘

EXAMPLE ROW (Before Reset):
┌────┬─────────────────────┬──────────────┬───────┬────────┬─────────────┬─────────────────────┐
│ id │ email               │ hashed_pwd   │ name  │ prov   │ reset_token │ reset_token_expires │
├────┼─────────────────────┼──────────────┼───────┼────────┼─────────────┼─────────────────────┤
│ 1  │ abrsh067@gmail.com  │ $2b$12$...   │ Test  │ local  │ NULL        │ NULL                │
└────┴─────────────────────┴──────────────┴───────┴────────┴─────────────┴─────────────────────┘

EXAMPLE ROW (After Forgot Password):
┌────┬─────────────────────┬──────────────┬───────┬────────┬─────────────┬─────────────────────┐
│ id │ email               │ hashed_pwd   │ name  │ prov   │ reset_token │ reset_token_expires │
├────┼─────────────────────┼──────────────┼───────┼────────┼─────────────┼─────────────────────┤
│ 1  │ abrsh067@gmail.com  │ $2b$12$...   │ Test  │ local  │ abc123...   │ 2026-05-23 12:00:00 │
└────┴─────────────────────┴──────────────┴───────┴────────┴─────────────┴─────────────────────┘

EXAMPLE ROW (After Reset Password):
┌────┬─────────────────────┬──────────────┬───────┬────────┬─────────────┬─────────────────────┐
│ id │ email               │ hashed_pwd   │ name  │ prov   │ reset_token │ reset_token_expires │
├────┼─────────────────────┼──────────────┼───────┼────────┼─────────────┼─────────────────────┤
│ 1  │ abrsh067@gmail.com  │ $2b$12$NEW   │ Test  │ local  │ NULL        │ NULL                │
└────┴─────────────────────┴──────────────┴───────┴────────┴─────────────┴─────────────────────┘
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          VERCEL (Frontend)                        │
│  https://expense-tracker-app-tau-rust.vercel.app                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ React App                                                  │  │
│  │ - /login                                                   │  │
│  │ - /forgot-password                                         │  │
│  │ - /reset-password                                          │  │
│  │ - /dashboard                                               │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓ API Calls
┌──────────────────────────────────────────────────────────────────┐
│                         RAILWAY (Backend)                         │
│  https://expense-tracker-production-419e.up.railway.app          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ FastAPI App                                                │  │
│  │ - POST /auth/forgot-password                               │  │
│  │ - POST /auth/reset-password                                │  │
│  │ - POST /auth/login                                         │  │
│  │ - GET /auth/me                                             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database                                        │  │
│  │ - users table                                              │  │
│  │ - expenses table                                           │  │
│  │ - budgets table                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓ Email API
┌──────────────────────────────────────────────────────────────────┐
│                         RESEND (Email Service)                    │
│  https://resend.com                                               │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Email Delivery                                             │  │
│  │ - Send password reset emails                               │  │
│  │ - Send welcome emails                                      │  │
│  │ - Track delivery status                                    │  │
│  │ - Monitor open rates                                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↓ Email Delivery
┌──────────────────────────────────────────────────────────────────┐
│                         USER EMAIL INBOX                          │
│  abrsh067@gmail.com                                               │
│                                                                   │
│  📧 Password Reset Email                                          │
│  🔗 Reset Link with Token                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✅ COMPLETE SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM COMPONENTS                             │
└─────────────────────────────────────────────────────────────────┘

FRONTEND (React + TypeScript)
├── Pages
│   ├── Login.tsx ✅
│   ├── ForgotPassword.tsx ✅
│   └── ResetPassword.tsx ✅
├── API Functions
│   ├── forgotPassword() ✅
│   └── resetPassword() ✅
└── Routes
    ├── /login ✅
    ├── /forgot-password ✅
    └── /reset-password ✅

BACKEND (FastAPI + Python)
├── Routes
│   ├── POST /auth/forgot-password ✅
│   └── POST /auth/reset-password ✅
├── Services
│   └── email_service.py ✅
│       ├── send_password_reset_email() ✅
│       └── send_welcome_email() ✅
├── Models
│   └── user.py ✅
│       ├── reset_token ✅
│       └── reset_token_expires ✅
└── Security
    └── security.py ✅
        └── generate_reset_token() ✅

EMAIL SERVICE (Resend)
├── API Integration ✅
├── HTML Templates ✅
├── Delivery Tracking ✅
└── Error Handling ✅

DATABASE (SQLite / PostgreSQL)
└── users table ✅
    ├── reset_token ✅
    └── reset_token_expires ✅

DOCUMENTATION
├── PASSWORD-RESET-QUICK-START.md ✅
├── PASSWORD-RESET-COMPLETE-GUIDE.md ✅
├── COMPLETE-PASSWORD-RESET-SUMMARY.md ✅
└── PASSWORD-RESET-FLOW-DIAGRAM.md ✅ (This file)

TESTING
└── test_email.py ✅
```

---

**Status:** ✅ COMPLETE SYSTEM - READY FOR DEPLOYMENT
**Date:** 2026-05-23
**Feature:** Password Reset with Resend Email Service

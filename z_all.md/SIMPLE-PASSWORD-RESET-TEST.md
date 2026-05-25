# 🚀 SIMPLE PASSWORD RESET TEST (2 MINUTES)

## ⚡ The Easiest Way to Test

**Skip the script errors!** Just register a new account through the UI.

---

## 📝 Step-by-Step (2 Minutes)

### Step 1: Start Your Servers (30 seconds)

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

---

### Step 2: Register a NEW Account (30 seconds)

1. Open: http://localhost:5173/register

2. Fill in the form:
   - **Email:** `abrsh067+test@gmail.com` ← Important: Use `+test`
   - **Password:** `Password123`
   - **Name:** `Test User`

3. Click **"Create Account"**

4. You'll be logged in automatically ✅

**Why `+test`?**
- Gmail delivers `yourname+anything@gmail.com` to `yourname@gmail.com`
- So emails will arrive at your main inbox: `abrsh067@gmail.com`
- But it creates a separate LOCAL account (not OAuth)

---

### Step 3: Logout (5 seconds)

1. Click your profile icon (top right)
2. Click **"Logout"**

---

### Step 4: Test Password Reset (1 minute)

1. You're now at the login page

2. Click **"Forgot password?"** link

3. Enter email: `abrsh067+test@gmail.com`

4. Click **"Send Reset Link"**

5. You'll see: ✅ "Check Your Email"

6. **Open Gmail:** `abrsh067@gmail.com`
   - Look for email from `onboarding@resend.dev`
   - Subject: "Reset Your ExpenseTracker Password"
   - Beautiful gradient design 🎨

7. **Click "Reset Password"** button in email
   - You'll be redirected to: http://localhost:5173/reset-password?token=XXXXX
   - Token is pre-filled

8. **Enter new password:**
   - New Password: `NewPassword456`
   - Confirm Password: `NewPassword456`

9. Click **"Reset Password"**

10. You'll see: ✅ "Password Reset Successful!"

11. Auto-redirect to login

12. **Login with new password:**
    - Email: `abrsh067+test@gmail.com`
    - Password: `NewPassword456`

13. **Success!** You're logged in ✅

---

## 🎯 What You Just Tested

✅ **Account Registration** (local, not OAuth)
✅ **Password Reset Request** (email sent)
✅ **Email Delivery** (via Resend)
✅ **Beautiful Email Template** (gradient design)
✅ **Reset Link** (with secure token)
✅ **Password Update** (in database)
✅ **Login with New Password** (authentication works)

---

## 📧 Email Preview

You should receive an email that looks like this:

```
┌─────────────────────────────────────────────┐
│ 🔐 ExpenseTracker                           │
│ (Gradient header: teal → purple → pink)    │
├─────────────────────────────────────────────┤
│                                             │
│ Reset Your Password                         │
│                                             │
│ Hi Test User,                               │
│                                             │
│ We received a request to reset your         │
│ password for your ExpenseTracker account.   │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │   🔘 Reset Password (Big Button)       │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Or copy this link:                          │
│ http://localhost:5173/reset-password?...    │
│                                             │
│ ⏰ This link expires in 1 hour              │
│                                             │
│ If you didn't request this, ignore it.      │
└─────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Email Not Received?

1. **Check spam folder** 📱
2. **Wait 30 seconds** (Resend is usually fast)
3. **Check Resend dashboard:** https://resend.com/emails
4. **Check backend console** for errors

### Still Using OAuth Account?

If you accidentally used your OAuth account (`abrsh067@gmail.com` without `+test`):

**Solution:** Just register again with `+test`:
- Email: `abrsh067+test@gmail.com` ← Don't forget the `+test`!

### Token Expired?

- Tokens expire after 1 hour
- Just request a new reset link

---

## ✅ Success Checklist

- [ ] Registered new account with `abrsh067+test@gmail.com`
- [ ] Logged out
- [ ] Clicked "Forgot password?"
- [ ] Entered email and submitted
- [ ] Received email at `abrsh067@gmail.com`
- [ ] Email has beautiful gradient design
- [ ] Clicked "Reset Password" button in email
- [ ] Redirected to reset page with token
- [ ] Entered new password
- [ ] Saw success message
- [ ] Logged in with new password
- [ ] Everything works! 🎉

---

## 🎉 That's It!

**No scripts needed!** Just:
1. Register with `abrsh067+test@gmail.com`
2. Test password reset
3. Check your Gmail inbox
4. Complete the flow

**Total time:** 2 minutes ⏱️

---

## 📝 Notes

- **Gmail Alias Trick:** `+test` creates a separate account but delivers to your main inbox
- **Local Account:** This creates a LOCAL account (not OAuth) that can use password reset
- **Real Emails:** You'll receive actual emails via Resend
- **Production Ready:** Same flow works in production

---

**Ready to test!** 🚀

Just follow the steps above - no need to run any Python scripts!

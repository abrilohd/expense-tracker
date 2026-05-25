# 🧪 PASSWORD RESET TESTING GUIDE

## ⚠️ IMPORTANT: OAuth Account Issue

The error **"Password reset is not available for OAuth accounts"** means the email `abrsh067@gmail.com` was registered using **Google OAuth** (Sign in with Google), not with a regular email/password.

**Password reset only works for LOCAL accounts** (registered with email + password).

---

## 🎯 SOLUTION: 3 Options

### Option 1: Create a Test Local Account (RECOMMENDED)

#### Step 1: Run the Test User Script

```bash
cd backend
python create_test_user.py
```

**This will create:**
- Email: `test@example.com`
- Password: `Password123`
- Provider: `local` (can use password reset)

#### Step 2: Test Password Reset

1. Open http://localhost:5173/login
2. Click **"Forgot password?"**
3. Enter: `test@example.com`
4. Click **"Send Reset Link"**
5. Check backend console for reset token (or check email if configured)
6. Complete password reset
7. Login with new password ✅

---

### Option 2: Register a New Local Account

#### Step 1: Register with Gmail Alias

Gmail has a cool feature: `yourname+anything@gmail.com` delivers to `yourname@gmail.com`

1. Open http://localhost:5173/register
2. Enter email: `abrsh067+test@gmail.com`
3. Enter password: `Password123`
4. Enter name: `Test User`
5. Click **"Create Account"**

**This creates a LOCAL account** (not OAuth) that can use password reset.

#### Step 2: Test Password Reset

1. Go to http://localhost:5173/login
2. Click **"Forgot password?"**
3. Enter: `abrsh067+test@gmail.com`
4. Click **"Send Reset Link"**
5. **Check your email at `abrsh067@gmail.com`** (Gmail delivers +test emails to main inbox)
6. Click reset link in email
7. Enter new password
8. Login with new password ✅

---

### Option 3: Convert OAuth Account to Local (Advanced)

If you want to convert your existing OAuth account to local:

#### Step 1: Update Database

```bash
cd backend
python
```

```python
from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

# Find your OAuth user
user = db.query(User).filter(User.email == "abrsh067@gmail.com").first()

if user:
    print(f"Current provider: {user.provider}")
    
    # Convert to local
    user.provider = "local"
    user.hashed_password = hash_password("Password123")
    
    db.commit()
    print("✅ Converted to local account")
    print("You can now use password reset!")
else:
    print("❌ User not found")

db.close()
```

#### Step 2: Test Password Reset

Now you can use password reset with `abrsh067@gmail.com`

---

## 🔍 CHECK YOUR ACCOUNT TYPE

Want to see if your account is OAuth or local?

```bash
cd backend
python
```

```python
from app.db.database import SessionLocal
from app.models.user import User

db = SessionLocal()

# Check all users
users = db.query(User).all()

for user in users:
    print(f"\n📧 Email: {user.email}")
    print(f"   Provider: {user.provider}")
    print(f"   Can Reset Password: {'Yes' if user.provider == 'local' else 'No (OAuth)'}")

db.close()
```

---

## 📧 EMAIL TESTING

### If You Want to Receive Real Emails

The system is configured to send emails via Resend to any email address.

**Best approach:**

1. Register with: `abrsh067+test@gmail.com`
2. This creates a LOCAL account
3. Password reset emails will be sent to `abrsh067@gmail.com`
4. You'll receive the beautiful reset email ✅

### If You Don't Need Real Emails

Use the test account:
- Email: `test@example.com`
- Password: `Password123`

The reset token will be logged in the backend console.

---

## 🚀 QUICK START (RECOMMENDED)

### 1. Create Test User (30 seconds)

```bash
cd backend
python create_test_user.py
```

**Output:**
```
✅ User created successfully

TEST USER CREDENTIALS
Email:    test@example.com
Password: Password123
Provider: local
```

### 2. Test Password Reset (2 minutes)

```bash
# Terminal 1: Start backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### 3. Complete Flow

1. Open http://localhost:5173/login
2. Click **"Forgot password?"**
3. Enter: `test@example.com`
4. Click **"Send Reset Link"**
5. Check backend console for output like:
   ```
   INFO: Password reset requested for: test@example.com
   INFO: Reset token: abc123def456...
   ```
6. Copy the token from console
7. Go to: http://localhost:5173/reset-password
8. Paste token
9. Enter new password: `NewPassword123`
10. Click **"Reset Password"**
11. Login with new password ✅

---

## 🎯 TESTING WITH REAL EMAILS

### Best Method: Gmail Alias

1. **Register new account:**
   - Go to http://localhost:5173/register
   - Email: `abrsh067+test@gmail.com`
   - Password: `Password123`
   - Name: `Test User`

2. **Request password reset:**
   - Go to http://localhost:5173/login
   - Click "Forgot password?"
   - Enter: `abrsh067+test@gmail.com`

3. **Check your email:**
   - Open Gmail: `abrsh067@gmail.com`
   - Look for email from `onboarding@resend.dev`
   - Subject: "Reset Your ExpenseTracker Password"
   - Beautiful gradient design ✅

4. **Complete reset:**
   - Click "Reset Password" button in email
   - Enter new password
   - Login ✅

---

## 🐛 TROUBLESHOOTING

### Error: "Password reset is not available for OAuth accounts"

**Cause:** You're trying to reset password for a Google OAuth account.

**Solution:** Use one of these:
1. Create test account: `test@example.com`
2. Register with Gmail alias: `abrsh067+test@gmail.com`
3. Convert OAuth to local (see Option 3 above)

### Email Not Received

**Check:**
1. Spam folder
2. Backend console for errors
3. Resend dashboard: https://resend.com/emails

**Solution:**
- Use test account and get token from console
- Or use Gmail alias method

### Token Invalid/Expired

**Cause:** Token expires after 1 hour or already used.

**Solution:**
- Request new reset link
- Tokens are one-time use

---

## 📊 ACCOUNT TYPES EXPLAINED

### LOCAL Account (✅ Can Reset Password)
- Registered with email + password
- Provider: `local`
- Has `hashed_password` in database
- Can use "Forgot password?" feature

### OAUTH Account (❌ Cannot Reset Password)
- Registered with "Sign in with Google"
- Provider: `google`
- No password in database (uses Google)
- Cannot use "Forgot password?" feature
- Must use Google to login

---

## ✅ RECOMMENDED TESTING FLOW

### For Quick Testing (No Email)

```bash
# 1. Create test user
cd backend
python create_test_user.py

# 2. Start servers
# Terminal 1
uvicorn app.main:app --reload

# Terminal 2
cd ../frontend
npm run dev

# 3. Test at http://localhost:5173/login
# Use: test@example.com / Password123
```

### For Full Testing (With Email)

```bash
# 1. Start servers (same as above)

# 2. Register new account
# Go to: http://localhost:5173/register
# Email: abrsh067+test@gmail.com
# Password: Password123

# 3. Test password reset
# Go to: http://localhost:5173/login
# Click "Forgot password?"
# Enter: abrsh067+test@gmail.com
# Check Gmail inbox for reset email
```

---

## 🎉 SUCCESS CRITERIA

✅ **Test Account Created:**
- Email: `test@example.com` or `abrsh067+test@gmail.com`
- Provider: `local`
- Can use password reset

✅ **Password Reset Works:**
- Request reset link
- Receive email (or get token from console)
- Reset password successfully
- Login with new password

✅ **Email Received:**
- Beautiful gradient design
- Reset button works
- Link expires after 1 hour
- Professional branding

---

## 📝 SUMMARY

**The Issue:**
- `abrsh067@gmail.com` is an OAuth account (Google Sign-in)
- OAuth accounts don't have passwords
- Password reset only works for LOCAL accounts

**The Solution:**
1. **Quick:** Use `test@example.com` (created by script)
2. **Best:** Register `abrsh067+test@gmail.com` (receives real emails)
3. **Advanced:** Convert OAuth to local (database update)

**Next Steps:**
1. Run `python create_test_user.py`
2. Test with `test@example.com`
3. Or register `abrsh067+test@gmail.com` for real emails

---

**Ready to test!** 🚀

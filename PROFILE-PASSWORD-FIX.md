# Fix: "Resource not found" Error on Password Update

## Problem
When clicking "Update Password" on the Profile page, you get two "Resource not found" error messages.

## Root Cause
The backend endpoint `PUT /auth/password` was added to the code, but the **backend server needs to be restarted** to pick up the new route.

---

## ✅ Solution: Restart the Backend Server

### Step 1: Stop the Current Backend Server
If the backend is running, stop it:
- Press `Ctrl+C` in the terminal where the backend is running
- Or close the terminal window

### Step 2: Start the Backend Server Again

**Option A: Using uvicorn directly**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Option B: Using Python module**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Option C: If you have a start script**
```bash
cd backend
./start.sh  # or whatever your start script is named
```

### Step 3: Verify the Endpoint Exists

Once the server is running, you should see output like:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 4: Test the Password Update
1. Go to the Profile page in your browser
2. Click "Change Password"
3. Enter your current password and a new password
4. Click "Update Password"
5. You should see: "🎉 Password updated successfully!"

---

## 🔍 How to Verify the Endpoint is Available

### Method 1: Check FastAPI Docs
1. Open your browser
2. Go to: `http://localhost:8000/docs`
3. Look for the **Authentication** section
4. You should see: `PUT /auth/password` endpoint

### Method 2: Manual API Test
```bash
# Test without authentication (should return 401)
curl -X PUT http://localhost:8000/auth/password \
  -H "Content-Type: application/json" \
  -d '{"current_password":"test","new_password":"test123"}'

# Expected response: 401 Unauthorized (this is correct!)
# If you get 404, the server needs to be restarted
```

### Method 3: Use the Test Script
```bash
cd backend
python test_password_endpoint.py
```

Expected output:
```
✓ Backend is running
  Response: {'message': 'Expense Tracker API', 'version': '1.0.0', 'status': 'running'}
✓ Password endpoint exists (returned 401 Unauthorized as expected)
```

---

## 🐛 Why This Happens

FastAPI with `--reload` flag should auto-reload when files change, but sometimes:
1. The reload doesn't trigger properly
2. The file watcher misses the change
3. The server was started without `--reload` flag
4. There's a syntax error preventing the reload

**Solution**: Always manually restart after adding new endpoints to be safe.

---

## 📝 Files That Were Modified

The following files were changed to add the password update feature:

### Backend:
1. `backend/app/routes/auth.py` - Added `PUT /auth/password` endpoint
2. `backend/app/schemas/user.py` - Added `PasswordUpdate` schema

### Frontend:
3. `frontend/src/api/expenses.ts` - Added `updatePassword()` function
4. `frontend/src/pages/Profile.tsx` - Password change form

**All these files are correct** - you just need to restart the backend!

---

## ✅ Verification Checklist

After restarting the backend, verify:

- [ ] Backend server is running on port 8000
- [ ] Visit `http://localhost:8000/docs` - you see the API documentation
- [ ] In the docs, expand "Authentication" section
- [ ] You see `PUT /auth/password` endpoint listed
- [ ] Go to Profile page in the app
- [ ] Click "Change Password"
- [ ] Enter current password: (your actual password)
- [ ] Enter new password: (at least 6 characters)
- [ ] Confirm new password: (same as new password)
- [ ] Click "Update Password"
- [ ] See success message: "🎉 Password updated successfully!"
- [ ] Form closes automatically
- [ ] Try logging out and logging in with the new password

---

## 🚨 If It Still Doesn't Work

### Check 1: Backend Logs
Look at the terminal where the backend is running. You should see:
```
INFO:     127.0.0.1:xxxxx - "PUT /auth/password HTTP/1.1" 200 OK
```

If you see `404` instead of `200`, the endpoint isn't registered.

### Check 2: Frontend Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Update Password"
4. Look for the request to `/auth/password`
5. Check the response status code

### Check 3: Verify Backend Code
Run this to check for syntax errors:
```bash
cd backend
python -c "from app.routes import auth; print('✓ Auth routes loaded successfully')"
```

### Check 4: Check API Base URL
Make sure your frontend is pointing to the correct backend:
- Check `frontend/src/config/constants.ts`
- Should be: `http://localhost:8000` or your backend URL

---

## 💡 Quick Fix Summary

**TL;DR:**
1. Stop backend server (Ctrl+C)
2. Start backend server again: `uvicorn app.main:app --reload`
3. Test password update on Profile page
4. Should work now! ✅

---

## 🎯 Expected Behavior After Fix

### Success Flow:
1. User enters correct current password ✓
2. User enters new password (min 6 chars) ✓
3. User confirms new password ✓
4. Clicks "Update Password" ✓
5. Backend verifies current password ✓
6. Backend hashes and saves new password ✓
7. Returns success message ✓
8. Frontend shows toast: "🎉 Password updated successfully!" ✓
9. Form closes automatically ✓
10. User can now login with new password ✓

### Error Flows:
- **Wrong current password**: "Current password is incorrect"
- **Passwords don't match**: "Passwords don't match"
- **Password too short**: "Password must be at least 6 characters"
- **Not authenticated**: Redirects to login page

---

## 📞 Still Having Issues?

If the problem persists after restarting:

1. **Check if backend is actually running:**
   ```bash
   curl http://localhost:8000/
   ```
   Should return: `{"message":"Expense Tracker API",...}`

2. **Check if you can access other endpoints:**
   ```bash
   curl http://localhost:8000/auth/me
   ```
   Should return: `{"detail":"Not authenticated"}` (this is correct!)

3. **Verify the auth router is loaded:**
   - Check `backend/app/main.py` line 48
   - Should have: `app.include_router(auth.router, prefix="/auth", tags=["Authentication"])`

4. **Check for Python errors:**
   - Look at the backend terminal for any error messages
   - Common issues: missing imports, syntax errors, indentation

---

**Last Updated**: 2026-04-28  
**Status**: Ready to fix - just restart the backend! 🚀

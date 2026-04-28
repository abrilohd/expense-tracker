# 🔧 Fix: "Backend server is offline"

## The Problem
Frontend shows "Backend server is offline" even though backend terminal shows "Uvicorn running on http://0.0.0.0:8000"

---

## 🎯 Quick Fixes

### Fix 1: Test Backend Connection

Run this test script:
```cmd
cd backend
python test_backend_connection.py
```

This will tell you if the backend is actually accessible.

---

### Fix 2: Check Backend Terminal for Errors

Look at your backend terminal. After "INFO: Uvicorn running on http://0.0.0.0:8000", do you see:

**Good (no errors):**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started reloader process [12345]
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Bad (with errors):**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
ERROR:    Traceback (most recent call last):
  ...
ImportError: cannot import name 'PasswordUpdate'
```

If you see errors, copy them and share them.

---

### Fix 3: Restart Both Frontend and Backend

Sometimes the connection gets stuck. Restart both:

**1. Stop Backend** (Ctrl+C)

**2. Stop Frontend** (Ctrl+C in frontend terminal)

**3. Start Backend:**
```cmd
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Wait for "Application startup complete"

**4. Start Frontend:**
```cmd
cd frontend
npm run dev
```

**5. Try registering again**

---

### Fix 4: Check if Backend is Actually Running

Open a browser and go to:
```
http://localhost:8000
```

You should see:
```json
{
  "message": "Expense Tracker API",
  "version": "1.0.0",
  "status": "running"
}
```

If you see this, the backend IS running and accessible.

---

### Fix 5: Check Frontend .env File

Make sure `frontend/.env` has:
```
VITE_API_URL=http://localhost:8000
```

If it's missing or different, add/fix it and restart frontend.

---

### Fix 6: Clear Browser Cache

Sometimes the browser caches the "offline" state:

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Try registering again

---

### Fix 7: Check Firewall/Antivirus

Your firewall might be blocking the connection:

1. Temporarily disable firewall/antivirus
2. Try registering again
3. If it works, add exception for Python/Node

---

## 🔍 Diagnostic Steps

### Step 1: Test Backend Directly

Open browser: http://localhost:8000/docs

Can you see the API documentation?
- **YES** → Backend is running, it's a frontend connection issue
- **NO** → Backend is not accessible

### Step 2: Check Network Tab

1. Open your app
2. Open DevTools (F12)
3. Go to Network tab
4. Try to register
5. Look for the request to `/auth/register`
6. What's the status?
   - **Failed** → Connection issue
   - **404** → Wrong URL
   - **500** → Backend error
   - **CORS error** → CORS configuration issue

### Step 3: Check Console

In DevTools Console tab, do you see any errors?
- Red error messages?
- CORS errors?
- Network errors?

---

## 🆘 If Nothing Works

Provide these details:

1. **Backend terminal output** (full output after starting)
2. **Frontend terminal output** (any errors?)
3. **Browser console errors** (F12 → Console tab)
4. **Network tab** (F12 → Network → try to register → screenshot)
5. **Output of:** `python test_backend_connection.py`
6. **Can you access:** http://localhost:8000 in browser?

---

## ✅ Expected Behavior

When everything works:

1. Backend terminal shows: "Application startup complete"
2. http://localhost:8000 shows API info
3. http://localhost:8000/docs shows documentation
4. Frontend can register/login
5. No CORS errors in console

---

**Try the test script first:** `python test_backend_connection.py`

This will tell you exactly what's wrong! 🚀

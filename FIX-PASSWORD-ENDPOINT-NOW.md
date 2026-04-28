# 🚨 IMMEDIATE FIX: Password Endpoint Not Showing

## The Problem
The `PUT /auth/password` endpoint doesn't appear in FastAPI docs even after restarting.

## 🎯 Try This First (Most Likely Fix)

### Step 1: Stop Backend Completely
- Find the terminal running the backend
- Press `Ctrl+C` to stop it
- **Close that terminal window completely**

### Step 2: Clear Python Cache
Open a **NEW** terminal and run:

**Windows (PowerShell):**
```powershell
cd backend
Get-ChildItem -Path . -Recurse -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Path . -Recurse -Filter "*.pyc" | Remove-Item -Force
```

**Windows (Command Prompt):**
```cmd
cd backend
for /d /r . %d in (__pycache__) do @if exist "%d" rd /s /q "%d"
del /s /q *.pyc
```

**Linux/Mac:**
```bash
cd backend
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null
```

### Step 3: Verify Code is There
```bash
cd backend
python verify_password_endpoint.py
```

**Expected output:**
```
✓ Auth router loaded successfully
✓ Found 4 routes:

  POST   /register            -> register_user
  POST   /login               -> login_user
  GET    /me                  -> get_current_user_profile
  PUT    /password            -> update_user_password

✓ Password endpoint found!
  PUT /password
```

**If you see an error**, there's a problem with the code. Share the error message.

### Step 4: Start Backend Fresh
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Check FastAPI Docs
- Open: http://localhost:8000/docs
- Look at "Authentication" section
- Should now see 4 endpoints

---

## 🔧 Alternative: Use the Restart Script

**Windows:**
```cmd
cd backend
restart_backend.bat
```

**Linux/Mac:**
```bash
cd backend
chmod +x restart_backend.sh
./restart_backend.sh
```

This script automatically:
1. Clears cache
2. Verifies code
3. Starts server

---

## 🐛 If Still Not Working

### Check for Multiple Server Instances

**Windows:**
```cmd
netstat -ano | findstr :8000
```

**Linux/Mac:**
```bash
lsof -i :8000
```

If you see output, kill those processes:

**Windows:**
```cmd
taskkill /F /PID <number_from_last_column>
```

**Linux/Mac:**
```bash
kill -9 <process_id>
```

Then start the server again.

---

## 📋 What to Check in Terminal

When you start the backend, you should see:

```
INFO:     Will watch for changes in these directories: ['C:\\...\\backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**If you see errors like:**
- `ImportError: cannot import name 'PasswordUpdate'`
- `ModuleNotFoundError`
- `SyntaxError`

Then there's a problem with the code. Share the exact error.

---

## 🧪 Test the Endpoint Manually

Once the server is running, test with curl:

```bash
curl -X PUT http://localhost:8000/auth/password \
  -H "Content-Type: application/json" \
  -d '{"current_password":"test","new_password":"test123"}'
```

**Expected response (401 is GOOD!):**
```json
{"detail":"Not authenticated"}
```

**Bad response (404 means endpoint not found):**
```json
{"detail":"Not Found"}
```

---

## 📝 Files to Double-Check

### File 1: `backend/app/routes/auth.py`

Search for this code (should be at the bottom):

```python
# UPDATE PASSWORD - Change user password
@router.put("/password", response_model=dict)
def update_user_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user password - requires current password verification
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise UnauthorizedException("Current password is incorrect")
    
    # Update to new password
    current_user.hashed_password = hash_password(password_data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}
```

**If it's not there:** Copy and paste it at the end of the file, save, and restart.

### File 2: `backend/app/schemas/user.py`

Search for this code (should be at the bottom):

```python
class PasswordUpdate(BaseModel):
    """
    Schema for password update request
    """
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6, max_length=100)
```

**If it's not there:** Copy and paste it at the end of the file, save, and restart.

### File 3: Check Import in `auth.py`

Line 11 should be:

```python
from app.schemas.user import UserCreate, UserResponse, Token, PasswordUpdate
```

**If `PasswordUpdate` is missing:** Add it, save, and restart.

---

## 🎯 Summary

1. **Stop backend** (Ctrl+C, close terminal)
2. **Clear cache** (delete `__pycache__` folders)
3. **Verify code** (`python verify_password_endpoint.py`)
4. **Start fresh** (new terminal, `uvicorn app.main:app --reload`)
5. **Check docs** (http://localhost:8000/docs)
6. **Test endpoint** (curl command or Profile page)

---

## 💬 Need Help?

If it's still not working, provide:

1. Output of `python verify_password_endpoint.py`
2. Backend terminal output when starting server
3. Screenshot of http://localhost:8000/docs
4. Result of curl test command

This will help identify the exact issue!

---

**Created**: 2026-04-28  
**Status**: Ready to fix! 🚀

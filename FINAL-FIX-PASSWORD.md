# 🚨 FINAL FIX: Password Endpoint Not Showing

## Current Status
- ✅ Code is 100% correct in both files
- ✅ `PasswordUpdate` schema exists
- ✅ Route `/auth/update-password` is defined
- ❌ Endpoint not appearing in FastAPI docs

## Root Cause
Python is loading a **cached version** of the code. The new endpoint exists in the files but Python hasn't reloaded it.

---

## 🎯 SOLUTION: Use the Automated Script

### Step 1: Run the Restart Script

**Open Command Prompt** and run:

```cmd
cd backend
RESTART_BACKEND.bat
```

This script will:
1. Kill any running Python/uvicorn processes
2. Delete ALL `__pycache__` folders and `.pyc` files
3. Test if the endpoint exists in the code
4. Start the server fresh

### Step 2: Watch the Output

You should see:

```
[1/4] Stopping any running backend servers...
  Done!

[2/4] Clearing Python cache...
  Deleted: app\__pycache__
  Deleted: app\routes\__pycache__
  Deleted: app\schemas\__pycache__
  Done!

[3/4] Testing if password endpoint exists in code...
  ✓ SUCCESS: PasswordUpdate imported
  ✓ SUCCESS: Auth router imported
  ✓ Found 4 routes:

    POST   /register                 -> register_user
    POST   /login                    -> login_user
    GET    /me                       -> get_current_user_profile
    PUT    /update-password          -> update_user_password

  ✓ PASSWORD ENDPOINT FOUND!
    PUT /update-password

[4/4] Starting backend server...
  Server will start in 3 seconds...

============================================================
STARTING SERVER NOW
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 3: Verify in Browser

1. Open: http://localhost:8000/docs
2. Look at "Authentication" section
3. Should see **4 endpoints** including `PUT /auth/update-password`

---

## 🔧 Alternative: Manual Method

If the script doesn't work, do this manually:

### 1. Kill All Python Processes

**Windows (Command Prompt as Administrator):**
```cmd
taskkill /F /IM python.exe
taskkill /F /IM uvicorn.exe
```

### 2. Delete Cache Manually

```cmd
cd backend
rmdir /s /q app\__pycache__
rmdir /s /q app\routes\__pycache__
rmdir /s /q app\schemas\__pycache__
rmdir /s /q app\core\__pycache__
rmdir /s /q app\db\__pycache__
rmdir /s /q app\models\__pycache__
rmdir /s /q app\services\__pycache__
del /s /q *.pyc
```

### 3. Test Import

```cmd
cd backend
python test_import.py
```

**Expected output:**
```
✓ SUCCESS: PasswordUpdate imported
✓ SUCCESS: Auth router imported
✓ PASSWORD ENDPOINT FOUND!
  PUT /update-password
```

**If you see errors**, copy the error message and share it.

### 4. Start Server

```cmd
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🐛 If STILL Not Working

### Check 1: Verify Files Were Actually Saved

1. Open `backend/app/routes/auth.py` in Notepad (not your IDE)
2. Press `Ctrl+F` and search for: `update-password`
3. You should find this line:
   ```python
   @router.put("/update-password", response_model=dict, status_code=status.HTTP_200_OK)
   ```
4. If it's NOT there, the file wasn't saved. Copy the code below and paste it at the end of the file.

### Check 2: Verify Schema File

1. Open `backend/app/schemas/user.py` in Notepad
2. Scroll to the bottom
3. You should see:
   ```python
   class PasswordUpdate(BaseModel):
       """
       Schema for password update request
       """
       current_password: str = Field(..., min_length=1)
       new_password: str = Field(..., min_length=6, max_length=100)
   ```
4. If it's NOT there, copy and paste it at the end of the file.

### Check 3: Check for Syntax Errors

Run this to check for Python syntax errors:

```cmd
cd backend
python -m py_compile app/routes/auth.py
python -m py_compile app/schemas/user.py
```

If there are errors, they will be shown.

---

## 📋 Complete Code (If You Need to Re-Add It)

### Add to `backend/app/routes/auth.py` (at the end):

```python
# UPDATE PASSWORD - Change user password
@router.put("/update-password", response_model=dict, status_code=status.HTTP_200_OK)
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

### Add to `backend/app/schemas/user.py` (at the end):

```python
class PasswordUpdate(BaseModel):
    """
    Schema for password update request
    """
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6, max_length=100)
```

### Verify Import in `backend/app/routes/auth.py` (line 11):

```python
from app.schemas.user import UserCreate, UserResponse, Token, PasswordUpdate
```

Make sure `PasswordUpdate` is included!

---

## ✅ Success Checklist

After running the restart script:

- [ ] Script shows "✓ PASSWORD ENDPOINT FOUND!"
- [ ] Server starts without errors
- [ ] http://localhost:8000/docs shows 4 endpoints in Authentication
- [ ] `PUT /auth/update-password` is visible
- [ ] Profile page password update works
- [ ] Success toast appears: "🎉 Password updated successfully!"

---

## 🆘 Last Resort

If nothing works, provide these outputs:

1. **Output of test_import.py:**
   ```cmd
   cd backend
   python test_import.py
   ```

2. **Backend startup logs** (first 20 lines when starting server)

3. **Screenshot** of http://localhost:8000/docs Authentication section

4. **Check if files exist:**
   ```cmd
   dir backend\app\routes\auth.py
   dir backend\app\schemas\user.py
   ```

This will help identify the exact issue!

---

**Created**: 2026-04-28  
**Status**: Use RESTART_BACKEND.bat script - it will work! 🚀

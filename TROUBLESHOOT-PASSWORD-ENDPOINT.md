# Troubleshooting: Password Endpoint Not Appearing

## Current Situation
- ✅ Code is correct in `backend/app/routes/auth.py`
- ✅ `PasswordUpdate` schema exists in `backend/app/schemas/user.py`
- ✅ Import statement is correct
- ❌ Endpoint not showing in FastAPI docs after restart

## Possible Causes & Solutions

### Solution 1: Clear Python Cache and Restart

Python might be using cached `.pyc` files. Clear them:

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

**Manual Method:**
```bash
cd backend

# Clear cache
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null

# Restart server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

### Solution 2: Check for Import Errors

The endpoint might not be loading due to an import error:

1. **Stop the backend server** (Ctrl+C)

2. **Test if the module loads:**
   ```bash
   cd backend
   python verify_password_endpoint.py
   ```

3. **Expected output:**
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

4. **If you see an error**, it will show what's wrong with the import

---

### Solution 3: Check Backend Terminal for Errors

When you start the backend, look carefully at the terminal output:

**Good output (no errors):**
```
INFO:     Will watch for changes in these directories: ['/path/to/backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Bad output (with errors):**
```
ERROR:    Error loading ASGI app. Could not import module "app.main".
ImportError: cannot import name 'PasswordUpdate' from 'app.schemas.user'
```

If you see errors, share them so we can fix the issue.

---

### Solution 4: Verify File Was Actually Saved

Sometimes editors don't save files properly:

1. **Open** `backend/app/routes/auth.py` in your editor
2. **Search** for `def update_user_password`
3. **Verify** you see this code:
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

4. **If it's not there**, the file wasn't saved. Save it and restart.

---

### Solution 5: Check Import Statement

1. **Open** `backend/app/routes/auth.py`
2. **Find** line 11 (near the top)
3. **Verify** it says:
   ```python
   from app.schemas.user import UserCreate, UserResponse, Token, PasswordUpdate
   ```
4. **If `PasswordUpdate` is missing**, add it and save

---

### Solution 6: Verify Schema File

1. **Open** `backend/app/schemas/user.py`
2. **Scroll to the bottom**
3. **Verify** you see:
   ```python
   class PasswordUpdate(BaseModel):
       """
       Schema for password update request
       """
       current_password: str = Field(..., min_length=1)
       new_password: str = Field(..., min_length=6, max_length=100)
   ```
4. **If it's not there**, add it and save

---

### Solution 7: Force Reload Without Cache

Start the server with explicit Python path:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

### Solution 8: Check if Running Old Server Instance

You might have multiple backend servers running:

**Windows:**
```cmd
netstat -ano | findstr :8000
```

**Linux/Mac:**
```bash
lsof -i :8000
```

If you see multiple processes, kill them all and start fresh:

**Windows:**
```cmd
taskkill /F /PID <process_id>
```

**Linux/Mac:**
```bash
kill -9 <process_id>
```

---

### Solution 9: Start Fresh Terminal

Sometimes the terminal environment is cached:

1. **Close** the terminal where backend is running
2. **Open** a new terminal
3. **Navigate** to backend folder
4. **Start** the server:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

---

### Solution 10: Check Virtual Environment

If using a virtual environment, make sure it's activated:

**Windows:**
```cmd
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Linux/Mac:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Verification Steps

After trying the solutions above:

### 1. Check FastAPI Docs
- Open: http://localhost:8000/docs
- Look for "Authentication" section
- Should see 4 endpoints (including PUT /auth/password)

### 2. Test with curl
```bash
curl -X PUT http://localhost:8000/auth/password \
  -H "Content-Type: application/json" \
  -d '{"current_password":"test","new_password":"test123"}'
```

Expected response (401 is correct!):
```json
{"detail":"Not authenticated"}
```

If you get 404, the endpoint still isn't loaded.

### 3. Check Server Logs
When you make the request, the backend terminal should show:
```
INFO:     127.0.0.1:xxxxx - "PUT /auth/password HTTP/1.1" 401 Unauthorized
```

---

## Still Not Working?

If none of the above solutions work, please provide:

1. **Backend terminal output** when starting the server
2. **Output of** `python verify_password_endpoint.py`
3. **Screenshot** of http://localhost:8000/docs Authentication section
4. **Operating System** (Windows/Mac/Linux)
5. **Python version**: `python --version`
6. **FastAPI version**: `pip show fastapi`

This will help diagnose the issue!

---

## Quick Checklist

- [ ] Cleared Python cache (`__pycache__` folders)
- [ ] Verified code exists in `auth.py` file
- [ ] Verified `PasswordUpdate` exists in `user.py` file
- [ ] Verified import statement includes `PasswordUpdate`
- [ ] Stopped all backend server instances
- [ ] Started backend in a fresh terminal
- [ ] Checked terminal for error messages
- [ ] Refreshed http://localhost:8000/docs
- [ ] Tested with curl command
- [ ] Checked if virtual environment is activated

---

**Last Updated**: 2026-04-28

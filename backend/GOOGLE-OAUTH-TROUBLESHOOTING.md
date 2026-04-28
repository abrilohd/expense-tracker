# Google OAuth Troubleshooting Guide

## Issue: 404 Error When Clicking "Sign in with Google"

### Symptoms
- User clicks "Continue with Google" button on login page
- Browser shows "404 Page not found"
- Backend server is running but endpoint not accessible

### Root Cause Analysis

The 404 error can occur due to several reasons:

1. **Backend server not running**
2. **CORS issues blocking the request**
3. **Wrong URL in frontend**
4. **Google OAuth credentials not configured**

### Solution Steps

#### Step 1: Verify Backend Server is Running

```bash
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

#### Step 2: Test the Google OAuth Endpoint

Open your browser and navigate to:
```
http://localhost:8000/auth/google/login
```

**Expected behavior**: You should be redirected to Google's OAuth consent screen.

**If you get 404**: The route is not registered. Check `backend/app/main.py` includes:
```python
from app.routes import google_auth
app.include_router(google_auth.router, prefix="/auth", tags=["Google OAuth"])
```

#### Step 3: Verify Google OAuth Credentials

Check your `backend/.env` file has:
```env
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

**To get Google OAuth credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID (or use existing)
3. Add authorized redirect URIs:
   - `http://localhost:8000/auth/google/callback`
   - `http://127.0.0.1:8000/auth/google/callback`
4. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:8000`

#### Step 4: Check Frontend Configuration

In `frontend/src/pages/Login.tsx`, the Google button should point to:
```typescript
window.location.href = 'http://localhost:8000/auth/google/login';
```

#### Step 5: Test the Complete Flow

1. **Start backend**:
   ```bash
   cd backend
   venv\Scripts\activate
   python -m uvicorn app.main:app --reload
   ```

2. **Start frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the flow**:
   - Go to `http://localhost:5173/login`
   - Click "Continue with Google"
   - Should redirect to Google OAuth consent screen
   - After consent, should redirect back to dashboard with token

### Common Issues and Fixes

#### Issue 1: "redirect_uri_mismatch" Error

**Cause**: The redirect URI in your code doesn't match what's configured in Google Cloud Console.

**Fix**: Make sure these match exactly:
- Backend `.env`: `GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback`
- Google Cloud Console: Add `http://localhost:8000/auth/google/callback` to authorized redirect URIs

#### Issue 2: CORS Error in Browser Console

**Cause**: Frontend trying to make AJAX request instead of full page redirect.

**Fix**: Use `window.location.href` for redirect, not `fetch()` or `axios()`.

#### Issue 3: Token Not Saved After Redirect

**Cause**: Dashboard component not extracting token from URL.

**Fix**: The Dashboard component should have this code:
```typescript
useEffect(() => {
  const token = searchParams.get('token');
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    navigate('/dashboard', { replace: true });
    window.location.reload();
  }
}, [searchParams, navigate]);
```

#### Issue 4: "Invalid Client" Error from Google

**Cause**: Wrong Google Client ID or Client Secret.

**Fix**: 
1. Verify credentials in Google Cloud Console
2. Copy the correct Client ID and Client Secret to `.env`
3. Restart backend server

### Verification Checklist

- [ ] Backend server running on port 8000
- [ ] Can access `http://localhost:8000/docs` (FastAPI docs)
- [ ] Google OAuth credentials configured in `.env`
- [ ] Redirect URI matches in both `.env` and Google Cloud Console
- [ ] Frontend running on port 5173
- [ ] Browser console shows no CORS errors
- [ ] Can manually navigate to `http://localhost:8000/auth/google/login`

### Testing Commands

```bash
# Test if backend is running
curl http://localhost:8000/

# Test Google OAuth endpoint (should redirect)
curl -I http://localhost:8000/auth/google/login

# Check if routes are registered
curl http://localhost:8000/docs
```

### Debug Mode

To see detailed logs, run backend with:
```bash
python -m uvicorn app.main:app --reload --log-level debug
```

### Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console (F12) for JavaScript errors
3. Verify all environment variables are loaded:
   ```python
   # Add to backend/app/main.py temporarily
   print(f"Google Client ID: {settings.google_client_id[:10]}...")
   print(f"Redirect URI: {settings.google_redirect_uri}")
   ```

---

**Last Updated**: April 28, 2026  
**Status**: Troubleshooting Guide

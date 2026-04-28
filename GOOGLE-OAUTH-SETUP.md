# Google OAuth Setup & Testing Guide

## ✅ What Was Fixed

1. **Dependency Issue**: Installed `httpx>=0.27.0` in virtual environment
2. **URL Consistency**: Updated Login and Register pages to use `VITE_API_URL` environment variable
3. **Backend Server**: Started backend server on port 8000

## 🧪 Testing the Google OAuth Flow

### Step 1: Verify Backend is Running

```bash
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 2: Test the OAuth Endpoint Directly

Open your browser and navigate to:
```
http://127.0.0.1:8000/auth/google/login
```

**Expected Result**: You should be redirected to Google's OAuth consent screen.

**If you get 404**: 
- Check that backend server is running
- Check backend terminal for errors
- Verify `google_auth.router` is included in `backend/app/main.py`

### Step 3: Test from Frontend

1. Make sure frontend is running:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open `http://localhost:5173/login`

3. Click "Continue with Google"

4. **Expected Flow**:
   - Redirects to Google OAuth consent screen
   - After you approve, redirects back to `http://localhost:5173/dashboard?token=...`
   - Token is saved to localStorage
   - You're logged in!

## 🔧 Configuration Files

### Backend `.env`
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=269702079191-305itouics3dmod93gmnvk5t9tl2h9qh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_ID
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://127.0.0.1:8000
```

## 🐛 Troubleshooting

### Issue: "404 Page not found"

**Possible Causes**:
1. Backend server not running
2. Wrong URL in frontend
3. CORS blocking the request

**Solutions**:
1. Verify backend is running: `curl http://127.0.0.1:8000/`
2. Check browser console for errors (F12)
3. Test endpoint directly in browser: `http://127.0.0.1:8000/auth/google/login`

### Issue: "redirect_uri_mismatch"

**Cause**: Google OAuth redirect URI doesn't match what's configured in Google Cloud Console.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add these Authorized redirect URIs:
   - `http://localhost:8000/auth/google/callback`
   - `http://127.0.0.1:8000/auth/google/callback`
4. Add these Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:8000`
   - `http://127.0.0.1:8000`

### Issue: Token not saved after redirect

**Cause**: Dashboard component not extracting token from URL.

**Solution**: The Dashboard component should automatically handle this. Check browser console for errors.

### Issue: CORS Error

**Cause**: Backend CORS configuration not allowing frontend origin.

**Solution**: Check `backend/app/main.py` has:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 Testing Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 5173
- [ ] Can access `http://127.0.0.1:8000/docs` (FastAPI docs)
- [ ] Can access `http://127.0.0.1:8000/auth/google/login` (redirects to Google)
- [ ] Google OAuth credentials configured in `backend/.env`
- [ ] Redirect URI matches in both `.env` and Google Cloud Console
- [ ] No CORS errors in browser console

## 🎯 Quick Test Commands

```bash
# Test if backend is running
curl http://127.0.0.1:8000/

# Test Google OAuth endpoint (should return redirect)
curl -I http://127.0.0.1:8000/auth/google/login

# View API documentation
# Open in browser: http://127.0.0.1:8000/docs
```

## 📚 Additional Resources

- **Troubleshooting Guide**: `backend/GOOGLE-OAUTH-TROUBLESHOOTING.md`
- **Dependency Fix**: `backend/DEPENDENCY-FIX.md`
- **Test HTML**: `backend/test_oauth.html` (open in browser to test endpoint)

---

**Last Updated**: April 28, 2026  
**Status**: ✅ Ready for Testing

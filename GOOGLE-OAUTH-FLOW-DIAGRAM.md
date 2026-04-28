# Google OAuth Flow Diagram

## 🔄 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE OAUTH FLOW                                │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Frontend   │
│  (React)     │
└──────┬───────┘
       │
       │ 1. User clicks "Continue with Google"
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  window.location.href = 'http://localhost:8000/auth/google/login'   │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 2. Browser navigates to backend
       │
       ▼
┌──────────────┐
│   Backend    │
│  (FastAPI)   │
│              │
│  GET /auth/  │
│  google/     │
│  login       │
└──────┬───────┘
       │
       │ 3. Backend builds Google OAuth URL
       │    with client_id, redirect_uri, scope
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  RedirectResponse(                                                    │
│    url='https://accounts.google.com/o/oauth2/v2/auth?...'           │
│  )                                                                    │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 4. Browser redirects to Google
       │
       ▼
┌──────────────┐
│   Google     │
│   OAuth      │
│   Consent    │
│   Screen     │
└──────┬───────┘
       │
       │ 5. User signs in and authorizes
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Google redirects back with authorization code:                      │
│  http://localhost:8000/auth/google/callback?code=AUTHORIZATION_CODE │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 6. Browser navigates to backend callback
       │
       ▼
┌──────────────┐
│   Backend    │
│              │
│  GET /auth/  │
│  google/     │
│  callback    │
└──────┬───────┘
       │
       │ 7. Backend exchanges code for access_token
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  POST https://oauth2.googleapis.com/token                            │
│  {                                                                    │
│    code: AUTHORIZATION_CODE,                                         │
│    client_id: GOOGLE_CLIENT_ID,                                      │
│    client_secret: GOOGLE_CLIENT_SECRET,  ← ONLY ON BACKEND!         │
│    redirect_uri: GOOGLE_REDIRECT_URI,                                │
│    grant_type: 'authorization_code'                                  │
│  }                                                                    │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 8. Google returns access_token
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  GET https://www.googleapis.com/oauth2/v2/userinfo                   │
│  Authorization: Bearer ACCESS_TOKEN                                   │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 9. Google returns user info
       │    { email, name, picture }
       │
       ▼
┌──────────────┐
│  Database    │
│  Check       │
└──────┬───────┘
       │
       ├─── User EXISTS ───┐
       │                   │
       │                   ▼
       │            ┌──────────────┐
       │            │  Update user │
       │            │  profile     │
       │            └──────┬───────┘
       │                   │
       └─── User NOT EXISTS ┐
                           │
                           ▼
                    ┌──────────────┐
                    │  Create new  │
                    │  user        │
                    │  (auto-      │
                    │  signup)     │
                    └──────┬───────┘
                           │
       ┌───────────────────┘
       │
       │ 10. Generate JWT token
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  jwt_token = create_access_token(                                    │
│    data={'sub': user.email},                                         │
│    expires_delta=timedelta(minutes=30)                               │
│  )                                                                    │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 11. Redirect to frontend with token
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  RedirectResponse(                                                    │
│    url='http://localhost:5173/dashboard?token=JWT_TOKEN'            │
│  )                                                                    │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 12. Browser navigates to frontend
       │
       ▼
┌──────────────┐
│   Frontend   │
│  Dashboard   │
└──────┬───────┘
       │
       │ 13. Extract token from URL
       │     const token = searchParams.get('token')
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  localStorage.setItem('token', token)                                │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 14. Remove token from URL
       │     navigate('/dashboard', { replace: true })
       │
       ▼
┌──────────────────────────────────────────────────────────────────────┐
│  window.location.reload()  // Reload to fetch user data              │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 15. User is logged in!
       │
       ▼
┌──────────────┐
│  Dashboard   │
│  Loaded      │
│  ✅          │
└──────────────┘
```

---

## 🔐 Security Highlights

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                               │
└─────────────────────────────────────────────────────────────────────┘

1. CLIENT SECRET
   ├─ Stored ONLY in backend .env
   ├─ NEVER sent to frontend
   └─ Used ONLY in server-to-server communication

2. AUTHORIZATION CODE
   ├─ Short-lived (seconds)
   ├─ Single-use only
   └─ Exchanged on backend

3. ACCESS TOKEN
   ├─ Used ONLY on backend
   ├─ Never exposed to frontend
   └─ Fetches user info from Google

4. JWT TOKEN
   ├─ Generated by backend
   ├─ Sent to frontend
   ├─ Stored in localStorage
   └─ Used for API authentication

5. HTTPS (Production)
   ├─ All communication encrypted
   ├─ Prevents token interception
   └─ Required for OAuth
```

---

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

Google → Backend:
  ├─ Authorization Code
  ├─ Access Token
  └─ User Info { email, name, picture }

Backend → Database:
  ├─ Check if user exists (by email)
  ├─ Create user if not exists
  └─ Update user profile

Backend → Frontend:
  └─ JWT Token (in URL)

Frontend → localStorage:
  └─ JWT Token (saved)

Frontend → Backend (subsequent requests):
  └─ JWT Token (in Authorization header)
```

---

## 🎯 Key Points

1. **Client Secret NEVER leaves backend**
2. **All OAuth exchanges happen server-side**
3. **Frontend only receives final JWT token**
4. **Token is removed from URL immediately**
5. **Existing email/password auth unchanged**

---

## 🔄 Comparison: Email/Password vs Google OAuth

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EMAIL/PASSWORD LOGIN                              │
└─────────────────────────────────────────────────────────────────────┘

Frontend → Backend:
  POST /auth/login
  { username: email, password: password }
       ↓
Backend checks:
  - User exists?
  - Password correct?
       ↓
Backend returns:
  { access_token: JWT_TOKEN }
       ↓
Frontend saves token
       ↓
User logged in ✅

┌─────────────────────────────────────────────────────────────────────┐
│                      GOOGLE OAUTH LOGIN                              │
└─────────────────────────────────────────────────────────────────────┘

Frontend → Backend:
  GET /auth/google/login
       ↓
Backend → Google:
  Redirect to OAuth consent
       ↓
Google → Backend:
  Callback with code
       ↓
Backend → Google:
  Exchange code for token
       ↓
Google → Backend:
  Return user info
       ↓
Backend checks:
  - User exists? (create if not)
       ↓
Backend → Frontend:
  Redirect with JWT_TOKEN
       ↓
Frontend saves token
       ↓
User logged in ✅
```

---

**Both methods result in the same JWT token for session management!**

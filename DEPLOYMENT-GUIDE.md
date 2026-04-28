# Production Deployment Guide

## Architecture Overview

```
Landing Page (Static)     →    React App (SPA)    →    FastAPI Backend
https://yourapp.com            https://app.yourapp.com    https://api.yourapp.com
```

## Local Development Setup

### 1. Landing Page
```bash
cd landing-page
# Serve with any static server
python -m http.server 8080
# or
npx serve -p 8080
```

**Configuration:** Automatic (detects localhost)
- Links automatically point to `http://localhost:5173`

### 2. React Frontend
```bash
cd frontend
npm install
npm run dev
```

**Environment Variables** (`.env`):
```env
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000
VITE_LANDING_URL=http://localhost:8080
```

### 3. FastAPI Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Environment Variables** (`.env`):
```env
DATABASE_URL=sqlite:///./expenses.db
SECRET_KEY=your-super-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

---

## Production Deployment

### Recommended Platform: Vercel

#### 1. Deploy Landing Page

**Repository:** `landing-page/`

**Vercel Settings:**
- Framework Preset: `Other`
- Build Command: (leave empty)
- Output Directory: `.`
- Install Command: (leave empty)

**Custom Domain:** `yourapp.com`

**No environment variables needed** - production URLs are auto-detected!

---

#### 2. Deploy React Frontend

**Repository:** `frontend/`

**Vercel Settings:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Custom Domain:** `app.yourapp.com`

**Environment Variables:**
```env
VITE_APP_URL=https://app.yourapp.com
VITE_API_URL=https://api.yourapp.com
VITE_LANDING_URL=https://yourapp.com
```

**Important:** Add these in Vercel Dashboard → Settings → Environment Variables

---

#### 3. Deploy FastAPI Backend

**Platform Options:**
- Railway
- Render
- Heroku
- AWS/GCP/Azure

**Example: Railway**

**Repository:** `backend/`

**Railway Settings:**
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Python Version: 3.11+

**Custom Domain:** `api.yourapp.com`

**Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=generate-secure-key-with-openssl-rand-hex-32
FRONTEND_URL=https://app.yourapp.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://api.yourapp.com/auth/google/callback
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Database:** Use Railway PostgreSQL or external provider

---

## Google OAuth Setup (Production)

### 1. Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add Authorized JavaScript origins:
   - `https://yourapp.com`
   - `https://app.yourapp.com`
4. Add Authorized redirect URIs:
   - `https://api.yourapp.com/auth/google/callback`

### 2. Update Environment Variables
- Backend: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

---

## CORS Configuration

### Backend (FastAPI)
Update `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "https://app.yourapp.com"  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Update all environment variables
- [ ] Generate secure SECRET_KEY for backend
- [ ] Configure Google OAuth credentials
- [ ] Set up production database (PostgreSQL)
- [ ] Test all flows locally

### Landing Page
- [ ] Deploy to Vercel
- [ ] Configure custom domain: `yourapp.com`
- [ ] Verify SSL certificate
- [ ] Test CTA buttons redirect to `app.yourapp.com/login`

### React Frontend
- [ ] Deploy to Vercel
- [ ] Configure custom domain: `app.yourapp.com`
- [ ] Add environment variables in Vercel
- [ ] Verify SSL certificate
- [ ] Test login flow
- [ ] Test protected routes
- [ ] Test API communication

### Backend
- [ ] Deploy to Railway/Render
- [ ] Configure custom domain: `api.yourapp.com`
- [ ] Add environment variables
- [ ] Set up production database
- [ ] Run database migrations
- [ ] Verify SSL certificate
- [ ] Test API endpoints
- [ ] Test Google OAuth flow

### Post-Deployment
- [ ] Test complete user journey: Landing → Login → Dashboard
- [ ] Test Google OAuth login
- [ ] Test protected routes
- [ ] Verify API calls work
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Monitor error logs

---

## Troubleshooting

### Issue: CTA buttons don't redirect
**Solution:** Check browser console. Verify `config.js` is loaded before `router.js`

### Issue: API calls fail (CORS error)
**Solution:** 
1. Check backend CORS configuration includes frontend URL
2. Verify `VITE_API_URL` is set correctly
3. Check backend logs for CORS errors

### Issue: Google OAuth fails
**Solution:**
1. Verify Google Cloud Console redirect URIs match exactly
2. Check `GOOGLE_REDIRECT_URI` in backend .env
3. Ensure `FRONTEND_URL` is set correctly
4. Check backend logs for OAuth errors

### Issue: Protected routes don't work
**Solution:**
1. Check localStorage for `expense_token`
2. Verify token is being sent in API requests
3. Check backend JWT validation

### Issue: Environment variables not working
**Solution:**
1. Restart dev server after changing .env
2. In Vercel: Redeploy after adding env vars
3. Verify variable names match exactly (case-sensitive)

---

## Architecture Benefits

✅ **Clean Separation:** Each layer is independent
✅ **Scalable:** Deploy and scale each part separately
✅ **Flexible:** Change one part without affecting others
✅ **Production-Ready:** Environment-based configuration
✅ **SEO-Friendly:** Static landing page for best performance
✅ **Cost-Effective:** Static hosting is cheap/free

---

## File Structure

```
project/
├── landing-page/           # Static HTML/CSS/JS
│   ├── config.js          # Environment-based URLs ✨
│   ├── scripts/
│   │   └── router.js      # Dynamic routing ✨
│   └── index.html
│
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── config/
│   │   │   └── constants.ts  # Environment config ✨
│   │   ├── api/
│   │   │   └── client.ts     # API client ✨
│   │   └── App.tsx           # Routes ✨
│   └── .env               # Environment variables ✨
│
└── backend/               # FastAPI
    ├── app/
    │   ├── core/
    │   │   └── config.py      # Settings ✨
    │   └── main.py            # CORS config ✨
    └── .env               # Environment variables ✨
```

**✨ = Modified for production-ready architecture**

---

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs
3. Verify environment variables
4. Review this guide's troubleshooting section

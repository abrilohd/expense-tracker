# Expense Tracker - Production Deployment Guide

## 🚀 Quick Start

Your expense tracker has 3 separate deployments:
1. **Backend** → Railway
2. **Frontend** → Vercel  
3. **Landing Page** → Vercel

---

## 📋 Production URLs

```
Landing Page: https://expense-tracker-landing-k4qsr35ie-abrsh067-7150s-projects.vercel.app
Frontend App: https://expense-tracker-app-tau-rust.vercel.app
Backend API:  https://expense-tracker-production-419e.up.railway.app
```

---

## 🔧 Railway (Backend) Setup

### 1. Add PostgreSQL Database
```
Railway Dashboard → Your Project → "+ New" → "Database" → "Add PostgreSQL"
```
Wait 30 seconds. `DATABASE_URL` is auto-created.

### 2. Set Environment Variables
Go to **Backend Service → Variables** tab:

```bash
# Required
SECRET_KEY=<run: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://expense-tracker-app-tau-rust.vercel.app

# Optional (Google OAuth)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://expense-tracker-production-419e.up.railway.app/auth/google/callback
FRONTEND_URL=https://expense-tracker-app-tau-rust.vercel.app
```

### 3. Verify Deployment
```bash
curl https://expense-tracker-production-419e.up.railway.app/health
```
Expected: `{"status":"ok","service":"expense-tracker-api"}`

---

## ▲ Vercel (Frontend) Setup

### 1. Set Environment Variables
Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add for **Production**:
```bash
VITE_API_URL=https://expense-tracker-production-419e.up.railway.app
VITE_APP_URL=https://expense-tracker-app-tau-rust.vercel.app
VITE_LANDING_URL=https://expense-tracker-landing-k4qsr35ie-abrsh067-7150s-projects.vercel.app
```

### 2. Redeploy
```
Deployments tab → "..." → "Redeploy"
```

---

## ▲ Vercel (Landing Page) Setup

### No environment variables needed!
Landing page is static HTML/CSS/JS. Already configured in `config.js`.

---

## 🔍 Troubleshooting

### "Backend server is offline"

**Check 1: Is Railway backend running?**
```bash
curl https://expense-tracker-production-419e.up.railway.app/health
```

**Check 2: Are Railway env vars set?**
- Go to Railway → Backend Service → Variables
- Verify `SECRET_KEY` and `ALLOWED_ORIGINS` exist

**Check 3: Are Vercel env vars set?**
- Go to Vercel → Frontend → Settings → Environment Variables
- Verify `VITE_API_URL` is set for Production

**Check 4: Check Railway logs**
- Railway → Backend Service → Logs
- Look for errors on startup

### CORS Errors

Add frontend URL to `ALLOWED_ORIGINS` in Railway:
```bash
ALLOWED_ORIGINS=https://expense-tracker-app-tau-rust.vercel.app
```

### Database Connection Errors

Verify PostgreSQL is added:
- Railway → Your Project → Should see PostgreSQL service
- Backend Service → Variables → `DATABASE_URL` should exist

---

## 📁 Project Structure

```
expense-tracker/
├── backend/              # FastAPI backend → Railway
│   ├── app/
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
├── frontend/             # React frontend → Vercel
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── landing-page/         # Static landing → Vercel
│   ├── index.html
│   ├── config.js
│   └── scripts/
├── railway.json          # Railway config
└── README.md
```

---

## ✅ Deployment Checklist

### Railway (Backend)
- [ ] PostgreSQL database added
- [ ] `SECRET_KEY` environment variable set
- [ ] `ALLOWED_ORIGINS` environment variable set
- [ ] Health endpoint returns 200 OK
- [ ] Logs show no errors

### Vercel (Frontend)
- [ ] `VITE_API_URL` environment variable set
- [ ] `VITE_APP_URL` environment variable set
- [ ] `VITE_LANDING_URL` environment variable set
- [ ] Build succeeds
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard loads

### Vercel (Landing Page)
- [ ] Deployed successfully
- [ ] CTA buttons redirect to frontend
- [ ] Logo links to landing page

---

## 🔐 Security Notes

- Never commit `.env` files
- Generate strong `SECRET_KEY` for production
- Use HTTPS only in production
- Keep `DATABASE_URL` secret
- Rotate secrets regularly

---

## 📞 Support

If you encounter issues:
1. Check Railway logs
2. Check Vercel deployment logs
3. Check browser DevTools console
4. Verify all environment variables are set correctly

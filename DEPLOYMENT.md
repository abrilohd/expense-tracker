# Deployment Guide - Expense Tracker App

## Project Structure

```
my-project/
├── antigravity.config.json    ← Antigravity configuration
├── vercel.json                 ← Vercel configuration
├── DEPLOYMENT.md               ← This file
├── shared/
│   └── nav.js                  ← Shared navigation component
├── landing-page/
│   ├── index.html              ← Landing page (root /)
│   ├── _redirects              ← Netlify/Vercel redirects
│   ├── .htaccess               ← Apache configuration
│   ├── assets/
│   ├── scripts/
│   └── styles/
├── frontend/
│   ├── index.html              ← Expense tracker app (/app)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── app/
    ├── requirements.txt
    └── README.md
```

---

## Route Structure

| Route | Destination | Description |
|-------|-------------|-------------|
| `/` | `landing-page/index.html` | Landing page (home) |
| `/app` | `frontend/index.html` | Expense tracker app |
| `/app/*` | `frontend/` | App sub-routes (SPA) |
| `/api/*` | `backend/` | Backend API endpoints |

---

## Deployment Options

### Option 1: Antigravity (Recommended)

**Prerequisites**:
- Antigravity CLI installed
- Project configured with `antigravity.config.json`

**Steps**:
```bash
# 1. Install dependencies
cd frontend
npm install
cd ..

cd backend
pip install -r requirements.txt
cd ..

# 2. Build frontend
cd frontend
npm run build
cd ..

# 3. Deploy to Antigravity
antigravity deploy

# 4. Set environment variables
antigravity env set VITE_API_URL=/api
antigravity env set NODE_ENV=production
```

**Configuration**: `antigravity.config.json`
- Routes configured for landing page, app, and API
- Security headers included
- Build commands specified

---

### Option 2: Vercel

**Prerequisites**:
- Vercel CLI installed or GitHub integration
- `vercel.json` configured

**Steps**:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Deploy to production
vercel --prod
```

**Configuration**: `vercel.json`
- Routes configured
- Security headers included
- Static build for frontend

**Environment Variables** (set in Vercel dashboard):
- `VITE_API_URL=/api`
- `NODE_ENV=production`

---

### Option 3: Netlify

**Prerequisites**:
- Netlify CLI installed or GitHub integration
- `_redirects` file in `landing-page/`

**Steps**:
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Initialize site
netlify init

# 4. Deploy
netlify deploy

# 5. Deploy to production
netlify deploy --prod
```

**Configuration**: `landing-page/_redirects`
- Redirects configured for all routes
- SPA fallback included

**Build Settings** (in Netlify dashboard):
- Build command: `cd frontend && npm run build`
- Publish directory: `landing-page`
- Functions directory: `backend` (if using Netlify Functions)

---

### Option 4: Apache Server

**Prerequisites**:
- Apache server with mod_rewrite enabled
- `.htaccess` file in `landing-page/`

**Steps**:
```bash
# 1. Build frontend
cd frontend
npm run build
cd ..

# 2. Copy files to server
scp -r landing-page/ user@server:/var/www/html/
scp -r frontend/dist/ user@server:/var/www/html/frontend/
scp -r backend/ user@server:/var/www/html/backend/

# 3. Enable mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2

# 4. Set permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

**Configuration**: `landing-page/.htaccess`
- URL rewriting configured
- Security headers included
- Cache control configured
- HTTPS redirect enabled

---

## Environment Variables

### Frontend (`frontend/.env.production`)
```env
VITE_API_URL=/api
NODE_ENV=production
```

### Backend (`backend/.env`)
```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Pre-Deployment Checklist

### Frontend
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production build
- [ ] All routes work correctly
- [ ] API calls use correct `/api` prefix
- [ ] Environment variables set

### Backend
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] Database migrations run
- [ ] CORS configured for production domain
- [ ] Environment variables set
- [ ] API endpoints tested

### Landing Page
- [ ] All links use absolute paths (`/app`, not `../frontend`)
- [ ] Images load correctly
- [ ] Videos load correctly
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] Accessibility tested

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] API authentication working
- [ ] No sensitive data in client code

---

## Post-Deployment Testing

### Smoke Tests
```bash
# 1. Landing page loads
curl https://yourdomain.com/

# 2. App loads
curl https://yourdomain.com/app

# 3. API responds
curl https://yourdomain.com/api/health

# 4. Redirects work
curl -I https://yourdomain.com/app/dashboard
```

### Manual Tests
- [ ] Navigate from landing page to app
- [ ] Navigate from app back to landing page
- [ ] Test all CTA buttons
- [ ] Test navigation links
- [ ] Test theme toggle
- [ ] Test mobile menu
- [ ] Test on mobile device
- [ ] Test in different browsers

---

## Troubleshooting

### Issue: 404 on `/app` routes
**Solution**: Ensure SPA fallback is configured in your hosting platform

### Issue: API calls fail
**Solution**: Check CORS configuration and API URL environment variable

### Issue: Assets not loading
**Solution**: Verify asset paths are absolute, not relative

### Issue: Theme toggle not persisting
**Solution**: Check localStorage is enabled and not blocked

### Issue: Mobile menu not working
**Solution**: Verify JavaScript is loading correctly

---

## Monitoring & Analytics

### Recommended Tools
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Plausible
- **Error Tracking**: Sentry, LogRocket
- **Performance**: Lighthouse CI, WebPageTest

### Key Metrics to Monitor
- Page load time (< 3s)
- Time to Interactive (< 5s)
- API response time (< 500ms)
- Error rate (< 1%)
- Uptime (> 99.9%)

---

## Rollback Procedure

### Antigravity
```bash
antigravity rollback --version previous
```

### Vercel
```bash
vercel rollback
```

### Netlify
```bash
netlify rollback
```

### Manual
```bash
# Restore from backup
scp -r backup/ user@server:/var/www/html/
```

---

## Support & Resources

- **Antigravity Docs**: [antigravity.dev/docs](https://antigravity.dev/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Apache Docs**: [httpd.apache.org/docs](https://httpd.apache.org/docs)

---

**Last Updated**: Production Deployment Configuration  
**Status**: Ready for Deployment ✅

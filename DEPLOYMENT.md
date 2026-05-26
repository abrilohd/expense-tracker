# Deployment Guide

Complete guide for deploying the Expense Tracker application to production.

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] CHANGELOG updated

### Security
- [ ] Strong SECRET_KEY generated
- [ ] Environment variables configured
- [ ] No secrets in code
- [ ] CORS origins restricted
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Dependencies updated

### Performance
- [ ] Frontend build optimized
- [ ] Images optimized
- [ ] Database indexed
- [ ] Caching configured
- [ ] Bundle size acceptable

### Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile responsive verified
- [ ] Load testing performed
- [ ] Security audit completed

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Recommended for:** Quick deployment, automatic scaling, minimal configuration

### Option 2: Netlify (Frontend) + Render (Backend)

**Recommended for:** Free tier, good performance, easy setup

### Option 3: AWS/GCP/Azure

**Recommended for:** Enterprise, full control, custom requirements

---

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Code pushed to GitHub repository

### Steps

1. **Prepare Frontend**

```bash
cd frontend

# Test production build locally
npm run build
npm run preview

# Verify build works correctly
```

2. **Connect to Vercel**

```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Or use Vercel Dashboard:
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Select `frontend` as root directory

3. **Configure Build Settings**

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

4. **Add Environment Variables**

In Vercel Dashboard > Settings > Environment Variables:

```
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_URL=https://your-app.vercel.app
VITE_LANDING_URL=https://your-landing.vercel.app
```

5. **Deploy**

- Click "Deploy"
- Wait for build to complete
- Visit your deployed URL

6. **Custom Domain (Optional)**

- Go to Settings > Domains
- Add your custom domain
- Configure DNS records as instructed

### Vercel Configuration File

Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Backend Deployment (Railway)

### Prerequisites
- GitHub account
- Railway account (free tier available)
- PostgreSQL database

### Steps

1. **Prepare Backend**

```bash
cd backend

# Test locally with PostgreSQL
# Update .env with PostgreSQL URL
# Run migrations
python scripts/migrate.py

# Test server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

2. **Create Railway Project**

- Go to https://railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Select `backend` as root directory

3. **Add PostgreSQL Database**

- In Railway project, click "New"
- Select "Database" > "PostgreSQL"
- Railway will create database and provide connection URL

4. **Configure Environment Variables**

In Railway > Variables tab:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=your-generated-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=https://your-frontend.vercel.app
RESEND_API_KEY=your-resend-key (optional)
FROM_EMAIL=noreply@yourdomain.com (optional)
```

5. **Configure Build Settings**

Create `backend/railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Or create `backend/Procfile`:

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

6. **Deploy**

- Railway will automatically deploy
- Monitor logs for any errors
- Visit the generated URL

7. **Run Migrations**

After first deployment:

```bash
# Connect to Railway shell
railway run python scripts/migrate.py

# Create admin user
railway run python scripts/create_admin.py
```

Or use Railway's web terminal.

8. **Custom Domain (Optional)**

- Go to Settings > Domains
- Add custom domain
- Configure DNS records

---

## Alternative: Render Deployment

### Backend on Render

1. **Create Web Service**

- Go to https://render.com
- Click "New" > "Web Service"
- Connect GitHub repository
- Select `backend` directory

2. **Configure Service**

```
Name: expense-tracker-api
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

3. **Add PostgreSQL Database**

- Click "New" > "PostgreSQL"
- Connect to your web service
- Copy internal database URL

4. **Environment Variables**

```
DATABASE_URL=<internal-database-url>
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-frontend.onrender.com
```

5. **Deploy**

- Click "Create Web Service"
- Wait for deployment

---

## Database Migration

### From SQLite to PostgreSQL

1. **Export SQLite Data**

```bash
cd backend

# Create backup
sqlite3 expenses.db .dump > backup.sql
```

2. **Import to PostgreSQL**

```bash
# Connect to PostgreSQL
psql $DATABASE_URL

# Import data (may need adjustments)
\i backup.sql
```

3. **Run Migrations**

```bash
python scripts/migrate.py
```

4. **Verify Data**

```bash
# Check tables
psql $DATABASE_URL -c "\dt"

# Check user count
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Test backend health
curl https://your-backend-url.railway.app/

# Test frontend
curl https://your-app.vercel.app/

# Test API endpoint
curl https://your-backend-url.railway.app/docs
```

### 2. Create Admin User

```bash
# Using Railway CLI
railway run python scripts/create_admin.py

# Or via web terminal in Railway dashboard
```

### 3. Test Critical Flows

- [ ] User registration
- [ ] User login
- [ ] Add expense
- [ ] View dashboard
- [ ] Generate report
- [ ] Admin access (if applicable)

### 4. Monitor Logs

**Vercel:**
- Dashboard > Deployments > View Logs

**Railway:**
- Dashboard > Deployments > View Logs

### 5. Set Up Monitoring

**Recommended Tools:**
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Uptime Robot](https://uptimerobot.com) - Uptime monitoring

---

## Environment-Specific Configuration

### Development

```env
# Backend
DATABASE_URL=sqlite:///./expenses.db
DEBUG=True
CORS_ORIGINS=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:8000
```

### Staging

```env
# Backend
DATABASE_URL=postgresql://staging-db-url
DEBUG=False
CORS_ORIGINS=https://staging.yourdomain.com

# Frontend
VITE_API_URL=https://api-staging.yourdomain.com
```

### Production

```env
# Backend
DATABASE_URL=postgresql://production-db-url
DEBUG=False
CORS_ORIGINS=https://yourdomain.com
SECRET_KEY=strong-random-key

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

---

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel Dashboard
2. Select your project
3. Go to Deployments
4. Find previous working deployment
5. Click "..." > "Promote to Production"

### Railway Rollback

1. Go to Railway Dashboard
2. Select your project
3. Go to Deployments
4. Find previous working deployment
5. Click "Redeploy"

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql

# Or use Railway/Render backup features
```

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## SSL/HTTPS

### Vercel
- Automatic SSL certificates
- HTTPS enforced by default

### Railway
- Automatic SSL certificates
- HTTPS enforced by default

### Custom Domain
- Configure DNS A/CNAME records
- SSL certificates auto-generated
- Force HTTPS redirect

---

## Performance Optimization

### Frontend

1. **Enable Compression**
   - Vercel enables gzip/brotli automatically

2. **CDN**
   - Vercel uses global CDN automatically

3. **Caching**
   - Configure cache headers in `vercel.json`

### Backend

1. **Database Connection Pooling**

```python
# backend/app/db/database.py
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)
```

2. **Add Indexes**

```python
# Ensure indexes exist
python scripts/migrate.py
```

3. **Enable Caching** (Optional)

```python
# Install redis
pip install redis

# Add caching layer
from redis import Redis
cache = Redis(host='localhost', port=6379)
```

---

## Monitoring & Logging

### Application Monitoring

```python
# backend/app/main.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response
```

### Error Tracking

```typescript
// frontend/src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "your-sentry-dsn",
    environment: "production",
  });
}
```

---

## Backup Strategy

### Database Backups

**Railway:**
- Automatic daily backups
- Manual backups available
- Point-in-time recovery

**Render:**
- Automatic daily backups (paid plans)
- Manual backups via dashboard

**Manual Backup:**

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240115.sql
```

### Backup Schedule

- **Daily**: Automatic database backups
- **Weekly**: Full system backup
- **Before deployment**: Manual backup
- **Retention**: 30 days minimum

---

## Troubleshooting

### Build Fails

1. Check build logs
2. Verify dependencies installed
3. Check environment variables
4. Test build locally

### Database Connection Fails

1. Verify DATABASE_URL format
2. Check database is running
3. Verify network connectivity
4. Check connection pool settings

### CORS Errors

1. Verify CORS_ORIGINS includes frontend URL
2. Check protocol (http vs https)
3. Ensure no trailing slashes
4. Restart backend after changes

### 502/503 Errors

1. Check backend logs
2. Verify backend is running
3. Check database connection
4. Verify environment variables

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong SECRET_KEY
- [ ] CORS properly configured
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting (recommended)
- [ ] Security headers set
- [ ] Dependencies updated
- [ ] Secrets not in code
- [ ] Database backups enabled
- [ ] Error messages don't leak info

---

## Cost Estimation

### Free Tier (Hobby Projects)

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Custom domains

**Railway:**
- $5 free credit/month
- ~500 hours runtime
- 1GB RAM, 1 vCPU

**Total:** ~$0-5/month

### Production (Small Business)

**Vercel Pro:** $20/month
**Railway Pro:** $20/month
**Database:** Included
**Total:** ~$40/month

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## Next Steps

1. Deploy to staging environment
2. Test thoroughly
3. Deploy to production
4. Monitor for issues
5. Set up alerts
6. Document any custom configurations
7. Train team on deployment process

---

For more information, see [DEVELOPMENT.md](./DEVELOPMENT.md) and [ENVIRONMENT.md](./ENVIRONMENT.md).

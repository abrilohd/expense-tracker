# Railway Deployment Guide

## Prerequisites
- GitHub repository with your code
- Railway account (https://railway.app)

## Step 1: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `expense-tracker` repository
5. Railway will detect the backend automatically

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically:
   - Create a PostgreSQL database
   - Generate a `DATABASE_URL` environment variable
   - Link it to your backend service

## Step 3: Configure Environment Variables

In Railway dashboard, go to your backend service → Variables tab.

Add these environment variables:

```bash
# Database (automatically provided by Railway when you add PostgreSQL)
DATABASE_URL=<automatically set by Railway>

# JWT Authentication
SECRET_KEY=<generate with: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins (add your Vercel frontend URL)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/auth/google/callback
FRONTEND_URL=https://your-frontend.vercel.app
```

## Step 4: Update Google OAuth Redirect URIs

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://your-backend.railway.app/auth/google/callback`
4. Add authorized JavaScript origins:
   - `https://your-frontend.vercel.app`
   - `https://your-backend.railway.app`

## Step 5: Deploy

1. Railway will automatically deploy when you push to GitHub
2. Check deployment logs for any errors
3. Once deployed, test the health endpoint:
   ```bash
   curl https://your-backend.railway.app/health
   ```
   Expected response: `{"status":"ok","service":"expense-tracker-api"}`

## Troubleshooting

### Error: "No module named 'jose'"
**Solution:** Ensure `python-jose[cryptography]==3.3.0` is in `requirements.txt`

### Error: "Could not connect to database"
**Solution:** 
1. Verify PostgreSQL is added to your Railway project
2. Check that `DATABASE_URL` environment variable exists
3. The app automatically converts `postgres://` to `postgresql://`

### Error: "CORS policy blocked"
**Solution:** Add your Vercel frontend URL to `ALLOWED_ORIGINS` environment variable

### Database tables not created
**Solution:** Tables are created automatically on startup via the `lifespan` function in `main.py`

## Monitoring

- View logs: Railway dashboard → Your service → Logs tab
- Check metrics: Railway dashboard → Your service → Metrics tab
- Database queries: Railway dashboard → PostgreSQL → Query tab

## Updating Deployment

Push changes to GitHub:
```bash
git add .
git commit -m "your changes"
git push origin main
```

Railway will automatically redeploy.

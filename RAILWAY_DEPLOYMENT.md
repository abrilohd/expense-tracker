# Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### Step 1: Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `expense-tracker` repository
5. Select the `expens-eth` branch

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a `DATABASE_URL` environment variable

### Step 3: Configure Environment Variables

Go to your backend service → Variables tab and add:

#### Required Variables:
```bash
# Database (automatically provided by Railway PostgreSQL)
DATABASE_URL=postgresql://...  # Auto-generated, don't change

# JWT Secret (IMPORTANT: Generate a secure key!)
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins (Add your Vercel frontend URL)
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173

# Frontend URL (Your Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app

# Debug Mode
DEBUG=False
```

#### Admin User Creation (Optional but Recommended):
```bash
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_NAME=Admin User
```

**Note:** If you set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, an admin user will be automatically created on first deployment.

#### Optional - Google OAuth:
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://your-railway-app.railway.app/auth/google/callback
```

#### Optional - Email Service (Resend):
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
EMAIL_SERVICE=resend
```

### Step 4: Deploy

1. Railway will automatically deploy when you push to the `expens-eth` branch
2. Check the deployment logs for:
   ```
   🚀 Starting Expense Tracker API...
   📊 Initializing database...
   ✅ Database tables created
   👤 Creating admin user...
   ✅ Created admin: admin@yourdomain.com
   🌐 Starting uvicorn server...
   ```

### Step 5: Get Your Backend URL

1. Go to your backend service in Railway
2. Click "Settings" → "Networking"
3. Click "Generate Domain"
4. Copy the URL (e.g., `https://your-app.railway.app`)

### Step 6: Update Frontend Environment Variables

In your Vercel project, set:
```bash
VITE_API_URL=https://your-app.railway.app
```

---

## 🔐 Creating Admin User

### Method 1: Automatic (Recommended)
Set environment variables in Railway:
```bash
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_NAME=Admin User
```

Admin will be created automatically on next deployment.

### Method 2: Manual (After Deployment)
If you didn't set admin environment variables, you can create an admin manually:

1. Connect to Railway shell:
   ```bash
   railway run bash
   ```

2. Run the admin creation script:
   ```bash
   python backend/scripts/create_admin.py
   ```

3. Follow the prompts to enter email and password

### Method 3: Update Existing User to Admin
If you already registered a user and want to make them admin:

1. Connect to Railway PostgreSQL:
   ```bash
   railway connect postgres
   ```

2. Run SQL:
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
   ```

---

## 🔍 Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is set (Railway auto-generates this)
- Check if PostgreSQL service is running
- Verify the URL starts with `postgresql://` (not `postgres://`)

### Admin Not Created
- Check Railway logs for admin creation messages
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
- Ensure password is at least 8 characters

### CORS Errors
- Add your Vercel frontend URL to `ALLOWED_ORIGINS`
- Format: `https://your-app.vercel.app` (no trailing slash)
- Multiple origins: separate with commas, no spaces

### Models Not Found Error
- This is fixed by importing all models in `app/models/__init__.py`
- The `start.sh` script now imports `from app.models import *`

---

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | Auto | PostgreSQL connection string |
| `SECRET_KEY` | Yes | - | JWT secret key (generate secure key!) |
| `ALLOWED_ORIGINS` | Yes | - | Comma-separated frontend URLs |
| `FRONTEND_URL` | Yes | - | Main frontend URL |
| `ADMIN_EMAIL` | No | - | Auto-create admin with this email |
| `ADMIN_PASSWORD` | No | - | Admin password (min 8 chars) |
| `ADMIN_NAME` | No | Admin User | Admin display name |
| `DEBUG` | No | False | Enable debug mode |
| `ALGORITHM` | No | HS256 | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | 30 | Token expiration time |

---

## ✅ Deployment Checklist

- [ ] PostgreSQL database added to Railway project
- [ ] `SECRET_KEY` set to a secure random string
- [ ] `ALLOWED_ORIGINS` includes your Vercel frontend URL
- [ ] `FRONTEND_URL` set to your Vercel URL
- [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD` set (optional)
- [ ] Deployment successful (check logs)
- [ ] Admin user created (check logs)
- [ ] Backend URL copied
- [ ] Frontend `VITE_API_URL` updated in Vercel
- [ ] Test login from frontend

---

## 🎉 Success!

Your backend is now deployed on Railway with:
- ✅ PostgreSQL database
- ✅ Automatic table creation
- ✅ Admin user (if configured)
- ✅ CORS configured for your frontend
- ✅ Ready for production use

Next: Deploy your frontend to Vercel and update `VITE_API_URL` to point to your Railway backend URL.

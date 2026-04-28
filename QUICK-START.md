# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

---

## Local Development

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd expense-tracker
```

### 2. Backend Setup (Terminal 1)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and add your Google OAuth credentials (optional)
# GOOGLE_CLIENT_ID=your_client_id
# GOOGLE_CLIENT_SECRET=your_client_secret

# Start backend server
uvicorn app.main:app --reload --port 8000
```

**Backend running at:** `http://localhost:8000`

---

### 3. Frontend Setup (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start frontend dev server
npm run dev
```

**Frontend running at:** `http://localhost:5173`

---

### 4. Landing Page Setup (Terminal 3)

```bash
cd landing-page

# Start static server
python -m http.server 8080

# Or use npx serve
npx serve -p 8080
```

**Landing page running at:** `http://localhost:8080`

---

## ✅ Test the Flow

1. **Open landing page:** http://localhost:8080
2. **Click "Get Started"** → Should redirect to http://localhost:5173/login
3. **Register a new account** or **Login**
4. **Should redirect to dashboard** at http://localhost:5173/dashboard
5. **Dashboard loads data** from http://localhost:8000

---

## 🎯 Default Test User

If you want to create a test user:

```bash
# In the frontend login page
Email: test@example.com
Password: password123
```

Or use the Register page to create a new account.

---

## 🔧 Configuration Files

All configuration is automatic for local development!

### Landing Page
- `config.js` - Auto-detects localhost
- No manual configuration needed ✅

### Frontend
- `.env` - Already configured for localhost
```env
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000
VITE_LANDING_URL=http://localhost:8080
```

### Backend
- `.env` - Already configured for localhost
```env
DATABASE_URL=sqlite:///./expenses.db
SECRET_KEY=your-super-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Make sure virtual environment is activated
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Landing page CTA doesn't work
- Check browser console for errors
- Verify `config.js` is loaded (check Network tab)
- Make sure frontend is running on port 5173

### API calls fail
- Check backend is running on port 8000
- Check browser console for CORS errors
- Verify `VITE_API_URL` in frontend/.env

---

## 📱 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Landing Page | http://localhost:8080 | Marketing site |
| Frontend App | http://localhost:5173 | Dashboard/App |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Swagger UI |

---

## 🎨 Features to Test

### Landing Page
- [x] Click "Get Started" buttons
- [x] Navigate between sections
- [x] Toggle dark/light mode
- [x] Responsive design

### Frontend App
- [x] Register new account
- [x] Login with email/password
- [x] Google OAuth login (if configured)
- [x] View dashboard
- [x] Add expenses
- [x] View expense list
- [x] View insights
- [x] Toggle dark/light mode
- [x] Logout

### Backend API
- [x] Visit http://localhost:8000/docs
- [x] Test API endpoints
- [x] Check authentication

---

## 🚀 Next Steps

1. ✅ Get everything running locally
2. ✅ Test the complete user flow
3. ✅ Customize branding and content
4. ✅ Set up Google OAuth (optional)
5. ✅ Review DEPLOYMENT-GUIDE.md for production
6. ✅ Deploy to Vercel/Railway

---

## 📚 Documentation

- `DEPLOYMENT-GUIDE.md` - Production deployment
- `CLEAN-ARCHITECTURE-IMPLEMENTATION.md` - Architecture details
- `ARCHITECTURE-SUMMARY.md` - System overview
- `ROUTING-VERIFICATION.md` - Testing checklist

---

## 💡 Tips

- **Use different browsers** to test logged-in and logged-out states
- **Check browser console** for any errors
- **Use backend API docs** at http://localhost:8000/docs to test endpoints
- **Clear localStorage** to test logged-out state: `localStorage.clear()`

---

## 🎉 You're Ready!

Everything is configured and ready to run. Just start the three servers and test the flow!

**Questions?** Check the troubleshooting section or review the documentation files.

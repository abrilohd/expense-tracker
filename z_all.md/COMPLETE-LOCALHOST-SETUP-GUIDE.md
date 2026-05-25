# 🚀 COMPLETE LOCALHOST SETUP GUIDE

## Overview
This guide shows you how to run the complete ExpenseTracker system locally with proper routing between all components.

---

## 📋 Prerequisites

- **Node.js** (v16+) - For React frontend
- **Python** (v3.8+) - For FastAPI backend
- **VS Code** with Live Server extension - For HTML landing page

---

## 🎯 STEP 1: Run Landing Page (Port 5500)

The landing page is pure HTML/CSS/JavaScript (not React).

### Option A: VS Code Live Server (RECOMMENDED)

1. **Install Live Server Extension**:
   - Open VS Code Extensions (Ctrl+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

2. **Start Landing Page**:
   - In VS Code, right-click on `landing-page/index.html`
   - Select **"Open with Live Server"**
   - Browser opens automatically at `http://127.0.0.1:5500/landing-page/index.html`

3. **Access at**:
   ```
   http://localhost:5500/landing-page/index.html
   ```

### Option B: Python HTTP Server

1. **Open Terminal in `landing-page/` folder**

2. **Run**:
   ```bash
   python -m http.server 5500
   ```

3. **Open Browser**:
   ```
   http://localhost:5500/index.html
   ```

### ✅ Landing Page Running
- URL: `http://localhost:5500/landing-page/index.html` (Live Server)
- URL: `http://localhost:5500/index.html` (Python server)
- Features: Hero section, features, CTA buttons
- CTA buttons will redirect to `http://localhost:5173/register`

---

## 🎯 STEP 2: Run Backend API (Port 8000)

1. **Open Terminal in `backend/` folder**

2. **Activate Virtual Environment**:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies** (if not already):
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Backend**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### ✅ Backend Running
- URL: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

---

## 🎯 STEP 3: Run Frontend App (Port 5173)

1. **Open Terminal in `frontend/` folder**

2. **Install Dependencies** (if not already):
   ```bash
   npm install
   ```

3. **Run Frontend**:
   ```bash
   npm run dev
   ```

### ✅ Frontend Running
- URL: `http://localhost:5173`
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`
- Dashboard: `http://localhost:5173/` (after login)

---

## 🔄 COMPLETE LOCALHOST FLOW

### User Journey:

```
1. Landing Page (localhost:5500/landing-page/index.html)
   ↓ Click "Get Started" or "Sign Up"
   
2. Register Page (localhost:5173/register)
   ↓ Click "Back" button
   ← Returns to Landing Page (localhost:5500)
   ↓ Fill form and register
   
3. Dashboard (localhost:5173/)
   ↓ Use the app
   
4. Logout
   ↓ Redirects to Login (localhost:5173/login)
   ↓ Click "Back" button
   
5. Landing Page (localhost:5500/landing-page/index.html)
```

---

## 🧪 TESTING THE ROUTING

### Test 1: Landing → Register
1. Go to `http://localhost:5500/landing-page/index.html`
2. Click "Get Started" button
3. **Expected**: Redirects to `http://localhost:5173/register`
4. ✅ **Pass**: URL is localhost:5173/register

### Test 2: Register → Landing
1. On Register page (`http://localhost:5173/register`)
2. Click "Back" button (top-left with arrow)
3. **Expected**: Redirects to `http://localhost:5500/landing-page/index.html`
4. ✅ **Pass**: Back to landing page

### Test 3: Login → Landing
1. Go to `http://localhost:5173/login`
2. Click "Back" button
3. **Expected**: Redirects to `http://localhost:5500/landing-page/index.html`
4. ✅ **Pass**: Back to landing page

### Test 4: Logout → Login
1. Login to dashboard
2. Click "Log out" in sidebar
3. **Expected**: Redirects to `http://localhost:5173/login`
4. ✅ **Pass**: On login page (not external Vercel URL)

---

## 🐛 TROUBLESHOOTING

### Landing Page Not Loading
- **Issue**: Can't access localhost:5500
- **Fix**: Make sure Live Server is running or Python HTTP server is active
- **Check**: Look for "Live Server" in VS Code status bar (bottom-right)

### Frontend Not Connecting to Backend
- **Issue**: API errors, "Backend server is offline"
- **Fix**: Make sure backend is running on port 8000
- **Check**: Visit `http://localhost:8000/docs` - should show API documentation

### CTA Buttons Go to Vercel
- **Issue**: Landing page buttons redirect to production
- **Fix**: Clear browser cache and reload
- **Check**: Open browser console, should see "Environment: LOCALHOST"

### Back Button Goes to Vercel
- **Issue**: Login/Register back button goes to production
- **Fix**: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- **Check**: Inspect back button href, should be `http://localhost:5500`

---

## 📝 QUICK START COMMANDS

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3 - Landing Page (Optional - if not using Live Server)
```bash
cd landing-page
python -m http.server 5500
```

---

## 🎨 PORTS SUMMARY

| Component | Port | URL |
|-----------|------|-----|
| Landing Page | 5500 | http://localhost:5500/landing-page/index.html |
| Frontend App | 5173 | http://localhost:5173 |
| Backend API | 8000 | http://localhost:8000 |

---

## ✅ VERIFICATION CHECKLIST

- [ ] Landing page loads at localhost:5500
- [ ] Backend API docs load at localhost:8000/docs
- [ ] Frontend app loads at localhost:5173
- [ ] Landing "Get Started" → Goes to localhost:5173/register
- [ ] Register "Back" → Goes to localhost:5500
- [ ] Login "Back" → Goes to localhost:5500
- [ ] Dashboard "Logout" → Goes to localhost:5173/login
- [ ] All routing stays within localhost (no Vercel redirects)

---

## 🚀 NEXT: ADMIN PAGE SETUP

Once all three components are running correctly, we'll set up the admin page to:
- View all users
- Manage user accounts
- View system statistics
- Access admin-only features

Ready to continue with admin setup? ✅

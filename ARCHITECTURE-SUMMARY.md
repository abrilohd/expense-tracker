# Clean Architecture Summary

## Three Independent Layers

### 1. Landing Page (Static HTML/CSS/JS)
**Location:** `landing-page/`
**Purpose:** Marketing and user acquisition
**Technology:** Pure HTML, CSS, JavaScript

**CTA Links:**
- All "Get Started" buttons → `http://localhost:5173/login`
- Navigation CTA → `http://localhost:5173/login`
- Hero CTA → `http://localhost:5173/login`
- Footer CTA → `http://localhost:5173/login`
- Bottom CTA → `http://localhost:5173/login`

### 2. React Frontend (Dashboard App)
**Location:** `frontend/`
**Purpose:** Authenticated user dashboard and expense management
**Technology:** React + TypeScript + Vite
**Dev Server:** `http://localhost:5173`

**Routes:**
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/signup` - Alias to `/register` (public)
- `/` - Dashboard (protected, redirects to `/login` if not authenticated)
- `/dashboard` - Dashboard (protected, same as `/`)
- `/expenses` - Expense list (protected)
- `/expenses/add` - Add expense (protected)
- `/insights` - Spending insights (protected)

**Protected Route Logic:**
- If user is NOT authenticated → redirect to `/login`
- If user IS authenticated on public routes → redirect to `/dashboard`

**API Communication:**
- Backend URL: `http://localhost:8000`
- Configured in: `frontend/.env`
- Environment variable: `VITE_API_URL`

### 3. FastAPI Backend
**Location:** `backend/`
**Purpose:** REST API for data management and authentication
**Technology:** FastAPI + Python
**Dev Server:** `http://localhost:8000`

**CORS Configuration:**
- Allows: `http://localhost:5173` (React dev server)
- Allows: `http://localhost:3000` (Alternative React port)

**API Endpoints:**
- `/auth/*` - Authentication endpoints
- `/expenses/*` - Expense management
- `/dashboard/*` - Dashboard data
- `/insights/*` - Spending insights

## Connection Flow

```
Landing Page (Static)
    ↓ (User clicks "Get Started")
    ↓ http://localhost:5173/login
    ↓
React Frontend
    ↓ (User logs in)
    ↓ POST http://localhost:8000/auth/login
    ↓
FastAPI Backend
    ↓ (Returns JWT token)
    ↓
React Frontend (Authenticated)
    ↓ (All API calls include JWT token)
    ↓ http://localhost:8000/expenses/*
    ↓ http://localhost:8000/dashboard/*
    ↓ http://localhost:8000/insights/*
    ↓
FastAPI Backend
```

## Key Principles

✅ **Independence:** Each layer is completely independent
✅ **No Code Mixing:** Landing page and React app are separate codebases
✅ **URL-Based Connection:** Landing page links to React app via URL
✅ **API-Based Communication:** React app communicates with backend via REST API
✅ **Protected Routes:** Dashboard requires authentication
✅ **Clean Separation:** Static marketing → Dynamic app → Data layer

## Development Servers

Start all three layers independently:

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Landing Page (optional - can use any static server)
cd landing-page
python -m http.server 8080
```

## Production Deployment

Each layer can be deployed independently:
- **Landing Page:** Static hosting (Netlify, Vercel, S3, etc.)
- **React Frontend:** Static hosting with SPA routing (Vercel, Netlify, etc.)
- **Backend:** Python hosting (Railway, Heroku, AWS, etc.)

Update URLs in production:
- Landing page CTAs → Production React URL
- React `.env` → Production backend URL
- Backend CORS → Production React URL

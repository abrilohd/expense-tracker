# Logo Link Setup - Development vs Production

## The Issue

In development, the frontend (React app) and landing page (static HTML) are separate:
- Frontend: `http://localhost:5173` (Vite dev server)
- Landing page: `file:///path/to/landing-page/index.html` (static HTML file)

They can't easily link to each other because they're served differently.

## Solutions

### Option 1: Open Landing Page Directly (Current Setup)

The logo tries to navigate to `../landing-page/index.html` which may result in a 404 in the React app.

**To test the landing page:**
- Open `landing-page/index.html` directly in your browser
- Or use a simple HTTP server (see Option 2)

### Option 2: Serve Landing Page on a Port (Recommended for Development)

Serve the landing page on its own port so both can link to each other.

**Using Python:**
```bash
cd landing-page
python -m http.server 8080
```

Then update `frontend/.env`:
```env
VITE_LANDING_URL=http://localhost:8080
```

**Using Node.js (http-server):**
```bash
# Install globally (one time)
npm install -g http-server

# Serve landing page
cd landing-page
http-server -p 8080
```

**Using VS Code Live Server:**
1. Install "Live Server" extension
2. Right-click `landing-page/index.html`
3. Select "Open with Live Server"
4. Note the port (usually 5500)
5. Update `VITE_LANDING_URL=http://localhost:5500`

### Option 3: Production Setup (Deployment)

In production, both will be served from the same domain:
- Landing page: `https://yourapp.com/`
- Frontend app: `https://yourapp.com/app`

Update the logo link for production:

```typescript
// In Sidebar.tsx
<button
  onClick={() => {
    // Production: go to root domain
    window.location.href = '/';
  }}
>
```

## Current Logo Behavior

The logo button currently tries to navigate to:
```
../landing-page/index.html
```

This works if:
- Both are served from the same server
- Or you open the landing page HTML file directly

This doesn't work if:
- You're in the React app (localhost:5173) trying to reach a file path

## Recommended Development Workflow

### Quick Test (No Server Needed)
1. Open `landing-page/index.html` directly in browser
2. Click "Get Started" or "Dashboard" to go to frontend
3. Frontend opens at `http://localhost:5173`

### Full Development (With Landing Page Server)
1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   venv\Scripts\activate
   python -m uvicorn app.main:app --reload
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Terminal 3 - Landing Page:**
   ```bash
   cd landing-page
   python -m http.server 8080
   ```

4. **Update frontend/.env:**
   ```env
   VITE_LANDING_URL=http://localhost:8080
   ```

5. **Access:**
   - Landing page: `http://localhost:8080`
   - Frontend app: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

## Quick Fix for Now

**Option A: Comment out the logo link**
```typescript
// Temporarily disable logo link
<div className="flex items-center gap-3 mb-6">
  {/* Logo - not clickable in development */}
  <div className="w-9 h-9...">💰</div>
  <div>ExpenseTracker</div>
</div>
```

**Option B: Make it go to dashboard instead**
```typescript
import { useNavigate } from 'react-router-dom';

// In component:
const navigate = useNavigate();

<button onClick={() => navigate('/')}>
  {/* Logo */}
</button>
```

**Option C: Serve landing page (recommended)**
Follow Option 2 above to serve the landing page on port 8080.

## Production Deployment

When deploying, configure your server to:
- Serve landing page at root: `/`
- Serve frontend app at: `/app`
- Proxy API requests to: `/api`

Then the logo link will work correctly with:
```typescript
window.location.href = '/';
```

---

**Recommendation**: Use Option 2 (serve landing page on port 8080) for the best development experience.

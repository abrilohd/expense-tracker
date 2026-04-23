# Expense Tracker - Project Structure

Complete folder structure and organization for the full-stack expense tracker application.

---

## 📁 Root Directory Structure

```
expense-tracker/
├── backend/                 # FastAPI backend server
├── frontend/                # React TypeScript frontend
├── .kiro/                   # Kiro AI configuration and specs
├── .vscode/                 # VS Code workspace settings
├── .git/                    # Git repository
├── README.md                # Project overview
└── PROJECT_STRUCTURE.md     # This file
```

---

## 🔙 Backend Structure

```
backend/
├── app/                     # Main application package
│   ├── core/               # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py       # Configuration settings
│   │   ├── security.py     # JWT & password hashing
│   │   ├── exceptions.py   # Custom exceptions
│   │   └── error_handlers.py  # Global error handlers
│   │
│   ├── db/                 # Database configuration
│   │   ├── __init__.py
│   │   └── database.py     # SQLAlchemy setup
│   │
│   ├── models/             # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py         # User model
│   │   └── expense.py      # Expense model
│   │
│   ├── schemas/            # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py         # User schemas
│   │   ├── expense.py      # Expense schemas
│   │   ├── dashboard.py    # Dashboard schemas
│   │   └── insights.py     # Insights schemas
│   │
│   ├── routes/             # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py         # Authentication routes
│   │   ├── expenses.py     # Expense CRUD routes
│   │   ├── dashboard.py    # Dashboard analytics
│   │   └── insights.py     # AI insights routes
│   │
│   ├── services/           # Business logic
│   │   ├── __init__.py
│   │   └── insights.py     # Insights generation
│   │
│   ├── __init__.py
│   └── main.py             # FastAPI app entry point
│
├── venv/                   # Python virtual environment
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── requirements.txt        # Python dependencies
├── expenses.db             # SQLite database (dev)
└── README.md               # Backend documentation
```

---

## 🎨 Frontend Structure

```
frontend/
├── src/                    # Source code
│   ├── api/               # API client
│   │   ├── client.ts      # Axios instance with interceptors
│   │   └── expenses.ts    # API functions
│   │
│   ├── assets/            # Static assets
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/        # React components
│   │   ├── charts/       # Chart components
│   │   │   ├── ExpenseBarChart.tsx
│   │   │   └── CategoryPieChart.tsx
│   │   │
│   │   ├── layout/       # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── MobileOverlay.tsx
│   │   │
│   │   ├── ui/           # UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── InsightCard.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── ExpenseModal.tsx
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   ├── RecentExpensesTable.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Skeleton.tsx
│   │   │
│   │   ├── ErrorBoundary.tsx    # Error boundary
│   │   ├── PageTransition.tsx   # Animation wrappers
│   │   └── ProtectedRoute.tsx   # Route guards
│   │
│   ├── hooks/             # Custom React hooks
│   │   └── useDarkMode.ts
│   │
│   ├── pages/             # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── Insights.tsx
│   │   └── NotFound.tsx
│   │
│   ├── store/             # Zustand stores
│   │   ├── authStore.ts
│   │   └── expenseStore.ts
│   │
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/             # Utility functions
│   │   ├── constants.ts
│   │   └── formatters.ts
│   │
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
│
├── public/                # Public assets
│   ├── favicon.svg
│   └── icons.svg
│
├── docs/                  # Documentation
│   ├── ANIMATIONS_GUIDE.md
│   ├── ANIMATION_EXAMPLES.md
│   ├── ANIMATION_QUICK_REF.md
│   ├── ANIMATIONS_SUMMARY.md
│   ├── DARK_MODE_GUIDE.md
│   └── ERROR_HANDLING_GUIDE.md
│
├── node_modules/          # NPM dependencies
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package.json           # NPM dependencies
├── package-lock.json      # NPM lock file
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── README.md              # Frontend documentation
```

---

## 🤖 Kiro AI Structure

```
.kiro/
├── specs/                 # Feature specifications
│   └── testing-specification/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
│
└── settings/              # Kiro settings
    └── mcp.json          # MCP server configuration
```

---

## 📝 Key Files Explained

### **Backend**

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI application entry point, CORS, routes |
| `app/core/config.py` | Environment variables, settings |
| `app/core/security.py` | JWT tokens, password hashing |
| `app/db/database.py` | SQLAlchemy engine, session management |
| `app/models/*.py` | Database models (User, Expense) |
| `app/schemas/*.py` | Pydantic validation schemas |
| `app/routes/*.py` | API endpoint definitions |
| `app/services/insights.py` | AI insights business logic |
| `requirements.txt` | Python dependencies |
| `.env` | Environment variables (SECRET_KEY, DATABASE_URL) |

### **Frontend**

| File | Purpose |
|------|---------|
| `src/main.tsx` | React app entry point |
| `src/App.tsx` | Main app component with routing |
| `src/api/client.ts` | Axios instance with auth interceptors |
| `src/api/expenses.ts` | Type-safe API functions |
| `src/store/authStore.ts` | Authentication state management |
| `src/store/expenseStore.ts` | Expense state management |
| `src/types/index.ts` | TypeScript type definitions |
| `src/hooks/useDarkMode.ts` | Dark mode custom hook |
| `src/components/ErrorBoundary.tsx` | Error boundary component |
| `src/pages/*.tsx` | Page components |
| `tailwind.config.js` | Tailwind CSS theme configuration |
| `vite.config.js` | Vite build configuration |
| `.env` | Environment variables (VITE_API_URL) |

---

## 🗂️ File Organization Principles

### **Backend**
- **Separation of Concerns**: Models, schemas, routes, services in separate folders
- **Layered Architecture**: Routes → Services → Models → Database
- **Configuration**: Centralized in `core/config.py`
- **Error Handling**: Global error handlers in `core/error_handlers.py`

### **Frontend**
- **Component Organization**: By type (layout, ui, charts) and feature
- **State Management**: Zustand stores in `store/` folder
- **Type Safety**: All types in `types/index.ts`
- **API Layer**: Centralized in `api/` folder
- **Documentation**: Separate `docs/` folder for guides

---

## 🚫 Files to Ignore

### **Backend (.gitignore)**
```
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.env
*.db
*.sqlite
.pytest_cache/
.coverage
htmlcov/
```

### **Frontend (.gitignore)**
```
node_modules/
dist/
.env
.env.local
.vite/
*.log
.DS_Store
```

---

## 📦 Dependencies

### **Backend (requirements.txt)**
```
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
pydantic==2.10.4
pydantic-settings==2.7.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
```

### **Frontend (package.json)**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1",
    "axios": "^1.7.9",
    "zustand": "^5.0.2",
    "framer-motion": "^11.15.0",
    "react-hot-toast": "^2.4.1",
    "react-hook-form": "^7.54.2",
    "zod": "^3.24.1",
    "chart.js": "^4.4.7",
    "react-chartjs-2": "^5.3.0",
    "lucide-react": "^0.468.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "vite": "^6.0.5",
    "eslint": "^9.17.0"
  }
}
```

---

## 🚀 Running the Application

### **Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 📚 Documentation Location

All documentation is organized in `frontend/docs/`:

- **ANIMATIONS_GUIDE.md** - Complete animation system guide
- **ANIMATION_EXAMPLES.md** - Before/after implementation examples
- **ANIMATION_QUICK_REF.md** - Quick copy-paste snippets
- **ANIMATIONS_SUMMARY.md** - Animation implementation overview
- **DARK_MODE_GUIDE.md** - Dark mode system documentation
- **ERROR_HANDLING_GUIDE.md** - Error boundaries and error handling

---

## ✅ Clean Project Structure

The project is now organized with:

✅ **Clear separation** between backend and frontend
✅ **Logical folder structure** for components, pages, and utilities
✅ **Documentation folder** for all guides and references
✅ **No unwanted files** - Removed test files and old cache
✅ **Proper .gitignore** - Excludes node_modules, venv, .env, etc.
✅ **Type safety** - TypeScript strict mode throughout
✅ **Scalable architecture** - Easy to add new features

---

## 🎯 Next Steps

1. **Development**: Run both backend and frontend servers
2. **Testing**: Follow the testing specification in `.kiro/specs/`
3. **Deployment**: Configure production environment variables
4. **Documentation**: Keep docs updated as features are added

---

**Project is clean, organized, and ready for development!** 🎉

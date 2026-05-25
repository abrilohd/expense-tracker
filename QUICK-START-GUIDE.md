# Quick Start Guide - Personal Expense Tracker

**Version**: 3.0.0 (Phase D Complete)  
**Last Updated**: May 23, 2026

---

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- Git installed

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd expense-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and set your values:
# - SECRET_KEY (generate a secure random string)
# - DATABASE_URL (use SQLite for dev: sqlite:///./expenses.db)
# - FRONTEND_URL (http://localhost:5173)

# Run database migrations
python run_migration.py
python run_migration_income.py
python run_migration_budgets.py
python run_migration_savings_goals.py

# Start backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be running at**: http://localhost:8000  
**API Docs available at**: http://localhost:8000/docs

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and set:
# VITE_API_URL=http://localhost:8000

# Start frontend dev server
npm run dev
```

**Frontend will be running at**: http://localhost:5173 (or 5174 if 5173 is busy)

---

## 🎯 First Time Setup

### 1. Create Account
1. Open http://localhost:5173 in your browser
2. Click "Sign Up" or "Register"
3. Enter your email and password
4. Click "Create Account"

### 2. Login
1. Enter your credentials
2. Click "Login"
3. You'll be redirected to the Dashboard

### 3. Add Your First Expense
1. Click "Add Expense" in sidebar
2. Fill in the form:
   - Title: "Groceries"
   - Amount: 50.00
   - Category: Food
   - Date: Today
   - Description: "Weekly shopping"
3. Click "Add Expense"

### 4. Add Your First Income
1. Click "Income" in sidebar
2. Click "Add Income" button
3. Fill in the form:
   - Amount: 3000.00
   - Source: Salary
   - Date: Today
   - Description: "Monthly salary"
4. Click "Create Income"

### 5. Create Your First Budget
1. Click "Budgets" in sidebar
2. Click "New Budget" button
3. Fill in the form:
   - Budget Type: Category
   - Category: Food
   - Amount: 500.00
   - Period: This month
4. Click "Create Budget"

### 6. Set Your First Savings Goal
1. Click "Savings Goals" in sidebar
2. Click "New Goal" button
3. Fill in the form:
   - Name: "Emergency Fund"
   - Target Amount: 10000.00
   - Deadline: 6 months from now
4. Click "Create Goal"

---

## 📱 Features Overview

### Dashboard
- View your financial overview
- See total expenses, income, and balance
- Check budget status
- Track savings goals progress
- View recent transactions
- Analyze spending by category

### Expenses
- Add, edit, delete expenses
- Filter by category, date, amount
- Search expenses
- Sort by date or amount
- View expense statistics

### Income
- Track income from multiple sources
- Filter and search income records
- View total income
- Manage income sources

### Budgets
- Create overall or category budgets
- Track budget utilization
- Get alerts at 80% and 100%
- View budget status (safe/warning/exceeded)
- Monitor spending limits

### Savings Goals
- Set financial goals with targets
- Track progress with visual bars
- Add contributions manually
- See days remaining
- Get overdue warnings
- Auto-complete when target reached

### AI Insights
- Get AI-powered spending analysis
- Receive personalized recommendations
- Identify spending patterns
- Get budget suggestions

### Profile
- Update your name and phone
- Change password
- View account information
- Manage profile settings

---

## 🎨 Using the Application

### Dark Mode
- Click the moon/sun icon in the header
- Toggle between light and dark themes
- Preference is saved automatically

### Navigation
- Use the sidebar to navigate between pages
- Click the logo to return to dashboard
- Use breadcrumbs for context

### Filters and Search
- Use the search bar to find transactions
- Apply filters for category, date, amount
- Sort by date or amount
- Clear filters to reset view

### Modals
- Click "Add" buttons to open creation modals
- Click edit icons to modify records
- Click delete icons to remove records
- Confirm deletions in confirmation modal

---

## 🔧 Development Commands

### Backend

```bash
# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run migrations
python run_migration_<table_name>.py

# Check API docs
# Open http://localhost:8000/docs

# Run Python shell
python
>>> from app.db.database import SessionLocal
>>> from app.models.user import User
>>> db = SessionLocal()
>>> users = db.query(User).all()
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'app'`
```bash
# Solution: Make sure you're in the backend directory
cd backend
python -m uvicorn app.main:app --reload
```

**Issue**: `Database is locked`
```bash
# Solution: Close any other processes using the database
# Or delete expenses.db and run migrations again
rm expenses.db
python run_migration.py
```

**Issue**: `Port 8000 already in use`
```bash
# Solution: Use a different port
python -m uvicorn app.main:app --reload --port 8001
# Update VITE_API_URL in frontend/.env to http://localhost:8001
```

### Frontend Issues

**Issue**: `Cannot find module 'vite'`
```bash
# Solution: Install dependencies
npm install
```

**Issue**: `Port 5173 already in use`
```bash
# Solution: Vite will automatically use next available port (5174, 5175, etc.)
# Check terminal output for actual port
```

**Issue**: `API calls failing with CORS error`
```bash
# Solution: Check backend CORS configuration
# Ensure ALLOWED_ORIGINS in backend/.env includes your frontend URL
# Example: ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

**Issue**: `TypeScript errors`
```bash
# Solution: Rebuild TypeScript
npm run build
```

---

## 📊 Sample Data

### Create Sample Expenses
```bash
# Use the API docs at http://localhost:8000/docs
# Or use the frontend UI to add:
- Groceries: $50 (Food)
- Gas: $40 (Transport)
- Rent: $1200 (Housing)
- Movie tickets: $30 (Entertainment)
- Gym membership: $50 (Health)
```

### Create Sample Income
```bash
# Add income records:
- Salary: $3000 (Salary)
- Freelance project: $500 (Freelancing)
- Gift: $100 (Gifts)
```

### Create Sample Budgets
```bash
# Set budgets:
- Overall: $2500/month
- Food: $500/month
- Transport: $200/month
- Entertainment: $150/month
```

### Create Sample Goals
```bash
# Set savings goals:
- Emergency Fund: $10,000 (6 months)
- Vacation: $5,000 (3 months)
- New Car: $15,000 (1 year)
```

---

## 🚀 Production Deployment

### Backend (Railway)
1. Create Railway account
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub
5. Set environment variables
6. Deploy!

### Frontend (Vercel)
1. Create Vercel account
2. Import GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set environment variables
6. Deploy!

---

## 📚 Additional Resources

### Documentation
- `PHASE-A-COMPLETE.md` - Auth & Profile features
- `PHASE-B-COMPLETE.md` - Income & Balance features
- `PHASE-C-COMPLETION-SUMMARY.md` - Budget features
- `PHASE-D-SAVINGS-GOALS-IMPLEMENTATION.md` - Savings goals features
- `PHASE-D-TESTING-GUIDE.md` - Testing instructions
- `PROJECT-STATUS-UPDATED.md` - Overall project status

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Design Specifications
- Requirements: `.kiro/specs/expense-tracker-complete-features/requirements.md`
- Design: `.kiro/specs/expense-tracker-complete-features/design.md`

---

## 🎉 You're All Set!

Your Personal Expense Tracker is now running with:
- ✅ Expense tracking
- ✅ Income management
- ✅ Budget control
- ✅ Savings goals
- ✅ AI insights
- ✅ Beautiful dashboard
- ✅ Dark mode
- ✅ Responsive design

**Start tracking your finances today!** 💳

---

## 💡 Tips for Best Experience

1. **Add expenses regularly** - Track spending as it happens
2. **Set realistic budgets** - Start with your actual spending patterns
3. **Create meaningful goals** - Set achievable savings targets
4. **Review dashboard weekly** - Check your financial health regularly
5. **Use AI insights** - Get personalized recommendations
6. **Enable dark mode** - Easier on the eyes for evening use
7. **Try mobile view** - Access from any device

---

## 🆘 Need Help?

- Check the documentation files
- Review API docs at /docs
- Check browser console for errors
- Review backend logs in terminal
- Ensure all migrations are run
- Verify environment variables are set

---

**Happy Tracking!** 🎯📊💳

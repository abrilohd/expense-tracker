# Development Guide

Complete guide for setting up and developing the Expense Tracker application.

## Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Git**
- Code editor (VS Code recommended)

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=sqlite:///./expenses.db
# SECRET_KEY=your-secret-key-here
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Initialize database
python scripts/init_db.py

# Run migrations
python scripts/migrate.py

# Create admin user
python scripts/create_admin.py

# (Optional) Create test users
python scripts/create_test_user.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# VITE_API_URL=http://localhost:8000
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```
Backend runs on: http://localhost:8000
API Docs: http://localhost:8000/docs

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Test production build
```

**Backend:**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed project structure.

## Development Workflow

### Adding a New Feature

1. **Backend (API Endpoint)**

```python
# 1. Create/Update Model (backend/app/models/)
# Example: backend/app/models/feature.py
from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base

class Feature(Base):
    __tablename__ = "features"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)

# 2. Create Schema (backend/app/schemas/)
# Example: backend/app/schemas/feature.py
from pydantic import BaseModel

class FeatureBase(BaseModel):
    name: str

class FeatureCreate(FeatureBase):
    pass

class Feature(FeatureBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# 3. Create Route (backend/app/routes/)
# Example: backend/app/routes/features.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter(prefix="/features", tags=["features"])

@router.get("/")
def get_features(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Feature).filter(Feature.user_id == current_user.id).all()

# 4. Register Route (backend/app/main.py)
from app.routes import features
app.include_router(features.router)
```

2. **Frontend (UI Component)**

```typescript
// 1. Add Type (frontend/src/types/index.ts)
export interface Feature {
  id: number;
  user_id: number;
  name: string;
}

// 2. Create API Function (frontend/src/api/features.ts)
import { apiClient } from './client';
import type { Feature } from '@/types';

export const getFeatures = async (): Promise<Feature[]> => {
  const response = await apiClient.get('/features');
  return response.data;
};

// 3. Create Store (frontend/src/store/featureStore.ts)
import { create } from 'zustand';
import type { Feature } from '@/types';

interface FeatureStore {
  features: Feature[];
  setFeatures: (features: Feature[]) => void;
}

export const useFeatureStore = create<FeatureStore>((set) => ({
  features: [],
  setFeatures: (features) => set({ features }),
}));

// 4. Create Component (frontend/src/components/ui/FeatureCard.tsx)
import React from 'react';
import type { Feature } from '@/types';

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h3>{feature.name}</h3>
    </div>
  );
};

// 5. Create Page (frontend/src/pages/Features.tsx)
import { useEffect } from 'react';
import { getFeatures } from '@/api/features';
import { useFeatureStore } from '@/store/featureStore';
import { FeatureCard } from '@/components/ui/FeatureCard';

export const Features = () => {
  const { features, setFeatures } = useFeatureStore();
  
  useEffect(() => {
    const loadFeatures = async () => {
      const data = await getFeatures();
      setFeatures(data);
    };
    loadFeatures();
  }, []);
  
  return (
    <div>
      <h1>Features</h1>
      {features.map(feature => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
};

// 6. Add Route (frontend/src/App.tsx)
import { Features } from '@/pages/Features';

<Route path="/features" element={<Features />} />
```

### Database Migrations

When you modify models:

```bash
cd backend

# Option 1: Add to scripts/migrate.py
# Edit scripts/migrate.py and add your migration logic

# Option 2: Create new migration file
# Create backend/migrations/003_your_migration.py

# Run migration
python scripts/migrate.py
```

### Code Style

#### TypeScript/React
- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript strict mode
- Use path aliases (`@/` instead of `../../`)
- Name components with PascalCase
- Name files with PascalCase for components
- Use meaningful variable names

```typescript
// Good
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return <div>{user.name}</div>;
};

// Bad
const userprofile = (props: any) => {
  const [x, setX] = useState(false);
  
  return <div>{props.user.name}</div>;
};
```

#### Python/FastAPI
- Follow PEP 8
- Use type hints
- Use meaningful variable names
- Keep functions small and focused
- Use docstrings

```python
# Good
def get_user_expenses(
    user_id: int,
    start_date: date,
    end_date: date,
    db: Session
) -> List[Expense]:
    """
    Get all expenses for a user within a date range.
    
    Args:
        user_id: The user's ID
        start_date: Start of date range
        end_date: End of date range
        db: Database session
        
    Returns:
        List of expenses
    """
    return db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= start_date,
        Expense.date <= end_date
    ).all()

# Bad
def get_exp(uid, sd, ed, db):
    return db.query(Expense).filter(Expense.user_id == uid).all()
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest tests/test_budget_api.py

# Run with coverage
pytest --cov=app tests/
```

### Frontend Tests

```bash
cd frontend

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## Common Tasks

### Add New Dependency

**Frontend:**
```bash
cd frontend
npm install package-name
npm install -D package-name  # Dev dependency
```

**Backend:**
```bash
cd backend
pip install package-name
pip freeze > requirements.txt
```

### Reset Database

```bash
cd backend

# Delete database
rm expenses.db

# Recreate
python scripts/init_db.py
python scripts/migrate.py
python scripts/create_admin.py
```

### Update Environment Variables

1. Edit `.env` files
2. Restart development servers
3. Never commit `.env` files

### Debug API Issues

1. Check backend logs in terminal
2. Visit http://localhost:8000/docs for API documentation
3. Test endpoints directly in Swagger UI
4. Check network tab in browser DevTools

### Debug Frontend Issues

1. Check browser console for errors
2. Use React DevTools
3. Check network tab for API calls
4. Verify environment variables

## Troubleshooting

### Backend Issues

**Issue: Module not found**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Windows: venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Issue: Database locked**
```bash
# Close all connections to database
# Restart backend server
```

**Issue: Migration fails**
```bash
# Check database schema
# Manually fix conflicts
# Re-run migration
```

### Frontend Issues

**Issue: Module not found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Build fails**
```bash
# Check TypeScript errors
npm run type-check

# Fix errors and rebuild
npm run build
```

**Issue: API calls fail**
```bash
# Verify VITE_API_URL in .env
# Check backend is running
# Check CORS configuration
```

## Performance Tips

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load routes and heavy components
- Optimize images
- Use debouncing for search inputs

### Backend
- Add database indexes
- Use query optimization
- Implement caching
- Use async operations
- Batch database operations

## Security Best Practices

- Never commit `.env` files
- Use strong SECRET_KEY
- Validate all user inputs
- Sanitize data before database operations
- Use HTTPS in production
- Implement rate limiting
- Keep dependencies updated
- Use environment variables for secrets

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# After review and approval, merge to main
```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Getting Help

1. Check this documentation
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Check API documentation at http://localhost:8000/docs
4. Review existing code for patterns
5. Check browser/terminal console for errors

## Next Steps

- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Explore the codebase
- Try adding a simple feature
- Read the API documentation
- Experiment with the UI components

Happy coding! 🚀

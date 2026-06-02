# Expense Tracker Frontend

> Modern, professional React + TypeScript application with enterprise-level architecture

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)](https://docs.pmnd.rs/zustand)

---

##     Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API layer (centralized)
│   ├── assets/           # Static assets
│   ├── components/       # React components
│   ├── config/           # Configuration
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
│
├── public/               # Public assets
├── dist/                 # Build output
│
├── FRONTEND_RESTRUCTURE.md    # Detailed progress tracking
├── IMPROVEMENTS_SUMMARY.md    # Executive summary
├── DEVELOPER_GUIDE.md         # Development guide
├── TESTING_GUIDE.md           # Testing checklist
├── PRESENTATION_SUMMARY.md    # Academic presentation
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

##   Features

### Core Functionality
-     User authentication (login, register, password reset)
-     Expense tracking with categories
-     Income management
-     Budget creation and monitoring
-     Savings goals with progress tracking
-     Recurring transactions
-     Financial reports and analytics
-     AI-powered insights
-     Admin dashboard
-     Dark mode support

### Technical Features
-     **Auto-refresh dashboard** - No manual reload needed
-     **Optimistic updates** - Instant UI feedback
-     **Smart error handling** - User-friendly messages
-     **Type-safe** - Strict TypeScript throughout
-     **Responsive design** - Mobile, tablet, desktop
-     **Performance optimized** - Lazy loading, code splitting
-     **Accessible** - WCAG compliant

---

## 🏗️ Architecture

### State Management
**Zustand** with Immer middleware for:
- Lightweight state management
- Optimistic updates
- Automatic cache invalidation
- Type-safe state access

### API Layer
Centralized API client with:
- Axios interceptors
- Automatic token injection
- Smart error handling
- Request/response transformation

### Component Pattern
- Functional components with hooks
- Composition over inheritance
- Prop drilling avoided via stores
- Reusable UI components

---

##    Key Improvements

### 1. Dashboard Auto-Refresh    
**Before:** Manual page reload required  
**After:** Automatic data synchronization

```typescript
// Automatically refreshes after:
- Adding/editing/deleting expenses
- Adding/editing/deleting income
- Creating/updating/deleting budgets
- Managing savings goals
- Managing recurring transactions
```

### 2. Better Error Messages    
**Before:** Generic "Backend server is offline"  
**After:** Specific, actionable messages

```typescript
401 → "Session expired. Please login again."
403 → "Access denied. You do not have permission."
404 → "Resource not found."
422 → "email: Email is required, password: Must be 8+ characters"
500 → "Server error. Please try again later."
Network → "Unable to connect to server. Please check your connection."
```

### 3. Organized API Layer    
**Before:** Mixed concerns, inconsistent naming  
**After:** Clean separation, consistent patterns

```
api/
├── client.ts          # Axios instance
├── auth.api.ts        # Authentication
├── dashboard.api.ts   # Dashboard & insights
├── expenses.api.ts    # Expenses
├── income.api.ts      # Income
├── budgets.api.ts     # Budgets
├── savings.api.ts     # Savings goals
├── recurring.api.ts   # Recurring transactions
├── reports.api.ts     # Reports
├── balance.api.ts     # Balance calculations
├── admin.api.ts       # Admin operations
└── index.ts           # Centralized exports
```

---

## 🛠️ Tech Stack

### Core
- **React 18.3** - UI library
- **TypeScript 5.6** - Type safety
- **Vite 5.4** - Build tool
- **React Router 6** - Routing

### State & Data
- **Zustand 5.0** - State management
- **Immer 11** - Immutable updates
- **Axios** - HTTP client

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **Framer Motion 12** - Animations
- **Lucide React** - Icons
- **Chart.js 4.5** - Charts
- **React Hot Toast** - Notifications

### Forms & Validation
- **React Hook Form 7** - Form management
- **Zod 4** - Schema validation

### Development
- **ESLint** - Linting
- **TypeScript** - Type checking
- **Vite** - Hot module replacement

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [FRONTEND_RESTRUCTURE.md](./FRONTEND_RESTRUCTURE.md) | Detailed progress tracking |
| [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) | Executive summary of changes |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Development patterns and best practices |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Manual testing checklist |
| [PRESENTATION_SUMMARY.md](./PRESENTATION_SUMMARY.md) | Academic presentation format |

---

## 🧪 Testing

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Manual Testing
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive checklist

---

##     Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables
```env
VITE_API_URL=http://localhost:8000
```

---

## 📖 Usage Examples

### Using API Functions
```typescript
import { expenseApi, dashboardApi } from '@/api';

// Fetch expenses
const expenses = await expenseApi.getExpenses({ category: 'Food' });

// Create expense
const newExpense = await expenseApi.createExpense({
  title: 'Groceries',
  amount: 50,
  category: 'Food',
  date: '2026-01-15',
});

// Dashboard auto-refreshes automatically!
```

### Using Stores
```typescript
import { useExpenseStore } from '@/store/expenseStore';

const MyComponent = () => {
  const { expenses, isLoading, addExpense } = useExpenseStore();

  const handleAdd = async (data) => {
    await addExpense(data);
    // Dashboard refreshes automatically!
  };

  return <div>{/* UI */}</div>;
};
```

### Using Hooks
```typescript
import { useDashboardData } from '@/hooks/useExpenses';

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useDashboardData();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return <div>{/* Dashboard content */}</div>;
};
```

---

## 🎨 Code Style

### Import Order
```typescript
// 1. External libraries
import { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Internal modules (using path aliases)
import { useExpenseStore } from '@/store/expenseStore';
import { Card } from '@/components/ui/Card';
import type { Expense } from '@/types';

// 3. Relative imports (avoid if possible)
import './styles.css';
```

### Component Pattern
```typescript
import type { FC } from 'react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  // Hooks
  const [state, setState] = useState();

  // Handlers
  const handleClick = () => {
    onAction();
  };

  // Render
  return <div>{title}</div>;
};

export default MyComponent;
```

---

## 🐛 Troubleshooting

### Dashboard not updating?
Check if mutation calls dashboard refresh:
```typescript
await addExpense(data);
useExpenseStore.getState().fetchDashboard(); // Should be automatic
```

### Import errors?
Verify path aliases in `tsconfig.json` and `vite.config.ts` match

### Build errors?
Run type check first:
```bash
npm run type-check
```

---

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Run type check: `npm run type-check`
4. Run linter: `npm run lint`
5. Test manually (see TESTING_GUIDE.md)
6. Commit with meaningful message
7. Create pull request

### Code Standards
-     Use TypeScript (no `any` types)
-     Use path aliases (`@/`)
-     Follow existing patterns
-     Add inline comments for complex logic
-     Update documentation if needed

---

## 📊 Performance

### Bundle Size
- Main chunk: ~400KB (gzipped)
- Total: ~800KB (gzipped)

### Load Time
- Initial load: < 3 seconds
- Dashboard load: < 2 seconds

### Optimization
-     Code splitting configured
-     Lazy loading ready
-     Tree shaking enabled
-     Minification enabled

---

## 🔒 Security

### Authentication
- JWT token-based
- Automatic token injection
- Token expiration handling
- Secure storage (localStorage)

### API Security
- HTTPS only in production
- CORS configured
- XSS protection
- CSRF protection

---

## 📝 License

This project is part of an academic assignment.

---

## 🙏 Acknowledgments

Built with modern web development best practices:
- React team for React 18
- Zustand team for state management
- Vite team for build tooling
- Tailwind team for CSS framework

---

## 📞 Support

For questions or issues:
1. Check documentation in this folder
2. Review inline code comments
3. Check TypeScript types for API contracts

---

**Version:** 1.0.0  
**Last Updated:** 2026  
**Status:** Production Ready    

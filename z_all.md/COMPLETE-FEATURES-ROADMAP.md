# Complete Personal Expense Tracker - Feature Roadmap

## 🎯 Vision
Transform the expense tracker into a comprehensive personal finance management system with income tracking, budgets, savings goals, advanced analytics, and automation.

---

## ✅ Phase A: Forgot Password + Profile Settings (COMPLETE)

**Status**: ✅ Completed  
**Complexity**: Low  
**Risk**: Minimal  

### Features:
- ✅ Forgot password flow with secure tokens
- ✅ Reset password with token validation
- ✅ Enhanced password change
- ✅ Profile editing (name, phone number)
- ✅ Database migration completed

**Files**: 13 files modified/created  
**Lines of Code**: ~1,200 lines

---

## 📊 Phase B: Income Management System (HIGH PRIORITY)

**Status**: 🔄 Ready to Start  
**Complexity**: Medium  
**Estimated Time**: 4-6 hours  
**Risk**: Low (similar to expense system)

### Features to Implement:

#### 1. Backend - Income Model & API
```python
# New Model: Income
- id, user_id, amount, source, date, description, created_at
- Sources: Salary, Business, Freelancing, Gifts, Other
- Validation: amount > 0, date not in future
```

**Endpoints**:
- `POST /api/income` - Create income
- `GET /api/income` - List with filters (source, date range, search)
- `GET /api/income/{id}` - Get single income
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income

**Files to Create/Modify**:
- `backend/app/models/income.py` (new)
- `backend/app/schemas/income.py` (new)
- `backend/app/routes/income.py` (new)
- `backend/app/main.py` (add router)
- `backend/run_migration_income.py` (new)

#### 2. Frontend - Income Management
**New Pages**:
- `frontend/src/pages/Income.tsx` - Income list with CRUD
- `frontend/src/components/ui/IncomeModal.tsx` - Add/Edit modal

**API Integration**:
- `frontend/src/api/income.ts` - Income API functions
- `frontend/src/types/index.ts` - Income types

**State Management**:
- `frontend/src/store/incomeStore.ts` - Income Zustand store

**Routing**:
- Add `/income` route to App.tsx
- Add "Income" link to sidebar navigation

#### 3. Dashboard Integration
- Add "Total Income" stat card
- Add income to recent transactions
- Update charts to show income vs expenses

### Implementation Steps:
1. ✅ Create Income model and migration
2. ✅ Create Income schemas (Create, Update, Response)
3. ✅ Create Income routes with CRUD operations
4. ✅ Test in Swagger
5. ✅ Create frontend types
6. ✅ Create income API client
7. ✅ Create income store
8. ✅ Create Income page UI
9. ✅ Create Income modal component
10. ✅ Add routing and navigation
11. ✅ Update dashboard with income data
12. ✅ Test end-to-end

---

## 💳 Phase C: Balance Calculation (HIGH PRIORITY)

**Status**: 🔄 Depends on Phase B  
**Complexity**: Low  
**Estimated Time**: 2-3 hours  
**Risk**: Minimal

### Features to Implement:

#### 1. Backend - Balance API
**New Endpoint**:
- `GET /api/balance` - Calculate and return balance

**Response**:
```json
{
  "balance": 5000.00,
  "total_income": 10000.00,
  "total_expenses": 5000.00,
  "current_month_balance": 1500.00,
  "current_month_income": 3000.00,
  "current_month_expenses": 1500.00
}
```

**Files**:
- `backend/app/routes/balance.py` (new)
- `backend/app/schemas/balance.py` (new)

#### 2. Frontend - Balance Display
**Components**:
- Balance stat card on dashboard
- Color coding (green/red/gray)
- Balance trend chart
- Month-over-month comparison

**Files**:
- `frontend/src/api/balance.ts` (new)
- `frontend/src/components/dashboard/BalanceCard.tsx` (new)
- Update `Dashboard.tsx`

### Implementation Steps:
1. ✅ Create balance calculation logic
2. ✅ Create balance endpoint
3. ✅ Test calculations in Swagger
4. ✅ Create frontend balance API
5. ✅ Create balance card component
6. ✅ Add to dashboard
7. ✅ Add color coding logic
8. ✅ Test with various scenarios

---

## 🎯 Phase D: Budget Management System (HIGH PRIORITY)

**Status**: 🔄 Depends on Phase B & C  
**Complexity**: High  
**Estimated Time**: 8-10 hours  
**Risk**: Medium (complex business logic)

### Features to Implement:

#### 1. Backend - Budget Model & API
```python
# New Model: Budget
- id, user_id, budget_type (overall/category)
- category (nullable), amount
- period_start, period_end, created_at
- Constraints: One budget per category per period
```

**Endpoints**:
- `POST /api/budgets` - Create budget
- `GET /api/budgets` - List budgets
- `GET /api/budgets/{id}` - Get single budget
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget
- `GET /api/budgets/status` - Get budget utilization

**Business Logic**:
- Calculate spent amount from expenses
- Calculate utilization percentage
- Identify budget warnings (80%, 100%)
- Handle overlapping periods

**Files**:
- `backend/app/models/budget.py` (new)
- `backend/app/schemas/budget.py` (new)
- `backend/app/routes/budget.py` (new)
- `backend/app/services/budget_calculator.py` (new)

#### 2. Frontend - Budget Management
**New Pages**:
- `frontend/src/pages/Budgets.tsx` - Budget list and management

**Components**:
- `frontend/src/components/ui/BudgetModal.tsx` - Create/Edit
- `frontend/src/components/ui/BudgetProgressCard.tsx` - Progress display
- `frontend/src/components/dashboard/BudgetWidget.tsx` - Dashboard widget

**Features**:
- Create monthly/category budgets
- Visual progress bars
- Warning indicators (80%, 100%)
- Budget vs actual comparison
- Edit/delete budgets

**Files**:
- `frontend/src/api/budgets.ts` (new)
- `frontend/src/store/budgetStore.ts` (new)
- `frontend/src/types/index.ts` (add Budget types)

#### 3. Dashboard Integration
- Budget overview widget
- Active budgets with progress
- Budget alerts section

### Implementation Steps:
1. ✅ Create Budget model and migration
2. ✅ Create Budget schemas
3. ✅ Create budget calculation service
4. ✅ Create Budget routes
5. ✅ Test budget logic in Swagger
6. ✅ Create frontend types
7. ✅ Create budget API client
8. ✅ Create budget store
9. ✅ Create Budgets page
10. ✅ Create budget modal
11. ✅ Create progress components
12. ✅ Add dashboard widget
13. ✅ Add navigation link
14. ✅ Test budget scenarios

---

## 🚨 Phase E: Budget Alert System (HIGH PRIORITY)

**Status**: 🔄 Depends on Phase D  
**Complexity**: Medium  
**Estimated Time**: 4-5 hours  
**Risk**: Low

### Features to Implement:

#### 1. Backend - Alert Generation
**Logic**:
- Check budgets after expense create/update
- Generate alerts at 80%, 100%, >100%
- Store alerts in database (optional)
- Return alerts with budget status

**Files**:
- `backend/app/services/alert_service.py` (new)
- Update `backend/app/routes/expenses.py` (trigger alerts)

#### 2. Frontend - Alert Display
**Components**:
- Alert banner on dashboard
- Alert list in budget page
- Alert notifications (toast)
- Dismiss functionality

**Files**:
- `frontend/src/components/dashboard/BudgetAlerts.tsx` (new)
- Update `Dashboard.tsx`

### Implementation Steps:
1. ✅ Create alert generation logic
2. ✅ Integrate with expense operations
3. ✅ Test alert triggers
4. ✅ Create alert components
5. ✅ Add to dashboard
6. ✅ Test alert scenarios

---

## 🎯 Phase F: Savings Goals System (MEDIUM PRIORITY)

**Status**: 🔄 Ready after Phase C  
**Complexity**: Medium  
**Estimated Time**: 6-8 hours  
**Risk**: Low

### Features to Implement:

#### 1. Backend - Savings Goal Model
```python
# New Model: SavingsGoal
- id, user_id, name, target_amount
- current_amount, deadline, status
- created_at, completed_at
- Status: active, completed, cancelled
```

**Endpoints**:
- `POST /api/savings-goals` - Create goal
- `GET /api/savings-goals` - List goals
- `GET /api/savings-goals/{id}` - Get single goal
- `PUT /api/savings-goals/{id}` - Update goal (add money)
- `DELETE /api/savings-goals/{id}` - Delete goal

**Business Logic**:
- Calculate progress percentage
- Auto-complete when target reached
- Deadline tracking
- Overdue detection

**Files**:
- `backend/app/models/savings_goal.py` (new)
- `backend/app/schemas/savings_goal.py` (new)
- `backend/app/routes/savings_goals.py` (new)

#### 2. Frontend - Savings Goals
**New Pages**:
- `frontend/src/pages/SavingsGoals.tsx` - Goals management

**Components**:
- `frontend/src/components/ui/GoalModal.tsx` - Create/Edit
- `frontend/src/components/ui/GoalCard.tsx` - Goal display
- `frontend/src/components/dashboard/GoalsWidget.tsx` - Dashboard

**Features**:
- Create goals with target and deadline
- Add money to goals
- Visual progress (circular/linear)
- Days remaining indicator
- Complete/cancel goals

**Files**:
- `frontend/src/api/savings-goals.ts` (new)
- `frontend/src/store/savingsStore.ts` (new)

#### 3. Dashboard Integration
- Active goals widget
- Progress visualization
- Quick add money action

### Implementation Steps:
1. ✅ Create SavingsGoal model
2. ✅ Create schemas
3. ✅ Create routes
4. ✅ Test in Swagger
5. ✅ Create frontend types
6. ✅ Create API client
7. ✅ Create store
8. ✅ Create Goals page
9. ✅ Create goal components
10. ✅ Add dashboard widget
11. ✅ Add navigation
12. ✅ Test goal scenarios

---

## 📈 Phase G: Enhanced Dashboard (MEDIUM PRIORITY)

**Status**: 🔄 Depends on Phases B, C, D, F  
**Complexity**: Medium  
**Estimated Time**: 5-6 hours  
**Risk**: Low

### Features to Implement:

#### 1. Backend - Enhanced Dashboard API
**Update Endpoint**: `GET /api/dashboard`

**New Data**:
```json
{
  "expenses": { ... },
  "income": {
    "total": 10000,
    "current_month": 3000,
    "by_source": [...]
  },
  "balance": {
    "current": 5000,
    "trend": "up"
  },
  "budgets": {
    "active_count": 5,
    "on_track": 3,
    "warnings": 2,
    "exceeded": 0
  },
  "savings_goals": {
    "active_count": 3,
    "total_target": 50000,
    "total_saved": 15000,
    "completion_rate": 30
  }
}
```

**Files**:
- Update `backend/app/routes/dashboard.py`
- Update `backend/app/schemas/dashboard.py`

#### 2. Frontend - Dashboard Redesign
**New Widgets**:
- Income stat card
- Balance card with trend
- Budget overview widget
- Savings goals widget
- Income vs Expense chart
- Monthly trends (6 months)
- Quick actions panel

**Layout**:
- 3-column responsive grid
- Priority-based widget placement
- Collapsible sections
- Loading skeletons

**Files**:
- Update `frontend/src/pages/Dashboard.tsx`
- Create new widget components

### Implementation Steps:
1. ✅ Update dashboard API
2. ✅ Test enhanced data
3. ✅ Create new widgets
4. ✅ Update dashboard layout
5. ✅ Add income vs expense chart
6. ✅ Add quick actions
7. ✅ Test responsiveness
8. ✅ Test dark mode

---

## 📊 Phase H: Reports & Analytics (MEDIUM PRIORITY)

**Status**: 🔄 Depends on all previous phases  
**Complexity**: High  
**Estimated Time**: 10-12 hours  
**Risk**: Medium (export functionality)

### Features to Implement:

#### 1. Backend - Report Generation
**New Endpoint**: `POST /api/reports/generate`

**Request**:
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "include_income": true,
  "include_expenses": true,
  "include_budgets": true,
  "include_goals": true
}
```

**Response**: Comprehensive financial report

**Export Endpoints**:
- `GET /api/reports/export/pdf` - PDF export
- `GET /api/reports/export/csv` - CSV export
- `GET /api/reports/export/excel` - Excel export

**Dependencies**:
- `reportlab` (PDF generation)
- `pandas` (Excel/CSV)
- `matplotlib` (Charts in PDF)

**Files**:
- `backend/app/routes/reports.py` (new)
- `backend/app/services/report_generator.py` (new)
- `backend/app/services/pdf_exporter.py` (new)
- `backend/app/services/csv_exporter.py` (new)

#### 2. Frontend - Reports Page
**New Page**: `frontend/src/pages/Reports.tsx`

**Features**:
- Date range selector
- Report type selection
- Data filters
- Preview report
- Export buttons (PDF, CSV, Excel)
- Report history

**Components**:
- `frontend/src/components/reports/ReportBuilder.tsx`
- `frontend/src/components/reports/ReportPreview.tsx`
- `frontend/src/components/reports/ExportButtons.tsx`

**Charts**:
- Category breakdown pie chart
- Income vs expense bar chart
- Monthly trends line chart
- Budget performance chart

**Files**:
- `frontend/src/api/reports.ts` (new)
- `frontend/src/pages/Reports.tsx` (new)

### Implementation Steps:
1. ✅ Install export dependencies
2. ✅ Create report generation service
3. ✅ Create PDF exporter
4. ✅ Create CSV exporter
5. ✅ Create Excel exporter
6. ✅ Create report routes
7. ✅ Test exports in Swagger
8. ✅ Create frontend API
9. ✅ Create Reports page
10. ✅ Create report builder
11. ✅ Add export functionality
12. ✅ Add navigation link
13. ✅ Test all export formats

---

## 🔔 Phase I: Notification System (LOW PRIORITY)

**Status**: 🔄 Optional enhancement  
**Complexity**: Medium  
**Estimated Time**: 6-8 hours  
**Risk**: Low

### Features to Implement:

#### 1. Backend - Notification Model
```python
# New Model: Notification
- id, user_id, type, title, message
- is_read, created_at
- Types: budget_warning, budget_exceeded,
         goal_deadline, goal_completed
```

**Endpoints**:
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification
- `POST /api/notifications/mark-all-read` - Mark all read

**Files**:
- `backend/app/models/notification.py` (new)
- `backend/app/schemas/notification.py` (new)
- `backend/app/routes/notifications.py` (new)
- `backend/app/services/notification_service.py` (new)

#### 2. Frontend - Notification UI
**Components**:
- Notification bell icon in header
- Unread count badge
- Notification dropdown
- Notification page (full list)

**Features**:
- Real-time notification display
- Mark as read
- Delete notifications
- Filter by type
- Notification sounds (optional)

**Files**:
- `frontend/src/components/layout/NotificationBell.tsx` (new)
- `frontend/src/components/ui/NotificationDropdown.tsx` (new)
- `frontend/src/pages/Notifications.tsx` (new)
- `frontend/src/api/notifications.ts` (new)

### Implementation Steps:
1. ✅ Create Notification model
2. ✅ Create notification service
3. ✅ Integrate with budget/goal events
4. ✅ Create notification routes
5. ✅ Test in Swagger
6. ✅ Create frontend API
7. ✅ Create notification bell
8. ✅ Create dropdown component
9. ✅ Create Notifications page
10. ✅ Add to header
11. ✅ Test notification flow

---

## 💳 Phase J: Payment Method Tracking (LOW PRIORITY)

**Status**: 🔄 Simple enhancement  
**Complexity**: Low  
**Estimated Time**: 2-3 hours  
**Risk**: Minimal

### Features to Implement:

#### 1. Backend - Add Payment Method Field
**Update Model**: `Expense`
- Add `payment_method` field (nullable)
- Values: Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet

**Files**:
- Update `backend/app/models/expense.py`
- Update `backend/app/schemas/expense.py`
- Create migration script

#### 2. Frontend - Payment Method UI
**Updates**:
- Add payment method dropdown to expense modal
- Display payment method on expense cards
- Add payment method filter
- Add payment method breakdown chart

**Files**:
- Update `frontend/src/components/ui/ExpenseModal.tsx`
- Update `frontend/src/types/index.ts`
- Update `frontend/src/pages/ExpenseList.tsx`

### Implementation Steps:
1. ✅ Add field to model
2. ✅ Create migration
3. ✅ Update schemas
4. ✅ Test in Swagger
5. ✅ Update frontend types
6. ✅ Add to expense modal
7. ✅ Add filter option
8. ✅ Add to dashboard analytics

---

## 🔄 Phase K: Recurring Transactions (FUTURE)

**Status**: 🔮 Future enhancement  
**Complexity**: Very High  
**Estimated Time**: 15-20 hours  
**Risk**: High (requires background jobs)

### Features to Implement:

#### 1. Backend - Recurring Transaction System
```python
# New Model: RecurringTransaction
- id, user_id, transaction_type (expense/income)
- title, amount, category_or_source
- description, payment_method
- frequency (daily, weekly, monthly, yearly)
- start_date, end_date, next_occurrence
- is_active
```

**Background Job**:
- Celery or APScheduler
- Daily check for due transactions
- Auto-create transactions
- Update next_occurrence

**Endpoints**:
- `POST /api/recurring` - Create recurring
- `GET /api/recurring` - List recurring
- `PUT /api/recurring/{id}` - Update recurring
- `DELETE /api/recurring/{id}` - Delete recurring
- `POST /api/recurring/{id}/trigger` - Manual trigger
- `POST /api/recurring/{id}/skip` - Skip occurrence

**Files**:
- `backend/app/models/recurring_transaction.py` (new)
- `backend/app/schemas/recurring_transaction.py` (new)
- `backend/app/routes/recurring.py` (new)
- `backend/app/services/recurring_service.py` (new)
- `backend/app/tasks/recurring_tasks.py` (new)

#### 2. Frontend - Recurring Management
**New Page**: `frontend/src/pages/Recurring.tsx`

**Features**:
- Create recurring transactions
- View upcoming occurrences
- Edit/pause/resume recurring
- Manual trigger
- Skip occurrence
- View history

**Components**:
- `frontend/src/components/ui/RecurringModal.tsx`
- `frontend/src/components/ui/RecurringCard.tsx`
- `frontend/src/components/dashboard/UpcomingRecurring.tsx`

### Implementation Steps:
1. ✅ Research background job solutions
2. ✅ Create RecurringTransaction model
3. ✅ Create recurring service
4. ✅ Set up background jobs
5. ✅ Create routes
6. ✅ Test job execution
7. ✅ Create frontend API
8. ✅ Create Recurring page
9. ✅ Create components
10. ✅ Add dashboard widget
11. ✅ Test recurring scenarios

---

## 📱 Cross-Cutting Concerns (ALL PHASES)

### 1. Performance Optimization
- [ ] Add database indexes (user_id, date, category)
- [ ] Implement API response caching
- [ ] Optimize dashboard queries
- [ ] Add pagination to all lists
- [ ] Implement lazy loading
- [ ] Code splitting
- [ ] Bundle size optimization

### 2. Security Enhancements
- [ ] Rate limiting on all endpoints
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] API key rotation
- [ ] Audit logging

### 3. Testing
- [ ] Backend unit tests
- [ ] Backend integration tests
- [ ] Frontend component tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] API load testing
- [ ] Security testing

### 4. Documentation
- [ ] API documentation (Swagger)
- [ ] User guide
- [ ] Developer documentation
- [ ] Deployment guide
- [ ] Architecture diagrams

### 5. Mobile Responsiveness
- [ ] Test all pages on mobile
- [ ] Touch-friendly interactions
- [ ] Mobile navigation
- [ ] Responsive charts
- [ ] Mobile-optimized forms

### 6. Dark Mode
- [ ] Ensure all new components support dark mode
- [ ] Test color contrast
- [ ] Dark mode charts
- [ ] Consistent theming

---

## 📊 Progress Tracking

### Completed:
- ✅ Phase A: Forgot Password + Profile Settings

### In Progress:
- 🔄 None

### Planned:
- 📋 Phase B: Income Management
- 📋 Phase C: Balance Calculation
- 📋 Phase D: Budget Management
- 📋 Phase E: Budget Alerts
- 📋 Phase F: Savings Goals
- 📋 Phase G: Enhanced Dashboard
- 📋 Phase H: Reports & Analytics
- 📋 Phase I: Notifications
- 📋 Phase J: Payment Methods
- 📋 Phase K: Recurring Transactions

### Overall Progress:
```
Phase A: ████████████████████ 100% ✅
Phase B: ░░░░░░░░░░░░░░░░░░░░   0%
Phase C: ░░░░░░░░░░░░░░░░░░░░   0%
Phase D: ░░░░░░░░░░░░░░░░░░░░   0%
Phase E: ░░░░░░░░░░░░░░░░░░░░   0%
Phase F: ░░░░░░░░░░░░░░░░░░░░   0%
Phase G: ░░░░░░░░░░░░░░░░░░░░   0%
Phase H: ░░░░░░░░░░░░░░░░░░░░   0%
Phase I: ░░░░░░░░░░░░░░░░░░░░   0%
Phase J: ░░░░░░░░░░░░░░░░░░░░   0%
Phase K: ░░░░░░░░░░░░░░░░░░░░   0%

Total: 9% Complete (1/11 phases)
```

---

## 🎯 Recommended Implementation Order

### Sprint 1 (Week 1): Core Financial Features
1. ✅ Phase A: Profile & Auth (DONE)
2. Phase B: Income Management
3. Phase C: Balance Calculation

### Sprint 2 (Week 2): Budget Control
4. Phase D: Budget Management
5. Phase E: Budget Alerts

### Sprint 3 (Week 3): Goals & Dashboard
6. Phase F: Savings Goals
7. Phase G: Enhanced Dashboard

### Sprint 4 (Week 4): Analytics & Polish
8. Phase H: Reports & Analytics
9. Phase J: Payment Methods

### Sprint 5 (Optional): Advanced Features
10. Phase I: Notifications
11. Phase K: Recurring Transactions

---

## 📝 Notes

- Each phase builds on previous phases
- Test thoroughly before moving to next phase
- Maintain backward compatibility
- Follow existing code patterns
- Document as you go
- Deploy incrementally

---

**Last Updated**: 2026-05-22  
**Current Phase**: Phase A Complete ✅  
**Next Phase**: Phase B - Income Management 🚀

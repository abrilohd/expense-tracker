# Design Document: Complete Personal Expense Tracker Features

## Overview

### Purpose

This design document specifies the technical architecture for extending an existing Personal Expense Tracker application with comprehensive financial management features. The application currently supports user authentication, expense CRUD operations, dashboard analytics, and dark mode. This design adds income management, budget tracking, savings goals, enhanced reporting, notifications, payment method tracking, and profile enhancements.

### Scope

**In Scope:**
- Income management system with CRUD operations
- Balance calculation (income minus expenses)
- Budget management with category and overall budgets
- Budget alert system with threshold notifications
- Savings goals with progress tracking
- Enhanced dashboard with income, balance, budgets, and savings
- Reports and analytics with export functionality (PDF, CSV, Excel)
- Notification system for budget alerts and goal deadlines
- Payment method tracking for expenses
- Profile enhancements (phone number, email verification status)
- Data validation and security enhancements
- Performance optimization
- Mobile responsiveness for all new features
- Dark mode consistency

**Out of Scope:**
- Recurring transactions (future enhancement)
- Multi-currency support
- Bank account integration
- Receipt photo upload and OCR
- Shared budgets for families
- AI-powered recommendations
- Investment tracking
- Tax category tagging

### Goals

1. **Complete Financial Picture**: Enable users to track both income and expenses for accurate balance calculation
2. **Budget Control**: Provide proactive budget management with alerts to prevent overspending
3. **Goal Achievement**: Support savings goals with visual progress tracking
4. **Comprehensive Analytics**: Deliver detailed reports with export capabilities for external analysis
5. **Seamless Integration**: Maintain existing functionality while adding new features without breaking changes
6. **Consistent UX**: Ensure all new features follow existing design patterns and support dark mode
7. **Performance**: Maintain fast response times even with large datasets
8. **Security**: Protect user financial data with proper validation and authorization

### Success Criteria

- All HIGH priority requirements implemented and tested
- Users can track income and expenses with accurate balance calculation
- Budget alerts trigger at 80% and 100% thresholds
- Dashboard displays comprehensive financial overview in under 500ms
- All features work on mobile devices (320px to 2560px)
- Dark mode supported across all new features
- No existing functionality broken
- API response times under 500ms for users with up to 10,000 transactions


## Architecture

### System Architecture

The application follows a **three-tier architecture**:

1. **Presentation Layer** (React/TypeScript Frontend)
   - Single Page Application (SPA) with React 19
   - Client-side routing with React Router v7
   - State management with Zustand
   - UI components with Tailwind CSS
   - Charts with Chart.js and react-chartjs-2
   - Form validation with React Hook Form + Zod

2. **Application Layer** (FastAPI Backend)
   - RESTful API with FastAPI 0.115+
   - JWT-based authentication
   - Pydantic v2 for request/response validation
   - SQLAlchemy 2.0 ORM for database operations
   - Async/await support for I/O operations

3. **Data Layer** (PostgreSQL/SQLite Database)
   - PostgreSQL for production (Railway/Render)
   - SQLite for local development
   - Connection pooling for performance
   - Database migrations with SQLAlchemy

### Technology Stack

**Backend:**
- **Framework**: FastAPI 0.115.0+
- **Language**: Python 3.11+
- **ORM**: SQLAlchemy 2.0.36+
- **Validation**: Pydantic 2.10.0+ with email validation
- **Authentication**: python-jose 3.3.0 (JWT), passlib 1.7.4 (bcrypt)
- **OAuth**: google-auth 2.27.0
- **HTTP Client**: httpx 0.27.0+
- **Database**: PostgreSQL (production), SQLite (development)
- **Server**: Uvicorn with standard extras

**Frontend:**
- **Framework**: React 19.2.5
- **Language**: TypeScript 6.0.3
- **Build Tool**: Vite 8.0.9
- **Routing**: React Router DOM 7.14.2
- **State Management**: Zustand 5.0.12
- **Forms**: React Hook Form 7.73.1 + Zod 4.3.6
- **HTTP Client**: Axios 1.15.2
- **Charts**: Chart.js 4.5.1 + react-chartjs-2 5.3.1
- **UI Library**: Tailwind CSS 3.4.19
- **Icons**: Lucide React 1.8.0, Heroicons 2.2.0
- **Animations**: Framer Motion 12.38.0
- **Notifications**: React Hot Toast 2.6.0
- **Date Handling**: date-fns 4.1.0

### Deployment Architecture

**Production Environment:**
- **Backend**: Railway or Render (containerized FastAPI)
- **Frontend**: Vercel (static SPA deployment)
- **Database**: Railway PostgreSQL or Render PostgreSQL
- **CDN**: Vercel Edge Network for frontend assets
- **SSL**: Automatic HTTPS via platform providers

**Development Environment:**
- **Backend**: Local Uvicorn server (http://localhost:8000)
- **Frontend**: Local Vite dev server (http://localhost:5173)
- **Database**: SQLite file (expenses.db)

### API Architecture

**RESTful API Design:**
- Resource-based URLs: `/api/{resource}/{id}`
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- JSON request/response format
- JWT Bearer token authentication
- CORS enabled for frontend origins
- Consistent error response format

**API Versioning:**
- Current version: v1 (implicit in base URL)
- Future versions: `/api/v2/{resource}` when breaking changes needed

### Security Architecture

**Authentication Flow:**
1. User registers or logs in (local or Google OAuth)
2. Backend generates JWT access token (24-hour expiry)
3. Frontend stores token in Zustand store (memory only)
4. All API requests include `Authorization: Bearer {token}` header
5. Backend validates token and extracts user_id for data isolation

**Authorization:**
- All financial data endpoints require authentication
- User can only access their own data (enforced by user_id filter)
- Database queries automatically filter by current user

**Data Protection:**
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens signed with HS256 algorithm
- Input validation on all endpoints (Pydantic schemas)
- SQL injection prevention (parameterized queries via SQLAlchemy)
- XSS prevention (React auto-escaping, backend sanitization)



## Components and Interfaces

### Backend Components

#### 1. Database Models (SQLAlchemy ORM)

**New Models:**

```python
# app/models/income.py
class Income(Base):
    __tablename__ = "income"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    source = Column(String, nullable=False, index=True)  # Salary, Business, Freelancing, Gifts, Other
    date = Column(Date, nullable=False, index=True)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    owner = relationship("User", back_populates="incomes")

# app/models/budget.py
class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    budget_type = Column(String, nullable=False)  # "overall" or "category"
    category = Column(String, nullable=True, index=True)  # Null for overall budgets
    amount = Column(Float, nullable=False)
    period_start = Column(Date, nullable=False, index=True)
    period_end = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    owner = relationship("User", back_populates="budgets")
    
    __table_args__ = (
        Index('idx_budget_period', 'user_id', 'period_start', 'period_end'),
    )

# app/models/savings_goal.py
class SavingsGoal(Base):
    __tablename__ = "savings_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0, nullable=False)
    deadline = Column(Date, nullable=False, index=True)
    status = Column(String, default="active", nullable=False)  # active, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    owner = relationship("User", back_populates="savings_goals")

# app/models/notification.py
class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String, nullable=False)  # budget_warning, budget_exceeded, goal_deadline, goal_completed
    title = Column(String(200), nullable=False)
    message = Column(String(500), nullable=False)
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    owner = relationship("User", back_populates="notifications")
```

**Modified Models:**

```python
# app/models/expense.py - Add payment_method field
class Expense(Base):
    __tablename__ = "expenses"
    
    # ... existing fields ...
    payment_method = Column(String, nullable=True)  # Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet
    
# app/models/user.py - Add profile fields
class User(Base):
    __tablename__ = "users"
    
    # ... existing fields ...
    phone_number = Column(String(20), nullable=True)
    email_verified = Column(Boolean, default=False, nullable=False)
    
    # New relationships
    incomes = relationship("Income", back_populates="owner", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="owner", cascade="all, delete-orphan")
    savings_goals = relationship("SavingsGoal", back_populates="owner", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="owner", cascade="all, delete-orphan")
```

#### 2. Pydantic Schemas (Request/Response Validation)

**Income Schemas:**

```python
# app/schemas/income.py
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional, Literal

class IncomeBase(BaseModel):
    amount: float = Field(..., gt=0, description="Income amount (must be positive)")
    source: Literal["Salary", "Business", "Freelancing", "Gifts", "Other"]
    date: date = Field(..., description="Income date (cannot be in future)")
    description: Optional[str] = Field(None, max_length=500)
    
    @field_validator('date')
    @classmethod
    def date_cannot_be_future(cls, v: date) -> date:
        if v > datetime.now().date():
            raise ValueError('Date cannot be in the future')
        return v

class IncomeCreate(IncomeBase):
    pass

class IncomeUpdate(IncomeBase):
    pass

class IncomeResponse(IncomeBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class IncomeListResponse(BaseModel):
    items: list[IncomeResponse]
    total: int
    skip: int
    limit: int
```

**Budget Schemas:**

```python
# app/schemas/budget.py
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional, Literal

class BudgetBase(BaseModel):
    budget_type: Literal["overall", "category"]
    category: Optional[str] = None  # Required if budget_type is "category"
    amount: float = Field(..., gt=0)
    period_start: date
    period_end: date
    
    @field_validator('period_end')
    @classmethod
    def period_end_after_start(cls, v: date, info) -> date:
        if 'period_start' in info.data and v <= info.data['period_start']:
            raise ValueError('period_end must be after period_start')
        return v
    
    @field_validator('category')
    @classmethod
    def category_required_for_category_budget(cls, v: Optional[str], info) -> Optional[str]:
        if info.data.get('budget_type') == 'category' and not v:
            raise ValueError('category is required for category budgets')
        if info.data.get('budget_type') == 'overall' and v:
            raise ValueError('category must be null for overall budgets')
        return v

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class BudgetStatus(BaseModel):
    budget: BudgetResponse
    spent_amount: float
    remaining_amount: float
    utilization_percentage: float
    status: Literal["safe", "warning", "exceeded"]  # <80%, 80-100%, >100%

class BudgetStatusListResponse(BaseModel):
    budgets: list[BudgetStatus]
```

**Savings Goal Schemas:**

```python
# app/schemas/savings_goal.py
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional, Literal

class SavingsGoalBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    target_amount: float = Field(..., gt=0)
    deadline: date
    
    @field_validator('deadline')
    @classmethod
    def deadline_must_be_future(cls, v: date) -> date:
        if v <= datetime.now().date():
            raise ValueError('Deadline must be in the future')
        return v

class SavingsGoalCreate(SavingsGoalBase):
    pass

class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    target_amount: Optional[float] = Field(None, gt=0)
    current_amount: Optional[float] = Field(None, ge=0)
    deadline: Optional[date] = None
    status: Optional[Literal["active", "completed", "cancelled"]] = None

class SavingsGoalResponse(SavingsGoalBase):
    id: int
    user_id: int
    current_amount: float
    status: str
    progress_percentage: float  # Computed field
    days_remaining: int  # Computed field
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
```

**Balance Schema:**

```python
# app/schemas/balance.py
from pydantic import BaseModel

class BalanceResponse(BaseModel):
    total_income: float
    total_expenses: float
    balance: float
    period: str  # "all_time", "current_month", "current_year"
```

**Notification Schemas:**

```python
# app/schemas/notification.py
from pydantic import BaseModel
from datetime import datetime
from typing import Literal

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: Literal["budget_warning", "budget_exceeded", "goal_deadline", "goal_completed"]
    title: str
    message: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
```

#### 3. API Routes (FastAPI Endpoints)

**Income Routes:**

```python
# app/routes/income.py
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

router = APIRouter()

@router.post("/", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    income: IncomeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new income record"""
    pass

@router.get("/", response_model=IncomeListResponse)
def list_incomes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    source: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    sort_by: str = Query("date", regex="^(date|amount)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's income records with filtering and pagination"""
    pass

@router.get("/{income_id}", response_model=IncomeResponse)
def get_income(
    income_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a single income record"""
    pass

@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int,
    income: IncomeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an income record"""
    pass

@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(
    income_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an income record"""
    pass
```

**Budget Routes:**

```python
# app/routes/budgets.py
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(
    budget: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new budget"""
    pass

@router.get("/", response_model=list[BudgetResponse])
def list_budgets(
    active_only: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's budgets"""
    pass

@router.get("/status", response_model=BudgetStatusListResponse)
def get_budget_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current budget status with utilization"""
    pass

@router.get("/{budget_id}", response_model=BudgetResponse)
def get_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a single budget"""
    pass

@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    budget: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a budget"""
    pass

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a budget"""
    pass
```

**Balance Routes:**

```python
# app/routes/balance.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Literal

router = APIRouter()

@router.get("/", response_model=BalanceResponse)
def get_balance(
    period: Literal["all_time", "current_month", "current_year"] = Query("all_time"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's balance (income - expenses) for specified period"""
    pass
```

**Savings Goal Routes:**

```python
# app/routes/savings_goals.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/", response_model=SavingsGoalResponse, status_code=status.HTTP_201_CREATED)
def create_savings_goal(
    goal: SavingsGoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new savings goal"""
    pass

@router.get("/", response_model=list[SavingsGoalResponse])
def list_savings_goals(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's savings goals"""
    pass

@router.get("/{goal_id}", response_model=SavingsGoalResponse)
def get_savings_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a single savings goal"""
    pass

@router.put("/{goal_id}", response_model=SavingsGoalResponse)
def update_savings_goal(
    goal_id: int,
    goal: SavingsGoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a savings goal"""
    pass

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_savings_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a savings goal"""
    pass
```

**Notification Routes:**

```python
# app/routes/notifications.py
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/", response_model=list[NotificationResponse])
def list_notifications(
    unread_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's notifications"""
    pass

@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read"""
    pass

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a notification"""
    pass

@router.get("/unread-count", response_model=dict)
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get count of unread notifications"""
    pass
```

**Reports Routes:**

```python
# app/routes/reports.py
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import date

router = APIRouter()

@router.post("/generate", response_model=ReportResponse)
def generate_report(
    start_date: date,
    end_date: date,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate financial report for date range"""
    pass

@router.get("/export/csv")
def export_csv(
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export report as CSV"""
    # Returns StreamingResponse with CSV file
    pass

@router.get("/export/excel")
def export_excel(
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export report as Excel"""
    # Returns StreamingResponse with Excel file
    pass

@router.get("/export/pdf")
def export_pdf(
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export report as PDF"""
    # Returns StreamingResponse with PDF file
    pass
```

**Enhanced Dashboard Route:**

```python
# app/routes/dashboard.py - Enhanced
@router.get("/", response_model=EnhancedDashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard data including income, balance, budgets, savings goals"""
    pass
```

#### 4. Service Layer (Business Logic)

```python
# app/services/budget_service.py
class BudgetService:
    @staticmethod
    def calculate_budget_utilization(budget: Budget, user_id: int, db: Session) -> BudgetStatus:
        """Calculate budget utilization and status"""
        pass
    
    @staticmethod
    def check_budget_alerts(user_id: int, db: Session) -> list[Notification]:
        """Check all budgets and create alerts if thresholds exceeded"""
        pass
    
    @staticmethod
    def validate_budget_uniqueness(budget: BudgetCreate, user_id: int, db: Session) -> bool:
        """Ensure only one budget per category/period"""
        pass

# app/services/savings_goal_service.py
class SavingsGoalService:
    @staticmethod
    def calculate_progress(goal: SavingsGoal) -> dict:
        """Calculate progress percentage and days remaining"""
        pass
    
    @staticmethod
    def check_goal_completion(goal: SavingsGoal, db: Session) -> bool:
        """Check if goal is completed and update status"""
        pass
    
    @staticmethod
    def check_goal_deadlines(user_id: int, db: Session) -> list[Notification]:
        """Check for approaching deadlines and create notifications"""
        pass

# app/services/balance_service.py
class BalanceService:
    @staticmethod
    def calculate_balance(user_id: int, period: str, db: Session) -> BalanceResponse:
        """Calculate balance for specified period"""
        pass

# app/services/report_service.py
class ReportService:
    @staticmethod
    def generate_report(user_id: int, start_date: date, end_date: date, db: Session) -> dict:
        """Generate comprehensive financial report"""
        pass
    
    @staticmethod
    def export_to_csv(report_data: dict) -> bytes:
        """Convert report data to CSV format"""
        pass
    
    @staticmethod
    def export_to_excel(report_data: dict) -> bytes:
        """Convert report data to Excel format"""
        pass
    
    @staticmethod
    def export_to_pdf(report_data: dict) -> bytes:
        """Convert report data to PDF format"""
        pass

# app/services/notification_service.py
class NotificationService:
    @staticmethod
    def create_notification(user_id: int, type: str, title: str, message: str, db: Session) -> Notification:
        """Create a new notification"""
        pass
    
    @staticmethod
    def process_budget_alerts(user_id: int, db: Session):
        """Process budget alerts after expense creation/update"""
        pass
    
    @staticmethod
    def process_goal_notifications(user_id: int, db: Session):
        """Process savings goal notifications"""
        pass
```

### Frontend Components

#### 1. Pages

```typescript
// src/pages/Income.tsx
// Income management page with list, filters, add/edit/delete functionality

// src/pages/Budgets.tsx
// Budget management page with list, progress bars, add/edit/delete functionality

// src/pages/SavingsGoals.tsx
// Savings goals page with list, progress tracking, add/edit/delete functionality

// src/pages/Reports.tsx
// Reports page with date range selection, report generation, and export options

// src/pages/Notifications.tsx
// Notifications page with list of all notifications

// src/pages/Dashboard.tsx - Enhanced
// Enhanced dashboard with income, balance, budgets, savings goals widgets
```

#### 2. UI Components

```typescript
// src/components/income/IncomeCard.tsx
// Display single income record in card format

// src/components/income/IncomeModal.tsx
// Modal for creating/editing income records

// src/components/income/IncomeList.tsx
// List of income records with filters and pagination

// src/components/budget/BudgetCard.tsx
// Display single budget with progress bar

// src/components/budget/BudgetModal.tsx
// Modal for creating/editing budgets

// src/components/budget/BudgetProgressBar.tsx
// Visual progress bar for budget utilization

// src/components/budget/BudgetAlertBanner.tsx
// Alert banner for exceeded budgets

// src/components/savings/SavingsGoalCard.tsx
// Display single savings goal with progress

// src/components/savings/SavingsGoalModal.tsx
// Modal for creating/editing savings goals

// src/components/savings/GoalProgressCircle.tsx
// Circular progress indicator for goals

// src/components/dashboard/IncomeVsExpenseChart.tsx
// Chart comparing income and expenses over time

// src/components/dashboard/BalanceCard.tsx
// Display current balance with color coding

// src/components/dashboard/BudgetWidget.tsx
// Dashboard widget showing budget status

// src/components/dashboard/SavingsWidget.tsx
// Dashboard widget showing active savings goals

// src/components/notifications/NotificationBell.tsx
// Header notification bell with unread count

// src/components/notifications/NotificationDropdown.tsx
// Dropdown showing recent notifications

// src/components/notifications/NotificationItem.tsx
// Single notification item

// src/components/reports/ReportGenerator.tsx
// Report generation form with date range picker

// src/components/reports/ReportSummary.tsx
// Display generated report data

// src/components/reports/ExportButtons.tsx
// Buttons for exporting reports (PDF, CSV, Excel)
```

#### 3. State Management (Zustand Stores)

```typescript
// src/store/incomeStore.ts
interface IncomeStore {
  incomes: Income[];
  totalIncome: number;
  isLoading: boolean;
  error: string | null;
  fetchIncomes: (filters?: IncomeFilters) => Promise<void>;
  createIncome: (income: IncomeCreate) => Promise<void>;
  updateIncome: (id: number, income: IncomeUpdate) => Promise<void>;
  deleteIncome: (id: number) => Promise<void>;
}

// src/store/budgetStore.ts
interface BudgetStore {
  budgets: Budget[];
  budgetStatus: BudgetStatus[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  fetchBudgetStatus: () => Promise<void>;
  createBudget: (budget: BudgetCreate) => Promise<void>;
  updateBudget: (id: number, budget: BudgetUpdate) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
}

// src/store/savingsGoalStore.ts
interface SavingsGoalStore {
  goals: SavingsGoal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  createGoal: (goal: SavingsGoalCreate) => Promise<void>;
  updateGoal: (id: number, goal: SavingsGoalUpdate) => Promise<void>;
  deleteGoal: (id: number) => Promise<void>;
}

// src/store/notificationStore.ts
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
}

// src/store/balanceStore.ts
interface BalanceStore {
  balance: BalanceResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchBalance: (period: string) => Promise<void>;
}
```

#### 4. API Client Functions

```typescript
// src/api/income.ts
export const incomeApi = {
  list: (params: IncomeListParams) => axios.get('/income', { params }),
  get: (id: number) => axios.get(`/income/${id}`),
  create: (data: IncomeCreate) => axios.post('/income', data),
  update: (id: number, data: IncomeUpdate) => axios.put(`/income/${id}`, data),
  delete: (id: number) => axios.delete(`/income/${id}`),
};

// src/api/budgets.ts
export const budgetApi = {
  list: () => axios.get('/budgets'),
  getStatus: () => axios.get('/budgets/status'),
  get: (id: number) => axios.get(`/budgets/${id}`),
  create: (data: BudgetCreate) => axios.post('/budgets', data),
  update: (id: number, data: BudgetUpdate) => axios.put(`/budgets/${id}`, data),
  delete: (id: number) => axios.delete(`/budgets/${id}`),
};

// src/api/savingsGoals.ts
export const savingsGoalApi = {
  list: (status?: string) => axios.get('/savings-goals', { params: { status } }),
  get: (id: number) => axios.get(`/savings-goals/${id}`),
  create: (data: SavingsGoalCreate) => axios.post('/savings-goals', data),
  update: (id: number, data: SavingsGoalUpdate) => axios.put(`/savings-goals/${id}`, data),
  delete: (id: number) => axios.delete(`/savings-goals/${id}`),
};

// src/api/balance.ts
export const balanceApi = {
  get: (period: string) => axios.get('/balance', { params: { period } }),
};

// src/api/notifications.ts
export const notificationApi = {
  list: (unreadOnly?: boolean) => axios.get('/notifications', { params: { unread_only: unreadOnly } }),
  markRead: (id: number) => axios.put(`/notifications/${id}/read`),
  delete: (id: number) => axios.delete(`/notifications/${id}`),
  getUnreadCount: () => axios.get('/notifications/unread-count'),
};

// src/api/reports.ts
export const reportApi = {
  generate: (startDate: string, endDate: string) => 
    axios.post('/reports/generate', { start_date: startDate, end_date: endDate }),
  exportCsv: (startDate: string, endDate: string) => 
    axios.get('/reports/export/csv', { params: { start_date: startDate, end_date: endDate }, responseType: 'blob' }),
  exportExcel: (startDate: string, endDate: string) => 
    axios.get('/reports/export/excel', { params: { start_date: startDate, end_date: endDate }, responseType: 'blob' }),
  exportPdf: (startDate: string, endDate: string) => 
    axios.get('/reports/export/pdf', { params: { start_date: startDate, end_date: endDate }, responseType: 'blob' }),
};
```



## Data Models

### Database Schema

#### Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ hashed_password │
│ name            │
│ picture         │
│ provider        │
│ is_active       │
│ phone_number    │◄────┐
│ email_verified  │     │
│ created_at      │     │
└─────────────────┘     │
         ▲              │
         │              │
         │ (1:N)        │
         │              │
┌────────┴────────┬─────┴──────────┬──────────────┬──────────────┬──────────────┐
│                 │                │              │              │              │
│                 │                │              │              │              │
▼                 ▼                ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ expenses │  │  income  │  │ budgets  │  │ savings_ │  │notifica- │  │recurring_│
│          │  │          │  │          │  │  goals   │  │  tions   │  │transact- │
├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  │  ions    │
│ id (PK)  │  │ id (PK)  │  │ id (PK)  │  │ id (PK)  │  │ id (PK)  │  ├──────────┤
│ user_id  │  │ user_id  │  │ user_id  │  │ user_id  │  │ user_id  │  │ id (PK)  │
│ title    │  │ amount   │  │ budget_  │  │ name     │  │ type     │  │ user_id  │
│ amount   │  │ source   │  │   type   │  │ target_  │  │ title    │  │ transact-│
│ category │  │ date     │  │ category │  │   amount │  │ message  │  │   ion_   │
│ date     │  │ descrip- │  │ amount   │  │ current_ │  │ is_read  │  │   type   │
│ descrip- │  │   tion   │  │ period_  │  │   amount │  │ created_ │  │ title    │
│   tion   │  │ created_ │  │   start  │  │ deadline │  │   at     │  │ amount   │
│ payment_ │  │   at     │  │ period_  │  │ status   │  └──────────┘  │ category_│
│  method  │  └──────────┘  │   end    │  │ created_ │                │   or_    │
└──────────┘                │ created_ │  │   at     │                │  source  │
                            │   at     │  │ complet- │                │ descrip- │
                            └──────────┘  │   ed_at  │                │   tion   │
                                          └──────────┘                │ payment_ │
                                                                      │  method  │
                                                                      │ frequency│
                                                                      │ start_   │
                                                                      │   date   │
                                                                      │ end_date │
                                                                      │ next_    │
                                                                      │  occur-  │
                                                                      │  rence   │
                                                                      │ is_active│
                                                                      └──────────┘
```

### Table Definitions

#### 1. users (Modified)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User email address |
| hashed_password | VARCHAR(255) | NULLABLE | Bcrypt hashed password (null for OAuth users) |
| name | VARCHAR(100) | NULLABLE | User's full name |
| picture | VARCHAR(500) | NULLABLE | Profile picture URL |
| provider | VARCHAR(20) | NOT NULL, DEFAULT 'local' | Auth provider (local/google) |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Account active status |
| phone_number | VARCHAR(20) | NULLABLE | **NEW** User's phone number |
| email_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | **NEW** Email verification status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email)

#### 2. expenses (Modified)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique expense identifier |
| user_id | INTEGER | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner user ID |
| title | VARCHAR(100) | NOT NULL, INDEX | Expense title |
| amount | FLOAT | NOT NULL | Expense amount |
| category | VARCHAR(50) | NOT NULL, INDEX | Expense category |
| date | DATE | NOT NULL, INDEX | Expense date |
| description | VARCHAR(500) | NULLABLE | Expense description |
| payment_method | VARCHAR(50) | NULLABLE | **NEW** Payment method used |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (title)
- INDEX (category)
- INDEX (date)
- COMPOSITE INDEX (user_id, date)

**Allowed Categories:**
- Food, Transport, Housing, Entertainment, Health, Shopping, Education, Other

**Allowed Payment Methods:**
- Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet

#### 3. income (New)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique income identifier |
| user_id | INTEGER | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner user ID |
| amount | FLOAT | NOT NULL | Income amount |
| source | VARCHAR(50) | NOT NULL, INDEX | Income source |
| date | DATE | NOT NULL, INDEX | Income date |
| description | VARCHAR(500) | NULLABLE | Income description |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (source)
- INDEX (date)
- COMPOSITE INDEX (user_id, date)

**Allowed Sources:**
- Salary, Business, Freelancing, Gifts, Other

#### 4. budgets (New)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique budget identifier |
| user_id | INTEGER | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner user ID |
| budget_type | VARCHAR(20) | NOT NULL | Budget type (overall/category) |
| category | VARCHAR(50) | NULLABLE, INDEX | Category (null for overall budgets) |
| amount | FLOAT | NOT NULL | Budget amount |
| period_start | DATE | NOT NULL, INDEX | Budget period start date |
| period_end | DATE | NOT NULL, INDEX | Budget period end date |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (category)
- INDEX (period_start)
- INDEX (period_end)
- COMPOSITE INDEX (user_id, period_start, period_end)

**Constraints:**
- period_end > period_start
- category required if budget_type = 'category'
- category must be null if budget_type = 'overall'
- UNIQUE (user_id, budget_type, category, period_start, period_end)

#### 5. savings_goals (New)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique goal identifier |
| user_id | INTEGER | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner user ID |
| name | VARCHAR(100) | NOT NULL | Goal name |
| target_amount | FLOAT | NOT NULL | Target amount to save |
| current_amount | FLOAT | NOT NULL, DEFAULT 0.0 | Current saved amount |
| deadline | DATE | NOT NULL, INDEX | Goal deadline |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | Goal status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| completed_at | TIMESTAMP | NULLABLE | Goal completion timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (deadline)
- INDEX (status)

**Allowed Status Values:**
- active, completed, cancelled

**Constraints:**
- target_amount > 0
- current_amount >= 0
- deadline > NOW() (at creation)

#### 6. notifications (New)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique notification identifier |
| user_id | INTEGER | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner user ID |
| type | VARCHAR(50) | NOT NULL | Notification type |
| title | VARCHAR(200) | NOT NULL | Notification title |
| message | VARCHAR(500) | NOT NULL | Notification message |
| is_read | BOOLEAN | NOT NULL, DEFAULT FALSE, INDEX | Read status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW(), INDEX | Creation timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (is_read)
- INDEX (created_at)
- COMPOSITE INDEX (user_id, is_read, created_at)

**Allowed Types:**
- budget_warning, budget_exceeded, goal_deadline, goal_completed

#### 7. recurring_transactions (Future Enhancement)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique recurring transaction identifier |
| user_id | INTEGER | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner user ID |
| transaction_type | VARCHAR(20) | NOT NULL | Type (expense/income) |
| title | VARCHAR(100) | NOT NULL | Transaction title |
| amount | FLOAT | NOT NULL | Transaction amount |
| category_or_source | VARCHAR(50) | NOT NULL | Category (expense) or source (income) |
| description | VARCHAR(500) | NULLABLE | Transaction description |
| payment_method | VARCHAR(50) | NULLABLE | Payment method (for expenses) |
| frequency | VARCHAR(20) | NOT NULL | Recurrence frequency |
| start_date | DATE | NOT NULL | Start date |
| end_date | DATE | NULLABLE | End date (null for indefinite) |
| next_occurrence | DATE | NOT NULL, INDEX | Next scheduled occurrence |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Active status |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (next_occurrence)
- INDEX (is_active)

**Allowed Frequencies:**
- daily, weekly, monthly, yearly

### Data Validation Rules

#### Amount Validation
- All amounts must be positive (> 0)
- Maximum 2 decimal places
- Maximum value: 999,999,999.99

#### Date Validation
- Expense/Income dates cannot be in the future
- Budget period_end must be after period_start
- Savings goal deadline must be in the future (at creation)
- Date format: YYYY-MM-DD (ISO 8601)

#### String Validation
- Title: 2-100 characters, trimmed
- Description: 0-500 characters, trimmed
- Email: Valid email format (RFC 5322)
- Phone: Optional, international format validation

#### Enum Validation
- Category: Must be one of allowed expense categories
- Source: Must be one of allowed income sources
- Payment Method: Must be one of allowed payment methods
- Budget Type: Must be "overall" or "category"
- Goal Status: Must be "active", "completed", or "cancelled"
- Notification Type: Must be one of allowed notification types

### Database Migrations

**Migration Strategy:**
1. Create new tables (income, budgets, savings_goals, notifications)
2. Add new columns to existing tables (expenses.payment_method, users.phone_number, users.email_verified)
3. Create indexes for performance
4. Add foreign key constraints
5. Add unique constraints for budgets

**Migration Files:**
```sql
-- 001_add_income_table.sql
CREATE TABLE income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    source VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_income_user_id ON income(user_id);
CREATE INDEX idx_income_source ON income(source);
CREATE INDEX idx_income_date ON income(date);
CREATE INDEX idx_income_user_date ON income(user_id, date);

-- 002_add_budgets_table.sql
CREATE TABLE budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    budget_type VARCHAR(20) NOT NULL,
    category VARCHAR(50),
    amount REAL NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, budget_type, category, period_start, period_end)
);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_period ON budgets(user_id, period_start, period_end);

-- 003_add_savings_goals_table.sql
CREATE TABLE savings_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0.0,
    deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX idx_savings_goals_deadline ON savings_goals(deadline);
CREATE INDEX idx_savings_goals_status ON savings_goals(status);

-- 004_add_notifications_table.sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message VARCHAR(500) NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_user_read_date ON notifications(user_id, is_read, created_at);

-- 005_add_payment_method_to_expenses.sql
ALTER TABLE expenses ADD COLUMN payment_method VARCHAR(50);

-- 006_add_profile_fields_to_users.sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0;
```



## Error Handling

### Error Response Format

All API errors follow a consistent JSON format:

```json
{
  "detail": "Error message describing what went wrong",
  "error_code": "SPECIFIC_ERROR_CODE",
  "status_code": 400
}
```

### HTTP Status Codes

| Status Code | Usage | Example |
|-------------|-------|---------|
| 200 OK | Successful GET, PUT requests | Fetching income list |
| 201 Created | Successful POST requests | Creating new budget |
| 204 No Content | Successful DELETE requests | Deleting expense |
| 400 Bad Request | Validation errors, invalid input | Invalid date format |
| 401 Unauthorized | Missing or invalid JWT token | Expired token |
| 403 Forbidden | User accessing another user's data | Accessing other user's budget |
| 404 Not Found | Resource doesn't exist | Income ID not found |
| 409 Conflict | Duplicate resource | Budget already exists for period |
| 422 Unprocessable Entity | Pydantic validation errors | Missing required field |
| 500 Internal Server Error | Unexpected server errors | Database connection failure |

### Error Categories

#### 1. Validation Errors (400, 422)

**Pydantic Validation:**
```json
{
  "detail": [
    {
      "loc": ["body", "amount"],
      "msg": "Amount must be greater than 0",
      "type": "value_error"
    }
  ]
}
```

**Custom Validation:**
```python
# Date in future
raise HTTPException(
    status_code=400,
    detail="Date cannot be in the future"
)

# Invalid category
raise HTTPException(
    status_code=400,
    detail="Invalid category. Must be one of: Food, Transport, Housing, Entertainment, Health, Shopping, Education, Other"
)
```

#### 2. Authentication Errors (401)

```python
# Missing token
raise HTTPException(
    status_code=401,
    detail="Not authenticated",
    headers={"WWW-Authenticate": "Bearer"}
)

# Invalid token
raise HTTPException(
    status_code=401,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"}
)

# Expired token
raise HTTPException(
    status_code=401,
    detail="Token has expired",
    headers={"WWW-Authenticate": "Bearer"}
)
```

#### 3. Authorization Errors (403)

```python
# Accessing another user's data
raise HTTPException(
    status_code=403,
    detail="Not authorized to access this resource"
)
```

#### 4. Not Found Errors (404)

```python
# Resource not found
raise HTTPException(
    status_code=404,
    detail=f"Income with id {income_id} not found"
)
```

#### 5. Conflict Errors (409)

```python
# Duplicate budget
raise HTTPException(
    status_code=409,
    detail="A budget already exists for this category and period"
)

# Email already registered
raise HTTPException(
    status_code=409,
    detail="Email already registered"
)
```

#### 6. Server Errors (500)

```python
# Database error
raise HTTPException(
    status_code=500,
    detail="An unexpected error occurred. Please try again later."
)
```

### Frontend Error Handling

#### Error Display Strategy

```typescript
// Toast notifications for user-facing errors
import toast from 'react-hot-toast';

// Success
toast.success('Income created successfully');

// Error
toast.error('Failed to create income: Amount must be positive');

// Warning
toast('Budget threshold exceeded', { icon: '⚠️' });
```

#### Error Handling Patterns

```typescript
// API call with error handling
try {
  await incomeApi.create(incomeData);
  toast.success('Income created successfully');
  fetchIncomes(); // Refresh list
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.detail || 'An error occurred';
    toast.error(message);
  } else {
    toast.error('An unexpected error occurred');
  }
}

// Form validation errors
const onSubmit = async (data: IncomeCreate) => {
  try {
    await incomeApi.create(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      // Pydantic validation errors
      const errors = error.response.data.detail;
      errors.forEach((err: any) => {
        const field = err.loc[err.loc.length - 1];
        setError(field, { message: err.msg });
      });
    }
  }
};
```

### Error Logging

#### Backend Logging

```python
import logging

logger = logging.getLogger(__name__)

# Log errors with context
try:
    # Database operation
    pass
except Exception as e:
    logger.error(f"Failed to create income for user {user_id}: {str(e)}", exc_info=True)
    raise HTTPException(status_code=500, detail="Failed to create income")
```

#### Frontend Error Tracking

```typescript
// Log errors to console in development
if (import.meta.env.DEV) {
  console.error('API Error:', error);
}

// In production, send to error tracking service (e.g., Sentry)
if (import.meta.env.PROD) {
  // Sentry.captureException(error);
}
```

### Validation Error Messages

#### Backend Validation Messages

```python
# Amount validation
"Amount must be greater than 0"
"Amount cannot exceed 999,999,999.99"

# Date validation
"Date cannot be in the future"
"period_end must be after period_start"
"Deadline must be in the future"

# String validation
"Title must be at least 2 characters"
"Description cannot exceed 500 characters"
"Email format is invalid"

# Enum validation
"Invalid category. Must be one of: Food, Transport, Housing, Entertainment, Health, Shopping, Education, Other"
"Invalid source. Must be one of: Salary, Business, Freelancing, Gifts, Other"
"Invalid payment method. Must be one of: Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet"

# Budget validation
"A budget already exists for this category and period"
"category is required for category budgets"
"category must be null for overall budgets"

# Savings goal validation
"Target amount must be greater than 0"
"Current amount cannot be negative"
"Deadline must be in the future"
```

#### Frontend Validation Messages

```typescript
// React Hook Form + Zod validation
const incomeSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  source: z.enum(['Salary', 'Business', 'Freelancing', 'Gifts', 'Other']),
  date: z.date().max(new Date(), 'Date cannot be in the future'),
  description: z.string().max(500, 'Description too long').optional(),
});
```



## Testing Strategy

### Testing Approach

This feature implementation does NOT use property-based testing. The features involve:
- CRUD operations with database persistence
- UI rendering and user interactions
- External service integration (database, file exports)
- Configuration and state management

These are best tested with **example-based unit tests**, **integration tests**, and **end-to-end tests**.

### Backend Testing

#### 1. Unit Tests (pytest)

**Test Coverage:**
- Pydantic schema validation
- Service layer business logic
- Utility functions
- Data transformations

**Example Tests:**

```python
# tests/test_schemas/test_income_schema.py
def test_income_create_valid():
    """Test valid income creation"""
    income = IncomeCreate(
        amount=1000.50,
        source="Salary",
        date=date.today(),
        description="Monthly salary"
    )
    assert income.amount == 1000.50
    assert income.source == "Salary"

def test_income_create_future_date_fails():
    """Test that future dates are rejected"""
    with pytest.raises(ValidationError):
        IncomeCreate(
            amount=1000,
            source="Salary",
            date=date.today() + timedelta(days=1)
        )

def test_income_create_negative_amount_fails():
    """Test that negative amounts are rejected"""
    with pytest.raises(ValidationError):
        IncomeCreate(
            amount=-100,
            source="Salary",
            date=date.today()
        )

# tests/test_services/test_budget_service.py
def test_calculate_budget_utilization():
    """Test budget utilization calculation"""
    budget = Budget(amount=1000, period_start=date(2024, 1, 1), period_end=date(2024, 1, 31))
    spent = 800
    status = BudgetService.calculate_budget_utilization(budget, spent)
    assert status.utilization_percentage == 80.0
    assert status.status == "warning"

def test_budget_alert_at_80_percent():
    """Test that alert is created at 80% threshold"""
    # Setup: Create budget and expenses totaling 80%
    # Assert: Notification created with type "budget_warning"
    pass

def test_budget_alert_at_100_percent():
    """Test that alert is created at 100% threshold"""
    # Setup: Create budget and expenses totaling 100%
    # Assert: Notification created with type "budget_exceeded"
    pass

# tests/test_services/test_savings_goal_service.py
def test_calculate_progress_percentage():
    """Test savings goal progress calculation"""
    goal = SavingsGoal(target_amount=1000, current_amount=250)
    progress = SavingsGoalService.calculate_progress(goal)
    assert progress['percentage'] == 25.0

def test_auto_complete_goal_when_target_reached():
    """Test that goal is auto-completed when target reached"""
    goal = SavingsGoal(target_amount=1000, current_amount=1000, status="active")
    SavingsGoalService.check_goal_completion(goal, db)
    assert goal.status == "completed"
    assert goal.completed_at is not None
```

#### 2. Integration Tests (pytest + TestClient)

**Test Coverage:**
- API endpoint functionality
- Database operations
- Authentication and authorization
- Error handling

**Example Tests:**

```python
# tests/test_routes/test_income_routes.py
def test_create_income_success(client, auth_headers):
    """Test successful income creation"""
    response = client.post(
        "/income",
        json={
            "amount": 5000,
            "source": "Salary",
            "date": "2024-01-15",
            "description": "January salary"
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 5000
    assert data["source"] == "Salary"

def test_create_income_unauthorized(client):
    """Test that income creation requires authentication"""
    response = client.post("/income", json={"amount": 1000, "source": "Salary", "date": "2024-01-15"})
    assert response.status_code == 401

def test_list_incomes_filtered_by_source(client, auth_headers, db_session):
    """Test income list filtering by source"""
    # Setup: Create multiple income records with different sources
    # Test: Filter by source="Salary"
    # Assert: Only salary income returned
    pass

def test_user_cannot_access_other_user_income(client, auth_headers_user1, auth_headers_user2):
    """Test data isolation between users"""
    # User 1 creates income
    response1 = client.post("/income", json={...}, headers=auth_headers_user1)
    income_id = response1.json()["id"]
    
    # User 2 tries to access User 1's income
    response2 = client.get(f"/income/{income_id}", headers=auth_headers_user2)
    assert response2.status_code == 403

# tests/test_routes/test_budget_routes.py
def test_create_budget_success(client, auth_headers):
    """Test successful budget creation"""
    response = client.post(
        "/budgets",
        json={
            "budget_type": "category",
            "category": "Food",
            "amount": 500,
            "period_start": "2024-01-01",
            "period_end": "2024-01-31"
        },
        headers=auth_headers
    )
    assert response.status_code == 201

def test_create_duplicate_budget_fails(client, auth_headers):
    """Test that duplicate budgets are rejected"""
    budget_data = {
        "budget_type": "category",
        "category": "Food",
        "amount": 500,
        "period_start": "2024-01-01",
        "period_end": "2024-01-31"
    }
    # Create first budget
    client.post("/budgets", json=budget_data, headers=auth_headers)
    # Try to create duplicate
    response = client.post("/budgets", json=budget_data, headers=auth_headers)
    assert response.status_code == 409

def test_get_budget_status(client, auth_headers, db_session):
    """Test budget status endpoint"""
    # Setup: Create budget and expenses
    # Test: Get budget status
    # Assert: Correct utilization percentage and status
    pass

# tests/test_routes/test_balance_routes.py
def test_get_balance_all_time(client, auth_headers, db_session):
    """Test balance calculation for all time"""
    # Setup: Create income and expenses
    # Test: Get balance
    # Assert: Correct balance = income - expenses
    pass

def test_get_balance_current_month(client, auth_headers, db_session):
    """Test balance calculation for current month"""
    # Setup: Create income and expenses in different months
    # Test: Get balance for current month
    # Assert: Only current month transactions included
    pass
```

#### 3. Database Tests

```python
# tests/test_models/test_income_model.py
def test_income_model_creation(db_session):
    """Test income model creation and persistence"""
    income = Income(
        user_id=1,
        amount=1000,
        source="Salary",
        date=date.today(),
        description="Test income"
    )
    db_session.add(income)
    db_session.commit()
    
    assert income.id is not None
    assert income.created_at is not None

def test_income_cascade_delete_with_user(db_session):
    """Test that income is deleted when user is deleted"""
    user = User(email="test@example.com", hashed_password="hash")
    db_session.add(user)
    db_session.commit()
    
    income = Income(user_id=user.id, amount=1000, source="Salary", date=date.today())
    db_session.add(income)
    db_session.commit()
    
    db_session.delete(user)
    db_session.commit()
    
    assert db_session.query(Income).filter_by(id=income.id).first() is None
```

### Frontend Testing

#### 1. Component Tests (React Testing Library)

**Test Coverage:**
- Component rendering
- User interactions
- State management
- Form validation

**Example Tests:**

```typescript
// src/components/income/__tests__/IncomeCard.test.tsx
describe('IncomeCard', () => {
  it('renders income details correctly', () => {
    const income = {
      id: 1,
      amount: 5000,
      source: 'Salary',
      date: '2024-01-15',
      description: 'Monthly salary'
    };
    
    render(<IncomeCard income={income} />);
    
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    const income = { id: 1, amount: 5000, source: 'Salary', date: '2024-01-15' };
    
    render(<IncomeCard income={income} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(income);
  });
});

// src/components/budget/__tests__/BudgetProgressBar.test.tsx
describe('BudgetProgressBar', () => {
  it('shows green color when utilization < 80%', () => {
    render(<BudgetProgressBar utilization={50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-green-500');
  });
  
  it('shows yellow color when utilization 80-100%', () => {
    render(<BudgetProgressBar utilization={85} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-yellow-500');
  });
  
  it('shows red color when utilization > 100%', () => {
    render(<BudgetProgressBar utilization={120} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-red-500');
  });
});

// src/components/income/__tests__/IncomeModal.test.tsx
describe('IncomeModal', () => {
  it('validates required fields', async () => {
    render(<IncomeModal isOpen={true} onClose={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/source is required/i)).toBeInTheDocument();
    });
  });
  
  it('rejects future dates', async () => {
    render(<IncomeModal isOpen={true} onClose={jest.fn()} />);
    
    const dateInput = screen.getByLabelText(/date/i);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    fireEvent.change(dateInput, { target: { value: futureDate.toISOString().split('T')[0] } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/date cannot be in the future/i)).toBeInTheDocument();
    });
  });
});
```

#### 2. Integration Tests (React Testing Library + MSW)

```typescript
// src/pages/__tests__/Income.test.tsx
describe('Income Page', () => {
  it('loads and displays income list', async () => {
    // Mock API response
    server.use(
      rest.get('/api/income', (req, res, ctx) => {
        return res(ctx.json({
          items: [
            { id: 1, amount: 5000, source: 'Salary', date: '2024-01-15' },
            { id: 2, amount: 1000, source: 'Freelancing', date: '2024-01-20' }
          ],
          total: 2
        }));
      })
    );
    
    render(<IncomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    });
  });
  
  it('creates new income successfully', async () => {
    server.use(
      rest.post('/api/income', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ id: 3, ...req.body }));
      })
    );
    
    render(<IncomePage />);
    
    fireEvent.click(screen.getByRole('button', { name: /add income/i }));
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '3000' } });
    fireEvent.change(screen.getByLabelText(/source/i), { target: { value: 'Business' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-01-25' } });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/income created successfully/i)).toBeInTheDocument();
    });
  });
});
```

#### 3. E2E Tests (Playwright/Cypress)

```typescript
// e2e/income.spec.ts
describe('Income Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/income');
  });
  
  it('complete income workflow', () => {
    // Create income
    cy.contains('Add Income').click();
    cy.get('[name="amount"]').type('5000');
    cy.get('[name="source"]').select('Salary');
    cy.get('[name="date"]').type('2024-01-15');
    cy.get('[name="description"]').type('Monthly salary');
    cy.contains('Save').click();
    
    cy.contains('Income created successfully').should('be.visible');
    cy.contains('$5,000.00').should('be.visible');
    
    // Edit income
    cy.contains('$5,000.00').parent().contains('Edit').click();
    cy.get('[name="amount"]').clear().type('5500');
    cy.contains('Save').click();
    
    cy.contains('Income updated successfully').should('be.visible');
    cy.contains('$5,500.00').should('be.visible');
    
    // Delete income
    cy.contains('$5,500.00').parent().contains('Delete').click();
    cy.contains('Confirm').click();
    
    cy.contains('Income deleted successfully').should('be.visible');
    cy.contains('$5,500.00').should('not.exist');
  });
});

// e2e/budget-alerts.spec.ts
describe('Budget Alerts', () => {
  it('shows warning at 80% budget utilization', () => {
    cy.login('test@example.com', 'password123');
    
    // Create budget
    cy.visit('/budgets');
    cy.contains('Add Budget').click();
    cy.get('[name="budget_type"]').select('category');
    cy.get('[name="category"]').select('Food');
    cy.get('[name="amount"]').type('1000');
    cy.contains('Save').click();
    
    // Create expenses totaling 80% of budget
    cy.visit('/expenses');
    cy.contains('Add Expense').click();
    cy.get('[name="amount"]').type('800');
    cy.get('[name="category"]').select('Food');
    cy.contains('Save').click();
    
    // Check dashboard for alert
    cy.visit('/dashboard');
    cy.contains('Budget Warning').should('be.visible');
    cy.contains('80%').should('be.visible');
  });
});
```

### Performance Testing

#### Load Testing (Locust)

```python
# locustfile.py
from locust import HttpUser, task, between

class ExpenseTrackerUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        # Login and get token
        response = self.client.post("/auth/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(3)
    def get_dashboard(self):
        self.client.get("/dashboard", headers=self.headers)
    
    @task(2)
    def list_expenses(self):
        self.client.get("/expenses", headers=self.headers)
    
    @task(2)
    def list_income(self):
        self.client.get("/income", headers=self.headers)
    
    @task(1)
    def get_budget_status(self):
        self.client.get("/budgets/status", headers=self.headers)
    
    @task(1)
    def get_balance(self):
        self.client.get("/balance", headers=self.headers)
```

**Performance Targets:**
- Dashboard load time: < 500ms (with 10,000 transactions)
- API response time: < 200ms (95th percentile)
- Concurrent users: 100+ without degradation
- Database query time: < 100ms (with proper indexes)

### Test Coverage Goals

- **Backend**: 80%+ code coverage
- **Frontend**: 70%+ code coverage
- **Critical paths**: 100% coverage (authentication, data isolation, budget alerts)

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run tests
        run: pytest --cov=app --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```



## Performance Optimization

### Backend Performance

#### 1. Database Optimization

**Indexing Strategy:**
```sql
-- User-based queries (most common)
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_income_user_id ON income(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Date-based queries (filtering, sorting)
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_income_date ON income(date);
CREATE INDEX idx_budgets_period ON budgets(period_start, period_end);
CREATE INDEX idx_savings_goals_deadline ON savings_goals(deadline);

-- Composite indexes for common query patterns
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX idx_income_user_date ON income(user_id, date);
CREATE INDEX idx_budgets_user_period ON budgets(user_id, period_start, period_end);
CREATE INDEX idx_notifications_user_read_date ON notifications(user_id, is_read, created_at);

-- Category/source filtering
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_income_source ON income(source);
```

**Query Optimization:**
```python
# Use select_related/joinedload to avoid N+1 queries
expenses = db.query(Expense).options(
    joinedload(Expense.owner)
).filter(Expense.user_id == user_id).all()

# Use pagination to limit result sets
expenses = db.query(Expense).filter(
    Expense.user_id == user_id
).offset(skip).limit(limit).all()

# Use aggregation functions in database
total_expenses = db.query(func.sum(Expense.amount)).filter(
    Expense.user_id == user_id
).scalar()

# Filter at database level, not in Python
expenses = db.query(Expense).filter(
    Expense.user_id == user_id,
    Expense.date >= start_date,
    Expense.date <= end_date
).all()
```

**Connection Pooling:**
```python
# PostgreSQL connection pool configuration
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Verify connections before use
    pool_size=5,             # Maintain 5 connections
    max_overflow=10,         # Allow 10 additional connections
    pool_recycle=3600        # Recycle connections after 1 hour
)
```

#### 2. Caching Strategy

**Dashboard Caching:**
```python
from functools import lru_cache
from datetime import datetime, timedelta

# Cache dashboard data for 5 minutes
@lru_cache(maxsize=128)
def get_cached_dashboard(user_id: int, cache_key: str):
    """Cache dashboard data with 5-minute TTL"""
    return calculate_dashboard_data(user_id)

# Generate cache key with timestamp rounded to 5 minutes
def get_dashboard_cache_key(user_id: int) -> str:
    now = datetime.now()
    rounded = now - timedelta(minutes=now.minute % 5, seconds=now.second, microseconds=now.microsecond)
    return f"{user_id}_{rounded.isoformat()}"

# Usage in route
@router.get("/dashboard")
def get_dashboard(current_user: User = Depends(get_current_user)):
    cache_key = get_dashboard_cache_key(current_user.id)
    return get_cached_dashboard(current_user.id, cache_key)
```

**Budget Status Caching:**
```python
# Cache budget status calculations
@lru_cache(maxsize=256)
def get_cached_budget_status(user_id: int, cache_key: str):
    """Cache budget status with 5-minute TTL"""
    return calculate_budget_status(user_id)
```

**Cache Invalidation:**
```python
# Invalidate cache when data changes
def create_expense(expense: ExpenseCreate, user_id: int, db: Session):
    # Create expense
    db_expense = Expense(**expense.dict(), user_id=user_id)
    db.add(db_expense)
    db.commit()
    
    # Invalidate caches
    get_cached_dashboard.cache_clear()
    get_cached_budget_status.cache_clear()
    
    return db_expense
```

#### 3. Response Optimization

**Gzip Compression:**
```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

**Pagination:**
```python
# Always paginate list endpoints
@router.get("/expenses")
def list_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),  # Max 100 items per page
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    total = db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).count()
    
    return {
        "items": expenses,
        "total": total,
        "skip": skip,
        "limit": limit
    }
```

**Selective Field Loading:**
```python
# Load only required fields for list views
expenses = db.query(
    Expense.id,
    Expense.title,
    Expense.amount,
    Expense.category,
    Expense.date
).filter(Expense.user_id == user_id).all()
```

### Frontend Performance

#### 1. Code Splitting

```typescript
// Lazy load pages
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Income = lazy(() => import('./pages/Income'));
const Budgets = lazy(() => import('./pages/Budgets'));
const SavingsGoals = lazy(() => import('./pages/SavingsGoals'));
const Reports = lazy(() => import('./pages/Reports'));

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/income" element={<Income />} />
    <Route path="/budgets" element={<Budgets />} />
    <Route path="/savings-goals" element={<SavingsGoals />} />
    <Route path="/reports" element={<Reports />} />
  </Routes>
</Suspense>
```

#### 2. Data Fetching Optimization

**Debounced Search:**
```typescript
import { useDebounce } from '@/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    fetchIncomes({ search: debouncedSearch });
  }
}, [debouncedSearch]);
```

**Optimistic Updates:**
```typescript
const deleteIncome = async (id: number) => {
  // Optimistically update UI
  setIncomes(prev => prev.filter(i => i.id !== id));
  
  try {
    await incomeApi.delete(id);
    toast.success('Income deleted');
  } catch (error) {
    // Revert on error
    fetchIncomes();
    toast.error('Failed to delete income');
  }
};
```

**Request Deduplication:**
```typescript
// Use Zustand to prevent duplicate API calls
const fetchIncomes = async () => {
  if (isLoading) return; // Prevent duplicate requests
  
  setIsLoading(true);
  try {
    const response = await incomeApi.list();
    setIncomes(response.data.items);
  } finally {
    setIsLoading(false);
  }
};
```

#### 3. Rendering Optimization

**Memoization:**
```typescript
import { memo, useMemo } from 'react';

// Memoize expensive calculations
const totalIncome = useMemo(() => {
  return incomes.reduce((sum, income) => sum + income.amount, 0);
}, [incomes]);

// Memoize components
const IncomeCard = memo(({ income, onEdit, onDelete }) => {
  return (
    <div className="income-card">
      {/* Card content */}
    </div>
  );
});
```

**Virtual Scrolling:**
```typescript
// For large lists (1000+ items), use virtual scrolling
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={incomes.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <IncomeCard income={incomes[index]} />
    </div>
  )}
</FixedSizeList>
```

**Lazy Loading Images:**
```typescript
<img
  src={profilePicture}
  alt="Profile"
  loading="lazy"
  className="profile-image"
/>
```

#### 4. Bundle Optimization

**Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'form-vendor': ['react-hook-form', 'zod'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

**Tree Shaking:**
```typescript
// Import only what you need
import { format } from 'date-fns'; // ✅ Good
// import * as dateFns from 'date-fns'; // ❌ Bad

import { LineChart } from 'recharts'; // ✅ Good
// import * as Recharts from 'recharts'; // ❌ Bad
```

### Performance Monitoring

#### Backend Monitoring

```python
import time
from fastapi import Request

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    # Log slow requests
    if process_time > 1.0:
        logger.warning(f"Slow request: {request.url.path} took {process_time:.2f}s")
    
    return response
```

#### Frontend Monitoring

```typescript
// Performance API
const measurePageLoad = () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart);
};

// Component render time
const ComponentWithPerfTracking = () => {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log('Component render time:', end - start);
    };
  }, []);
};
```

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard load time | < 500ms | Time to interactive |
| API response time (p95) | < 200ms | Server processing time |
| API response time (p99) | < 500ms | Server processing time |
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Bundle size (initial) | < 300KB | Gzipped |
| Bundle size (total) | < 1MB | Gzipped |
| Database query time | < 100ms | With 10,000 records |
| Concurrent users | 100+ | Load testing |



## Security Considerations

### Authentication Security

#### JWT Token Management

**Token Generation:**
```python
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token with expiration"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
    return encoded_jwt
```

**Token Validation:**
```python
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Validate JWT token and return current user"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        email: str = payload.get("sub")
        
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user
```

**Token Storage (Frontend):**
```typescript
// Store token in memory only (Zustand store)
// DO NOT store in localStorage or sessionStorage (XSS vulnerability)

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));
```

#### Password Security

**Password Hashing:**
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password using bcrypt with cost factor 12"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)
```

**Password Requirements:**
- Minimum 8 characters
- At least one number
- At least one uppercase letter (recommended)
- At least one special character (recommended)

```python
import re

def validate_password_strength(password: str) -> bool:
    """Validate password meets security requirements"""
    if len(password) < 8:
        return False
    if not re.search(r'\d', password):
        return False
    # Add more checks as needed
    return True
```

### Authorization Security

#### Data Isolation

**User-based Filtering:**
```python
# ALWAYS filter by user_id from JWT token
@router.get("/income")
def list_incomes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ✅ Correct: Filter by authenticated user
    incomes = db.query(Income).filter(
        Income.user_id == current_user.id
    ).all()
    return incomes

# ❌ NEVER trust user_id from request body or query params
@router.get("/income")
def list_incomes_INSECURE(
    user_id: int = Query(...),  # ❌ INSECURE
    db: Session = Depends(get_db)
):
    incomes = db.query(Income).filter(
        Income.user_id == user_id  # ❌ Any user can access any data
    ).all()
    return incomes
```

**Resource Ownership Verification:**
```python
@router.get("/income/{income_id}")
def get_income(
    income_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    income = db.query(Income).filter(Income.id == income_id).first()
    
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    
    # Verify ownership
    if income.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
    
    return income
```

### Input Validation Security

#### SQL Injection Prevention

**Use Parameterized Queries:**
```python
# ✅ Safe: SQLAlchemy ORM uses parameterized queries
expenses = db.query(Expense).filter(
    Expense.category == category,
    Expense.user_id == user_id
).all()

# ✅ Safe: Explicit parameterization
db.execute(
    "SELECT * FROM expenses WHERE category = :category AND user_id = :user_id",
    {"category": category, "user_id": user_id}
)

# ❌ NEVER use string formatting
db.execute(f"SELECT * FROM expenses WHERE category = '{category}'")  # ❌ INSECURE
```

#### XSS Prevention

**Backend Sanitization:**
```python
import bleach

def sanitize_html(text: str) -> str:
    """Remove HTML tags and dangerous content"""
    return bleach.clean(text, tags=[], strip=True)

# Apply to user inputs
@router.post("/income")
def create_income(income: IncomeCreate, current_user: User = Depends(get_current_user)):
    # Sanitize description
    if income.description:
        income.description = sanitize_html(income.description)
    
    # Create income
    db_income = Income(**income.dict(), user_id=current_user.id)
    db.add(db_income)
    db.commit()
    return db_income
```

**Frontend Escaping:**
```typescript
// React automatically escapes content in JSX
<div>{income.description}</div> // ✅ Safe

// Be careful with dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: income.description }} /> // ❌ Dangerous

// Use DOMPurify for HTML content
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(income.description) }} />
```

#### CSRF Protection

**SameSite Cookies:**
```python
# If using cookies (not applicable for JWT in headers)
response.set_cookie(
    key="session",
    value=session_id,
    httponly=True,
    secure=True,
    samesite="strict"
)
```

**CORS Configuration:**
```python
# Restrict allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://expense-tracker.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### Rate Limiting

**API Rate Limiting:**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply rate limits to sensitive endpoints
@router.post("/auth/login")
@limiter.limit("5/minute")  # 5 attempts per minute
def login(request: Request, credentials: LoginCredentials):
    pass

@router.post("/income")
@limiter.limit("100/hour")  # 100 creates per hour
def create_income(request: Request, income: IncomeCreate):
    pass
```

### Data Privacy

#### Sensitive Data Handling

**Password Handling:**
```python
# Never log passwords
logger.info(f"User login attempt: {email}")  # ✅ Safe
logger.info(f"User login: {email} with password {password}")  # ❌ NEVER

# Never return passwords in responses
class UserResponse(BaseModel):
    id: int
    email: str
    # hashed_password excluded
```

**Error Messages:**
```python
# Don't leak information in error messages
# ❌ Bad: Reveals if email exists
if not user:
    raise HTTPException(status_code=404, detail="User not found")
if not verify_password(password, user.hashed_password):
    raise HTTPException(status_code=401, detail="Incorrect password")

# ✅ Good: Generic message
if not user or not verify_password(password, user.hashed_password):
    raise HTTPException(status_code=401, detail="Invalid email or password")
```

#### Logging Security

```python
import logging

# Configure logging to exclude sensitive data
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Log security events
logger.info(f"User {user_id} logged in from {ip_address}")
logger.warning(f"Failed login attempt for {email} from {ip_address}")
logger.error(f"Unauthorized access attempt to income {income_id} by user {user_id}")

# Never log sensitive data
# ❌ Don't log: passwords, tokens, credit card numbers, SSNs
```

### HTTPS/TLS

**Production Requirements:**
- All traffic must use HTTPS
- TLS 1.2 or higher
- Valid SSL certificate
- HSTS header enabled

```python
# Add security headers
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

if settings.environment == "production":
    app.add_middleware(HTTPSRedirectMiddleware)
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["expense-tracker.vercel.app", "api.expense-tracker.com"]
    )

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

### Dependency Security

**Regular Updates:**
```bash
# Check for vulnerabilities
pip-audit
npm audit

# Update dependencies
pip install --upgrade -r requirements.txt
npm update
```

**Pinned Versions:**
```txt
# requirements.txt - Use exact versions in production
fastapi==0.115.0
sqlalchemy==2.0.36
pydantic==2.10.0
```

### Security Checklist

- [ ] JWT tokens expire after 24 hours
- [ ] Passwords hashed with bcrypt (cost factor 12)
- [ ] All API endpoints require authentication
- [ ] User data isolated by user_id from JWT
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization, output escaping)
- [ ] CORS restricted to known origins
- [ ] Rate limiting on sensitive endpoints
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Sensitive data not logged
- [ ] Error messages don't leak information
- [ ] Dependencies regularly updated
- [ ] Security audit performed



## Deployment Strategy

### Environment Configuration

#### Backend Environment Variables

```bash
# .env.production
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Security
SECRET_KEY=your-secret-key-min-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
ALLOWED_ORIGINS=https://expense-tracker.vercel.app,https://www.expense-tracker.com
FRONTEND_URL=https://expense-tracker.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://api.expense-tracker.com/auth/google/callback

# Environment
ENVIRONMENT=production
```

#### Frontend Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.expense-tracker.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_ENVIRONMENT=production
```

### Database Deployment

#### Migration Strategy

**1. Pre-deployment Backup:**
```bash
# PostgreSQL backup
pg_dump -h host -U user -d dbname > backup_$(date +%Y%m%d_%H%M%S).sql

# SQLite backup
cp expenses.db expenses_backup_$(date +%Y%m%d_%H%M%S).db
```

**2. Run Migrations:**
```python
# app/db/migrations.py
from sqlalchemy import text

def run_migrations(engine):
    """Run database migrations"""
    migrations = [
        "001_add_income_table.sql",
        "002_add_budgets_table.sql",
        "003_add_savings_goals_table.sql",
        "004_add_notifications_table.sql",
        "005_add_payment_method_to_expenses.sql",
        "006_add_profile_fields_to_users.sql"
    ]
    
    with engine.connect() as conn:
        for migration_file in migrations:
            with open(f"migrations/{migration_file}") as f:
                sql = f.read()
                conn.execute(text(sql))
                conn.commit()
                print(f"✅ Applied {migration_file}")

# Run migrations on startup
if __name__ == "__main__":
    from app.db.database import engine
    run_migrations(engine)
```

**3. Verify Migrations:**
```python
# Verify tables exist
def verify_migrations(engine):
    """Verify all tables exist"""
    required_tables = [
        "users", "expenses", "income", "budgets",
        "savings_goals", "notifications"
    ]
    
    with engine.connect() as conn:
        for table in required_tables:
            result = conn.execute(text(
                f"SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '{table}'"
            ))
            if result.scalar() == 0:
                raise Exception(f"Table {table} not found")
        print("✅ All tables verified")
```

### Backend Deployment (Railway/Render)

#### Railway Deployment

**1. railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**2. Procfile:**
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4
```

**3. Deployment Steps:**
```bash
# 1. Connect Railway to GitHub repo
railway link

# 2. Set environment variables in Railway dashboard
railway variables set DATABASE_URL=...
railway variables set SECRET_KEY=...
railway variables set ALLOWED_ORIGINS=...

# 3. Deploy
railway up

# 4. Run migrations
railway run python -c "from app.db.migrations import run_migrations; from app.db.database import engine; run_migrations(engine)"
```

#### Render Deployment

**render.yaml:**
```yaml
services:
  - type: web
    name: expense-tracker-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: expense-tracker-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: ALLOWED_ORIGINS
        value: https://expense-tracker.vercel.app
      - key: PYTHON_VERSION
        value: 3.11.0
    healthCheckPath: /health

databases:
  - name: expense-tracker-db
    databaseName: expense_tracker
    user: expense_tracker_user
```

### Frontend Deployment (Vercel)

#### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Deployment Steps

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project
vercel link

# 4. Set environment variables
vercel env add VITE_API_URL production
vercel env add VITE_GOOGLE_CLIENT_ID production

# 5. Deploy
vercel --prod
```

### CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run tests
        run: |
          cd backend
          pytest --cov=app --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run tests
        run: |
          cd frontend
          npm test -- --coverage
      - name: Build
        run: |
          cd frontend
          npm run build

  deploy-backend:
    needs: [test-backend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: [test-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Monitoring and Logging

#### Backend Monitoring

```python
# app/core/monitoring.py
import logging
from datetime import datetime

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Log important events
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    
    response = await call_next(request)
    
    duration = (datetime.now() - start_time).total_seconds()
    
    logger.info(
        f"{request.method} {request.url.path} "
        f"status={response.status_code} duration={duration:.3f}s"
    )
    
    return response
```

#### Error Tracking

```python
# Integration with Sentry (optional)
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

if settings.environment == "production":
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,
        environment=settings.environment
    )
```

#### Health Checks

```python
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint for monitoring"""
    try:
        # Check database connection
        db.execute(text("SELECT 1"))
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "disconnected",
            "error": str(e)
        }
```

### Rollback Strategy

#### Database Rollback

```bash
# Restore from backup
psql -h host -U user -d dbname < backup_20240115_120000.sql

# Or use migration rollback
python -c "from app.db.migrations import rollback_migration; rollback_migration('006_add_profile_fields_to_users.sql')"
```

#### Application Rollback

```bash
# Railway: Rollback to previous deployment
railway rollback

# Vercel: Rollback to previous deployment
vercel rollback
```

### Post-Deployment Verification

**Checklist:**
- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without errors
- [ ] User can login successfully
- [ ] Dashboard displays data correctly
- [ ] New features (income, budgets, savings goals) work
- [ ] API endpoints respond within performance targets
- [ ] Database migrations applied successfully
- [ ] No errors in application logs
- [ ] CORS configured correctly
- [ ] SSL certificate valid
- [ ] Environment variables set correctly

**Smoke Tests:**
```bash
# Test backend health
curl https://api.expense-tracker.com/health

# Test authentication
curl -X POST https://api.expense-tracker.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint
curl https://api.expense-tracker.com/dashboard \
  -H "Authorization: Bearer <token>"
```



## Implementation Phases

### Phase 1: Foundation (HIGH PRIORITY - Week 1-2)

**Objective:** Add core data models and basic CRUD operations for income and payment methods.

**Backend Tasks:**
1. Create Income model and migration
2. Create Income Pydantic schemas
3. Implement Income API routes (CRUD)
4. Add payment_method field to Expense model
5. Update Expense schemas to include payment_method
6. Add phone_number and email_verified fields to User model
7. Update User schemas for profile enhancement
8. Write unit tests for new models and schemas
9. Write integration tests for Income API

**Frontend Tasks:**
1. Create Income page with list view
2. Create IncomeCard component
3. Create IncomeModal for add/edit
4. Create incomeStore (Zustand)
5. Create incomeApi client functions
6. Add Income navigation link
7. Update Expense forms to include payment method selector
8. Update Profile page with new fields
9. Write component tests

**Deliverables:**
- Users can create, read, update, delete income records
- Users can select payment method when creating expenses
- Users can update phone number in profile
- All features tested and working

### Phase 2: Balance and Budget Management (HIGH PRIORITY - Week 3-4)

**Objective:** Implement balance calculation and budget management with alerts.

**Backend Tasks:**
1. Create Budget model and migration
2. Create Budget Pydantic schemas
3. Implement Budget API routes (CRUD)
4. Implement BudgetService for utilization calculation
5. Create balance calculation endpoint
6. Implement budget uniqueness validation
7. Create Notification model and migration
8. Implement budget alert logic (80%, 100% thresholds)
9. Write unit tests for budget calculations
10. Write integration tests for budget alerts

**Frontend Tasks:**
1. Create Budgets page with list view
2. Create BudgetCard component with progress bar
3. Create BudgetModal for add/edit
4. Create budgetStore (Zustand)
5. Create balanceStore (Zustand)
6. Create BalanceCard component for dashboard
7. Create BudgetAlertBanner component
8. Add budget status widget to dashboard
9. Implement budget alert notifications
10. Write component tests

**Deliverables:**
- Users can create and manage budgets (overall and category)
- Balance calculation working (income - expenses)
- Budget alerts trigger at 80% and 100%
- Dashboard shows balance and budget status
- All features tested and working

### Phase 3: Savings Goals and Enhanced Dashboard (MEDIUM PRIORITY - Week 5-6)

**Objective:** Add savings goals tracking and enhance dashboard with comprehensive financial overview.

**Backend Tasks:**
1. Create SavingsGoal model and migration
2. Create SavingsGoal Pydantic schemas
3. Implement SavingsGoal API routes (CRUD)
4. Implement SavingsGoalService for progress calculation
5. Implement auto-completion logic when target reached
6. Implement goal deadline notifications
7. Enhance dashboard endpoint to include income, balance, budgets, savings
8. Write unit tests for savings goal logic
9. Write integration tests for savings goals

**Frontend Tasks:**
1. Create SavingsGoals page with list view
2. Create SavingsGoalCard component with progress circle
3. Create SavingsGoalModal for add/edit
4. Create savingsGoalStore (Zustand)
5. Add savings goals widget to dashboard
6. Create IncomeVsExpenseChart component
7. Enhance dashboard layout with new widgets
8. Add quick action buttons to dashboard
9. Write component tests

**Deliverables:**
- Users can create and track savings goals
- Goals auto-complete when target reached
- Dashboard shows comprehensive financial overview
- Income vs expense chart on dashboard
- All features tested and working

### Phase 4: Reports and Analytics (MEDIUM PRIORITY - Week 7-8)

**Objective:** Implement comprehensive reporting with export functionality.

**Backend Tasks:**
1. Implement ReportService for data aggregation
2. Create report generation endpoint
3. Implement CSV export functionality
4. Implement Excel export functionality (openpyxl)
5. Implement PDF export functionality (reportlab)
6. Add report filtering and date range selection
7. Implement month-over-month comparisons
8. Write unit tests for report generation
9. Write integration tests for exports

**Frontend Tasks:**
1. Create Reports page with date range picker
2. Create ReportGenerator component
3. Create ReportSummary component with charts
4. Create ExportButtons component
5. Implement file download handling
6. Add report filtering UI
7. Create report charts (category breakdown, trends)
8. Write component tests

**Deliverables:**
- Users can generate reports for any date range
- Reports include comprehensive financial data
- Export to PDF, CSV, Excel working
- Report visualizations clear and informative
- All features tested and working

### Phase 5: Notifications System (LOW PRIORITY - Week 9)

**Objective:** Implement in-app notification system for budget alerts and goal deadlines.

**Backend Tasks:**
1. Implement NotificationService
2. Create Notification API routes
3. Integrate notification creation with budget alerts
4. Integrate notification creation with goal deadlines
5. Implement notification read/unread status
6. Implement notification deletion
7. Write unit tests for notification logic
8. Write integration tests for notifications

**Frontend Tasks:**
1. Create NotificationBell component for header
2. Create NotificationDropdown component
3. Create NotificationItem component
4. Create Notifications page (full list)
5. Create notificationStore (Zustand)
6. Implement real-time unread count
7. Add notification icons and styling
8. Write component tests

**Deliverables:**
- Notification bell in header with unread count
- Dropdown shows recent notifications
- Full notifications page available
- Notifications created for budget alerts and goal deadlines
- All features tested and working

### Phase 6: Performance Optimization and Polish (Week 10)

**Objective:** Optimize performance, fix bugs, and polish UI/UX.

**Backend Tasks:**
1. Add database indexes for performance
2. Implement response caching for dashboard
3. Optimize database queries (avoid N+1)
4. Add request/response compression
5. Implement rate limiting
6. Add performance monitoring
7. Run load tests and optimize bottlenecks
8. Fix any bugs found during testing

**Frontend Tasks:**
1. Implement code splitting for pages
2. Add lazy loading for images
3. Optimize bundle size
4. Implement debounced search
5. Add optimistic updates for better UX
6. Implement loading skeletons
7. Polish animations and transitions
8. Fix any UI bugs
9. Test on multiple devices and browsers
10. Ensure dark mode consistency

**Deliverables:**
- Dashboard loads in < 500ms
- API responses in < 200ms (p95)
- Bundle size optimized
- All features work smoothly on mobile
- Dark mode consistent across all features
- No critical bugs

### Cross-Cutting Tasks (All Phases)

**Security:**
- Input validation on all endpoints
- Authorization checks on all routes
- SQL injection prevention
- XSS prevention
- Rate limiting on sensitive endpoints

**Testing:**
- Unit tests for all services
- Integration tests for all API routes
- Component tests for all UI components
- E2E tests for critical user flows
- Performance testing

**Documentation:**
- API documentation (OpenAPI/Swagger)
- README updates
- Deployment guide
- User guide for new features

**Mobile Responsiveness:**
- Test all pages on mobile devices
- Ensure touch-friendly interactions
- Optimize layouts for small screens
- Test on iOS and Android browsers

**Dark Mode:**
- Apply dark mode to all new components
- Test contrast ratios
- Ensure consistency with existing design

## Success Metrics

### Functional Metrics
- All 15 requirements implemented and tested
- Zero critical bugs in production
- All acceptance criteria met
- 100% of HIGH priority features complete
- 100% of MEDIUM priority features complete

### Performance Metrics
- Dashboard load time: < 500ms
- API response time (p95): < 200ms
- API response time (p99): < 500ms
- Frontend bundle size: < 300KB (initial)
- Database query time: < 100ms

### Quality Metrics
- Backend test coverage: > 80%
- Frontend test coverage: > 70%
- Zero security vulnerabilities (high/critical)
- Lighthouse score: > 90
- Accessibility score (WCAG AA): 100%

### User Experience Metrics
- Mobile responsiveness: 320px - 2560px
- Dark mode support: 100% of features
- Error handling: All errors have user-friendly messages
- Loading states: All async operations show loading indicators

## Risk Mitigation

### Technical Risks

**Risk 1: Database Performance Degradation**
- **Mitigation:** Implement proper indexes, use pagination, optimize queries
- **Contingency:** Add caching layer, consider read replicas

**Risk 2: Breaking Existing Functionality**
- **Mitigation:** Comprehensive testing, backward compatibility checks
- **Contingency:** Feature flags, quick rollback capability

**Risk 3: Security Vulnerabilities**
- **Mitigation:** Security audit, input validation, rate limiting
- **Contingency:** Security monitoring, incident response plan

**Risk 4: Third-party Service Failures**
- **Mitigation:** Error handling, graceful degradation
- **Contingency:** Fallback mechanisms, service monitoring

### Project Risks

**Risk 1: Scope Creep**
- **Mitigation:** Strict adherence to requirements, change control process
- **Contingency:** Prioritize HIGH priority features, defer LOW priority

**Risk 2: Timeline Delays**
- **Mitigation:** Phased implementation, regular progress tracking
- **Contingency:** Adjust scope, focus on critical features

**Risk 3: Resource Constraints**
- **Mitigation:** Clear task breakdown, efficient development practices
- **Contingency:** Extend timeline, reduce scope

## Conclusion

This design document provides a comprehensive technical specification for extending the Personal Expense Tracker with complete financial management features. The phased implementation approach ensures that high-priority features are delivered first, while maintaining code quality, security, and performance throughout the development process.

The design follows modern best practices for FastAPI backend and React/TypeScript frontend development, with emphasis on:
- **Security**: JWT authentication, data isolation, input validation
- **Performance**: Database optimization, caching, code splitting
- **Scalability**: Proper architecture, efficient queries, pagination
- **User Experience**: Responsive design, dark mode, intuitive UI
- **Maintainability**: Clean code, comprehensive testing, documentation

By following this design, the implementation will result in a production-ready, feature-complete personal finance management application that meets all user requirements and technical standards.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Implementation


# Expense Tracker Backend API

Professional FastAPI backend for personal finance tracking with JWT authentication, expense management, analytics dashboard, and AI-powered spending insights.

## 🏗️ Architecture

This backend follows **2026+ production-grade FastAPI architecture** with clean separation of concerns:

```
backend/
├── app/
│   ├── api/                    # API layer
│   │   └── v1/                 # API version 1
│   │       ├── routes/         # Route handlers (controllers)
│   │       └── api_router.py   # Main API router aggregator
│   │
│   ├── core/                   # Core functionality
│   │   ├── config.py           # Application configuration
│   │   ├── security.py         # Authentication & JWT
│   │   ├── database.py         # Database connection (moved from db/)
│   │   ├── dependencies.py     # Dependency injection
│   │   ├── middleware.py       # Custom middleware
│   │   ├── constants.py        # Application constants
│   │   ├── exceptions.py       # Custom exceptions
│   │   ├── error_handlers.py   # Exception handlers
│   │   └── logging_config.py   # Logging configuration
│   │
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── expense.py
│   │   ├── income.py
│   │   ├── budget.py
│   │   ├── savings_goal.py
│   │   └── recurring_transaction.py
│   │
│   ├── schemas/                # Pydantic schemas (DTOs)
│   │   ├── user.py
│   │   ├── expense.py
│   │   ├── income.py
│   │   ├── budget.py
│   │   ├── savings_goal.py
│   │   ├── recurring_transaction.py
│   │   ├── dashboard.py
│   │   ├── insights.py
│   │   └── report.py
│   │
│   ├── services/               # Business logic layer
│   │   ├── auth/               # Authentication services
│   │   │   └── email_service.py
│   │   ├── budget/             # Budget services
│   │   │   └── budget_service.py
│   │   ├── insights/           # Insights & analytics
│   │   │   └── insights_service.py
│   │   ├── recurring/          # Recurring transactions
│   │   │   └── recurring_service.py
│   │   ├── reports/            # Report generation
│   │   │   └── report_service.py
│   │   └── savings/            # Savings goals
│   │       └── savings_goal_service.py
│   │
│   ├── repositories/           # Data access layer (future)
│   │
│   ├── utils/                  # Utility functions
│   │   ├── date_utils.py       # Date/time utilities
│   │   └── validators.py       # Validation utilities
│   │
│   ├── tests/                  # Test suite
│   │   ├── unit/               # Unit tests
│   │   └── integration/        # Integration tests
│   │
│   └── main.py                 # FastAPI application entry point
│
├── scripts/                    # Utility scripts
│   ├── init_db.py              # Initialize database
│   ├── migrate.py              # Run migrations
│   ├── create_admin.py         # Create admin user
│   └── README.md               # Scripts documentation
│
├── migrations/                 # Database migrations
│
├── requirements/               # Dependencies
│   ├── base.txt                # Core dependencies
│   ├── dev.txt                 # Development dependencies
│   └── prod.txt                # Production dependencies
│
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

##     Features

### Authentication & Security
-     JWT-based authentication
-     Google OAuth integration
-     Password reset via email (Resend)
-     Secure password hashing (bcrypt)
-     Role-based access control (admin/user)

### Financial Management
-     Expense tracking with categories
-     Income tracking with sources
-     Budget management (overall & category-based)
-     Savings goals with progress tracking
-     Recurring transactions (auto-generation)

### Analytics & Insights
-     Dashboard with financial overview
-     Spending insights & trends
-     Budget alerts & notifications
-     Custom reports (PDF, Excel)
-     Category breakdown & analysis

## 📋 Prerequisites

- Python 3.10+
- PostgreSQL (production) or SQLite (development)
- Virtual environment (recommended)

## 🛠️ Installation

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements/dev.txt  # Development
# OR
pip install -r requirements/prod.txt  # Production
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - DATABASE_URL
# - SECRET_KEY
# - GOOGLE_CLIENT_ID (optional, for OAuth)
# - GOOGLE_CLIENT_SECRET (optional, for OAuth)
```

### 3. Database Setup

```bash
# Initialize database tables
python scripts/init_db.py

# Run migrations
python scripts/migrate.py

# Create admin user
python scripts/create_admin.py
```

## 🏃 Running the Application

### Development Mode

```bash
# Start development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
# Using uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# OR using gunicorn (recommended)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📚 API Documentation

Once running, access interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest app/tests/integration/test_budget_api.py

# Run with verbose output
pytest -v
```

## 🗄️ Database

### Supported Databases

- **SQLite**: Development (default)
- **PostgreSQL**: Production (recommended)

### Migrations

```bash
# Run all migrations
python scripts/migrate.py

# Check migration status
python scripts/migrate.py --status
```

## 🔐 Security

### Environment Variables

Never commit `.env` file. Use `.env.example` as template.

### Password Requirements

- Minimum 8 characters
- At least one number
- Hashed using bcrypt

### JWT Tokens

- Default expiration: 30 minutes
- Configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`

## 📊 Project Structure Principles

### Separation of Concerns

1. **Routes (Controllers)**: Handle HTTP requests/responses
2. **Services**: Contain business logic
3. **Models**: Define database schema
4. **Schemas**: Define API contracts (request/response)
5. **Repositories**: Data access layer (future enhancement)

### Dependency Injection

FastAPI's dependency injection system is used throughout:

```python
from app.core.dependencies import get_db, get_current_user

@router.get("/expenses")
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Route logic
    pass
```

### Error Handling

Centralized exception handling with custom exceptions:

```python
from app.core.exceptions import NotFoundException

raise NotFoundException("Resource not found")
```

## 🔧 Configuration

### Core Settings

Edit `app/core/config.py` or use environment variables:

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: JWT secret key
- `DEBUG`: Debug mode (default: False)
- `ALLOWED_ORIGINS`: CORS allowed origins

### Constants

Application constants in `app/core/constants.py`:

- API configuration
- Pagination defaults
- Budget thresholds
- Enums (categories, frequencies, etc.)

## 📝 Scripts

Utility scripts in `scripts/` directory:

```bash
# Initialize database
python scripts/init_db.py

# Run migrations
python scripts/migrate.py

# Create admin user
python scripts/create_admin.py

# Create test users
python scripts/create_test_user.py

# Reset user password
python scripts/reset_password.py

# Emergency password reset
python scripts/emergency_password_reset.py
```

See `scripts/README.md` for detailed documentation.

##     Deployment

### Railway / Render / Heroku

1. Set environment variables in platform dashboard
2. Use `requirements/prod.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Docker (Optional)

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements/prod.txt .
RUN pip install -r prod.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. Follow the existing architecture patterns
2. Write tests for new features
3. Update documentation
4. Use type hints
5. Follow PEP 8 style guide

## 📄 License

This project is part of a university assignment.

## 👨‍💻 Author

Built with ❤️ using FastAPI and modern Python best practices.

---

**Note**: This backend has been professionally restructured following 2026+ FastAPI production standards with clean architecture, separation of concerns, and enterprise-level maintainability.

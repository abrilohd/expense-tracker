# Expense Tracker API

A production-ready RESTful API for personal expense tracking with JWT authentication, analytics dashboard, and AI-powered spending insights.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Google OAuth**: Sign in with Google for seamless authentication
- **Expense Management**: Full CRUD operations for expense tracking
- **Advanced Filtering**: Search, filter, and sort expenses by multiple criteria
- **Analytics Dashboard**: Comprehensive spending summary with category breakdown and trends
- **AI Insights**: Rule-based spending pattern analysis with actionable recommendations
- **Data Validation**: Robust input validation with user-friendly error messages
- **Multi-Database Support**: SQLite for development, PostgreSQL for production

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.109.0
- **Database**: SQLAlchemy 2.0.25 (SQLite/PostgreSQL)
- **Authentication**: JWT (python-jose) + bcrypt (passlib)
- **Validation**: Pydantic 2.5.3
- **Server**: Uvicorn 0.27.0

## 📋 Prerequisites

- Python 3.8+
- pip (Python package manager)

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env and update:
# - SECRET_KEY (generate with: openssl rand -hex 32)
# - DATABASE_URL (if using PostgreSQL)
# - GOOGLE_CLIENT_ID (for Google OAuth)
# - GOOGLE_CLIENT_SECRET (for Google OAuth)
```

**For Google OAuth setup**, see: `../START-HERE-OAUTH.md` (5-minute quick fix)

### 5. Run the application

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and get JWT token | No |
| GET | `/auth/me` | Get current user profile | Yes |
| GET | `/auth/google/login` | Initiate Google OAuth flow | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |

### Expenses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/expenses` | Create new expense | Yes |
| GET | `/expenses` | List all expenses (with filters) | Yes |
| GET | `/expenses/{id}` | Get single expense | Yes |
| PUT | `/expenses/{id}` | Update expense | Yes |
| DELETE | `/expenses/{id}` | Delete expense | Yes |

**Query Parameters for GET /expenses:**
- `category`: Filter by category
- `start_date`: Filter from date (YYYY-MM-DD)
- `end_date`: Filter to date (YYYY-MM-DD)
- `search`: Search by title (partial match)
- `min_amount`: Minimum amount
- `max_amount`: Maximum amount
- `sort_by`: Sort by "date" or "amount"
- `order`: "asc" or "desc"
- `skip`: Pagination offset
- `limit`: Pagination limit (max 100)

### Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Get spending summary and analytics | Yes |

**Returns:**
- Total expenses and count
- Average, highest, lowest expense
- Current month statistics
- Category breakdown with percentages
- Monthly trends (last 6 months)
- Recent 5 expenses

### Insights

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/insights?days=30` | Get AI-powered spending insights | Yes |

**Query Parameters:**
- `days`: Analysis period in days (1-365, default: 30)

**Insight Types:**
- Top spending category
- Spending increase/decrease alerts
- Daily average spending
- Large transaction warnings
- Most active category
- Weekend vs weekday patterns

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Database connection string | `sqlite:///./expenses.db` | No |
| `SECRET_KEY` | JWT secret key | - | Yes |
| `ALGORITHM` | JWT algorithm | `HS256` | Yes |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | - | For OAuth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | - | For OAuth |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | `http://localhost:8000/auth/google/callback` | For OAuth |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` | For OAuth |

**Setting up Google OAuth?** See: `../START-HERE-OAUTH.md` for step-by-step instructions.

## 📊 Database Schema

### Users Table
- `id`: Integer (Primary Key)
- `email`: String (Unique)
- `hashed_password`: String
- `is_active`: Boolean
- `created_at`: DateTime

### Expenses Table
- `id`: Integer (Primary Key)
- `title`: String
- `amount`: Float
- `category`: String (Enum)
- `date`: Date
- `description`: String (Optional)
- `user_id`: Integer (Foreign Key → users.id)

**Valid Categories:**
- Food
- Transport
- Housing
- Entertainment
- Health
- Shopping
- Education
- Other

## 🧪 Example API Usage

### Register a new user

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123"
```

### Create an expense

```bash
curl -X POST "http://localhost:8000/expenses" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Grocery Shopping",
    "amount": 45.50,
    "category": "Food",
    "date": "2026-04-23",
    "description": "Weekly groceries"
  }'
```

### Get expenses with filters

```bash
curl -X GET "http://localhost:8000/expenses?category=Food&start_date=2026-04-01&sort_by=amount&order=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get dashboard

```bash
curl -X GET "http://localhost:8000/dashboard" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get insights

```bash
curl -X GET "http://localhost:8000/insights?days=30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Pydantic schemas with custom validators
- **SQL Injection Protection**: SQLAlchemy ORM
- **CORS Configuration**: Configurable allowed origins
- **Error Handling**: No internal errors exposed to clients

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── config.py           # Configuration settings
│   │   ├── security.py         # JWT and password utilities
│   │   ├── exceptions.py       # Custom exception classes
│   │   └── error_handlers.py   # Exception handlers
│   ├── db/
│   │   └── database.py         # Database connection
│   ├── models/
│   │   ├── user.py             # User SQLAlchemy model
│   │   └── expense.py          # Expense SQLAlchemy model
│   ├── schemas/
│   │   ├── user.py             # User Pydantic schemas
│   │   ├── expense.py          # Expense Pydantic schemas
│   │   ├── dashboard.py        # Dashboard Pydantic schemas
│   │   └── insights.py         # Insights Pydantic schemas
│   ├── routes/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── expenses.py         # Expense CRUD endpoints
│   │   ├── dashboard.py        # Dashboard endpoint
│   │   └── insights.py         # Insights endpoint
│   └── services/
│       └── insights.py         # Insights engine service
├── .env                        # Environment variables (not in git)
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🚀 Deployment

### Using Docker (Recommended)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-production-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with FastAPI and ❤️

---

**API Version**: 1.0.0  
**Last Updated**: April 2026

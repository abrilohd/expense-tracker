# API Documentation

Complete API reference for the Expense Tracker backend.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: Your deployed backend URL

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained through the login endpoint and expire after 7 days (configurable).

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false
}
```

### Login

Authenticate and receive JWT token.

**Endpoint**: `POST /auth/login`

**Request Body** (form data):
```
username: user@example.com
password: password123
```

**Response**: `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Get Current User

Get authenticated user's profile.

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "phone_number": null
}
```

### Forgot Password

Request password reset token.

**Endpoint**: `POST /auth/forgot-password`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**: `200 OK`
```json
{
  "message": "Password reset email sent"
}
```

### Reset Password

Reset password using token.

**Endpoint**: `POST /auth/reset-password`

**Request Body**:
```json
{
  "token": "reset_token_here",
  "new_password": "newpassword123"
}
```

**Response**: `200 OK`
```json
{
  "message": "Password reset successful"
}
```

---

## Expense Endpoints

### List Expenses

Get all expenses for the authenticated user with optional filters.

**Endpoint**: `GET /expenses`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `category` (optional): Filter by category
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)
- `min_amount` (optional): Minimum amount
- `max_amount` (optional): Maximum amount
- `search` (optional): Search in description
- `skip` (optional): Pagination offset (default: 0)
- `limit` (optional): Items per page (default: 100)

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "amount": 50.00,
    "category": "Food",
    "description": "Grocery shopping",
    "date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00"
  }
]
```

### Create Expense

Add a new expense.

**Endpoint**: `POST /expenses`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "amount": 50.00,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-01-15"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "user_id": 1,
  "amount": 50.00,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00"
}
```

### Get Expense

Get a specific expense by ID.

**Endpoint**: `GET /expenses/{expense_id}`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "amount": 50.00,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00"
}
```

### Update Expense

Update an existing expense.

**Endpoint**: `PUT /expenses/{expense_id}`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "amount": 55.00,
  "category": "Food",
  "description": "Grocery shopping (updated)",
  "date": "2024-01-15"
}
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "amount": 55.00,
  "category": "Food",
  "description": "Grocery shopping (updated)",
  "date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00"
}
```

### Delete Expense

Delete an expense.

**Endpoint**: `DELETE /expenses/{expense_id}`

**Headers**: `Authorization: Bearer <token>`

**Response**: `204 No Content`

---

## Income Endpoints

### List Income

Get all income entries for the authenticated user.

**Endpoint**: `GET /income`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `source` (optional): Filter by source
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "amount": 3000.00,
    "source": "Salary",
    "description": "Monthly salary",
    "date": "2024-01-01",
    "created_at": "2024-01-01T09:00:00"
  }
]
```

### Create Income

Add a new income entry.

**Endpoint**: `POST /income`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "amount": 3000.00,
  "source": "Salary",
  "description": "Monthly salary",
  "date": "2024-01-01"
}
```

**Response**: `201 Created`

### Update Income

Update an existing income entry.

**Endpoint**: `PUT /income/{income_id}`

**Headers**: `Authorization: Bearer <token>`

**Request Body**: Same as Create Income

**Response**: `200 OK`

### Delete Income

Delete an income entry.

**Endpoint**: `DELETE /income/{income_id}`

**Headers**: `Authorization: Bearer <token>`

**Response**: `204 No Content`

---

## Budget Endpoints

### List Budgets

Get all budgets for the authenticated user.

**Endpoint**: `GET /budgets`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "budget_type": "category",
    "category": "Food",
    "amount": 500.00,
    "period_start": "2024-01-01",
    "period_end": "2024-01-31",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

### Create Budget

Create a new budget.

**Endpoint**: `POST /budgets`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "budget_type": "category",
  "category": "Food",
  "amount": 500.00,
  "period_start": "2024-01-01",
  "period_end": "2024-01-31"
}
```

**Response**: `201 Created`

### Get Budget Status

Get budget status with spending information.

**Endpoint**: `GET /budgets/status`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `category` (optional): Specific category
- `start_date` (optional): Period start
- `end_date` (optional): Period end

**Response**: `200 OK`
```json
{
  "budget_amount": 500.00,
  "spent_amount": 350.00,
  "remaining_amount": 150.00,
  "percentage_used": 70.0,
  "status": "on_track"
}
```

---

## Savings Goals Endpoints

### List Savings Goals

Get all savings goals.

**Endpoint**: `GET /savings-goals`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Vacation Fund",
    "target_amount": 2000.00,
    "current_amount": 500.00,
    "deadline": "2024-12-31",
    "emoji": "✈️",
    "color": "#3B82F6",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

### Create Savings Goal

Create a new savings goal.

**Endpoint**: `POST /savings-goals`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Vacation Fund",
  "target_amount": 2000.00,
  "deadline": "2024-12-31",
  "emoji": "✈️",
  "color": "#3B82F6"
}
```

**Response**: `201 Created`

### Contribute to Savings Goal

Add money to a savings goal.

**Endpoint**: `POST /savings-goals/{goal_id}/contribute`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "amount": 100.00
}
```

**Response**: `200 OK`

---

## Recurring Transactions Endpoints

### List Recurring Transactions

Get all recurring transactions.

**Endpoint**: `GET /recurring`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "transaction_type": "expense",
    "amount": 50.00,
    "category": "Housing",
    "description": "Monthly rent",
    "frequency": "monthly",
    "start_date": "2024-01-01",
    "end_date": null,
    "is_active": true,
    "last_processed": "2024-01-01",
    "next_due": "2024-02-01"
  }
]
```

### Create Recurring Transaction

Create a new recurring transaction.

**Endpoint**: `POST /recurring`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "transaction_type": "expense",
  "amount": 50.00,
  "category": "Housing",
  "description": "Monthly rent",
  "frequency": "monthly",
  "start_date": "2024-01-01"
}
```

**Response**: `201 Created`

---

## Dashboard Endpoints

### Get Dashboard Data

Get comprehensive dashboard statistics.

**Endpoint**: `GET /dashboard`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `start_date` (optional): Start date for calculations
- `end_date` (optional): End date for calculations

**Response**: `200 OK`
```json
{
  "total_expenses": 1500.00,
  "total_income": 3000.00,
  "balance": 1500.00,
  "expense_count": 25,
  "category_summary": [
    {
      "category": "Food",
      "total": 500.00,
      "count": 10,
      "percentage": 33.33
    }
  ],
  "monthly_trends": [
    {
      "month": "2024-01",
      "expenses": 1500.00,
      "income": 3000.00
    }
  ],
  "recent_expenses": []
}
```

---

## Insights Endpoints

### Get AI Insights

Get AI-generated spending insights.

**Endpoint**: `GET /insights`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `period` (optional): Analysis period in days (default: 30)

**Response**: `200 OK`
```json
{
  "insights": [
    {
      "type": "high_spending",
      "category": "Food",
      "message": "Your food spending is 20% higher than average",
      "severity": "warning",
      "amount": 600.00
    }
  ],
  "spending_personality": "Balanced Spender",
  "recommendations": [
    "Consider setting a budget for Food category"
  ]
}
```

---

## Reports Endpoints

### Generate Report

Generate expense report in PDF or Excel format.

**Endpoint**: `POST /reports/generate`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "format": "pdf",
  "include_charts": true
}
```

**Response**: `200 OK` (File download)

---

## Balance Endpoints

### Get Balance

Get current balance information.

**Endpoint**: `GET /balance`

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "total_income": 3000.00,
  "total_expenses": 1500.00,
  "current_balance": 1500.00,
  "monthly_income": 3000.00,
  "monthly_expenses": 1500.00,
  "monthly_savings": 1500.00
}
```

---

## Admin Endpoints

### List All Users

Get all users (admin only).

**Endpoint**: `GET /admin/users`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "is_admin": false,
    "created_at": "2024-01-01T00:00:00"
  }
]
```

### Get System Stats

Get system statistics (admin only).

**Endpoint**: `GET /admin/stats`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**: `200 OK`
```json
{
  "total_users": 100,
  "active_users": 95,
  "total_expenses": 50000.00,
  "total_transactions": 1000
}
```

### Toggle User Active Status

Activate or deactivate a user (admin only).

**Endpoint**: `PUT /admin/users/{user_id}/toggle-active`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**: `200 OK`

### Toggle User Admin Status

Grant or revoke admin privileges (admin only).

**Endpoint**: `PUT /admin/users/{user_id}/toggle-admin`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**: `200 OK`

### Delete User

Delete a user account (admin only).

**Endpoint**: `DELETE /admin/users/{user_id}`

**Headers**: `Authorization: Bearer <admin_token>`

**Response**: `204 No Content`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "amount"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## CORS

CORS is configured to allow requests from:
- `http://localhost:5173` (development)
- Your production frontend URL

## Interactive Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation where you can test all endpoints.

Alternative documentation: `http://localhost:8000/redoc`

---

## Categories

Valid expense categories:
- Food
- Transport
- Housing
- Entertainment
- Health
- Shopping
- Education
- Other

## Income Sources

Valid income sources:
- Salary
- Business
- Freelancing
- Investment
- Gift
- Rental
- Other

## Budget Types

- `overall` - Overall spending budget
- `category` - Category-specific budget

## Recurring Frequencies

- `daily`
- `weekly`
- `monthly`
- `yearly`

## Transaction Types

- `expense`
- `income`

---

For more information, see [DEVELOPMENT.md](./DEVELOPMENT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

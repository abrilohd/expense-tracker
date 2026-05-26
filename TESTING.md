# Testing Guide

Comprehensive testing guide for the Expense Tracker application.

## Overview

This guide covers manual testing, automated testing, and quality assurance procedures.

## Quick Test Checklist

### ✅ Essential Features to Test

- [ ] User registration and login
- [ ] Add, edit, delete expenses
- [ ] Add, edit, delete income
- [ ] Create and manage budgets
- [ ] Create and track savings goals
- [ ] Set up recurring transactions
- [ ] View dashboard with charts
- [ ] Generate reports (PDF/Excel)
- [ ] View AI insights
- [ ] Toggle dark/light theme
- [ ] Admin panel (if admin user)

---

## Backend Testing

### Running Tests

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # Windows: venv\Scripts\activate

# Run all tests
pytest

# Run specific test file
pytest tests/test_budget_api.py

# Run with verbose output
pytest -v

# Run with coverage report
pytest --cov=app tests/

# Run with coverage HTML report
pytest --cov=app --cov-report=html tests/
```

### Test Structure

```
backend/tests/
├── test_budget_api.py          # Budget functionality tests
├── test_email.py               # Email service tests
├── test_insights.py            # AI insights tests
├── test_recurring.py           # Recurring transactions tests
├── test_savings_goals.py       # Savings goals tests
└── test_savings_comprehensive.py # Comprehensive savings tests
```

### Writing New Tests

```python
# Example test file: tests/test_feature.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import get_db
from app.models.user import User

client = TestClient(app)

def test_create_feature():
    """Test creating a new feature"""
    # Arrange
    payload = {
        "name": "Test Feature",
        "value": 100
    }
    
    # Act
    response = client.post("/features", json=payload)
    
    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Feature"
    assert data["value"] == 100

def test_get_features():
    """Test retrieving features"""
    response = client.get("/features")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### API Testing with Swagger

1. Start the backend server
2. Visit http://localhost:8000/docs
3. Click "Authorize" and enter JWT token
4. Test endpoints interactively

---

## Frontend Testing

### Type Checking

```bash
cd frontend

# Run TypeScript type checking
npm run type-check
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Manual Testing Workflow

#### 1. Authentication Flow

**Registration:**
```
1. Navigate to /register
2. Enter email, password, full name
3. Verify validation (min 8 chars, requires number)
4. Submit form
5. Should redirect to login
```

**Login:**
```
1. Navigate to /login
2. Enter credentials
3. Submit form
4. Should redirect to dashboard
5. Verify token stored in localStorage
```

**Password Reset:**
```
1. Click "Forgot Password" on login page
2. Enter email
3. Check email for reset link (if email configured)
4. Click reset link
5. Enter new password
6. Should redirect to login
```

#### 2. Dashboard Testing

```
1. Login and navigate to dashboard
2. Verify all cards display correctly:
   - Balance card with current balance
   - Stat cards (This Month, Average, Highest, Count)
   - Cash flow chart
   - Category breakdown
   - Budget widget
   - Savings widget
   - Recent transactions
3. Check responsive layout on mobile
4. Toggle dark/light theme
5. Verify all data loads without errors
```

#### 3. Expense Management

**Add Expense:**
```
1. Navigate to /expenses
2. Click "Add Expense" button
3. Fill form:
   - Amount: 50.00
   - Category: Food
   - Description: Grocery shopping
   - Date: Today
4. Submit form
5. Verify expense appears in list
6. Check budget warning if applicable
```

**Edit Expense:**
```
1. Click edit icon on expense
2. Modify amount to 55.00
3. Submit form
4. Verify changes reflected
```

**Delete Expense:**
```
1. Click delete icon
2. Confirm deletion in modal
3. Verify expense removed from list
```

**Filter & Search:**
```
1. Use category filter dropdown
2. Select "Food" category
3. Verify only food expenses shown
4. Use search box
5. Type "grocery"
6. Verify filtered results
7. Test date range picker
8. Clear filters
```

#### 4. Income Management

```
1. Navigate to /income
2. Add income entry:
   - Amount: 3000
   - Source: Salary
   - Description: Monthly salary
   - Date: First of month
3. Verify income appears in list
4. Edit and delete income entries
5. Check balance updates correctly
```

#### 5. Budget Management

```
1. Navigate to /budgets
2. Create category budget:
   - Category: Food
   - Amount: 500
   - Period: Current month
3. Verify budget appears
4. Add expenses in that category
5. Check progress bar updates
6. Verify status (on_track, warning, exceeded)
7. Test budget alerts
```

#### 6. Savings Goals

```
1. Navigate to /savings-goals
2. Create savings goal:
   - Name: Vacation Fund
   - Target: 2000
   - Deadline: End of year
   - Emoji: ✈️
   - Color: Blue
3. Verify goal appears
4. Add contribution (100)
5. Check progress updates
6. Verify percentage calculation
7. Test goal completion
```

#### 7. Recurring Transactions

```
1. Navigate to /recurring
2. Create recurring expense:
   - Type: Expense
   - Amount: 50
   - Category: Housing
   - Description: Monthly rent
   - Frequency: Monthly
   - Start date: First of month
3. Verify recurring transaction appears
4. Check next due date calculation
5. Test pause/resume functionality
6. Verify transactions created automatically
```

#### 8. Reports

```
1. Navigate to /reports
2. Select date range
3. Generate PDF report
4. Verify download works
5. Generate Excel report
6. Check report contents
7. Verify charts included
```

#### 9. Insights

```
1. Navigate to /insights
2. Select period (7, 30, 90 days)
3. Verify insights display:
   - High spending alerts
   - Budget warnings
   - Savings opportunities
   - Category concentration
   - Spending patterns
4. Check spending personality
5. Verify recommendations
```

#### 10. Settings & Profile

```
1. Navigate to /settings
2. Update profile:
   - Full name
   - Email
   - Phone number
3. Change password
4. Verify changes saved
5. Test theme toggle
6. Check notification preferences
```

#### 11. Admin Panel (Admin Users Only)

```
1. Login as admin
2. Navigate to /admin
3. View system statistics
4. Navigate to /admin/users
5. View all users
6. Test user search
7. Toggle user active status
8. Grant/revoke admin privileges
9. Delete test user
```

---

## Responsive Testing

### Breakpoints to Test

- **Mobile**: 375px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

### Testing Checklist

```
Mobile (375px):
- [ ] Sidebar collapses to hamburger menu
- [ ] Cards stack vertically
- [ ] Forms are touch-friendly
- [ ] Charts are readable
- [ ] Modals fit screen
- [ ] Navigation works

Tablet (768px):
- [ ] 2-column layouts work
- [ ] Sidebar toggles properly
- [ ] Charts scale correctly
- [ ] Tables are scrollable

Desktop (1440px):
- [ ] Fixed sidebar visible
- [ ] Multi-column layouts
- [ ] All features accessible
- [ ] Optimal spacing
```

---

## Browser Testing

### Supported Browsers

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

### Testing Checklist

```
For each browser:
- [ ] Login/logout works
- [ ] All pages load correctly
- [ ] Forms submit properly
- [ ] Charts render correctly
- [ ] Modals display properly
- [ ] Theme toggle works
- [ ] No console errors
```

---

## Performance Testing

### Metrics to Check

```
1. Page Load Time
   - Dashboard: < 2 seconds
   - Other pages: < 1 second

2. API Response Time
   - GET requests: < 500ms
   - POST requests: < 1 second

3. Bundle Size
   - Initial JS: < 500KB
   - Total assets: < 2MB

4. Lighthouse Score
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90
```

### Running Performance Tests

```bash
# Frontend build size
cd frontend
npm run build
# Check dist/ folder size

# Lighthouse audit
# Use Chrome DevTools > Lighthouse tab
# Or install lighthouse CLI:
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

---

## Security Testing

### Checklist

```
Authentication:
- [ ] Cannot access protected routes without login
- [ ] Token expires correctly
- [ ] Logout clears token
- [ ] Password requirements enforced

Authorization:
- [ ] Users can only see their own data
- [ ] Admin routes require admin role
- [ ] Cannot modify other users' data

Input Validation:
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled
- [ ] File upload validation (if applicable)

Data Protection:
- [ ] Passwords are hashed
- [ ] Sensitive data not in logs
- [ ] HTTPS in production
- [ ] Secure headers set
```

---

## Accessibility Testing

### Manual Checks

```
Keyboard Navigation:
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Arrow keys work in dropdowns

Screen Reader:
- [ ] All images have alt text
- [ ] Form labels are associated
- [ ] Error messages are announced
- [ ] Page titles are descriptive

Visual:
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Text is readable at 200% zoom
- [ ] Focus indicators visible
- [ ] No color-only information
```

### Tools

- Chrome DevTools > Lighthouse > Accessibility
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## Load Testing

### Simple Load Test

```bash
# Install Apache Bench
# Ubuntu: sudo apt-get install apache2-utils
# macOS: brew install httpd

# Test endpoint
ab -n 1000 -c 10 http://localhost:8000/api/expenses

# -n: Number of requests
# -c: Concurrent requests
```

### Expected Results

```
- 1000 requests should complete
- No failed requests
- Average response time < 500ms
- Server should remain stable
```

---

## Regression Testing

### Before Each Release

```
1. Run all automated tests
2. Test critical user flows
3. Check all major features
4. Test on multiple browsers
5. Test responsive layouts
6. Check performance metrics
7. Review error logs
8. Test deployment process
```

---

## Bug Reporting Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Screen size: 1920x1080
- User role: Regular user

## Screenshots
[Attach screenshots if applicable]

## Console Errors
[Paste any console errors]

## Additional Context
Any other relevant information
```

---

## Test Data

### Creating Test Data

```bash
cd backend

# Create test users
python scripts/create_test_user.py

# This creates:
# - test@example.com (password: test1234)
# - demo@example.com (password: demo1234)
```

### Sample Test Scenarios

**Scenario 1: New User**
```
1. Register new account
2. Add 5 expenses across different categories
3. Add 1 income entry
4. Create 2 budgets
5. Create 1 savings goal
6. View dashboard
7. Generate report
```

**Scenario 2: Power User**
```
1. Login existing account
2. Add 20+ expenses
3. Set up 3 recurring transactions
4. Create multiple budgets
5. Track 3 savings goals
6. View insights
7. Test all filters
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.8'
      - run: |
          cd backend
          pip install -r requirements.txt
          pytest

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: |
          cd frontend
          npm install
          npm run type-check
          npm run lint
          npm run build
```

---

## Resources

- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Pytest Documentation](https://docs.pytest.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

For more information, see [DEVELOPMENT.md](./DEVELOPMENT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

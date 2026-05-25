# Phase D: Savings Goals - Testing Guide

## 🚀 Quick Start

### 1. Start Servers

**Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173 (or check terminal for actual port)
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs

---

## 🧪 Manual Testing Checklist

### Backend API Testing (via Swagger UI)

1. **Open Swagger UI**: http://localhost:8000/docs

2. **Authenticate**:
   - Go to `/auth/login` endpoint
   - Login with your credentials
   - Copy the `access_token` from response
   - Click "Authorize" button at top
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"

3. **Test Savings Goals Endpoints**:

   **Create Goal:**
   - POST `/savings-goals`
   - Body:
   ```json
   {
     "name": "Emergency Fund",
     "target_amount": 10000,
     "deadline": "2026-12-31"
   }
   ```
   - Expected: 201 Created with goal object

   **List Goals:**
   - GET `/savings-goals`
   - Expected: List with summary stats

   **Get Single Goal:**
   - GET `/savings-goals/{id}` (use ID from create)
   - Expected: Goal object with computed fields

   **Update Goal (Add Contribution):**
   - PUT `/savings-goals/{id}`
   - Body:
   ```json
   {
     "current_amount": 2500
   }
   ```
   - Expected: Updated goal with new progress

   **Delete Goal:**
   - DELETE `/savings-goals/{id}`
   - Expected: 204 No Content

### Frontend UI Testing

#### 1. Navigation
- [ ] Click "Savings Goals" in sidebar
- [ ] Page loads without errors
- [ ] URL is `/savings-goals`

#### 2. Empty State
- [ ] See "No savings goals found" message
- [ ] "Create your first savings goal" text visible
- [ ] Target icon displayed

#### 3. Create Goal
- [ ] Click "New Goal" button
- [ ] Modal opens with yellow/amber gradient header
- [ ] Fill in form:
  - Name: "Emergency Fund"
  - Target: 10000
  - Deadline: Select future date
- [ ] Click "Create Goal"
- [ ] Modal closes
- [ ] New goal appears in list
- [ ] Progress bar shows 0%

#### 4. Goal Display
- [ ] Goal card shows name
- [ ] Target amount displayed correctly
- [ ] Deadline shown
- [ ] Days remaining calculated
- [ ] Progress bar at 0%
- [ ] Status badge shows "Active"
- [ ] Edit and delete buttons visible

#### 5. Edit Goal (Add Contribution)
- [ ] Click edit icon
- [ ] Modal opens with pre-filled data
- [ ] Update "Current Amount" to 2500
- [ ] Click "Save Changes"
- [ ] Progress bar updates to 25%
- [ ] Current amount shows $2,500
- [ ] Target still shows $10,000

#### 6. Multiple Goals
- [ ] Create 2-3 more goals with different:
  - Target amounts
  - Deadlines (some near, some far)
  - Names
- [ ] All goals display in list
- [ ] Sorted by deadline (nearest first)

#### 7. Filter Tabs
- [ ] Click "All" tab - shows all goals
- [ ] Click "Active" tab - shows only active
- [ ] Click "Completed" tab - shows only completed
- [ ] Tab counts update correctly

#### 8. Complete a Goal
- [ ] Edit a goal
- [ ] Set current_amount >= target_amount
- [ ] Save
- [ ] Status automatically changes to "Completed"
- [ ] Green checkmark badge appears
- [ ] "Goal achieved!" message shows

#### 9. Overdue Goal
- [ ] Create goal with deadline in past (edit database or wait)
- [ ] Red "Overdue" badge appears
- [ ] Shows "X days overdue"
- [ ] Progress bar is red

#### 10. Summary Cards
- [ ] Top card shows total saved (sum of all active goals)
- [ ] Overall progress bar updates
- [ ] Active goals count correct
- [ ] Completed goals count correct

#### 11. Dashboard Widget
- [ ] Navigate to Dashboard
- [ ] Scroll to right panel
- [ ] See "Savings Goals" widget
- [ ] Shows top 3 active goals
- [ ] Overall progress displayed
- [ ] "View All" link works
- [ ] Empty state if no goals

#### 12. Delete Goal
- [ ] Click delete icon on a goal
- [ ] Confirmation modal appears
- [ ] Shows goal name in message
- [ ] Click "Delete"
- [ ] Goal removed from list
- [ ] Summary stats update

#### 13. Dark Mode
- [ ] Toggle dark mode
- [ ] All colors invert properly
- [ ] Yellow/amber gradients visible
- [ ] Text readable
- [ ] Progress bars visible
- [ ] Modal styled correctly

#### 14. Responsive Design
- [ ] Resize browser to mobile width (< 768px)
- [ ] Cards stack vertically
- [ ] Modal is full-width
- [ ] Buttons accessible
- [ ] Text readable
- [ ] No horizontal scroll

#### 15. Error Handling
- [ ] Try creating goal with:
  - Empty name → Error message
  - Zero amount → Error message
  - Past deadline → Error message
- [ ] Disconnect internet
- [ ] Try to load goals → Error message
- [ ] Reconnect → Retry button works

---

## 🎯 Expected Behavior

### Progress Calculation
- **Formula**: (current_amount / target_amount) × 100
- **Example**: $2,500 / $10,000 = 25%

### Days Remaining
- **Formula**: deadline - today
- **Example**: Dec 31, 2026 - May 23, 2026 = 222 days

### Progress Colors
- **0-50%**: Blue
- **50-75%**: Yellow
- **75-100%**: Green
- **Overdue**: Red

### Status Logic
- **Active**: Default for new goals
- **Completed**: Auto-set when current >= target
- **Cancelled**: Manual user action
- **Overdue**: Active + deadline passed

---

## 🐛 Common Issues & Solutions

### Backend Issues

**Issue**: Migration fails
```bash
# Solution: Check database connection
cd backend
python run_migration_savings_goals.py
```

**Issue**: Routes not found (404)
```bash
# Solution: Verify router registration
# Check backend/app/main.py includes:
# from app.routes import savings_goals
# app.include_router(savings_goals.router, prefix="/savings-goals", tags=["Savings Goals"])
```

**Issue**: Authentication errors
```bash
# Solution: Get fresh token
# 1. Login via /auth/login
# 2. Copy access_token
# 3. Use in Authorization header: Bearer TOKEN
```

### Frontend Issues

**Issue**: Page not found
```bash
# Solution: Check route registration
# Verify frontend/src/App.tsx has:
# <Route path="/savings-goals" element={<SavingsGoalsPage />} />
```

**Issue**: API calls fail
```bash
# Solution: Check API client base URL
# Verify frontend/src/api/client.ts has correct baseURL
# Should be: http://localhost:8000
```

**Issue**: Types not found
```bash
# Solution: Rebuild TypeScript
cd frontend
npm run build
```

**Issue**: Store not updating
```bash
# Solution: Check Zustand store
# Verify fetchGoals() is called in useEffect
# Check browser console for errors
```

---

## 📊 Test Data Examples

### Goal 1: Emergency Fund
```json
{
  "name": "Emergency Fund",
  "target_amount": 10000,
  "deadline": "2026-12-31"
}
```

### Goal 2: Vacation
```json
{
  "name": "Summer Vacation",
  "target_amount": 5000,
  "deadline": "2026-07-01"
}
```

### Goal 3: New Car
```json
{
  "name": "New Car Down Payment",
  "target_amount": 15000,
  "deadline": "2027-03-15"
}
```

### Goal 4: Home Renovation
```json
{
  "name": "Kitchen Renovation",
  "target_amount": 20000,
  "deadline": "2026-09-30"
}
```

---

## ✅ Success Criteria

All tests pass when:
- [ ] All API endpoints return correct responses
- [ ] All UI components render without errors
- [ ] CRUD operations work correctly
- [ ] Progress calculations are accurate
- [ ] Status changes work as expected
- [ ] Dashboard widget displays correctly
- [ ] Dark mode works throughout
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Optimistic updates feel instant

---

## 🎉 Testing Complete!

Once all tests pass, Phase D is ready for production! 🚀

**Next**: Move to Phase E - Enhanced Dashboard Features

# 🔗 PHASE 6 - Integration Guide

## Income Page Integration Steps

To complete the integration of the Income page into your application, follow these steps:

---

## 1️⃣ Add Income Route

**File**: `frontend/src/App.tsx` (or your routing file)

Add the Income route to your router configuration:

```tsx
import IncomePage from './pages/Income';

// In your Routes:
<Route path="/income" element={<IncomePage />} />
```

---

## 2️⃣ Update Sidebar Navigation

**File**: `frontend/src/components/layout/Sidebar.tsx`

The Income link should already exist in your sidebar. Verify it points to `/income`:

```tsx
{
  label: 'Income',
  icon: TrendingUp,
  path: '/income',
  section: 'main',
}
```

---

## 3️⃣ Verify Backend Endpoints

Ensure your backend has these Income endpoints:

```python
# backend/app/routes/income.py

@router.get("/income")
async def get_incomes(...)

@router.get("/income/{id}")
async def get_income(...)

@router.post("/income")
async def create_income(...)

@router.put("/income/{id}")
async def update_income(...)

@router.delete("/income/{id}")
async def delete_income(...)
```

---

## 4️⃣ Test the Integration

### Manual Testing Checklist

- [ ] Navigate to `/income` page
- [ ] Page loads without errors
- [ ] Summary stats display correctly
- [ ] Click "Add Income" button
- [ ] IncomeModal opens
- [ ] Fill form and submit
- [ ] Income appears in list
- [ ] Edit income works
- [ ] Delete income works
- [ ] Filters work (search, source, dates, sort)
- [ ] Pagination works
- [ ] Responsive on mobile

### API Testing

```bash
# Test GET /income
curl http://localhost:8000/income

# Test POST /income
curl -X POST http://localhost:8000/income \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly Salary",
    "amount": 5000,
    "source": "Salary",
    "date": "2026-05-23"
  }'
```

---

## 5️⃣ Optional Enhancements

### A. Add Income to Dashboard

Update `frontend/src/pages/Dashboard.tsx` to show income data:

```tsx
// Fetch income data
const { data: incomeData } = useIncomeData();

// Display in dashboard
<StatCard
  label="Total Income"
  value={formatCurrency(incomeData?.total || 0)}
  icon={TrendingUp}
  iconColor="#34D399"
  iconBg="rgba(52, 211, 153, 0.15)"
/>
```

### B. Create Income Analytics

Add income-specific insights and charts:
- Income trends over time
- Income by source breakdown
- Income vs Expense comparison

### C. Add to Reports

Include income data in financial reports:
- Monthly income summary
- Year-to-date income
- Income forecasting

---

## 6️⃣ Backend Migration (If Needed)

If your backend doesn't have the `title` field for income, run a migration:

```python
# backend/migrations/add_income_title.py

from sqlalchemy import text

def upgrade(connection):
    # Add title column to income table
    connection.execute(text("""
        ALTER TABLE income 
        ADD COLUMN title VARCHAR(100) NOT NULL DEFAULT 'Income'
    """))

def downgrade(connection):
    # Remove title column
    connection.execute(text("""
        ALTER TABLE income 
        DROP COLUMN title
    """))
```

---

## 7️⃣ Environment Variables

Ensure your `.env` files are configured:

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000

# backend/.env
DATABASE_URL=sqlite:///./expenses.db
SECRET_KEY=your-secret-key
```

---

## 8️⃣ Build and Deploy

### Development
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
uvicorn app.main:app --reload
```

### Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 🔍 Troubleshooting

### Issue: Income page shows 404
**Solution**: Verify route is added to `App.tsx` and path is `/income`

### Issue: API calls fail
**Solution**: Check backend is running and CORS is configured

### Issue: Modal doesn't open
**Solution**: Verify IncomeModal is imported and state is managed correctly

### Issue: TypeScript errors
**Solution**: Run `npm run type-check` and fix any type mismatches

### Issue: Filters don't work
**Solution**: Check `IncomeFilterParams` type matches backend expectations

---

## 📋 Verification Checklist

Before marking as complete, verify:

- [ ] Income page accessible at `/income`
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Modals open and close properly
- [ ] Form validation works
- [ ] Toast notifications appear
- [ ] Loading states display
- [ ] Error states display
- [ ] Empty states display
- [ ] Responsive on mobile
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Backend endpoints respond correctly

---

## 🎯 Success Criteria

✅ Income page fully functional
✅ All features working as expected
✅ No errors in console
✅ Responsive design working
✅ Backend integration complete
✅ User can add, edit, delete income
✅ Filters and pagination working
✅ Modals functioning correctly

---

## 📚 Related Files

### Frontend
- `frontend/src/pages/Income.tsx` - Main income page
- `frontend/src/components/ui/IncomeModal.tsx` - Add/edit modal
- `frontend/src/components/ui/DeleteConfirmModal.tsx` - Delete confirmation
- `frontend/src/api/expenses.ts` - API functions
- `frontend/src/types/index.ts` - TypeScript types
- `frontend/src/utils/constants.ts` - Income sources

### Backend (Expected)
- `backend/app/routes/income.py` - Income endpoints
- `backend/app/models/income.py` - Income model
- `backend/app/schemas/income.py` - Income schemas

---

## 🚀 Next Steps

After integration is complete:

1. Test thoroughly in development
2. Run E2E tests
3. Deploy to staging
4. User acceptance testing
5. Deploy to production
6. Monitor for errors
7. Gather user feedback

---

**Integration Status**: ⏳ Pending
**Estimated Time**: 15-30 minutes
**Difficulty**: Easy
**Dependencies**: Backend income endpoints must exist

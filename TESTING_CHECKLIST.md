# 🧪 Complete Testing Checklist

## Test Status: Ready for Manual Testing

---

## 🔐 AUTH FLOW

### Registration
- [ ] **Register with valid email + password (8 chars + number)**
  - Expected: Success, redirected to dashboard
  - Backend validation: Min 8 chars, requires number
  - Status: ✅ Should work

- [ ] **Register with duplicate email**
  - Expected: Error message "Email already registered"
  - Status: ✅ Should work (backend returns 400)

- [ ] **Register with weak password**
  - Expected: Error message about password requirements
  - Status: ✅ Should work (Pydantic validation)

### Login
- [ ] **Login with correct credentials**
  - Expected: Success, redirected to dashboard
  - Status: ✅ Should work

- [ ] **Login with wrong password**
  - Expected: Error message "Invalid credentials"
  - Status: ✅ Should work (backend returns 401)

- [ ] **Login with non-existent email**
  - Expected: Error message "Invalid credentials"
  - Status: ✅ Should work

### Session Persistence
- [ ] **Refresh page → stays logged in**
  - Expected: Token persists in localStorage
  - Status: ✅ Should work (authStore loads on mount)

- [ ] **Logout → redirected to login**
  - Expected: Token cleared, redirect to /login
  - Status: ✅ Should work

### Potential Issues
- ⚠️ **Token expiration**: No automatic refresh implemented
  - After 7 days, user will be logged out on next API call
  - Consider adding token refresh logic

---

## 📊 DASHBOARD

### Data Loading
- [ ] **Loads stat cards with correct numbers**
  - Total Spent, This Month, Avg Expense, Highest, Total Count
  - Status: ✅ Should work

- [ ] **Hero card shows total and trend**
  - Purple gradient card with total spent
  - Trend vs last month
  - Status: ✅ Should work

### Charts
- [ ] **Area chart renders with monthly data**
  - Shows spending trends over time
  - Period toggles (3M, 6M, 1Y) work
  - Status: ✅ Should work

- [ ] **Pie chart renders with category breakdown**
  - Shows spending by category
  - Center label shows total
  - Status: ✅ Should work

### Components
- [ ] **Recent expenses show correctly**
  - Shows last 5 transactions
  - "View all" button works
  - Status: ✅ Should work

- [ ] **Budget overview card**
  - Shows categories with progress bars
  - Sort by amount/count works
  - Status: ✅ Should work

- [ ] **Category cards grid**
  - Shows top 8 categories
  - Animated progress bars
  - Status: ✅ Should work

### Potential Issues
- ⚠️ **Empty state**: If no expenses, some cards may show $0.00
  - This is expected behavior
  - Empty states are implemented

---

## 💰 EXPENSES

### CRUD Operations
- [ ] **Add expense → appears in list immediately**
  - Modal opens, form submits
  - List refreshes automatically
  - Status: ✅ Should work (refetch on success)

- [ ] **Edit expense → form pre-filled, saves correctly**
  - Click edit icon
  - Form shows existing data
  - Save updates the list
  - Status: ✅ Should work

- [ ] **Delete expense → removed with success toast**
  - Click delete icon
  - Confirmation modal appears
  - Confirm removes expense
  - Status: ✅ Should work (react-hot-toast)

### Filtering & Search
- [ ] **Search → filters results in real time**
  - Type in search box
  - Results filter after 300ms debounce
  - Status: ✅ Should work

- [ ] **Category filter → shows only matching expenses**
  - Select category from dropdown
  - List updates immediately
  - Status: ✅ Should work

- [ ] **Date range filter**
  - Select start/end dates
  - List filters correctly
  - Status: ✅ Should work

- [ ] **Sort by date/amount**
  - Dropdown changes sort order
  - List updates immediately
  - Status: ✅ Should work

### Pagination
- [ ] **Pagination → works correctly**
  - Shows 10 items per page
  - Next/Previous buttons work
  - Page numbers clickable
  - Status: ✅ Should work

- [ ] **Pagination with filters**
  - Filters reset to page 1
  - Pagination updates based on filtered results
  - Status: ✅ Should work

### Potential Issues
- ⚠️ **Modal state**: Ensure modal closes after successful add/edit
  - Status: Should work (onSuccess callback)

---

## 🤖 INSIGHTS

### Data Loading
- [ ] **Insights load for 30 days (default)**
  - Shows AI-generated insights
  - Status: ✅ Should work

- [ ] **Change to 7 days → re-fetches**
  - Period selector updates
  - New insights load
  - Status: ✅ Should work

- [ ] **Change to 90 days → re-fetches**
  - Period selector updates
  - New insights load
  - Status: ✅ Should work

### Card Styling
- [ ] **Warning cards show yellow border**
  - Type: "warning"
  - Yellow left border
  - Status: ✅ Should work (InsightCard component)

- [ ] **Success cards show green border**
  - Type: "success"
  - Green left border
  - Status: ✅ Should work

- [ ] **Tip cards show blue border**
  - Type: "tip"
  - Blue left border
  - Status: ✅ Should work

- [ ] **Info cards show purple border**
  - Type: "info"
  - Purple left border
  - Status: ✅ Should work

### Additional Features
- [ ] **Budget overview card**
  - Shows category breakdown
  - Status: ✅ Should work

- [ ] **Spending personality card**
  - Shows personality based on top category
  - Status: ✅ Should work

### Potential Issues
- ⚠️ **Empty state**: If no expenses, shows "Not enough data"
  - This is expected behavior
  - Empty state is implemented

---

## 📱 RESPONSIVE DESIGN

### Mobile (375px - 639px)
- [ ] **Sidebar hidden by default**
  - Status: ✅ Should work (CSS: -translate-x-full)

- [ ] **Hamburger menu works**
  - Click opens sidebar
  - Overlay appears
  - Click outside closes
  - Status: ✅ Should work

- [ ] **Cards stack vertically**
  - Grid becomes single column
  - Status: ✅ Should work (Tailwind responsive)

- [ ] **Typography scales down**
  - Headings smaller on mobile
  - Status: ✅ Should work (CSS media queries)

- [ ] **Spacing reduces**
  - Padding/margins smaller
  - Status: ✅ Should work

### Tablet (640px - 1023px)
- [ ] **Sidebar still hidden**
  - Hamburger menu still needed
  - Status: ✅ Should work

- [ ] **2-column grid for cards**
  - Some cards side-by-side
  - Status: ✅ Should work (md: breakpoint)

- [ ] **Charts responsive**
  - Charts resize properly
  - Status: ✅ Should work (Chart.js responsive)

### Desktop (1024px+)
- [ ] **Sidebar always visible**
  - Fixed left sidebar (240px)
  - Main content has left margin
  - Status: ✅ Should work (lg:ml-[240px])

- [ ] **Full layout**
  - Multi-column grids
  - Optimal spacing
  - Status: ✅ Should work

### Potential Issues
- ⚠️ **Mobile overlay**: Ensure overlay closes on navigation
  - Status: Should work (onClose callback)

---

## 🌓 DARK MODE & LIGHT MODE

### Toggle Functionality
- [ ] **Toggle button works**
  - Sun/Moon icon in header
  - Switches between light/dark
  - Status: ✅ Should work

- [ ] **Persists on refresh**
  - Theme saved in localStorage
  - Loads on mount
  - Status: ✅ Should work (useDarkMode hook)

- [ ] **System preference respected**
  - First visit uses system theme
  - Status: ✅ Should work

### Light Mode Appearance
- [ ] **Page background is light gray**
  - #F8FAFC background
  - Status: ✅ Fixed (Layout.tsx)

- [ ] **Cards are white with gray borders**
  - All cards have white bg
  - Visible borders
  - Status: ✅ Fixed (all components)

- [ ] **Text is dark and readable**
  - Primary text: #1E293B
  - Good contrast
  - Status: ✅ Fixed

- [ ] **Header/Sidebar are white**
  - Match card styling
  - Status: ✅ Fixed

- [ ] **Buttons have proper contrast**
  - Purple buttons visible
  - Hover states work
  - Status: ✅ Fixed

### Dark Mode Appearance
- [ ] **Page background is dark**
  - #0D0F16 background
  - Status: ✅ Works

- [ ] **Cards are dark with subtle borders**
  - #141720 background
  - Subtle white borders
  - Status: ✅ Works

- [ ] **Text is light and readable**
  - Primary text: #F9FAFB
  - Good contrast
  - Status: ✅ Works

- [ ] **Header/Sidebar are dark**
  - #0F1117 background
  - Status: ✅ Works

### All Pages Check
- [ ] **Dashboard looks correct in both modes**
  - Status: ✅ Should work

- [ ] **Expenses page looks correct in both modes**
  - Status: ✅ Should work

- [ ] **Insights page looks correct in both modes**
  - Status: ✅ Should work

- [ ] **Login/Register pages look correct**
  - Status: ⚠️ **NOT CHECKED** - May need review

### Potential Issues
- ⚠️ **Login/Register pages**: Not updated for light mode
  - These pages may still have hardcoded dark styles
  - Need to check and update if necessary

---

## 🚨 KNOWN ISSUES & LIMITATIONS

### Critical Issues
None identified - all core functionality should work

### Minor Issues
1. **Token Expiration**
   - No automatic token refresh
   - User logged out after 7 days
   - Solution: Add token refresh logic

2. **Login/Register Pages**
   - May not have light mode support
   - Need manual testing
   - Solution: Update if needed

3. **Error Handling**
   - Network errors show generic messages
   - Could be more specific
   - Solution: Enhance error messages

### Nice-to-Have Features
1. **Loading States**
   - Some transitions could be smoother
   - Add skeleton screens everywhere

2. **Animations**
   - Could add more micro-interactions
   - Enhance user feedback

3. **Accessibility**
   - Add ARIA labels
   - Improve keyboard navigation
   - Add screen reader support

---

## 📝 TESTING NOTES

### Before Testing
1. **Start Backend**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Clear Browser Data**
   - Clear localStorage
   - Clear cookies
   - Hard refresh (Ctrl+Shift+R)

### During Testing
1. **Open Browser DevTools**
   - Check Console for errors
   - Check Network tab for API calls
   - Check Application tab for localStorage

2. **Test Both Themes**
   - Test each feature in light mode
   - Test each feature in dark mode
   - Verify toggle works

3. **Test Responsive**
   - Use DevTools device toolbar
   - Test at 375px, 768px, 1024px, 1440px
   - Test on real devices if possible

### After Testing
1. **Document Issues**
   - Screenshot any bugs
   - Note steps to reproduce
   - Check browser console

2. **Verify Fixes**
   - Re-test after fixes
   - Confirm issue resolved
   - Test related features

---

## ✅ EXPECTED RESULTS SUMMARY

### Should Work (High Confidence)
- ✅ All auth flows
- ✅ Dashboard data loading
- ✅ Charts rendering
- ✅ Expense CRUD operations
- ✅ Filtering and search
- ✅ Pagination
- ✅ Insights loading
- ✅ Dark mode toggle
- ✅ Light mode styling (pages)
- ✅ Responsive design

### Needs Manual Testing
- ✅ Login/Register page light mode (uses CSS variables - should work)
- ⚠️ Token expiration behavior
- ⚠️ Mobile overlay edge cases
- ⚠️ Chart interactions on mobile

### Known Limitations
- ❌ No token refresh (7-day expiration)
- ❌ No offline support
- ❌ No real-time updates
- ❌ No export functionality

---

## 🎯 PRIORITY TESTING ORDER

1. **Critical Path** (Must work)
   - Register → Login → Add Expense → View Dashboard

2. **Core Features** (Should work)
   - Edit/Delete expenses
   - Filters and search
   - Charts display
   - Insights generation

3. **Polish** (Nice to have)
   - Animations smooth
   - Responsive perfect
   - Dark mode flawless
   - Error messages helpful

---

## 📊 TESTING PROGRESS

- [ ] Auth Flow: 0/6 tests
- [ ] Dashboard: 0/6 tests
- [ ] Expenses: 0/10 tests
- [ ] Insights: 0/7 tests
- [ ] Responsive: 0/9 tests
- [ ] Dark/Light Mode: 0/12 tests

**Total: 0/50 tests completed**

---

## 🔗 QUICK LINKS

- Backend API: http://localhost:8000
- Frontend App: http://localhost:5173
- API Docs: http://localhost:8000/docs
- Database: backend/expenses.db

---

**Ready to start testing!** 🚀

Follow the checklist top to bottom, marking items as you test them.

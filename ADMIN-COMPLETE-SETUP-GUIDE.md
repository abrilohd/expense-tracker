# 🛡️ ADMIN SYSTEM - COMPLETE SETUP GUIDE

## Overview
ExpenseTracker has a complete admin system for managing users, viewing statistics, and monitoring system activity.

---

## 📋 STEP 1: Run Admin Migration

First, add the `is_admin` field to the users table.

### Run Migration:

```bash
cd backend
python run_migration_admin.py
```

### Expected Output:
```
🔄 Running admin migration...
✅ Added is_admin column to users table
✅ Migration completed successfully!
ℹ️  To create an admin user, update a user manually:
   UPDATE users SET is_admin = 1 WHERE email = 'admin@example.com';
```

---

## 📋 STEP 2: Create Admin User

You need to manually set a user as admin in the database.

### Method 1: Using Python Script

Create `backend/create_admin.py`:

```python
"""
Create admin user script
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def create_admin(email: str):
    """Set a user as admin by email"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        # Update user to admin
        result = conn.execute(
            text("UPDATE users SET is_admin = 1 WHERE email = :email"),
            {"email": email}
        )
        conn.commit()
        
        if result.rowcount > 0:
            print(f"✅ User {email} is now an admin!")
        else:
            print(f"❌ User {email} not found")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python create_admin.py <email>")
        print("Example: python create_admin.py admin@example.com")
        sys.exit(1)
    
    email = sys.argv[1]
    create_admin(email)
```

### Run:
```bash
cd backend
python create_admin.py your-email@example.com
```

### Method 2: Direct SQL (SQLite)

```bash
cd backend
sqlite3 expenses.db
```

```sql
-- View all users
SELECT id, email, name, is_admin FROM users;

-- Make a user admin
UPDATE users SET is_admin = 1 WHERE email = 'your-email@example.com';

-- Verify
SELECT id, email, name, is_admin FROM users WHERE is_admin = 1;

-- Exit
.quit
```

---

## 📋 STEP 3: Add Admin Routes to Frontend

Update `frontend/src/App.tsx` to include admin routes:

### Add Admin Imports:
```typescript
// Admin Pages (add after Settings import)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
```

### Add Admin Routes:
```typescript
{/* Protected routes - require authentication */}
<Route element={<ProtectedRoute />}>
  <Route element={<Layout />}>
    {/* ... existing routes ... */}
    
    {/* Admin Routes */}
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/users" element={<AdminUsers />} />
  </Route>
</Route>
```

---

## 📋 STEP 4: Add Admin Link to Sidebar

Update `frontend/src/components/layout/Sidebar.tsx` to show admin link for admin users.

### Find the navigation items section and add:

```typescript
// Add after Settings nav item
{user?.is_admin && (
  <Link
    to="/admin"
    className={`nav-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
    onClick={() => isMobile && onClose()}
  >
    <Shield size={18} />
    <span>Admin</span>
  </Link>
)}
```

---

## 🎯 ADMIN FEATURES

### 1. Admin Dashboard (`/admin`)
- **System Statistics**:
  - Total users, active users, new users (last 30 days)
  - Total transactions (expenses + income)
  - System-wide financial overview
  - Active features (budgets, savings goals, recurring)

- **Financial Overview**:
  - Total income across all users
  - Total expenses across all users
  - Net balance system-wide

### 2. Admin Users Page (`/admin/users`)
- **User Management**:
  - View all users with pagination
  - Search users by email or name
  - Filter by active/inactive status
  - Filter by admin status

- **User Actions**:
  - Toggle user active/inactive (block/unblock)
  - Grant/revoke admin privileges
  - Delete user (with all their data)
  - View user statistics (expenses, income, budgets)

### 3. Backend API Endpoints

All admin endpoints require admin authentication (`is_admin = true`).

#### System Statistics:
```
GET /admin/stats
```

#### User Management:
```
GET /admin/users?skip=0&limit=50&search=email&is_active=true&is_admin=false
GET /admin/users/{user_id}
PUT /admin/users/{user_id}/toggle-active
PUT /admin/users/{user_id}/toggle-admin
DELETE /admin/users/{user_id}
```

#### Analytics:
```
GET /admin/categories/usage
GET /admin/activity/recent?limit=50
```

---

## 🔒 SECURITY FEATURES

### Admin-Only Access:
- All admin routes protected by `get_current_admin_user` dependency
- Returns 403 Forbidden if user is not admin
- Frontend should hide admin links for non-admin users

### Self-Protection:
- Admins cannot deactivate themselves
- Admins cannot remove their own admin status
- Admins cannot delete themselves

### Cascade Delete:
- Deleting a user removes all their data:
  - Expenses
  - Income
  - Budgets
  - Savings goals
  - Recurring transactions

---

## 🧪 TESTING ADMIN SYSTEM

### 1. Create Test Admin User:
```bash
cd backend
python create_admin.py test@example.com
```

### 2. Login as Admin:
1. Go to `http://localhost:5173/login`
2. Login with admin email
3. Check sidebar - should see "Admin" badge next to email
4. Should see "Admin" link in navigation

### 3. Access Admin Dashboard:
```
http://localhost:5173/admin
```

### 4. Test Admin Features:
- ✅ View system statistics
- ✅ View all users
- ✅ Search and filter users
- ✅ Toggle user active/inactive
- ✅ Grant/revoke admin privileges
- ✅ View user details

### 5. Test API Endpoints:
```bash
# Get admin stats
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/admin/stats

# List all users
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/admin/users

# Get user details
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/admin/users/1
```

---

## 📊 ADMIN DASHBOARD FEATURES

### User Statistics Card:
- Total users count
- New users this month
- Active vs inactive users
- Admin users count

### Transaction Statistics Card:
- Total transactions (expenses + income)
- Breakdown by type
- Recent activity

### Financial Overview Card:
- Total income (all users)
- Total expenses (all users)
- Net balance system-wide

### Active Features Card:
- Active budgets count
- Active savings goals count
- Active recurring transactions count

---

## 🎨 ADMIN UI/UX

### Design:
- Purple theme for admin sections (matches app theme)
- Shield icon for admin branding
- Glass morphism cards
- Smooth Framer Motion animations
- Responsive for all devices

### User Management Table:
- User email, name, provider
- Status badges (Active/Inactive, Admin)
- User statistics (expenses, income, budgets)
- Action buttons (Toggle Active, Toggle Admin, Delete)
- Search and filter controls

---

## 🚀 QUICK START CHECKLIST

- [ ] Run admin migration: `python run_migration_admin.py`
- [ ] Create admin user: `python create_admin.py your-email@example.com`
- [ ] Add admin routes to `App.tsx`
- [ ] Add admin link to `Sidebar.tsx`
- [ ] Restart frontend: `npm run dev`
- [ ] Login as admin user
- [ ] Access admin dashboard: `/admin`
- [ ] Test user management: `/admin/users`

---

## 📝 ADMIN USER WORKFLOW

### Creating First Admin:
1. Register a normal user account
2. Run migration to add `is_admin` field
3. Use SQL or Python script to set `is_admin = 1`
4. Login again to get new token with admin privileges
5. Access admin dashboard

### Creating Additional Admins:
1. Login as existing admin
2. Go to `/admin/users`
3. Find the user you want to make admin
4. Click "Shield" icon to toggle admin status
5. User becomes admin immediately

### Managing Users:
1. Go to `/admin/users`
2. Search/filter users as needed
3. Use action buttons:
   - **Ban icon**: Toggle active/inactive
   - **Shield icon**: Toggle admin status
   - **Trash icon**: Delete user (careful!)

---

## ⚠️ IMPORTANT NOTES

### Production Considerations:
- **Secure Admin Creation**: In production, use environment variables or secure scripts
- **Audit Logging**: Consider adding audit logs for admin actions
- **Rate Limiting**: Add rate limiting to admin endpoints
- **2FA**: Consider requiring 2FA for admin accounts
- **Backup**: Always backup database before deleting users

### Database:
- SQLite for development (current setup)
- PostgreSQL recommended for production
- Admin field is boolean (0 = false, 1 = true)

### Testing:
- Test admin features in development first
- Never test delete operations on production
- Always have database backups

---

## 🎯 NEXT STEPS

Once admin system is set up:
1. ✅ Create your admin account
2. ✅ Access admin dashboard
3. ✅ Test user management
4. ✅ Monitor system statistics
5. ✅ Ready for production deployment!

---

## 📞 TROUBLESHOOTING

### "Admin access required" error:
- Check if user has `is_admin = 1` in database
- Logout and login again to refresh token
- Verify token includes admin status

### Admin routes not showing:
- Check if admin routes added to `App.tsx`
- Verify admin link added to `Sidebar.tsx`
- Check if `user?.is_admin` is true in frontend

### Cannot access admin endpoints:
- Verify backend is running
- Check if admin routes registered in `main.py`
- Verify JWT token is valid and includes admin claim

---

Ready to set up admin system? Follow the steps above! 🚀

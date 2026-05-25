# ⚡ QUICK ADMIN SETUP - 5 MINUTES

## Step 1: Run Migration (30 seconds)
```bash
cd backend
python run_migration_admin.py
```

## Step 2: Create Admin User (30 seconds)
```bash
python create_admin.py your-email@example.com
```

## Step 3: Add Admin Routes to Frontend (2 minutes)

### Edit `frontend/src/App.tsx`:

**Add imports** (after Settings import):
```typescript
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
```

**Add routes** (inside `<Route element={<Layout />}>`):
```typescript
{/* Admin Routes */}
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/users" element={<AdminUsers />} />
```

## Step 4: Add Admin Link to Sidebar (1 minute)

### Edit `frontend/src/components/layout/Sidebar.tsx`:

**Add import** (at top with other icons):
```typescript
import { Shield } from 'lucide-react';
```

**Add admin nav item** (after Settings nav item, around line 350):
```typescript
{user?.is_admin && (
  <Link
    to="/admin"
    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 my-0.5 ${
      location.pathname.startsWith('/admin')
        ? 'bg-[var(--color-primary)] text-white'
        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
    }`}
    onClick={() => isMobile && onClose()}
  >
    <Shield size={14} className="flex-shrink-0" />
    <span>Admin</span>
  </Link>
)}
```

## Step 5: Restart & Test (1 minute)

```bash
# Restart frontend (if running)
cd frontend
npm run dev
```

### Test:
1. Login with admin email
2. Check sidebar - should see "Admin" link
3. Go to `/admin` - should see admin dashboard
4. Go to `/admin/users` - should see user management

---

## ✅ DONE!

You now have:
- ✅ Admin dashboard with system statistics
- ✅ User management (view, block, delete, grant admin)
- ✅ Protected admin-only routes
- ✅ Admin badge in sidebar

---

## 🎯 Quick Commands

```bash
# Create admin
cd backend
python create_admin.py your-email@example.com

# List all admins
python create_admin.py --list

# Access admin dashboard
http://localhost:5173/admin

# Access user management
http://localhost:5173/admin/users
```

---

## 🔥 Admin Features

### Admin Dashboard (`/admin`):
- Total users, active users, new users
- System-wide financial statistics
- Active features count

### User Management (`/admin/users`):
- View all users with search/filter
- Block/unblock users
- Grant/revoke admin privileges
- Delete users (with all their data)
- View user statistics

---

That's it! Admin system ready in 5 minutes! 🚀

/**
 * App.tsx - Phase 10 Complete Router
 * Main application component with all routes wired
 */
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';

// Protected Pages
import DashboardPage from './pages/Dashboard';
import ExpenseListPage from './pages/ExpenseList';
import IncomePage from './pages/Income';
import ReportsPage from './pages/Reports';
import BudgetsPage from './pages/Budgets';
import SavingsGoalsPage from './pages/SavingsGoals';
import RecurringTransactionsPage from './pages/RecurringTransactions';
import InsightsPage from './pages/Insights';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

// 404 Page
import NotFoundPage from './pages/NotFound';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0B0D14] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#5B4EE8] border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-white/40 text-sm mt-4">Loading...</p>
    </div>
  </div>
);

function App() {
  const { loadUser, isInitialized } = useAuthStore();

  useEffect(() => {
    // Load user from token on app mount
    loadUser();

    // Apply saved theme from localStorage
    const savedTheme = localStorage.getItem('expense_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [loadUser]);

  // Show loading screen while initializing auth
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public routes - only accessible when not authenticated */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signup" element={<RegisterPage />} />
          </Route>

          {/* Password reset routes - accessible without authentication */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes - require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpenseListPage />} />
              <Route path="/expenses/add" element={<ExpenseListPage />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/savings" element={<SavingsGoalsPage />} />
              <Route path="/savings-goals" element={<SavingsGoalsPage />} />
              <Route path="/recurring" element={<RecurringTransactionsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

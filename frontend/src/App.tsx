/**
 * Main application component with routing
 */
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { useDarkMode } from './hooks/useDarkMode';

// Import pages
import Layout from './components/layout/Layout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import ExpenseListPage from './pages/ExpenseList';
import InsightsPage from './pages/Insights';
import NotFoundPage from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

// Placeholder pages
const AddExpensePage = () => <ExpenseListPage />;

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);
  
  // Initialize dark mode (reads from localStorage and applies theme)
  useDarkMode();

  useEffect(() => {
    // Load user from token on app mount
    loadUser();
  }, [loadUser]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public routes - only accessible when not authenticated */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes - require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpenseListPage />} />
              <Route path="/expenses/add" element={<AddExpensePage />} />
              <Route path="/insights" element={<InsightsPage />} />
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

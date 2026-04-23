/**
 * Route guards for authentication
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Loading screen component
 */
const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
      {/* Animated spinner */}
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      
      {/* App name */}
      <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
        💰 ExpenseAI
      </h1>
      
      {/* Loading text */}
      <p className="mt-2 text-[var(--color-text-muted)]">Loading...</p>
    </div>
  );
};

/**
 * Protected route - requires authentication
 * Redirects to /login if not authenticated
 */
export const ProtectedRoute = () => {
  const { token, isInitialized } = useAuthStore();

  // Wait for auth initialization
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes
  return <Outlet />;
};

/**
 * Public route - only accessible when not authenticated
 * Redirects to / if already authenticated
 */
export const PublicRoute = () => {
  const { token, isInitialized } = useAuthStore();

  // Wait for auth initialization
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // Redirect to dashboard if already authenticated
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Render child routes
  return <Outlet />;
};

/**
 * Login page with email/password authentication
 */
import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-secondary)]">
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">💰 ExpenseAI</h1>
          <p className="text-xl text-primary-100">Track smarter. Spend wiser.</p>
        </div>

        <div className="relative z-10 text-primary-100">
          <p className="text-lg">AI-powered personal finance tracking with intelligent insights</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">💰 ExpenseAI</h1>
          </div>

          {/* Card */}
          <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-card p-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Welcome back</h2>
            <p className="text-[var(--color-text-muted)] mb-6">Sign in to your account to continue</p>

            {/* Error alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-[var(--color-text-primary)]"
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-[var(--color-text-primary)] pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

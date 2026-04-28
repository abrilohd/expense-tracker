/**
 * Premium Registration Page - Production-level SaaS Authentication Experience
 */
import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useDarkMode } from '../hooks/useDarkMode';
import { API_URL } from '../config/constants';
import { 
  Eye, 
  EyeOff, 
  Sparkles, 
  TrendingUp, 
  BarChart2, 
  AlertCircle, 
  Sun, 
  Moon 
} from 'lucide-react';
import '../styles/login.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { isDark, toggle: toggleTheme } = useDarkMode();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string; confirmPassword?: string } = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(password)) {
      errors.password = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await register(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by store
    }
  };

  // Handle field blur
  const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
    setTouched({ ...touched, [field]: true });
  };

  // Check if field has error and is touched
  const showFieldError = (field: 'email' | 'password' | 'confirmPassword') => {
    return touched[field] && fieldErrors[field];
  };

  return (
    <div className="login-container">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="brand-panel"
      >
        <div className="brand-content">
          {/* Logo */}
          <div className="brand-logo">
            <span className="brand-emoji">💰</span>
          </div>

          {/* App name */}
          <h1 className="brand-title">ExpenseTracker</h1>
          <p className="brand-subtitle">Track smarter. Spend wiser.</p>

          {/* Divider */}
          <div className="brand-divider" />

          {/* Features */}
          <div className="feature-list">
            <div className="feature-item">
              <Sparkles className="feature-icon" />
              <span className="feature-text">AI-powered spending insights</span>
            </div>
            <div className="feature-item">
              <TrendingUp className="feature-icon" />
              <span className="feature-text">Real-time expense tracking</span>
            </div>
            <div className="feature-item">
              <BarChart2 className="feature-icon" />
              <span className="feature-text">Beautiful financial dashboard</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Registration Form */}
      <div className="form-panel">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="form-wrapper"
        >
          {/* Logo for mobile */}
          <div className="mobile-brand">
            <div className="mobile-logo">
              <span className="brand-emoji">💰</span>
            </div>
            <h1 className="mobile-title">ExpenseTracker</h1>
          </div>

          {/* Form header */}
          <div className="form-header">
            <h2 className="form-title">Create account</h2>
            <p className="form-subtitle">Start tracking your expenses</p>
          </div>

          {/* Global error alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="error-alert"
              >
                <AlertCircle className="error-icon" />
                <p className="error-text">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email field */}
            <div className="form-field">
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`field-input ${showFieldError('email') ? 'field-error' : ''}`}
                placeholder="Enter your email"
                aria-invalid={showFieldError('email') ? 'true' : 'false'}
                aria-describedby={showFieldError('email') ? 'email-error' : undefined}
              />
              <AnimatePresence>
                {showFieldError('email') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="field-error-message"
                    id="email-error"
                  >
                    <AlertCircle className="field-error-icon" />
                    <span>{fieldErrors.email}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password field */}
            <div className="form-field">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`field-input ${showFieldError('password') ? 'field-error' : ''}`}
                  placeholder="Enter your password"
                  aria-invalid={showFieldError('password') ? 'true' : 'false'}
                  aria-describedby={showFieldError('password') ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.div
                        key="eye-off"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <EyeOff size={16} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="eye"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Eye size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <AnimatePresence>
                {showFieldError('password') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="field-error-message"
                    id="password-error"
                  >
                    <AlertCircle className="field-error-icon" />
                    <span>{fieldErrors.password}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password field */}
            <div className="form-field">
              <label htmlFor="confirmPassword" className="field-label">
                Confirm Password
              </label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`field-input ${showFieldError('confirmPassword') ? 'field-error' : ''}`}
                  placeholder="Confirm your password"
                  aria-invalid={showFieldError('confirmPassword') ? 'true' : 'false'}
                  aria-describedby={showFieldError('confirmPassword') ? 'password-confirm-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <AnimatePresence mode="wait">
                    {showConfirmPassword ? (
                      <motion.div
                        key="eye-off"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <EyeOff size={16} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="eye"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Eye size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <AnimatePresence>
                {showFieldError('confirmPassword') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="field-error-message"
                    id="password-confirm-error"
                  >
                    <AlertCircle className="field-error-icon" />
                    <span>{fieldErrors.confirmPassword}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <div className="button-loading">
                  <div className="spinner" />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span className="divider-text">or</span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="google-button"
              onClick={() => {
                // Redirect to backend Google OAuth endpoint
                window.location.href = `${API_URL}/auth/google/login`;
              }}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Sign in link */}
          <p className="signup-link">
            Already have an account?{' '}
            <Link to="/login" className="signup-link-text">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;

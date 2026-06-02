/**
 * Forgot Password Page - Request password reset
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPassword } from '../api/auth.api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetData, setResetData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotPassword({ email });
      setResetData(response);
      setIsSuccess(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>

            {/* Development Mode - Show Reset Link */}
            {resetData?.dev_mode && resetData?.reset_url && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                   Development Mode
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                  {resetData.note || "Email service not configured. Use this link to reset your password:"}
                </p>
                <a
                  href={resetData.reset_url}
                  className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm text-center"
                >
                  Reset Password Now
                </a>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  This link will expire in 1 hour
                </p>
                {resetData.note && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 border-t border-yellow-300 dark:border-yellow-700 pt-2">
                    💡 To send emails to any address, verify your domain at <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="underline">resend.com/domains</a>
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              The reset link will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>

            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Back to Login
              </Link>
              
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setResetData(null);
                }}
                className="block w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Send Another Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email and we'll send you reset instructions
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

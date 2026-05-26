/**
 * Google OAuth Callback Handler
 * Handles the redirect from Google OAuth and saves the JWT token
 */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setToken, loadUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      // Handle error
      if (error) {
        toast.error(`Authentication failed: ${error.replace(/_/g, ' ')}`);
        navigate('/login');
        return;
      }

      // Handle success
      if (token) {
        try {
          // Save token to localStorage and auth store
          localStorage.setItem('expense_token', token);
          setToken(token);
          
          // Load user data
          await loadUser();
          
          // Show success message
          toast.success('Successfully signed in with Google!');
          
          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Error handling Google callback:', error);
          toast.error('Failed to complete sign in');
          navigate('/login');
        }
      } else {
        // No token and no error - something went wrong
        toast.error('Authentication failed: No token received');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setToken, loadUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}

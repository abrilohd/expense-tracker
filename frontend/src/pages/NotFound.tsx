/**
 * 404 Not Found page
 * Displayed when user navigates to a non-existent route
 */
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">
              404
            </h1>
            
            {/* Search Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Search className="text-blue-600 dark:text-blue-400" size={48} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Back to Dashboard Button */}
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <Home size={20} />
            Back to Dashboard
          </Link>

          {/* Go Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-sm text-gray-500 dark:text-gray-500 mt-8"
        >
          Need help? Check out our{' '}
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            dashboard
          </Link>{' '}
          or{' '}
          <Link to="/expenses" className="text-blue-600 dark:text-blue-400 hover:underline">
            expenses
          </Link>
          .
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;

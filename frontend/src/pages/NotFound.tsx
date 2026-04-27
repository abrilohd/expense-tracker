/**
 * 404 Not Found page
 * Displayed when user navigates to a non-existent route
 */
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0F16] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 bg-purple-500/5 rounded-full blur-3xl top-1/4 left-1/4" />
        <div className="absolute w-48 h-48 bg-blue-500/5 rounded-full blur-3xl bottom-1/3 right-1/4" />
        <div className="absolute w-32 h-32 bg-pink-500/5 rounded-full blur-2xl top-1/3 right-1/3" />
      </div>

      {/* Content */}
      <div className="max-w-md text-center relative z-10">
        {/* Animated 404 number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="mb-6"
        >
          <h1 className="text-[120px] font-black gradient-text leading-none">
            404
          </h1>
        </motion.div>

        {/* Animated Ghost Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex justify-center mb-6"
        >
          <Ghost size={48} className="text-gray-700" />
        </motion.div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mt-4 text-center">
          Page not found
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-sm text-center mt-2 leading-relaxed">
          Looks like this page took an unexpected expense and disappeared.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center gap-2"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

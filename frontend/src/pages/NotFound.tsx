/**
 * NotFound - Phase 9 Dark Design
 * 404 page with decorative blurs and clean layout
 */
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0D14] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-purple-500/8 dark:bg-purple-500/8 rounded-full blur-3xl top-1/4 left-1/3" />
        <div className="absolute w-48 h-48 bg-blue-500/8 dark:bg-blue-500/8 rounded-full blur-3xl bottom-1/3 right-1/4" />
      </div>

      {/* Content */}
      <div className="max-w-md text-center relative">
        {/* Animated 404 number */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="text-[100px] font-medium gradient-text leading-none"
        >
          404
        </motion.h1>

        {/* Animated Ghost Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex justify-center my-2"
        >
          <Ghost size={44} className="text-gray-200 dark:text-white/10" />
        </motion.div>

        {/* Title */}
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mt-2">
          Page not found
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-500 dark:text-white/35 mt-2 leading-relaxed">
          Looks like this page took an unexpected expense and disappeared.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center mt-8">
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

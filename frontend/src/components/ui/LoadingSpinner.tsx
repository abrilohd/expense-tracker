/**
 * Loading spinner components for various loading states
 */
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// Size mapping for spinner
const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-4',
};

/**
 * Basic loading spinner component with Framer Motion
 */
export const LoadingSpinner = ({ size = 'md', color = 'border-blue-600' }: LoadingSpinnerProps) => {
  const sizeClass = sizeMap[size];

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`${sizeClass} ${color} border-t-transparent rounded-full`}
      role="status"
      aria-label="Loading"
    />
  );
};

/**
 * Full page loader with centered spinner and text
 */
export const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

/**
 * Table skeleton loader with shimmer effect and slide-in animation
 */
export const TableSkeleton = ({ rows = 5, cols = 4 }: TableSkeletonProps) => {
  return (
    <div className="space-y-3">
      {/* Generate skeleton rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.div
          key={rowIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
          className="flex gap-4"
        >
          {/* Generate skeleton columns */}
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse"
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSpinner;

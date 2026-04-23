/**
 * Skeleton loading components with pulse and shimmer animations
 */
import { motion } from 'framer-motion';

// ============================================
// BASE SKELETON COMPONENT
// ============================================

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export const Skeleton = ({ className = '', shimmer = true }: SkeletonProps) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${shimmer ? 'animate-pulse' : ''} ${className}`}
    />
  );
};

// ============================================
// STAT CARD SKELETON
// ============================================

export const StatCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
      <div className="flex items-start justify-between">
        {/* Left side - text */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <Skeleton className="h-4 w-24" />
          
          {/* Value */}
          <Skeleton className="h-8 w-32" />
          
          {/* Subtitle */}
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Right side - icon */}
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
};

// ============================================
// TABLE ROW SKELETON
// ============================================

interface TableRowSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableRowSkeleton = ({ rows = 5, cols = 5 }: TableRowSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.tr
          key={rowIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
          className="border-b border-gray-200 dark:border-gray-700"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <Skeleton className={`h-4 ${colIndex === 0 ? 'w-32' : colIndex === cols - 1 ? 'w-16' : 'w-24'}`} />
            </td>
          ))}
        </motion.tr>
      ))}
    </>
  );
};

// ============================================
// TABLE SKELETON (Complete table with header)
// ============================================

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton = ({ rows = 5, cols = 5 }: TableSkeletonProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {Array.from({ length: cols }).map((_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <Skeleton className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <TableRowSkeleton rows={rows} cols={cols} />
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// INSIGHT CARD SKELETON
// ============================================

export const InsightCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 border-gray-300 dark:border-gray-600">
      {/* Icon circle */}
      <Skeleton className="w-12 h-12 rounded-full mb-4" />

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Message - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Value badge */}
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  );
};

// ============================================
// CHART SKELETON
// ============================================

interface ChartSkeletonProps {
  height?: string;
  title?: string;
}

export const ChartSkeleton = ({ height = 'h-64', title }: ChartSkeletonProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
      {/* Title */}
      {title && (
        <div className="mb-4">
          <Skeleton className="h-5 w-40" />
        </div>
      )}

      {/* Chart placeholder */}
      <Skeleton className={`${height} rounded`} />
    </div>
  );
};

// ============================================
// CARD SKELETON (Generic)
// ============================================

interface CardSkeletonProps {
  lines?: number;
  hasImage?: boolean;
}

export const CardSkeleton = ({ lines = 3, hasImage = false }: CardSkeletonProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
      {/* Image placeholder */}
      {hasImage && <Skeleton className="h-48 w-full mb-4 rounded" />}

      {/* Text lines */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-4 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// FORM SKELETON
// ============================================

export const FormSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Form fields */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}

      {/* Button */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
};

// ============================================
// LIST SKELETON
// ============================================

interface ListSkeletonProps {
  items?: number;
}

export const ListSkeleton = ({ items = 5 }: ListSkeletonProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg"
        >
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// GRID SKELETON
// ============================================

interface GridSkeletonProps {
  items?: number;
  cols?: number;
}

export const GridSkeleton = ({ items = 6, cols = 3 }: GridSkeletonProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {Array.from({ length: items }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <CardSkeleton lines={3} />
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// DASHBOARD SKELETON (Complete dashboard layout)
// ============================================

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatCardSkeleton />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="lg:col-span-3">
          <ChartSkeleton title="Monthly Spending" />
        </div>
        <div className="lg:col-span-2">
          <ChartSkeleton title="Spending by Category" />
        </div>
      </div>

      {/* Recent expenses table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <TableSkeleton rows={5} cols={5} />
      </div>
    </div>
  );
};

export default Skeleton;

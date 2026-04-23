/**
 * Stat card component for displaying metrics with icons and trends
 */
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme: 'blue' | 'green' | 'red' | 'purple';
  isLoading?: boolean;
}

// Color scheme mapping
const colorSchemes = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme,
  isLoading = false,
}: StatCardProps) => {
  const colors = colorSchemes[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-cardHover transition-shadow duration-200 p-6"
    >
      <div className="flex justify-between">
        {/* Left side - Content */}
        <div className="flex-1">
          {isLoading ? (
            <>
              {/* Loading skeleton */}
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
            </>
          ) : (
            <>
              {/* Title */}
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>

              {/* Value */}
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {value}
              </p>

              {/* Trend badge */}
              {trend && (
                <div
                  className={`flex items-center gap-1 mt-2 text-sm ${
                    trend.isPositive ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {trend.isPositive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  <span>
                    {trend.isPositive ? '+' : ''}
                    {trend.value}% vs last month
                  </span>
                </div>
              )}

              {/* Subtitle */}
              {subtitle && (
                <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
              )}
            </>
          )}
        </div>

        {/* Right side - Icon */}
        <div>
          {isLoading ? (
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ) : (
            <div className={`p-3 rounded-xl ${colors.bg}`}>
              <Icon className={colors.text} size={24} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;

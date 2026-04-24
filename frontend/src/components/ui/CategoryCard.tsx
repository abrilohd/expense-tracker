/**
 * Category Card - Individual category spending card
 * Shows category icon, name, amount, and progress indicator
 */
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, getCategoryEmoji } from '../../utils/formatters';

interface CategoryCardProps {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  index?: number;
}

// Category color mapping
const categoryColors: Record<string, { primary: string; bg: string; light: string }> = {
  Food: {
    primary: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    light: 'rgba(245, 158, 11, 0.25)',
  },
  Transport: {
    primary: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    light: 'rgba(59, 130, 246, 0.25)',
  },
  Housing: {
    primary: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    light: 'rgba(139, 92, 246, 0.25)',
  },
  Entertainment: {
    primary: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    light: 'rgba(236, 72, 153, 0.25)',
  },
  Health: {
    primary: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    light: 'rgba(16, 185, 129, 0.25)',
  },
  Shopping: {
    primary: '#F97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    light: 'rgba(249, 115, 22, 0.25)',
  },
  Education: {
    primary: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.12)',
    light: 'rgba(99, 102, 241, 0.25)',
  },
  Other: {
    primary: '#6B7280',
    bg: 'rgba(107, 114, 128, 0.12)',
    light: 'rgba(107, 114, 128, 0.25)',
  },
};

const CategoryCard = ({
  category,
  amount,
  count,
  percentage,
  trend,
  index = 0,
}: CategoryCardProps) => {
  const colors = categoryColors[category] || categoryColors.Other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="relative overflow-hidden rounded-2xl p-5 cursor-pointer bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]"
    >
      {/* Decorative gradient circle */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.light} 0%, transparent 70%)`,
          top: '-40px',
          right: '-40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Top row: Icon + Trend */}
        <div className="flex items-start justify-between mb-3">
          {/* Category icon circle */}
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: colors.bg,
            }}
          >
            <span style={{ fontSize: '24px' }}>{getCategoryEmoji(category)}</span>
          </div>

          {/* Trend badge */}
          {trend && (
            <div
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
              style={{
                backgroundColor: trend.isPositive
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
                color: trend.isPositive ? '#34D399' : '#F87171',
              }}
            >
              {trend.isPositive ? (
                <TrendingDown size={12} />
              ) : (
                <TrendingUp size={12} />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        {/* Category name */}
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{category}</h3>

        {/* Amount */}
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {formatCurrency(amount)}
        </div>

        {/* Progress bar */}
        <div
          className="relative overflow-hidden mb-2 h-1.5 rounded-full bg-gray-200 dark:bg-white/[0.06]"
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{
              duration: 0.8,
              delay: index * 0.1 + 0.2,
              ease: 'easeOut',
            }}
            style={{
              height: '100%',
              borderRadius: '9999px',
              backgroundColor: colors.primary,
            }}
          />
        </div>

        {/* Bottom row: Count + Percentage */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-600">
            {count} transaction{count !== 1 ? 's' : ''}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: colors.primary }}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;

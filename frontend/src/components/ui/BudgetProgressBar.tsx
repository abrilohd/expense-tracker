/**
 * Budget Progress Bar - Fundex-inspired category spending bar
 * Shows category icon, name, amount, and visual progress indicator
 */
import { motion } from 'framer-motion';
import { formatCurrency, getCategoryEmoji } from '../../utils/formatters';

interface BudgetProgressBarProps {
  category: string;
  spent: number;
  total: number;
  percentage: number;
  count: number;
  index: number;
  maxPercentage?: number;
}

// Category color mapping
const categoryColors: Record<
  string,
  { barColor: string; bgColor: string }
> = {
  Food: {
    barColor: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
  },
  Transport: {
    barColor: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
  },
  Housing: {
    barColor: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
  },
  Entertainment: {
    barColor: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.12)',
  },
  Health: {
    barColor: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
  },
  Shopping: {
    barColor: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
  },
  Education: {
    barColor: '#6366F1',
    bgColor: 'rgba(99, 102, 241, 0.12)',
  },
  Other: {
    barColor: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.12)',
  },
};

const BudgetProgressBar = ({
  category,
  spent,
  total,
  percentage,
  count,
  index,
  maxPercentage,
}: BudgetProgressBarProps) => {
  const colors = categoryColors[category] || categoryColors.Other;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="flex items-center gap-3"
      style={{
        padding: '12px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      {/* Category icon circle */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: colors.bgColor,
        }}
      >
        <span style={{ fontSize: '18px' }}>{getCategoryEmoji(category)}</span>
      </div>

      {/* Label + progress bar */}
      <div className="flex-1 min-w-0">
        {/* Top row: category name + amount */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs md:text-sm font-medium text-white truncate mr-2">
            {category.length > 12 ? `${category.slice(0, 12)}...` : category}
          </span>
          <span className="text-xs md:text-sm font-semibold text-white flex-shrink-0">
            {formatCurrency(spent)}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="relative overflow-hidden"
          style={{
            height: '6px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: 'easeOut',
            }}
            style={{
              height: '100%',
              borderRadius: '9999px',
              backgroundColor: colors.barColor,
            }}
          />
        </div>

        {/* Bottom row: transaction count + percentage */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-600">
            {count} transaction{count !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-gray-600">{percentage}% of total</span>
        </div>
      </div>

      {/* Percentage badge */}
      <div
        className="text-xs font-bold text-right flex-shrink-0"
        style={{
          color: colors.barColor,
          minWidth: '36px',
        }}
      >
        {percentage}%
      </div>
    </motion.div>
  );
};

export default BudgetProgressBar;

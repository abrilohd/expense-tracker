/**
 * BudgetBar Component - Animated budget progress visualization
 * Shows category spending vs limit with color-coded warnings
 */
import { motion } from 'framer-motion';

// Category color mapping (same as TransactionRow)
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Food: { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
  Transport: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' },
  Housing: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' },
  Entertainment: { bg: 'rgba(236, 72, 153, 0.15)', color: '#EC4899' },
  Health: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
  Shopping: { bg: 'rgba(249, 115, 22, 0.15)', color: '#F97316' },
  Education: { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' },
  Other: { bg: 'rgba(107, 114, 128, 0.15)', color: '#6B7280' },
};

// Category emoji mapping
const CATEGORY_EMOJIS: Record<string, string> = {
  Food: '🍔',
  Transport: '🚗',
  Housing: '🏠',
  Entertainment: '🎬',
  Health: '💊',
  Shopping: '🛍️',
  Education: '📚',
  Other: '📌',
};

// Get category color
const getCategoryColor = (category: string): { bg: string; color: string } => {
  return (
    CATEGORY_COLORS[category] || {
      bg: 'rgba(107, 114, 128, 0.15)',
      color: '#6B7280',
    }
  );
};

// Get category emoji
const getCategoryEmoji = (category: string): string => {
  return CATEGORY_EMOJIS[category] || '📌';
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get bar color based on percentage
const getBarColor = (percentage: number, baseColor: string): string => {
  if (percentage >= 90) return '#EF4444'; // Danger red
  if (percentage >= 75) return '#FBBF24'; // Warning amber
  return baseColor; // Normal category color
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUDGET BAR COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface BudgetBarProps {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
  count: number;
  index: number;
  isLast?: boolean;
}

const BudgetBar = ({
  category,
  spent,
  limit,
  percentage,
  count,
  index,
  isLast = false,
}: BudgetBarProps) => {
  const colors = getCategoryColor(category);
  const emoji = getCategoryEmoji(category);
  const barColor = getBarColor(percentage, colors.color);

  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{
        borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      {/* LEFT ICON */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '9px',
          background: colors.bg,
        }}
      >
        <span style={{ fontSize: '16px' }}>{emoji}</span>
      </div>

      {/* MIDDLE - Progress */}
      <div className="flex-1 min-w-0">
        {/* Top Row - Category & Amount */}
        <div className="flex items-center justify-between mb-2">
          <span
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 500,
            }}
          >
            {category}
          </span>

          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            {formatCurrency(spent)} / {formatCurrency(limit)}
          </span>
        </div>

        {/* Progress Track */}
        <div
          className="relative overflow-hidden"
          style={{
            height: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '999px',
          }}
        >
          {/* Progress Fill - Animated */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{
              duration: 0.7,
              delay: index * 0.08,
              ease: 'easeOut',
            }}
            style={{
              height: '100%',
              background: barColor,
              borderRadius: '999px',
            }}
          />
        </div>

        {/* Bottom Row - Transaction Count */}
        <p
          style={{
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.25)',
            marginTop: '4px',
          }}
        >
          {count} {count === 1 ? 'transaction' : 'transactions'}
        </p>
      </div>

      {/* RIGHT - Percentage */}
      <div className="flex-shrink-0 text-right">
        <span
          className="font-medium"
          style={{
            fontSize: '11px',
            color: barColor,
          }}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default BudgetBar;

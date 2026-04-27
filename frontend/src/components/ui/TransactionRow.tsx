/**
 * Transaction Row - Fundex-inspired transaction list item
 * Individual row component for recent transactions
 */
import { motion } from 'framer-motion';
import type { Expense } from '../../types';
import { formatCurrency, formatDate, getCategoryEmoji } from '../../utils/formatters';

interface TransactionRowProps {
  expense: Expense;
  index: number;
  onClick?: () => void;
}

// Category color mapping
const categoryColors: Record<string, { bg: string; primary: string }> = {
  Food: { bg: 'rgba(245, 158, 11, 0.12)', primary: '#F59E0B' },
  Transport: { bg: 'rgba(59, 130, 246, 0.12)', primary: '#3B82F6' },
  Housing: { bg: 'rgba(139, 92, 246, 0.12)', primary: '#8B5CF6' },
  Entertainment: { bg: 'rgba(236, 72, 153, 0.12)', primary: '#EC4899' },
  Health: { bg: 'rgba(16, 185, 129, 0.12)', primary: '#10B981' },
  Shopping: { bg: 'rgba(249, 115, 22, 0.12)', primary: '#F97316' },
  Education: { bg: 'rgba(99, 102, 241, 0.12)', primary: '#6366F1' },
  Other: { bg: 'rgba(107, 114, 128, 0.12)', primary: '#6B7280' },
};

const TransactionRow = ({ expense, index, onClick }: TransactionRowProps) => {
  const colors = categoryColors[expense.category] || categoryColors.Other;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-lg transition-all duration-200 cursor-pointer"
      style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Category icon circle */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          backgroundColor: colors.bg,
        }}
      >
        <span style={{ fontSize: '20px' }}>{getCategoryEmoji(expense.category)}</span>
      </div>

      {/* Title + Transaction ID */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate">
          {expense.title.length > 20 ? `${expense.title.slice(0, 20)}...` : expense.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          {/* Transaction ID */}
          <span
            className="text-xs font-mono"
            style={{ color: '#6B7280' }}
          >
            #{expense.id.toString().padStart(4, '0')}
          </span>
          {/* Separator dot */}
          <span className="hidden sm:inline" style={{ color: '#4B5563' }}>•</span>
          {/* Category name - hidden on mobile */}
          <span
            className="text-xs hidden sm:inline"
            style={{ color: colors.primary }}
          >
            {expense.category}
          </span>
        </div>
      </div>

      {/* Amount + Date */}
      <div className="text-right flex-shrink-0">
        <div
          className="text-sm md:text-base font-bold"
          style={{ color: '#F87171' }}
        >
          {formatCurrency(expense.amount)}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: '#6B7280' }}
        >
          {formatDate(expense.date)}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionRow;

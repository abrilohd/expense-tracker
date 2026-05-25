/**
 * TransactionRow Component - Animated transaction list item
 * Supports expenses and income with category colors, emojis, and actions
 */
import { motion } from 'framer-motion';
import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import Badge from './Badge';
import type { Expense, Income } from '../../types';

// Category color mapping
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Food: { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
  Transport: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' },
  Housing: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' },
  Entertainment: { bg: 'rgba(236, 72, 153, 0.15)', color: '#EC4899' },
  Health: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
  Shopping: { bg: 'rgba(249, 115, 22, 0.15)', color: '#F97316' },
  Education: { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' },
  Other: { bg: 'rgba(107, 114, 128, 0.15)', color: '#6B7280' },
  // Income sources
  Salary: { bg: 'rgba(52, 211, 153, 0.15)', color: '#34D399' },
  Business: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' },
  Freelancing: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' },
  Gifts: { bg: 'rgba(236, 72, 153, 0.15)', color: '#EC4899' },
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
  // Income sources
  Salary: '💳',
  Business: '💼',
  Freelancing: '💻',
  Gifts: '🎁',
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

// Format relative date
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSACTION ROW COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface TransactionRowProps {
  expense: Expense | Income;
  index: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  compact?: boolean;
  isIncome?: boolean;
}

const TransactionRow = ({
  expense,
  index,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
  isIncome = false,
}: TransactionRowProps) => {
  // Get category/source
  const category = 'category' in expense ? expense.category : expense.source;
  const colors = getCategoryColor(category);
  const emoji = getCategoryEmoji(category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.22,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group flex items-center gap-3 transition-all"
      style={{
        padding: compact ? '8px 10px' : '10px 12px',
        borderRadius: '10px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* LEFT ICON */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: compact ? '34px' : '40px',
          height: compact ? '34px' : '40px',
          borderRadius: compact ? '9px' : '12px',
          background: isIncome ? 'rgba(52, 211, 153, 0.15)' : colors.bg,
        }}
      >
        {isIncome ? (
          <TrendingUp size={compact ? 16 : 18} style={{ color: '#34D399' }} />
        ) : (
          <span style={{ fontSize: compact ? '14px' : '18px' }}>{emoji}</span>
        )}
      </div>

      {/* MIDDLE - Name & Category */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="font-medium truncate"
            style={{
              fontSize: '13px',
              color: '#FFFFFF',
            }}
          >
            {expense.title || expense.description || 'Untitled'}
          </p>

          {/* Category Badge - Hidden on mobile */}
          {!compact && (
            <div className="hidden sm:inline-flex">
              <Badge label={category} category={category} size="xs" />
            </div>
          )}
        </div>

        {/* Date - Desktop */}
        {!compact && (
          <p
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.3)',
              marginTop: '2px',
            }}
          >
            {formatRelativeDate(expense.date)}
          </p>
        )}
      </div>

      {/* RIGHT - Amount & Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Amount */}
        <div className="text-right">
          <p
            className="font-medium"
            style={{
              fontSize: '13px',
              color: isIncome ? '#34D399' : '#F87171',
            }}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(expense.amount)}
          </p>

          {/* Date - Mobile (below amount) */}
          {!compact && (
            <p
              className="sm:hidden"
              style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.25)',
                marginTop: '2px',
              }}
            >
              {formatRelativeDate(expense.date)}
            </p>
          )}
        </div>

        {/* Actions - Always visible on desktop, show on hover on mobile */}
        {showActions && !compact && (onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-0 sm:opacity-100 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(expense.id)}
                className="p-1.5 rounded-lg transition-all"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                  e.currentTarget.style.color = '#3B82F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)';
                }}
                title="Edit"
              >
                <Pencil size={14} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(expense.id)}
                className="p-1.5 rounded-lg transition-all"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.color = '#EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)';
                }}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionRow;

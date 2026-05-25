/**
 * Badge Component - Colored labels for categories, statuses, and tags
 * Supports variants, categories with emojis, and multiple sizes
 */

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BADGE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface BadgeProps {
  label: string;
  variant?: 'income' | 'expense' | 'warning' | 'info' | 'neutral';
  category?: string;
  size?: 'xs' | 'sm';
}

const Badge = ({ label, variant, category, size = 'sm' }: BadgeProps) => {
  // Determine colors based on variant or category
  let bgColor: string;
  let textColor: string;
  let emoji: string | null = null;

  if (category) {
    const colors = getCategoryColor(category);
    bgColor = colors.bg;
    textColor = colors.color;
    emoji = getCategoryEmoji(category);
  } else {
    // Variant-based colors
    switch (variant) {
      case 'income':
        bgColor = 'rgba(52, 211, 153, 0.12)';
        textColor = '#34D399';
        break;
      case 'expense':
        bgColor = 'rgba(248, 113, 113, 0.12)';
        textColor = '#F87171';
        break;
      case 'warning':
        bgColor = 'rgba(251, 191, 36, 0.12)';
        textColor = '#FBBF24';
        break;
      case 'info':
        bgColor = 'rgba(91, 78, 232, 0.15)';
        textColor = '#A78BFA';
        break;
      case 'neutral':
      default:
        bgColor = 'rgba(255, 255, 255, 0.07)';
        textColor = 'rgba(255, 255, 255, 0.5)';
        break;
    }
  }

  // Size styles
  const sizeStyles = {
    xs: {
      fontSize: '10px',
      padding: '2px 6px',
    },
    sm: {
      fontSize: '11px',
      padding: '2px 10px',
    },
  };

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium"
      style={{
        background: bgColor,
        color: textColor,
        fontSize: sizeStyles[size].fontSize,
        padding: sizeStyles[size].padding,
      }}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </span>
  );
};

export default Badge;

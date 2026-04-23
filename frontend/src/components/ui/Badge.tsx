/**
 * Badge component for labels, categories, and status indicators
 */
import { getCategoryColor, getCategoryEmoji } from '../../utils/formatters';

interface BadgeProps {
  label: string;
  category?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

// Variant color mapping
const variantStyles = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

// Size mapping
const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

const Badge = ({ label, category, variant = 'default', size = 'md' }: BadgeProps) => {
  // Use category colors if category is provided, otherwise use variant
  const colorClasses = category
    ? `${getCategoryColor(category).bg} ${getCategoryColor(category).text}`
    : variantStyles[variant];

  const sizeClasses = sizeStyles[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${colorClasses} ${sizeClasses}`}
    >
      {/* Show emoji if category is provided */}
      {category && <span>{getCategoryEmoji(category)}</span>}
      {label}
    </span>
  );
};

export default Badge;

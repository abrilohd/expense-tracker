/**
 * Insight card component for displaying AI-generated spending insights
 */
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Lightbulb, Info, LucideIcon } from 'lucide-react';
import type { Insight, InsightType } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface InsightCardProps {
  insight: Insight;
  index: number;
}

// Icon and color mapping by insight type
const insightConfig: Record<
  InsightType,
  {
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    borderColor: string;
    badgeLabel: string;
    badgeEmoji: string;
    badgeBg: string;
    badgeText: string;
    valueBg: string;
  }
> = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-400',
    badgeLabel: 'Warning',
    badgeEmoji: '⚠️',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    badgeText: 'text-yellow-700 dark:text-yellow-400',
    valueBg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  success: {
    icon: TrendingDown,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-400',
    badgeLabel: 'Good News',
    badgeEmoji: '✅',
    badgeBg: 'bg-green-100 dark:bg-green-900/30',
    badgeText: 'text-green-700 dark:text-green-400',
    valueBg: 'bg-green-50 dark:bg-green-900/20',
  },
  tip: {
    icon: Lightbulb,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-400',
    badgeLabel: 'Tip',
    badgeEmoji: '💡',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/30',
    badgeText: 'text-blue-700 dark:text-blue-400',
    valueBg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  info: {
    icon: Info,
    iconColor: 'text-gray-600 dark:text-gray-400',
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    borderColor: 'border-gray-400',
    badgeLabel: 'Info',
    badgeEmoji: 'ℹ️',
    badgeBg: 'bg-gray-100 dark:bg-gray-700',
    badgeText: 'text-gray-700 dark:text-gray-400',
    valueBg: 'bg-gray-50 dark:bg-gray-800',
  },
};

const InsightCard = ({ insight, index }: InsightCardProps) => {
  const config = insightConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.15 },
      }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-cardHover transition-shadow duration-200 p-5 border-l-4 ${config.borderColor}`}
    >
      {/* Row layout: icon + content */}
      <div className="flex gap-3">
        {/* Icon circle */}
        <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className={config.iconColor} size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText}`}>
            {config.badgeEmoji} {config.badgeLabel}
          </span>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
            {insight.title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
            {insight.message}
          </p>

          {/* Value badge */}
          {insight.value !== undefined && insight.value !== null && (
            <div className="mt-2">
              <span className={`inline-block text-xs font-bold px-2 py-1 rounded-md ${config.valueBg} ${config.badgeText}`}>
                {typeof insight.value === 'number' ? `${insight.value}%` : insight.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InsightCard;

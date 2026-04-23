/**
 * Insight card component for displaying AI-generated spending insights
 */
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Lightbulb, Info, LucideIcon } from 'lucide-react';
import type { Insight, InsightType } from '../../types';

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
  }
> = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-500',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-500',
  },
  tip: {
    icon: Lightbulb,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-500',
  },
  info: {
    icon: Info,
    iconColor: 'text-gray-600 dark:text-gray-400',
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    borderColor: 'border-gray-400',
  },
};

const InsightCard = ({ insight, index }: InsightCardProps) => {
  const config = insightConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border-l-4 ${config.borderColor}`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={config.iconColor} size={24} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {insight.title}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {insight.message}
        </p>

        {/* Value badge */}
        {insight.value !== undefined && insight.value !== null && (
          <div className="pt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.iconBg} ${config.iconColor}`}>
              {insight.value}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InsightCard;

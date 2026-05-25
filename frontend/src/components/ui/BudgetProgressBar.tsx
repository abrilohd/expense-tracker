/**
 * BudgetProgressBar - Visual progress bar for budget utilization
 * Color-coded based on status: green (safe), yellow (warning), red (exceeded)
 */
import { motion } from 'framer-motion';
import type { BudgetStatus } from '../../types';

interface BudgetProgressBarProps {
  utilization: number;
  status: BudgetStatus;
  spent: number;
  total: number;
  showLabels?: boolean;
}

export default function BudgetProgressBar({
  utilization,
  status,
  spent,
  total,
  showLabels = true,
}: BudgetProgressBarProps) {
  // Cap utilization at 100% for display
  const displayUtilization = Math.min(utilization, 100);

  // Color based on status
  const getColor = () => {
    switch (status) {
      case 'safe':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'exceeded':
        return 'from-red-500 to-rose-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'safe':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'exceeded':
        return 'bg-red-100 dark:bg-red-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className={`relative h-3 rounded-full overflow-hidden ${getBackgroundColor()}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayUtilization}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
        />
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            ${spent.toFixed(2)} spent
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {utilization.toFixed(1)}%
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            ${total.toFixed(2)} total
          </span>
        </div>
      )}
    </div>
  );
}

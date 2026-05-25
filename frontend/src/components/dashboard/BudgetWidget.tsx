/**
 * BudgetWidget - Dashboard widget showing budget status overview
 * Displays active budgets with progress bars and alerts
 */
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBudgetStore } from '../../store/budgetStore';
import BudgetProgressBar from '../ui/BudgetProgressBar';

export default function BudgetWidget() {
  const { budgetStatuses, fetchBudgetStatus, isLoading } = useBudgetStore();

  useEffect(() => {
    fetchBudgetStatus(true); // Fetch only active budgets
  }, [fetchBudgetStatus]);

  // Show only top 3 budgets (prioritize exceeded and warning)
  const topBudgets = budgetStatuses
    .filter((b) => b.is_active)
    .sort((a, b) => {
      // Sort by status priority (exceeded > warning > safe) then by utilization
      const statusPriority = { exceeded: 0, warning: 1, safe: 2 };
      const aPriority = statusPriority[a.status];
      const bPriority = statusPriority[b.status];
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.utilization_percentage - a.utilization_percentage;
    })
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (topBudgets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Budgets</h3>
          <TrendingUp className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No active budgets</p>
          <Link
            to="/budgets"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
          >
            Create Budget
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Budget Overview</h3>
        </div>
        <Link
          to="/budgets"
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Budget List */}
      <div className="space-y-4">
        {topBudgets.map((budgetStatus) => (
          <div
            key={budgetStatus.budget.id}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            {/* Budget Name and Status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {budgetStatus.status === 'exceeded' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {budgetStatus.status === 'warning' && (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {budgetStatus.budget.budget_type === 'overall'
                    ? 'Overall Budget'
                    : budgetStatus.budget.category}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                budgetStatus.status === 'safe'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : budgetStatus.status === 'warning'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {budgetStatus.status.toUpperCase()}
              </span>
            </div>

            {/* Progress Bar */}
            <BudgetProgressBar
              utilization={budgetStatus.utilization_percentage}
              status={budgetStatus.status}
              spent={budgetStatus.spent_amount}
              total={budgetStatus.budget.amount}
              showLabels={false}
            />

            {/* Amount Info */}
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                ${budgetStatus.spent_amount.toFixed(2)} / ${budgetStatus.budget.amount.toFixed(2)}
              </span>
              <span className={`font-medium ${
                budgetStatus.remaining_amount >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                ${Math.abs(budgetStatus.remaining_amount).toFixed(2)}{' '}
                {budgetStatus.remaining_amount >= 0 ? 'left' : 'over'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {budgetStatuses.filter((b) => b.is_active).length} active budgets
          </span>
          <Link
            to="/budgets"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            Manage →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

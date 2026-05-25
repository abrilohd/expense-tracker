/**
 * Savings Widget - Dashboard component showing active savings goals
 * Displays progress and quick overview of savings goals
 */
import { useEffect } from 'react';
import { Target, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSavingsStore } from '../../store/savingsStore';
import { formatCurrency } from '../../utils/formatters';

const SavingsWidget = () => {
  const { goals, totalTarget, totalSaved, activeCount, fetchGoals, isLoadingGoals } =
    useSavingsStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Get only active goals for display
  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 3);

  // Calculate overall progress
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  if (isLoadingGoals) {
    return (
      <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Savings Goals</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activeCount} active {activeCount === 1 ? 'goal' : 'goals'}
            </p>
          </div>
        </div>
        <Link
          to="/savings-goals"
          className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {activeGoals.length === 0 ? (
        /* Empty State */
        <div className="text-center py-8">
          <Target size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-600" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No active savings goals</p>
          <Link
            to="/savings-goals"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg shadow-yellow-500/30"
          >
            <Target size={16} />
            Create Goal
          </Link>
        </div>
      ) : (
        <>
          {/* Overall Progress */}
          <div className="mb-6 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Progress
              </span>
              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                {overallProgress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-yellow-200 dark:bg-yellow-900/30 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{formatCurrency(totalSaved)} saved</span>
              <span>{formatCurrency(totalTarget)} target</span>
            </div>
          </div>

          {/* Active Goals List */}
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const isNearDeadline = goal.days_remaining <= 30 && goal.days_remaining > 0;
              const progressColor =
                goal.is_overdue
                  ? 'bg-red-500'
                  : goal.progress_percentage >= 75
                    ? 'bg-green-500'
                    : goal.progress_percentage >= 50
                      ? 'bg-yellow-500'
                      : 'bg-blue-500';

              return (
                <div
                  key={goal.id}
                  className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-white/[0.06] hover:border-yellow-300 dark:hover:border-yellow-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {goal.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        {goal.is_overdue ? (
                          <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <AlertCircle size={12} />
                            {Math.abs(goal.days_remaining)} days overdue
                          </span>
                        ) : isNearDeadline ? (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <AlertCircle size={12} />
                            {goal.days_remaining} days left
                          </span>
                        ) : (
                          <span>{goal.days_remaining} days remaining</span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {goal.progress_percentage.toFixed(0)}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-2">
                    <div
                      className={`${progressColor} rounded-full h-2 transition-all duration-500`}
                      style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                    />
                  </div>

                  {/* Amount Info */}
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.current_amount)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Link */}
          {activeCount > 3 && (
            <Link
              to="/savings-goals"
              className="mt-4 block text-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              View {activeCount - 3} more {activeCount - 3 === 1 ? 'goal' : 'goals'}
            </Link>
          )}
        </>
      )}
    </motion.div>
  );
};

export default SavingsWidget;

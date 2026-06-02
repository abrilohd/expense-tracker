/**
 * Budgets Page - Budget Management with Month Navigation
 * Fixed: Uses /budgets/status API for correct spent amounts and calculations
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingDown, Shield, Plus, ChevronLeft, ChevronRight, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, StatCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import BudgetModal from '../components/ui/BudgetModal';
import { getBudgetStatus, deleteBudget } from '../api/budgets.api';
import { CATEGORIES } from '../utils/constants';
import type { BudgetStatusResponse, ExpenseCategory } from '../types';

const Budgets = () => {
  const [budgets, setBudgets] = useState<BudgetStatusResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetStatusResponse | undefined>(undefined);
  const [deletingBudget, setDeletingBudget] = useState<BudgetStatusResponse | null>(null);

  // Format month for display
  const formatMonthDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Month navigation
  const goToPreviousMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  // Check if budget is in selected month
  const isBudgetInMonth = (budget: BudgetStatusResponse, targetMonth: Date): boolean => {
    const budgetStart = new Date(budget.budget.period_start);
    const budgetEnd = new Date(budget.budget.period_end);
    const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
    
    // Check if budget period overlaps with selected month
    return budgetStart <= monthEnd && budgetEnd >= monthStart;
  };

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getBudgetStatus(false); // Get all budgets, not just active
      
      // Filter budgets for selected month
      const filtered = response.budgets.filter((b) => isBudgetInMonth(b, selectedMonth));
      
      setBudgets(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budgets');
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  // Calculate summary stats
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budget.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent_amount, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining_amount, 0);

  // Get category metadata
  const getCategoryData = (category: string | null) => {
    if (!category) return { label: 'Overall', emoji: '💰', color: 'purple' };
    return CATEGORIES.find((c) => c.value === category) || CATEGORIES[CATEGORIES.length - 1];
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === 'exceeded') {
      return { label: 'Over budget', color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' };
    }
    if (status === 'warning') {
      return { label: 'Warning', color: '#FB923C', bg: 'rgba(251, 146, 60, 0.15)' };
    }
    return { label: 'On track', color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)' };
  };

  // Get progress bar color
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#F87171';
    if (percentage >= 80) return '#FB923C';
    if (percentage >= 60) return '#FBBF24';
    return '#34D399';
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Days remaining in month
  const getDaysRemaining = () => {
    const now = new Date();
    const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    const diff = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  // Handle edit
  const handleEdit = (budget: BudgetStatusResponse) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingBudget) return;

    try {
      await deleteBudget(deletingBudget.budget.id);
      toast.success('   Budget deleted');
      setDeletingBudget(null);
      fetchBudgets();
    } catch (err) {
      toast.error('Failed to delete budget');
      console.error('Delete error:', err);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBudget(undefined);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    fetchBudgets();
  };

  // Is current month
  const isCurrentMonth = 
    selectedMonth.getFullYear() === new Date().getFullYear() &&
    selectedMonth.getMonth() === new Date().getMonth();

  // Get month string for modal (YYYY-MM format)
  const getMonthString = () => {
    const year = selectedMonth.getFullYear();
    const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1
            className="font-medium"
            style={{
              fontSize: '22px',
              color: '#FFFFFF',
              letterSpacing: '-0.4px',
            }}
          >
            Budget Management
          </h1>
          <p
            style={{
              fontSize: '13px',
              marginTop: '2px',
            }}
          >
            Track spending limits by category
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.07]"
          >
            <button
              onClick={goToPreviousMonth}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} className="text-gray-600 dark:text-white/70" />
            </button>

            <button
              onClick={goToCurrentMonth}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                isCurrentMonth ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-white/70'
              }`}
            >
              {formatMonthDisplay(selectedMonth)}
            </button>

            <button
              onClick={goToNextMonth}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} className="text-gray-600 dark:text-white/70" />
            </button>
          </div>

          {/* Create Budget Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create Budget</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      {!isLoading && budgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <StatCard
            label="Total Budgeted"
            value={formatCurrency(totalBudgeted)}
            icon={Target}
            iconColor="#A78BFA"
            iconBg="rgba(91, 78, 232, 0.15)"
          />
          <StatCard
            label="Total Spent"
            value={formatCurrency(totalSpent)}
            icon={TrendingDown}
            iconColor="#F87171"
            iconBg="rgba(248, 113, 113, 0.15)"
          />
          <StatCard
            label="Remaining"
            value={formatCurrency(totalRemaining)}
            subtitle={totalRemaining < 0 ? 'Over budget' : `${getDaysRemaining()} days left`}
            icon={Shield}
            iconColor={totalRemaining >= 0 ? '#34D399' : '#F87171'}
            iconBg={totalRemaining >= 0 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)'}
          />
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="md">
              <div className="shimmer" style={{ width: '60%', height: '14px', borderRadius: '6px' }} />
              <div className="shimmer mt-3" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
              <div className="shimmer mt-2" style={{ width: '80%', height: '20px', borderRadius: '6px' }} />
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card padding="lg">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p style={{ fontSize: '13px' }}>{error}</p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && budgets.length === 0 && (
        <Card padding="lg">
          <EmptyState
            icon={Target}
            title="No budgets yet"
            message="Set spending limits for each category to track your expenses"
            action={{
              label: 'Create your first budget',
              onClick: () => setIsModalOpen(true),
            }}
          />
        </Card>
      )}

      {/* Budget Cards Grid */}
      {!isLoading && !error && budgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {budgets.map((budgetStatus, index) => {
            const categoryData = getCategoryData(budgetStatus.budget.category);
            const status = getStatusBadge(budgetStatus.status);
            const progressColor = getProgressColor(budgetStatus.utilization_percentage);
            const cappedPercentage = Math.min(budgetStatus.utilization_percentage, 100);

            return (
              <motion.div
                key={budgetStatus.budget.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <Card hover padding="md">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: `rgba(${categoryData.color === 'purple' ? '91, 78, 232' : categoryData.color === 'green' ? '52, 211, 153' : categoryData.color === 'blue' ? '59, 130, 246' : categoryData.color === 'orange' ? '251, 146, 60' : categoryData.color === 'pink' ? '236, 72, 153' : categoryData.color === 'yellow' ? '251, 191, 36' : categoryData.color === 'indigo' ? '99, 102, 241' : '156, 163, 175'}, 0.15)`,
                          fontSize: '20px',
                        }}
                      >
                        {categoryData.emoji}
                      </div>
                      <div>
                        <h3
                          className="font-medium text-gray-900 dark:text-white"
                          style={{
                            fontSize: '14px',
                          }}
                        >
                          {categoryData.label}
                        </h3>
                        <p
                          className="text-gray-500 dark:text-white/35"
                          style={{
                            fontSize: '11px',
                          }}
                        >
                          {new Date(budgetStatus.budget.period_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(budgetStatus)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label="Edit budget"
                      >
                        <Edit2 size={14} className="text-gray-500 dark:text-white/50" />
                      </button>
                      <button
                        onClick={() => setDeletingBudget(budgetStatus)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label="Delete budget"
                      >
                        <Trash2 size={14} style={{ color: '#F87171' }} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div
                      style={{
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cappedPercentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: progressColor,
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Values */}
                  <div className="flex items-baseline justify-between mb-3">
                    <span
                      className="font-medium"
                      style={{
                        fontSize: '18px',
                        color: progressColor,
                      }}
                    >
                      {formatCurrency(budgetStatus.spent_amount)}
                    </span>
                    <span
                      className="text-gray-400 dark:text-white/30"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      of {formatCurrency(budgetStatus.budget.amount)}
                    </span>
                  </div>

                  {/* Percentage */}
                  <div className="text-center mb-3">
                    <span
                      className="font-medium"
                      style={{
                        fontSize: '24px',
                        color: progressColor,
                        letterSpacing: '-0.6px',
                      }}
                    >
                      {budgetStatus.utilization_percentage.toFixed(0)}%
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-center mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium"
                      style={{
                        fontSize: '11px',
                        background: status.bg,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Footer */}
                  <div
                    className="text-center pt-3 border-t border-gray-200 dark:border-white/5"
                  >
                    <p
                      className="text-gray-500 dark:text-white/25"
                      style={{
                        fontSize: '11px',
                      }}
                    >
                      {budgetStatus.is_active ? `${getDaysRemaining()} days remaining` : 'Past period'}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        budget={editingBudget?.budget}
        month={getMonthString()}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      {deletingBudget && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingBudget(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#1A1D28] border border-red-200 dark:border-red-500/15 rounded-3xl w-full max-w-sm p-7"
            >
              <div className="text-center">
                {/* Warning Icon */}
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mt-4">
                  Delete Budget?
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-600 dark:text-white/40 text-center mt-2">
                  Are you sure you want to delete the{' '}
                  <span className="text-gray-900 dark:text-white font-medium">
                    {getCategoryData(deletingBudget.budget.category).label}
                  </span>{' '}
                  budget?
                </p>

                <p className="mt-2 text-xs text-gray-400 dark:text-white/25 text-center">
                  This action cannot be undone
                </p>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeletingBudget(null)}
                    className="flex-1 px-5 py-3 rounded-xl font-medium transition-all bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/[0.08]"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-red-100 dark:bg-red-500/12 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Budgets;

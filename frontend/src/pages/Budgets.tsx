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
import { getBudgetStatus, deleteBudget } from '../api/budgets';
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
      toast.success('🗑️ Budget deleted');
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
              color: 'rgba(255, 255, 255, 0.45)',
              marginTop: '2px',
            }}
          >
            Track spending limits by category
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
            }}
          >
            <button
              onClick={goToPreviousMonth}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </button>

            <button
              onClick={goToCurrentMonth}
              className="px-3 py-1 text-sm font-medium transition-colors"
              style={{
                color: isCurrentMonth ? '#A78BFA' : 'rgba(255, 255, 255, 0.7)',
              }}
            >
              {formatMonthDisplay(selectedMonth)}
            </button>

            <button
              onClick={goToNextMonth}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
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
                          className="font-medium"
                          style={{
                            fontSize: '14px',
                            color: '#FFFFFF',
                          }}
                        >
                          {categoryData.label}
                        </h3>
                        <p
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.35)',
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
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Edit budget"
                      >
                        <Edit2 size={14} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </button>
                      <button
                        onClick={() => setDeletingBudget(budgetStatus)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
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
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.3)',
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
                    className="text-center pt-3"
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.25)',
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
              className="bg-[#1A1D28] border border-red-500/15 rounded-3xl w-full max-w-sm p-7"
            >
              <div className="text-center">
                {/* Warning Icon */}
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-white text-center mt-4">
                  Delete Budget?
                </h3>

                {/* Message */}
                <p className="text-sm text-white/40 text-center mt-2">
                  Are you sure you want to delete the{' '}
                  <span className="text-white font-medium">
                    {getCategoryData(deletingBudget.budget.category).label}
                  </span>{' '}
                  budget?
                </p>

                <p className="mt-2 text-xs text-white/25 text-center">
                  This action cannot be undone
                </p>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeletingBudget(null)}
                    className="flex-1 px-5 py-3 rounded-xl font-medium transition-all"
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      fontSize: '14px',
                      background: 'rgba(248, 113, 113, 0.12)',
                      border: '1px solid rgba(248, 113, 113, 0.25)',
                      color: '#F87171',
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

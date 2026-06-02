/**
 * ExpenseModal - Phase 9 Dark Design
 * Preserves all form logic, Zod validation, and submission handlers
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, DollarSign, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Expense } from '../../types';
import { ExpenseCategory } from '../../types';
import { CATEGORIES } from '../../utils/constants';
import { createExpense, updateExpense } from '../../api/expenses.api';
import { getCategoryEmoji } from '../../utils/formatters';
import { getBudgetStatus } from '../../api/budgets.api';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  onSuccess: () => void;
}

const expenseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title too long'),
  amount: z.number().positive('Amount must be greater than 0').max(999999, 'Amount too large'),
  category: z.enum(['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other'] as const),
  date: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, { message: 'Date cannot be in the future' }),
  description: z.string().max(500, 'Description too long').optional().or(z.literal('')),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const ExpenseModal = ({ isOpen, onClose, expense, onSuccess }: ExpenseModalProps) => {
  const isEditMode = !!expense;
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [budgetWarning, setBudgetWarning] = useState<{ show: boolean; message: string; remaining: number } | null>(null);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense ? {
      amount: expense.amount,
      title: expense.title,
      category: expense.category,
      date: expense.date,
      description: expense.description || '',
    } : { date: getTodayDate() },
  });

  const watchedCategory = watch('category');
  const watchedAmount = watch('amount');

  useEffect(() => {
    if (watchedCategory) setSelectedCategory(watchedCategory);
  }, [watchedCategory]);

  // Check budget when amount or category changes
  useEffect(() => {
    const checkBudget = async () => {
      if (!watchedCategory || !watchedAmount || watchedAmount <= 0 || isEditMode) {
        setBudgetWarning(null);
        return;
      }

      try {
        const response = await getBudgetStatus(true); // Get active budgets only
        
        // Find budget for this category
        const categoryBudget = response.budgets.find(
          (b) => b.budget.category === watchedCategory && b.is_active
        );

        if (categoryBudget) {
          const newTotal = categoryBudget.spent_amount + watchedAmount;
          const remaining = categoryBudget.budget.amount - newTotal;
          const newUtilization = (newTotal / categoryBudget.budget.amount) * 100;

          if (newUtilization > 100) {
            setBudgetWarning({
              show: true,
              message: `This will exceed your ${watchedCategory} budget by $${Math.abs(remaining).toFixed(2)}`,
              remaining,
            });
          } else if (newUtilization >= 80) {
            setBudgetWarning({
              show: true,
              message: `Warning: This will use ${newUtilization.toFixed(0)}% of your ${watchedCategory} budget`,
              remaining,
            });
          } else {
            setBudgetWarning(null);
          }
        } else {
          setBudgetWarning(null);
        }
      } catch (error) {
        // Silently fail - budget check is optional
        setBudgetWarning(null);
      }
    };

    const debounce = setTimeout(checkBudget, 500);
    return () => clearTimeout(debounce);
  }, [watchedCategory, watchedAmount, isEditMode]);

  useEffect(() => {
    if (expense) {
      reset({
        amount: expense.amount,
        title: expense.title,
        category: expense.category,
        date: expense.date,
        description: expense.description || '',
      });
      setSelectedCategory(expense.category);
    } else {
      reset({ date: getTodayDate() });
      setSelectedCategory('');
    }
  }, [expense, reset]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // If budget is exceeded, show confirmation
      if (budgetWarning && budgetWarning.remaining < 0 && !isEditMode) {
        const confirmed = window.confirm(
          `⚠️ Budget Alert!\n\n${budgetWarning.message}\n\nDo you want to proceed anyway?`
        );
        if (!confirmed) {
          return;
        }
      }

      const payload = { ...data, category: data.category as ExpenseCategory };
      if (isEditMode && expense) {
        await updateExpense(expense.id, payload);
        toast.success('  Expense updated!');
      } else {
        await createExpense(payload);
        toast.success('  Expense added!');
      }
      onSuccess();
      onClose();
      reset();
      setSelectedCategory('');
      setBudgetWarning(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save expense');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
      setSelectedCategory('');
      setBudgetWarning(null);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-md md:max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto modal-scroll rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#1A1D28] border-0 sm:border border-gray-200 dark:border-white/[0.08] mx-0 sm:mx-auto my-0 sm:my-4 pointer-events-auto"
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
              </div>
              <style>{`
                :root {
                  --modal-bg: #FFFFFF;
                  --modal-border: rgba(0, 0, 0, 0.1);
                  --modal-text: #1F2937;
                  --modal-text-secondary: rgba(0, 0, 0, 0.6);
                  --label-color: rgba(0, 0, 0, 0.7);
                  --input-bg: rgba(0, 0, 0, 0.05);
                  --input-border: rgba(0, 0, 0, 0.1);
                  --input-text: #000000;
                  --hover-bg: rgba(0, 0, 0, 0.05);
                  --hover-color: rgba(0, 0, 0, 0.7);
                  --text-secondary: rgba(0, 0, 0, 0.4);
                  --button-text: rgba(0, 0, 0, 0.7);
                  --button-bg: rgba(0, 0, 0, 0.05);
                  --button-border: rgba(0, 0, 0, 0.1);
                }
                .dark {
                  --modal-bg: #1A1D28;
                  --modal-border: rgba(255, 255, 255, 0.1);
                  --modal-text: #FFFFFF;
                  --modal-text-secondary: rgba(255, 255, 255, 0.45);
                  --label-color: rgba(255, 255, 255, 0.7);
                  --input-bg: rgba(255, 255, 255, 0.05);
                  --input-border: rgba(255, 255, 255, 0.1);
                  --input-text: #FFFFFF;
                  --hover-bg: rgba(255, 255, 255, 0.05);
                  --hover-color: rgba(255, 255, 255, 0.7);
                  --text-secondary: rgba(255, 255, 255, 0.4);
                  --button-text: rgba(255, 255, 255, 0.7);
                  --button-bg: rgba(255, 255, 255, 0.05);
                  --button-border: rgba(255, 255, 255, 0.1);
                }
              `}</style>

              {/* Decorative gradient bar */}
              <div
                style={{
                  height: '4px',
                  background: isEditMode 
                    ? 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)'
                    : 'linear-gradient(90deg, #5B4EE8 0%, #A78BFA 100%)',
                }}
              />

              {/* Header */}
              <div className="relative px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5">
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: isEditMode 
                        ? 'rgba(251, 191, 36, 0.15)'
                        : 'rgba(91, 78, 232, 0.15)',
                      color: isEditMode ? '#FBBF24' : '#A78BFA',
                    }}
                  >
                    <DollarSign size={24} />
                  </div>
                  <div className="flex-1">
                    <h2
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '20px',
                        letterSpacing: '-0.4px',
                      }}
                    >
                      {isEditMode ? 'Edit Expense' : 'Add Expense'}
                    </h2>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '13px',
                        marginTop: '2px',
                      }}
                    >
                      Track your spending
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  aria-label="Close"
                  className="absolute top-5 right-5 p-2 rounded-lg transition-colors text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-white/70"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-6 pt-2 sm:p-6 space-y-5">
                {/* Amount */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Amount <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-purple-600 dark:text-purple-400"
                      style={{
                        fontSize: '18px',
                      }}
                    >
                      $
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl font-medium transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-purple-500 focus:bg-purple-50 dark:focus:bg-purple-500/8 focus:outline-none"
                      style={{
                        fontSize: '20px',
                        borderColor: errors.amount ? '#F87171' : undefined,
                      }}
                      {...register('amount', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.amount && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontSize: '12px',
                        color: '#F87171',
                        marginTop: '6px',
                      }}
                    >
                      {errors.amount.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                >
                  <label
                    className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Title <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Morning Coffee"
                    className="w-full px-4 py-3 rounded-xl transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-purple-500 focus:bg-purple-50 dark:focus:bg-purple-500/8 focus:outline-none"
                    style={{
                      fontSize: '14px',
                      borderColor: errors.title ? '#F87171' : undefined,
                    }}
                    {...register('title')}
                  />
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontSize: '12px',
                        color: '#F87171',
                        marginTop: '6px',
                      }}
                    >
                      {errors.title.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Category & Date Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {/* Category */}
                  <div>
                    <label
                      className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      Category <span style={{ color: '#F87171' }}>*</span>
                    </label>
                    <div className="relative">
                      {selectedCategory && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
                        >
                          {getCategoryEmoji(selectedCategory)}
                        </motion.div>
                      )}
                      <select
                        className="w-full appearance-none px-4 py-3 rounded-xl transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 focus:bg-purple-50 dark:focus:bg-purple-500/8 focus:outline-none"
                        style={{
                          paddingLeft: selectedCategory ? '3rem' : '1rem',
                          fontSize: '14px',
                          borderColor: errors.category ? '#F87171' : undefined,
                        }}
                        {...register('category')}
                      >
                        <option value="">Select</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.emoji} {cat.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-white/30">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.category && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontSize: '12px',
                          color: '#F87171',
                          marginTop: '6px',
                        }}
                      >
                        Required
                      </motion.p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label
                      className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      Date <span style={{ color: '#F87171' }}>*</span>
                    </label>
                    <input
                      type="date"
                      max={getTodayDate()}
                      className="w-full px-4 py-3 rounded-xl transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 focus:bg-purple-50 dark:focus:bg-purple-500/8 focus:outline-none"
                      style={{
                        fontSize: '14px',
                        borderColor: errors.date ? '#F87171' : undefined,
                      }}
                      {...register('date')}
                    />
                    {errors.date && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontSize: '12px',
                          color: '#F87171',
                          marginTop: '6px',
                        }}
                      >
                        {errors.date.message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Budget Warning */}
                <AnimatePresence>
                  {budgetWarning?.show && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: 0.16 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`flex items-start gap-3 p-4 rounded-xl ${
                          budgetWarning.remaining < 0
                            ? 'bg-red-500/10 border border-red-500/20'
                            : 'bg-orange-500/10 border border-orange-500/20'
                        }`}
                      >
                        <AlertTriangle
                          size={18}
                          className={budgetWarning.remaining < 0 ? 'text-red-400 mt-0.5' : 'text-orange-400 mt-0.5'}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              budgetWarning.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                            }`}
                          >
                            {budgetWarning.remaining < 0 ? 'Budget Exceeded!' : 'Budget Warning'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-white/50 mt-1">{budgetWarning.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <label
                    className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Notes <span className="text-gray-400 dark:text-white/30 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add any details..."
                    className="w-full px-4 py-3 rounded-xl resize-none transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-purple-500 focus:bg-purple-50 dark:focus:bg-purple-500/8 focus:outline-none"
                    style={{
                      fontSize: '14px',
                    }}
                    {...register('description')}
                  />
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-100 dark:border-white/[0.06]"
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto sm:flex-1 px-5 py-3 rounded-xl font-medium transition-all bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/8"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto sm:flex-1 px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-white ${
                      budgetWarning && budgetWarning.remaining < 0
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                        : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                    }`}
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        {budgetWarning && budgetWarning.remaining < 0 && (
                          <AlertTriangle size={16} />
                        )}
                        <span>{isEditMode ? 'Update' : 'Add'} Expense</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;

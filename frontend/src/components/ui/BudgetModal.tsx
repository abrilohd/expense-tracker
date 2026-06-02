/**
 * Budget Modal - Create/Edit Budget
 * Dark themed modal with category selection and amount input
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Budget, ExpenseCategory } from '../../types';
import { CATEGORIES } from '../../utils/constants';
import { createBudget, updateBudget } from '../../api/budgets.api';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget;
  month: string; // YYYY-MM format
  onSuccess: () => void;
}

const budgetSchema = z.object({
  category: z.enum(['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other'] as const, {
    required_error: 'Category is required',
  }),
  amount: z.number().positive('Amount must be greater than 0').max(999999, 'Amount too large'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

const BudgetModal = ({ isOpen, onClose, budget, month, onSuccess }: BudgetModalProps) => {
  const isEditMode = !!budget;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: budget
      ? {
          category: budget.category as ExpenseCategory,
          amount: budget.amount,
        }
      : undefined,
  });

  const watchedCategory = watch('category');

  useEffect(() => {
    if (budget) {
      reset({
        category: budget.category as ExpenseCategory,
        amount: budget.amount,
      });
    } else {
      reset({
        amount: undefined,
        category: undefined,
      });
    }
  }, [budget, reset]);

  const onSubmit = async (data: BudgetFormData) => {
    try {
      // Convert month (YYYY-MM) to period_start and period_end dates
      const [year, monthNum] = month.split('-').map(Number);
      const period_start = `${year}-${String(monthNum).padStart(2, '0')}-01`;
      const lastDay = new Date(year, monthNum, 0).getDate();
      const period_end = `${year}-${String(monthNum).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const payload = {
        budget_type: 'category' as const,
        category: data.category,
        amount: data.amount,
        period_start,
        period_end,
      };

      if (isEditMode && budget) {
        await updateBudget(budget.id, payload);
        toast.success('  Budget updated!');
      } else {
        await createBudget(payload);
        toast.success('   Budget created!');
      }

      onSuccess();
      onClose();
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save budget';
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
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

  // Get selected category data
  const selectedCategoryData = watchedCategory
    ? CATEGORIES.find((c) => c.value === watchedCategory)
    : null;

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
                  background: 'linear-gradient(90deg, #5B4EE8 0%, #A78BFA 100%)',
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
                      background: 'rgba(91, 78, 232, 0.15)',
                      color: '#A78BFA',
                    }}
                  >
                    <Target size={24} />
                  </div>
                  <div className="flex-1">
                    <h2
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '20px',
                        letterSpacing: '-0.4px',
                      }}
                    >
                      {isEditMode ? 'Edit Budget' : 'Create Budget'}
                    </h2>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '13px',
                        marginTop: '2px',
                      }}
                    >
                      Set spending limit for {month}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  aria-label="Close"
                  className="absolute top-5 right-5 p-2 rounded-lg transition-colors text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-white/70"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--hover-bg)';
                    e.currentTarget.style.color = 'var(--hover-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <style>{`
                    :root {
                      --hover-bg: rgba(0, 0, 0, 0.05);
                      --hover-color: rgba(0, 0, 0, 0.7);
                      --text-secondary: rgba(0, 0, 0, 0.4);
                    }
                    .dark {
                      --hover-bg: rgba(255, 255, 255, 0.05);
                      --hover-color: rgba(255, 255, 255, 0.7);
                      --text-secondary: rgba(255, 255, 255, 0.4);
                    }
                  `}</style>
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-6 pt-2 sm:p-6 space-y-5">
                {/* Category */}
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
                    Category <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="relative">
                    {selectedCategoryData && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
                      >
                        {selectedCategoryData.emoji}
                      </motion.div>
                    )}
                    <select
                      disabled={isEditMode}
                      className="w-full px-4 py-3 rounded-xl appearance-none transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      style={{
                        paddingLeft: selectedCategoryData ? '3rem' : '1rem',
                        fontSize: '14px',
                        cursor: isEditMode ? 'not-allowed' : 'pointer',
                        opacity: isEditMode ? 0.6 : 1,
                        borderColor: errors.category ? '#F87171' : undefined,
                      }}
                      {...register('category')}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-white/30"
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
                      {errors.category.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Limit Amount */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label
                    className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Budget Limit <span style={{ color: '#F87171' }}>*</span>
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
                      autoFocus={!isEditMode}
                      className="w-full pl-10 pr-4 py-3 rounded-xl font-medium transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 focus:bg-purple-50 dark:focus:bg-purple-500/8"
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
                    className="w-full sm:w-auto sm:flex-1 px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
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
                        <Target size={16} />
                        <span>{isEditMode ? 'Update' : 'Create'} Budget</span>
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

export default BudgetModal;

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
import { createBudget, updateBudget } from '../../api/budgets';

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
        toast.success('✨ Budget updated!');
      } else {
        await createBudget(payload);
        toast.success('🎯 Budget created!');
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md pointer-events-auto overflow-hidden"
              style={{
                background: '#1A1D28',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Decorative gradient bar */}
              <div
                style={{
                  height: '4px',
                  background: 'linear-gradient(90deg, #5B4EE8 0%, #A78BFA 100%)',
                }}
              />

              {/* Header */}
              <div className="relative px-6 pt-6 pb-5">
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
                      className="font-medium"
                      style={{
                        fontSize: '20px',
                        color: '#FFFFFF',
                        letterSpacing: '-0.4px',
                      }}
                    >
                      {isEditMode ? 'Edit Budget' : 'Create Budget'}
                    </h2>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.45)',
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
                  className="absolute top-5 right-5 p-2 rounded-lg transition-colors"
                  style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-5">
                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    className="block font-medium mb-2"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
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
                      className="w-full px-4 py-3 rounded-xl appearance-none transition-all"
                      style={{
                        paddingLeft: selectedCategoryData ? '3rem' : '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: errors.category
                          ? '1px solid #F87171'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        cursor: isEditMode ? 'not-allowed' : 'pointer',
                        opacity: isEditMode ? 0.6 : 1,
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'rgba(255, 255, 255, 0.3)' }}
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
                    className="block font-medium mb-2"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Budget Limit <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-medium"
                      style={{
                        color: '#A78BFA',
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
                      className="w-full pl-10 pr-4 py-3 rounded-xl font-medium transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: errors.amount
                          ? '1px solid #F87171'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '20px',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#5B4EE8';
                        e.currentTarget.style.background = 'rgba(91, 78, 232, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.amount
                          ? '#F87171'
                          : 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
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
                  className="flex gap-3 pt-2"
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-5 py-3 rounded-xl font-medium transition-all"
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      fontSize: '14px',
                      color: '#FFFFFF',
                      background: 'linear-gradient(135deg, #5B4EE8 0%, #7C3AED 100%)',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #4F44D4 0%, #6D28D9 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #5B4EE8 0%, #7C3AED 100%)';
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

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
import { createExpense, updateExpense } from '../../api/expenses';
import { getCategoryEmoji } from '../../utils/formatters';
import { getBudgetStatus } from '../../api/budgets';

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
  const [checkingBudget, setCheckingBudget] = useState(false);

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
        setCheckingBudget(true);
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
      } finally {
        setCheckingBudget(false);
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
        toast.success('✨ Expense updated!');
      } else {
        await createExpense(payload);
        toast.success('🎉 Expense added!');
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#1A1D28] border border-white/8 rounded-t-3xl sm:rounded-3xl p-6 relative"
            >
              {/* Mobile drag handle */}
              <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-5 sm:hidden" />

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-medium text-white">
                    {isEditMode ? 'Edit Expense' : 'Add Expense'}
                  </h2>
                  <p className="text-xs text-white/35 mt-0.5">
                    Track your spending
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-[30px] h-[30px] flex items-center justify-center bg-white/7 hover:bg-white/12 rounded-xl transition-colors"
                >
                  <X size={15} className="text-white/60" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Transaction details section */}
                <div className="space-y-3">
                  <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
                    Transaction details
                  </p>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs text-white/40 font-medium mb-1.5">
                      Amount
                    </label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        autoFocus
                        className={`input-dark w-full pl-10 ${errors.amount ? 'border-red-500/50' : ''}`}
                        {...register('amount', { valueAsNumber: true })}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-xs text-red-400 mt-1.5">{errors.amount.message}</p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs text-white/40 font-medium mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Morning Coffee"
                      className={`input-dark w-full ${errors.title ? 'border-red-500/50' : ''}`}
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-400 mt-1.5">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Category & Date Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category */}
                    <div>
                      <label className="block text-xs text-white/40 font-medium mb-1.5">
                        Category
                      </label>
                      <div className="relative">
                        {selectedCategory && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                            {getCategoryEmoji(selectedCategory)}
                          </span>
                        )}
                        <select
                          className={`input-dark w-full appearance-none ${selectedCategory ? 'pl-9' : ''} ${errors.category ? 'border-red-500/50' : ''}`}
                          {...register('category')}
                        >
                          <option value="">Select</option>
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.emoji} {cat.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      {errors.category && (
                        <p className="text-xs text-red-400 mt-1.5">Required</p>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs text-white/40 font-medium mb-1.5">
                        Date
                      </label>
                      <input
                        type="date"
                        max={getTodayDate()}
                        className={`input-dark w-full ${errors.date ? 'border-red-500/50' : ''}`}
                        {...register('date')}
                      />
                      {errors.date && (
                        <p className="text-xs text-red-400 mt-1.5">{errors.date.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Budget Warning */}
                <AnimatePresence>
                  {budgetWarning?.show && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
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
                              budgetWarning.remaining < 0 ? 'text-red-300' : 'text-orange-300'
                            }`}
                          >
                            {budgetWarning.remaining < 0 ? 'Budget Exceeded!' : 'Budget Warning'}
                          </p>
                          <p className="text-xs text-white/50 mt-1">{budgetWarning.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* More info section */}
                <div className="space-y-3 pt-1">
                  <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
                    More info
                  </p>

                  {/* Description */}
                  <div>
                    <label className="block text-xs text-white/40 font-medium mb-1.5">
                      Notes <span className="text-white/25 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add any details..."
                      className="input-dark w-full resize-none"
                      {...register('description')}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/6 pt-6 mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 ${
                      budgetWarning && budgetWarning.remaining < 0
                        ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                        : 'btn-primary'
                    }`}
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
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;

/**
 * Add Expense Modal - Modern & Exciting
 * Full light/dark mode support with smooth animations
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, DollarSign, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Expense } from '../../types';
import { ExpenseCategory } from '../../types';
import { CATEGORIES } from '../../utils/constants';
import { createExpense, updateExpense } from '../../api/expenses';
import { getCategoryEmoji } from '../../utils/formatters';

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

  useEffect(() => {
    if (watchedCategory) setSelectedCategory(watchedCategory);
  }, [watchedCategory]);

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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save expense');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
      setSelectedCategory('');
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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-3xl shadow-2xl pointer-events-auto overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              {/* Decorative gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

              {/* Header */}
              <div className="relative px-8 pt-8 pb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Sparkles className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {isEditMode ? 'Edit Expense' : 'Add Expense'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Track your spending effortlessly
                    </p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  aria-label="Close"
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:rotate-90"
                >
                  <X size={22} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-5">
                {/* Amount */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400 group-focus-within:scale-110 transition-transform">
                      <DollarSign size={24} strokeWidth={2.5} />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      autoFocus
                      className={`w-full pl-14 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 transition-all ${
                        errors.amount
                          ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-950/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800'
                      } text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:scale-[1.02]`}
                      {...register('amount', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.amount && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1.5">
                      <span>⚠️</span> {errors.amount.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Title */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Morning Coffee ☕"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all ${
                      errors.title
                        ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-950/20'
                        : 'border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                    {...register('title')}
                  />
                  {errors.title && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1.5">
                      <span>⚠️</span> {errors.title.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Category & Date Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {selectedCategory && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">
                          {getCategoryEmoji(selectedCategory)}
                        </motion.div>
                      )}
                      <select
                        className={`w-full ${selectedCategory ? 'pl-12' : 'pl-4'} pr-10 py-3.5 rounded-2xl border-2 appearance-none transition-all ${
                          errors.category
                            ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-950/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800'
                        } text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 cursor-pointer`}
                        {...register('category')}
                      >
                        <option value="">Select</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.emoji} {cat.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.category && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-600 dark:text-red-400 mt-1.5">
                        Required
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Date */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      max={getTodayDate()}
                      className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all ${
                        errors.date
                          ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-950/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800'
                      } text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                      {...register('date')}
                    />
                  </motion.div>
                </div>

                {/* Description */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5">
                    Notes <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add any details..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/20 resize-none transition-all"
                    {...register('description')}
                  />
                </motion.div>

                {/* Buttons */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
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

/**
 * Modal for adding/editing expenses with form validation
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Expense } from '../../types';
import { ExpenseCategory } from '../../types';
import { CATEGORIES } from '../../utils/constants';
import { createExpense, updateExpense } from '../../api/expenses';
import FormField, { inputClassName } from './FormField';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  onSuccess: () => void;
}

// Zod validation schema
const expenseSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title too long'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than 0')
    .max(999999, 'Amount too large'),
  category: z.nativeEnum(ExpenseCategory),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return date <= today;
    },
    { message: 'Date cannot be in the future' }
  ),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional()
    .or(z.literal('')),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const ExpenseModal = ({ isOpen, onClose, expense, onSuccess }: ExpenseModalProps) => {
  const isEditMode = !!expense;

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          description: expense.description || '',
        }
      : {
          date: getTodayDate(),
        },
  });

  // Reset form when expense prop changes
  useEffect(() => {
    if (expense) {
      reset({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description || '',
      });
    } else {
      reset({
        date: getTodayDate(),
      });
    }
  }, [expense, reset]);

  // Handle form submission
  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (isEditMode && expense) {
        // Update existing expense
        await updateExpense(expense.id, data);
        toast.success('Expense updated successfully!');
      } else {
        // Create new expense
        await createExpense(data);
        toast.success('Expense added successfully!');
      }

      onSuccess();
      onClose();
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save expense');
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* Title */}
                <FormField label="Title" required error={errors.title?.message}>
                  <input
                    type="text"
                    placeholder="e.g. Coffee, Rent, Groceries..."
                    className={inputClassName}
                    {...register('title')}
                  />
                </FormField>

                {/* Amount and Category (side by side) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Amount */}
                  <FormField label="Amount ($)" required error={errors.amount?.message}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className={inputClassName}
                      {...register('amount', { valueAsNumber: true })}
                    />
                  </FormField>

                  {/* Category */}
                  <FormField label="Category" required error={errors.category?.message}>
                    <select className={inputClassName} {...register('category')}>
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {/* Date */}
                <FormField label="Date" required error={errors.date?.message}>
                  <input
                    type="date"
                    max={getTodayDate()}
                    className={inputClassName}
                    {...register('date')}
                  />
                </FormField>

                {/* Description */}
                <FormField
                  label="Description"
                  error={errors.description?.message}
                  hint="Optional notes about this expense"
                >
                  <textarea
                    rows={3}
                    placeholder="Add any additional details..."
                    className={inputClassName}
                    {...register('description')}
                  />
                </FormField>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{isEditMode ? 'Update' : 'Add'} Expense</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;

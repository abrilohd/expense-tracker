/**
 * Modal for adding/editing expenses with form validation
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ChevronDown } from 'lucide-react';
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
            className="fixed inset-0 bg-black/75 backdrop-blur-[8px] z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#1A1D26] border border-white/[0.08] rounded-t-3xl rounded-b-none sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Drag Handle (Mobile Only) */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-2 sm:hidden" />

              {/* Header */}
              <div className="flex justify-between items-start p-5 md:p-7 pb-4 md:pb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {isEditMode ? 'Edit Expense' : 'Add Expense'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Fill in the details below</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-5 md:px-7 pb-5 md:pb-7">
                {/* Transaction Details Section */}
                <div className="mb-6">
                  <h3 className="text-xs text-gray-600 uppercase tracking-wider mb-3">
                    Transaction Details
                  </h3>

                  {/* Title */}
                  <FormField label="Title" required error={errors.title?.message}>
                    <input
                      type="text"
                      placeholder="e.g. Coffee, Rent, Groceries..."
                      className={inputClassName}
                      {...register('title')}
                    />
                  </FormField>

                  {/* Amount and Category (side by side on desktop, stacked on mobile) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <div className="relative">
                        <select className={`${inputClassName} appearance-none pr-10`} {...register('category')}>
                          <option value="">Select</option>
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.emoji} {cat.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                        />
                      </div>
                    </FormField>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div>
                  <h3 className="text-xs text-gray-600 uppercase tracking-wider mb-3">
                    Additional Info
                  </h3>

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
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-white/[0.06] mt-6 pt-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="btn-ghost flex-1 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
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

/**
 * Recurring Transaction Modal - World-Class 2026 Design
 * Create/Edit recurring transactions with beautiful UI
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Repeat, Calendar, DollarSign, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import type { RecurringTransaction, RecurringTransactionCreate, ExpenseCategory, IncomeSource } from '../../types';

// Validation schema
const recurringSchema = z.object({
  transaction_type: z.enum(['expense', 'income']),
  title: z.string().min(1, 'Title is required').max(200),
  amount: z.number().positive('Amount must be positive'),
  category_or_source: z.string().min(1, 'Category/Source is required'),
  description: z.string().max(500).optional(),
  payment_method: z.string().max(50).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
});

type RecurringFormData = z.infer<typeof recurringSchema>;

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecurringTransactionCreate) => Promise<void>;
  recurring?: RecurringTransaction;
  mode: 'create' | 'edit';
}

const RecurringModal = ({ isOpen, onClose, onSubmit, recurring, mode }: RecurringModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<RecurringFormData>({
    resolver: zodResolver(recurringSchema),
    defaultValues: recurring
      ? {
          transaction_type: recurring.transaction_type,
          title: recurring.title,
          amount: recurring.amount,
          category_or_source: recurring.category_or_source,
          description: recurring.description || '',
          payment_method: recurring.payment_method || '',
          frequency: recurring.frequency,
          start_date: recurring.start_date,
          end_date: recurring.end_date || '',
        }
      : {
          transaction_type: 'expense',
          frequency: 'monthly',
          start_date: new Date().toISOString().split('T')[0],
        },
  });

  const transactionType = watch('transaction_type');

  useEffect(() => {
    if (isOpen && recurring) {
      reset({
        transaction_type: recurring.transaction_type,
        title: recurring.title,
        amount: recurring.amount,
        category_or_source: recurring.category_or_source,
        description: recurring.description || '',
        payment_method: recurring.payment_method || '',
        frequency: recurring.frequency,
        start_date: recurring.start_date,
        end_date: recurring.end_date || '',
      });
    } else if (isOpen && !recurring) {
      reset({
        transaction_type: 'expense',
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen, recurring, reset]);

  const handleFormSubmit = async (data: RecurringFormData) => {
    try {
      await onSubmit(data as RecurringTransactionCreate);
      reset();
    } catch (error) {
      console.error('Failed to submit recurring transaction:', error);
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

  const expenseCategories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Housing',
    'Entertainment',
    'Health',
    'Shopping',
    'Education',
    'Other',
  ];

  const incomeSources: IncomeSource[] = ['Salary', 'Business', 'Freelancing', 'Investment', 'Gift', 'Rental', 'Other'];

  const frequencies = [
    { value: 'daily', label: 'Daily', icon: '📅' },
    { value: 'weekly', label: 'Weekly', icon: '📆' },
    { value: 'monthly', label: 'Monthly', icon: '🗓️' },
    { value: 'yearly', label: 'Yearly', icon: '📊' },
  ];

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
              className="w-full max-w-2xl pointer-events-auto overflow-hidden"
              style={{
                background: '#1A1D28',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Decorative gradient bar */}
              <div
                style={{
                  height: '4px',
                  background: 'linear-gradient(90deg, #A78BFA 0%, #8B5CF6 100%)',
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
                      background: 'rgba(167, 139, 250, 0.15)',
                      color: '#A78BFA',
                    }}
                  >
                    <Repeat size={24} />
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
                      {mode === 'create' ? 'Create Recurring' : 'Edit Recurring'}
                    </h2>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.45)',
                        marginTop: '2px',
                      }}
                    >
                      Automate regular transactions
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
              <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6 space-y-5">
                {/* Transaction Type */}
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
                    Transaction Type <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className="relative flex items-center justify-center p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: transactionType === 'expense' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: transactionType === 'expense' ? '2px solid #F87171' : '2px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <input
                        type="radio"
                        value="expense"
                        {...register('transaction_type')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <TrendingDown size={24} style={{ color: '#F87171', margin: '0 auto 8px' }} />
                        <span
                          className="block font-medium"
                          style={{
                            fontSize: '14px',
                            color: '#FFFFFF',
                          }}
                        >
                          Expense
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.45)',
                          }}
                        >
                          Money out
                        </span>
                      </div>
                    </label>
                    <label
                      className="relative flex items-center justify-center p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: transactionType === 'income' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: transactionType === 'income' ? '2px solid #34D399' : '2px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <input
                        type="radio"
                        value="income"
                        {...register('transaction_type')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <TrendingUp size={24} style={{ color: '#34D399', margin: '0 auto 8px' }} />
                        <span
                          className="block font-medium"
                          style={{
                            fontSize: '14px',
                            color: '#FFFFFF',
                          }}
                        >
                          Income
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.45)',
                          }}
                        >
                          Money in
                        </span>
                      </div>
                    </label>
                  </div>
                </motion.div>

                {/* Title */}
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
                    Title <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Monthly Rent, Weekly Salary"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: errors.title
                        ? '1px solid #F87171'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#A78BFA';
                      e.currentTarget.style.background = 'rgba(167, 139, 250, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.title
                        ? '#F87171'
                        : 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
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

                {/* Amount */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    className="block font-medium mb-2"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Amount <span style={{ color: '#F87171' }}>*</span>
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
                        e.currentTarget.style.borderColor = '#A78BFA';
                        e.currentTarget.style.background = 'rgba(167, 139, 250, 0.08)';
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

                {/* Category/Source & Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Category/Source */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label
                      className="block font-medium mb-2"
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {transactionType === 'expense' ? 'Category' : 'Source'} <span style={{ color: '#F87171' }}>*</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                      }}
                      {...register('category_or_source')}
                    >
                      <option value="">Select {transactionType === 'expense' ? 'category' : 'source'}</option>
                      {transactionType === 'expense'
                        ? expenseCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))
                        : incomeSources.map((source) => (
                            <option key={source} value={source}>
                              {source}
                            </option>
                          ))}
                    </select>
                    {errors.category_or_source && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontSize: '12px',
                          color: '#F87171',
                          marginTop: '6px',
                        }}
                      >
                        {errors.category_or_source.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Frequency */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label
                      className="block font-medium mb-2"
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Frequency <span style={{ color: '#F87171' }}>*</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                      }}
                      {...register('frequency')}
                    >
                      {frequencies.map((freq) => (
                        <option key={freq.value} value={freq.value}>
                          {freq.icon} {freq.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                {/* Start Date & End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Start Date */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label
                      className="block font-medium mb-2"
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Start Date <span style={{ color: '#F87171' }}>*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                      }}
                      {...register('start_date')}
                    />
                    {errors.start_date && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontSize: '12px',
                          color: '#F87171',
                          marginTop: '6px',
                        }}
                      >
                        {errors.start_date.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* End Date */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label
                      className="block font-medium mb-2"
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      End Date{' '}
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.35)',
                          fontWeight: 400,
                        }}
                      >
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                      }}
                      {...register('end_date')}
                    />
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.35)',
                        marginTop: '6px',
                      }}
                    >
                      Leave empty for indefinite recurrence
                    </p>
                  </motion.div>
                </div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label
                    className="block font-medium mb-2"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Description{' '}
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.35)',
                        fontWeight: 400,
                      }}
                    >
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add notes about this recurring transaction..."
                    className="w-full px-4 py-3 rounded-xl transition-all resize-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#A78BFA';
                      e.currentTarget.style.background = 'rgba(167, 139, 250, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    {...register('description')}
                  />
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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
                      background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Repeat size={16} />
                        <span>{mode === 'create' ? 'Create' : 'Update'} Recurring</span>
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

export default RecurringModal;

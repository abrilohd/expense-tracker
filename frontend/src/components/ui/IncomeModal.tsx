/**
 * Add Income Modal - Green-themed for income
 * Full dark mode support with smooth animations
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, DollarSign, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Income, IncomeSource } from '../../types';
import { INCOME_SOURCES } from '../../utils/constants';
import { createIncome, updateIncome } from '../../api/expenses';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  income?: Income;
  onSuccess: () => void;
}

const incomeSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title too long'),
  amount: z.number().positive('Amount must be greater than 0').max(999999, 'Amount too large'),
  source: z.enum(['Salary', 'Business', 'Freelancing', 'Investment', 'Gift', 'Rental', 'Other'] as const),
  date: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, { message: 'Date cannot be in the future' }),
  description: z.string().max(500, 'Description too long').optional().or(z.literal('')),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

const IncomeModal = ({ isOpen, onClose, income, onSuccess }: IncomeModalProps) => {
  const isEditMode = !!income;
  const [selectedSource, setSelectedSource] = useState<string>('');

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: income ? {
      amount: income.amount,
      title: income.title,
      source: income.source,
      date: income.date,
      description: income.description || '',
    } : { date: getTodayDate() },
  });

  const watchedSource = watch('source');

  useEffect(() => {
    if (watchedSource) setSelectedSource(watchedSource);
  }, [watchedSource]);

  useEffect(() => {
    if (income) {
      reset({
        amount: income.amount,
        title: income.title,
        source: income.source,
        date: income.date,
        description: income.description || '',
      });
      setSelectedSource(income.source);
    } else {
      reset({ date: getTodayDate() });
      setSelectedSource('');
    }
  }, [income, reset]);

  const onSubmit = async (data: IncomeFormData) => {
    try {
      const payload = { ...data, source: data.source as IncomeSource };
      if (isEditMode && income) {
        await updateIncome(income.id, payload);
        toast.success('✨ Income updated!');
      } else {
        await createIncome(payload);
        toast.success('🎉 Income added!');
      }
      onSuccess();
      onClose();
      reset();
      setSelectedSource('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save income');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
      setSelectedSource('');
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

  // Get source emoji
  const getSourceEmoji = (source: string): string => {
    const sourceObj = INCOME_SOURCES.find((s) => s.value === source);
    return sourceObj?.emoji || '💳';
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
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-50"
            style={{ background: document.documentElement.classList.contains('dark') ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)' }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg my-8 rounded-3xl shadow-2xl pointer-events-auto bg-white dark:bg-[#1A1D28] border border-gray-200 dark:border-white/10"
              style={{
                maxHeight: 'calc(100vh - 64px)',
                overflowY: 'auto',
              }}
            >
              {/* Decorative gradient bar - GREEN */}
              <div
                style={{
                  height: '6px',
                  background: 'linear-gradient(90deg, #34D399 0%, #10B981 50%, #34D399 100%)',
                }}
              />

              {/* Header */}
              <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                      boxShadow: '0 8px 24px rgba(52, 211, 153, 0.3)',
                    }}
                  >
                    <TrendingUp size={24} style={{ color: '#FFFFFF' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      className="font-bold truncate text-gray-900 dark:text-white"
                      style={{
                        fontSize: '24px',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {isEditMode ? 'Edit Income' : 'Add Income'}
                    </h2>
                    <p
                      className="truncate text-gray-500 dark:text-white/50"
                      style={{
                        fontSize: '12px',
                        marginTop: '2px',
                      }}
                    >
                      Track your earnings
                    </p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  aria-label="Close"
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    width: '36px',
                    height: '36px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-5">
                {/* Amount */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label
                    className="block font-bold mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Amount <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 transition-transform"
                      style={{ color: '#34D399' }}
                    >
                      <DollarSign size={20} strokeWidth={2.5} />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      autoFocus
                      className="w-full pl-11 sm:pl-14 pr-4 py-3 sm:py-4 font-bold rounded-2xl border-2 transition-all bg-white dark:bg-white/[0.05] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50"
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
                      className="flex items-center gap-1.5 mt-2 text-red-500 dark:text-red-400"
                      style={{ fontSize: '13px' }}
                    >
                      <span>⚠️</span> {errors.amount.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Title */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <label
                    className="block font-bold mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Title <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Monthly Salary 💳"
                    className="w-full px-4 py-3 rounded-2xl border-2 transition-all bg-white dark:bg-white/[0.05] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50"
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
                      className="flex items-center gap-1.5 mt-2 text-red-500 dark:text-red-400"
                      style={{ fontSize: '13px' }}
                    >
                      <span>⚠️</span> {errors.title.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Source & Date Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Source */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <label
                      className="block font-bold mb-2 text-gray-700 dark:text-white/70"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Source <span style={{ color: '#F87171' }}>*</span>
                    </label>
                    <div className="relative">
                      {selectedSource && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ fontSize: '18px' }}
                        >
                          {getSourceEmoji(selectedSource)}
                        </motion.div>
                      )}
                      <select
                        className="w-full px-4 py-3 rounded-2xl border-2 appearance-none transition-all cursor-pointer bg-white dark:bg-white/[0.05] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        style={{
                          fontSize: '13px',
                          borderColor: errors.source ? '#F87171' : undefined,
                          paddingLeft: selectedSource ? '44px' : '16px',
                        }}
                        {...register('source')}
                      >
                        <option value="">Select</option>
                        {INCOME_SOURCES.map((source) => (
                          <option key={source.value} value={source.value}>
                            {source.emoji} {source.label}
                          </option>
                        ))}
                      </select>
                      <div
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-white/40"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.source && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 dark:text-red-400"
                        style={{ fontSize: '11px', marginTop: '6px' }}
                      >
                        Required
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Date */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <label
                      className="block font-bold mb-2 text-gray-700 dark:text-white/70"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Date <span style={{ color: '#F87171' }}>*</span>
                    </label>
                    <input
                      type="date"
                      max={getTodayDate()}
                      className="w-full px-4 py-3 rounded-2xl border-2 transition-all bg-white dark:bg-white/[0.05] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      style={{
                        fontSize: '13px',
                        borderColor: errors.date ? '#F87171' : undefined,
                      }}
                      {...register('date')}
                    />
                  </motion.div>
                </div>

                {/* Description */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <label
                    className="block font-bold mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Notes{' '}
                    <span className="text-gray-400 dark:text-white/40" style={{ fontSize: '11px', fontWeight: 400 }}>
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add any details..."
                    className="w-full px-4 py-3 rounded-2xl border-2 resize-none transition-all bg-white dark:bg-white/[0.05] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    style={{
                      fontSize: '13px',
                    }}
                    {...register('description')}
                  />
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4"
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold transition-all duration-200 disabled:opacity-50 bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/[0.08]"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg text-white"
                    style={{
                      fontSize: '14px',
                      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                      boxShadow: '0 8px 24px rgba(52, 211, 153, 0.3)',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp size={16} />
                        <span>{isEditMode ? 'Update' : 'Add'} Income</span>
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

export default IncomeModal;

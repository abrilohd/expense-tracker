/**
 * Contribution Modal - Add funds to savings goal
 * Simple modal for contributing to a savings goal
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Plus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SavingsGoalSimplified } from '../../types';
import { contributeSavings } from '../../api/expenses.api';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoalSimplified;
  onSuccess: () => void;
}

const contributionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0').max(999999, 'Amount too large'),
});

type ContributionFormData = z.infer<typeof contributionSchema>;

const ContributionModal = ({ isOpen, onClose, goal, onSuccess }: ContributionModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
  });

  const watchedAmount = watch('amount');

  // Calculate new totals
  const newSavedAmount = goal.saved_amount + (watchedAmount || 0);
  const newPercentage = (newSavedAmount / goal.target_amount) * 100;
  const remaining = goal.target_amount - newSavedAmount;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const onSubmit = async (data: ContributionFormData) => {
    try {
      await contributeSavings(goal.id, { amount: data.amount });
      toast.success(`💳 Added ${formatCurrency(data.amount)} to ${goal.name}!`);
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add contribution';
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

  // Get goal color
  const goalColor = goal.color || '#34D399';

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
              className="relative w-full sm:max-w-md md:max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto modal-scroll rounded-t-2xl sm:rounded-2xl bg-[#1A1D28] border-0 sm:border border-white/10 mx-0 sm:mx-auto my-0 sm:my-4 pointer-events-auto"
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
              </div>
              {/* Decorative gradient bar */}
              <div
                style={{
                  height: '4px',
                  background: `linear-gradient(90deg, ${goalColor} 0%, ${goalColor}CC 100%)`,
                }}
              />

              {/* Header */}
              <div className="relative px-4 sm:px-6 pt-2 sm:pt-4 pb-2 sm:pb-3">
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: `${goalColor}20`,
                      fontSize: '24px',
                    }}
                  >
                    {goal.emoji || '💳'}
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
                      Add Funds
                    </h2>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.45)',
                        marginTop: '2px',
                      }}
                    >
                      Contribute to {goal.name}
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
              <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6 sm:pt-2 space-y-4">
                {/* Current Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.35)',
                      }}
                    >
                      Current Progress
                    </span>
                    <span
                      className="font-medium"
                      style={{
                        fontSize: '11px',
                        color: goalColor,
                      }}
                    >
                      {goal.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(goal.percentage, 100)}%`,
                        height: '100%',
                        background: goalColor,
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                  <p
                    className="mt-2"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {formatCurrency(goal.saved_amount)} of {formatCurrency(goal.target_amount)}
                  </p>
                </motion.div>

                {/* Amount Input */}
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
                    How much to add? <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-medium"
                      style={{
                        color: goalColor,
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
                        e.currentTarget.style.borderColor = goalColor;
                        e.currentTarget.style.background = `${goalColor}15`;
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

                {/* Preview */}
                {watchedAmount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl"
                    style={{
                      background: `${goalColor}10`,
                      border: `1px solid ${goalColor}30`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} style={{ color: goalColor }} />
                      <span
                        className="font-medium"
                        style={{
                          fontSize: '13px',
                          color: goalColor,
                        }}
                      >
                        New Progress Preview
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          New saved amount:
                        </span>
                        <span
                          className="font-medium"
                          style={{
                            fontSize: '13px',
                            color: '#FFFFFF',
                          }}
                        >
                          {formatCurrency(newSavedAmount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          New percentage:
                        </span>
                        <span
                          className="font-medium"
                          style={{
                            fontSize: '13px',
                            color: goalColor,
                          }}
                        >
                          {newPercentage.toFixed(1)}%
                        </span>
                      </div>

                      {remaining > 0 ? (
                        <div className="flex items-center justify-between">
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.5)',
                            }}
                          >
                            Remaining:
                          </span>
                          <span
                            className="font-medium"
                            style={{
                              fontSize: '13px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {formatCurrency(remaining)}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="text-center py-2 px-3 rounded-lg"
                          style={{
                            background: `${goalColor}20`,
                          }}
                        >
                          <span
                            className="font-medium"
                            style={{
                              fontSize: '12px',
                              color: goalColor,
                            }}
                          >
                              Goal will be completed!
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100 dark:border-white/[0.06]"
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto sm:flex-1 px-4 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                      fontSize: '13px',
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
                    className="w-full sm:w-auto sm:flex-1 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      fontSize: '13px',
                      color: '#FFFFFF',
                      background: `linear-gradient(135deg, ${goalColor} 0%, ${goalColor}DD 100%)`,
                      border: 'none',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Add Funds</span>
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

export default ContributionModal;

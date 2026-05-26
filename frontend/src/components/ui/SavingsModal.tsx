/**
 * Savings Goal Modal - Create/Edit Savings Goal
 * Dark themed modal with emoji picker
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, PiggyBank } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SavingsGoalSimplified } from '../../types';
import { createSavingsGoal, updateSavingsGoal } from '../../api/expenses';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: SavingsGoalSimplified;
  onSuccess: () => void;
}

// Emoji options for savings goals
const SAVINGS_EMOJIS = [
  '🏠', // Home
  '🚗', // Car
  '💻', // Computer
  '✈️', // Travel
  '👶', // Baby
  '💍', // Wedding
  '📱', // Phone
  '🎓', // Education
  '💊', // Health
  '🏋️', // Fitness
  '🎵', // Entertainment
  '💳', // General savings
];

const savingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  target_amount: z.number().positive('Amount must be greater than 0').max(9999999, 'Amount too large'),
  deadline: z.string().optional().or(z.literal('')),
  emoji: z.string().optional(),
});

type SavingsFormData = z.infer<typeof savingsSchema>;

const SavingsModal = ({ isOpen, onClose, goal, onSuccess }: SavingsModalProps) => {
  const isEditMode = !!goal;
  const [selectedEmoji, setSelectedEmoji] = useState<string>(goal?.emoji || '💳');

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SavingsFormData>({
    resolver: zodResolver(savingsSchema),
    defaultValues: goal
      ? {
          name: goal.name,
          target_amount: goal.target_amount,
          deadline: goal.deadline || '',
          emoji: goal.emoji || '💳',
        }
      : {
          emoji: '💳',
        },
  });

  useEffect(() => {
    if (goal) {
      reset({
        name: goal.name,
        target_amount: goal.target_amount,
        deadline: goal.deadline || '',
        emoji: goal.emoji || '💳',
      });
      setSelectedEmoji(goal.emoji || '💳');
    } else {
      reset({
        name: '',
        target_amount: undefined,
        deadline: '',
        emoji: '💳',
      });
      setSelectedEmoji('💳');
    }
  }, [goal, reset]);

  const onSubmit = async (data: SavingsFormData) => {
    try {
      const payload = {
        name: data.name,
        target_amount: data.target_amount,
        deadline: data.deadline || undefined,
        emoji: selectedEmoji,
      };

      if (isEditMode && goal) {
        await updateSavingsGoal(goal.id, payload);
        toast.success('✨ Goal updated!');
      } else {
        await createSavingsGoal(payload);
        toast.success('🎯 Goal created!');
      }

      onSuccess();
      onClose();
      reset();
      setSelectedEmoji('💳');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save goal';
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
      setSelectedEmoji('💳');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setValue('emoji', emoji);
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
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md pointer-events-auto overflow-hidden bg-white dark:bg-[#1A1D28] border border-gray-200 dark:border-white/10"
              style={{
                borderRadius: '24px',
              }}
            >
              {/* Decorative gradient bar */}
              <div
                style={{
                  height: '4px',
                  background: 'linear-gradient(90deg, #34D399 0%, #10B981 100%)',
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
                      background: 'rgba(52, 211, 153, 0.15)',
                      color: '#34D399',
                    }}
                  >
                    <PiggyBank size={24} />
                  </div>
                  <div className="flex-1">
                    <h2
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '20px',
                        letterSpacing: '-0.4px',
                      }}
                    >
                      {isEditMode ? 'Edit Goal' : 'Create Savings Goal'}
                    </h2>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '13px',
                        marginTop: '2px',
                      }}
                    >
                      Track your savings progress
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
                    e.currentTarget.style.background = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.color = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-5">
                {/* Goal Name */}
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
                    Goal Name <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dream Vacation"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: errors.name
                        ? '1px solid #F87171'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#34D399';
                      e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.name
                        ? '#F87171'
                        : 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    {...register('name')}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontSize: '12px',
                        color: '#F87171',
                        marginTop: '6px',
                      }}
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Target Amount */}
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
                    Target Amount <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-medium"
                      style={{
                        color: '#34D399',
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
                        border: errors.target_amount
                          ? '1px solid #F87171'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '20px',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#34D399';
                        e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.target_amount
                          ? '#F87171'
                          : 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                      {...register('target_amount', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.target_amount && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontSize: '12px',
                        color: '#F87171',
                        marginTop: '6px',
                      }}
                    >
                      {errors.target_amount.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Deadline (Optional) */}
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
                    Deadline{' '}
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
                    min={getTodayDate()}
                    className="w-full px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#34D399';
                      e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    {...register('deadline')}
                  />
                </motion.div>

                {/* Emoji Picker */}
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
                    Choose an Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {SAVINGS_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="p-3 rounded-lg transition-all"
                        style={{
                          fontSize: '24px',
                          background:
                            selectedEmoji === emoji
                              ? 'rgba(52, 211, 153, 0.15)'
                              : 'rgba(255, 255, 255, 0.05)',
                          border:
                            selectedEmoji === emoji
                              ? '2px solid #34D399'
                              : '2px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedEmoji !== emoji) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedEmoji !== emoji) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          }
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
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
                      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #34D399 0%, #10B981 100%)';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <PiggyBank size={16} />
                        <span>{isEditMode ? 'Update' : 'Create'} Goal</span>
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

export default SavingsModal;

/**
 * Savings Goal Modal - Create/Edit savings goals
 * Premium modal with form validation and animations
 */
import { useEffect } from 'react';
import { X, Target, DollarSign, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSavingsStore } from '../../store/savingsStore';
import type { SavingsGoal } from '../../types';

// Validation schema
const savingsGoalSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  target_amount: z.number().positive('Target amount must be greater than 0'),
  current_amount: z.number().min(0, 'Current amount cannot be negative').optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
});

type SavingsGoalFormData = z.infer<typeof savingsGoalSchema>;

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  goal?: SavingsGoal;
}

const SavingsGoalModal = ({ isOpen, onClose, mode, goal }: SavingsGoalModalProps) => {
  const { addGoal, modifyGoal, isCreating, isUpdating } = useSavingsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SavingsGoalFormData>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: '',
      target_amount: 0,
      current_amount: 0,
      deadline: '',
      status: 'active',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && goal) {
      setValue('name', goal.name);
      setValue('target_amount', goal.target_amount);
      setValue('current_amount', goal.current_amount);
      setValue('deadline', goal.deadline);
      setValue('status', goal.status);
    } else {
      reset();
    }
  }, [mode, goal, setValue, reset]);

  // Handle form submission
  const onSubmit = async (data: SavingsGoalFormData) => {
    try {
      if (mode === 'create') {
        await addGoal({
          name: data.name,
          target_amount: data.target_amount,
          deadline: data.deadline,
        });
      } else if (mode === 'edit' && goal) {
        await modifyGoal(goal.id, {
          name: data.name,
          target_amount: data.target_amount,
          current_amount: data.current_amount,
          deadline: data.deadline,
          status: data.status,
        });
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to save savings goal:', error);
    }
  };

  const isLoading = isCreating || isUpdating;

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full sm:max-w-md max-h-[92vh] sm:max-h-[88vh] overflow-y-auto modal-scroll rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#0D1326] border-0 sm:border border-gray-200 dark:border-white/[0.06] mx-0 sm:mx-auto my-0 sm:my-4 shadow-2xl"
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
              </div>
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {mode === 'create' ? 'New Savings Goal' : 'Edit Savings Goal'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-6 pt-2 sm:p-6 space-y-5">
                {/* Goal Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Goal Name *
                  </label>
                  <div className="relative">
                    <Target
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    />
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g., Emergency Fund, Vacation, New Car"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Target Amount *
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      {...register('target_amount', { valueAsNumber: true })}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all"
                    />
                  </div>
                  {errors.target_amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.target_amount.message}</p>
                  )}
                </div>

                {/* Current Amount (Edit mode only) */}
                {mode === 'edit' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Current Amount
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                      />
                      <input
                        type="number"
                        step="0.01"
                        {...register('current_amount', { valueAsNumber: true })}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all"
                      />
                    </div>
                    {errors.current_amount && (
                      <p className="mt-1 text-sm text-red-500">{errors.current_amount.message}</p>
                    )}
                  </div>
                )}

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Deadline *
                  </label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    />
                    <input
                      type="date"
                      {...register('deadline')}
                      min={getMinDate()}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all"
                    />
                  </div>
                  {errors.deadline && (
                    <p className="mt-1 text-sm text-red-500">{errors.deadline.message}</p>
                  )}
                </div>

                {/* Status (Edit mode only) */}
                {mode === 'edit' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto sm:flex-1 px-6 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto sm:flex-1 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : mode === 'create' ? 'Create Goal' : 'Save Changes'}
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

export default SavingsGoalModal;

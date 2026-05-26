/**
 * DeleteConfirmModal - Phase 9 Dark Design
 * Delete confirmation modal for expenses, income, and budgets
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Expense, Income } from '../../types';
import { deleteExpense } from '../../api/expenses';
import { formatCurrency, getCategoryEmoji } from '../../utils/formatters';
import { INCOME_SOURCES } from '../../utils/constants';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | Income | null;
  onSuccess?: () => void;
  onConfirm?: () => void | Promise<void>;
  isIncome?: boolean;
  // Generic props for non-expense/income deletions (budgets, etc.)
  title?: string;
  message?: string;
}

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  expense, 
  onSuccess, 
  onConfirm,
  isIncome = false,
  title,
  message,
}: DeleteConfirmModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Generic mode (for budgets, etc.)
  const isGenericMode = !expense && title && message;

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isDeleting, onClose]);

  // Handle delete action
  const handleDelete = async () => {
    // Generic mode - just call onConfirm
    if (isGenericMode && onConfirm) {
      setIsDeleting(true);
      try {
        await onConfirm();
        onClose();
      } catch (error) {
        // Error handling done by caller
      } finally {
        setIsDeleting(false);
      }
      return;
    }

    if (!expense) return;

    // If onConfirm is provided, use it (for Income page)
    if (onConfirm) {
      onConfirm();
      return;
    }

    // Otherwise, use the default delete logic (for Expense page)
    setIsDeleting(true);

    try {
      await deleteExpense(expense.id);
      toast.success(isIncome ? 'Income deleted successfully' : 'Expense deleted successfully');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to delete ${isIncome ? 'income' : 'expense'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!expense && !isGenericMode) return null;

  // Get emoji for display
  const getEmoji = () => {
    if (isIncome && 'source' in expense) {
      const source = INCOME_SOURCES.find((s) => s.value === expense.source);
      return source?.emoji || '💳';
    }
    if ('category' in expense) {
      return getCategoryEmoji(expense.category);
    }
    return '📌';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isDeleting ? onClose : undefined}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#1A1D28] border border-red-200 dark:border-red-500/15 rounded-3xl w-full max-w-sm p-7"
            >
              {/* Content - Centered */}
              <div className="text-center">
                {/* Warning Icon */}
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mt-4">
                  {title || 'Delete transaction?'}
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-500 dark:text-white/40 text-center mt-2">
                  {message || 'This will permanently delete'}
                </p>

                {/* Expense Pill - Only show if not generic mode */}
                {!isGenericMode && expense && (
                  <>
                    <div className="inline-flex items-center gap-2 mx-auto mt-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-full px-4 py-2">
                      <span className="text-base">{getEmoji()}</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {expense.title || expense.description || 'Untitled'}
                      </span>
                      <span className="text-gray-400 dark:text-white/30">·</span>
                      <span className={`text-sm font-medium ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>

                    {/* Warning Note */}
                    <p className="mt-3 text-xs text-gray-400 dark:text-white/25 text-center">
                      This cannot be undone
                    </p>
                  </>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="btn-ghost flex-1 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500/12 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded-xl py-2.5 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;

/**
 * Delete confirmation modal for expenses
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Expense } from '../../types';
import { deleteExpense } from '../../api/expenses';
import { formatCurrency, getCategoryEmoji } from '../../utils/formatters';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSuccess: () => void;
}

const DeleteConfirmModal = ({ isOpen, onClose, expense, onSuccess }: DeleteConfirmModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!expense) return;

    setIsDeleting(true);

    try {
      await deleteExpense(expense.id);
      toast.success('Expense deleted successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!expense) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isDeleting ? onClose : undefined}
            className="fixed inset-0 bg-black/75 backdrop-blur-[8px] z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#1A1D26] border border-red-500/15 rounded-3xl w-full max-w-[400px]"
              style={{ borderRadius: '24px', padding: '28px' }}
            >
              {/* Content - Centered */}
              <div className="text-center">
                {/* Warning Icon */}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={28} className="text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white text-center mt-4">
                  Delete Transaction?
                </h3>

                {/* Message */}
                <p className="text-gray-400 text-sm text-center mt-2">
                  This will permanently delete
                </p>

                {/* Expense Pill */}
                <div className="inline-flex items-center gap-2 mx-auto mt-3 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-2">
                  <span className="text-base">{getCategoryEmoji(expense.category)}</span>
                  <span className="text-sm font-medium text-white">{expense.title}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-sm font-bold text-red-400">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>

                {/* Warning Note */}
                <p className="mt-4 text-xs text-gray-600 text-center">
                  This action cannot be undone
                </p>

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
                    className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 rounded-xl py-2.5 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

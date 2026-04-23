/**
 * Delete confirmation modal for expenses
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Expense } from '../../types';
import { deleteExpense } from '../../api/expenses';
import { formatCurrency } from '../../utils/formatters';

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm"
            >
              {/* Content */}
              <div className="p-6">
                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
                  Delete Expense?
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    "{expense.title}"
                  </span>
                  ? This action cannot be undone.
                </p>

                {/* Amount */}
                <div className="text-center mb-6">
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
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

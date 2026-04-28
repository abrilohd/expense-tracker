/**
 * Recent Expenses Table - Fundex-inspired redesign
 * Modern transaction list with category icons and better typography
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Receipt, ArrowRight, Plus } from 'lucide-react';
import type { Expense } from '../../types';
import TransactionRow from './TransactionRow';

interface RecentExpensesTableProps {
  expenses: Expense[];
  isLoading?: boolean;
  maxItems?: number;
  showHeader?: boolean;
}

const RecentExpensesTable = ({
  expenses,
  isLoading = false,
  maxItems = 5,
  showHeader = true,
}: RecentExpensesTableProps) => {
  const navigate = useNavigate();

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]" style={{ padding: '24px' }}>
        {showHeader && (
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white" style={{ fontSize: '16px', fontWeight: '600' }}>Recent Transactions</h3>
              <p className="mt-0.5" style={{ fontSize: '12px', color: '#A0AEC0' }}>Latest expense activity</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        <div className="space-y-3">
          {[...Array(maxItems)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <div className="rounded-xl animate-pulse flex-shrink-0 w-11 h-11 bg-gray-200 dark:bg-white/[0.05]" />
              <div className="flex-1">
                <div className="h-4 w-32 rounded animate-pulse mb-2 bg-gray-200 dark:bg-white/[0.05]" />
                <div className="h-3 w-24 rounded animate-pulse bg-gray-200 dark:bg-white/[0.05]" />
              </div>
              <div className="text-right">
                <div className="h-4 w-20 rounded animate-pulse mb-2 ml-auto bg-gray-200 dark:bg-white/[0.05]" />
                <div className="h-3 w-16 rounded animate-pulse ml-auto bg-gray-200 dark:bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!expenses || expenses.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]" style={{ padding: '24px' }}>
        {showHeader && (
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white" style={{ fontSize: '16px', fontWeight: '600' }}>Recent Transactions</h3>
              <p className="mt-0.5" style={{ fontSize: '12px', color: '#A0AEC0' }}>Latest expense activity</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gray-100 dark:bg-white/[0.05]">
            <Receipt size={28} className="text-gray-500 dark:text-gray-600" />
          </div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No transactions yet</h4>
          <p className="text-sm text-gray-600 dark:text-gray-500 mb-5">
            Add your first expense to get started
          </p>
          <button
            onClick={() => navigate('/expenses/add')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-purple-100 dark:bg-purple-900/15 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/25"
          >
            <Plus size={16} />
            Add Expense
          </button>
        </div>
      </div>
    );
  }

  const displayExpenses = expenses.slice(0, maxItems);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]" style={{ padding: '24px' }}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white" style={{ fontSize: '16px', fontWeight: '600' }}>Recent Transactions</h3>
            <p className="mt-0.5" style={{ fontSize: '12px', color: '#A0AEC0' }}>
              {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* View All button */}
          {expenses.length > maxItems && (
            <button
              onClick={() => navigate('/expenses')}
              className="flex items-center gap-1 text-xs font-medium transition-colors text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              View all
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* Transaction list */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {displayExpenses.map((expense, index) => (
          <TransactionRow
            key={expense.id}
            expense={expense}
            index={index}
            onClick={() => navigate('/expenses')}
          />
        ))}
      </motion.div>

      {/* Show more indicator */}
      {expenses.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.04]">
          <button
            onClick={() => navigate('/expenses')}
            className="w-full text-center text-xs font-medium transition-colors py-2 text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400"
          >
            +{expenses.length - maxItems} more transaction{expenses.length - maxItems !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentExpensesTable;

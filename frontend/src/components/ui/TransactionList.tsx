/**
 * Transaction List - Fundex-inspired transaction list container
 * Reusable wrapper for multiple TransactionRow components
 */
import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import type { Expense } from '../../types';
import TransactionRow from './TransactionRow';

interface TransactionListProps {
  expenses: Expense[];
  isLoading?: boolean;
  onClick?: () => void;
  maxItems?: number;
  showViewAll?: boolean;
  title?: string;
  emptyMessage?: string;
}

const TransactionList = ({
  expenses,
  isLoading = false,
  onClick,
  maxItems,
  showViewAll = false,
  title,
  emptyMessage = 'No transactions yet',
}: TransactionListProps) => {
  // Slice expenses if maxItems is provided
  const displayExpenses = maxItems ? expenses.slice(0, maxItems) : expenses;

  return (
    <div className="rounded-[20px] bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06] p-5 md:p-6">
      {/* Header row */}
      {title && (
        <>
          <div className="flex items-center justify-between mb-3">
            {/* Left: Title + count badge */}
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
              <div className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/[0.06]">
                <span className="text-xs text-gray-600 dark:text-gray-400">{expenses.length}</span>
              </div>
            </div>

            {/* Right: View all link */}
            {showViewAll && (
              <Link
                to="/expenses"
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                View all →
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="mb-2 border-b border-gray-200 dark:border-white/[0.04]" />
        </>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center p-3">
              {/* Circle skeleton */}
              <div className="rounded-xl animate-pulse flex-shrink-0 w-11 h-11 bg-gray-200 dark:bg-white/[0.05]" />

              {/* Middle block */}
              <div className="flex-1">
                <div className="rounded animate-pulse mb-2 h-3.5 w-32 bg-gray-200 dark:bg-white/[0.05]" />
                <div className="rounded animate-pulse h-3 w-48 bg-gray-200 dark:bg-white/[0.05]" />
              </div>

              {/* Right block */}
              <div className="ml-auto">
                <div className="rounded animate-pulse mb-2 h-4 w-16 bg-gray-200 dark:bg-white/[0.05]" />
                <div className="rounded animate-pulse h-3 w-12 bg-gray-200 dark:bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      ) : displayExpenses.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-8">
          <Receipt size={28} className="text-gray-400 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-600 mb-1">{emptyMessage}</p>
          <p className="text-xs text-gray-400 dark:text-gray-700">Start adding expenses to track your spending</p>
        </div>
      ) : (
        // Expense list
        <div>
          {displayExpenses.map((expense, index) => (
            <TransactionRow
              key={expense.id}
              expense={expense}
              index={index}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;

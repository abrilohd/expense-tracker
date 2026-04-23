/**
 * Recent expenses table component
 */
import { Link, useNavigate } from 'react-router-dom';
import { Receipt, ArrowRight } from 'lucide-react';
import type { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from './Badge';
import { TableSkeleton } from './LoadingSpinner';

interface RecentExpensesTableProps {
  expenses: Expense[];
  isLoading?: boolean;
}

const RecentExpensesTable = ({ expenses, isLoading = false }: RecentExpensesTableProps) => {
  const navigate = useNavigate();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Expenses
          </h3>
        </div>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  // Empty state
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Expenses
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Receipt size={48} />
          <p className="mt-4 text-lg font-medium">No expenses yet</p>
          <p className="mt-1 text-sm">Add your first expense to get started</p>
          <button
            onClick={() => navigate('/expenses/add')}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Add Expense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Expenses
        </h3>
        <Link
          to="/expenses"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Title
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Category
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Amount
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {/* Title */}
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {expense.title}
                  </p>
                  {expense.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {expense.description}
                    </p>
                  )}
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  <Badge category={expense.category} label={expense.category} size="sm" />
                </td>

                {/* Amount */}
                <td className="py-3 px-4 text-right">
                  <span className="font-semibold text-expense">
                    {formatCurrency(expense.amount)}
                  </span>
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-400">
                    {formatDate(expense.date)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentExpensesTable;

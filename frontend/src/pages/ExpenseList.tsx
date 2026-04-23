/**
 * Expense List page - view, filter, search, edit, and delete expenses
 */
import { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  CreditCard,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Expense, FilterParams, ExpenseCategory } from '../types';
import { getExpenses } from '../api/expenses';
import { CATEGORIES, PAGE_SIZE } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import Badge from '../components/ui/Badge';
import ExpenseModal from '../components/ui/ExpenseModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import { TableSkeleton } from '../components/ui/LoadingSpinner';

const ExpenseListPage = () => {
  // Data state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state
  const [filters, setFilters] = useState<FilterParams>({
    sort_by: 'date',
    order: 'desc',
  });

  // Search with debounce
  const [searchInput, setSearchInput] = useState('');

  // Modal state
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const skip = (currentPage - 1) * PAGE_SIZE;
      const response = await getExpenses({
        ...filters,
        skip,
        limit: PAGE_SIZE,
      });

      setExpenses(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
      toast.error('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch expenses when filters or page changes
  useEffect(() => {
    fetchExpenses();
  }, [filters, currentPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput || undefined }));
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return !!(
      filters.category ||
      filters.search ||
      filters.start_date ||
      filters.end_date
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ sort_by: 'date', order: 'desc' });
    setSearchInput('');
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category ? (category as ExpenseCategory) : undefined,
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortValue: string) => {
    const [sort_by, order] = sortValue.split('-') as ['date' | 'amount', 'asc' | 'desc'];
    setFilters((prev) => ({ ...prev, sort_by, order }));
    setCurrentPage(1);
  };

  // Pagination helpers
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          {total > 0 && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
              {total}
            </span>
          )}
        </div>

        {/* Add Expense Button */}
        <button
          onClick={() => {
            setSelectedExpense(null);
            setIsEditModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <PlusCircle size={20} />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4">
        <div className="space-y-3">
          {/* Row 1: Search + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <select
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Dates + Sort + Clear */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Start Date */}
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  start_date: e.target.value || undefined,
                }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* End Date */}
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  end_date: e.target.value || undefined,
                }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Sort */}
            <select
              value={`${filters.sort_by}-${filters.order}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High)</option>
              <option value="amount-asc">Amount (Low)</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={PAGE_SIZE} cols={5} />
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchExpenses}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            {hasActiveFilters() ? (
              <>
                {/* Empty state with filters */}
                <Search className="mx-auto text-gray-400" size={48} />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  No expenses found
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Try adjusting your filters
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                {/* Empty state no expenses */}
                <CreditCard className="mx-auto text-gray-400" size={48} />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  No expenses yet
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Start tracking your spending
                </p>
                <button
                  onClick={() => {
                    setSelectedExpense(null);
                    setIsEditModalOpen(true);
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <PlusCircle size={20} />
                  Add First Expense
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Title */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {expense.title}
                          </p>
                          {expense.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {expense.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <Badge category={expense.category} label={expense.category} size="sm" />
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-red-500">
                          {formatCurrency(expense.amount)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-400">
                          {formatDate(expense.date)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setSelectedExpense(expense);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit expense"
                          >
                            <Pencil size={18} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setExpenseToDelete(expense);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                {/* Results info */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {startIndex}–{endIndex} of {total} expenses
                </p>

                {/* Page controls */}
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ExpenseModal
        isOpen={isEditModalOpen}
        expense={selectedExpense || undefined}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }}
        onSuccess={fetchExpenses}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        expense={expenseToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onSuccess={fetchExpenses}
      />
    </div>
  );
};

export default ExpenseListPage;

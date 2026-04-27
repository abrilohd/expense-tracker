/**
 * Expense List page - view, filter, search, edit, and delete expenses
 * Updated to use Zustand store with Fundex-inspired dark design
 */
import { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Expense, ExpenseCategory } from '../types';
import { useExpenseList, useExpenseMutations } from '../hooks/useExpenses';
import { CATEGORIES, PAGE_SIZE } from '../utils/constants';
import TransactionRow from '../components/ui/TransactionRow';
import ExpenseModal from '../components/ui/ExpenseModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';

const ExpenseListPage = () => {
  // Zustand store hooks
  const {
    expenses,
    total,
    isLoading,
    error,
    filters,
    currentPage,
    setFilters,
    setPage,
    resetFilters,
    refetch,
  } = useExpenseList();

  const { removeExpense, isDeleting } = useExpenseMutations();

  // Search with debounce (local state)
  const [searchInput, setSearchInput] = useState('');

  // Modal state
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Debounced search - update store filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchInput || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  // Clear all filters
  const clearFilters = () => {
    resetFilters();
    setSearchInput('');
  };

  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    setFilters({
      category: category ? (category as ExpenseCategory) : undefined,
    });
  };

  const handleSortChange = (sortValue: string) => {
    const [sort_by, order] = sortValue.split('-') as ['date' | 'amount', 'asc' | 'desc'];
    setFilters({ sort_by, order });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return !!(
      filters.category ||
      filters.search ||
      filters.start_date ||
      filters.end_date
    );
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.search) count++;
    if (filters.start_date) count++;
    if (filters.end_date) count++;
    return count;
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
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Expenses</h1>
          {total > 0 && (
            <div className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-purple-100 dark:bg-purple-900/15 text-purple-700 dark:text-purple-400">
              <span className="text-xs md:text-sm font-semibold">{total}</span>
            </div>
          )}
        </div>

        {/* Add Expense Button */}
        <button
          onClick={() => {
            setSelectedExpense(null);
            setIsEditModalOpen(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors bg-purple-600 hover:bg-purple-700"
        >
          <PlusCircle size={18} className="md:w-5 md:h-5" />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl md:rounded-[20px] p-4 md:p-5 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
        <div className="space-y-3">
          {/* Row 1: Search + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-600"
                size={16}
              />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 py-2.5 rounded-xl text-sm text-gray-900 dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:outline-none transition-colors bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50"
              />
            </div>

            {/* Category */}
            <select
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 md:px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-gray-300 focus:outline-none transition-colors bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50"
            >
              <option value="" className="bg-white dark:bg-[#1A1D26]">
                All Categories
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-white dark:bg-[#1A1D26]">
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Dates + Sort + Clear */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Start Date */}
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => {
                setFilters({
                  start_date: e.target.value || undefined,
                });
              }}
              className="w-full px-3 md:px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-gray-300 focus:outline-none transition-colors bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50"
            />

            {/* End Date */}
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => {
                setFilters({
                  end_date: e.target.value || undefined,
                });
              }}
              className="w-full px-3 md:px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-gray-300 focus:outline-none transition-colors bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50"
            />

            {/* Sort */}
            <select
              value={`${filters.sort_by}-${filters.order}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 md:px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-gray-300 focus:outline-none transition-colors bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50"
            >
              <option value="date-desc" className="bg-white dark:bg-[#1A1D26]">
                Date (Newest)
              </option>
              <option value="date-asc" className="bg-white dark:bg-[#1A1D26]">
                Date (Oldest)
              </option>
              <option value="amount-desc" className="bg-white dark:bg-[#1A1D26]">
                Amount (High)
              </option>
              <option value="amount-asc" className="bg-white dark:bg-[#1A1D26]">
                Amount (Low)
              </option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 transition-colors border border-red-300 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-900/10"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="rounded-2xl md:rounded-[20px] overflow-hidden bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
        {isLoading ? (
          // Loading state
          <div className="px-3 md:px-4 py-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-2 md:gap-3 items-center p-2 md:p-3">
                {/* Circle skeleton */}
                <div className="rounded-xl animate-pulse flex-shrink-0 w-10 h-10 md:w-11 md:h-11 bg-gray-200 dark:bg-white/[0.05]" />

                {/* Middle block */}
                <div className="flex-1 min-w-0">
                  <div className="rounded animate-pulse mb-2 h-3 md:h-3.5 w-24 md:w-32 bg-gray-200 dark:bg-white/[0.05]" />
                  <div className="rounded animate-pulse h-2.5 md:h-3 w-32 md:w-48 bg-gray-200 dark:bg-white/[0.05]" />
                </div>

                {/* Right block */}
                <div className="ml-auto flex-shrink-0">
                  <div className="rounded animate-pulse mb-2 h-3.5 md:h-4 w-12 md:w-16 bg-gray-200 dark:bg-white/[0.05]" />
                  <div className="rounded animate-pulse h-2.5 md:h-3 w-10 md:w-12 bg-gray-200 dark:bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 md:p-12 text-center">
            <p className="text-sm md:text-base text-red-400">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
              style={{
                backgroundColor: '#8B5CF6',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7C3AED';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8B5CF6';
              }}
            >
              Retry
            </button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-12 md:py-16 px-4 text-center">
            {hasActiveFilters() ? (
              <>
                {/* Empty state with filters */}
                <div className="text-4xl md:text-5xl">🔍</div>
                <h3 className="text-base md:text-lg font-semibold text-white mt-4">No results found</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting or clearing your filters
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-5 md:px-6 py-2.5 rounded-xl text-sm font-medium text-gray-400 transition-colors"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#9CA3AF';
                  }}
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                {/* Empty state no expenses */}
                <div className="text-4xl md:text-5xl">💸</div>
                <h3 className="text-base md:text-lg font-semibold text-white mt-4">No expenses yet</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Start tracking your spending journey
                </p>
                <button
                  onClick={() => {
                    setSelectedExpense(null);
                    setIsEditModalOpen(true);
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-5 md:px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                  style={{
                    backgroundColor: '#8B5CF6',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7C3AED';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#8B5CF6';
                  }}
                >
                  <PlusCircle size={18} className="md:w-5 md:h-5" />
                  Add First Expense
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* List Header */}
            <div
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-4 md:px-5 py-3 md:py-4"
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Left: Transaction count + filter badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm text-gray-400">{total} transactions</span>
                {hasActiveFilters() && (
                  <span className="text-xs text-purple-400">
                    ({getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''}{' '}
                    active)
                  </span>
                )}
              </div>

              {/* Right: Sort indicator */}
              <span className="text-xs text-gray-600">
                Sort:{' '}
                {filters.sort_by === 'date'
                  ? filters.order === 'desc'
                    ? 'Newest'
                    : 'Oldest'
                  : filters.order === 'desc'
                  ? 'High to Low'
                  : 'Low to High'}
              </span>
            </div>

            {/* Transaction Rows */}
            <div className="px-3 md:px-4 py-2">
              {expenses.map((expense, index) => (
                <TransactionRow
                  key={expense.id}
                  expense={expense}
                  index={index}
                  showActions={true}
                  compact={false}
                  onEdit={(e) => {
                    setSelectedExpense(e);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={(e) => {
                    setExpenseToDelete(e);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Results info */}
                <p className="text-xs text-gray-600">
                  Showing {startIndex}–{endIndex} of {total}
                </p>

                {/* Page controls */}
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.color = '#9CA3AF';
                      }
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page numbers - Hidden on mobile, show "Page X of Y" instead */}
                  <div className="hidden sm:flex items-center gap-2">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => setPage(page)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          page === currentPage ? '' : ''
                        }`}
                        style={
                          page === currentPage
                            ? {
                                backgroundColor: '#8B5CF6',
                                color: '#FFFFFF',
                                border: '1px solid #8B5CF6',
                              }
                            : {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#9CA3AF',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                              }
                        }
                        onMouseEnter={(e) => {
                          if (page !== currentPage) {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                            e.currentTarget.style.color = '#FFFFFF';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (page !== currentPage) {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.color = '#9CA3AF';
                          }
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Mobile: Show "Page X of Y" */}
                  <span className="sm:hidden text-xs text-gray-400 px-2">
                    Page {currentPage} of {totalPages}
                  </span>

                  {/* Next button */}
                  <button
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.color = '#9CA3AF';
                      }
                    }}
                  >
                    <ChevronRight size={16} />
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
        onSuccess={refetch}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        expense={expenseToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ExpenseListPage;

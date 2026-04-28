/**
 * Expense List page - Premium financial interface
 * High-end SaaS design with token-based styling
 */
import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingDown,
  Receipt,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { Expense, ExpenseCategory } from '../types';
import { useExpenseList, useExpenseMutations } from '../hooks/useExpenses';
import { CATEGORIES, PAGE_SIZE } from '../utils/constants';
import ExpenseModal from '../components/ui/ExpenseModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import { formatCurrency, formatDate, getCategoryEmoji } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Calculate total spent
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

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

  // Category color mapping
  const categoryColors: Record<string, { bg: string; primary: string }> = {
    Food: { bg: 'rgba(245, 158, 11, 0.12)', primary: '#F59E0B' },
    Transport: { bg: 'rgba(59, 130, 246, 0.12)', primary: '#3B82F6' },
    Housing: { bg: 'rgba(139, 92, 246, 0.12)', primary: '#8B5CF6' },
    Entertainment: { bg: 'rgba(236, 72, 153, 0.12)', primary: '#EC4899' },
    Health: { bg: 'rgba(16, 185, 129, 0.12)', primary: '#10B981' },
    Shopping: { bg: 'rgba(249, 115, 22, 0.12)', primary: '#F97316' },
    Education: { bg: 'rgba(99, 102, 241, 0.12)', primary: '#6366F1' },
    Other: { bg: 'rgba(107, 114, 128, 0.12)', primary: '#6B7280' },
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header with Summary Card */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Expenses
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track and manage your spending
            </p>
          </div>

          {/* Add Expense Button */}
          <button
            onClick={() => {
              setSelectedExpense(null);
              setIsEditModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <PlusCircle size={20} />
            Add Expense
          </button>
        </div>

        {/* Total Spent Summary Card */}
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-900/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Total Spent (Current Page)
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {total} transaction{total !== 1 ? 's' : ''}
                </p>
                {hasActiveFilters() && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filters - Enhanced Control Bar */}
      <div className="rounded-2xl p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06] shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Filter className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Filters</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Refine your expense view</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Row 1: Search + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none transition-all bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-200 focus:outline-none transition-all bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
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
          </div>

          {/* Row 2: Dates + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => {
                  setFilters({
                    start_date: e.target.value || undefined,
                  });
                }}
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-200 focus:outline-none transition-all bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => {
                  setFilters({
                    end_date: e.target.value || undefined,
                  });
                }}
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-200 focus:outline-none transition-all bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={`${filters.sort_by}-${filters.order}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-200 focus:outline-none transition-all bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] focus:border-purple-500 dark:focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="date-desc" className="bg-white dark:bg-[#1A1D26]">
                  Date (Newest First)
                </option>
                <option value="date-asc" className="bg-white dark:bg-[#1A1D26]">
                  Date (Oldest First)
                </option>
                <option value="amount-desc" className="bg-white dark:bg-[#1A1D26]">
                  Amount (Highest)
                </option>
                <option value="amount-asc" className="bg-white dark:bg-[#1A1D26]">
                  Amount (Lowest)
                </option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <button
                onClick={clearFilters}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 transition-all border border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <X size={16} />
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Expenses List - Premium Card Design */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06] shadow-sm">
        {isLoading ? (
          // Loading state
          <div className="p-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 items-center p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] animate-pulse"
              >
                <div className="rounded-xl flex-shrink-0 w-14 h-14 bg-gray-200 dark:bg-white/[0.05]" />
                <div className="flex-1 space-y-2">
                  <div className="rounded h-4 w-32 bg-gray-200 dark:bg-white/[0.05]" />
                  <div className="rounded h-3 w-48 bg-gray-200 dark:bg-white/[0.05]" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="rounded h-5 w-20 bg-gray-200 dark:bg-white/[0.05] ml-auto" />
                  <div className="rounded h-3 w-16 bg-gray-200 dark:bg-white/[0.05] ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <X className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <p className="text-base text-red-600 dark:text-red-400 font-medium">{error}</p>
            <button
              onClick={refetch}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-16 px-6 text-center">
            {hasActiveFilters() ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center mb-6">
                  <Search className="text-gray-400 dark:text-gray-600" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No expenses found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
                >
                  Clear All Filters
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center mb-6">
                  <Receipt className="text-purple-600 dark:text-purple-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No expenses yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Start tracking your spending journey today
                </p>
                <button
                  onClick={() => {
                    setSelectedExpense(null);
                    setIsEditModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
                >
                  <PlusCircle size={20} />
                  Add Your First Expense
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Expense Cards */}
            <div className="p-4 md:p-6 space-y-3">
              <AnimatePresence>
                {expenses.map((expense, index) => {
                  const colors = categoryColors[expense.category] || categoryColors.Other;
                  
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] border border-transparent hover:border-gray-200 dark:hover:border-white/[0.08] hover:shadow-md"
                      onClick={() => {
                        setSelectedExpense(expense);
                        setIsEditModalOpen(true);
                      }}
                    >
                      {/* Category Icon */}
                      <div
                        className="flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '14px',
                          backgroundColor: colors.bg,
                        }}
                      >
                        <span style={{ fontSize: '28px' }}>
                          {getCategoryEmoji(expense.category)}
                        </span>
                      </div>

                      {/* Expense Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white truncate mb-1">
                          {expense.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className="font-medium px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.primary,
                            }}
                          >
                            {expense.category}
                          </span>
                          <span className="text-gray-400 dark:text-gray-600">•</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0 mr-12">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(expense.amount)}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExpense(expense);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          aria-label="Edit expense"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpenseToDelete(expense);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          aria-label="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 dark:border-white/[0.06] px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Results info */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{startIndex}–{endIndex}</span> of{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
                  </p>

                  {/* Page controls */}
                  <div className="flex items-center gap-2">
                    {/* Previous button */}
                    <button
                      onClick={() => setPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-gray-100 dark:hover:bg-white/[0.05] border border-gray-200 dark:border-white/[0.06]"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Page numbers - Hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-2">
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => setPage(page)}
                          className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                            page === currentPage
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] border border-gray-200 dark:border-white/[0.06]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Mobile: Show "Page X of Y" */}
                    <span className="sm:hidden text-sm text-gray-600 dark:text-gray-400 px-3">
                      Page {currentPage} of {totalPages}
                    </span>

                    {/* Next button */}
                    <button
                      onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-gray-100 dark:hover:bg-white/[0.05] border border-gray-200 dark:border-white/[0.06]"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
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

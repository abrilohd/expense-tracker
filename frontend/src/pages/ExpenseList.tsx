/**
 * Expense List Page - 2026+ UI/UX REDESIGN
 * World-class expense tracker with compact filters, always-visible actions, and FAB
 * Preserves ALL existing logic, hooks, and functionality
 */
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  Calendar,
  SlidersHorizontal,
} from 'lucide-react';
import type { Expense, ExpenseCategory } from '../types';
import { useExpenseList, useExpenseMutations } from '../hooks/useExpenses';
import { CATEGORIES, PAGE_SIZE } from '../utils/constants';
import { Card } from '../components/ui/Card';
import TransactionRow from '../components/ui/TransactionRow';
import EmptyState from '../components/ui/EmptyState';
import ExpenseModal from '../components/ui/ExpenseModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPENSE LIST PAGE - WORLD-CLASS DESIGN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ExpenseListPage = () => {
  // Zustand store hooks (PRESERVED)
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

  // Search with debounce (PRESERVED)
  const [searchInput, setSearchInput] = useState('');

  // Modal state (PRESERVED)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // NEW: Filter panel collapse state
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Debounced search (PRESERVED)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchInput || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  // Filter helpers (PRESERVED)
  const clearFilters = () => {
    resetFilters();
    setSearchInput('');
  };

  const handleCategoryChange = (category: string) => {
    setFilters({
      category: category ? (category as ExpenseCategory) : undefined,
    });
  };

  const handleSortChange = (sortValue: string) => {
    const [sort_by, order] = sortValue.split('-') as ['date' | 'amount', 'asc' | 'desc'];
    setFilters({ sort_by, order });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.category ||
      filters.search ||
      filters.start_date ||
      filters.end_date
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.search) count++;
    if (filters.start_date) count++;
    if (filters.end_date) count++;
    return count;
  };

  // Pagination helpers (PRESERVED)
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, total);

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
    <div className="space-y-6 pb-24">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PAGE HEADER - COMPACT
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-medium text-gray-900 dark:text-white"
            style={{
              fontSize: '22px',
              letterSpacing: '-0.4px',
            }}
          >
            Expenses
          </h1>
          {total > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 rounded-full font-medium bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400"
                style={{
                  fontSize: '11px',
                }}
              >
                {total}
              </span>
              {hasActiveFilters() && (
                <span
                  className="inline-flex items-center justify-center px-2 py-0.5 rounded-full font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400"
                  style={{
                    fontSize: '11px',
                  }}
                >
                  {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Desktop Add Button */}
        <button
          onClick={() => {
            setSelectedExpense(null);
            setIsEditModalOpen(true);
          }}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all"
          style={{
            fontSize: '13px',
            background: 'linear-gradient(135deg, #5B4EE8 0%, #7C3AED 100%)',
            color: '#FFFFFF',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(91, 78, 232, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COMPACT SEARCH + QUICK FILTERS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-3">
        {/* Search Bar + Filter Toggle */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25"
            />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/7 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              style={{
                fontSize: '13px',
              }}
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all flex-shrink-0 border ${
              isFilterExpanded
                ? 'bg-purple-100 dark:bg-purple-500/15 border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-400'
                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/7 text-gray-600 dark:text-white/60'
            }`}
            style={{
              fontSize: '13px',
            }}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown
              size={14}
              style={{
                transform: isFilterExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* All Categories */}
          <button
            onClick={() => handleCategoryChange('')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 border ${
              !filters.category
                ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-400'
                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50'
            }`}
            style={{
              fontSize: '12px',
            }}
          >
            All
          </button>

          {/* Category Pills */}
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.value;
            const colorClasses = {
              orange: isActive ? 'bg-orange-100 dark:bg-orange-500/20 border-orange-300 dark:border-orange-500/40 text-orange-700 dark:text-orange-400' : '',
              blue: isActive ? 'bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-400' : '',
              purple: isActive ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-400' : '',
              pink: isActive ? 'bg-pink-100 dark:bg-pink-500/20 border-pink-300 dark:border-pink-500/40 text-pink-700 dark:text-pink-400' : '',
              green: isActive ? 'bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/40 text-green-700 dark:text-green-400' : '',
              yellow: isActive ? 'bg-yellow-100 dark:bg-yellow-500/20 border-yellow-300 dark:border-yellow-500/40 text-yellow-700 dark:text-yellow-400' : '',
              indigo: isActive ? 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-400' : '',
              gray: isActive ? 'bg-gray-100 dark:bg-gray-500/20 border-gray-300 dark:border-gray-500/40 text-gray-700 dark:text-gray-400' : '',
            };
            
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 border ${
                  isActive
                    ? colorClasses[cat.color as keyof typeof colorClasses] || colorClasses.gray
                    : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50'
                }`}
                style={{
                  fontSize: '12px',
                }}
              >
                <span>{cat.emoji}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Advanced Filters - Collapsible */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <Card padding="sm">
                <div className="space-y-3">
                  {/* Date Range + Sort */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Date From */}
                    <div className="relative">
                      <Calendar
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-white/25"
                      />
                      <input
                        type="date"
                        value={filters.start_date || ''}
                        onChange={(e) =>
                          setFilters({ start_date: e.target.value || undefined })
                        }
                        className="w-full pl-9 pr-3 py-2 rounded-lg transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/7 text-gray-900 dark:text-white"
                        style={{
                          fontSize: '12px',
                        }}
                      />
                    </div>

                    {/* Date To */}
                    <div className="relative">
                      <Calendar
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-white/25"
                      />
                      <input
                        type="date"
                        value={filters.end_date || ''}
                        onChange={(e) => setFilters({ end_date: e.target.value || undefined })}
                        className="w-full pl-9 pr-3 py-2 rounded-lg transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/7 text-gray-900 dark:text-white"
                        style={{
                          fontSize: '12px',
                        }}
                      />
                    </div>

                    {/* Sort */}
                    <select
                      value={`${filters.sort_by}-${filters.order}`}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-3 py-2 rounded-lg transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/7 text-gray-900 dark:text-white"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      <option value="date-desc">📅 Newest First</option>
                      <option value="date-asc">📅 Oldest First</option>
                      <option value="amount-desc">💰 Highest Amount</option>
                      <option value="amount-asc">💰 Lowest Amount</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      <X size={12} />
                      Clear all filters
                    </button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TRANSACTIONS CONTAINER - ENHANCED
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Card padding="none">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2 p-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div
                  className="flex-shrink-0 rounded-xl"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className="rounded"
                    style={{
                      width: '40%',
                      height: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />
                  <div
                    className="rounded"
                    style={{
                      width: '25%',
                      height: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />
                </div>
                <div
                  className="rounded"
                  style={{
                    width: '60px',
                    height: '14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-12 text-center">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(248, 113, 113, 0.15)' }}
            >
              <AlertCircle size={32} style={{ color: '#F87171' }} />
            </div>
            <p
              className="font-medium mb-4"
              style={{ fontSize: '14px', color: '#F87171' }}
            >
              {error}
            </p>
            <button onClick={refetch} className="btn-primary">
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && expenses.length === 0 && (
          <EmptyState
            icon={CreditCard}
            title={hasActiveFilters() ? 'No expenses found' : 'No expenses yet'}
            message={
              hasActiveFilters()
                ? 'Try adjusting your filters to see more results'
                : 'Add your first expense to start tracking'
            }
            action={
              hasActiveFilters()
                ? {
                    label: 'Clear Filters',
                    onClick: clearFilters,
                  }
                : {
                    label: '+ Add Expense',
                    onClick: () => {
                      setSelectedExpense(null);
                      setIsEditModalOpen(true);
                    },
                  }
            }
          />
        )}

        {/* Transactions List */}
        {!isLoading && !error && expenses.length > 0 && (
          <>
            {/* List Header - Compact */}
            <div
              className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-white/5"
            >
              <span
                className="text-gray-600 dark:text-white/35"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                {total} transaction{total !== 1 ? 's' : ''}
              </span>
              <span
                className="text-gray-400 dark:text-white/25"
                style={{
                  fontSize: '10px',
                }}
              >
                {filters.sort_by === 'date' ? '📅' : '💰'} {filters.order === 'desc' ? '↓' : '↑'}
              </span>
            </div>

            {/* Transaction Rows - Enhanced with always-visible actions */}
            <div className="space-y-0.5 px-3 py-2">
              <AnimatePresence>
                {expenses.map((expense, index) => (
                  <TransactionRow
                    key={expense.id}
                    expense={expense}
                    index={index}
                    showActions={true}
                    onEdit={(id) => {
                      const exp = expenses.find((e) => e.id === id);
                      if (exp) {
                        setSelectedExpense(exp);
                        setIsEditModalOpen(true);
                      }
                    }}
                    onDelete={(id) => {
                      const exp = expenses.find((e) => e.id === id);
                      if (exp) {
                        setExpenseToDelete(exp);
                        setIsDeleteModalOpen(true);
                      }
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination - Compact & Modern */}
            {totalPages > 1 && (
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 mt-2 border-t border-gray-200 dark:border-white/5"
              >
                {/* Results Info */}
                <p
                  className="text-gray-500 dark:text-white/30"
                  style={{
                    fontSize: '11px',
                  }}
                >
                  {startIndex}–{endIndex} of {total}
                </p>

                {/* Page Controls */}
                <div className="flex items-center gap-1.5">
                  {/* Previous */}
                  <button
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage > 1) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* Page Numbers - Desktop */}
                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => setPage(page)}
                        className="min-w-[28px] px-2.5 py-1 rounded-lg font-medium transition-all"
                        style={{
                          fontSize: '11px',
                          background:
                            page === currentPage
                              ? 'linear-gradient(135deg, #5B4EE8 0%, #7C3AED 100%)'
                              : 'rgba(255, 255, 255, 0.05)',
                          color: page === currentPage ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                        }}
                        onMouseEnter={(e) => {
                          if (page !== currentPage) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (page !== currentPage) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          }
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Page Info - Mobile */}
                  <span
                    className="sm:hidden px-2.5"
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.35)',
                    }}
                  >
                    {currentPage} / {totalPages}
                  </span>

                  {/* Next */}
                  <button
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage < totalPages) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FLOATING ACTION BUTTON (FAB) - MOBILE ONLY
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.button
        onClick={() => {
          setSelectedExpense(null);
          setIsEditModalOpen(true);
        }}
        className="sm:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center shadow-2xl"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #5B4EE8 0%, #7C3AED 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(91, 78, 232, 0.4)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.3,
        }}
      >
        <Plus size={24} style={{ color: '#FFFFFF' }} />
      </motion.button>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MODALS (PRESERVED)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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

      {/* Custom scrollbar styles for filter pills */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ExpenseListPage;

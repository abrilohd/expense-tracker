/**
 * Income Page - 2026+ UI/UX REDESIGN
 * Mirror of ExpenseList but for Income records with green theme
 * Compact filters, quick pills, FAB, always-visible actions
 */
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  DollarSign,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import type { Income, IncomeSource, IncomeFilterParams } from '../types';
import { getIncomes, createIncome, updateIncome, deleteIncome } from '../api/expenses';
import { INCOME_SOURCES, PAGE_SIZE } from '../utils/constants';
import { Card, StatCard } from '../components/ui/Card';
import TransactionRow from '../components/ui/TransactionRow';
import EmptyState from '../components/ui/EmptyState';
import IncomeModal from '../components/ui/IncomeModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INCOME PAGE - WORLD-CLASS DESIGN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const IncomePage = () => {
  // State management
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState<IncomeFilterParams>({
    sort_by: 'date',
    order: 'desc',
    skip: 0,
    limit: PAGE_SIZE,
  });

  // Search with debounce
  const [searchInput, setSearchInput] = useState('');

  // Modal state
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // NEW: Filter panel collapse state
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Calculate totals
  const currentMonthTotal = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return incomes
      .filter((income) => {
        const date = new Date(income.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, income) => sum + income.amount, 0);
  }, [incomes]);

  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, income) => sum + income.amount, 0);
  }, [incomes]);

  const averageIncome = useMemo(() => {
    return incomes.length > 0 ? totalIncome / incomes.length : 0;
  }, [incomes, totalIncome]);

  // Fetch incomes
  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getIncomes(filters);
      setIncomes(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load income records');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and filter changes
  useEffect(() => {
    fetchIncomes();
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput || undefined,
        skip: 0,
      }));
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update filters helper
  const updateFilters = (newFilters: Partial<IncomeFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      skip: 0,
    }));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sort_by: 'date',
      order: 'desc',
      skip: 0,
      limit: PAGE_SIZE,
    });
    setSearchInput('');
    setCurrentPage(1);
  };

  // Handle source change
  const handleSourceChange = (source: string) => {
    updateFilters({
      source: source ? (source as IncomeSource) : undefined,
    });
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    const [sort_by, order] = sortValue.split('-') as ['date' | 'amount', 'asc' | 'desc'];
    updateFilters({ sort_by, order });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return !!(
      filters.source ||
      filters.search ||
      filters.start_date ||
      filters.end_date
    );
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.source) count++;
    if (filters.search) count++;
    if (filters.start_date) count++;
    if (filters.end_date) count++;
    return count;
  };

  // Pagination helpers
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, total);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters((prev) => ({
      ...prev,
      skip: (page - 1) * PAGE_SIZE,
    }));
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Handle delete
  const handleDelete = async () => {
    if (!incomeToDelete) return;

    try {
      await deleteIncome(incomeToDelete.id);
      setIsDeleteModalOpen(false);
      setIncomeToDelete(null);
      fetchIncomes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete income');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SUMMARY STATS - GREEN THEMED
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <StatCard
            label="This Month"
            value={formatCurrency(currentMonthTotal)}
            icon={TrendingUp}
            iconColor="#34D399"
            iconBg="rgba(52, 211, 153, 0.15)"
            subtitle="Current month income"
          />

          <StatCard
            label="Total Income"
            value={formatCurrency(totalIncome)}
            icon={DollarSign}
            iconColor="#34D399"
            iconBg="rgba(52, 211, 153, 0.15)"
            subtitle="All time"
          />

          <StatCard
            label="Average"
            value={formatCurrency(averageIncome)}
            icon={TrendingUp}
            iconColor="#34D399"
            iconBg="rgba(52, 211, 153, 0.15)"
            subtitle="Per transaction"
          />
        </motion.div>
      )}

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
            Income
          </h1>
          {total > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 rounded-full font-medium bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400"
                style={{
                  fontSize: '11px',
                }}
              >
                {total}
              </span>
              {hasActiveFilters() && (
                <span
                  className="inline-flex items-center justify-center px-2 py-0.5 rounded-full font-medium bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400"
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
            setSelectedIncome(null);
            setIsEditModalOpen(true);
          }}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all"
          style={{
            fontSize: '13px',
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
            color: '#FFFFFF',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(52, 211, 153, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus size={18} />
          Add Income
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
              placeholder="Search income..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl transition-all bg-white dark:bg-white/5 border border-gray-200 dark:border-white/7 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              style={{
                fontSize: '13px',
              }}
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all flex-shrink-0 ${
              isFilterExpanded
                ? 'bg-green-100 dark:bg-green-500/15 border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400'
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

        {/* Quick Source Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* All Sources */}
          <button
            onClick={() => handleSourceChange('')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 border ${
              !filters.source
                ? 'bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/40 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50'
            }`}
            style={{
              fontSize: '12px',
            }}
          >
            All
          </button>

          {/* Source Pills */}
          {INCOME_SOURCES.map((source) => (
            <button
              key={source.value}
              onClick={() => handleSourceChange(source.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 border ${
                filters.source === source.value
                  ? 'bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/40 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50'
              }`}
              style={{
                fontSize: '12px',
              }}
            >
              <span>{source.emoji}</span>
              <span className="hidden sm:inline">{source.label}</span>
            </button>
          ))}
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
                          updateFilters({ start_date: e.target.value || undefined })
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
                        onChange={(e) => updateFilters({ end_date: e.target.value || undefined })}
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
          INCOME LIST CONTAINER - ENHANCED
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
            <button onClick={fetchIncomes} className="btn-primary">
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && incomes.length === 0 && (
          <EmptyState
            icon={TrendingUp}
            title={hasActiveFilters() ? 'No income found' : 'No income yet'}
            message={
              hasActiveFilters()
                ? 'Try adjusting your filters to see more results'
                : 'Add your first income to start tracking'
            }
            action={
              hasActiveFilters()
                ? {
                    label: 'Clear Filters',
                    onClick: clearFilters,
                  }
                : {
                    label: '+ Add Income',
                    onClick: () => {
                      setSelectedIncome(null);
                      setIsEditModalOpen(true);
                    },
                  }
            }
          />
        )}

        {/* Income List */}
        {!isLoading && !error && incomes.length > 0 && (
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

            {/* Income Rows */}
            <div className="space-y-0.5 px-3 py-2">
              <AnimatePresence>
                {incomes.map((income, index) => (
                  <TransactionRow
                    key={income.id}
                    expense={income}
                    index={index}
                    showActions={true}
                    isIncome={true}
                    onEdit={(id) => {
                      const inc = incomes.find((i) => i.id === id);
                      if (inc) {
                        setSelectedIncome(inc);
                        setIsEditModalOpen(true);
                      }
                    }}
                    onDelete={(id) => {
                      const inc = incomes.find((i) => i.id === id);
                      if (inc) {
                        setIncomeToDelete(inc);
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
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                        onClick={() => handlePageChange(page)}
                        className="min-w-[28px] px-2.5 py-1 rounded-lg font-medium transition-all"
                        style={{
                          fontSize: '11px',
                          background:
                            page === currentPage
                              ? 'linear-gradient(135deg, #34D399 0%, #10B981 100%)'
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
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
          setSelectedIncome(null);
          setIsEditModalOpen(true);
        }}
        className="sm:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center shadow-2xl"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(52, 211, 153, 0.4)',
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
          MODALS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <IncomeModal
        isOpen={isEditModalOpen}
        income={selectedIncome || undefined}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedIncome(null);
        }}
        onSuccess={fetchIncomes}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        expense={incomeToDelete as any}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIncomeToDelete(null);
        }}
        onConfirm={handleDelete}
        isIncome={true}
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

export default IncomePage;

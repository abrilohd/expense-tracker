/**
 * Custom hooks for expense store - simplifies component usage
 */
import { useEffect } from 'react';
import { useExpenseStore } from '../store/expenseStore';

/**
 * Hook for dashboard data with auto-fetch
 * Automatically fetches dashboard if null
 */
export const useDashboardData = () => {
  const dashboard = useExpenseStore((state) => state.dashboard);
  const isLoading = useExpenseStore((state) => state.isLoadingDashboard);
  const error = useExpenseStore((state) => state.dashboardError);
  const fetchDashboard = useExpenseStore((state) => state.fetchDashboard);

  // Auto-fetch if dashboard is null
  useEffect(() => {
    if (dashboard === null) {
      fetchDashboard();
    }
  }, [dashboard, fetchDashboard]);

  return {
    data: dashboard,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
};

/**
 * Hook for expense list with filters and pagination
 * Automatically fetches when filters or page changes
 */
export const useExpenseList = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const total = useExpenseStore((state) => state.total);
  const isLoading = useExpenseStore((state) => state.isLoadingExpenses);
  const error = useExpenseStore((state) => state.expensesError);
  const filters = useExpenseStore((state) => state.filters);
  const currentPage = useExpenseStore((state) => state.currentPage);
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const setFilters = useExpenseStore((state) => state.setFilters);
  const setPage = useExpenseStore((state) => state.setPage);
  const resetFilters = useExpenseStore((state) => state.resetFilters);

  // Auto-fetch when filters or page changes
  useEffect(() => {
    fetchExpenses();
  }, [filters, currentPage, fetchExpenses]);

  return {
    expenses,
    total,
    isLoading,
    error,
    filters,
    currentPage,
    setFilters,
    setPage,
    resetFilters,
    refetch: fetchExpenses,
  };
};

/**
 * Hook for AI insights with auto-fetch
 * Automatically fetches when days parameter changes
 */
export const useInsightsData = (days: number = 30) => {
  const insights = useExpenseStore((state) => state.insights);
  const isLoading = useExpenseStore((state) => state.isLoadingInsights);
  const error = useExpenseStore((state) => state.insightsError);
  const fetchInsights = useExpenseStore((state) => state.fetchInsights);

  // Auto-fetch when days changes
  useEffect(() => {
    fetchInsights(days);
  }, [days, fetchInsights]);

  return {
    data: insights,
    isLoading,
    error,
    refetch: () => fetchInsights(days),
  };
};

/**
 * Hook for expense mutations (add, edit, delete)
 * Returns mutation functions and loading states
 */
export const useExpenseMutations = () => {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const editExpense = useExpenseStore((state) => state.editExpense);
  const removeExpense = useExpenseStore((state) => state.removeExpense);
  const isSaving = useExpenseStore((state) => state.isSaving);
  const isDeleting = useExpenseStore((state) => state.isDeleting);

  return {
    addExpense,
    editExpense,
    removeExpense,
    isSaving,
    isDeleting,
  };
};

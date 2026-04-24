/**
 * Zustand store for expense state management with optimistic updates
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import toast from 'react-hot-toast';
import * as api from '../api/expenses';
import { PAGE_SIZE } from '../utils/constants';
import type {
  Expense,
  ExpenseCreate,
  ExpenseUpdate,
  FilterParams,
  DashboardData,
  InsightsResponse,
} from '../types';

interface ExpenseState {
  // Expense list
  expenses: Expense[];
  total: number;
  isLoadingExpenses: boolean;
  expensesError: string | null;

  // Dashboard
  dashboard: DashboardData | null;
  isLoadingDashboard: boolean;
  dashboardError: string | null;

  // Insights
  insights: InsightsResponse | null;
  isLoadingInsights: boolean;
  insightsError: string | null;

  // Filters + pagination
  filters: FilterParams;
  currentPage: number;

  // Mutation states
  isSaving: boolean;
  isDeleting: boolean;

  // Actions
  fetchExpenses: (params?: FilterParams) => Promise<void>;
  fetchDashboard: () => Promise<void>;
  fetchInsights: (days?: number) => Promise<void>;
  addExpense: (data: ExpenseCreate) => Promise<void>;
  editExpense: (id: number, data: ExpenseUpdate) => Promise<void>;
  removeExpense: (id: number) => Promise<void>;
  setFilters: (newFilters: Partial<FilterParams>) => void;
  setPage: (page: number) => void;
  clearDashboard: () => void;
  resetFilters: () => void;
}

export const useExpenseStore = create<ExpenseState>()(
  immer((set, get) => ({
    // Initial state
    expenses: [],
    total: 0,
    isLoadingExpenses: false,
    expensesError: null,

    dashboard: null,
    isLoadingDashboard: false,
    dashboardError: null,

    insights: null,
    isLoadingInsights: false,
    insightsError: null,

    filters: {},
    currentPage: 1,

    isSaving: false,
    isDeleting: false,

    // Fetch expenses with filters and pagination
    fetchExpenses: async (params?: FilterParams) => {
      set((state) => {
        state.isLoadingExpenses = true;
        state.expensesError = null;
      });

      try {
        const { filters, currentPage } = get();

        // Merge filters with params and add pagination
        const response = await api.getExpenses({
          ...filters,
          ...params,
          skip: (currentPage - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        });

        set((state) => {
          state.expenses = response.items;
          state.total = response.total;
          state.isLoadingExpenses = false;
        });
      } catch (error) {
        set((state) => {
          state.expensesError = error instanceof Error ? error.message : 'Failed to load expenses';
          state.isLoadingExpenses = false;
        });
      }
    },

    // Fetch dashboard analytics
    fetchDashboard: async () => {
      set((state) => {
        state.isLoadingDashboard = true;
        state.dashboardError = null;
      });

      try {
        const dashboard = await api.getDashboard();

        set((state) => {
          state.dashboard = dashboard;
          state.isLoadingDashboard = false;
        });
      } catch (error) {
        set((state) => {
          state.dashboardError = error instanceof Error ? error.message : 'Failed to load dashboard';
          state.isLoadingDashboard = false;
        });
      }
    },

    // Fetch AI insights
    fetchInsights: async (days: number = 30) => {
      set((state) => {
        state.isLoadingInsights = true;
        state.insightsError = null;
      });

      try {
        const insights = await api.getInsights(days);

        set((state) => {
          state.insights = insights;
          state.isLoadingInsights = false;
        });
      } catch (error) {
        set((state) => {
          state.insightsError = error instanceof Error ? error.message : 'Failed to load insights';
          state.isLoadingInsights = false;
        });
      }
    },

    // Add expense with optimistic update
    addExpense: async (data: ExpenseCreate) => {
      set((state) => {
        state.isSaving = true;
      });

      // Create temp expense for optimistic update
      const tempExpense: Expense = {
        id: -1,
        title: data.title,
        amount: data.amount,
        category: data.category,
        date: data.date,
        description: data.description,
        user_id: 0, // Will be set by server
      };

      // Optimistically add to list
      set((state) => {
        state.expenses.unshift(tempExpense);
      });

      try {
        const newExpense = await api.createExpense(data);

        // Replace temp with real expense
        set((state) => {
          const index = state.expenses.findIndex((e) => e.id === -1);
          if (index !== -1) {
            state.expenses[index] = newExpense;
          }
          state.total += 1;
          state.dashboard = null; // Invalidate dashboard
          state.isSaving = false;
        });

        toast.success('Expense added!');
      } catch (error) {
        // Remove temp expense on error
        set((state) => {
          state.expenses = state.expenses.filter((e) => e.id !== -1);
          state.isSaving = false;
        });

        toast.error(error instanceof Error ? error.message : 'Failed to add expense');
        throw error;
      }
    },

    // Edit expense with optimistic update
    editExpense: async (id: number, data: ExpenseUpdate) => {
      set((state) => {
        state.isSaving = true;
      });

      // Save original for rollback
      const originalExpense = get().expenses.find((e) => e.id === id);
      if (!originalExpense) {
        set((state) => {
          state.isSaving = false;
        });
        toast.error('Expense not found');
        return;
      }

      // Optimistically update
      set((state) => {
        const index = state.expenses.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.expenses[index] = { ...state.expenses[index], ...data };
        }
      });

      try {
        const updatedExpense = await api.updateExpense(id, data);

        // Replace with server response
        set((state) => {
          const index = state.expenses.findIndex((e) => e.id === id);
          if (index !== -1) {
            state.expenses[index] = updatedExpense;
          }
          state.dashboard = null; // Invalidate dashboard
          state.isSaving = false;
        });

        toast.success('Expense updated!');
      } catch (error) {
        // Rollback on error
        set((state) => {
          const index = state.expenses.findIndex((e) => e.id === id);
          if (index !== -1) {
            state.expenses[index] = originalExpense;
          }
          state.isSaving = false;
        });

        toast.error(error instanceof Error ? error.message : 'Failed to update expense');
        throw error;
      }
    },

    // Remove expense with optimistic update
    removeExpense: async (id: number) => {
      set((state) => {
        state.isDeleting = true;
      });

      // Save for rollback
      const removedExpense = get().expenses.find((e) => e.id === id);
      const removedIndex = get().expenses.findIndex((e) => e.id === id);
      const originalTotal = get().total;

      if (!removedExpense) {
        set((state) => {
          state.isDeleting = false;
        });
        toast.error('Expense not found');
        return;
      }

      // Optimistically remove
      set((state) => {
        state.expenses = state.expenses.filter((e) => e.id !== id);
        state.total -= 1;
      });

      try {
        await api.deleteExpense(id);

        // Success - invalidate dashboard
        set((state) => {
          state.dashboard = null;
          state.isDeleting = false;
        });

        toast.success('Expense deleted!');
      } catch (error) {
        // Rollback on error
        set((state) => {
          state.expenses.splice(removedIndex, 0, removedExpense);
          state.total = originalTotal;
          state.isDeleting = false;
        });

        toast.error(error instanceof Error ? error.message : 'Failed to delete expense');
        throw error;
      }
    },

    // Update filters (does not auto-fetch)
    setFilters: (newFilters: Partial<FilterParams>) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
        state.currentPage = 1; // Reset to first page
      });
    },

    // Update current page (does not auto-fetch)
    setPage: (page: number) => {
      set((state) => {
        state.currentPage = page;
      });
    },

    // Clear dashboard to force re-fetch
    clearDashboard: () => {
      set((state) => {
        state.dashboard = null;
      });
    },

    // Reset filters to default
    resetFilters: () => {
      set((state) => {
        state.filters = {};
        state.currentPage = 1;
      });
    },
  }))
);

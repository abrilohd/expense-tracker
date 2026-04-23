/**
 * Zustand store for expense state management with optimistic updates
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import toast from 'react-hot-toast';
import * as api from '../api/expenses';
import type {
  Expense,
  ExpenseCreate,
  ExpenseUpdate,
  FilterParams,
  DashboardData,
  InsightsResponse,
} from '../types';

interface ExpenseState {
  // State
  expenses: Expense[];
  total: number;
  isLoading: boolean;
  error: string | null;
  filters: FilterParams;
  dashboard: DashboardData | null;
  insights: InsightsResponse | null;

  // Actions
  fetchExpenses: (params?: FilterParams) => Promise<void>;
  fetchDashboard: () => Promise<void>;
  fetchInsights: (days?: number) => Promise<void>;
  addExpense: (data: ExpenseCreate) => Promise<void>;
  updateExpense: (id: number, data: ExpenseUpdate) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  setFilters: (filters: Partial<FilterParams>) => void;
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  expenses: [],
  total: 0,
  isLoading: false,
  error: null,
  filters: {},
  dashboard: null,
  insights: null,
};

export const useExpenseStore = create<ExpenseState>()(
  immer((set, get) => ({
    // Initial state
    ...initialState,

    // Fetch expenses with optional filters
    fetchExpenses: async (params?: FilterParams) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Merge with current filters if params provided
        const finalParams = params || get().filters;
        const response = await api.getExpenses(finalParams);

        set((state) => {
          state.expenses = response.items;
          state.total = response.total;
          state.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch expenses';
        set((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
        toast.error(errorMessage);
      }
    },

    // Fetch dashboard data
    fetchDashboard: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const dashboardData = await api.getDashboard();

        set((state) => {
          state.dashboard = dashboardData;
          state.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard';
        set((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
        toast.error(errorMessage);
      }
    },

    // Fetch AI insights
    fetchInsights: async (days: number = 30) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const insightsData = await api.getInsights(days);

        set((state) => {
          state.insights = insightsData;
          state.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch insights';
        set((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
        toast.error(errorMessage);
      }
    },

    // Add expense with optimistic update
    addExpense: async (data: ExpenseCreate) => {
      // Create temporary expense for optimistic update
      const tempExpense: Expense = {
        id: Date.now(), // Temporary ID
        ...data,
        user_id: 0, // Will be set by backend
      };

      // Optimistic update
      set((state) => {
        state.expenses.unshift(tempExpense);
        state.total += 1;
      });

      try {
        // API call
        const newExpense = await api.createExpense(data);

        // Replace temp expense with real one
        set((state) => {
          const index = state.expenses.findIndex((e) => e.id === tempExpense.id);
          if (index !== -1) {
            state.expenses[index] = newExpense;
          }
        });

        toast.success('Expense added successfully');

        // Refresh dashboard if loaded
        if (get().dashboard) {
          get().fetchDashboard();
        }
      } catch (error) {
        // Revert optimistic update
        set((state) => {
          state.expenses = state.expenses.filter((e) => e.id !== tempExpense.id);
          state.total -= 1;
        });

        const errorMessage = error instanceof Error ? error.message : 'Failed to add expense';
        set((state) => {
          state.error = errorMessage;
        });
        toast.error(errorMessage);
        throw error;
      }
    },

    // Update expense with optimistic update
    updateExpense: async (id: number, data: ExpenseUpdate) => {
      // Store original expense for rollback
      const originalExpense = get().expenses.find((e) => e.id === id);
      if (!originalExpense) {
        toast.error('Expense not found');
        return;
      }

      // Optimistic update
      set((state) => {
        const index = state.expenses.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.expenses[index] = { ...state.expenses[index], ...data };
        }
      });

      try {
        // API call
        const updatedExpense = await api.updateExpense(id, data);

        // Update with real data from server
        set((state) => {
          const index = state.expenses.findIndex((e) => e.id === id);
          if (index !== -1) {
            state.expenses[index] = updatedExpense;
          }
        });

        toast.success('Expense updated successfully');

        // Refresh dashboard if loaded
        if (get().dashboard) {
          get().fetchDashboard();
        }
      } catch (error) {
        // Revert optimistic update
        set((state) => {
          const index = state.expenses.findIndex((e) => e.id === id);
          if (index !== -1) {
            state.expenses[index] = originalExpense;
          }
        });

        const errorMessage = error instanceof Error ? error.message : 'Failed to update expense';
        set((state) => {
          state.error = errorMessage;
        });
        toast.error(errorMessage);
        throw error;
      }
    },

    // Delete expense with optimistic update
    deleteExpense: async (id: number) => {
      // Store original expense for rollback
      const originalExpense = get().expenses.find((e) => e.id === id);
      if (!originalExpense) {
        toast.error('Expense not found');
        return;
      }

      const originalIndex = get().expenses.findIndex((e) => e.id === id);

      // Optimistic delete
      set((state) => {
        state.expenses = state.expenses.filter((e) => e.id !== id);
        state.total -= 1;
      });

      try {
        // API call
        await api.deleteExpense(id);

        toast.success('Expense deleted successfully');

        // Refresh dashboard if loaded
        if (get().dashboard) {
          get().fetchDashboard();
        }
      } catch (error) {
        // Revert optimistic delete - restore at original position
        set((state) => {
          state.expenses.splice(originalIndex, 0, originalExpense);
          state.total += 1;
        });

        const errorMessage = error instanceof Error ? error.message : 'Failed to delete expense';
        set((state) => {
          state.error = errorMessage;
        });
        toast.error(errorMessage);
        throw error;
      }
    },

    // Update filters and trigger re-fetch
    setFilters: (newFilters: Partial<FilterParams>) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
      });

      // Trigger re-fetch with new filters
      get().fetchExpenses();
    },

    // Clear error message
    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    // Reset store to initial state (useful for logout)
    reset: () => {
      set(initialState);
    },
  }))
);

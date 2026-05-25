/**
 * Budget store - Zustand state management for budgets
 * Handles budget CRUD operations with optimistic updates
 */
import { create } from 'zustand';
import toast from 'react-hot-toast';
import type {
  Budget,
  BudgetCreate,
  BudgetUpdate,
  BudgetStatusResponse,
  BudgetAlert,
} from '../types';
import * as budgetApi from '../api/budgets';

interface BudgetStore {
  // State
  budgets: Budget[];
  budgetStatuses: BudgetStatusResponse[];
  alerts: BudgetAlert[];
  isLoading: boolean;
  error: string | null;
  totalBudgets: number;
  activeBudgets: number;
  warningCount: number;
  exceededCount: number;

  // Actions
  fetchBudgets: (activeOnly?: boolean, budgetType?: string) => Promise<void>;
  fetchBudgetStatus: (activeOnly?: boolean) => Promise<void>;
  fetchAlerts: () => Promise<void>;
  createBudget: (budget: BudgetCreate) => Promise<void>;
  updateBudget: (budgetId: number, budget: BudgetUpdate) => Promise<void>;
  deleteBudget: (budgetId: number) => Promise<void>;
  clearError: () => void;
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  // Initial state
  budgets: [],
  budgetStatuses: [],
  alerts: [],
  isLoading: false,
  error: null,
  totalBudgets: 0,
  activeBudgets: 0,
  warningCount: 0,
  exceededCount: 0,

  // Fetch all budgets
  fetchBudgets: async (activeOnly = false, budgetType?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await budgetApi.getBudgets(activeOnly, budgetType);
      set({
        budgets: response.items,
        totalBudgets: response.total,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch budgets';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  // Fetch budget status with utilization
  fetchBudgetStatus: async (activeOnly = true) => {
    set({ isLoading: true, error: null });
    try {
      const response = await budgetApi.getBudgetStatus(activeOnly);
      set({
        budgetStatuses: response.budgets,
        totalBudgets: response.total_budgets,
        activeBudgets: response.active_budgets,
        warningCount: response.warning_count,
        exceededCount: response.exceeded_count,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch budget status';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  // Fetch budget alerts
  fetchAlerts: async () => {
    try {
      const alerts = await budgetApi.getBudgetAlerts();
      set({ alerts });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch budget alerts';
      console.error('Failed to fetch alerts:', errorMessage);
    }
  },

  // Create a new budget
  createBudget: async (budget: BudgetCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newBudget = await budgetApi.createBudget(budget);
      
      // Optimistic update
      set((state) => ({
        budgets: [newBudget, ...state.budgets],
        totalBudgets: state.totalBudgets + 1,
        isLoading: false,
      }));

      toast.success('Budget created successfully');
      
      // Refresh budget status to get utilization
      get().fetchBudgetStatus();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create budget';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Update an existing budget
  updateBudget: async (budgetId: number, budget: BudgetUpdate) => {
    set({ isLoading: true, error: null });
    
    // Store original state for rollback
    const originalBudgets = get().budgets;
    
    // Optimistic update
    set((state) => ({
      budgets: state.budgets.map((b) =>
        b.id === budgetId ? { ...b, ...budget } : b
      ),
    }));

    try {
      const updatedBudget = await budgetApi.updateBudget(budgetId, budget);
      
      // Update with server response
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === budgetId ? updatedBudget : b
        ),
        isLoading: false,
      }));

      toast.success('Budget updated successfully');
      
      // Refresh budget status
      get().fetchBudgetStatus();
    } catch (error: any) {
      // Rollback on error
      set({ budgets: originalBudgets, isLoading: false });
      
      const errorMessage = error.response?.data?.message || 'Failed to update budget';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Delete a budget
  deleteBudget: async (budgetId: number) => {
    set({ isLoading: true, error: null });
    
    // Store original state for rollback
    const originalBudgets = get().budgets;
    const originalTotal = get().totalBudgets;
    
    // Optimistic update
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== budgetId),
      totalBudgets: state.totalBudgets - 1,
    }));

    try {
      await budgetApi.deleteBudget(budgetId);
      set({ isLoading: false });
      toast.success('Budget deleted successfully');
      
      // Refresh budget status
      get().fetchBudgetStatus();
    } catch (error: any) {
      // Rollback on error
      set({
        budgets: originalBudgets,
        totalBudgets: originalTotal,
        isLoading: false,
      });
      
      const errorMessage = error.response?.data?.message || 'Failed to delete budget';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Clear error state
  clearError: () => set({ error: null }),
}));

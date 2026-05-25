/**
 * Recurring Transactions store - Zustand state management
 */
import { create } from 'zustand';
import type { RecurringTransaction, RecurringTransactionCreate, RecurringTransactionUpdate } from '../types';
import * as recurringAPI from '../api/recurring';

interface RecurringStore {
  recurring: RecurringTransaction[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;

  // Actions
  fetchRecurring: (filters?: { transaction_type?: 'expense' | 'income'; is_active?: boolean }) => Promise<void>;
  createRecurring: (data: RecurringTransactionCreate) => Promise<RecurringTransaction>;
  updateRecurring: (id: number, data: RecurringTransactionUpdate) => Promise<RecurringTransaction>;
  deleteRecurring: (id: number) => Promise<void>;
  toggleRecurring: (id: number) => Promise<void>;
  generateNow: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useRecurringStore = create<RecurringStore>((set, get) => ({
  recurring: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  activeCount: 0,
  inactiveCount: 0,

  fetchRecurring: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await recurringAPI.getRecurringTransactions(filters);
      set({
        recurring: response.items,
        totalCount: response.total,
        activeCount: response.active_count,
        inactiveCount: response.inactive_count,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch recurring transactions',
        isLoading: false,
      });
    }
  },

  createRecurring: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newRecurring = await recurringAPI.createRecurringTransaction(data);
      
      // Optimistic update
      set((state) => ({
        recurring: [newRecurring, ...state.recurring],
        totalCount: state.totalCount + 1,
        activeCount: newRecurring.is_active ? state.activeCount + 1 : state.activeCount,
        isLoading: false,
      }));
      
      return newRecurring;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create recurring transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  updateRecurring: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await recurringAPI.updateRecurringTransaction(id, data);
      
      // Optimistic update
      set((state) => ({
        recurring: state.recurring.map((r) => (r.id === id ? updated : r)),
        isLoading: false,
      }));
      
      return updated;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update recurring transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteRecurring: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await recurringAPI.deleteRecurringTransaction(id);
      
      // Optimistic update
      set((state) => {
        const deleted = state.recurring.find((r) => r.id === id);
        return {
          recurring: state.recurring.filter((r) => r.id !== id),
          totalCount: state.totalCount - 1,
          activeCount: deleted?.is_active ? state.activeCount - 1 : state.activeCount,
          inactiveCount: !deleted?.is_active ? state.inactiveCount - 1 : state.inactiveCount,
          isLoading: false,
        };
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete recurring transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleRecurring: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await recurringAPI.toggleRecurringTransaction(id);
      
      // Optimistic update
      set((state) => ({
        recurring: state.recurring.map((r) => (r.id === id ? updated : r)),
        activeCount: updated.is_active ? state.activeCount + 1 : state.activeCount - 1,
        inactiveCount: !updated.is_active ? state.inactiveCount + 1 : state.inactiveCount - 1,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to toggle recurring transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  generateNow: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await recurringAPI.generateTransactionNow(id);
      
      // Refresh the list to get updated next_occurrence
      await get().fetchRecurring();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to generate transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

/**
 * Zustand store for income state management with optimistic updates
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import toast from 'react-hot-toast';
import * as api from '../api/income';
import { PAGE_SIZE } from '../utils/constants';
import type {
  Income,
  IncomeCreate,
  IncomeUpdate,
  IncomeFilterParams,
} from '../types';

interface IncomeState {
  // Income list
  incomes: Income[];
  total: number;
  isLoadingIncomes: boolean;
  incomesError: string | null;

  // Filters + pagination
  filters: IncomeFilterParams;
  currentPage: number;

  // Mutation states
  isSaving: boolean;
  isDeleting: boolean;

  // Actions
  fetchIncomes: (params?: IncomeFilterParams) => Promise<void>;
  addIncome: (data: IncomeCreate) => Promise<void>;
  editIncome: (id: number, data: IncomeUpdate) => Promise<void>;
  removeIncome: (id: number) => Promise<void>;
  setFilters: (newFilters: Partial<IncomeFilterParams>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useIncomeStore = create<IncomeState>()(
  immer((set, get) => ({
    // Initial state
    incomes: [],
    total: 0,
    isLoadingIncomes: false,
    incomesError: null,

    filters: {},
    currentPage: 1,

    isSaving: false,
    isDeleting: false,

    // Fetch incomes with filters and pagination
    fetchIncomes: async (params?: IncomeFilterParams) => {
      set((state) => {
        state.isLoadingIncomes = true;
        state.incomesError = null;
      });

      try {
        const { filters, currentPage } = get();

        // Merge filters with params and add pagination
        const response = await api.getIncome({
          ...filters,
          ...params,
          skip: (currentPage - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        });

        set((state) => {
          state.incomes = response.items;
          state.total = response.total;
          state.isLoadingIncomes = false;
        });
      } catch (error) {
        set((state) => {
          state.incomesError = error instanceof Error ? error.message : 'Failed to load income';
          state.isLoadingIncomes = false;
        });
      }
    },

    // Add income with optimistic update
    addIncome: async (data: IncomeCreate) => {
      set((state) => {
        state.isSaving = true;
      });

      // Create temp income for optimistic update
      const tempIncome: Income = {
        id: -1,
        amount: data.amount,
        source: data.source,
        date: data.date,
        description: data.description,
        user_id: 0, // Will be set by server
        created_at: new Date().toISOString(),
      };

      // Optimistically add to list
      set((state) => {
        state.incomes.unshift(tempIncome);
      });

      try {
        const newIncome = await api.createIncome(data);

        // Replace temp with real income
        set((state) => {
          const index = state.incomes.findIndex((i) => i.id === -1);
          if (index !== -1) {
            state.incomes[index] = newIncome;
          }
          state.total += 1;
          state.isSaving = false;
        });

        toast.success('Income added!');
      } catch (error) {
        // Remove temp income on error
        set((state) => {
          state.incomes = state.incomes.filter((i) => i.id !== -1);
          state.isSaving = false;
        });

        toast.error(error instanceof Error ? error.message : 'Failed to add income');
        throw error;
      }
    },

    // Edit income with optimistic update
    editIncome: async (id: number, data: IncomeUpdate) => {
      set((state) => {
        state.isSaving = true;
      });

      // Save original for rollback
      const originalIncome = get().incomes.find((i) => i.id === id);
      if (!originalIncome) {
        set((state) => {
          state.isSaving = false;
        });
        toast.error('Income not found');
        return;
      }

      // Optimistically update
      set((state) => {
        const index = state.incomes.findIndex((i) => i.id === id);
        if (index !== -1) {
          state.incomes[index] = { ...state.incomes[index], ...data };
        }
      });

      try {
        const updatedIncome = await api.updateIncome(id, data);

        // Replace with server response
        set((state) => {
          const index = state.incomes.findIndex((i) => i.id === id);
          if (index !== -1) {
            state.incomes[index] = updatedIncome;
          }
          state.isSaving = false;
        });

        toast.success('Income updated!');
      } catch (error) {
        // Rollback on error
        set((state) => {
          const index = state.incomes.findIndex((i) => i.id === id);
          if (index !== -1) {
            state.incomes[index] = originalIncome;
          }
          state.isSaving = false;
        });

        toast.error(error instanceof Error ? error.message : 'Failed to update income');
        throw error;
      }
    },

    // Remove income with optimistic update
    removeIncome: async (id: number) => {
      set((state) => {
        state.isDeleting = true;
      });

      // Save for rollback
      const removedIncome = get().incomes.find((i) => i.id === id);
      const removedIndex = get().incomes.findIndex((i) => i.id === id);
      const originalTotal = get().total;

      if (!removedIncome) {
        set((state) => {
          state.isDeleting = false;
        });
        toast.error('Income not found');
        return;
      }

      // Optimistically remove
      set((state) => {
        state.incomes = state.incomes.filter((i) => i.id !== id);
        state.total -= 1;
      });

      try {
        await api.deleteIncome(id);

        // Success
        set((state) => {
          state.isDeleting = false;
        });

        toast.success('Income deleted!');
      } catch (error) {
        // Rollback on error
        set((state) => {
          state.incomes.splice(removedIndex, 0, removedIncome);
          state.total = originalTotal;
          state.isDeleting = false;
        });

        toast.error(error instanceof Error ? error.message : 'Failed to delete income');
        throw error;
      }
    },

    // Update filters (does not auto-fetch)
    setFilters: (newFilters: Partial<IncomeFilterParams>) => {
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

    // Reset filters to default
    resetFilters: () => {
      set((state) => {
        state.filters = {};
        state.currentPage = 1;
      });
    },
  }))
);

/**
 * Savings Goals Store - Zustand state management
 * Handles savings goals data, loading states, and CRUD operations
 */
import { create } from 'zustand';
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from '../api/savings.api';
import type {
  SavingsGoal,
  SavingsGoalCreate,
  SavingsGoalUpdate,
  SavingsGoalStatus,
} from '../types';
import { useExpenseStore } from './expenseStore';

interface SavingsStore {
  // State
  goals: SavingsGoal[];
  total: number;
  activeCount: number;
  completedCount: number;
  totalTarget: number;
  totalSaved: number;
  isLoadingGoals: boolean;
  goalsError: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  statusFilter: SavingsGoalStatus | undefined;

  // Actions
  fetchGoals: () => Promise<void>;
  addGoal: (goal: SavingsGoalCreate) => Promise<void>;
  modifyGoal: (goalId: number, goal: SavingsGoalUpdate) => Promise<void>;
  removeGoal: (goalId: number) => Promise<void>;
  setStatusFilter: (status: SavingsGoalStatus | undefined) => void;
  resetStore: () => void;
}

const initialState = {
  goals: [],
  total: 0,
  activeCount: 0,
  completedCount: 0,
  totalTarget: 0,
  totalSaved: 0,
  isLoadingGoals: false,
  goalsError: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  statusFilter: undefined,
};

export const useSavingsStore = create<SavingsStore>((set, get) => ({
  ...initialState,

  // Fetch all savings goals
  fetchGoals: async () => {
    set({ isLoadingGoals: true, goalsError: null });
    try {
      const response = await getSavingsGoals(get().statusFilter);
      set({
        goals: response.items,
        total: response.total,
        activeCount: response.active_count,
        completedCount: response.completed_count,
        totalTarget: response.total_target,
        totalSaved: response.total_saved,
        isLoadingGoals: false,
      });
    } catch (error: any) {
      set({
        goalsError: error.response?.data?.message || 'Failed to fetch savings goals',
        isLoadingGoals: false,
      });
    }
  },

  // Create new savings goal
  addGoal: async (goal: SavingsGoalCreate) => {
    set({ isCreating: true, goalsError: null });
    try {
      const newGoal = await createSavingsGoal(goal);
      
      // Optimistic update - add to list
      set((state) => ({
        goals: [newGoal, ...state.goals],
        total: state.total + 1,
        activeCount: state.activeCount + 1,
        totalTarget: state.totalTarget + newGoal.target_amount,
        isCreating: false,
      }));
      
      // Auto-refresh dashboard data after successful mutation
      useExpenseStore.getState().fetchDashboard();
    } catch (error: any) {
      set({
        goalsError: error.response?.data?.message || 'Failed to create savings goal',
        isCreating: false,
      });
      throw error;
    }
  },

  // Update existing savings goal
  modifyGoal: async (goalId: number, goalUpdate: SavingsGoalUpdate) => {
    set({ isUpdating: true, goalsError: null });
    try {
      const updatedGoal = await updateSavingsGoal(goalId, goalUpdate);
      
      // Optimistic update - replace in list
      set((state) => {
        const oldGoal = state.goals.find((g) => g.id === goalId);
        const goals = state.goals.map((g) => (g.id === goalId ? updatedGoal : g));
        
        // Recalculate summary if status changed
        let activeCount = state.activeCount;
        let completedCount = state.completedCount;
        let totalTarget = state.totalTarget;
        let totalSaved = state.totalSaved;
        
        if (oldGoal) {
          // Remove old goal from counts
          if (oldGoal.status === 'active') {
            activeCount--;
            totalTarget -= oldGoal.target_amount;
            totalSaved -= oldGoal.current_amount;
          } else if (oldGoal.status === 'completed') {
            completedCount--;
          }
          
          // Add new goal to counts
          if (updatedGoal.status === 'active') {
            activeCount++;
            totalTarget += updatedGoal.target_amount;
            totalSaved += updatedGoal.current_amount;
          } else if (updatedGoal.status === 'completed') {
            completedCount++;
          }
        }
        
        return {
          goals,
          activeCount,
          completedCount,
          totalTarget,
          totalSaved,
          isUpdating: false,
        };
      });
      
      // Auto-refresh dashboard data after successful mutation
      useExpenseStore.getState().fetchDashboard();
    } catch (error: any) {
      set({
        goalsError: error.response?.data?.message || 'Failed to update savings goal',
        isUpdating: false,
      });
      throw error;
    }
  },

  // Delete savings goal
  removeGoal: async (goalId: number) => {
    set({ isDeleting: true, goalsError: null });
    try {
      await deleteSavingsGoal(goalId);
      
      // Optimistic update - remove from list
      set((state) => {
        const goalToDelete = state.goals.find((g) => g.id === goalId);
        const goals = state.goals.filter((g) => g.id !== goalId);
        
        let activeCount = state.activeCount;
        let completedCount = state.completedCount;
        let totalTarget = state.totalTarget;
        let totalSaved = state.totalSaved;
        
        if (goalToDelete) {
          if (goalToDelete.status === 'active') {
            activeCount--;
            totalTarget -= goalToDelete.target_amount;
            totalSaved -= goalToDelete.current_amount;
          } else if (goalToDelete.status === 'completed') {
            completedCount--;
          }
        }
        
        return {
          goals,
          total: state.total - 1,
          activeCount,
          completedCount,
          totalTarget,
          totalSaved,
          isDeleting: false,
        };
      });
      
      // Auto-refresh dashboard data after successful mutation
      useExpenseStore.getState().fetchDashboard();
    } catch (error: any) {
      set({
        goalsError: error.response?.data?.message || 'Failed to delete savings goal',
        isDeleting: false,
      });
      throw error;
    }
  },

  // Set status filter
  setStatusFilter: (status: SavingsGoalStatus | undefined) => {
    set({ statusFilter: status });
    // Automatically refetch with new filter
    get().fetchGoals();
  },

  // Reset store to initial state
  resetStore: () => {
    set(initialState);
  },
}));

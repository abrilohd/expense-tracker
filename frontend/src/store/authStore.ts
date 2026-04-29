/**
 * Zustand store for authentication state management
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import * as api from '../api/expenses';
import { TOKEN_KEY } from '../utils/constants';
import type { User } from '../types';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean; // False until loadUser() completes
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    // Initial state
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,
    error: null,

    // Login action
    login: async (email: string, password: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Call login API
        const tokens = await api.login(email, password);

        // Store token in localStorage
        localStorage.setItem(TOKEN_KEY, tokens.access_token);

        // Get user profile
        const user = await api.getMe();

        // Update state
        set((state) => {
          state.token = tokens.access_token;
          state.user = user;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Login failed';
          state.isLoading = false;
        });
        throw error;
      }
    },

    // Register action
    register: async (email: string, password: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Call register API
        await api.register(email, password);

        // Auto-login after successful registration
        await useAuthStore.getState().login(email, password);
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Registration failed';
          state.isLoading = false;
        });
        throw error;
      }
    },

    // Logout action
    logout: () => {
      // Remove token from localStorage
      localStorage.removeItem(TOKEN_KEY);

      // Clear state
      set((state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });

      // Redirect to landing page
      window.location.href = 'https://expense-tracker-landing-k4qsr35ie-abrsh067-7150s-projects.vercel.app';
    },

    // Load user on app start
    loadUser: async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      // No token found
      if (!token) {
        set((state) => {
          state.isInitialized = true;
        });
        return;
      }

      // Token exists, try to load user
      set((state) => {
        state.token = token;
      });

      try {
        const user = await api.getMe();

        set((state) => {
          state.user = user;
          state.isInitialized = true;
        });
      } catch (error) {
        // Token expired or invalid, logout
        set((state) => {
          state.isInitialized = true;
        });
        useAuthStore.getState().logout();
      }
    },

    // Clear error message
    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);

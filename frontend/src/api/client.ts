/**
 * Axios client with authentication and error handling
 */
import axios from 'axios';
import toast from 'react-hot-toast';
import { TOKEN_KEY } from '../utils/constants';
import { API_URL } from '../config/constants';
import type { ApiError } from '../types';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log(' API Client Configuration:', {
    baseURL: API_URL,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  });
}

// Toast deduplication - prevent showing same error multiple times
const recentToasts = new Map<string, number>();
const TOAST_COOLDOWN = 3000; // 3 seconds

function showToastOnce(message: string, type: 'error' | 'success' = 'error', options?: any) {
  const now = Date.now();
  const lastShown = recentToasts.get(message);
  
  // Only show if not shown recently
  if (!lastShown || now - lastShown > TOAST_COOLDOWN) {
    recentToasts.set(message, now);
    if (type === 'error') {
      toast.error(message, options);
    } else {
      toast.success(message, options);
    }
    
    // Clean up old entries
    setTimeout(() => recentToasts.delete(message), TOAST_COOLDOWN);
  }
}

// Request interceptor: Attach JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Network error: Server is down or unreachable
    if (!error.response) {
      const isNetworkError = error.message === 'Network Error' || error.code === 'ERR_NETWORK';
      if (isNetworkError) {
        console.error('❌ Backend Connection Error:', {
          message: error.message,
          code: error.code,
          apiUrl: API_URL,
          timestamp: new Date().toISOString(),
        });
        showToastOnce('Unable to connect to server. Please check your connection.', 'error', {
          duration: 5000,
          icon: '🔌',
        });
        return Promise.reject(new Error('Unable to connect to server'));
      }
      
      // Timeout error
      if (error.code === 'ECONNABORTED') {
        console.error('⏱️ Request Timeout:', {
          apiUrl: API_URL,
          timestamp: new Date().toISOString(),
        });
        showToastOnce('Request timed out. Please try again.', 'error', {
          duration: 4000,
        });
        return Promise.reject(new Error('Request timed out'));
      }
    }

    // Handle 401 Unauthorized: Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      showToastOnce('Session expired. Please login again.', 'error', {
        duration: 3000,
      });
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired'));
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      showToastOnce('Access denied. You do not have permission.', 'error', {
        duration: 4000,
      });
      return Promise.reject(new Error('Access denied'));
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      showToastOnce('Resource not found.', 'error', {
        duration: 3000,
      });
      return Promise.reject(new Error('Resource not found'));
    }

    // Handle 422 Validation Error - Extract field-specific errors
    if (error.response?.status === 422) {
      const apiError = error.response.data as ApiError;
      
      // Check if we have detailed validation errors
      if (apiError.details && Array.isArray(apiError.details)) {
        // FastAPI validation error format
        const validationErrors = apiError.details.map((err: any) => {
          const field = err.loc ? err.loc[err.loc.length - 1] : 'field';
          return `${field}: ${err.msg}`;
        }).join(', ');
        
        return Promise.reject(new Error(validationErrors));
      }
      
      // Single validation message
      const message = apiError.message || 'Validation failed. Please check your input.';
      return Promise.reject(new Error(message));
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      showToastOnce('Server error. Please try again later.', 'error', {
        duration: 4000,
      });
      return Promise.reject(new Error('Server error'));
    }

    // Extract error message from backend format
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      const detailsMessage = typeof apiError.details === 'string' ? apiError.details : '';
      const message = apiError.message || detailsMessage || 'An error occurred';
      
      // Don't show toast for validation errors (422) - let components handle them
      if (error.response.status !== 422) {
        showToastOnce(message, 'error', {
          duration: 4000,
        });
      }
      
      return Promise.reject(new Error(message));
    }

    // Generic error fallback
    const message = error.message || 'An unexpected error occurred';
    showToastOnce(message, 'error', {
      duration: 4000,
    });
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

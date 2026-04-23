/**
 * Axios client with authentication and error handling
 */
import axios from 'axios';
import toast from 'react-hot-toast';
import { TOKEN_KEY } from '../utils/constants';
import type { ApiError } from '../types';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
        toast.error('Backend server is offline. Please try again later.', {
          duration: 5000,
          icon: '🔌',
        });
        return Promise.reject(new Error('Backend server is offline'));
      }
      
      // Timeout error
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please check your connection.', {
          duration: 4000,
        });
        return Promise.reject(new Error('Request timed out'));
      }
    }

    // Handle 401 Unauthorized: Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      toast.error('Session expired. Please login again.', {
        duration: 3000,
      });
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.', {
        duration: 4000,
      });
      return Promise.reject(new Error('Permission denied'));
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      toast.error('Resource not found.', {
        duration: 3000,
      });
      return Promise.reject(new Error('Resource not found'));
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      toast.error('Server error occurred. Please try again later.', {
        duration: 4000,
      });
      return Promise.reject(new Error('Server error'));
    }

    // Extract error message from backend format
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      const message = apiError.message || 'An error occurred';
      
      // Don't show toast for validation errors (422) - let components handle them
      if (error.response.status !== 422) {
        toast.error(message, {
          duration: 4000,
        });
      }
      
      return Promise.reject(new Error(message));
    }

    // Generic error fallback
    const message = error.message || 'An unexpected error occurred';
    toast.error(message, {
      duration: 4000,
    });
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

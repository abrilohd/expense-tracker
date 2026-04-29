/**
 * Centralized API configuration
 * Single source of truth for API base URL
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://expense-tracker-production-419e.up.railway.app';

export default API_BASE_URL;

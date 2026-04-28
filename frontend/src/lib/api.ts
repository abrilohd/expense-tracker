/**
 * Centralized API configuration
 * Single source of truth for API base URL
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_BASE_URL;

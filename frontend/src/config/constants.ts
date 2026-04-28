/**
 * Frontend Configuration Constants
 * Environment-based URLs for local and production
 */

// App URL (React Frontend)
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

// API URL (Backend)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Landing Page URL
export const LANDING_URL = import.meta.env.VITE_LANDING_URL || 'http://localhost:8080';

// Environment detection
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;

// Log configuration (development only)
if (IS_DEVELOPMENT) {
  console.log('Frontend Config:', {
    appUrl: APP_URL,
    apiUrl: API_URL,
    landingUrl: LANDING_URL,
    environment: IS_DEVELOPMENT ? 'development' : 'production'
  });
}

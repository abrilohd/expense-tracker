/**
 * Frontend Configuration Constants
 * Environment-based URLs for local and production
 */
import API_BASE_URL from '../lib/api';

// App URL (React Frontend)
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://expense-tracker-app-tau-rust.vercel.app';

// API URL (Backend) - imported from centralized config
export const API_URL = API_BASE_URL;

// Landing Page URL
export const LANDING_URL = import.meta.env.VITE_LANDING_URL || 'https://expense-tracker-landing-k4qsr35ie-abrsh067-7150s-projects.vercel.app';

// Environment detection
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;

/**
 * Landing Page Configuration
 * Handles environment-based URLs for local and production
 */

const CONFIG = {
  // Detect environment
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  // App URLs (React Frontend)
  // Can be overridden by setting window.ENV_APP_URL before this script loads
  get APP_URL() {
    if (window.ENV_APP_URL) {
      return window.ENV_APP_URL;
    }
    return this.isDevelopment 
      ? 'http://localhost:5173' 
      : (window.location.origin.includes('vercel.app') 
          ? 'https://expense-tracker-app.vercel.app'  // Update with your actual Vercel URL
          : 'https://app.yourapp.com');
  },
  
  // API URLs (Backend)
  // Can be overridden by setting window.ENV_API_URL before this script loads
  get API_URL() {
    if (window.ENV_API_URL) {
      return window.ENV_API_URL;
    }
    return this.isDevelopment 
      ? 'http://localhost:8000' 
      : 'https://expense-tracker-api.up.railway.app';  // Update with your actual Railway URL
  },
  
  // Route helpers
  routes: {
    login() {
      return `${CONFIG.APP_URL}/login`;
    },
    signup() {
      return `${CONFIG.APP_URL}/register`;
    },
    dashboard() {
      return `${CONFIG.APP_URL}/dashboard`;
    }
  }
};

// Make available globally
window.APP_CONFIG = CONFIG;

// Log current environment (for debugging)
console.log('Landing Page Config:', {
  environment: CONFIG.isDevelopment ? 'development' : 'production',
  appUrl: CONFIG.APP_URL,
  apiUrl: CONFIG.API_URL
});

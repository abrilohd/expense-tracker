/**
 * Landing Page Configuration
 * Handles environment-based URLs for local and production
 */

const CONFIG = {
  // Detect environment
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  // App URLs (React Frontend)
  get APP_URL() {
    return this.isDevelopment 
      ? 'http://localhost:5173' 
      : 'https://app.yourapp.com';
  },
  
  // API URLs (Backend)
  get API_URL() {
    return this.isDevelopment 
      ? 'http://localhost:8000' 
      : 'https://api.yourapp.com';
  },
  
  // Route helpers
  routes: {
    login() {
      return `${CONFIG.APP_URL}/login`;
    },
    signup() {
      return `${CONFIG.APP_URL}/signup`;
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

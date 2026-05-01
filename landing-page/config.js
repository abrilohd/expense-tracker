/**
 * Landing Page Configuration v3.0.0
 * PRODUCTION-FIRST: Hardcoded URLs with localhost fallback only
 * Last Updated: 2026-05-01
 */

const CONFIG = {
  // Version identifier
  VERSION: '3.0.0',
  
  // Detect environment
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  // PRODUCTION APP URL - HARDCODED (never changes)
  PRODUCTION_APP_URL: 'https://expense-tracker-app-tau-rust.vercel.app',
  PRODUCTION_API_URL: 'https://expense-tracker-production-419e.up.railway.app',
  
  // App URLs (React Frontend)
  get APP_URL() {
    // Priority 1: Use hardcoded production URL set in index.html
    if (window.PRODUCTION_APP_URL) {
      return window.PRODUCTION_APP_URL;
    }
    
    // Priority 2: Use this config's hardcoded production URL
    if (!this.isDevelopment) {
      return this.PRODUCTION_APP_URL;
    }
    
    // Priority 3: Localhost only for development
    return 'http://localhost:5173';
  },
  
  // API URLs (Backend)
  get API_URL() {
    if (window.PRODUCTION_API_URL) {
      return window.PRODUCTION_API_URL;
    }
    
    return this.isDevelopment 
      ? 'http://localhost:8000' 
      : this.PRODUCTION_API_URL;
  },
  
  // Route helpers - Always use APP_URL
  routes: {
    login() {
      return `${CONFIG.APP_URL}/login`;
    },
    register() {
      return `${CONFIG.APP_URL}/register`;
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

// Enhanced logging for debugging
console.log('🚀 Landing Page Config v3.0.0 loaded');
console.log('📍 Environment:', CONFIG.isDevelopment ? 'development' : 'production');
console.log('🔗 APP_URL:', CONFIG.APP_URL);
console.log('🔗 API_URL:', CONFIG.API_URL);
console.log('✅ Routes:', {
  login: CONFIG.routes.login(),
  register: CONFIG.routes.register(),
  dashboard: CONFIG.routes.dashboard()
});

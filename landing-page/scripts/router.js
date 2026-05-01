/**
 * Landing Page Router v3.1.0 - PROFESSIONAL & BULLETPROOF
 * 100% Clean redirect with comprehensive error handling
 * Last Updated: 2026-05-01
 */

// ============================================================================
// CONFIGURATION - SINGLE SOURCE OF TRUTH
// ============================================================================
const CONFIG = {
  APP_URL: 'https://expense-tracker-app-tau-rust.vercel.app',
  VERSION: '3.1.0',
  DEBUG: true, // Set to false to disable console logs in production
};

// Lock the APP_URL (prevent any overrides)
Object.freeze(CONFIG);

// Override any external configs that might have wrong URLs
if (window.ExpenseTrackerConfig) {
  window.ExpenseTrackerConfig.appUrl = CONFIG.APP_URL;
}
if (window.APP_CONFIG) {
  window.APP_CONFIG.PRODUCTION_APP_URL = CONFIG.APP_URL;
}

// ============================================================================
// LOGGING UTILITY
// ============================================================================
const log = {
  info: (...args) => CONFIG.DEBUG && console.log('ℹ️', ...args),
  success: (...args) => CONFIG.DEBUG && console.log('✅', ...args),
  error: (...args) => console.error('❌', ...args),
  warn: (...args) => CONFIG.DEBUG && console.warn('⚠️', ...args),
  cta: (...args) => CONFIG.DEBUG && console.log('🎯', ...args),
};

// ============================================================================
// ROUTE BUILDERS
// ============================================================================
const Routes = {
  register: () => `${CONFIG.APP_URL}/register`,
  login: () => `${CONFIG.APP_URL}/login`,
  dashboard: () => `${CONFIG.APP_URL}/dashboard`,
};

// ============================================================================
// AUTHENTICATION CHECK
// ============================================================================
function isAuthenticated() {
  try {
    // Check multiple possible token storage keys
    const tokenKeys = ['auth_token', 'token', 'user', 'accessToken'];
    
    for (const key of tokenKeys) {
      const value = localStorage.getItem(key);
      if (value && value !== 'null' && value !== 'undefined') {
        log.info(`Found auth token in localStorage.${key}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    log.error('Error checking authentication:', error);
    return false;
  }
}

// ============================================================================
// DESTINATION RESOLVER
// ============================================================================
function getDestination() {
  const authenticated = isAuthenticated();
  const destination = authenticated ? Routes.dashboard() : Routes.register();
  
  log.info('Destination resolved:', {
    authenticated,
    destination,
  });
  
  return destination;
}

// ============================================================================
// REDIRECT HANDLER
// ============================================================================
function redirect(url) {
  try {
    log.cta('Redirecting to:', url);
    
    // Validate URL before redirect
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid redirect URL');
    }
    
    // Ensure URL starts with https:// or http://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://');
    }
    
    // Perform redirect
    window.location.href = url;
    
  } catch (error) {
    log.error('Redirect failed:', error);
    // Fallback to register page
    window.location.href = Routes.register();
  }
}

// ============================================================================
// CTA CLICK HANDLER
// ============================================================================
function handleCTAClick(event) {
  // Prevent default link behavior
  event.preventDefault();
  event.stopPropagation();
  
  log.cta('CTA button clicked');
  
  // Get destination
  const destination = getDestination();
  
  // Log details
  log.info('Click details:', {
    button: event.target.className || event.target.id || 'unknown',
    authenticated: isAuthenticated(),
    destination,
  });
  
  // Redirect
  redirect(destination);
}

// ============================================================================
// BUTTON INITIALIZATION
// ============================================================================
function initializeCTAButtons() {
  // Comprehensive list of CTA button selectors
  const selectors = [
    '[data-cta]',           // Primary selector
    '.btn-cta',             // Class-based
    '.cta-button',          // Class-based
    '.cta__button',         // BEM notation
    '.hero-btn',            // Hero section
    '.cta-btn',             // Alternative
    '.nav__cta',            // Navigation
    '#hero-cta',            // ID-based
    '#footer-cta',          // ID-based
    'a[href="#get-started"]', // Anchor-based
  ];
  
  // Find all CTA buttons
  const buttons = document.querySelectorAll(selectors.join(', '));
  
  log.info(`Found ${buttons.length} CTA buttons`);
  
  // Attach click handlers
  let successCount = 0;
  buttons.forEach((button, index) => {
    try {
      // Remove any existing href to prevent default navigation
      if (button.tagName === 'A') {
        button.href = 'javascript:void(0)';
      }
      
      // Add click handler
      button.addEventListener('click', handleCTAClick, { passive: false });
      
      // Add visual feedback class
      button.style.cursor = 'pointer';
      
      successCount++;
      log.success(`Button ${index + 1} initialized:`, button.className || button.id || 'unnamed');
      
    } catch (error) {
      log.error(`Failed to initialize button ${index + 1}:`, error);
    }
  });
  
  log.success(`Successfully initialized ${successCount}/${buttons.length} CTA buttons`);
  
  return successCount;
}

// ============================================================================
// NAVIGATION LINKS
// ============================================================================
function initializeNavLinks() {
  try {
    // Find dashboard/app links in navigation
    const navLinks = document.querySelectorAll('[href*="dashboard"], .nav-dashboard, [href*="app"]');
    
    navLinks.forEach(link => {
      const destination = isAuthenticated() ? Routes.dashboard() : Routes.login();
      link.href = destination;
      log.info('Nav link configured:', link.textContent?.trim(), '→', destination);
    });
    
  } catch (error) {
    log.error('Failed to initialize nav links:', error);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================
function initialize() {
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log.info(`🚀 Landing Page Router v${CONFIG.VERSION} LOADING...`);
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Log configuration
  log.info('Configuration:', {
    APP_URL: CONFIG.APP_URL,
    VERSION: CONFIG.VERSION,
    DEBUG: CONFIG.DEBUG,
  });
  
  // Log routes
  log.info('Routes:', {
    register: Routes.register(),
    login: Routes.login(),
    dashboard: Routes.dashboard(),
  });
  
  // Check authentication
  const authenticated = isAuthenticated();
  log.info('Authentication status:', authenticated ? 'Authenticated' : 'Not authenticated');
  
  // Initialize CTA buttons
  const buttonCount = initializeCTAButtons();
  
  // Initialize navigation links
  initializeNavLinks();
  
  // Final status
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log.success(`✅ Router v${CONFIG.VERSION} initialized successfully!`);
  log.success(`✅ ${buttonCount} CTA buttons ready`);
  log.success(`✅ Destination: ${getDestination()}`);
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// ============================================================================
// AUTO-INITIALIZE ON DOM READY
// ============================================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  // DOM already loaded
  initialize();
}

// ============================================================================
// EXPOSE PUBLIC API (for debugging)
// ============================================================================
window.LandingPageRouter = {
  version: CONFIG.VERSION,
  config: CONFIG,
  routes: Routes,
  isAuthenticated,
  getDestination,
  redirect,
  reinitialize: initialize,
};

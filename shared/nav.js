/**
 * Shared Navigation Component
 * Used across landing page and expense tracker app
 */

class SharedNav {
  constructor() {
    this.init();
  }

  init() {
    // Create navigation element
    const nav = document.createElement('nav');
    nav.className = 'shared-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');
    
    // Get URLs from config if available
    const appUrl = window.APP_CONFIG ? window.APP_CONFIG.APP_URL : 'http://localhost:5173';
    
    nav.innerHTML = `
      <div class="shared-nav__container">
        <a href="/" class="shared-nav__logo">ExpenseTracker</a>
        
        <div class="shared-nav__links">
          <a href="/#features" class="shared-nav__link">Features</a>
          <a href="${appUrl}/dashboard" class="shared-nav__link">Dashboard</a>
          <a href="/#stats" class="shared-nav__link">Testimonials</a>
          <a href="${appUrl}/login" class="shared-nav__cta">Get Started</a>
        </div>
      </div>
    `;
    
    return nav;
  }

  /**
   * Mount navigation to a container
   * @param {string|HTMLElement} container - Container selector or element
   */
  mount(container) {
    const target = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (target) {
      const nav = this.init();
      target.appendChild(nav);
    }
  }

  /**
   * Get current page context
   * @returns {string} - 'landing' or 'app'
   */
  static getContext() {
    return window.location.port === '5173' ? 'app' : 'landing';
  }

  /**
   * Navigate to a route
   * @param {string} path - Route path
   */
  static navigate(path) {
    window.location.href = path;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SharedNav;
}

// Global usage
if (typeof window !== 'undefined') {
  window.SharedNav = SharedNav;
}

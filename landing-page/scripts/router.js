(function() {
  'use strict';
  
  // Detect environment and set appropriate URLs
  var isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('192.168.');
  
  var APP_URL = isLocalhost 
    ? 'http://localhost:5173'
    : (window.PRODUCTION_APP_URL || 'https://expense-tracker-app-tau-rust.vercel.app');
  
  console.log('    Router v5.1.0 initialized');
  console.log('   Environment:', isLocalhost ? 'LOCALHOST' : 'PRODUCTION');
  console.log('   APP_URL:', APP_URL);
  
  // Update config if available
  if (window.ExpenseTrackerConfig) {
    window.ExpenseTrackerConfig.appUrl = APP_URL;
  }
  
  /**
   * Check if user is logged in by checking for token
   */
  function isLoggedIn() {
    // Check multiple possible token storage keys
    var token = localStorage.getItem('expense_token') ||
                localStorage.getItem('auth_token') ||
                localStorage.getItem('token') ||
                localStorage.getItem('user');
    
    return !!token;
  }
  
  /**
   * Get destination URL based on login status
   */
  function getDestination() {
    if (isLoggedIn()) {
      return APP_URL + '/dashboard';
    } else {
      return APP_URL + '/register';
    }
  }
  
  /**
   * Handle CTA button clicks
   */
  function handleCTA(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var destination = getDestination();
    console.log('    CTA clicked. Redirecting to:', destination);
    
    // Redirect to destination
    window.location.href = destination;
  }
  
  /**
   * Initialize router - attach event listeners to all CTA buttons
   */
  function init() {
    console.log(' Initializing CTA buttons...');
    
    // Select all possible CTA buttons
    var buttons = document.querySelectorAll(
      '[data-cta], ' +
      '.btn--primary, ' +
      '.btn-cta, ' +
      '.cta__button, ' +
      '.hero__cta, ' +
      '.nav__cta, ' +
      '#hero-cta, ' +
      '#footer-cta, ' +
      '.footer__link[data-cta], ' +
      'a[href="#get-started"], ' +
      'a[href="#register"], ' +
      'a[href="#"]'
    );
    
    console.log('   Found', buttons.length, 'CTA buttons');
    
    // Remove old event listeners by cloning and replacing nodes
    buttons.forEach(function(btn) {
      // Skip if it's a navigation link (not a CTA)
      var href = btn.getAttribute('href');
      if (href && href.startsWith('/#') && href !== '/#') {
        console.log('   Skipping navigation link:', href);
        return;
      }
      
      // Clone node to remove all event listeners
      var freshBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(freshBtn, btn);
      
      // Add new event listener
      freshBtn.addEventListener('click', handleCTA);
      console.log('   ✓ Attached listener to:', freshBtn.textContent.trim().substring(0, 30));
    });
    
    console.log('    Router initialization complete');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Re-initialize after a short delay to catch dynamically added buttons
  setTimeout(init, 500);
  
})();

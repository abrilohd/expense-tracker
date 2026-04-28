/**
 * Landing page router - handles CTA clicks and navigation to expense tracker app
 */

// Auth key used by the expense tracker app (from frontend/src/utils/constants.ts)
const AUTH_KEY = 'expense_token';

/**
 * Determines where to route the user based on authentication state
 * @returns {string} The destination URL
 */
function getAuthDestination() {
  // Check for auth token in localStorage
  const token = localStorage.getItem(AUTH_KEY);
  
  // Fallback: also check for 'user' key (alternative auth storage)
  const user = localStorage.getItem('user');
  
  if (token || user) {
    // User is authenticated, go to dashboard
    return window.APP_CONFIG.routes.dashboard();
  }
  
  // User is not authenticated, go to signup (better for landing page CTAs)
  return window.APP_CONFIG.routes.signup();
}

/**
 * Handles CTA button clicks
 * @param {Event} e - Click event
 */
function handleCTAClick(e) {
  e.preventDefault();
  const destination = getAuthDestination();
  console.log('CTA clicked, routing to:', destination);
  window.location.href = destination;
}

/**
 * Updates the nav Dashboard link based on auth state
 */
function updateNavDashboardLink() {
  const token = localStorage.getItem(AUTH_KEY);
  const user = localStorage.getItem('user');
  const dashboardLink = document.querySelector('[data-nav-dashboard]');
  
  if (dashboardLink) {
    if (token || user) {
      dashboardLink.href = window.APP_CONFIG.routes.dashboard();
      dashboardLink.textContent = 'Dashboard';
    } else {
      dashboardLink.href = window.APP_CONFIG.routes.login();
      dashboardLink.textContent = 'Login';
    }
  }
}

/**
 * Initialize router on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  // Select all CTA buttons using multiple selectors
  const ctaButtons = document.querySelectorAll(
    '[data-cta], .btn-cta, #hero-cta, #footer-cta, [href="#get-started"]'
  );
  
  // Attach click handlers to all CTA buttons
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', handleCTAClick);
  });
  
  // Update nav Dashboard link based on auth state
  updateNavDashboardLink();
  
  console.log(`Router initialized: ${ctaButtons.length} CTA buttons found`);
  console.log('App URL:', window.APP_CONFIG.APP_URL);
});

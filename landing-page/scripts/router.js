/**
 * Landing Page Router v3.0.0 - PRODUCTION-FIRST
 * Bulletproof routing with hardcoded fallbacks
 * Last Updated: 2026-05-01
 */

// CRITICAL: Get APP_URL with multiple fallback layers
function getAppUrl() {
  // Priority 1: Hardcoded in index.html
  if (window.PRODUCTION_APP_URL) {
    return window.PRODUCTION_APP_URL;
  }
  
  // Priority 2: From config.js
  if (window.APP_CONFIG && window.APP_CONFIG.APP_URL) {
    return window.APP_CONFIG.APP_URL;
  }
  
  // Priority 3: Hardcoded fallback (NEVER FAILS)
  return 'https://expense-tracker-app-tau-rust.vercel.app';
}

const APP_URL = getAppUrl();

// Route builder functions
function getRegisterUrl() {
  return `${APP_URL}/register`;
}

function getDashboardUrl() {
  return `${APP_URL}/dashboard`;
}

function getLoginUrl() {
  return `${APP_URL}/login`;
}

// Check if user is authenticated
function isAuthenticated() {
  return !!(
    localStorage.getItem('auth_token') ||
    localStorage.getItem('user') ||
    localStorage.getItem('token')
  );
}

// Get destination based on auth state
function getAuthDestination() {
  return isAuthenticated() ? getDashboardUrl() : getRegisterUrl();
}

// Handle CTA button clicks
function handleCTAClick(e) {
  e.preventDefault();
  const destination = getAuthDestination();
  
  console.log('🎯 CTA clicked');
  console.log('📍 Redirecting to:', destination);
  console.log('🔐 Authenticated:', isAuthenticated());
  
  // Force navigation
  window.location.href = destination;
}

// Initialize router on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Landing Page Router v3.0.0 LOADED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📍 APP_URL:', APP_URL);
  console.log('🔗 Register URL:', getRegisterUrl());
  console.log('🔗 Dashboard URL:', getDashboardUrl());
  console.log('🔗 Login URL:', getLoginUrl());
  console.log('🔐 User authenticated:', isAuthenticated());
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Find all CTA buttons with comprehensive selectors
  const ctaSelectors = [
    '[data-cta]',
    '.btn-cta',
    '.cta-button',
    '.cta__button',
    '.hero-btn',
    '.cta-btn',
    '.nav__cta',
    '#hero-cta',
    '#footer-cta',
    '[href="#get-started"]'
  ].join(', ');
  
  const ctaButtons = document.querySelectorAll(ctaSelectors);
  console.log('🔘 Found CTA buttons:', ctaButtons.length);
  
  // Attach click handlers to all CTA buttons
  ctaButtons.forEach((btn, index) => {
    btn.addEventListener('click', handleCTAClick);
    console.log(`  ✓ Button ${index + 1}: ${btn.className || btn.id || 'unnamed'}`);
  });
  
  // Handle navigation dashboard link
  const navDashboard = document.querySelector('[href*="dashboard"], .nav-dashboard, [href*="app"]');
  if (navDashboard) {
    navDashboard.href = isAuthenticated() ? getDashboardUrl() : getLoginUrl();
    console.log('✓ Nav dashboard link configured');
  }
  
  console.log('✅ Router initialization complete');
});

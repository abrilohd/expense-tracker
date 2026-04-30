/**
 * Landing Page Router - Handles CTA button redirects
 * Version: 2.0.0 - Updated for production deployment
 * Last Updated: 2026-04-30
 */

const APP_URL = 'https://expense-tracker-app-tau-rust.vercel.app'

function getAuthDestination() {
  const token = localStorage.getItem('auth_token')
    || localStorage.getItem('user')
    || localStorage.getItem('token')
  
  return token
    ? APP_URL + '/dashboard'
    : APP_URL + '/register'
}

function handleCTAClick(e) {
  e.preventDefault()
  window.location.href = getAuthDestination()
}

document.addEventListener('DOMContentLoaded', () => {
  // Log for debugging
  console.log('Landing Page Router loaded - APP_URL:', APP_URL)
  
  const ctaButtons = document.querySelectorAll('[data-cta], .btn-cta, #hero-cta, #footer-cta, .cta-button, [href="#get-started"], .hero-btn, .cta-btn')
  console.log('Found CTA buttons:', ctaButtons.length)
  
  ctaButtons.forEach(btn => btn.addEventListener('click', handleCTAClick))
  
  const navDashboard = document.querySelector('[href*="dashboard"], .nav-dashboard, [href*="app"]')
  if (navDashboard) {
    const token = localStorage.getItem('auth_token')
      || localStorage.getItem('user')
      || localStorage.getItem('token')
    
    navDashboard.href = token
      ? APP_URL + '/dashboard'
      : APP_URL + '/login'
  }
})

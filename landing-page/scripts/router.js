const APP_URL = 'https://expense-tracker-app-tau-rust.vercel.app'

function getAuthDestination() {
  const token = localStorage.getItem('auth_token')
    || localStorage.getItem('user')
    || localStorage.getItem('token')
  
  return token ? APP_URL + '/dashboard' : APP_URL + '/auth/signup'
}

function handleCTAClick(e) {
  e.preventDefault()
  window.location.href = getAuthDestination()
}

document.addEventListener('DOMContentLoaded', () => {
  const ctaButtons = document.querySelectorAll('[data-cta], .btn-cta, #hero-cta, #footer-cta, .cta-button, [href="#get-started"]')
  ctaButtons.forEach(btn => btn.addEventListener('click', handleCTAClick))
  
  const navDashboard = document.querySelector('[href*="dashboard"], .nav-dashboard')
  if (navDashboard) {
    const token = localStorage.getItem('auth_token')
      || localStorage.getItem('user')
      || localStorage.getItem('token')
    
    navDashboard.href = token
      ? APP_URL + '/dashboard'
      : APP_URL + '/auth/login'
  }
})

(function() {
  'use strict';
  
  var APP_URL = 'https://expense-tracker-app-tau-rust.vercel.app';
  
  if (window.ExpenseTrackerConfig) {
    window.ExpenseTrackerConfig.appUrl = APP_URL;
  }
  
  function getToken() {
    return localStorage.getItem('expense_token') ||
           localStorage.getItem('auth_token') ||
           localStorage.getItem('token') ||
           localStorage.getItem('user') ||
           null;
  }
  
  function getDestination() {
    var token = getToken();
    return token ? APP_URL + '/dashboard' : APP_URL + '/register';
  }
  
  function handleCTA(e) {
    e.preventDefault();
    e.stopPropagation();
    var dest = getDestination();
    console.log('CTA clicked. Going to:', dest);
    window.location.href = dest;
  }
  
  function init() {
    console.log('Router v4. APP_URL =', APP_URL);
    
    var buttons = document.querySelectorAll(
      '[data-cta], .btn--primary, .btn-cta, .cta__button, ' +
      '.hero__cta, .nav__cta, #hero-cta, #footer-cta, ' +
      '.footer__link, [href="#get-started"], [href="#register"]'
    );
    
    console.log('CTA buttons found:', buttons.length);
    
    buttons.forEach(function(btn) {
      var fresh = btn.cloneNode(true);
      btn.parentNode.replaceChild(fresh, btn);
      fresh.addEventListener('click', handleCTA);
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

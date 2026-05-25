// Detect environment
var isLocalhost = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('192.168.');

window.ExpenseTrackerConfig = {
  appUrl: isLocalhost 
    ? 'http://localhost:5173'
    : 'https://expense-tracker-app-tau-rust.vercel.app',
  apiUrl: isLocalhost
    ? 'http://localhost:8000'
    : 'https://expense-tracker-production-419e.up.railway.app',
  environment: isLocalhost ? 'development' : 'production'
};

console.log('Config loaded. Environment:', window.ExpenseTrackerConfig.environment);
console.log('Config loaded. appUrl =', window.ExpenseTrackerConfig.appUrl);
console.log('Config loaded. apiUrl =', window.ExpenseTrackerConfig.apiUrl);

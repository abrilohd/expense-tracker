/**
 * Application entry point
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

// Render React application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    
    {/* Toast notifications */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  </React.StrictMode>
);

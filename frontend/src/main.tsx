/**
 * Application entry point
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import './lib/chartSetup'; // Register Chart.js components once

// Render React application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    
    {/* Toast notifications */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1A1D26',
          color: '#F9FAFB',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#34D399',
            secondary: '#1A1D26',
          },
        },
        error: {
          iconTheme: {
            primary: '#F87171',
            secondary: '#1A1D26',
          },
        },
      }}
    />
  </React.StrictMode>
);

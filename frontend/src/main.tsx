/**
 * Main entry point for the EchoNote React application
 * 
 * This file initializes the React application with:
 * - React 18's new createRoot API for better performance
 * - BrowserRouter for client-side routing
 * - Global toast notifications with react-hot-toast
 * - Strict mode for development warnings
 * - Global CSS styles
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

// Create React root using the new React 18 API
// This provides better performance and concurrent features
const root = ReactDOM.createRoot(document.getElementById('root')!)

// Render the application with all necessary providers
root.render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing for SPA behavior */}
    <BrowserRouter>
      {/* Main application component */}
      <App />
      
      {/* Global toast notification system */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000, // Show toasts for 4 seconds
          style: {
            background: 'var(--background)', // Use CSS custom properties for theming
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)

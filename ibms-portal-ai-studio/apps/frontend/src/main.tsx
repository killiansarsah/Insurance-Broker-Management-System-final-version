/**
 * IBMS Portal - Application Entry Point
 * 
 * @fileoverview This file initializes and renders the React application into the DOM.
 * It sets up the root component, global toast notifications, and React StrictMode.
 * 
 * @description
 * Configures the application with:
 * - React 18 createRoot API for concurrent rendering
 * - React StrictMode for development warnings
 * - Global toast notification system (react-toastify)
 * - Custom toast styling from toast.css
 * 
 * @remarks
 * - Toast notifications are limited to 3 simultaneous messages
 * - Toasts auto-close after 3 seconds
 * - High z-index (9999) ensures toasts appear above all other UI elements
 * 
 * @author IBMS Ghana Development Team
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css';
import './styles/patterns.css';


/**
 * Initialize React root and render the application
 * 
 * @description
 * Creates the React root element and renders the App component with:
 * - StrictMode for highlighting potential problems
 * - ToastContainer for global notification system
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer 
      aria-label="Toast Container"
      position="top-right" 
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      limit={3}
      transition={Bounce}
      style={{ zIndex: 9999 }}
    />
  </React.StrictMode>
);

// Remove preloader
const loader = document.getElementById('global-loader');
if (loader) {
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    setTimeout(() => {
      loader.remove();
    }, 500); // Wait for transition to finish
  }, 800); // Show for at least 800ms to avoid flicker
}

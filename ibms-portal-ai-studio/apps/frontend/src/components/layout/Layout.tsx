
/**
 * IBMS Portal - Main Layout Component
 * 
 * @fileoverview Main layout wrapper that combines the Sidebar and Header components
 * to create the consistent application shell for all pages.
 * 
 * @description
 * The Layout component provides:
 * - Responsive layout structure (sidebar + header + main content)
 * - Mobile sidebar drawer management
 * - Consistent page structure across all routes
 * - Dark mode support with smooth transitions
 * - Centered content area with max-width constraint
 * - Smooth scrolling and fade-in animations
 * 
 * @remarks
 * - Uses flexbox for responsive layout
 * - Sidebar is fixed on desktop, drawer on mobile
 * - Content area has max-width of 1400px for optimal readability
 * - Handles overflow and scrolling for long content
 * - All pages in the app are wrapped with this component
 * 
 * @author IBMS Ghana Development Team
 */

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Props for the Layout component
 */
interface LayoutProps {
  /** Page content to render in the main area */
  children: React.ReactNode;
  /** Page title to display in the header */
  title: string;
}

/**
 * Main Layout Component
 * 
 * @description
 * Wraps all authenticated pages with consistent layout structure:
 * - Sidebar navigation (collapsible on mobile)
 * - Header with page title and user controls
 * - Main content area with responsive padding
 * - Smooth animations and transitions
 * 
 * @param {LayoutProps} props - Component props
 * @returns {JSX.Element} The complete page layout
 * 
 * @example
 * <Layout title="Dashboard Overview">
 *   <Dashboard />
 * </Layout>
 */
const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-200">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

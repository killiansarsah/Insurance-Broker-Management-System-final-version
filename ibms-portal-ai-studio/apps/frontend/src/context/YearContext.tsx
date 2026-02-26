
/**
 * IBMS Portal - Fiscal Year Context
 * 
 * @fileoverview React context provider for managing fiscal year selection across the application.
 * Enables consistent year-based data filtering throughout all pages and components.
 * 
 * @description
 * The YearContext provides:
 * - Global fiscal year state management
 * - Year selection functionality
 * - List of available fiscal years
 * - Custom hook for easy context consumption
 * 
 * @remarks
 * - Default year is set to 2023
 * - Available years range from 2020 to 2025
 * - Used extensively in Dashboard, Reports, and financial pages
 * - Affects data filtering for policies, claims, commissions, etc.
 * - Year selection persists during the session but not in localStorage
 * 
 * @important
 * This context is crucial for Ghana NIC compliance reporting which requires
 * fiscal year-based data segregation and analysis.
 * 
 * @author IBMS Ghana Development Team
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Type definition for the Year Context
 */
interface YearContextType {
  /** Currently selected fiscal year */
  selectedYear: number;
  /** Function to update the selected fiscal year */
  setSelectedYear: (year: number) => void;
  /** Array of available fiscal years for selection */
  availableYears: number[];
}

/** Year Context instance */
const YearContext = createContext<YearContextType | undefined>(undefined);

/**
 * Year Provider Component
 * 
 * @description
 * Wraps the application to provide fiscal year context to all child components.
 * Manages the selected year state and provides methods to update it.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} The provider component
 * 
 * @example
 * <YearProvider>
 *   <App />
 * </YearProvider>
 */
export const YearProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const availableYears = [2025, 2024, 2023, 2022, 2021, 2020];
  const [selectedYear, setSelectedYear] = useState(2023);

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, availableYears }}>
      {children}
    </YearContext.Provider>
  );
};

/**
 * Custom hook to access the Year Context
 * 
 * @description
 * Provides access to the fiscal year context from any component.
 * Must be used within a YearProvider.
 * 
 * @returns {YearContextType} The year context value
 * @throws {Error} If used outside of YearProvider
 * 
 * @example
 * const { selectedYear, setSelectedYear, availableYears } = useYear();
 * 
 * // Filter data by selected year
 * const filteredPolicies = policies.filter(p => p.year === selectedYear);
 * 
 * // Update selected year
 * setSelectedYear(2024);
 */
export const useYear = () => {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return context;
};

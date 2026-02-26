/**
 * IBMS Portal - Icon Wrapper Component
 * 
 * @fileoverview Reusable icon wrapper component that provides consistent styling
 * for Material Symbols icons throughout the application.
 * 
 * @description
 * The IconWrapper component provides:
 * - Consistent icon container styling with rounded corners
 * - Color-coded variants (primary, success, warning, danger, info)
 * - Multiple size options (sm, md, lg)
 * - Dark mode support with appropriate background colors
 * - Integration with Google Material Symbols icon font
 * 
 * @remarks
 * - Uses Material Symbols Outlined icon font
 * - Background colors have 10% opacity for subtle appearance
 * - All variants support dark mode with adjusted colors
 * - Icon size is fixed at text-2xl regardless of container size
 * 
 * @author IBMS Ghana Development Team
 */

import React from 'react';

/**
 * Props for the IconWrapper component
 */
interface IconWrapperProps {
  /** Material Symbols icon name (e.g., 'dashboard', 'settings') */
  icon: string;
  /** Color variant for the icon container */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Size variant for the icon container */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Icon Wrapper Component
 * 
 * @description
 * Wraps Material Symbols icons with consistent styling and color variants.
 * Commonly used in navigation menus, buttons, and status indicators.
 * 
 * Features:
 * - Predefined color schemes for different contexts
 * - Responsive sizing options
 * - Rounded container for modern appearance
 * - Dark mode color adjustments
 * 
 * @param {IconWrapperProps} props - Component props
 * @returns {JSX.Element} The wrapped icon component
 * 
 * @example
 * // Primary variant (default)
 * <IconWrapper icon="dashboard" variant="primary" size="md" />
 * 
 * @example
 * // Success indicator
 * <IconWrapper icon="check_circle" variant="success" size="sm" />
 * 
 * @example
 * // Warning status
 * <IconWrapper icon="warning" variant="warning" size="lg" />
 */
const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-12',
    lg: 'size-16'
  };

  const variantClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    danger: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center ${variantClasses[variant]} ${className}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
  );
};

export default IconWrapper;

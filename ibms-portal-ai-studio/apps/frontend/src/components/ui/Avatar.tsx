/**
 * IBMS Portal - Avatar Component
 * 
 * @fileoverview Reusable avatar component that displays user profile pictures or initials.
 * Automatically generates colored initials when no image is provided.
 * 
 * @description
 * The Avatar component provides:
 * - Image display with fallback to initials
 * - Automatic initials generation from name
 * - Consistent color assignment based on name hash
 * - Multiple size variants (xs, sm, md, lg, xl)
 * - Dark mode support
 * 
 * @remarks
 * - Uses a hash function to assign consistent colors to names
 * - Supports 12 different color variants for visual variety
 * - Initials are generated from first and last name
 * - Falls back to '?' if no name or initials provided
 * - Border color adapts to theme (white in light, slate-800 in dark)
 * 
 * @author IBMS Ghana Development Team
 */

import React from 'react';

/**
 * Props for the Avatar component
 */
interface AvatarProps {
  /** Full name to generate initials from */
  name?: string;
  /** Custom initials to display (overrides name-based generation) */
  initials?: string;
  /** URL of the profile image (if available) */
  imageUrl?: string;
  /** Size variant of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Avatar Component
 * 
 * @description
 * Displays a user avatar with automatic fallback to colored initials.
 * Features:
 * - Image display with object-cover for proper aspect ratio
 * - Automatic initials extraction from full name
 * - Deterministic color assignment (same name = same color)
 * - Responsive sizing with predefined variants
 * - Consistent styling with border and shadow
 * 
 * @param {AvatarProps} props - Component props
 * @returns {JSX.Element} The avatar component
 * 
 * @example
 * // With image
 * <Avatar name="James Mensah" imageUrl="/path/to/image.jpg" size="md" />
 * 
 * @example
 * // With initials fallback
 * <Avatar name="James Mensah" size="sm" />
 * 
 * @example
 * // With custom initials
 * <Avatar initials="JM" size="lg" />
 */
const Avatar: React.FC<AvatarProps> = ({ 
  name = '', 
  initials, 
  imageUrl, 
  size = 'md',
  className = '' 
}) => {
  // Generate initials from name if not provided
  const getInitials = () => {
    if (initials) return initials;
    if (!name) return '?';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate color from name hash (consistent color for same name)
  const getColorFromName = (str: string): string => {
    const colors = [
      'bg-rose-500',
      'bg-pink-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-cyan-500',
      'bg-teal-500',
      'bg-emerald-500',
      'bg-green-500',
      'bg-lime-500',
      'bg-amber-500',
      'bg-orange-500',
    ];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Size mappings
  const sizeClasses = {
    xs: 'size-6 text-[10px]',
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-12 text-base',
    xl: 'size-16 text-xl'
  };

  const bgColor = getColorFromName(name || initials || '');

  if (imageUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm ${className}`}>
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-black border-2 border-white dark:border-slate-800 shadow-sm ${className}`}
    >
      {getInitials()}
    </div>
  );
};

export default Avatar;

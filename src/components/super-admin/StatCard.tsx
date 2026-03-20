'use client';

import { type LucideIcon } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/super-admin/useAnimatedCounter';
import { SkeletonLoader } from './SkeletonLoader';

/**
 * StatCard — Animated metric card with counter, trend indicator, and icon.
 * Part of the Super Admin Command Centre design system.
 *
 * Sharp 2px radii. No glassmorphism. High-contrast status strip on left border.
 */

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;        // +/- percentage change
  changeLabel?: string;   // e.g. "this month"
  icon: LucideIcon;
  iconColor?: string;
  loading?: boolean;
  onClick?: () => void;
  formatValue?: (v: number) => string;
}

export function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'var(--sa-teal-500)',
  loading = false,
  onClick,
  formatValue,
}: StatCardProps) {
  const animatedValue = useAnimatedCounter(value, 1200, !loading);
  const displayValue = formatValue
    ? formatValue(animatedValue)
    : animatedValue.toLocaleString();

  if (loading) {
    return (
      <div
        className="p-4"
        style={{
          backgroundColor: 'var(--sa-bg-card)',
          border: '1px solid var(--sa-border)',
          borderRadius: 'var(--sa-radius-sm)',
          borderLeft: '3px solid var(--sa-border)',
        }}
      >
        <SkeletonLoader variant="stat" />
      </div>
    );
  }

  const isPositive = change !== undefined && change >= 0;
  const isClickable = !!onClick;

  return (
    <div
      className={`sa-card-hover relative group overflow-hidden p-4 ${isClickable ? 'cursor-pointer' : ''}`}
      style={{
        backgroundColor: 'var(--sa-bg-card)',
        border: '1px solid var(--sa-border)',
        borderRadius: 'var(--sa-radius-md)',
        borderLeft: `3px solid ${iconColor}`,
        boxShadow: 'var(--sa-shadow-card)',
      }}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.() : undefined}
    >
      <div className="sa-card-bg-gradient" />
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header: Label + Icon */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: 'var(--sa-text-muted)', letterSpacing: '0.06em' }}
          >
            {label}
          </span>
          <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--sa-radius-sm)',
            backgroundColor: `color-mix(in srgb, ${iconColor} 12%, transparent)`,
          }}
        >
          <Icon size={16} style={{ color: iconColor }} strokeWidth={2} />
        </div>
      </div>

      {/* Value */}
      <div
        className="text-2xl font-bold tracking-tight"
        style={{
          color: 'var(--sa-text-primary)',
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {prefix}{displayValue}{suffix}
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-1.5">
          <span
            className="text-xs font-semibold"
            style={{ color: isPositive ? 'var(--sa-green)' : 'var(--sa-red)' }}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-xs" style={{ color: 'var(--sa-text-muted)' }}>
              {changeLabel}
            </span>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

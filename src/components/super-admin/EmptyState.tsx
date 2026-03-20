'use client';

import { type LucideIcon, Inbox } from 'lucide-react';

/**
 * EmptyState — Placeholder for empty data tables / sections.
 */

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className="flex items-center justify-center mb-4"
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--sa-radius-md)',
          backgroundColor: 'var(--sa-teal-50)',
        }}
      >
        <Icon size={28} style={{ color: 'var(--sa-teal-400)' }} strokeWidth={1.5} />
      </div>

      <h3
        className="text-sm font-semibold mb-1"
        style={{ color: 'var(--sa-text-primary)' }}
      >
        {title}
      </h3>

      {description && (
        <p className="text-xs max-w-xs" style={{ color: 'var(--sa-text-muted)' }}>
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 sa-btn-hover px-4 py-2 text-xs font-semibold"
          style={{
            backgroundColor: 'var(--sa-teal-500)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--sa-radius-sm)',
            cursor: 'pointer',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * SlideDrawer — Right-side slide-out panel for detail views.
 * Used for error details, email previews, user profiles, etc.
 */

interface SlideDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function SlideDrawer({
  open,
  isOpen,
  onClose,
  title,
  subtitle,
  width = 480,
  children,
  footer,
}: SlideDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const drawOpen = open ?? isOpen ?? false;

  // Close on Escape
  useEffect(() => {
    if (!drawOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [drawOpen, onClose]);

  // Trap focus
  useEffect(() => {
    if (drawOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawOpen]);

  if (!drawOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1"
        style={{ backgroundColor: 'rgba(2, 26, 19, 0.35)' }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="flex flex-col h-full"
        style={{
          width: `min(${width}px, 100vw)`,
          backgroundColor: 'var(--sa-bg-card)',
          borderLeft: '1px solid var(--sa-border)',
          boxShadow: '-8px 0 24px rgba(2, 26, 19, 0.12)',
          animation: 'sa-slide-in-right 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--sa-border)' }}
        >
          <div>
            <h2
              className="text-base font-bold"
              style={{
                color: 'var(--sa-text-primary)',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--sa-text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="hover:opacity-70"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--sa-text-muted)',
              padding: 4,
            }}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="flex-shrink-0 px-5 py-3"
            style={{ borderTop: '1px solid var(--sa-border)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

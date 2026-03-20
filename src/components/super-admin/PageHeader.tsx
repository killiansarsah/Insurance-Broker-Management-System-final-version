'use client';

import { type LucideIcon, ChevronRight } from 'lucide-react';

/**
 * PageHeader — Title + subtitle + breadcrumb + action buttons.
 * Part of the Super Admin Command Centre design system.
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon: Icon, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 mb-2">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  size={12}
                  style={{ color: 'var(--sa-text-muted)' }}
                  aria-hidden="true"
                />
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className="text-xs font-medium hover:underline"
                  style={{ color: 'var(--sa-teal-500)' }}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--sa-text-muted)' }}
                >
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--sa-radius-md)',
                backgroundColor: 'var(--sa-teal-50)',
              }}
            >
              <Icon size={20} style={{ color: 'var(--sa-teal-600)' }} strokeWidth={2} />
            </div>
          )}
          <div>
            <h1
              className="text-xl font-bold tracking-tight font-serif"
              style={{
                color: 'var(--sa-text-primary)',
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-sm mt-0.5"
                style={{ color: 'var(--sa-text-secondary)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

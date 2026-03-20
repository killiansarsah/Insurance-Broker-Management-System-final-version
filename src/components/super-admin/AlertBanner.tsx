'use client';

import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useState } from 'react';

/**
 * AlertBanner — Dismissible alert strip with severity colors and action link.
 */

type AlertSeverity = 'info' | 'warning' | 'critical';

const SEVERITY_CONFIG: Record<AlertSeverity, {
  bg: string; border: string; text: string; icon: typeof Info;
}> = {
  info:     { bg: 'var(--sa-sky-light)',   border: 'var(--sa-sky)',   text: 'var(--sa-sky)',   icon: Info },
  warning:  { bg: 'var(--sa-amber-light)', border: 'var(--sa-amber)', text: 'var(--sa-amber)', icon: AlertTriangle },
  critical: { bg: 'var(--sa-red-light)',   border: 'var(--sa-red)',   text: 'var(--sa-red)',   icon: AlertCircle },
};

interface AlertBannerProps {
  severity: AlertSeverity;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
}

export function AlertBanner({
  severity,
  message,
  actionLabel,
  onAction,
  dismissible = true,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 text-sm sa-reveal"
      style={{
        backgroundColor: config.bg,
        borderLeft: `3px solid ${config.border}`,
        borderRadius: 'var(--sa-radius-md)',
        color: config.text,
      }}
      role="alert"
    >
      <Icon size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
      <span className="flex-1 font-medium text-xs">{message}</span>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-semibold underline hover:no-underline"
          style={{ color: config.text, cursor: 'pointer', background: 'none', border: 'none' }}
        >
          {actionLabel}
        </button>
      )}

      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="hover:opacity-70"
          style={{ color: config.text, cursor: 'pointer', background: 'none', border: 'none', padding: 2 }}
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

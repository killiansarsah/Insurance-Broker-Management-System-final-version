'use client';

/**
 * StatusPill — Compact coloured badge for status display.
 * Maps any status string to a coloured dot + label.
 */

type StatusVariant =
  | 'active' | 'suspended' | 'pending' | 'trial' | 'expired'
  | 'healthy' | 'degraded' | 'down'
  | 'success' | 'failed' | 'warning'
  | 'open' | 'resolved' | 'queued' | 'processing' | 'retrying'
  | 'sent' | 'delivered' | 'bounced' | 'spam'
  | 'info' | 'critical' | 'maintenance'
  | 'completed'
  | 'overdue' | 'paid' | 'cancelled';

interface StatusConfig {
  bg: string;
  text: string;
  dot: string;
}

const STATUS_MAP: Record<StatusVariant, StatusConfig> = {
  // Lifecycle
  active:      { bg: '#dcfce7', text: '#15803d', dot: '#15803d' },
  healthy:     { bg: '#dcfce7', text: '#15803d', dot: '#15803d' },
  success:     { bg: '#dcfce7', text: '#15803d', dot: '#15803d' },
  completed:   { bg: '#dcfce7', text: '#15803d', dot: '#15803d' },
  delivered:   { bg: '#dcfce7', text: '#15803d', dot: '#15803d' },
  resolved:    { bg: '#dcfce7', text: '#15803d', dot: '#15803d' },
  paid:        { bg: '#dcfce7', text: '#15803d', dot: '#15803d' },
  sent:        { bg: '#e0f2fe', text: '#0369a1', dot: '#0369a1' },

  // Warning
  pending:     { bg: '#fef3c7', text: '#b45309', dot: '#b45309' },
  trial:       { bg: '#fef3c7', text: '#b45309', dot: '#b45309' },
  degraded:    { bg: '#fef3c7', text: '#b45309', dot: '#b45309' },
  warning:     { bg: '#fef3c7', text: '#b45309', dot: '#b45309' },
  processing:  { bg: '#fef3c7', text: '#b45309', dot: '#b45309' },
  queued:      { bg: '#e0f2fe', text: '#0369a1', dot: '#0369a1' },
  retrying:    { bg: '#fef3c7', text: '#b45309', dot: '#b45309' },
  overdue:     { bg: '#fef3c7', text: '#b45309', dot: '#b45309' },
  maintenance: { bg: '#e0f2fe', text: '#0369a1', dot: '#0369a1' },
  info:        { bg: '#e0f2fe', text: '#0369a1', dot: '#0369a1' },

  // Danger
  suspended:   { bg: '#fee2e2', text: '#b91c1c', dot: '#b91c1c' },
  expired:     { bg: '#fee2e2', text: '#b91c1c', dot: '#b91c1c' },
  down:        { bg: '#fee2e2', text: '#b91c1c', dot: '#b91c1c' },
  failed:      { bg: '#fee2e2', text: '#b91c1c', dot: '#b91c1c' },
  critical:    { bg: '#fee2e2', text: '#b91c1c', dot: '#b91c1c' },
  open:        { bg: '#fee2e2', text: '#b91c1c', dot: '#b91c1c' },
  bounced:     { bg: '#fee2e2', text: '#b91c1c', dot: '#b91c1c' },
  spam:        { bg: '#fce4ec', text: '#880e4f', dot: '#880e4f' },
  cancelled:   { bg: '#f3e8ff', text: '#6b21a8', dot: '#6b21a8' },
};

const FALLBACK: StatusConfig = { bg: '#f1f5f9', text: '#475569', dot: '#475569' };

interface StatusPillProps {
  status: string;
  className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps) {
  const key = status.toLowerCase().replace(/[^a-z]/g, '') as StatusVariant;
  const config = STATUS_MAP[key] || FALLBACK;
  const displayLabel = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold tracking-wide ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderRadius: 'var(--sa-radius-pill)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: config.dot,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  );
}

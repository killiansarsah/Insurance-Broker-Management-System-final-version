'use client';

/**
 * LiveDot — Animated pulsing status indicator.
 * Colours: green (healthy), amber (degraded), red (down/critical), sky (info).
 */
export type LiveDotColor = 'green' | 'amber' | 'red' | 'sky';

const DOT_STYLES: Record<LiveDotColor, { bg: string; animation: string }> = {
  green: { bg: 'var(--sa-green)',  animation: 'sa-pulse-green 2s ease-in-out infinite' },
  amber: { bg: 'var(--sa-amber)',  animation: 'sa-pulse-amber 2s ease-in-out infinite' },
  red:   { bg: 'var(--sa-red)',    animation: 'sa-pulse-red 1.5s ease-in-out infinite' },
  sky:   { bg: 'var(--sa-sky)',    animation: 'sa-pulse-green 2.5s ease-in-out infinite' },
};

interface LiveDotProps {
  color: LiveDotColor;
  size?: number;
  label?: string;
}

export function LiveDot({ color, size = 8, label }: LiveDotProps) {
  const s = DOT_STYLES[color];

  return (
    <span className="inline-flex items-center gap-1.5" role="status">
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: s.bg,
          animation: s.animation,
          display: 'inline-block',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      {label && (
        <span className="text-xs" style={{ color: s.bg, fontWeight: 500 }}>
          {label}
        </span>
      )}
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

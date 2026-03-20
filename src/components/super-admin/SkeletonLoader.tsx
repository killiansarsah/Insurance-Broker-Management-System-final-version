'use client';

/**
 * SkeletonLoader — Shimmer placeholder for loading states.
 * Variants: text, card, stat, table-row, chart.
 */

interface SkeletonProps {
  variant?: 'text' | 'card' | 'stat' | 'table-row' | 'chart' | 'circle';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

export function SkeletonLoader({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
}: SkeletonProps) {
  const base = 'sa-skeleton';

  if (variant === 'circle') {
    return (
      <div
        className={`${base} ${className}`}
        style={{
          width: width ?? 40,
          height: height ?? 40,
          borderRadius: '50%',
        }}
      />
    );
  }

  if (variant === 'stat') {
    return (
      <div className={`flex flex-col gap-2 ${className}`} style={{ width: width ?? '100%' }}>
        <div className={base} style={{ width: '40%', height: 14 }} />
        <div className={base} style={{ width: '70%', height: 28 }} />
        <div className={base} style={{ width: '50%', height: 12 }} />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`${className}`}
        style={{
          width: width ?? '100%',
          padding: 16,
          border: '1px solid var(--sa-border)',
          borderRadius: 'var(--sa-radius-sm)',
        }}
      >
        <div className={base} style={{ width: '60%', height: 16, marginBottom: 12 }} />
        <div className={base} style={{ width: '100%', height: 12, marginBottom: 8 }} />
        <div className={base} style={{ width: '80%', height: 12 }} />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={`flex gap-4 py-3 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={base}
            style={{ width: `${15 + Math.random() * 20}%`, height: 14 }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div
        className={`${base} ${className}`}
        style={{
          width: width ?? '100%',
          height: height ?? 200,
        }}
      />
    );
  }

  // Default: text lines
  return (
    <div className={`flex flex-col gap-2 ${className}`} style={{ width: width ?? '100%' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={base}
          style={{
            width: i === lines - 1 && lines > 1 ? '60%' : '100%',
            height: height ?? 14,
          }}
        />
      ))}
    </div>
  );
}

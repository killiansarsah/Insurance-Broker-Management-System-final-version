'use client';

import { LogOut, Eye, AlertTriangle } from 'lucide-react';
import { useImpersonation } from '@/contexts/ImpersonationContext';

/**
 * ImpersonationBanner — Persistent top bar visible when impersonating a user.
 * Amber/red, not dismissible, with exit button.
 */

export function ImpersonationBanner() {
  const { isImpersonating, target, exitImpersonation } = useImpersonation();

  if (!isImpersonating || !target) return null;

  return (
    <div
      className="flex items-center justify-between px-4 py-2 gap-3"
      style={{
        backgroundColor: '#fef3c7',
        borderBottom: '2px solid #f59e0b',
        animation: 'sa-shake 0.4s ease-in-out, sa-reveal 0.3s ease-out',
        zIndex: 1000,
        position: 'relative',
      }}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <Eye size={16} style={{ color: '#b45309' }} />
        <AlertTriangle size={14} style={{ color: '#b45309' }} />
        <span className="text-xs font-bold" style={{ color: '#92400e' }}>
          IMPERSONATING:
        </span>
        <span className="text-xs font-semibold" style={{ color: '#78350f' }}>
          {target.userName} ({target.email})
        </span>
        <span className="text-xs" style={{ color: '#92400e' }}>
          @ {target.tenantName} • {target.role}
        </span>
      </div>

      <button
        onClick={exitImpersonation}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold sa-btn-hover"
        style={{
          backgroundColor: '#b91c1c',
          color: '#ffffff',
          border: 'none',
          borderRadius: 'var(--sa-radius-sm)',
          cursor: 'pointer',
        }}
      >
        <LogOut size={12} />
        Exit Impersonation
      </button>
    </div>
  );
}

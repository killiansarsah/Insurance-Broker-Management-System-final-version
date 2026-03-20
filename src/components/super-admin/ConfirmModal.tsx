'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * ConfirmModal — Confirmation dialog for dangerous actions.
 * Supports type-to-confirm for destructive operations.
 */

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  typeToConfirm?: string; // If set, user must type this exact string
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  typeToConfirm,
  loading = false,
}: ConfirmModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && typeToConfirm) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (open) {
      setTimeout(() => confirmBtnRef.current?.focus(), 100);
    }
  }, [open, typeToConfirm]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleConfirm = () => {
    if (typeToConfirm && inputRef.current?.value !== typeToConfirm) return;
    onConfirm();
  };

  const isConfirmDisabled =
    loading || (typeToConfirm ? (inputRef.current?.value ?? '') !== typeToConfirm : false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(2, 26, 19, 0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="sa-reveal w-full max-w-md mx-4"
        style={{
          backgroundColor: 'var(--sa-bg-modal)',
          borderRadius: 'var(--sa-radius-md)',
          boxShadow: 'var(--sa-shadow-modal)',
          border: '1px solid var(--sa-border)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--sa-border)' }}>
          <h2
            className="text-base font-bold"
            style={{
              color: danger ? 'var(--sa-red)' : 'var(--sa-text-primary)',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="hover:opacity-70"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sa-text-muted)', padding: 4 }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm" style={{ color: 'var(--sa-text-secondary)', lineHeight: 1.6 }}>
            {description}
          </p>

          {typeToConfirm && (
            <div className="mt-4">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--sa-text-muted)' }}>
                Type <strong style={{ color: 'var(--sa-red)', fontFamily: "'DM Mono', monospace" }}>{typeToConfirm}</strong> to confirm
              </label>
              <input
                ref={inputRef}
                type="text"
                placeholder={typeToConfirm}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--sa-bg-input)',
                  border: '1px solid var(--sa-border)',
                  borderRadius: 'var(--sa-radius-sm)',
                  color: 'var(--sa-text-primary)',
                  fontFamily: "'DM Mono', monospace",
                }}
                onChange={() => {
                  // Force re-render to update button disabled state
                  confirmBtnRef.current?.click; // no-op, just triggers Re-render via React
                  // We use a controlled approach instead
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t" style={{ borderColor: 'var(--sa-border)' }}>
          <button
            onClick={onClose}
            className="sa-btn-hover px-4 py-2 text-xs font-semibold"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--sa-border)',
              borderRadius: 'var(--sa-radius-sm)',
              color: 'var(--sa-text-secondary)',
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={handleConfirm}
            disabled={loading}
            className="sa-btn-hover px-4 py-2 text-xs font-semibold"
            style={{
              backgroundColor: danger ? 'var(--sa-red)' : 'var(--sa-teal-500)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--sa-radius-sm)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLastClickOrigin } from '@/lib/click-origin';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    className?: string;
}

const sizeMap: Record<string, string> = {
    sm: '24rem',
    md: '32rem',
    lg: '42rem',
    xl: '56rem',
    '2xl': '72rem',
    full: '95vw',
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    className,
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    // Handle clicks on the backdrop (the dialog element itself when using showModal)
    const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) {
            onClose();
        }
    };

    // IMPORTANT: The <dialog> must remain in the DOM so useEffect can call
    // dialog.close() BEFORE React removes it. Removing the dialog without
    // calling .close() leaves a ghost ::backdrop in the browser's top layer,
    // which renders as a visible white strip with blur.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                // Capture click position BEFORE showModal repositions the dialog
                const origin = getLastClickOrigin();
                dialog.showModal();
                // After showModal the dialog is positioned — compute origin relative to inner box
                requestAnimationFrame(() => {
                    const inner = innerRef.current;
                    if (!inner) return;
                    const rect = inner.getBoundingClientRect();
                    const ox = origin.x - rect.left;
                    const oy = origin.y - rect.top;
                    inner.style.transformOrigin = `${ox}px ${oy}px`;
                    inner.style.animation = 'none';
                    void inner.offsetHeight; // force reflow to restart animation
                    inner.style.animation = 'modal-origin-expand 0.6s cubic-bezier(0.34, 1.45, 0.64, 1) forwards';
                });
            }
            document.body.style.overflow = 'hidden';
        } else {
            if (dialog.open) {
                dialog.close();
            }
            // Reset animation so it re-fires next open
            if (innerRef.current) {
                innerRef.current.style.animation = '';
                innerRef.current.style.transformOrigin = '';
            }
            document.body.style.overflow = '';
        }

        return () => {
            if (dialog.open) {
                dialog.close();
            }
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
        e.preventDefault();
        onClose();
    };

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            onClick={handleDialogClick}
            className={cn(
                'bg-transparent border-none p-0 m-auto backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm',
                'max-h-[90vh] rounded-[var(--radius-2xl)] shadow-[var(--glass-shadow)] overflow-hidden outline-none',
                className
            )}
            style={{ width: 'calc(100vw - 2rem)', maxWidth: sizeMap[size] || sizeMap.md }}
        >
            {isOpen && (
                <div ref={innerRef} className="bg-[var(--glass-26-bg)] backdrop-blur-[var(--glass-26-blur)] flex flex-col w-full border border-[var(--glass-26-border)] shadow-[inset_0_1px_0_0_var(--glass-26-highlight),var(--glass-26-shadow)] overflow-hidden text-surface-900 rounded-[var(--radius-2xl)]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 md:p-6 border-b border-[var(--glass-26-border)] bg-transparent shrink-0">
                        <div>
                            {title && (
                                <h2 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="text-sm text-surface-500 dark:text-slate-400 mt-1">{description}</p>
                            )}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            type="button"
                            className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-slate-200 hover:bg-surface-100 dark:hover:bg-slate-700 rounded-full transition-all active:scale-90 outline-none focus:ring-2 focus:ring-surface-200 dark:focus:ring-slate-600 cursor-pointer"
                            aria-label="Close dialog"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6 overflow-y-auto w-full flex-1">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="p-4 md:p-6 border-t border-t-[var(--glass-26-border)] bg-transparent shrink-0 mb-safe">
                            {footer}
                        </div>
                    )}
                </div>
            )}
        </dialog>
    );
}
'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
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

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
                dialog.focus(); // Ensure focus moves to dialog
            }
            document.body.style.overflow = 'hidden';
        } else {
            if (dialog.open) {
                dialog.close();
            }
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
        e.preventDefault();
        onClose();
    };

    // Close when clicking backdrop
    const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialog = dialogRef.current;
        if (e.target === dialog) {
            onClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            onClick={handleClick}
            className={cn(
                'peer bg-transparent p-0 m-auto backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 open:duration-300 backdrop:animate-in backdrop:fade-in backdrop:duration-300',
                sizeStyles[size],
                'w-full min-w-[340px] max-h-[90vh] rounded-[var(--radius-xl)] shadow-2xl overflow-hidden outline-none flex flex-col',
                className
            )}
        >
            <div className="bg-white flex flex-col w-full h-full border border-surface-200 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-surface-100 bg-surface-50/50 shrink-0">
                    <div>
                        {title && (
                            <h2 className="text-xl font-bold text-surface-900 tracking-tight">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-sm text-surface-500 mt-1">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-full transition-colors active:scale-95 outline-none focus:ring-2 focus:ring-surface-200"
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
                    <div className="p-4 md:p-6 border-t border-surface-100 bg-surface-50/50 shrink-0 mb-safe">
                        {footer}
                    </div>
                )}
            </div>
        </dialog>
    );
}

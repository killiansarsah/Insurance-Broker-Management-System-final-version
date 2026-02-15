'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/use-click-outside';

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

    // Handle clicks on the dialog itself (which represents the backdrop when using showModal)
    const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        // Get the bounding box of the dialog content (if we were using a div inside, but here the dialog is the container)
        // Since we have a div wrapper inside the dialog for styling, we check if the click was directly on the dialog element
        if (e.target === dialog) {
            onClose();
        }
    };

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
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

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            onClick={handleDialogClick}
            className={cn(
                'bg-transparent p-0 m-auto backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm',
                'open:animate-in open:fade-in open:zoom-in-95 open:duration-300',
                'backdrop:animate-in backdrop:fade-in backdrop:duration-300',
                sizeStyles[size],
                'w-full min-w-[340px] max-h-[90vh] rounded-[var(--radius-xl)] shadow-[var(--glass-shadow)] overflow-hidden outline-none hidden open:flex flex-col',
                className
            )}
        >
            <div className="bg-[var(--glass-26-bg)] backdrop-blur-[var(--glass-26-blur)] flex flex-col w-full h-full border border-[var(--glass-26-border)] shadow-[inset_0_1px_0_0_var(--glass-26-highlight),var(--glass-26-shadow)] overflow-hidden text-surface-900">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-[var(--glass-26-border)] bg-transparent shrink-0">
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
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        type="button"
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-full transition-all active:scale-90 outline-none focus:ring-2 focus:ring-surface-200 cursor-pointer"
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
        </dialog>
    );
}

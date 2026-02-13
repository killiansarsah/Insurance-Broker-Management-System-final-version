'use client';

import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
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
    size = 'md',
    className,
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-surface-900/50 animate-fade-in"
                onClick={onClose}
                aria-hidden
            />
            {/* Content */}
            <div
                className={cn(
                    'relative w-full mx-4',
                    'bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)]',
                    'animate-scale-in',
                    sizeStyles[size],
                    className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                aria-describedby={description ? 'modal-description' : undefined}
            >
                {/* Header */}
                {(title || description) && (
                    <div className="flex items-start justify-between p-6 pb-0">
                        <div>
                            {title && (
                                <h2 id="modal-title" className="text-lg font-semibold text-surface-900">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p id="modal-description" className="text-sm text-surface-500 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-[var(--radius-md)] transition-colors"
                            aria-label="Close dialog"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
                {/* Body */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmationVariant;
    icon?: React.ReactNode;
}

const variantStyles: Record<ConfirmationVariant, { iconBg: string; iconText: string; buttonBg: string; buttonShadow: string }> = {
    danger: {
        iconBg: 'bg-danger-50',
        iconText: 'text-danger-600',
        buttonBg: 'bg-danger-600 hover:bg-danger-700',
        buttonShadow: 'shadow-danger-600/20',
    },
    warning: {
        iconBg: 'bg-warning-50',
        iconText: 'text-warning-600',
        buttonBg: 'bg-warning-600 hover:bg-warning-700',
        buttonShadow: 'shadow-warning-600/20',
    },
    info: {
        iconBg: 'bg-primary-50',
        iconText: 'text-primary-600',
        buttonBg: 'bg-primary-600 hover:bg-primary-700',
        buttonShadow: 'shadow-primary-600/20',
    },
};

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    icon,
}: ConfirmationModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const styles = variantStyles[variant];

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) dialog.showModal();
            document.body.style.overflow = 'hidden';
        } else {
            if (dialog.open) dialog.close();
            document.body.style.overflow = '';
        }

        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) onClose();
    };

    if (!isOpen) return null;

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            onClick={handleBackdropClick}
            className={cn(
                'bg-transparent p-0 m-auto backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm',
                'open:animate-in open:fade-in open:zoom-in-95 open:duration-300',
                'backdrop:animate-in backdrop:fade-in backdrop:duration-300',
                'w-full max-w-md min-w-[340px] rounded-[var(--radius-2xl)] shadow-[var(--glass-shadow)] overflow-hidden outline-none hidden open:flex flex-col'
            )}
        >
            <div className="bg-white flex flex-col items-center text-center w-full rounded-[var(--radius-2xl)] border border-surface-200 p-8 gap-5">
                {/* Icon */}
                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', styles.iconBg, styles.iconText)}>
                    {icon}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-extrabold text-surface-900 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-sm text-surface-500 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex w-full gap-3 mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl border border-surface-200 font-bold text-sm text-surface-600 hover:bg-surface-50 transition-all cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={() => { onConfirm(); onClose(); }}
                        className={cn(
                            'flex-1 h-12 rounded-xl text-white font-bold text-sm shadow-lg transition-all cursor-pointer',
                            styles.buttonBg,
                            styles.buttonShadow
                        )}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </dialog>
    );
}

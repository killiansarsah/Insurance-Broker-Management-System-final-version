import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className, containerClassName, id, ...props }, ref) => {
        const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-sm font-medium text-surface-700 select-none"
                    >
                        {label}
                        {props.required && (
                            <span className="text-danger-500 ml-0.5">*</span>
                        )}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        'w-full min-h-[100px] px-3.5 py-3 text-sm bg-[var(--bg-input)] backdrop-blur-[var(--glass-blur)] border rounded-[var(--radius-md)]',
                        'placeholder:text-surface-400',
                        'transition-all duration-[var(--transition-fast)]',
                        'hover:border-surface-400',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500',
                        error
                            ? 'border-danger-500 focus:ring-danger-500/10 focus:border-danger-500'
                            : 'border-[var(--glass-border)]',
                        'disabled:bg-surface-100 disabled:cursor-not-allowed disabled:text-surface-400',
                        'resize-y',
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={
                        error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
                    }
                    {...props}
                />
                {error && (
                    <p id={`${textareaId}-error`} className="text-xs text-danger-500 font-medium" role="alert">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${textareaId}-hint`} className="text-xs text-surface-500">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

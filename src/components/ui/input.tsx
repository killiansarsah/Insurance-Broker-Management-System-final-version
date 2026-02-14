import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, className, containerClassName, id, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className={cn('flex flex-col gap-2 w-full', containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-semibold text-surface-800 select-none w-fit"
                    >
                        {label}
                        {props.required && (
                            <span className="text-danger-500 ml-1">*</span>
                        )}
                    </label>
                )}
                <div className="relative w-full group">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors pointer-events-none flex items-center justify-center z-10">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'block w-full h-12 px-4 text-sm bg-white border-2 rounded-xl border-surface-200',
                            'placeholder:text-surface-400 text-surface-900',
                            'transition-all duration-200 outline-none',
                            'hover:border-surface-300',
                            'focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10',
                            leftIcon && 'pl-12',
                            rightIcon && 'pr-12',
                            error
                                ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10'
                                : '',
                            'disabled:bg-surface-50 disabled:cursor-not-allowed disabled:text-surface-400',
                            className
                        )}
                        aria-invalid={!!error}
                        aria-describedby={
                            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
                        }
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 flex items-center justify-center z-10">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="text-xs text-danger-600 font-semibold mt-1" role="alert">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${inputId}-hint`} className="text-xs text-surface-500 mt-1">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

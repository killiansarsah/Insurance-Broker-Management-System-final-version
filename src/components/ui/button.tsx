import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm',
    secondary:
        'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-sm',
    outline:
        'border border-surface-300 bg-white text-surface-700 hover:bg-surface-50 active:bg-surface-100',
    ghost:
        'text-surface-600 hover:bg-surface-100 active:bg-surface-200',
    danger:
        'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-9 px-3.5 text-sm gap-2 rounded-[var(--radius-sm)]',
    md: 'h-11 px-5 text-sm gap-2 rounded-[var(--radius-md)]',
    lg: 'h-14 px-8 text-base gap-3 rounded-[var(--radius-md)]',
    icon: 'h-10 w-10 p-0 rounded-[var(--radius-md)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            className,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center font-medium',
                    'transition-all duration-[var(--transition-fast)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'cursor-pointer select-none',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

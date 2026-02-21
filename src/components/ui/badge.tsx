import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'surface';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-accent-50 text-accent-700',
    danger: 'bg-danger-50 text-danger-700',
    outline: 'border border-[var(--glass-border)] text-surface-600 bg-[var(--bg-card)] backdrop-blur-sm',
    surface: 'bg-surface-100 text-surface-600 border border-surface-200',
};

const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-surface-400',
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-accent-500',
    danger: 'bg-danger-500',
    outline: 'bg-surface-400',
    surface: 'bg-surface-400',
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-1',
};

export function Badge({
    children,
    variant = 'default',
    size = 'sm',
    dot = false,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 font-medium rounded-[var(--radius-full)] whitespace-nowrap',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {dot && (
                <span
                    className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])}
                />
            )}
            {children}
        </span>
    );
}

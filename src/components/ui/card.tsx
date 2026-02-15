import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function Card({
    children,
    className,
    padding = 'md',
    hover = false,
}: CardProps) {
    return (
        <div
            className={cn(
                'bg-[var(--glass-26-bg)] backdrop-blur-[var(--glass-26-blur)] rounded-[var(--radius-lg)] border border-[var(--glass-26-border)]',
                'shadow-[inset_0_1px_0_0_var(--glass-26-highlight),var(--glass-26-shadow)]',
                hover &&
                'transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5',
                paddingStyles[padding],
                className
            )}
        >
            {children}
        </div>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return <div className={className}>{children}</div>;
}

interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
    return (
        <div className={cn('flex items-start justify-between p-6', className)}>
            <div>
                <h3 className="text-base font-semibold text-surface-900">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-surface-500 mt-0.5">{subtitle}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

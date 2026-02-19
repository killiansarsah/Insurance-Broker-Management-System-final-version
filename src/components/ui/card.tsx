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
                'bg-white rounded-xl border border-surface-200/60', // Thinner, crisp border
                'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]', // Base layered shadow
                hover &&
                'transition-all duration-300 ease-out hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_4px_8px_rgba(0,0,0,0.04)] hover:-translate-y-1', // Premium lift
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

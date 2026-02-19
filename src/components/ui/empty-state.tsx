import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-16 px-6 text-center',
                className
            )}
        >
            <div className="w-14 h-14 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 mb-4">
                {icon || <Inbox size={24} />}
            </div>
            <h3 className="text-base font-semibold text-surface-900 mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-surface-500 max-w-sm mb-6">{description}</p>
            )}
            {action && <div>{action}</div>}
        </div>
    );
}

import { cn } from '@/lib/utils';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
    return (
        <svg
            className={cn('animate-spin text-primary-500', sizeStyles[size], className)}
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Loading"
            role="status"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

interface PageLoaderProps {
    message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-surface-500">{message}</p>
        </div>
    );
}

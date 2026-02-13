import { cn, getInitials } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    name: string;
    src?: string;
    size?: AvatarSize;
    className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
};

const colorPalette = [
    'bg-primary-100 text-primary-700',
    'bg-success-100 text-success-700',
    'bg-accent-100 text-accent-700',
    'bg-danger-100 text-danger-700',
    'bg-surface-200 text-surface-700',
];

function getColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorPalette[Math.abs(hash) % colorPalette.length];
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={cn(
                    'rounded-full object-cover ring-2 ring-white',
                    sizeStyles[size],
                    className
                )}
            />
        );
    }

    return (
        <div
            className={cn(
                'rounded-full flex items-center justify-center font-semibold ring-2 ring-white',
                sizeStyles[size],
                getColorFromName(name),
                className
            )}
            title={name}
            aria-label={name}
        >
            {getInitials(name)}
        </div>
    );
}

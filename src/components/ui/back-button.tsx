'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface BackButtonProps {
    href?: string;
    className?: string;
    onClick?: () => void;
}

export function BackButton({ href, className, onClick }: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    // Common styles
    const buttonClasses = cn(
        "w-12 h-12 flex items-center justify-center rounded-full bg-white text-surface-400 hover:text-primary-600 hover:shadow-lg hover:scale-105 transition-all active:scale-90 shadow-sm border border-surface-100 shrink-0",
        className
    );

    // If explicit href is provided and no custom onClick, we can use Link for better SEO/prefetching
    // But to keep the exact circular style and behavior consistent, a button with onClick/router.push is also fine.
    // The user's reference implementation used a button with router.push.

    return (
        <button
            onClick={handleClick}
            className={buttonClasses}
            aria-label="Go back"
        >
            <ArrowLeft size={20} />
        </button>
    );
}

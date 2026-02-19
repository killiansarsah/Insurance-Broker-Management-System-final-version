'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        "back-button-root w-12 h-12 flex items-center justify-center rounded-full bg-white text-surface-400 hover:text-primary-600 hover:shadow-lg hover:scale-105 transition-all active:scale-90 shadow-sm border border-surface-100 shrink-0",
        className
    );

    return (
        <>
            <style>{`
                @keyframes arrowWave {
                    0%   { transform: translateX(0);    }
                    20%  { transform: translateX(-5px); }
                    40%  { transform: translateX(2px);  }
                    60%  { transform: translateX(-4px); }
                    80%  { transform: translateX(1px);  }
                    100% { transform: translateX(0);    }
                }

                .back-arrow-icon {
                    animation: arrowWave 1.4s ease-in-out infinite;
                }
            `}</style>
            <button
                onClick={handleClick}
                className={buttonClasses}
                aria-label="Go back"
            >
                <ArrowLeft size={20} className="back-arrow-icon" />
            </button>
        </>
    );
}

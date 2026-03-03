'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, Home, ChevronLeft } from 'lucide-react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('[Dashboard Error]', error);
    }, [error]);

    const router = useRouter();

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 rounded-full bg-danger-50 flex items-center justify-center">
                    <AlertTriangle size={36} className="text-danger-500" />
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-surface-900">Something went wrong</h1>
                    <p className="text-surface-500 text-sm leading-relaxed">
                        An unexpected error occurred while loading this page. Your data is safe — this is a display error.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-surface-400 font-mono bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 mt-3">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-surface-200 bg-white text-surface-700 text-sm font-semibold hover:bg-surface-50 transition-colors"
                    >
                        <Home size={16} />
                        Go to Dashboard
                    </button>
                </div>

                {/* Support note */}
                <p className="text-xs text-surface-400">
                    If this problem persists, contact your system administrator.
                </p>
            </div>
        </div>
    );
}

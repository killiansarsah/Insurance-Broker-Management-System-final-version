'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ClaimsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => { console.error(error); }, [error]);
    const router = useRouter();
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center">
                    <AlertTriangle size={28} className="text-danger-500" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-surface-900">Something went wrong</h2>
                    <p className="text-sm text-surface-500">An error occurred loading claims. Please try again.</p>
                    {error.digest && <p className="text-xs text-surface-400 font-mono mt-2">Error ID: {error.digest}</p>}
                </div>
                <div className="flex gap-2 justify-center">
                    <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
                        <RefreshCw size={14} /> Try Again
                    </button>
                    <button onClick={() => router.push('/dashboard')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-200 bg-white text-surface-700 text-sm font-semibold hover:bg-surface-50 transition-colors">
                        <ArrowLeft size={14} /> Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

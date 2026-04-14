'use client';

import AlertCardDemo from '@/components/demos/alert-card-demo';

export default function AlertDemoPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Design System Showcase</h1>
                <p className="text-sm text-surface-500 mt-1">
                    Previewing the new high-impact System Alert design patterns.
                </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-surface-200 dark:border-slate-800 p-12 shadow-sm min-h-[600px] flex items-center justify-center">
                <AlertCardDemo />
            </div>

            <div className="max-w-2xl mx-auto space-y-4 text-center">
                <h3 className="text-lg font-bold text-surface-900">How this works in production:</h3>
                <p className="text-sm text-surface-600 leading-relaxed">
                    This alert component is hooked into the global WebSocket listener. When a task deadline is reached in the background, this card will spring onto the center of your screen, no matter which page you're currently visiting.
                </p>
            </div>
        </div>
    );
}

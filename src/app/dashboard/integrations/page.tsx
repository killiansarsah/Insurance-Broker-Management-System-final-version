'use client';

import { SettingsIntegrations } from '@/components/features/settings/settings-integrations';

export default function IntegrationsPage() {
    return (
        <div className="flex flex-col gap-10 pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    Integrations & Imports
                </h1>
                <p className="text-slate-500 font-medium text-lg mt-1">
                    Manage connections with third-party services and handle bulk data imports.
                </p>
            </div>

            <SettingsIntegrations />
        </div>
    );
}

'use client';

import { Plug, Zap } from 'lucide-react';
import { SettingsIntegrations } from '@/components/features/settings/settings-integrations';

export default function IntegrationsPage() {
    return (
        <div className="flex flex-col gap-8 pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Plug size={20} className="text-primary-600" />
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Operations / Integrations</span>
                    </div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">
                        Integrations Hub
                    </h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Connect third-party services, manage sync settings, and import bulk data.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800">
                    <Zap size={12} />
                    <span>Encrypted Connections</span>
                </div>
            </div>

            <SettingsIntegrations />
        </div>
    );
}

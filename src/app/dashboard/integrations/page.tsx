'use client';

import { Plug, Zap, Shield, ArrowRight } from 'lucide-react';
import { SettingsIntegrations } from '@/components/features/settings/settings-integrations';

export default function IntegrationsPage() {
    return (
        <div className="flex flex-col gap-6 pb-20 animate-fade-in">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8">
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />
                {/* Glow accent */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <Plug size={16} className="text-white/80" />
                            </div>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Operations / Integrations</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Integrations Hub
                        </h1>
                        <p className="text-sm text-white/50 mt-1.5 max-w-md leading-relaxed">
                            Connect third-party services, manage sync settings, and import bulk data.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-4 py-2.5 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                            <Shield size={12} />
                            <span>Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-4 py-2.5 rounded-full border border-amber-500/20 backdrop-blur-sm">
                            <Zap size={12} />
                            <span>Live Sync</span>
                        </div>
                    </div>
                </div>
            </div>

            <SettingsIntegrations />
        </div>
    );
}

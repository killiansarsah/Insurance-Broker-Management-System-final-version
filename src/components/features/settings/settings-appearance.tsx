'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

const themes = [
    { value: 'light', label: 'Classic Light', desc: 'Clean and bright interface with high contrast.', icon: 'light_mode' },
    { value: 'dark', label: 'Premium Dark', desc: 'Deep slate tones for reduced eye strain.', icon: 'dark_mode' },
    { value: 'glass', label: 'Liquid Glass', desc: 'Modern frosted effects and vibrant accents.', icon: 'blur_on' },
] as const;

export function SettingsAppearance() {
    const currentTheme = useUiStore((s) => s.currentTheme);
    const setTheme = useUiStore((s) => s.setTheme);

    const [widgets, setWidgets] = useState([
        { id: 'kpis', title: 'Top KPIs', desc: 'Premium, Commission, and Sum Insured summaries.', enabled: true, icon: 'analytics' },
        { id: 'revenue', title: 'Revenue Trend Chart', desc: 'Monthly net commission performance area chart.', enabled: true, icon: 'show_chart' },
        { id: 'insurer_yield', title: 'Insurer Yield', desc: 'Pie chart showing portfolio concentration by underwriter.', enabled: true, icon: 'pie_chart' },
        { id: 'quick_actions', title: 'Quick Action Bar', desc: 'Shortcut buttons for Excel Import, Add Policy, etc.', enabled: true, icon: 'bolt' },
        { id: 'recent_activity', title: 'Recent Activity', desc: 'A log of recent ledger entries and client updates.', enabled: false, icon: 'history' },
    ]);

    const activeFiscalYear = "2024 / 2025";
    const fiscalYears = ["2024 / 2025", "2023 / 2024", "2022 / 2023", "2021 / 2022"];

    const toggleWidget = (id: string) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Theme Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Interface Appearance</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Theme</span>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {themes.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setTheme(t.value as 'light' | 'dark' | 'glass')}
                            className={cn(
                                "p-8 rounded-3xl border-2 text-left transition-all relative flex flex-col gap-4 group",
                                currentTheme === t.value
                                    ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                            )}
                        >
                            <div className={cn(
                                "size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                currentTheme === t.value ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            )}>
                                <span className="material-symbols-outlined text-2xl">{t.icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.label}</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed uppercase tracking-tight">{t.desc}</span>
                            </div>
                            {currentTheme === t.value && (
                                <div className="absolute top-4 right-4 text-primary animate-pulse">
                                    <span className="material-symbols-outlined font-black">check_circle</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dashboard Layout */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Dashboard Components</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Widget Visibility</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {widgets.map((w) => (
                        <div key={w.id} className={cn(
                            "p-8 flex items-center justify-between gap-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20",
                            !w.enabled && "opacity-60 grayscale"
                        )}>
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "size-12 rounded-2xl flex items-center justify-center",
                                    w.enabled ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                )}>
                                    <span className="material-symbols-outlined text-2xl">{w.icon}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{w.title}</h4>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{w.desc}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleWidget(w.id)}
                                className={cn(
                                    "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
                                    w.enabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                )}
                            >
                                <span className={cn(
                                    "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out",
                                    w.enabled ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fiscal Year Context */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Fiscal Context</h3>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/30">Active</span>
                </div>
                <div className="p-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex flex-col gap-2 flex-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Display Year</span>
                        <div className="h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{activeFiscalYear}</span>
                            <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-tight">All dashboard values and financial reports will be filtered by this period.</p>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-64">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Switch Period</label>
                        <select className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-black uppercase tracking-widest appearance-none dark:text-white">
                            {fiscalYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Reorder Preview Card */}
            <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl border border-slate-700 text-white flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-amber-500">drag_indicator</span>
                        <h4 className="text-sm font-black uppercase tracking-widest">Reorder Preview</h4>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Coming Soon</span>
                </div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                    In the upcoming v2.4 update, you will be able to drag and drop these blocks directly on your dashboard to customize their exact position. Currently, toggling a widget off will simply collapse its corresponding space.
                </p>
                <button className="h-12 w-full border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                    Save Custom View
                </button>
            </div>

            {/* Accessibility Tip */}
            <div className="bg-primary/5 dark:bg-slate-900/50 rounded-3xl border border-primary/20 p-8 flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">visibility</span>
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-black text-primary uppercase tracking-tight">Accessibility Tip</h4>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                        Dark Mode is highly recommended for late-night audits to reduce digital eye strain. Your settings are saved locally and will be remembered on this device.
                    </p>
                </div>
            </div>
        </div>
    );
}

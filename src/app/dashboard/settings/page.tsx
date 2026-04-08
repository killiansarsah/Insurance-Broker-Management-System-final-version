'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SettingsProfile } from '@/components/features/settings/settings-profile';
import { SettingsOrganization } from '@/components/features/settings/settings-organization';
import { SettingsCommunications } from '@/components/features/settings/settings-communications';
import { SettingsSecurityDetails } from '@/components/features/settings/settings-security-details';
import { SettingsAppearance } from '@/components/features/settings/settings-appearance';
import { SettingsAccessControl } from '@/components/features/settings/settings-access-control';
import { SettingsTerms } from '@/components/features/settings/settings-terms';
import { SettingsRenewals } from '@/components/features/settings/settings-renewals';

const MATERIAL_SYMBOLS_HREF = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';

function useLoadMaterialSymbols() {
    useEffect(() => {
        const id = 'material-symbols-font';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = MATERIAL_SYMBOLS_HREF;
        document.head.appendChild(link);
    }, []);
}

type Tab = 'overview' | 'profile' | 'organization' | 'communications' | 'security' | 'experience' | 'access' | 'terms' | 'renewals';

const tabTitles: Record<Tab, { heading: string; subtitle: string; icon: string }> = {
    overview: { heading: 'System Overview', subtitle: 'Central configuration hub.', icon: 'dashboard' },
    profile: { heading: 'Your Profile', subtitle: 'Personal identity and system role configuration.', icon: 'account_circle' },
    organization: { heading: 'Organization', subtitle: 'Global settings for your brokerage firm identity.', icon: 'corporate_fare' },
    communications: { heading: 'Communications', subtitle: 'Configure automated alerts for critical business operations.', icon: 'notifications_none' },
    security: { heading: 'Security Details', subtitle: 'Multi-factor authentication and login activity.', icon: 'security' },
    experience: { heading: 'App Experience', subtitle: 'Customize the interface, theme, and dashboard layout.', icon: 'palette' },
    access: { heading: 'Access Control', subtitle: 'Manage system users, roles, and administrative permissions.', icon: 'admin_panel_settings' },
    renewals: { heading: 'Renewal Engine', subtitle: 'Manage email templates and automation rules.', icon: 'autorenew' },
    terms: { heading: 'Terms & Legal', subtitle: 'Review and manage your acceptance of platform policies.', icon: 'gavel' },
};

const navGroups = [
    { label: 'General', items: ['overview', 'profile', 'organization'] as Tab[] },
    { label: 'Operations', items: ['communications', 'renewals'] as Tab[] },
    { label: 'System', items: ['security', 'experience', 'access'] as Tab[] },
    { label: 'Legal', items: ['terms'] as Tab[] }
];

export default function SettingsPage() {
    useLoadMaterialSymbols();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab in tabTitles) {
            setActiveTab(tab as Tab);
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 min-h-[calc(100vh-100px)] animate-fade-in relative">
            
            {/* LEFT SIDEBAR NAVIGATION (25%) */}
            <nav className="w-full lg:w-[280px] shrink-0 sticky top-[88px] h-fit flex flex-col gap-8 pb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">
                        Settings
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Configure your workspace</p>
                </div>

                <div className="flex flex-col gap-6">
                    {navGroups.map((group) => (
                        <div key={group.label} className="flex flex-col gap-1.5">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-3 mb-1">
                                {group.label}
                            </h4>
                            <div className="flex flex-col">
                                {group.items.map((tab) => {
                                    const isActive = activeTab === tab;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={cn(
                                                "relative flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-left transition-colors duration-300 rounded-lg group",
                                                isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            {/* LIQUID ANIMATION HIGHLIGHT */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeSettingTab"
                                                    className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/50 rounded-lg z-0"
                                                    initial={false}
                                                    transition={{ 
                                                        type: "spring", 
                                                        stiffness: 400, 
                                                        damping: 30,
                                                        mass: 0.8
                                                    }}
                                                />
                                            )}
                                            <span className={cn(
                                                "material-symbols-outlined text-[18px] relative z-10 transition-transform duration-300",
                                                isActive ? "scale-110" : "group-hover:scale-110"
                                            )}>
                                                {tabTitles[tab].icon}
                                            </span>
                                            <span className="relative z-10 tracking-wide">{tabTitles[tab].heading}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            {/* MAIN CANVAS (75%) */}
            <main className="flex-1 max-w-[1000px] bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden relative min-h-[500px]">
                
                {/* Header for energetic Context */}
                <header className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {tabTitles[activeTab].heading}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {tabTitles[activeTab].subtitle}
                        </p>
                    </div>
                </header>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="h-full"
                        >
                            {/* Render active content */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {navGroups.flatMap(g => g.items).filter(t => t !== 'overview').map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className="group flex flex-col items-start gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-300 text-left"
                                        >
                                            <div className="size-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 transition-colors">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary-600 transition-colors">
                                                    {tabTitles[tab].icon}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                                                    {tabTitles[tab].heading}
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 line-clamp-2">
                                                    {tabTitles[tab].subtitle}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'profile' && <SettingsProfile />}
                            {activeTab === 'organization' && <SettingsOrganization />}
                            {activeTab === 'communications' && <SettingsCommunications />}
                            {activeTab === 'security' && <SettingsSecurityDetails />}
                            {activeTab === 'experience' && <SettingsAppearance />}
                            {activeTab === 'access' && <SettingsAccessControl />}
                            {activeTab === 'terms' && <SettingsTerms />}
                            {activeTab === 'renewals' && <SettingsRenewals />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

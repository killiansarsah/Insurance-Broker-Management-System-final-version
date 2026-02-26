'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SettingsProfile } from '@/components/features/settings/settings-profile';
import { SettingsOrganization } from '@/components/features/settings/settings-organization';
import { SettingsCommunications } from '@/components/features/settings/settings-communications';
import { SettingsSecurityDetails } from '@/components/features/settings/settings-security-details';
import { SettingsAppearance } from '@/components/features/settings/settings-appearance';
import { SettingsAccessControl } from '@/components/features/settings/settings-access-control';
import { SettingsTerms } from '@/components/features/settings/settings-terms';

type Tab = 'overview' | 'profile' | 'organization' | 'communications' | 'security' | 'experience' | 'access' | 'terms';

const tabTitles: Record<Tab, { heading: string; subtitle: string }> = {
    overview: { heading: 'System Settings', subtitle: 'Central hub for managing your personal workspace and enterprise configuration.' },
    profile: { heading: 'Your Profile', subtitle: 'Personal identity and system role configuration.' },
    organization: { heading: 'Organization Profile', subtitle: 'Global settings for your brokerage firm identity.' },
    communications: { heading: 'Communications', subtitle: 'Configure automated alerts for critical business operations and events.' },
    security: { heading: 'Security Details', subtitle: 'Configure credentials, multi-factor authentication, and review login activity.' },
    experience: { heading: 'App Experience', subtitle: 'Customize the interface, theme, and dashboard layout.' },
    access: { heading: 'Access Control', subtitle: 'Manage system users, roles, and administrative permissions.' },
    terms: { heading: 'Terms & Legal', subtitle: 'Review and manage your acceptance of platform policies.' },
};

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const settingGroups = [
        {
            id: 'profile' as Tab,
            title: 'Your Profile',
            description: 'Manage your personal details, job title, location, and account avatar.',
            icon: 'account_circle',
            color: 'blue',
            items: [
                { label: 'Personal Information', id: 'profile' as Tab },
                { label: 'Job & Location', id: 'profile' as Tab },
            ]
        },
        {
            id: 'organization' as Tab,
            title: 'Organization Info',
            description: 'Manage corporate identity, office branches, and NIC registration details.',
            icon: 'corporate_fare',
            color: 'indigo',
            items: [
                { label: 'Organization Profile', id: 'organization' as Tab },
                { label: 'Branch Management', id: 'organization' as Tab },
            ]
        },
        {
            id: 'communications' as Tab,
            title: 'Communications',
            description: 'Control how you receive alerts and system-wide notifications.',
            icon: 'notifications_none',
            color: 'emerald',
            items: [
                { label: 'Email Notifications', id: 'communications' as Tab },
                { label: 'Push Alerts', id: 'communications' as Tab },
            ]
        },
        {
            id: 'security' as Tab,
            title: 'Security',
            description: 'Configure multi-factor authentication and password requirements.',
            icon: 'security',
            color: 'amber',
            items: [
                { label: 'Change Password', id: 'security' as Tab },
                { label: 'Login History', id: 'security' as Tab },
                { label: '2FA Settings', id: 'security' as Tab },
            ]
        },
        {
            id: 'experience' as Tab,
            title: 'App Experience',
            description: 'Customize the interface, theme, and dashboard layout.',
            icon: 'palette',
            color: 'purple',
            items: [
                { label: 'Theme Preferences', id: 'experience' as Tab },
                { label: 'Dashboard Layout', id: 'experience' as Tab },
                { label: 'Fiscal Year Context', id: 'experience' as Tab },
            ]
        },
        {
            id: 'access' as Tab,
            title: 'Access Control',
            description: 'Manage system users, roles, and administrative permissions.',
            icon: 'admin_panel_settings',
            color: 'rose',
            items: [
                { label: 'User Management', id: 'access' as Tab },
                { label: 'Roles & Permissions', id: 'access' as Tab },
            ]
        },

    ];

    const iconColorMap: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',

    };

    return (
        <div className="flex flex-col gap-10 pb-20 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    {activeTab !== 'overview' && (
                        <button
                            onClick={() => setActiveTab('overview')}
                            className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shrink-0"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    )}
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            {tabTitles[activeTab].heading}
                        </h1>
                        <p className="text-slate-500 font-medium text-lg mt-1">
                            {tabTitles[activeTab].subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Tabs (Only when not in overview) */}
            {activeTab !== 'overview' && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap"
                    >
                        Overview
                    </button>
                    {settingGroups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => setActiveTab(group.id)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                activeTab === group.id
                                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg"
                                    : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            {group.title}
                        </button>
                    ))}
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                            activeTab === 'terms'
                                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg"
                                : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        Terms & Legal
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <div className={activeTab === 'overview' ? '' : 'mt-4'}>
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {settingGroups.map((group) => (
                            <div
                                key={group.id}
                                onClick={() => setActiveTab(group.id)}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-6 hover:border-primary/30 transition-all group hover:shadow-xl cursor-pointer"
                            >
                                <div className="flex items-start gap-6">
                                    <div className={cn(
                                        "size-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                                        iconColorMap[group.color] || iconColorMap.blue
                                    )}>
                                        <span className="material-symbols-outlined text-3xl">{group.icon}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{group.title}</h3>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">{group.description}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    {group.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); setActiveTab(item.id); }}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item"
                                        >
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-primary transition-colors">{item.label}</span>
                                            <span className="material-symbols-outlined text-slate-300 group-hover/item:text-primary transition-colors">chevron_right</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
            </div>
        </div>
    );
}

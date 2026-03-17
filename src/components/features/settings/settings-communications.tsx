'use client';

export function SettingsCommunications() {
    return (
        <div className="flex flex-col gap-10">
            {/* Coming Soon Hero */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-12 md:p-16 flex flex-col items-center text-center gap-8">
                    {/* Icon */}
                    <div className="size-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20">
                        <span className="material-symbols-outlined text-5xl">notifications</span>
                    </div>

                    {/* Title & Description */}
                    <div className="flex flex-col gap-3 max-w-lg">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Communications
                        </h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                            Configure email triggers, SMTP settings, and push notification channels for your brokerage. This feature is currently under development.
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                        <span className="material-symbols-outlined text-amber-500 text-lg">construction</span>
                        <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Coming Soon</span>
                    </div>
                </div>
            </div>

            {/* Planned Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                    icon="mail"
                    title="Email Triggers"
                    description="Automatic email alerts for policy expirations, claim assignments, and payment reminders."
                />
                <FeatureCard
                    icon="settings_suggest"
                    title="SMTP Configuration"
                    description="Connect your own email provider (Amazon SES, SendGrid, or custom SMTP) for outbound emails."
                />
                <FeatureCard
                    icon="notifications_active"
                    title="Push Alerts"
                    description="Browser notifications, desktop banners, and mobile push alerts for real-time updates."
                />
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                    <span className="material-symbols-outlined text-2xl">info</span>
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-black text-blue-900 dark:text-blue-300 uppercase tracking-tight">In-App Notifications Active</h4>
                    <p className="text-sm font-medium text-blue-800/70 dark:text-blue-200/50 leading-relaxed">
                        While this configuration page is under development, your system&apos;s in-app notification system is fully operational. You will continue to receive real-time alerts within the portal for important events.
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-5">
            <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Planned</span>
            </div>
        </div>
    );
}

'use client';

import { Badge } from '@/components/ui/badge';

export function SettingsTerms() {
    return (
        <div className="flex flex-col gap-10">
            {/* Acceptance Status */}
            <div className="bg-gradient-to-r from-primary/10 to-indigo-50/50 dark:from-primary/20 dark:to-indigo-900/10 rounded-3xl border border-primary/10 dark:border-primary/20 p-10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="size-16 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-primary/10 dark:border-primary/20 flex items-center justify-center text-primary shrink-0 font-black text-xl">
                        <span className="material-symbols-outlined text-4xl">verified_user</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Legal Compliance Status</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Review and manage your acceptance of platform policies.</p>
                    </div>
                </div>
                <Badge variant="primary" className="px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest bg-primary text-white shadow-lg shadow-primary/20">Full Compliance</Badge>
            </div>

            {/* Terms of Service */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">description</span>
                        </div>
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Terms of Service</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        Accepted Feb 1, 2026
                    </div>
                </div>
                <div className="p-10">
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 max-h-[320px] overflow-y-auto custom-scrollbar-subtle prose prose-slate dark:prose-invert prose-sm max-w-none">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">1. Acceptance of Terms</h4>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            By accessing and using the Insurance Broker Management System (&quot;IBMS&quot;), you agree to be bound by these Terms of Service.
                            IBMS is a cloud-based platform designed for licensed insurance brokers operating in the Republic of Ghana
                            under the regulatory framework of the National Insurance Commission (NIC).
                        </p>

                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">2. User Responsibilities</h4>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Users must maintain valid NIC licensure throughout their use of the platform. All data entered must be accurate
                            and comply with local insurance regulations. Users are responsible for safeguarding their login credentials
                            and must immediately report any unauthorized access.
                        </p>

                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">3. Data Ownership</h4>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            All client data, policy records, and business information entered into IBMS remains the property of the
                            subscribing brokerage firm. IBMS acts solely as a data processor and will not share, sell, or transfer
                            any tenant data without explicit written consent.
                        </p>

                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">4. Service Availability</h4>
                        <p className="text-slate-600 leading-relaxed">
                            IBMS commits to maintaining a minimum uptime of 99.5% for Basic tier, 99.9% for Professional tier,
                            and 99.99% for Enterprise tier subscribers, measured on a monthly basis. Scheduled maintenance windows
                            will be communicated at least 48 hours in advance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">policy</span>
                        </div>
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Privacy Policy</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        Accepted Feb 1, 2026
                    </div>
                </div>
                <div className="p-10">
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 max-h-[320px] overflow-y-auto custom-scrollbar-subtle prose prose-slate prose-sm max-w-none">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">Data Collection & Usage</h4>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            IBMS collects personal information necessary for brokerage operations including: client names, contact details,
                            national identification numbers (Ghana Card), and financial information related to insurance policies.
                            This data is processed in compliance with the Ghana Data Protection Act, 2012 (Act 843).
                        </p>

                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">Data Storage & Security</h4>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Data is stored within secure cloud
                            infrastructure with regular automated backups. Access is controlled via role-based access control (RBAC)
                            and multi-factor authentication (MFA).
                        </p>

                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">Data Retention</h4>
                        <p className="text-slate-600 leading-relaxed">
                            Insurance records are retained for a minimum of six (6) years in compliance with NIC regulations.
                            Upon account termination, tenants may request full data export within 90 days.
                            After the retention period, data is securely purged using industry-standard methods.
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Processing Agreement */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">gavel</span>
                        </div>
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Data Processing Agreement (DPA)</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        Accepted Feb 1, 2026
                    </div>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DpaSummaryCard
                        icon="person"
                        title="Data Controller"
                        value="Your Brokerage"
                        desc="You decide what data is collected and how it's used."
                    />
                    <DpaSummaryCard
                        icon="cloud_sync"
                        title="Data Processor"
                        value="IBMS Platform"
                        desc="We process data strictly per your instructions."
                    />
                    <DpaSummaryCard
                        icon="account_balance"
                        title="Compliance"
                        value="Ghana DPA 2012"
                        desc="Full compliance with Act 843 and NIC guidelines."
                    />
                </div>
            </div>
        </div>
    );
}

function DpaSummaryCard({ icon, title, value, desc }: { icon: string; title: string; value: string; desc: string }) {
    return (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4 group hover:bg-white hover:shadow-md transition-all">
            <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-base font-black text-slate-900 uppercase tracking-tight mb-2">{value}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

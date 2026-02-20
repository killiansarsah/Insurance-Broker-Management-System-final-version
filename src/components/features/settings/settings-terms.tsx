'use client';

import { FileText, Shield, BookOpen, Scale, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SettingsTerms() {
    return (
        <div className="space-y-6">
            {/* Acceptance Status */}
            <Card padding="lg" className="bg-gradient-to-r from-primary-50/50 to-accent-50/30 border-primary-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-primary-100 flex items-center justify-center text-primary-600">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-surface-900">Legal Agreements</h3>
                            <p className="text-xs text-surface-500 font-medium mt-0.5">Review and manage your acceptance of platform policies.</p>
                        </div>
                    </div>
                    <Badge variant="success" className="px-3 py-1 font-bold uppercase text-[10px]">All Accepted</Badge>
                </div>
            </Card>

            {/* Terms of Service */}
            <Card padding="lg">
                <div className="flex items-start justify-between mb-6">
                    <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                            <FileText size={18} />
                        </div>
                        Terms of Service
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-surface-400">
                        <Clock size={12} />
                        <span className="font-medium">Accepted Feb 1, 2026</span>
                    </div>
                </div>
                <div className="prose prose-sm max-w-none">
                    <div className="p-6 rounded-2xl bg-surface-50 border border-surface-100 max-h-[240px] overflow-y-auto custom-scrollbar-subtle">
                        <h4 className="text-sm font-bold text-surface-900 mb-3">1. Acceptance of Terms</h4>
                        <p className="text-xs text-surface-600 leading-relaxed mb-4">
                            By accessing and using the Insurance Broker Management System (&quot;IBMS&quot;), you agree to be bound by these Terms of Service.
                            IBMS is a cloud-based platform designed for licensed insurance brokers operating in the Republic of Ghana
                            under the regulatory framework of the National Insurance Commission (NIC).
                        </p>

                        <h4 className="text-sm font-bold text-surface-900 mb-3">2. User Responsibilities</h4>
                        <p className="text-xs text-surface-600 leading-relaxed mb-4">
                            Users must maintain valid NIC licensure throughout their use of the platform. All data entered must be accurate
                            and comply with local insurance regulations. Users are responsible for safeguarding their login credentials
                            and must immediately report any unauthorized access.
                        </p>

                        <h4 className="text-sm font-bold text-surface-900 mb-3">3. Data Ownership</h4>
                        <p className="text-xs text-surface-600 leading-relaxed mb-4">
                            All client data, policy records, and business information entered into IBMS remains the property of the
                            subscribing brokerage firm. IBMS acts solely as a data processor and will not share, sell, or transfer
                            any tenant data without explicit written consent.
                        </p>

                        <h4 className="text-sm font-bold text-surface-900 mb-3">4. Service Availability</h4>
                        <p className="text-xs text-surface-600 leading-relaxed">
                            IBMS commits to maintaining a minimum uptime of 99.5% for Basic tier, 99.9% for Professional tier,
                            and 99.99% for Enterprise tier subscribers, measured on a monthly basis. Scheduled maintenance windows
                            will be communicated at least 48 hours in advance.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Privacy Policy */}
            <Card padding="lg">
                <div className="flex items-start justify-between mb-6">
                    <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                            <BookOpen size={18} />
                        </div>
                        Privacy Policy
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-surface-400">
                        <Clock size={12} />
                        <span className="font-medium">Accepted Feb 1, 2026</span>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-surface-50 border border-surface-100 max-h-[240px] overflow-y-auto custom-scrollbar-subtle">
                    <h4 className="text-sm font-bold text-surface-900 mb-3">Data Collection & Usage</h4>
                    <p className="text-xs text-surface-600 leading-relaxed mb-4">
                        IBMS collects personal information necessary for brokerage operations including: client names, contact details,
                        national identification numbers (Ghana Card), and financial information related to insurance policies.
                        This data is processed in compliance with the Ghana Data Protection Act, 2012 (Act 843).
                    </p>

                    <h4 className="text-sm font-bold text-surface-900 mb-3">Data Storage & Security</h4>
                    <p className="text-xs text-surface-600 leading-relaxed mb-4">
                        All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Data is stored within secure cloud
                        infrastructure with regular automated backups. Access is controlled via role-based access control (RBAC)
                        and multi-factor authentication (MFA).
                    </p>

                    <h4 className="text-sm font-bold text-surface-900 mb-3">Data Retention</h4>
                    <p className="text-xs text-surface-600 leading-relaxed">
                        Insurance records are retained for a minimum of six (6) years in compliance with NIC regulations.
                        Upon account termination, tenants may request full data export within 90 days.
                        After the retention period, data is securely purged using industry-standard methods.
                    </p>
                </div>
            </Card>

            {/* Data Processing Agreement */}
            <Card padding="lg">
                <div className="flex items-start justify-between mb-6">
                    <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                            <Scale size={18} />
                        </div>
                        Data Processing Agreement (DPA)
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-surface-400">
                        <Clock size={12} />
                        <span className="font-medium">Accepted Feb 1, 2026</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DpaSummaryCard
                        title="Data Controller"
                        value="Your Brokerage"
                        desc="You decide what data is collected and how it's used."
                    />
                    <DpaSummaryCard
                        title="Data Processor"
                        value="IBMS Platform"
                        desc="We process data strictly per your instructions."
                    />
                    <DpaSummaryCard
                        title="Compliance"
                        value="Ghana DPA 2012"
                        desc="Full compliance with Act 843 and NIC guidelines."
                    />
                </div>
            </Card>
        </div>
    );
}

function DpaSummaryCard({ title, value, desc }: { title: string; value: string; desc: string }) {
    return (
        <div className="p-4 rounded-2xl bg-surface-50 border border-surface-100">
            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-2">{title}</p>
            <p className="text-sm font-bold text-surface-900 mb-1">{value}</p>
            <p className="text-xs text-surface-500 leading-relaxed">{desc}</p>
        </div>
    );
}

'use client';

import { useState } from 'react';
import {
    Shield,
    CheckCircle,
    AlertTriangle,
    Search,
    FileText,
    UserCheck,
    XCircle,
    Download
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockClients } from '@/mock/clients';
import { cn } from '@/lib/utils';

export default function CompliancePage() {
    const [pepSearch, setPepSearch] = useState('');
    const [pepResult, setPepResult] = useState<null | 'clean' | 'match'>(null);
    const [isSearching, setIsSearching] = useState(false);

    const pendingKyc = mockClients.filter(c => c.kycStatus === 'pending');
    const highRisk = mockClients.filter(c => c.amlRiskLevel === 'high' || c.amlRiskLevel === 'critical');

    function handlePepSearch() {
        if (!pepSearch) return;
        setIsSearching(true);
        setPepResult(null);
        setTimeout(() => {
            setIsSearching(false);
            setPepResult(Math.random() > 0.7 ? 'match' : 'clean'); // Mock logic
        }, 1500);
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Compliance Dashboard</h1>
                    <p className="text-sm text-surface-500 mt-1">Review KYC, AML screening, and risk assessments.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export Report</Button>
                    <Button variant="primary" leftIcon={<Shield size={16} />}>Run Batch Screening</Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600"><UserCheck size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Verified Clients</p>
                        <p className="text-xl font-bold text-surface-900">{((mockClients.filter(c => c.kycStatus === 'verified').length / mockClients.length) * 100).toFixed(0)}%</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-warning-50 text-warning-600"><FileText size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Pending Review</p>
                        <p className="text-xl font-bold text-surface-900">{pendingKyc.length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-danger-50 text-danger-600"><AlertTriangle size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">High Risk</p>
                        <p className="text-xl font-bold text-surface-900">{highRisk.length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-surface-100 text-surface-600"><Shield size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Screenings Today</p>
                        <p className="text-xl font-bold text-surface-900">124</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending KYC Reviews */}
                <Card padding="none" className="lg:col-span-2 min-h-[400px]">
                    <CardHeader
                        title="Pending KYC Reviews"
                        action={<Button variant="outline" size="sm">View All</Button>}
                    />
                    <div className="divide-y divide-surface-100">
                        {pendingKyc.slice(0, 5).map(client => (
                            <div key={client.id} className="p-4 flex items-center justify-between hover:bg-surface-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-500 font-bold text-xs">
                                        {client.firstName?.[0] || client.companyName?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{client.firstName ? `${client.firstName} ${client.lastName}` : client.companyName}</p>
                                        <p className="text-xs text-surface-400">ID: {client.clientNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-warning-50 text-warning-700 border border-warning-200">
                                        Submit: {new Date(client.createdAt).toLocaleDateString()}
                                    </span>
                                    <Button size="sm" variant="outline">Review</Button>
                                </div>
                            </div>
                        ))}
                        {pendingKyc.length === 0 && (
                            <div className="p-8 text-center text-surface-500">
                                No pending reviews.
                            </div>
                        )}
                    </div>
                </Card>

                {/* PEP Screening Tool */}
                <div className="space-y-6">
                    <Card padding="lg">
                        <CardHeader title="Quick AML/PEP Screen" />
                        <div className="mt-4 space-y-4">
                            <p className="text-sm text-surface-500">Check a name against global watchlists.</p>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Enter full name..."
                                    value={pepSearch}
                                    onChange={(e) => setPepSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                />
                            </div>
                            <Button className="w-full" variant="primary" onClick={handlePepSearch} disabled={isSearching || !pepSearch}>
                                {isSearching ? 'Screening...' : 'Screen Name'}
                            </Button>

                            {pepResult && (
                                <div className={cn(
                                    "p-3 rounded-[var(--radius-md)] border text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1",
                                    pepResult === 'clean' ? "bg-success-50 border-success-200 text-success-800" : "bg-danger-50 border-danger-200 text-danger-800"
                                )}>
                                    {pepResult === 'clean' ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
                                    <div>
                                        <p className="font-bold">{pepResult === 'clean' ? 'No Matches Found' : 'Potential Match Detected'}</p>
                                        <p className="text-xs opacity-90">{pepResult === 'clean' ? 'Clear to proceed.' : 'Review required. Source: OFAC List.'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card padding="lg">
                        <CardHeader title="High Risk Clients" />
                        <div className="mt-4 space-y-3">
                            {highRisk.slice(0, 3).map(client => (
                                <div key={client.id} className="flex items-start gap-3 p-2 bg-danger-50/50 rounded-[var(--radius-md)]">
                                    <AlertTriangle size={16} className="text-danger-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-danger-900">{client.firstName ? `${client.firstName} ${client.lastName}` : client.companyName}</p>
                                        <p className="text-xs text-danger-700">Risk Level: {client.amlRiskLevel}</p>
                                    </div>
                                </div>
                            ))}
                            {highRisk.length === 0 && (
                                <p className="text-sm text-surface-500 italic">No high risk clients.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

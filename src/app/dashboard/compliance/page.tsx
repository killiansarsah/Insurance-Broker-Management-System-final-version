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
import { useComplianceSummary, useKycQueue, useAmlScreening, usePepSearch } from '@/hooks/api/use-compliance';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CompliancePage() {
    const [pepSearch, setPepSearch] = useState('');
    const [pepResult, setPepResult] = useState<null | { result: 'clean' | 'match'; matches: Array<{ id: string; name: string; source: string }> }>(null);
    const pepSearchMutation = usePepSearch();

    const { data: summary } = useComplianceSummary();
    const { data: kycQueue } = useKycQueue();
    const { data: amlData } = useAmlScreening();

    const pendingKyc = (kycQueue as Record<string, unknown>[] | undefined) ?? [];
    const highRisk = (amlData as Record<string, unknown>[] | undefined) ?? [];
    const summaryData = summary as { kyc?: { pending?: number; verified?: number; rejected?: number; expired?: number }; aml?: { high?: number; critical?: number }; complaintSla?: { breached?: number } } | undefined;

    const totalClients = summaryData ? (summaryData.kyc?.pending ?? 0) + (summaryData.kyc?.verified ?? 0) + (summaryData.kyc?.rejected ?? 0) + (summaryData.kyc?.expired ?? 0) : 0;
    const verifiedPct = totalClients > 0 ? Math.round(((summaryData?.kyc?.verified ?? 0) / totalClients) * 100) : 0;

    function handlePepSearch() {
        if (!pepSearch) return;
        setPepResult(null);
        pepSearchMutation.mutate(pepSearch, {
            onSuccess: (data: any) => {
                setPepResult(data);
            },
            onError: () => {
                toast.error('PEP search failed. Please try again.');
            },
        });
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
                    <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => toast.success('Export Started', { description: 'Compliance report is being generated.' })}>Export Report</Button>
                    <Button variant="primary" leftIcon={<Shield size={16} />} onClick={() => toast.info('Batch Screening', { description: 'Running AML/PEP screening against all active clients...' })}>Run Batch Screening</Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600"><UserCheck size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Verified Clients</p>
                        <p className="text-xl font-bold text-surface-900">{verifiedPct}%</p>
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
                        action={<Button variant="outline" size="sm" onClick={() => toast.info('All pending KYC reviews', { description: 'Navigate to Clients to see full KYC status.' })}>View All</Button>}
                    />
                    <div className="divide-y divide-surface-100">
                        {pendingKyc.slice(0, 5).map((client: Record<string, unknown>) => (
                            <div key={client.id as string} className="p-4 flex items-center justify-between hover:bg-surface-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-500 font-bold text-xs">
                                        {((client.clientName as string) ?? '?')[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{client.clientName as string}</p>
                                        <p className="text-xs text-surface-400">ID: {client.clientNumber as string}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-warning-50 text-warning-700 border border-warning-200">
                                        {client.daysPending as number} days pending
                                    </span>
                                    <Button size="sm" variant="outline" onClick={() => toast.info('KYC Review', { description: `Opening review for ${client.clientName as string}.` })}>Review</Button>
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
                            <Button className="w-full" variant="primary" onClick={handlePepSearch} disabled={pepSearchMutation.isPending || !pepSearch}>
                                {pepSearchMutation.isPending ? 'Screening...' : 'Screen Name'}
                            </Button>

                            {pepResult && (
                                <div className={cn(
                                    "p-3 rounded-[var(--radius-md)] border text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1",
                                    pepResult.result === 'clean' ? "bg-success-50 border-success-200 text-success-800" : "bg-danger-50 border-danger-200 text-danger-800"
                                )}>
                                    {pepResult.result === 'clean' ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
                                    <div>
                                        <p className="font-bold">{pepResult.result === 'clean' ? 'No Matches Found' : `${pepResult.matches?.length ?? 0} Potential Match(es) Detected`}</p>
                                        <p className="text-xs opacity-90">{pepResult.result === 'clean' ? 'Clear to proceed.' : pepResult.matches?.map(m => `${m.name} (${m.source})`).join(', ')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card padding="lg">
                        <CardHeader title="High Risk Clients" />
                        <div className="mt-4 space-y-3">
                            {highRisk.slice(0, 3).map((client: Record<string, unknown>) => (
                                <div key={client.id as string} className="flex items-start gap-3 p-2 bg-danger-50/50 rounded-[var(--radius-md)]">
                                    <AlertTriangle size={16} className="text-danger-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-danger-900">{client.clientName as string}</p>
                                        <p className="text-xs text-danger-700">Risk Level: {client.amlRiskLevel as string}</p>
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

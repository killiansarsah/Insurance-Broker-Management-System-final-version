'use client';

import { useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    DollarSign,
    Shield
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNicQuarterlyReturn } from '@/hooks/api/use-reports';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NicQuarterlyReturnPage() {
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
    const [year, setYear] = useState(currentYear);
    const [quarter, setQuarter] = useState(currentQuarter);

    const { data: rawData, isLoading } = useNicQuarterlyReturn(year, quarter);
    const data = rawData as Record<string, unknown> | undefined;

    const premiums = data?.premiums as Record<string, unknown> | undefined;
    const policies = data?.policies as Record<string, unknown> | undefined;
    const claims = data?.claims as Record<string, unknown> | undefined;
    const commissions = data?.commissions as Record<string, unknown> | undefined;
    const remittances = data?.remittances as Record<string, unknown> | undefined;
    const complaints = data?.complaints as Record<string, unknown> | undefined;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">NIC Quarterly Return</h1>
                    <p className="text-sm text-surface-500 mt-1">Regulatory filing data for the National Insurance Commission.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                        {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <select
                        value={quarter}
                        onChange={(e) => setQuarter(Number(e.target.value))}
                        className="px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                        {[1, 2, 3, 4].map(q => (
                            <option key={q} value={q}>Q{q}</option>
                        ))}
                    </select>
                    <Button variant="primary" leftIcon={<Download size={16} />} onClick={handleExcel}>
                        Export Filing
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-40 bg-surface-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Premium & Policy Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card padding="md" className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary-50 text-primary-600"><DollarSign size={20} /></div>
                            <div>
                                <p className="text-xs font-semibold text-surface-500 uppercase">Gross Premium</p>
                                <p className="text-xl font-bold text-surface-900">{formatCurrency(Number(premiums?.total ?? 0))}</p>
                            </div>
                        </Card>
                        <Card padding="md" className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-blue-50 text-blue-600"><FileText size={20} /></div>
                            <div>
                                <p className="text-xs font-semibold text-surface-500 uppercase">New Policies</p>
                                <p className="text-xl font-bold text-surface-900">{Number(policies?.newPolicies ?? 0)}</p>
                            </div>
                        </Card>
                        <Card padding="md" className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-green-50 text-green-600"><TrendingUp size={20} /></div>
                            <div>
                                <p className="text-xs font-semibold text-surface-500 uppercase">Active Policies</p>
                                <p className="text-xl font-bold text-surface-900">{Number(policies?.activePolicies ?? 0)}</p>
                            </div>
                        </Card>
                        <Card padding="md" className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-warning-50 text-warning-600"><AlertTriangle size={20} /></div>
                            <div>
                                <p className="text-xs font-semibold text-surface-500 uppercase">Claims Ratio</p>
                                <p className="text-xl font-bold text-surface-900">{Number(claims?.claimsRatio ?? 0).toFixed(1)}%</p>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Claims Summary */}
                        <Card padding="lg">
                            <CardHeader title="Claims Summary" />
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-600">Total Claims Filed</span>
                                    <span className="text-sm font-bold text-surface-900">{Number(claims?.totalClaims ?? 0)}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-600">Claims Settled</span>
                                    <span className="text-sm font-bold text-surface-900">{Number(claims?.settledClaims ?? 0)}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-600">Total Claim Amount</span>
                                    <span className="text-sm font-bold text-surface-900">{formatCurrency(Number(claims?.totalAmount ?? 0))}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-surface-600">Loss Ratio</span>
                                    <span className={cn(
                                        "text-sm font-bold",
                                        Number(claims?.claimsRatio ?? 0) > 70 ? "text-danger-600" : "text-success-600"
                                    )}>{Number(claims?.claimsRatio ?? 0).toFixed(1)}%</span>
                                </div>
                            </div>
                        </Card>

                        {/* Commission & Levy */}
                        <Card padding="lg">
                            <CardHeader title="Commission & NIC Levy" />
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-600">Commission Earned</span>
                                    <span className="text-sm font-bold text-surface-900">{formatCurrency(Number(commissions?.totalEarned ?? 0))}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-600">NIC Levy (1%)</span>
                                    <span className="text-sm font-bold text-warning-600">{formatCurrency(Number(commissions?.nicLevy ?? 0))}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-surface-600">Net Commission</span>
                                    <span className="text-sm font-bold text-success-600">{formatCurrency(Number(commissions?.netCommission ?? 0))}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Remittance Status */}
                        <Card padding="lg">
                            <CardHeader title="Remittance Status" />
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-600">Total Remitted</span>
                                    <span className="text-sm font-bold text-success-600">{formatCurrency(Number(remittances?.totalRemitted ?? 0))}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-600">Pending Remittance</span>
                                    <span className="text-sm font-bold text-warning-600">{formatCurrency(Number(remittances?.totalPending ?? 0))}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-surface-600">Remittance Count</span>
                                    <span className="text-sm font-bold text-surface-900">{Number(remittances?.count ?? 0)}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Complaint SLA */}
                        <Card padding="lg">
                            <CardHeader title="Complaint SLA Compliance" />
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <span className="text-sm text-surface-600">Total Complaints</span>
                                    <span className="text-sm font-bold text-surface-900">{Number(complaints?.total ?? 0)}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-100">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-success-500" />
                                        <span className="text-sm text-surface-600">Within SLA</span>
                                    </div>
                                    <span className="text-sm font-bold text-success-600">{Number(complaints?.total ?? 0) - Number(complaints?.slaBreaches ?? 0)}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={14} className="text-danger-500" />
                                        <span className="text-sm text-surface-600">SLA Breaches</span>
                                    </div>
                                    <span className="text-sm font-bold text-danger-600">{Number(complaints?.slaBreaches ?? 0)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}

'use client';

import { useState, useMemo } from 'react';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FileText,
    Plus,
    TrendingUp,
    Clock,
    AlertCircle,
    X,
    Download,
    Eye,
    Pencil,
    RotateCcw,
    Ban,
    CalendarDays,
    ShieldAlert,
    Activity,
    Upload,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CustomSelect } from '@/components/ui/select-custom';
import { usePolicies, usePolicyMetrics, useCancelPolicy, useBulkAssignPolicies } from '@/hooks/api';
import { useUsers } from '@/hooks/api/use-users';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { Policy, PolicyStatus, InsuranceType } from '@/types';
import Link from 'next/link';
import { toast } from 'sonner';
import { AppLoader } from '@/components/ui/AppLoader';

const INSURANCE_TYPES: { label: string; value: InsuranceType }[] = [
    { label: 'Motor', value: 'MOTOR' },
    { label: 'Fire', value: 'FIRE' },
    { label: 'Marine', value: 'MARINE' },
    { label: 'Life', value: 'LIFE' },
    { label: 'Health', value: 'HEALTH' },
    { label: 'Liability', value: 'LIABILITY' },
    { label: 'Engineering', value: 'ENGINEERING' },
    { label: 'Bonds', value: 'BONDS' },
    { label: 'Travel', value: 'TRAVEL' },
    { label: 'Agriculture', value: 'AGRICULTURE' },
    { label: 'Oil & Gas', value: 'OIL_GAS' },
    { label: 'Aviation', value: 'AVIATION' },
    { label: 'Professional Indemnity', value: 'PROFESSIONAL_INDEMNITY' },
    { label: 'Other', value: 'OTHER' },
];

async function exportToExcel(policies: any[]) {
    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Policies');

        const headers = [
            'POLICY NUMBER', 'CLIENT', 'INSURANCE TYPE', 'COVERAGE',
            'STATUS', 'INSURER', 'PREMIUM (GHS)', 'SUM INSURED (GHS)',
            'INCEPTION', 'EXPIRY', 'BROKER', 'COMMISSION RATE',
            'COMMISSION AMT', 'PAYMENT STATUS'
        ];

        // 1. Title Rows
        sheet.mergeCells('A1:N1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = `Brokerium — Policies Export — ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
        titleCell.font = { bold: true, size: 14 };

        sheet.mergeCells('A2:N2');
        const subTitleCell = sheet.getCell('A2');
        subTitleCell.value = `Total policies: ${policies.length} | Generated: ${new Date().toLocaleString('en-GB')}`;

        // Blank Row 3
        sheet.addRow([]);

        // 2. Header Row Styling — Premium multi-color by category
        const headerRow = sheet.getRow(4);
        headerRow.values = headers;
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };

        // Color-code headers by category
        headerRow.eachCell((cell) => {
            const text = cell.value?.toString() || '';
            let bgColor = 'FF374151'; // Default Gray 700

            const identity = ['POLICY NUMBER', 'CLIENT', 'INSURANCE TYPE', 'COVERAGE', 'STATUS'];
            const insurer = ['INSURER'];
            const financial = ['PREMIUM (GHS)', 'SUM INSURED (GHS)', 'COMMISSION RATE', 'COMMISSION AMT', 'PAYMENT STATUS'];
            const dates = ['INCEPTION', 'EXPIRY'];
            const broker = ['BROKER'];

            if (identity.includes(text)) bgColor = 'FFEA580C'; // Orange 600
            else if (insurer.includes(text)) bgColor = 'FF1D4ED8'; // Blue 700
            else if (financial.includes(text)) bgColor = 'FF047857'; // Emerald 700
            else if (dates.includes(text)) bgColor = 'FF4338CA'; // Indigo 700
            else if (broker.includes(text)) bgColor = 'FF0F766E'; // Teal 700

            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: bgColor },
            };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF1E293B' } },
                left: { style: 'thin', color: { argb: 'FF1E293B' } },
                bottom: { style: 'thin', color: { argb: 'FF1E293B' } },
                right: { style: 'thin', color: { argb: 'FF1E293B' } },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        // Freeze top 4 rows
        sheet.views = [{ state: 'frozen', ySplit: 4 }];

        // 3. Data Rows & Alternating Colors with borders
        policies.forEach((p, index) => {
            const rowData = [
                p.policyNumber || '-',
                p.clientName || '-',
                p.insuranceType || '-',
                p.coverageType || '-',
                p.status || '-',
                p.insurerName || '-',
                Number(p.premiumAmount || 0),
                Number(p.sumInsured || 0),
                p.inceptionDate ? new Date(p.inceptionDate).toLocaleDateString('en-GB') : '-',
                p.expiryDate ? new Date(p.expiryDate).toLocaleDateString('en-GB') : '-',
                p.brokerName || '-',
                p.commissionRate ? `${p.commissionRate}%` : '0%',
                Number(p.commissionAmount || 0),
                p.paymentStatus || '-'
            ];

            const row = sheet.addRow(rowData);
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC' }, // White / Slate 50
            };
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        });

        // 4. Footer & Column Widths
        const bottomRow = sheet.addRow([`Total records exported: ${policies.length}`]);
        bottomRow.font = { bold: true };

        sheet.columns.forEach((column) => {
            column.width = 18;
        });
        sheet.getColumn(2).width = 30; // Client Config
        sheet.getColumn(6).width = 25; // Insurer Config

        // 5. Generate and Download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Policies_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success(`Exported ${policies.length} policies to Excel`);
    } catch (error) {
        console.error('Export error:', error);
        toast.error('Failed to generate Excel file');
    }
}

export default function PoliciesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type') as 'MOTOR' | 'non-motor' | null;

    // Server-side pagination state
    const [ssPage, setSsPage] = useState(1);
    const [ssPageSize, setSsPageSize] = useState(10);
    const [ssSearch, setSsSearch] = useState('');
    
    const { data: policiesData, isLoading } = usePolicies({
        page: ssPage,
        limit: ssPageSize,
        ...(ssSearch && { search: ssSearch }),
        ...(typeParam && { 
            insuranceType: typeParam === 'MOTOR' ? 'MOTOR' : 'non-motor' 
        }),
    });
    const { data: metricsData } = usePolicyMetrics(
        typeParam ? { insuranceType: typeParam } : undefined
    );

    const policies: any[] = (policiesData as any)?.items ?? (policiesData as any)?.data ?? (Array.isArray(policiesData) ? policiesData : []);
    
    const [selectedPolicies, setSelectedPolicies] = useState<any[]>([]);
    const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
    const [showBulkRenewModal, setShowBulkRenewModal] = useState(false);
    
    // Action Modals State
    const [actionPolicy, setActionPolicy] = useState<any>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRenewalModal, setShowRenewalModal] = useState(false);
    const cancelPolicyMutation = useCancelPolicy();

    // ─── Renewal Modal ───────────────────────────────────────────────────────
    const renderRenewalModal = () => {
        if (!showRenewalModal || !actionPolicy) return null;
        const newInception = actionPolicy.expiryDate;
        const newExpiry = (() => {
            const d = new Date(actionPolicy.expiryDate);
            d.setFullYear(d.getFullYear() + 1);
            return d.toISOString().split('T')[0];
        })();
        return (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowRenewalModal(false)}>
                <div className="bg-background rounded-2xl shadow-xl w-full max-w-lg p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-bold text-surface-900 mb-4">Renew Policy</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-surface-50 rounded-lg space-y-2">
                            <p className="text-xs text-surface-500">Current Policy</p>
                            <span className="text-[11px] font-mono text-surface-500 bg-surface-100/80 border border-surface-200/50 px-2.5 py-1 rounded-md tracking-wide">{actionPolicy.policyNumber}</span>
                            <p className="text-xs text-surface-500">{formatDate(actionPolicy.inceptionDate)} → {formatDate(actionPolicy.expiryDate)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-surface-700 block mb-1">New Inception</label>
                                <input type="date" defaultValue={newInception} className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 block mb-1">New Expiry</label>
                                <input type="date" defaultValue={newExpiry} className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 block mb-1">New Premium (GHS)</label>
                            <input type="number" defaultValue={actionPolicy.premiumAmount} step="0.01" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                        </div>
                        <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                            <p className="text-xs text-primary-600">Tax breakdown will be auto-calculated: VAT 15%, NHIL 2.5%, GETFund 2.5%</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowRenewalModal(false)}>Cancel</Button>
                            <Button
                                variant="primary"
                                className="flex-1"
                                onClick={() => {
                                    toast.success(`Policy ${actionPolicy.policyNumber} renewed successfully`);
                                    setShowRenewalModal(false);
                                }}
                            >
                                Confirm Renewal
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Cancel Modal ────────────────────────────────────────────────────────
    const renderCancelModal = () => {
        if (!showCancelModal || !actionPolicy) return null;
        return (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowCancelModal(false)}>
                <div className="bg-background rounded-2xl shadow-xl w-full max-w-lg p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-bold text-danger-600 mb-4 flex items-center gap-2">
                        <Ban size={20} /> Cancel Policy
                    </h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        cancelPolicyMutation.mutate({
                            id: actionPolicy.id,
                            reason: formData.get('cancelReason') as string,
                            effectiveDate: formData.get('cancelEffectiveDate') as string,
                        }, {
                            onSuccess: () => {
                                toast.success(`Policy ${actionPolicy.policyNumber} cancellation submitted`);
                                setShowCancelModal(false);
                            },
                            onError: (err: any) => {
                                toast.error('Failed to cancel policy', { description: err?.response?.data?.message || 'Please try again.' });
                            },
                        });
                    }} className="space-y-4">
                        <div className="p-4 bg-danger-50/50 rounded-lg border border-danger-100">
                            <p className="text-sm text-danger-700">
                                You are about to cancel policy <strong>{actionPolicy.policyNumber}</strong> for <strong>{actionPolicy.clientName}</strong>.
                                This action will notify the insurer and update the policy status.
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 dark:text-slate-300 block mb-1">Cancellation Reason</label>
                            <select name="cancelReason" className="w-full border border-surface-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30" required>
                                <option value="">Select reason...</option>
                                <option value="NON_PAYMENT">Non-payment of premium</option>
                                <option value="CLIENT_REQUEST">Client request</option>
                                <option value="INSURER_CANCELLATION">Insurer request</option>
                                <option value="MISREPRESENTATION">Fraud / Misrepresentation</option>
                                <option value="DUPLICATE_POLICY">Replaced by another policy</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 dark:text-slate-300 block mb-1">Effective Date</label>
                            <input name="cancelEffectiveDate" type="date" className="w-full border border-surface-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 dark:text-slate-300 block mb-1">Notes</label>
                            <textarea rows={3} className="w-full border border-surface-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30" placeholder="Additional notes..." />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-surface-700 dark:text-slate-300 block mb-1">Estimated Refund (GHS)</label>
                            <input type="number" step="0.01" className="w-full border border-surface-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30" placeholder="0.00" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>Go Back</Button>
                            <Button type="submit" variant="danger" className="flex-1">Confirm Cancellation</Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    
    const { data: usersData } = useUsers();
    const allUsers: any[] = (usersData as any)?.items ?? (usersData as any)?.data ?? (Array.isArray(usersData) ? usersData : []);

    const BROKERS = useMemo(() => {
        return allUsers
            .map((u: any) => ({ 
                label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email, 
                value: String(u.id) 
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [allUsers]);

    const [filterStatus, setFilterStatus] = useState<PolicyStatus | ''>('');
    const [filterType, setFilterType] = useState<InsuranceType | ''>('');
    const [filterBroker, setFilterBroker] = useState('');
    const [bulkOfficerId, setBulkOfficerId] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const bulkAssignMutation = useBulkAssignPolicies();

    // base filtering on 'type' query param
    const baseData = useMemo(() => policies.filter((p) => {
        if (!typeParam) return true;
        if (typeParam === 'MOTOR') return p.insuranceType === 'MOTOR';
        if (typeParam === 'non-motor') return p.insuranceType !== 'MOTOR';
        return true;
    }), [policies, typeParam]);

    const filtered = useMemo(() => baseData.filter((p) => {
        if (filterStatus && p.status !== filterStatus) return false;
        if (filterType && p.insuranceType !== filterType) return false;
        if (filterBroker && p.brokerName !== filterBroker) return false;
        if (filterDateFrom && (p.inceptionDate as string) < filterDateFrom) return false;
        if (filterDateTo && (p.inceptionDate as string) > filterDateTo) return false;
        return true;
    }), [baseData, filterStatus, filterType, filterBroker, filterDateFrom, filterDateTo]);

    // KPI Calculations
    const activePoliciesCount = metricsData?.activePolicies ?? 0;
    const totalPremiumCount = metricsData?.totalPremium ?? 0;
    const expiringSoonCount = metricsData?.expiringSoon ?? 0;
    const pendingDraftCount = metricsData?.pendingDraft ?? 0;
    const lapsedPoliciesCount = metricsData?.lapsedPolicies ?? 0;
    const newThisMonthCount = metricsData?.newThisMonth ?? 0;

    const kpis = [
        {
            label: `Active ${typeParam ? (typeParam === 'MOTOR' ? 'Motor' : 'Non-Motor') : ''} Policies`,
            value: activePoliciesCount,
            icon: <FileText size={22} strokeWidth={2.5} />,
            color: 'text-primary-600 bg-primary-50 ring-primary-100',
            borderColor: 'bg-primary-500',
        },
        {
            label: 'Total Premium',
            value: formatCurrency(totalPremiumCount),
            icon: <TrendingUp size={22} strokeWidth={2.5} />,
            color: 'text-success-600 bg-success-50 ring-success-100',
            borderColor: 'bg-success-500',
        },
        {
            label: 'Expiring ≤30d',
            value: expiringSoonCount,
            icon: <Clock size={22} strokeWidth={2.5} />,
            color: 'text-accent-600 bg-accent-50 ring-accent-100',
            borderColor: 'bg-accent-500',
        },
        {
            label: 'Pending / Draft',
            value: pendingDraftCount,
            icon: <AlertCircle size={22} strokeWidth={2.5} />,
            color: 'text-warning-600 bg-warning-50 ring-warning-100',
            borderColor: 'bg-warning-500',
        },
        {
            label: 'Lapsed',
            value: lapsedPoliciesCount,
            icon: <ShieldAlert size={22} strokeWidth={2.5} />,
            color: 'text-danger-600 bg-danger-50 ring-danger-100',
            borderColor: 'bg-danger-500',
        },
        {
            label: 'New This Month',
            value: newThisMonthCount,
            icon: <Activity size={22} strokeWidth={2.5} />,
            color: 'text-info-600 bg-info-50 ring-info-100',
            borderColor: 'bg-info-500',
        },
    ];

    const hasFilters = filterStatus || filterType || filterBroker || filterDateFrom || filterDateTo;

    const columns = [
        {
            key: 'policyNumber',
            label: 'Policy #',
            sortable: true,
            render: (row: Policy) => (
                <span className="text-[11px] font-mono text-surface-500 bg-surface-100/80 border border-surface-200/50 px-2.5 py-1 rounded-md tracking-wide">{row.policyNumber}</span>
            ),
        },
        {
            key: 'clientName',
            label: 'Client',
            sortable: true,
            render: (row: Policy) => (
                <p className="text-sm font-semibold text-surface-900">{row.clientName}</p>
            ),
        },
        {
            key: 'insuranceType',
            label: 'Type',
            sortable: true,
            render: (row: Policy) => (
                <div>
                    <span className="text-sm text-surface-700 capitalize">{row.insuranceType.replace(/_/g, ' ')}</span>
                    {row.coverageType && (
                        <p className="text-[11px] text-surface-400">{row.coverageType}</p>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row: Policy) => (
                <div className="flex items-center gap-2">
                    <StatusBadge status={row.status} />
                    {row.isRenewal && (
                        <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full">RENEWAL</span>
                    )}
                </div>
            ),
        },
        {
            key: 'insurerName',
            label: 'Insurer',
            sortable: true,
            render: (row: Policy) => (
                <span className="text-sm text-surface-600">{row.insurerName}</span>
            ),
        },
        {
            key: 'premiumAmount',
            label: 'Premium',
            sortable: true,
            render: (row: Policy) => (
                <div>
                    <span className="text-sm font-semibold text-surface-700">{formatCurrency(row.premiumAmount)}</span>
                    {row.paymentStatus === 'OVERDUE' && (
                        <span className="ml-1 text-[10px] font-semibold text-danger-600 bg-danger-50 px-1 py-0.5 rounded">OVERDUE</span>
                    )}
                    {row.paymentStatus === 'PARTIAL' && (
                        <span className="ml-1 text-[10px] font-semibold text-warning-600 bg-warning-50 px-1 py-0.5 rounded">PARTIAL</span>
                    )}
                </div>
            ),
        },
        {
            key: 'sumInsured',
            label: 'Sum Insured',
            sortable: true,
            render: (row: Policy) => (
                <span className="text-sm text-surface-600">{formatCurrency(row.sumInsured)}</span>
            ),
        },
        {
            key: 'inceptionDate',
            label: 'Period',
            render: (row: Policy) => (
                <div>
                    <span className="text-xs text-surface-500">
                        {formatDate(row.inceptionDate)} → {formatDate(row.expiryDate)}
                    </span>
                    {row.status === 'ACTIVE' && row.daysToExpiry !== undefined && row.daysToExpiry <= 60 && (
                        <p className={cn('text-[10px] font-semibold', row.daysToExpiry <= 30 ? 'text-danger-600' : 'text-warning-600')}>
                            {row.daysToExpiry}d remaining
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'brokerName',
            label: 'Broker',
            sortable: true,
            render: (row: Policy) => (
                <span className="text-sm text-surface-600">{row.brokerName}</span>
            ),
        },
        {
            key: 'actions' as keyof Policy,
            label: 'Actions',
            render: (row: Policy) => (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-primary-600 transition-colors cursor-pointer"
                        title="View"
                        onClick={() => router.push(`/dashboard/policies/${row.id}`)}
                    >
                        <Eye size={15} />
                    </button>
                    {row.status === 'ACTIVE' && (
                        <button
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-success-600 transition-colors cursor-pointer"
                            title="Renew"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActionPolicy(row);
                                setShowRenewalModal(true);
                            }}
                        >
                            <RotateCcw size={15} />
                        </button>
                    )}
                    {(row.status === 'ACTIVE' || row.status === 'PENDING') && (
                        <button
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-danger-600 transition-colors cursor-pointer"
                            title="Cancel"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActionPolicy(row);
                                setShowCancelModal(true);
                            }}
                        >
                            <Ban size={15} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const getPageTitle = () => {
        if (typeParam === 'MOTOR') return 'Motor Policies';
        if (typeParam === 'non-motor') return 'Non-Motor Policies';
        return 'All Policies';
    };

    if (isLoading) {
        return <AppLoader message="Loading policies..." isLoading={true} />;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{getPageTitle()}</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Manage {typeParam ? (typeParam === 'MOTOR' ? 'MOTOR' : 'non-motor') : 'insurance'} policies and renewals.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {typeParam && (
                        <Link href="/dashboard/policies">
                            <Button variant="outline" size="sm" className="bg-white hover:bg-surface-50 text-surface-700 shadow-sm font-semibold rounded-full px-4 hover:-translate-y-0.5 transition-all duration-300">
                                View All
                            </Button>
                        </Link>
                    )}
                    <Link href="/dashboard/policies/new">
                        <Button 
                            variant="primary" 
                            className="shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 font-bold group rounded-full px-5"
                            leftIcon={<Plus size={16} className="transition-transform group-hover:rotate-90" />}
                        >
                            New Policy
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.label} padding="none" className="relative overflow-hidden group bg-white border-surface-200/60 hover:border-surface-300 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm ring-1 ring-inset',
                                    kpi.color
                                )}>
                                    {kpi.icon}
                                </div>
                                <div className="h-8 w-8 rounded-full bg-surface-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-0 translate-x-2">
                                    <TrendingUp size={14} className="text-surface-400" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-black text-surface-900 truncate tracking-tight mb-0.5" title={String(kpi.value)}>{kpi.value}</p>
                                <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest truncate" title={kpi.label}>{kpi.label}</p>
                            </div>
                        </div>
                        {/* Premium Gradient Overlay on hover */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-500",
                            kpi.borderColor
                        )} />
                        {/* Vibrant decorative bar at the bottom */}
                        <div className={cn(
                            "absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left",
                            kpi.borderColor
                        )} />
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <CustomSelect
                    label="Status"
                    options={[
                        { label: 'Active', value: 'ACTIVE' },
                        { label: 'Pending', value: 'PENDING' },
                        { label: 'Draft', value: 'DRAFT' },
                        { label: 'Expired', value: 'EXPIRED' },
                        { label: 'Cancelled', value: 'CANCELLED' },
                        { label: 'Lapsed', value: 'LAPSED' },
                        { label: 'Suspended', value: 'SUSPENDED' },
                    ]}
                    value={filterStatus}
                    onChange={(v) => setFilterStatus(String(v || '') as PolicyStatus | '')}
                    clearable
                />
                {!typeParam && (
                    <CustomSelect
                        label="Type"
                        options={INSURANCE_TYPES.map(t => ({ label: t.label, value: t.value }))}
                        value={filterType}
                        onChange={(v) => setFilterType(String(v || '') as InsuranceType | '')}
                        clearable
                    />
                )}
                <CustomSelect
                    label="Broker"
                    options={BROKERS}
                    value={filterBroker}
                    onChange={(v) => setFilterBroker(String(v || ''))}
                    clearable
                />
                <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-surface-400" />
                    <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        title="Inception from"
                    />
                    <span className="text-surface-400 text-xs">to</span>
                    <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        title="Inception to"
                    />
                </div>
                {hasFilters && (
                    <button
                        onClick={() => { setFilterStatus(''); setFilterType(''); setFilterBroker(''); setFilterDateFrom(''); setFilterDateTo(''); }}
                        className="inline-flex items-center gap-1 text-xs text-danger-600 font-medium hover:text-danger-700 cursor-pointer"
                    >
                        <X size={12} /> Clear all
                    </button>
                )}
            </div>

            {/* Data Table */}
            <DataTable<any>
                data={filtered}
                columns={columns}
                searchPlaceholder="Search by policy number, client, insurer, coverage…"
                searchKeys={['policyNumber', 'clientName', 'insurerName', 'insuranceType', 'coverageType', 'status', 'premiumAmount', 'brokerName']}
                onRowClick={(row) => router.push(`/dashboard/policies/${row.id}`)}
                emptyMessage={
                    typeParam
                        ? `No ${typeParam === 'MOTOR' ? 'MOTOR' : 'non-motor'} policies found.`
                        : 'No policies found.'
                }
                exportable={true}
                onExport={() => exportToExcel(filtered)}
                serverSide
                totalCount={(policiesData as any)?.meta?.total ?? 0}
                currentPage={ssPage}
                onPageChange={setSsPage}
                onSearchChange={setSsSearch}
                onPageSizeChange={setSsPageSize}
                loading={isLoading}
                selectable={true}
                selectedRows={selectedPolicies}
                onSelectionChange={setSelectedPolicies}
                headerActions={
                    <Link 
                        href="/dashboard/integrations#bulk-import"
                        className="group relative inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-primary-700 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_6px_16px_-4px_rgba(14,165,233,0.3)] dark:hover:shadow-[0_6px_16px_-4px_rgba(14,165,233,0.15)] hover:-translate-y-0.5 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300/60 dark:hover:border-primary-700/50 whitespace-nowrap"
                    >
                        {/* Subtle primary glow overlay */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-primary-400/0 via-primary-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Bouncing Upload Icon */}
                        <div className="relative overflow-hidden flex items-center justify-center w-[15px] h-[15px] z-10 p-0.5 mt-0.5 text-primary-600 dark:text-primary-500 transition-colors duration-300">
                             <Upload 
                                 size={15} 
                                 className="absolute transition-transform duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] group-hover:-translate-y-full group-hover:opacity-0" 
                             />
                             <Upload 
                                 size={15} 
                                 className="absolute translate-y-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] group-hover:translate-y-0 group-hover:opacity-100 group-active:scale-95" 
                             />
                        </div>
                        <span className="relative z-10 tracking-wide">Import</span>
                    </Link>
                }
            />
            {renderRenewalModal()}
            {renderCancelModal()}

            {/* Bulk Actions Floating Bar */}
            <div className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-white dark:bg-slate-900 border border-surface-200/60 dark:border-slate-700 p-2 pl-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                selectedPolicies.length > 0 ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95 pointer-events-none"
            )}>
                <div className="flex items-center gap-2 pr-2 border-r border-surface-200 dark:border-slate-700">
                    <span className="flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-xs w-6 h-6 rounded-full">{selectedPolicies.length}</span>
                    <span className="text-sm font-semibold text-surface-700 dark:text-slate-300">Selected</span>
                </div>
                
                <Button variant="ghost" size="sm" className="rounded-full text-surface-600 hover:bg-surface-100 hover:text-primary-600 font-semibold text-xs h-9" onClick={() => setShowBulkAssignModal(true)}>
                    Assign Officer
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-surface-600 hover:bg-surface-100 hover:text-primary-600 font-semibold text-xs h-9" onClick={() => setShowBulkRenewModal(true)}>
                    Send Renewals
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-surface-600 hover:bg-success-50 hover:text-success-600 font-semibold text-xs h-9" onClick={() => exportToExcel(selectedPolicies)}>
                    <Download size={14} className="mr-1.5" /> Export {selectedPolicies.length}
                </Button>
                <div className="w-px h-6 bg-surface-200 dark:bg-slate-700 mx-1" />
                <button 
                    onClick={() => setSelectedPolicies([])}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-danger-600 transition-colors cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Bulk Assign Modal */}
            {showBulkAssignModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowBulkAssignModal(false)}>
                    <div className="bg-background rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-surface-900 mb-2">Assign Officer</h2>
                        <p className="text-sm text-surface-500 mb-4">Select an officer to reassign {selectedPolicies.length} policies to.</p>
                        <select 
                            className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 mb-5 bg-white"
                            onChange={(e) => setBulkOfficerId(e.target.value)}
                            value={bulkOfficerId}
                        >
                            <option value="">Choose officer...</option>
                            {BROKERS.map(b => (
                                <option key={b.value} value={b.value}>{b.label}</option>
                            ))}
                        </select>
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowBulkAssignModal(false)}>Cancel</Button>
                            <Button
                                variant="primary"
                                className="flex-1"
                                disabled={!bulkOfficerId || bulkAssignMutation.isPending}
                                onClick={() => {
                                    if (!bulkOfficerId) return;
                                    toast.promise(
                                        new Promise((resolve, reject) => {
                                            bulkAssignMutation.mutate(
                                                { 
                                                    policyIds: selectedPolicies.map(p => p.id), 
                                                    userId: bulkOfficerId 
                                                },
                                                {
                                                    onSuccess: () => {
                                                        setShowBulkAssignModal(false);
                                                        setSelectedPolicies([]);
                                                        setBulkOfficerId('');
                                                        resolve(true);
                                                    },
                                                    onError: reject
                                                }
                                            );
                                        }),
                                        {
                                            loading: `Assigning ${selectedPolicies.length} policies...`,
                                            success: () => `Successfully reassigned ${selectedPolicies.length} policies`,
                                            error: 'Could not assign policies',
                                        }
                                    );
                                }}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Renew Modal */}
            {showBulkRenewModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowBulkRenewModal(false)}>
                    <div className="bg-background rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-surface-900 mb-2">Send Renewal Reminders</h2>
                        <p className="text-sm text-surface-500 mb-4">Are you sure you want to send automated renewal reminder emails to the clients of these {selectedPolicies.length} selected policies?</p>
                        <div className="p-3 bg-primary-50 text-primary-700 rounded-lg text-xs leading-relaxed mb-5 border border-primary-100">
                            Clients will receive an email containing a link to review and pay for their upcoming renewal online.
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowBulkRenewModal(false)}>Cancel</Button>
                            <Button
                                variant="primary"
                                className="flex-1"
                                onClick={() => {
                                    toast.promise(
                                        new Promise(resolve => setTimeout(resolve, 1200)),
                                        {
                                            loading: `Sending ${selectedPolicies.length} emails...`,
                                            success: () => {
                                                setShowBulkRenewModal(false);
                                                setSelectedPolicies([]);
                                                return `Sent renewal reminders for ${selectedPolicies.length} policies`;
                                            },
                                            error: 'Failed to send emails',
                                        }
                                    );
                                }}
                            >
                                Send Emails
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

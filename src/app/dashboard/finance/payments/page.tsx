'use client';

import { useState } from 'react';
import {
    CreditCard,
    CheckCircle2,
    Calendar,
    Download,
    Banknote,
    Smartphone,
    Building,
    FileCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { BackButton } from '@/components/ui/back-button';
import { useTransactions, useApproveTransaction, useRejectTransaction } from '@/hooks/api/use-finance';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';
import { StatusBadge } from '@/components/data-display/status-badge';
import Link from 'next/link';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { X, ShieldCheck, Clock } from 'lucide-react';

type Method = 'all' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CASH' | 'CHEQUE' | 'CARD';
type Status = 'all' | 'PENDING' | 'PAID' | 'REFUNDED';

const METHOD_LABELS: Record<string, string> = {
    BANK_TRANSFER: 'Bank Transfer',
    MOBILE_MONEY: 'Mobile Money',
    CASH: 'Cash',
    CHEQUE: 'Cheque',
    CARD: 'Card',
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
    BANK_TRANSFER: <Building size={12} />,
    MOBILE_MONEY: <Smartphone size={12} />,
    CASH: <Banknote size={12} />,
    CHEQUE: <FileCheck size={12} />,
    CARD: <CreditCard size={12} />,
};

const METHOD_COLORS: Record<string, string> = {
    BANK_TRANSFER: 'bg-primary-100 text-primary-700',
    MOBILE_MONEY: 'bg-success-100 text-success-700',
    CASH: 'bg-amber-100 text-amber-700',
    CHEQUE: 'bg-surface-100 text-surface-700',
    CARD: 'bg-violet-100 text-violet-700',
};

export default function PaymentsPage() {
    const [methodFilter, setMethodFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const { data: transactionsData } = useTransactions();
    const allReceipts: any[] = ((transactionsData as any)?.items ?? (transactionsData as any)?.data ?? (Array.isArray(transactionsData) ? transactionsData : []));

    const totalCollected = allReceipts.filter(r => (r.paymentStatus || r.status) === 'PAID').reduce((s: number, r: any) => s + (r.amount || 0), 0);
    const totalPending = allReceipts.filter(r => (r.paymentStatus || r.status) === 'PENDING').reduce((s: number, r: any) => s + (r.amount || 0), 0);
    
    const currentMonthStart = (() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    })();
    const thisMonth = allReceipts
        .filter((r: any) => (r.processedAt || r.createdAt || '').startsWith(currentMonthStart.slice(0, 7)) && (r.paymentStatus || r.status) === 'PAID')
        .reduce((s: number, r: any) => s + (r.amount || 0), 0);
    
    const avgPayment = allReceipts.filter(r => (r.paymentStatus || r.status) === 'PAID').length > 0 
        ? totalCollected / allReceipts.filter(r => (r.paymentStatus || r.status) === 'PAID').length 
        : 0;

    const methodBreakdown = allReceipts.reduce((acc: Record<string, number>, r: any) => {
        const m = r.paymentMethod || 'OTHER';
        if (!acc[m]) acc[m] = 0;
        acc[m] += (r.amount || 0);
        return acc;
    }, {} as Record<string, number>);

    const KPIS = [
        { label: 'Total Collected', value: formatCurrency(totalCollected), icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
        { label: 'Pending Approval', value: formatCurrency(totalPending), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'This Month', value: formatCurrency(thisMonth), icon: Calendar, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Avg. Payment', value: formatCurrency(avgPayment), icon: CreditCard, color: 'text-violet-600', bg: 'bg-violet-50' },
    ];

    const filtered = allReceipts.filter((r: any) => {
        const matchesMethod = methodFilter === 'all' || r.paymentMethod === methodFilter;
        const matchesStatus = statusFilter === 'all' || (r.paymentStatus || r.status) === statusFilter;
        return matchesMethod && matchesStatus;
    });

    const approveMutation = useApproveTransaction();
    const rejectMutation = useRejectTransaction();

    const handleApprove = async (id: string, ref: string) => {
        try {
            await approveMutation.mutateAsync(id);
            toast.success(`Transaction ${ref} approved.`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to approve transaction');
        }
    };

    const handleReject = async (id: string, ref: string) => {
        const reason = prompt(`Reason for rejecting transaction ${ref}:`);
        if (reason === null) return;
        if (reason.trim().length < 5) {
            toast.error('Please provide a valid reason.');
            return;
        }
        try {
            await rejectMutation.mutateAsync({ id, reason });
            toast.success(`Transaction ${ref} rejected.`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to reject transaction');
        }
    };

    // --- Excel Export ---
    const handleExportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Brokerium IBMS';
            workbook.created = new Date();

            const sheet = workbook.addWorksheet('Payments Statement');

            sheet.columns = [
                { header: 'TXN #', key: 'transactionNumber', width: 20 },
                { header: 'Client', key: 'clientName', width: 25 },
                { header: 'Policy #', key: 'policyNumber', width: 20 },
                { header: 'Amount', key: 'amount', width: 15 },
                { header: 'Method', key: 'paymentMethod', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Reference', key: 'reference', width: 20 },
                { header: 'Processed Date', key: 'date', width: 15 },
            ];

            const headerRow = sheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });

            filtered.forEach((r) => {
                sheet.addRow({
                    transactionNumber: r.transactionNumber || r.receiptNumber,
                    clientName: r.client?.firstName ? `${r.client.firstName} ${r.client.lastName}` : r.clientName,
                    policyNumber: r.policy?.policyNumber || r.policyNumber || '—',
                    amount: r.amount ?? 0,
                    paymentMethod: METHOD_LABELS[r.paymentMethod] || r.paymentMethod,
                    status: r.paymentStatus || r.status,
                    reference: r.reference || '—',
                    date: formatDate(r.processedAt || r.createdAt),
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Payments-Statement-${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success(`Exported ${filtered.length} payments to Excel.`);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export payments');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BackButton href="/dashboard/finance" />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Payments</h1>
                        <p className="text-sm text-surface-500 mt-1">Manage and approve premium collection transactions.</p>
                    </div>
                </div>
                <Button variant="outline" leftIcon={<Download size={16} />} onClick={handleExportExcel}>Export Statement</Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {KPIS.map((kpi, i) => (
                    <Card key={i} padding="none" className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={cn('p-3 rounded-full shrink-0', kpi.bg, kpi.color)}>
                            <kpi.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{kpi.label}</p>
                            <p className="text-xl font-bold text-surface-900 mt-0.5 tabular-nums">{kpi.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Payments Table */}
            <DataTable
                data={filtered}
                columns={[
                    {
                        key: 'transactionNumber',
                        label: 'TXN #',
                        sortable: true,
                        render: (r) => <span className="font-mono font-bold text-primary-600 text-xs">{r.transactionNumber || r.receiptNumber}</span>,
                    },
                    {
                        key: 'clientName',
                        label: 'Client',
                        sortable: true,
                        render: (r) => (
                            <Link
                                href={`/dashboard/clients/${r.clientId}`}
                                className="text-sm font-medium text-surface-900 hover:text-primary-600 transition-colors hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {r.client?.firstName ? `${r.client.firstName} ${r.client.lastName}` : r.clientName}
                            </Link>
                        ),
                    },
                    {
                        key: 'policyNumber',
                        label: 'Policy',
                        render: (r) => (r.policy?.policyNumber || r.policyNumber) ? (
                            <Link
                                href={`/dashboard/policies/${r.policyId}`}
                                className="text-xs font-mono text-primary-600 hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {r.policy?.policyNumber || r.policyNumber}
                            </Link>
                        ) : <span className="text-surface-400 text-xs">—</span>,
                    },
                    {
                        key: 'amount',
                        label: 'Amount',
                        sortable: true,
                        render: (r) => <span className="font-bold text-sm tabular-nums text-success-700">+{formatCurrency(r.amount)}</span>,
                    },
                    {
                        key: 'paymentMethod',
                        label: 'Method',
                        render: (r) => (
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold', METHOD_COLORS[r.paymentMethod])}>
                                {METHOD_ICONS[r.paymentMethod]}
                                {METHOD_LABELS[r.paymentMethod]}
                            </span>
                        ),
                    },
                    {
                        key: 'paymentStatus',
                        label: 'Status',
                        render: (r) => <StatusBadge status={r.paymentStatus || r.status} />,
                    },
                    {
                        key: 'processedAt',
                        label: 'Date',
                        sortable: true,
                        render: (r) => <span className="text-xs text-surface-500">{formatDate(r.processedAt || r.createdAt)}</span>,
                    },
                    {
                        key: 'actions',
                        label: '',
                        render: (r) => (r.paymentStatus || r.status) === 'PENDING' && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleApprove(r.id, r.transactionNumber || r.receiptNumber); }}
                                    className="p-1.5 rounded-lg bg-success-50 text-success-600 hover:bg-success-100 transition-colors"
                                    title="Approve Transaction"
                                >
                                    <ShieldCheck size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleReject(r.id, r.transactionNumber || r.receiptNumber); }}
                                    className="p-1.5 rounded-lg bg-danger-50 text-danger-600 hover:bg-danger-100 transition-colors"
                                    title="Reject Transaction"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ),
                    },
                ]}
                searchKeys={['transactionNumber', 'receiptNumber', 'clientName', 'reference', 'policyNumber']}
                emptyMessage="No payment records found."
                headerActions={
                    <div className="flex gap-3">
                        <CustomSelect
                            label="Method"
                            options={[
                                { label: 'All Methods', value: 'all' },
                                { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
                                { label: 'Mobile Money', value: 'MOBILE_MONEY' },
                                { label: 'Cash', value: 'CASH' },
                                { label: 'Cheque', value: 'CHEQUE' },
                                { label: 'Card', value: 'CARD' },
                            ]}
                            value={methodFilter}
                            onChange={(v) => setMethodFilter(v as string)}
                        />
                        <CustomSelect
                            label="Status"
                            options={[
                                { label: 'All Status', value: 'all' },
                                { label: 'Pending', value: 'PENDING' },
                                { label: 'Paid', value: 'PAID' },
                                { label: 'Refunded', value: 'REFUNDED' },
                            ]}
                            value={statusFilter}
                            onChange={(v) => setStatusFilter(v as string)}
                        />
                    </div>
                }
            />
        </div>
    );
}

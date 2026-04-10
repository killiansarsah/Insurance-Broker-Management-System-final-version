'use client';

import { useState, useMemo } from 'react';
import {
    TrendingUp,
    CheckCircle2,
    Clock,
    ArrowDownRight,
    Download,
    Users,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { BackButton } from '@/components/ui/back-button';
import { useCommissions, useCommissionMetrics } from '@/hooks/api/use-finance';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/select-custom';
import Link from 'next/link';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { ReceiveCommissionModal } from '@/components/finance/receive-commission-modal';
export default function CommissionsPage() {
    // Local state for pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    
    // Local state for filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [brokerFilter, setBrokerFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal state
    const [receivingCommission, setReceivingCommission] = useState<any | null>(null);

    // Data Fetching
    const { data: commissionsData, isLoading: isLoadingTable } = useCommissions({
        page,
        limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(brokerFilter !== 'all' && { brokerId: brokerFilter }),
        ...(searchQuery && { search: searchQuery })
    });

    const { data: metricsData, isLoading: isLoadingMetrics } = useCommissionMetrics();

    const items = (commissionsData as any)?.items || [];
    const meta = (commissionsData as any)?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

    const KPIS = [
        { label: 'Total Earned', value: formatCurrency(meta.totalEarned || 0), icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
        { label: 'Paid Out', value: formatCurrency(meta.totalPaid || 0), icon: CheckCircle2, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Pending Payment', value: formatCurrency(meta.totalPending || 0), icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
        { label: 'Clawback', value: formatCurrency(meta.totalClawback || 0), icon: ArrowDownRight, color: 'text-danger-600', bg: 'bg-danger-50' },
    ];

    const brokerList = metricsData?.brokerLeaderboard || [];
    const maxBrokerTotal = Math.max(...brokerList.map((b: any) => b.totalCommissions), 1);

    const BROKER_OPTIONS = [
        { label: 'All Brokers', value: 'all' },
        ...brokerList.map((b: any) => ({ label: b.brokerName, value: b.brokerId })),
    ];

    // --- Excel Export ---
    const handleExportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Brokerium IBMS';
            workbook.created = new Date();

            const sheet = workbook.addWorksheet('Commission Statement');

            // Columns setup
            sheet.columns = [
                { header: 'Policy #', key: 'policyNumber', width: 20 },
                { header: 'Client', key: 'clientName', width: 25 },
                { header: 'Product', key: 'product', width: 20 },
                { header: 'Broker', key: 'brokerName', width: 20 },
                { header: 'Rate (%)', key: 'commissionRate', width: 12 },
                { header: 'Premium', key: 'premium', width: 15 },
                { header: 'Commission', key: 'commission', width: 15 },
                { header: 'NIC Levy', key: 'nicLevy', width: 15 },
                { header: 'Net Commission', key: 'netCommission', width: 18 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Date Issued', key: 'dateIssued', width: 15 },
            ];

            // Header formatting
            const headerRow = sheet.getRow(1);
            headerRow.eachCell((cell, colNumber) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                // Using Emerald/Green for finances
                let fillColor = 'FF10B981'; // Default Emerald
                if (colNumber === 1 || colNumber === 10) fillColor = 'FFF97316'; // Orange for Ref/Status
                if (colNumber >= 2 && colNumber <= 4) fillColor = 'FF3B82F6'; // Blue for Details

                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                };
            });
            headerRow.height = 30;

            // Rows
            items.forEach((c: any, index: number) => {
                const row = sheet.addRow({
                    policyNumber: c.policy?.policyNumber || c.policyNumber || 'Unknown',
                    clientName: c.client ? (c.client.companyName || `${c.client.firstName} ${c.client.lastName}`) : 'Unknown',
                    product: c.productType || '—',
                    brokerName: c.broker?.firstName ? `${c.broker.firstName} ${c.broker.lastName}` : c.brokerName || '—',
                    commissionRate: c.commissionRate || 0,
                    premium: c.premiumAmount || 0,
                    commission: c.commissionAmount || 0,
                    nicLevy: c.nicLevy || 0,
                    netCommission: c.netCommission || 0,
                    status: c.status || '—',
                    dateIssued: c.datePolicyIssued ? formatDate(c.datePolicyIssued) : '—',
                });

                row.getCell('commissionRate').numFmt = '0.00%';
                row.getCell('premium').numFmt = '#,##0.00';
                row.getCell('commission').numFmt = '#,##0.00';
                row.getCell('nicLevy').numFmt = '#,##0.00';
                row.getCell('netCommission').numFmt = '#,##0.00';

                if (index % 2 === 1) {
                    row.eachCell((cell) => {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
                    });
                }

                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                    };
                });
            });

            sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Commission-Statement-${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success(`Exported ${items.length} commission records to Excel.`);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export commissions');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BackButton href="/dashboard/finance" />
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Commissions</h1>
                        <p className="text-sm text-surface-500 mt-1">Broker earnings, payouts, and clawbacks.</p>
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
                            {isLoadingMetrics ? (
                                <div className="h-6 w-24 bg-surface-200 animate-pulse rounded mt-1" />
                            ) : (
                                <p className="text-xl font-bold text-surface-900 mt-0.5 tabular-nums">{kpi.value}</p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Broker Leaderboard */}
            <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-surface-400" />
                    <CardHeader title="Broker Performance" />
                </div>
                {isLoadingMetrics ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-8 bg-surface-100 animate-pulse rounded" />)}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {brokerList.slice(0, 5).map((broker: any, i: number) => {
                            const pct = Math.round((broker.totalCommissions / maxBrokerTotal) * 100);
                            return (
                                <div key={broker.brokerId} className="flex items-center gap-4">
                                    <div className="w-6 text-center text-xs font-bold text-surface-400">#{i + 1}</div>
                                    <div className="w-32 shrink-0">
                                        <p className="text-sm font-semibold text-surface-900 truncate" title={broker.brokerName}>{broker.brokerName}</p>
                                        <p className="text-xs text-surface-400">{broker.policyCount} policies</p>
                                    </div>
                                    <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="w-24 text-right shrink-0">
                                        <p className="text-sm font-bold text-surface-900 tabular-nums">{formatCurrency(broker.totalCommissions)}</p>
                                        <p className="text-xs text-success-600">{formatCurrency(broker.paidCommissions)} paid</p>
                                    </div>
                                </div>
                            );
                        })}
                        {brokerList.length === 0 && <p className="text-sm text-surface-500">No broker data available.</p>}
                    </div>
                )}
            </Card>

            {/* Commission Ledger */}
            <DataTable
                data={items}
                serverSide={true}
                loading={isLoadingTable}
                currentPage={meta.page}
                totalCount={meta.total}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(s) => setLimit(s)}
                onSearchChange={(val) => {
                    setSearchQuery(val || '');
                    setPage(1);
                }}
                columns={[
                    {
                        key: 'policyNumber',
                        label: 'Policy #',
                        sortable: true,
                        render: (c: any) => (
                            <Link
                                href={`/dashboard/policies/${c.policy?.id || c.policyId}`}
                                className="font-mono font-bold text-xs text-primary-600 hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {c.policy?.policyNumber || c.policyNumber || 'Unknown'}
                            </Link>
                        ),
                    },
                    {
                        key: 'clientName',
                        label: 'Client',
                        sortable: true,
                        render: (c: any) => {
                            const name = c.client ? (c.client.companyName || `${c.client.firstName} ${c.client.lastName}`) : 'Unknown';
                            return (
                                <Link
                                    href={`/dashboard/clients/${c.clientId}`}
                                    className="text-sm font-medium text-surface-900 hover:text-primary-600 hover:underline underline-offset-2"
                                    onClick={(e) => e.stopPropagation()}
                                    title={name}
                                >
                                    <span className="line-clamp-1">{name}</span>
                                </Link>
                            )
                        },
                    },
                    { key: 'brokerName', label: 'Broker', sortable: true, render: (c: any) => <span className="text-sm font-medium whitespace-nowrap">{c.broker?.firstName} {c.broker?.lastName}</span> },
                    {
                        key: 'commissionRate',
                        label: 'Rate',
                        sortable: true,
                        render: (c: any) => <span className="text-sm font-semibold text-surface-700">{c.commissionRate}%</span>,
                    },
                    {
                        key: 'premiumAmount',
                        label: 'Premium',
                        sortable: true,
                        render: (c: any) => <span className="text-sm tabular-nums text-surface-600">{formatCurrency(c.premiumAmount)}</span>,
                    },
                    {
                        key: 'commissionAmount',
                        label: 'Comm. Amt',
                        sortable: true,
                        render: (c: any) => <span className="font-bold text-sm tabular-nums text-surface-900">{formatCurrency(c.commissionAmount)}</span>,
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        render: (c: any) => <StatusBadge status={c.status} />,
                    },
                    {
                        key: 'createdAt',
                        label: 'Created',
                        sortable: true,
                        render: (c: any) => <span className="text-xs text-surface-500 whitespace-nowrap">{formatDate(c.createdAt)}</span>,
                    },
                    {
                        key: 'actions',
                        label: '',
                        render: (c: any) => {
                            if (c.status === 'PENDING' || c.status === 'EARNED') {
                                return (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs gap-1.5 px-2"
                                        onClick={() => setReceivingCommission(c)}
                                    >
                                        <CheckCircle2 size={14} className="text-primary-600" />
                                        <span>Receive</span>
                                    </Button>
                                );
                            }
                            return null;
                        }
                    }
                ]}
                searchPlaceholder="Search policies or insurers..."
                emptyMessage="No commission records found."
                headerActions={
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            label="Broker"
                            options={BROKER_OPTIONS}
                            value={brokerFilter}
                            onChange={(v) => {
                                setBrokerFilter(v as string);
                                setPage(1);
                            }}
                        />
                        <CustomSelect
                            label="Status"
                            options={[
                                { label: 'All Statuses', value: 'all' },
                                { label: 'Earned', value: 'EARNED' },
                                { label: 'Paid', value: 'PAID' },
                                { label: 'Pending', value: 'PENDING' },
                                { label: 'Clawback', value: 'CLAWBACK' },
                            ]}
                            value={statusFilter}
                            onChange={(v) => {
                                setStatusFilter(v as string);
                                setPage(1);
                            }}
                        />
                    </div>
                }
            />

            <ReceiveCommissionModal
                isOpen={!!receivingCommission}
                onClose={() => setReceivingCommission(null)}
                commission={receivingCommission ? {
                    id: receivingCommission.id,
                    policyNumber: receivingCommission.policy?.policyNumber || 'Unknown',
                    commissionAmount: receivingCommission.commissionAmount,
                    clientName: receivingCommission.client ? (receivingCommission.client.companyName || `${receivingCommission.client.firstName} ${receivingCommission.client.lastName}`) : 'Unknown',
                } : null}
            />
        </div>
    );
}

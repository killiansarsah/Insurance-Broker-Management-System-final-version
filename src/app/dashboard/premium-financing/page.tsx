'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Filter,
    Search,
    Calendar,
    ChevronRight,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    HandCoins,
    LineChart,
    Wallet,
    MoreHorizontal,
    Trash2,
    Check,
    X as CloseIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { formatCurrency } from '@/lib/utils';
import { NewPFAModal } from '@/components/features/premium-financing/new-application-modal';
import { mockClients, getClientDisplayName } from '@/mock/clients';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { motion, AnimatePresence } from 'framer-motion';

// Mock data for Premium Financing
const INITIAL_PFA_DATA: any[] = [
    {
        id: 'PFA-8821',
        customer: 'Global Tech Solutions',
        amount: 45000,
        status: 'approved',
        financier: 'Apex Finance',
        underwriter: 'Enterprise Insurance',
        createdAt: '2024-03-10T10:00:00Z',
    },
    {
        id: 'PFA-9102',
        customer: 'Amoah & Sons Ltd',
        amount: 12500,
        status: 'under_review',
        financier: 'Apex Finance',
        underwriter: 'Enterprise Insurance',
        createdAt: '2024-03-12T14:30:00Z',
    }
];

export default function PremiumFinancingPage() {
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [applications, setApplications] = useState<any[]>(INITIAL_PFA_DATA);

    const handleNewApplication = (data: any) => {
        const newApp = {
            ...data,
            id: `PFA-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: getClientDisplayName(mockClients.find(c => c.id === data.clientId)!),
            financier: 'Apex Finance',
            underwriter: 'Enterprise Insurance',
            createdAt: new Date().toISOString(),
        };
        setApplications([newApp, ...applications]);
    };

    const handleUpdateStatus = (id: string, newStatus: string) => {
        setApplications(apps => apps.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    const handleDeleteApplication = (id: string) => {
        setApplications(apps => apps.filter(app => app.id !== id));
    };

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            if (!startDate && !endDate) return true;
            const appDate = new Date(app.createdAt).getTime();
            const start = startDate ? new Date(startDate).getTime() : 0;
            const end = endDate ? new Date(endDate).getTime() : Infinity;
            return appDate >= start && appDate <= end;
        });
    }, [applications, startDate, endDate]);

    const stats = useMemo(() => {
        const total = applications.length;
        const approved = applications.filter(a => a.status === 'approved').length;
        const inApproval = applications.filter(a => a.status === 'registered' || a.status === 'under_review').length;
        const inReview = applications.filter(a => a.status === 'intimated' || a.status === 'pending').length;

        const approvalRate = total > 0 ? (approved / total) * 100 : 0;

        return { total, approved, inApproval, inReview, approvalRate };
    }, [applications]);

    const handleCheck = () => {
        console.log('Filtering applications for range:', startDate, 'to', endDate);
    };

    const kpis = [
        {
            label: 'Total Applications',
            value: stats.total.toString(),
            subValue: `${stats.total} application${stats.total !== 1 ? 's' : ''}`,
            icon: FileText,
            color: 'text-blue-500',
            bgIcon: 'bg-blue-500/10',
            borderColor: 'border-l-blue-500'
        },
        {
            label: 'Approved',
            value: stats.approved.toString(),
            subValue: `${stats.approved} approved`,
            icon: CheckCircle2,
            color: 'text-success-500',
            bgIcon: 'bg-success-500/10',
            borderColor: 'border-l-success-500'
        },
        {
            label: 'In Approval',
            value: stats.inApproval.toString(),
            subValue: `${stats.inApproval} processing`,
            icon: Clock,
            color: 'text-warning-500',
            bgIcon: 'bg-warning-500/10',
            borderColor: 'border-l-warning-500'
        },
        {
            label: 'In Review',
            value: stats.inReview.toString(),
            subValue: `${stats.inReview} review`,
            icon: AlertCircle,
            color: 'text-accent-500',
            bgIcon: 'bg-accent-500/10',
            borderColor: 'border-l-accent-500'
        },
    ];

    return (
        <div className="space-y-6 p-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-warning-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight flex items-center gap-3">
                        Premium Financing
                    </h1>
                    <p className="text-surface-500 mt-1 font-medium">Manage and track all financing applications</p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        className="shimmer-button bg-warning-500 hover:bg-warning-600 text-surface-900 border-none rounded-full px-8 h-12 font-black shadow-[0_10px_20px_-5px_rgba(245,124,0,0.3)]"
                        leftIcon={<HandCoins size={20} className="icon-glow" />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        New Application
                    </Button>
                </motion.div>
            </div>

            {/* Overview Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card padding="lg" className="premium-glass-card metallic-border overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
                        <h2 className="text-xl font-black text-surface-900 uppercase tracking-tighter italic">Overview</h2>

                        {/* Date Filters Bar */}
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-surface-200 shadow-sm pr-4">
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent border-none text-[12px] px-4 py-1.5 focus:ring-0 w-36 text-center font-bold"
                                />
                                <span className="text-surface-300 text-xs font-black">TO</span>
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent border-none text-[12px] px-4 py-1.5 focus:ring-0 w-36 text-center font-bold"
                                />
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                className="bg-surface-900 text-white hover:bg-black border-none rounded-full h-11 px-6 font-black transition-all shadow-lg hover:shadow-black/20"
                                onClick={handleCheck}
                            >
                                Check <ChevronRight size={18} className="ml-1" />
                            </Button>
                        </div>
                    </div>

                    {/* Overview KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpis.map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className={`p-6 bg-white/40 backdrop-blur-md border border-white/60 border-l-4 ${item.borderColor} rounded-2xl shadow-sm hover:shadow-xl transition-all group`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${item.bgIcon} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon size={24} className="icon-glow" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-surface-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={14} className="text-surface-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                                    <p className="text-3xl font-black text-surface-900 tracking-tighter">{item.value}</p>
                                    <p className="text-xs font-bold text-surface-500 mt-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-surface-300" />
                                        {item.subValue}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <div className="h-1.5 flex-1 bg-surface-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.approvalRate}%` }}
                                className="h-full bg-success-500 rounded-full"
                            />
                        </div>
                        <span className="text-xs font-black text-success-600 uppercase tracking-wider">
                            {stats.approvalRate.toFixed(1)}% Approval Rate
                        </span>
                    </div>
                </Card>
            </motion.div>

            {/* Table Area */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black text-surface-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-warning-500" />
                        Applications Ledger
                    </h3>
                    <Button variant="outline" size="sm" className="rounded-full border-surface-200 text-surface-600 font-bold px-6 hover:bg-surface-900 hover:text-white transition-all" leftIcon={<Filter size={14} />}>
                        Filter Results
                    </Button>
                </div>

                <DataTable
                    data={filteredApplications}
                    columns={[
                        { key: 'id', label: 'APPLICATION ID', render: (row: any) => <span className="font-mono font-bold text-primary-600">{row.id}</span> },
                        { key: 'customer', label: 'CUSTOMER', render: (row: any) => <span className="font-bold">{row.customer}</span> },
                        { key: 'amount', label: 'FINANCED AMOUNT', render: (row: any) => <span className="font-black text-surface-900">{formatCurrency(row.amount)}</span> },
                        { key: 'status', label: 'STATUS', render: (row: any) => <StatusBadge status={row.status} /> },
                        { key: 'financier', label: 'FINANCIER' },
                        {
                            key: 'actions', label: 'ACTIONS', className: 'w-24 text-center', render: (row: any) => (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 rounded-xl bg-white/50 border border-surface-200 shadow-sm hover:bg-surface-900 hover:text-white transition-all group/btn"
                                        >
                                            <MoreHorizontal className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 premium-glass-card border border-white/60 shadow-2xl">
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-1 px-2">Application Workflow</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-surface-100/50" />
                                        <div className="space-y-1 mt-1">
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateStatus(row.id, 'approved')}
                                                className="rounded-lg h-10 px-3 cursor-pointer hover:bg-success-50 transition-colors"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-success-50 text-success-600 flex items-center justify-center mr-3">
                                                    <Check size={16} />
                                                </div>
                                                <span className="font-bold text-sm text-surface-900">Approve</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateStatus(row.id, 'under_review')}
                                                className="rounded-lg h-10 px-3 cursor-pointer hover:bg-warning-50 transition-colors"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center mr-3">
                                                    <Clock size={16} />
                                                </div>
                                                <span className="font-bold text-sm text-surface-900">Under Review</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateStatus(row.id, 'rejected')}
                                                className="rounded-lg h-10 px-3 cursor-pointer hover:bg-danger-50 transition-colors"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center mr-3">
                                                    <CloseIcon size={16} />
                                                </div>
                                                <span className="font-bold text-sm text-surface-900">Reject</span>
                                            </DropdownMenuItem>
                                        </div>
                                        <DropdownMenuSeparator className="bg-surface-100/50 my-2" />
                                        <DropdownMenuItem
                                            onClick={() => handleDeleteApplication(row.id)}
                                            className="rounded-lg h-10 px-3 cursor-pointer text-danger-600 focus:text-danger-600 focus:bg-danger-50 transition-colors"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-danger-50 flex items-center justify-center mr-3">
                                                <Trash2 size={16} />
                                            </div>
                                            <span className="font-bold text-sm">Delete Record</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        },
                    ]}
                    className="premium-glass-card"
                    emptyMessage={
                        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-6">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-surface-50 flex items-center justify-center mb-4 sm:mb-6 shadow-inner"
                            >
                                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-surface-200" />
                            </motion.div>
                            <h3 className="text-lg sm:text-2xl font-black text-surface-900 uppercase tracking-tighter mb-2">No Application Ledger found</h3>
                            <p className="text-surface-400 text-xs sm:text-sm mx-auto leading-relaxed" style={{ maxWidth: '15rem' }}>
                                Start by creating a new financing request using the button above.
                            </p>
                        </div>
                    }
                />
            </motion.div>

            {/* New Application Modal */}
            <NewPFAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleNewApplication}
            />
        </div>
    );
}

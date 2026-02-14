'use client';

import {
    Users,
    FileText,
    TrendingUp,
    AlertCircle,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    RefreshCw,
    Calendar,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

// --- KPI Data ---
const kpiData = [
    {
        label: 'Total Clients',
        value: '2,847',
        change: 12.5,
        direction: 'up' as const,
        icon: <Users size={20} />,
        color: 'text-primary-500 bg-primary-50',
    },
    {
        label: 'Active Policies',
        value: '4,312',
        change: 8.2,
        direction: 'up' as const,
        icon: <FileText size={20} />,
        color: 'text-success-500 bg-success-50',
    },
    {
        label: 'Premium MTD',
        value: formatCurrency(1245000),
        change: 15.3,
        direction: 'up' as const,
        icon: <TrendingUp size={20} />,
        color: 'text-accent-500 bg-accent-50',
    },
    {
        label: 'Pending Claims',
        value: '23',
        change: -5.1,
        direction: 'down' as const,
        icon: <AlertCircle size={20} />,
        color: 'text-danger-500 bg-danger-50',
    },
    {
        label: 'Active Leads',
        value: '156',
        change: 22.4,
        direction: 'up' as const,
        icon: <Target size={20} />,
        color: 'text-primary-500 bg-primary-50',
    },
];

// --- Recent Activity ---
const recentActivity = [
    {
        id: '1',
        action: 'New policy created',
        detail: 'POL-2024-0847 — Motor Comprehensive for Kwame Mensah',
        time: '15 minutes ago',
        type: 'policy',
    },
    {
        id: '2',
        action: 'Client KYC verified',
        detail: 'Ama Serwaa — Individual client verified',
        time: '1 hour ago',
        type: 'client',
    },
    {
        id: '3',
        action: 'Claim registered',
        detail: 'CLM-2024-0156 — Fire claim by Asante Holdings Ltd',
        time: '2 hours ago',
        type: 'claim',
    },
    {
        id: '4',
        action: 'Lead converted',
        detail: 'Kofi Adom — Converted to active client, Motor policy issued',
        time: '3 hours ago',
        type: 'lead',
    },
    {
        id: '5',
        action: 'Commission received',
        detail: 'GHS 12,450 commission from Enterprise Insurance (Motor)',
        time: '5 hours ago',
        type: 'commission',
    },
];

// --- Upcoming Renewals ---
const upcomingRenewals = [
    {
        id: '1',
        policyNumber: 'POL-2024-0234',
        clientName: 'Abena Osei',
        type: 'Motor Comprehensive',
        expiryDate: '2024-03-15',
        premium: 4500,
        daysLeft: 7,
    },
    {
        id: '2',
        policyNumber: 'POL-2024-0189',
        clientName: 'Mensah Enterprises',
        type: 'Fire & Allied Perils',
        expiryDate: '2024-03-18',
        premium: 25000,
        daysLeft: 10,
    },
    {
        id: '3',
        policyNumber: 'POL-2024-0312',
        clientName: 'Grace Amponsah',
        type: 'Health Insurance',
        expiryDate: '2024-03-22',
        premium: 8200,
        daysLeft: 14,
    },
    {
        id: '4',
        policyNumber: 'POL-2024-0099',
        clientName: 'Nana Kwadwo Ltd',
        type: 'Professional Indemnity',
        expiryDate: '2024-03-25',
        premium: 15000,
        daysLeft: 17,
    },
];

function getDaysLeftColor(days: number) {
    if (days <= 7) return 'danger';
    if (days <= 14) return 'warning';
    return 'success';
}

const activityColors: Record<string, string> = {
    policy: 'bg-primary-100 text-primary-600',
    client: 'bg-success-100 text-success-600',
    claim: 'bg-danger-100 text-danger-600',
    lead: 'bg-accent-100 text-accent-600',
    commission: 'bg-success-100 text-success-600',
};

import { PremiumTrend } from '@/components/charts/premium-trend';
import { PolicyMix } from '@/components/charts/policy-mix';
import { CalendarWidget } from '@/components/dashboard/calendar-widget';

export default function DashboardPage() {

    return (
        <div className="space-y-6 animate-fade-in mb-12">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Executive Dashboard</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Welcome back, Kwame. Here&apos;s a summary of your business performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<RefreshCw size={14} />}>
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<Calendar size={14} />}>
                        Feb 2026
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {kpiData.map((kpi) => (
                    <Card key={kpi.label} padding="md" hover className="relative overflow-hidden group">
                        <div className="flex items-start justify-between">
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300',
                                    kpi.color
                                )}
                            >
                                {kpi.icon}
                            </div>
                            <div
                                className={cn(
                                    'flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                                    kpi.direction === 'up'
                                        ? 'text-success-700 bg-success-50'
                                        : 'text-danger-700 bg-danger-50'
                                )}
                            >
                                {kpi.direction === 'up' ? (
                                    <ArrowUpRight size={14} />
                                ) : (
                                    <ArrowDownRight size={14} />
                                )}
                                {Math.abs(kpi.change)}%
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold text-surface-900 tracking-tight">{kpi.value}</p>
                            <p className="text-xs font-medium text-surface-500 mt-1 uppercase tracking-wider">{kpi.label}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link href="/dashboard/clients/new">
                    <Card padding="sm" hover className="text-center cursor-pointer group border-primary-100 hover:border-primary-500 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mx-auto transition-all group-hover:bg-primary-500 group-hover:text-white">
                            <Plus size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">New Client</p>
                    </Card>
                </Link>
                <Link href="/dashboard/policies/new">
                    <Card padding="sm" hover className="text-center cursor-pointer group border-success-100 hover:border-success-500 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-success-50 text-success-500 flex items-center justify-center mx-auto transition-all group-hover:bg-success-500 group-hover:text-white">
                            <Plus size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">New Policy</p>
                    </Card>
                </Link>
                <Link href="/dashboard/claims/new">
                    <Card padding="sm" hover className="text-center cursor-pointer group border-accent-100 hover:border-accent-500 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-500 flex items-center justify-center mx-auto transition-all group-hover:bg-accent-500 group-hover:text-white">
                            <Plus size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">New Claim</p>
                    </Card>
                </Link>
                <Link href="/dashboard/leads">
                    <Card padding="sm" hover className="text-center cursor-pointer group border-danger-100 hover:border-danger-500 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-danger-50 text-danger-500 flex items-center justify-center mx-auto transition-all group-hover:bg-danger-500 group-hover:text-white">
                            <Target size={20} />
                        </div>
                        <p className="text-sm font-semibold text-surface-700 mt-2">Manage Leads</p>
                    </Card>
                </Link>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2" padding="lg">
                    <CardHeader
                        title="Premium Trend"
                        subtitle="Monthly gross written premium (GHS)"
                        action={
                            <Badge variant="success" size="md">
                                +15.3% vs last month
                            </Badge>
                        }
                    />
                    <PremiumTrend />
                </Card>

                <Card padding="lg">
                    <CardHeader
                        title="Policy Mix"
                        subtitle="Distribution by insurance type"
                    />
                    <PolicyMix />
                </Card>
            </div>

            {/* Calendar & Activity Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <CalendarWidget />
                </div>
                <div className="lg:col-span-2">
                    {/* Placeholder for future specific highlights or integrated into next row */}
                </div>
            </div>

            {/* Two column: Recent Activity + Upcoming Renewals */}


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card padding="none" className="overflow-hidden">
                    <CardHeader
                        title="Recent Activity"
                        subtitle="Latest system logs and actions"
                        className="p-6 pb-4"
                    />
                    <div className="divide-y divide-surface-100">
                        {recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 px-6 py-4 hover:bg-surface-50 transition-colors group"
                            >
                                <div
                                    className={cn(
                                        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm',
                                        activityColors[activity.type] || 'bg-surface-100 text-surface-500'
                                    )}
                                >
                                    {activity.type === 'policy' && <FileText size={18} />}
                                    {activity.type === 'client' && <Users size={18} />}
                                    {activity.type === 'claim' && <AlertCircle size={18} />}
                                    {activity.type === 'lead' && <Target size={18} />}
                                    {activity.type === 'commission' && <TrendingUp size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">
                                        {activity.action}
                                    </p>
                                    <p className="text-xs text-surface-500 mt-1 leading-relaxed">
                                        {activity.detail}
                                    </p>
                                    <p className="text-[10px] text-surface-400 mt-1 uppercase font-medium tracking-tight">
                                        {activity.time}
                                    </p>
                                </div>
                                <ArrowUpRight size={14} className="text-surface-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-4 bg-surface-50/50 border-t border-surface-100">
                        <button className="text-sm text-primary-600 font-semibold hover:text-primary-700 cursor-pointer transition-colors flex items-center gap-1.5">
                            Access Full Activity Log <ArrowUpRight size={14} />
                        </button>
                    </div>
                </Card>

                {/* Upcoming Renewals */}
                <Card padding="none" className="overflow-hidden">
                    <CardHeader
                        title="Critical Renewals"
                        subtitle="Policies expiring in the next 30 days"
                        action={
                            <Badge variant="danger" size="md">
                                {upcomingRenewals.length} Actions Required
                            </Badge>
                        }
                        className="p-6 pb-4"
                    />
                    <div className="divide-y divide-surface-100">
                        {upcomingRenewals.map((renewal) => (
                            <div
                                key={renewal.id}
                                className="flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-surface-900">
                                        {renewal.clientName}
                                    </p>
                                    <p className="text-xs text-surface-500 mt-1">
                                        {renewal.policyNumber} <span className="mx-1 text-surface-300">|</span> {renewal.type}
                                    </p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className="text-sm font-bold text-surface-900">
                                        {formatCurrency(renewal.premium)}
                                    </p>
                                    <div className="mt-1">
                                        <Badge
                                            variant={getDaysLeftColor(renewal.daysLeft)}
                                            size="sm"
                                        >
                                            {renewal.daysLeft} days remaining
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-4 bg-surface-50/50 border-t border-surface-100">
                        <button className="text-sm text-primary-600 font-semibold hover:text-primary-700 cursor-pointer transition-colors flex items-center gap-1.5">
                            Manage All Renewals <ArrowUpRight size={14} />
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

'use client';

import {
    Briefcase,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Filter,
    Plus,
    ArrowUpRight,
    MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/data-display/status-badge';
import { Button } from '@/components/ui/button';

// Enhanced Mock Data including Priorities
interface Task {
    id: number;
    title: string;
    priority: 'hot' | 'warm' | 'cold';
    status: 'pending' | 'under_review' | 'registered';
    due: string;
    type: string;
    description: string;
}

const tasks: Task[] = [
    {
        id: 1,
        title: 'Renewal: Acme Corp Policy #9882',
        priority: 'hot',
        status: 'pending',
        due: 'Today',
        type: 'General Insurance',
        description: 'Client needs renewal confirmation by COP to avoid gap in coverage.'
    },
    {
        id: 2,
        title: 'Claim Review: John Doe - Auto Incident',
        priority: 'warm',
        status: 'under_review',
        due: 'Tomorrow',
        type: 'Motor Insurance',
        description: 'Verify documents uploaded by the client matches NIC requirements.'
    },
    {
        id: 3,
        title: 'Follow-up: New Lead - TechStart Inc.',
        priority: 'cold',
        status: 'registered',
        due: 'Feb 18',
        type: 'Professional Liability',
        description: 'Initial intake completed. Waiting for risk assessment results.'
    },
];

function MetricCard({ label, value, icon, colorClass, status }: { label: string; value: string; icon: React.ReactNode; colorClass: string; status: string }) {
    return (
        <Card padding="md" className="relative overflow-hidden group hover:border-primary-300 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">{label}</p>
                    <h3 className={cn("text-3xl font-bold mt-1 tracking-tight", colorClass)}>{value}</h3>
                </div>
                <div className={cn("p-2 rounded-lg bg-surface-50 group-hover:bg-primary-50 transition-colors", status === 'urgent' ? 'text-danger-500' : status === 'pending' ? 'text-accent-500' : 'text-success-500')}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-success-600 bg-success-50 px-1.5 py-0.5 rounded">↑ 12%</span>
                <span className="text-[10px] text-surface-400 font-medium italic">vs last month</span>
            </div>
        </Card>
    );
}

export default function TasksPage() {
    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-lg)] shadow-sm border border-surface-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">My Desk</h1>
                        <p className="text-sm text-surface-500 mt-1">Operational Command Center & Workflow queue</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Filter</Button>
                    <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>Create Task</Button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Urgent Tasks"
                    value="05"
                    status="urgent"
                    icon={<AlertCircle size={20} />}
                    colorClass="text-danger-600"
                />
                <MetricCard
                    label="Pending Review"
                    value="12"
                    status="pending"
                    icon={<Clock size={20} />}
                    colorClass="text-accent-600"
                />
                <MetricCard
                    label="Closed (Monthly)"
                    value="28"
                    status="completed"
                    icon={<CheckCircle2 size={20} />}
                    colorClass="text-success-600"
                />
            </div>

            {/* Main Work Area */}
            <Card padding="none" className="overflow-hidden">
                <CardHeader
                    title="Active Workflow Queue"
                    subtitle="Centralized management for policies, claims, and lead follow-ups"
                    action={
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" size={14} />
                                <input
                                    className="pl-8 pr-4 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500 outline-none w-48 transition-all"
                                    placeholder="Search command..."
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={14} /></Button>
                        </div>
                    }
                    className="border-b border-surface-100"
                />

                <div className="divide-y divide-surface-100">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-surface-50/50 transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex gap-4">
                                <div className={cn(
                                    "mt-1 w-1.5 h-12 rounded-full hidden sm:block",
                                    task.priority === 'hot' ? "bg-danger-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
                                        task.priority === 'warm' ? "bg-accent-500 shadow-[0_0_8px_rgba(245,124,0,0.4)]" :
                                            "bg-primary-500/30"
                                )} />

                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-sm font-bold text-surface-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                            {task.title}
                                        </h4>
                                        <StatusBadge status={task.priority} showDot={false} className="text-[9px] h-4" />
                                    </div>
                                    <p className="text-xs text-surface-500 line-clamp-1 max-w-md">
                                        {task.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                                            <Briefcase size={12} className="text-surface-300" />
                                            {task.type}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                                            <Clock size={12} className="text-surface-300" />
                                            Exp: {task.due}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Process State</span>
                                    <StatusBadge status={task.status} />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    rightIcon={<ArrowUpRight size={14} />}
                                    className="hidden sm:inline-flex opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Open
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-surface-100 bg-surface-50/30 text-center">
                    <button className="text-[11px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest transition-colors">
                        Expand All Desktop Activities
                    </button>
                </div>
            </Card>
        </div>
    );
}


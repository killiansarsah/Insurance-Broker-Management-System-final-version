'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Briefcase,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Filter,
    Plus,
    ArrowUpRight,
    MoreVertical,
    Check,
    Calendar,
    Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/data-display/status-badge';
import { Button, Modal, Input, Textarea } from '@/components/ui';
import { toast } from 'sonner';

// Enhanced Mock Data including Priorities
interface Task {
    id: string;
    title: string;
    priority: 'hot' | 'warm' | 'cold';
    status: 'pending' | 'under_review' | 'registered';
    due: string;
    type: string;
    description: string;
    link: string;
    isCompleted?: boolean;
}

const INITIAL_TASKS: Task[] = [
    {
        id: 'task-1',
        title: 'Renewal: Acme Corp Policy #9882',
        priority: 'hot',
        status: 'pending',
        due: 'Today',
        type: 'General Insurance',
        description: 'Client needs renewal confirmation by COP to avoid gap in coverage.',
        link: '/dashboard/policies/pol-001'
    },
    {
        id: 'task-2',
        title: 'Claim Review: John Doe - Auto Incident',
        priority: 'warm',
        status: 'under_review',
        due: 'Tomorrow',
        type: 'Motor Insurance',
        description: 'Verify documents uploaded by the client matches NIC requirements.',
        link: '/dashboard/claims/clm-001'
    },
    {
        id: 'task-3',
        title: 'Follow-up: New Lead - TechStart Inc.',
        priority: 'cold',
        status: 'registered',
        due: 'Feb 18',
        type: 'Professional Liability',
        description: 'Initial intake completed. Waiting for risk assessment results.',
        link: '/dashboard/leads/ld-001'
    },
];

function MetricCard({ label, value, icon, colorClass, status, trend }: { label: string; value: string; icon: React.ReactNode; colorClass: string; status: string; trend?: string }) {
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
                <span className="text-[10px] font-bold text-success-600 bg-success-50 px-1.5 py-0.5 rounded">↑ {trend || '12%'}</span>
                <span className="text-[10px] text-surface-400 font-medium italic">vs last month</span>
            </div>
        </Card>
    );
}

export default function TasksPage() {
    const [taskList, setTaskList] = useState<Task[]>(INITIAL_TASKS);
    const [completedCount, setCompletedCount] = useState(28);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // New Task Form State
    const [newTask, setNewTask] = useState({
        title: '',
        priority: 'warm' as const,
        type: '',
        description: '',
        due: 'Next Week'
    });

    const handleComplete = (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));

        const task = taskList.find(t => t.id === taskId);
        if (task && !task.isCompleted) {
            setCompletedCount(prev => prev + 1);
            toast.success('Task marked as completed', {
                description: task.title
            });
        } else {
            setCompletedCount(prev => prev - 1);
        }
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        const entry: Task = {
            id: `task-${Date.now()}`,
            title: newTask.title || 'Untitled Task',
            priority: newTask.priority,
            status: 'pending',
            due: newTask.due,
            type: newTask.type || 'General',
            description: newTask.description,
            link: '/dashboard/tasks',
            isCompleted: false
        };

        setTaskList([entry, ...taskList]);
        setIsCreateModalOpen(false);
        setNewTask({ title: '', priority: 'warm', type: '', description: '', due: 'Next Week' });
        toast.success('New task created', {
            description: entry.title
        });
    };

    const handleFilter = () => {
        toast('Workflow Filter', {
            description: 'Filtering options for Priority, Line of Business, and Due Date.'
        });
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-lg)] shadow-sm border border-surface-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-inner">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">My Desk</h1>
                        <p className="text-sm text-surface-500 mt-1">Operational Command Center & Workflow queue</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Filter size={14} />} onClick={handleFilter}>Filter</Button>
                    <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsCreateModalOpen(true)}>Create Task</Button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Urgent Tasks"
                    value={taskList.filter(t => t.priority === 'hot' && !t.isCompleted).length.toString().padStart(2, '0')}
                    status="urgent"
                    icon={<AlertCircle size={20} />}
                    colorClass="text-danger-600"
                />
                <MetricCard
                    label="Pending Review"
                    value={taskList.filter(t => !t.isCompleted).length.toString().padStart(2, '0')}
                    status="pending"
                    icon={<Clock size={20} />}
                    colorClass="text-accent-600"
                />
                <MetricCard
                    label="Closed (Monthly)"
                    value={completedCount.toString()}
                    status="completed"
                    icon={<CheckCircle2 size={20} />}
                    colorClass="text-success-600"
                    trend="5%"
                />
            </div>

            {/* Main Work Area */}
            <Card padding="none" className="overflow-hidden">
                <CardHeader
                    title="Active Workflow Queue"
                    subtitle="Centralized management for policies, claims, and lead follow-ups"
                    action={
                        <div className="flex items-center gap-2">
                            <div className="relative hidden sm:block">
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
                    {taskList.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "group flex flex-col sm:flex-row sm:items-center justify-between p-5 transition-all duration-200 cursor-pointer overflow-hidden relative",
                                task.isCompleted ? "opacity-60 bg-surface-50/30" : "hover:bg-surface-50/50"
                            )}
                        >
                            {/* Completion Indicator for background */}
                            {task.isCompleted && (
                                <div className="absolute right-[-20px] top-[-20px] text-surface-100 rotate-12 pointer-events-none">
                                    <Check size={120} strokeWidth={4} />
                                </div>
                            )}

                            <div className="flex gap-4 relative z-10">
                                <div className={cn(
                                    "mt-1 w-1.5 h-12 rounded-full hidden sm:block transition-all duration-500",
                                    task.isCompleted ? "bg-surface-200" :
                                        task.priority === 'hot' ? "bg-danger-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]" :
                                            task.priority === 'warm' ? "bg-accent-500 shadow-[0_0_8px_rgba(245,124,0,0.4)]" :
                                                "bg-primary-500/30"
                                )} />

                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => handleComplete(e, task.id)}
                                            className={cn(
                                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                                task.isCompleted
                                                    ? "bg-success-500 border-success-500 text-white"
                                                    : "border-surface-300 bg-white hover:border-primary-500"
                                            )}
                                        >
                                            {task.isCompleted && <Check size={14} />}
                                        </button>
                                        <h4 className={cn(
                                            "text-sm font-bold transition-all uppercase tracking-tight",
                                            task.isCompleted ? "text-surface-400 line-through" : "text-surface-900 group-hover:text-primary-600"
                                        )}>
                                            {task.title}
                                        </h4>
                                        <StatusBadge status={task.isCompleted ? 'closed' : task.priority} showDot={false} className="text-[9px] h-4" />
                                    </div>
                                    <p className={cn(
                                        "text-xs line-clamp-1 max-w-md transition-colors",
                                        task.isCompleted ? "text-surface-400" : "text-surface-500"
                                    )}>
                                        {task.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                                            <Briefcase size={12} className="text-surface-300" />
                                            {task.type}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                                            <Clock size={12} className="text-surface-300" />
                                            {task.isCompleted ? 'Completed' : `Exp: ${task.due}`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0 relative z-10">
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest whitespace-nowrap">Process State</span>
                                    <StatusBadge status={task.isCompleted ? 'closed' : task.status} />
                                </div>
                                <Link href={task.link}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        rightIcon={<ArrowUpRight size={14} />}
                                        className={cn(
                                            "hidden sm:inline-flex transition-all",
                                            task.isCompleted ? "opacity-40" : "opacity-0 group-hover:opacity-100"
                                        )}
                                    >
                                        Open
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-surface-100 bg-surface-50/30 text-center">
                    <button
                        onClick={() => toast.info('Full Workflow View', { description: 'Loading all historical task data...' })}
                        className="text-[11px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest transition-colors cursor-pointer"
                    >
                        Expand All Desktop Activities
                    </button>
                </div>
            </Card>

            {/* Create Task Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Workflow Task"
                description="Assign a new operational task to your dashboard queue."
                size="md"
            >
                <form onSubmit={handleAddTask} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-700 uppercase tracking-wider">Task Title</label>
                        <Input
                            placeholder="e.g., Renewal: XYZ Corp"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-700 uppercase tracking-wider">Priority</label>
                            <select
                                className="w-full h-10 px-3 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                            >
                                <option value="hot">Hot (Urgent)</option>
                                <option value="warm">Warm (Normal)</option>
                                <option value="cold">Cold (Low)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-surface-700 uppercase tracking-wider">Due Date</label>
                            <Input
                                placeholder="Today, Feb 20..."
                                value={newTask.due}
                                onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-700 uppercase tracking-wider">Insurance Type</label>
                        <Input
                            placeholder="e.g., Motor, Health..."
                            value={newTask.type}
                            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-700 uppercase tracking-wider">Description</label>
                        <Textarea
                            placeholder="Provide details about this task..."
                            rows={3}
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
                        <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Create Task</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

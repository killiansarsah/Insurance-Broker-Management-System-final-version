'use client';

import { Briefcase, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data
const tasks = [
    { id: 1, title: 'Renewal: Acme Corp Policy #9882', status: 'Urgent', due: 'Today', type: 'Policy' },
    { id: 2, title: 'Claim Review: John Doe - Auto Incident', status: 'Pending', due: 'Tomorrow', type: 'Claim' },
    { id: 3, title: 'Follow-up: New Lead - TechStart Inc.', status: 'Normal', due: 'Feb 18', type: 'Sales' },
];

export default function TasksPage() {
    return (
        <div className="h-full flex flex-col space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">My Desk</h1>
                    <p className="text-muted-foreground text-sm">Manage your daily workflow and priorities.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric Cards - Sharp/Dense Style */}
                <div className="p-4 bg-card border border-border rounded-none shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Urgent</p>
                        <h3 className="text-2xl font-bold text-red-500">5</h3>
                    </div>
                    <AlertCircle className="text-red-500/20" size={32} />
                </div>
                <div className="p-4 bg-card border border-border rounded-none shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</p>
                        <h3 className="text-2xl font-bold text-yellow-500">12</h3>
                    </div>
                    <Clock className="text-yellow-500/20" size={32} />
                </div>
                <div className="p-4 bg-card border border-border rounded-none shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
                        <h3 className="text-2xl font-bold text-green-500">28</h3>
                    </div>
                    <CheckCircle2 className="text-green-500/20" size={32} />
                </div>
            </div>

            {/* Task List */}
            <div className="flex-1 bg-card border border-border rounded-none shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-border bg-muted/20 flex justify-between items-center">
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Active Tasks</h2>
                    <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                        View All
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/5 transition-colors cursor-pointer group",
                                task.status === 'Urgent' && "border-l-4 border-l-red-500 pl-3"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    task.status === 'Urgent' ? "bg-red-500" :
                                        task.status === 'Pending' ? "bg-yellow-500" : "bg-blue-500"
                                )} />
                                <div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                        <span>{task.type}</span>
                                        <span>•</span>
                                        <span>Due: {task.due}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-3 py-1 text-xs font-medium border border-border hover:bg-muted transition-colors rounded-none">
                                Action
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

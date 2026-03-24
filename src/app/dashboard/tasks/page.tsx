'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
    Briefcase,
    CheckCircle2,
    Clock,
    AlertCircle,
    Filter,
    Plus,
    MoreVertical,
    Calendar,
    Check,
    Tag,
    Trash2,
    ChevronDown,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button, Modal } from '@/components/ui';
import { CustomSelect } from '@/components/ui/select-custom';
import { toast } from 'sonner';
import { StickyNoteTask } from '@/components/features/tasks/sticky-note-task';
import { RecycleBin } from '@/components/features/tasks/recycle-bin';
import { useTasks, useCreateTask, useChangeTaskStatus, useUpdateTask } from '@/hooks/api/use-tasks';
const ArchiveModal = dynamic(
    () => import('@/components/features/tasks/archive-modal').then(m => ({ default: m.ArchiveModal })),
    { ssr: false }
);
const ConfirmationModal = dynamic(
    () => import('@/components/ui/confirmation-modal').then(m => ({ default: m.ConfirmationModal })),
    { ssr: false }
);
import { AnimatePresence, motion } from 'framer-motion';
import { AppLoader } from '@/components/ui/AppLoader';

// ─── Task shape expected by UI components ───
interface Task {
    id: string;
    title: string;
    priority: 'HOT' | 'WARM' | 'COLD';
    status: 'PENDING' | 'UNDER_REVIEW' | 'REGISTERED';
    due: string;
    type: string;
    description: string;
    link: string;
    isCompleted?: boolean;
}

// ─── Map backend record → UI Task ───
function mapApiTask(raw: Record<string, any>): Task {
    const priorityMap: Record<string, 'HOT' | 'WARM' | 'COLD'> = { HOT: 'HOT', WARM: 'WARM', COLD: 'COLD' };
    const statusMap: Record<string, 'PENDING' | 'UNDER_REVIEW' | 'REGISTERED'> = { PENDING: 'PENDING', UNDER_REVIEW: 'UNDER_REVIEW', REGISTERED: 'REGISTERED' };

    let due = '';
    if (raw.dueDate) {
        const d = new Date(raw.dueDate);
        const now = new Date();
        const todayStr = now.toDateString();
        const tomorrowStr = new Date(now.getTime() + 86400000).toDateString();
        if (d.toDateString() === todayStr) due = 'Today';
        else if (d.toDateString() === tomorrowStr) due = 'Tomorrow';
        else due = d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
    }

    return {
        id: raw.id,
        title: raw.title ?? '',
        priority: priorityMap[raw.priority] ?? 'WARM',
        status: statusMap[raw.status] ?? 'PENDING',
        due,
        type: raw.type ?? 'General',
        description: raw.description ?? '',
        link: raw.link ?? '/dashboard/tasks',
        isCompleted: raw.isCompleted ?? false,
    };
}

function MetricCard({ label, value, icon, colorClass, status, trend }: { label: string; value: string; icon: React.ReactNode; colorClass: string; status: string; trend?: string }) {
    return (
        <Card padding="md" className="relative overflow-hidden group hover:border-primary-300 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">{label}</p>
                    <h3 className={cn("text-3xl font-bold mt-1 tracking-tight", colorClass)}>{value}</h3>
                </div>
                <div className={cn("p-2 rounded-lg bg-surface-50 group-hover:bg-primary-50 transition-colors", status === 'urgent' ? 'text-danger-500' : status === 'PENDING' ? 'text-accent-500' : 'text-success-500')}>
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
    // ─── Fetch tasks from backend API ───
    const { data: tasksResponse, isLoading, isError } = useTasks({ limit: 100 });
    const createTask = useCreateTask();
    const changeStatus = useChangeTaskStatus();
    const updateTask = useUpdateTask();

    // Map API data into UI shape; separate active vs completed
    const allTasks = useMemo(() => {
        const raw = (tasksResponse as unknown as Record<string, unknown>)?.items ?? tasksResponse?.data ?? tasksResponse ?? [];
        if (!Array.isArray(raw)) return [];
        return (raw as Record<string, any>[]).map(mapApiTask);
    }, [tasksResponse]);

    const taskList = useMemo(() => allTasks.filter(t => !t.isCompleted), [allTasks]);
    const archivedTasks = useMemo(() => allTasks.filter(t => t.isCompleted), [allTasks]);
    const completedCount = archivedTasks.length;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'desk' | 'list'>('desk');
    const [crumplingTaskId, setCrumplingTaskId] = useState<string | null>(null);
    const [binHovered, setBinHovered] = useState(false);
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [justTrashed, setJustTrashed] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'SINGLE' | 'bulk' | 'empty-bin'; id?: string } | null>(null);
    const binRef = useRef<HTMLDivElement>(null);
    const deskScrollRef = useRef<HTMLDivElement>(null);
    // Filters State

    // Filters State
    const [activeFilters, setActiveFilters] = useState({
        priority: 'all',
        status: 'all',
        type: 'all'
    });

    // New Task Form State
    const [newTask, setNewTask] = useState<{
        title: string;
        priority: 'HOT' | 'WARM' | 'COLD';
        type: string;
        description: string;
        due: string;
    }>({
        title: '',
        priority: 'WARM',
        type: '',
        description: '',
        due: ''
    });

    const filteredTasks = taskList.filter(task => {
        if (activeFilters.priority !== 'all' && task.priority !== activeFilters.priority) return false;
        if (activeFilters.status !== 'all' && task.status !== activeFilters.status) return false;
        if (activeFilters.type !== 'all' && !task.type.toLowerCase().includes(activeFilters.type.toLowerCase())) return false;
        return true;
    });

    const handleDeskScroll = () => {
        if (!deskScrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = deskScrollRef.current;
        const hasMore = scrollHeight - scrollTop - clientHeight > 20;
        setShowScrollIndicator(hasMore);
    };

    useEffect(() => {
        if (viewMode === 'desk') {
            handleDeskScroll();
            const container = deskScrollRef.current;
            if (container) {
                container.addEventListener('scroll', handleDeskScroll);
                return () => container.removeEventListener('scroll', handleDeskScroll);
            }
        }
    }, [filteredTasks, viewMode]);

    const handleComplete = (taskId: string) => {
        const task = taskList.find(t => t.id === taskId);
        updateTask.mutate(
            { id: taskId, data: { isCompleted: true } },
            {
                onSuccess: () => {
                    if (selectedTaskIds.has(taskId)) {
                        const newSelection = new Set(selectedTaskIds);
                        newSelection.delete(taskId);
                        setSelectedTaskIds(newSelection);
                    }
                    toast.success('Task Archived', {
                        description: task?.title,
                        icon: <CheckCircle2 className="text-success-500" />
                    });
                },
            }
        );
    };

    const handleDelete = (taskId: string) => {
        setDeleteTarget({ type: 'SINGLE', id: taskId });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        if (deleteTarget.type === 'SINGLE' && deleteTarget.id) {
            const task = taskList.find(t => t.id === deleteTarget.id);
            updateTask.mutate(
                { id: deleteTarget.id, data: { isCompleted: true } },
                {
                    onSuccess: () => {
                        if (deleteTarget.id && selectedTaskIds.has(deleteTarget.id)) {
                            const newSelection = new Set(selectedTaskIds);
                            newSelection.delete(deleteTarget.id);
                            setSelectedTaskIds(newSelection);
                        }
                        toast.error('Task Deleted', {
                            description: task?.title,
                            icon: <Trash2 className="text-danger-500" />
                        });
                    },
                }
            );
        } else if (deleteTarget.type === 'bulk') {
            const count = selectedTaskIds.size;
            const ids = Array.from(selectedTaskIds);
            Promise.all(ids.map(id => updateTask.mutateAsync({ id, data: { isCompleted: true } })))
                .then(() => {
                    setSelectedTaskIds(new Set());
                    toast.error(`Deleted ${count} tasks`);
                });
        } else if (deleteTarget.type === 'empty-bin') {
            toast.info('Empty bin is not supported on the server yet.');
        }
        setDeleteTarget(null);
    };

    const toggleTaskSelection = (taskId: string) => {
        setSelectedTaskIds(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    };

    const toggleAllSelection = () => {
        if (selectedTaskIds.size === filteredTasks.length) {
            setSelectedTaskIds(new Set());
        } else {
            setSelectedTaskIds(new Set(filteredTasks.map(t => t.id)));
        }
    };

    const handleBulkArchive = () => {
        const ids = Array.from(selectedTaskIds);
        const count = ids.length;
        Promise.all(ids.map(id => updateTask.mutateAsync({ id, data: { isCompleted: true } })))
            .then(() => {
                setSelectedTaskIds(new Set());
                toast.success(`Archived ${count} tasks`);
            });
    };

    const handleBulkDelete = () => {
        setDeleteTarget({ type: 'bulk' });
    };

    const handleRestore = (taskId: string) => {
        const task = archivedTasks.find(t => t.id === taskId);
        updateTask.mutate(
            { id: taskId, data: { isCompleted: false } },
            {
                onSuccess: () => {
                    toast.success('Task Restored', {
                        description: task?.title,
                        icon: <Plus className="text-primary-500" />
                    });
                },
            }
        );
    };

    const handleEmptyBin = () => {
        setDeleteTarget({ type: 'empty-bin' });
    };

    const handleDrag = (point: { x: number; y: number }, taskId: string) => {
        if (!binRef.current) return;
        const binRect = binRef.current.getBoundingClientRect();

        // info.point is in PAGE coords (includes scroll); getBoundingClientRect is in VIEWPORT coords.
        // Normalise by subtracting scroll offset.
        const viewportX = point.x - window.scrollX;
        const viewportY = point.y - window.scrollY;

        const centerX = binRect.left + binRect.width / 2;
        const centerY = binRect.top + binRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(viewportX - centerX, 2) +
            Math.pow(viewportY - centerY, 2)
        );

        // gasping threshold — bin "notices" the note approaching
        if (distance < 250) {
            setCrumplingTaskId(taskId);
        } else {
            setCrumplingTaskId(null);
        }

        // isOver threshold — note is close enough to drop
        const isOver = distance < 120;
        if (isOver !== binHovered) {
            setBinHovered(isOver);
        }
    };

    const handleDragEnd = (taskId: string, point: { x: number; y: number }) => {
        setBinHovered(false);
        setCrumplingTaskId(null);

        if (!binRef.current) {
            return;
        }
        const binRect = binRef.current.getBoundingClientRect();

        // Normalise page → viewport coords (same fix as handleDrag)
        const viewportX = point.x - window.scrollX;
        const viewportY = point.y - window.scrollY;

        const centerX = binRect.left + binRect.width / 2;
        const centerY = binRect.top + binRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(viewportX - centerX, 2) +
            Math.pow(viewportY - centerY, 2)
        );

        // Match the 120px threshold used in handleDrag
        if (distance < 120) {
            // Set visual feedback immediately
            setJustTrashed(true);
            
            // Execute the deletion with proper cleanup
            updateTask.mutate(
                { id: taskId, data: { isCompleted: true } },
                {
                    onSuccess: () => {
                        toast.success('Task Trashed', {
                            description: 'Task permanently removed from desk.',
                            icon: <Trash2 className="text-danger-500" />
                        });
                        
                        // Clean up selection state
                        if (selectedTaskIds.has(taskId)) {
                            const newSelection = new Set(selectedTaskIds);
                            newSelection.delete(taskId);
                            setSelectedTaskIds(newSelection);
                        }
                        
                        // Reset visual states after animation completes
                        setTimeout(() => {
                            setBinHovered(false);
                            setJustTrashed(false);
                        }, 800);
                    },
                    onError: () => {
                        // Reset states on error
                        setJustTrashed(false);
                        setBinHovered(false);
                        toast.error('Failed to delete task', {
                            description: 'Please try again.'
                        });
                    }
                }
            );
        }
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        // Build dueDate only if a valid date string is provided
        let dueDate: string | undefined;
        if (newTask.due) {
            const parsed = new Date(newTask.due);
            if (!isNaN(parsed.getTime())) {
                dueDate = parsed.toISOString();
            }
        }
        createTask.mutate(
            {
                title: newTask.title || 'Untitled Task',
                priority: newTask.priority.toUpperCase(),
                type: newTask.type || 'General',
                description: newTask.description,
                ...(dueDate && { dueDate }),
            },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setNewTask({ title: '', priority: 'WARM', type: '', description: '', due: '' });
                    toast.success('New task created', { description: newTask.title });
                },
                onError: () => {
                    toast.error('Failed to create task', { description: 'Please try again or check your connection.' });
                },
            }
        );
    };

    const resetFilters = () => {
        setActiveFilters({ priority: 'all', status: 'all', type: 'all' });
        setIsFilterModalOpen(false);
        toast.info('Filters cleared', {
            description: 'Showing all active workflow tasks.'
        });
    };

    if (isLoading) {
        return <AppLoader message="Loading workspace tasks..." isLoading={true} />;
    }

    return (
        <div className="space-y-6 animate-fade-in w-full max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-[var(--radius-lg)] shadow-sm border border-surface-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-inner">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">My Desk</h1>
                        <p className="text-sm text-surface-500 mt-1">Operational Command Center & Workflow queue</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex items-center bg-surface-100 p-1 rounded-lg border border-surface-200 mr-2">
                        <button
                            onClick={() => setViewMode('desk')}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer",
                                viewMode === 'desk' ? "bg-background text-primary-600 shadow-sm" : "text-surface-500 hover:text-surface-700"
                            )}
                        >
                            Desk
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer",
                                viewMode === 'list' ? "bg-background text-primary-600 shadow-sm" : "text-surface-500 hover:text-surface-700"
                            )}
                        >
                            List
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Filter size={14} />}
                            onClick={() => setIsFilterModalOpen(true)}
                            className={cn(Object.values(activeFilters).some(v => v !== 'all') && "border-primary-500 bg-primary-50 text-primary-700")}
                        >
                            Filter {Object.values(activeFilters).some(v => v !== 'all') && '•'}
                        </Button>
                        <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsCreateModalOpen(true)}>Create Task</Button>
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Urgent Tasks"
                    value={taskList.filter(t => t.priority === 'HOT' && !t.isCompleted).length.toString().padStart(2, '0')}
                    status="urgent"
                    icon={<AlertCircle size={20} />}
                    colorClass="text-danger-600"
                />
                <MetricCard
                    label="Pending Review"
                    value={taskList.filter(t => !t.isCompleted).length.toString().padStart(2, '0')}
                    status="PENDING"
                    icon={<Clock size={20} />}
                    colorClass="text-accent-600"
                />
                <MetricCard
                    label="Closed (Monthly)"
                    value={completedCount.toString()}
                    status="COMPLETED"
                    icon={<CheckCircle2 size={20} />}
                    colorClass="text-success-600"
                    trend="5%"
                />
            </div>


            {/* Conditional Interface Rendering */}
            {viewMode === 'desk' ? (
                /* Interactive Desk Area - Scrollable */
                <motion.div 
                    layout
                    className="relative h-[700px] bg-surface-50/50 rounded-[40px] border border-surface-200/50 shadow-inner overflow-hidden flex flex-col group/desk"
                >
                    {/* Desk Background Decoration */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

                    {/* Scrollable Workspace Container */}
                    <div
                        ref={deskScrollRef}
                        onScroll={handleDeskScroll}
                        className="flex-1 overflow-y-auto custom-scrollbar-subtle scroll-smooth p-8 pt-0 relative"
                        id="desk-scroll-container"
                    >
                        {/* Sticky Header Wrapper */}
                        <div className="sticky top-0 z-30 pt-8 pb-4">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                    <h2 className="text-xl font-bold text-surface-900 tracking-tight">Daily Workspace</h2>
                                    <p className="text-xs text-surface-500 font-medium italic opacity-70">
                                        Drag and crumple papers into the glass bin when finished
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {selectedTaskIds.size > 0 && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50/80 backdrop-blur-md rounded-xl border border-primary-200/50 shadow-sm animate-in zoom-in-95 duration-200 relative z-20">
                                            <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest mr-2">
                                                {selectedTaskIds.size} Marked
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-3 bg-white dark:bg-slate-800 border-primary-200 text-primary-600 hover:bg-primary-50 font-bold text-[9px] uppercase tracking-wider"
                                                onClick={handleBulkArchive}
                                            >
                                                Archive
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-3 bg-white dark:bg-slate-800 border-danger-200 text-danger-600 hover:bg-danger-50 font-bold text-[9px] uppercase tracking-wider"
                                                onClick={handleBulkDelete}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )}

                                    {/* Animated Recycle Bin */}
                                    <div ref={binRef} className="relative mr-8">
                                        {/* Localized blur backdrop behind bin */}
                                        <div className="absolute -inset-6 -top-8 -bottom-4 rounded-3xl bg-gradient-to-b from-surface-50/90 via-surface-50/70 to-surface-50/20 backdrop-blur-md -z-10" />
                                        <div className="absolute -inset-6 -top-8 -bottom-4 rounded-3xl bg-gradient-to-t from-transparent via-transparent to-surface-100/40 -z-10 pointer-events-none" />
                                        <RecycleBin
                                            isOver={binHovered}
                                            isEmpty={archivedTasks.length === 0}
                                            onClick={() => setIsArchiveModalOpen(true)}
                                            isGasping={crumplingTaskId !== null}
                                            justTrashed={justTrashed}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Task Notes Grid */}
                        <motion.div 
                            layout
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-8 place-items-center"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredTasks.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full py-20 text-center"
                                    >
                                        <p className="text-surface-400 font-bold uppercase tracking-widest text-xs">No active tasks found</p>
                                        <p className="text-surface-300 text-xs mt-1">Try adjusting your filters or create a new task.</p>
                                    </motion.div>
                                )}
                                {filteredTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        layoutId={`task-${task.id}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ 
                                            opacity: 0, 
                                            scale: 0.3,
                                            transition: { duration: 0.2, ease: "easeOut" }
                                        }}
                                        transition={{ 
                                            layout: { 
                                                type: 'spring', 
                                                stiffness: 400, 
                                                damping: 25,
                                                mass: 0.8
                                            },
                                            opacity: { duration: 0.3 },
                                            scale: { duration: 0.3 }
                                        }}
                                        className="relative flex justify-center items-center w-full h-full"
                                    >
                                        <StickyNoteTask
                                            task={task}
                                            isCrumpled={crumplingTaskId === task.id}
                                            isSelected={selectedTaskIds.has(task.id)}
                                            onToggleSelection={toggleTaskSelection}
                                            onDelete={handleDelete}
                                            onDrag={handleDrag}
                                            onDragEnd={handleDragEnd}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <AnimatePresence>
                        {showScrollIndicator && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                onClick={() => {
                                    deskScrollRef.current?.scrollBy({ top: 300, behavior: 'smooth' });
                                }}
                                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 bg-background/80 backdrop-blur-md border border-surface-200 shadow-lg px-4 py-2 rounded-full flex items-center gap-2 text-primary-600 hover:bg-primary-50 transition-all group cursor-pointer"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">More Tasks Below</span>
                                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div className="p-4 border-t border-surface-100 bg-background/40 backdrop-blur-sm text-center relative z-10">
                        <div className="flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                            <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">
                                Real-time Operational Sync Active
                            </span>
                        </div>
                    </div>
                </motion.div>
            ) : (
                /* Classic Dashboard List View - Completely different interface */
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <div>
                            <h2 className="text-xl font-bold text-surface-900 tracking-tight">Active Workflow Pipeline</h2>
                            <p className="text-sm text-surface-500 mt-1">Manage and track your operational task queue</p>
                        </div >
                        <div className="flex items-center gap-2">
                            {selectedTaskIds.size > 0 && (
                                <div className="flex items-center gap-2 mr-4 px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100 animate-in fade-in slide-in-from-right-4">
                                    <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest mr-2">
                                        {selectedTaskIds.size} Selected
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-3 bg-white dark:bg-slate-800 border-primary-200 text-primary-600 hover:bg-primary-50 font-bold text-[9px] uppercase tracking-wider"
                                        onClick={handleBulkArchive}
                                    >
                                        Archive All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-3 bg-white dark:bg-slate-800 border-danger-200 text-danger-600 hover:bg-danger-50 font-bold text-[9px] uppercase tracking-wider"
                                        onClick={handleBulkDelete}
                                    >
                                        Delete All
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white dark:bg-slate-900"
                                onClick={() => setIsArchiveModalOpen(true)}
                            >
                                View Archive ({archivedTasks.length})
                            </Button>
                        </div>
                    </div >

                    <div className="bg-background rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                        <div className="min-w-[560px]">
                        <div className="p-4 bg-surface-50/50 border-b border-surface-200 grid grid-cols-12 gap-4 text-[10px] font-black text-surface-400 uppercase tracking-widest items-center">
                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={toggleAllSelection}
                                    className={cn(
                                        "w-4 h-4 rounded border transition-all flex items-center justify-center",
                                        selectedTaskIds.size === filteredTasks.length && filteredTasks.length > 0
                                            ? "bg-primary-600 border-primary-600 text-white"
                                            : "bg-white dark:bg-slate-800 border-surface-300 hover:border-primary-400"
                                    )}
                                >
                                    {selectedTaskIds.size === filteredTasks.length && filteredTasks.length > 0 && <Check size={10} strokeWidth={4} />}
                                </button>
                            </div>
                            <div className="col-span-5">Task Details</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-2">Due Date</div>
                            <div className="col-span-2 text-right px-2">Actions</div>
                        </div>

                        <div className="divide-y divide-surface-100">
                            <AnimatePresence mode="popLayout">
                                {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className={cn(
                                            "grid grid-cols-12 gap-4 p-4 items-center transition-colors group",
                                            selectedTaskIds.has(task.id) ? "bg-primary-50/30" : "hover:bg-surface-50"
                                        )}
                                    >
                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={() => toggleTaskSelection(task.id)}
                                                className={cn(
                                                    "w-4 h-4 rounded border transition-all flex items-center justify-center",
                                                    selectedTaskIds.has(task.id)
                                                        ? "bg-primary-600 border-primary-600 text-white"
                                                        : "bg-white dark:bg-slate-800 border-surface-300 hover:border-primary-400"
                                                )}
                                            >
                                                {selectedTaskIds.has(task.id) && <Check size={10} strokeWidth={4} />}
                                            </button>
                                        </div>

                                        <div className="col-span-5 flex items-center gap-3">
                                            <div className={cn(
                                                "w-1 h-8 rounded-full flex-shrink-0",
                                                task.priority === 'HOT' ? "bg-danger-500" : task.priority === 'WARM' ? "bg-accent-500" : "bg-primary-500"
                                            )} />
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-surface-900 leading-none truncate">{task.title}</h4>
                                                <p className="text-[10px] text-surface-400 mt-1 truncate max-w-[250px] font-medium italic">{task.description}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <span className="px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 font-bold text-[9px] uppercase tracking-wider">
                                                {task.type}
                                            </span>
                                        </div>

                                        <div className="col-span-2">
                                            <span className="text-[11px] font-semibold text-surface-600 flex items-center gap-1.5">
                                                <Clock size={10} className="text-surface-400" />
                                                {task.due}
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex justify-end gap-1 px-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 text-success-600 hover:bg-success-50"
                                                onClick={() => handleComplete(task.id)}
                                                title="Mark as Done"
                                            >
                                                <Check size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 text-danger-400 hover:bg-danger-50 hover:text-danger-600"
                                                onClick={() => handleDelete(task.id)}
                                                title="Delete Permanently"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-surface-300 hover:text-surface-600" aria-label="More options" onClick={() => toast.info('Task Options', { description: `More actions for "${task.title}" coming soon.` })}>
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="py-20 text-center">
                                        <p className="text-surface-400 font-bold uppercase tracking-widest text-xs">No active tasks found</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                        </div>{/* min-w-[560px] */}
                        </div>{/* overflow-x-auto */}
                    </div>
                </div >
            )
            }

            {/* Enhanced Create Task Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Workflow Task"
                description="Assign a new operational task to your dashboard queue."
                size="xl"
                className="overflow-visible"
                footer={
                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="flex-1 sm:flex-none py-3 px-8 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
                        >
                            Discard
                        </button>
                        <button
                            form="create-task-form"
                            type="submit"
                            className="flex-1 sm:flex-none py-3 px-12 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm"
                        >
                            Create Task
                        </button>
                    </div>
                }
            >
                <form id="create-task-form" onSubmit={handleAddTask} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Tag size={12} className="text-primary-500" />
                                Task Title
                            </label>
                            <input
                                autoFocus
                                placeholder="e.g., Renewal: XYZ Corp"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                required
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400 bg-white/50 dark:bg-slate-800/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Briefcase size={12} className="text-primary-500" />
                                Insurance Type / Category
                            </label>
                            <input
                                placeholder="e.g., Motor Comprehensive, Health, Life..."
                                value={newTask.type}
                                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 bg-white/50 dark:bg-slate-800/50 shadow-sm placeholder:text-surface-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <AlertCircle size={12} className="text-danger-500" />
                                Priority
                            </label>
                            <CustomSelect
                                options={[
                                    { label: '🔥 Hot (Urgent)', value: 'HOT' },
                                    { label: '⚡ Warm (Normal)', value: 'WARM' },
                                    { label: '❄️ Cold (Low)', value: 'COLD' },
                                ]}
                                value={newTask.priority}
                                onChange={(v) => setNewTask({ ...newTask, priority: v as 'HOT' | 'WARM' | 'COLD' })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calendar size={12} className="text-accent-500" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={newTask.due}
                                onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 dark:bg-slate-800/50 shadow-sm placeholder:text-surface-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <MoreVertical size={12} className="text-surface-400" />
                            Description & Context
                        </label>
                        <textarea
                            placeholder="Provide details about the required action..."
                            rows={4}
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 bg-white/50 dark:bg-slate-800/50 shadow-sm placeholder:text-surface-400 resize-none"
                        />
                    </div>
                </form>
            </Modal>

            {/* NEW Filter Modal */}
            <Modal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                title="Filter Workflow Queue"
                description="Refine your active tasks based on operational criteria."
                size="md"
                footer={
                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="flex-1 sm:flex-none py-3 px-8 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => setIsFilterModalOpen(false)}
                            className="flex-1 sm:flex-none py-3 px-10 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm"
                        >
                            Apply Filters
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Priority Level</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['all', 'HOT', 'WARM', 'COLD'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setActiveFilters({ ...activeFilters, priority: p as 'all' | 'HOT' | 'WARM' | 'COLD' })}
                                    className={cn(
                                        "px-3 py-2.5 text-xs font-black rounded-xl border transition-all uppercase tracking-tight",
                                        activeFilters.priority === p
                                            ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/20"
                                            : "bg-surface-50 border-surface-200 text-surface-600 hover:bg-white dark:hover:bg-slate-800 hover:border-primary-300"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Process State</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['all', 'PENDING', 'UNDER_REVIEW', 'REGISTERED'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setActiveFilters({ ...activeFilters, status: s as 'all' | 'PENDING' | 'UNDER_REVIEW' | 'REGISTERED' })}
                                    className={cn(
                                        "px-4 py-3 text-xs font-black rounded-xl border transition-all uppercase tracking-tight text-left flex justify-between items-center",
                                        activeFilters.status === s
                                            ? "bg-primary-50 border-primary-500 text-primary-700 shadow-sm"
                                            : "bg-surface-50 border-surface-200 text-surface-600 hover:bg-white dark:hover:bg-slate-800 hover:border-surface-300"
                                    )}
                                >
                                    {s.replace('_', ' ')}
                                    {activeFilters.status === s && <Check size={14} className="text-primary-600" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Line of Business</label>
                        <input
                            placeholder="e.g., Motor, General, Tech..."
                            value={activeFilters.type === 'all' ? '' : activeFilters.type}
                            onChange={(e) => setActiveFilters({ ...activeFilters, type: e.target.value || 'all' })}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 dark:bg-slate-800/50 shadow-sm placeholder:text-surface-400"
                        />
                    </div>
                </div>
            </Modal>

            {/* Archive View Modal */}
            <ArchiveModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                archivedTasks={archivedTasks}
                onRestore={handleRestore}
                onClearAll={handleEmptyBin}
            />

            <ConfirmationModal
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title={
                    deleteTarget?.type === 'empty-bin' ? 'Empty Bin?'
                        : deleteTarget?.type === 'bulk' ? `Delete ${selectedTaskIds.size} Tasks?`
                        : 'Delete Task?'
                }
                description={
                    deleteTarget?.type === 'empty-bin'
                        ? 'All archived tasks will be permanently removed. This action cannot be undone.'
                        : deleteTarget?.type === 'bulk'
                        ? `You are about to permanently delete ${selectedTaskIds.size} selected tasks. This cannot be undone.`
                        : `This task will be permanently deleted. This action cannot be undone.`
                }
                confirmLabel={
                    deleteTarget?.type === 'empty-bin' ? 'Empty Bin'
                        : deleteTarget?.type === 'bulk' ? `Delete ${selectedTaskIds.size} Tasks`
                        : 'Delete Task'
                }
                variant="danger"
                icon={<Trash2 size={28} />}
            />
        </div >
    );
}

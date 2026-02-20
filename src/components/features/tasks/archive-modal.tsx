'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trash2, Archive } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Task {
    id: string;
    title: string;
    priority: 'hot' | 'warm' | 'cold';
    type: string;
    description: string;
}

interface ArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    archivedTasks: Task[];
    onRestore: (taskId: string) => void;
    onClearAll: () => void;
}

export function ArchiveModal({ isOpen, onClose, archivedTasks, onRestore, onClearAll }: ArchiveModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Archived Workspace"
            description="Operational history and finished tasks awaiting permanent disposal."
            size="lg"
            footer={
                <div className="flex justify-between w-full px-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 font-black uppercase tracking-widest text-[10px] hover:bg-danger-50"
                        leftIcon={<Trash2 size={12} />}
                        onClick={onClearAll}
                        disabled={archivedTasks.length === 0}
                    >
                        Empty Bin
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onClose}
                        className="font-black uppercase tracking-widest text-[10px]"
                    >
                        Done
                    </Button>
                </div>
            }
        >
            <div className="max-h-[400px] overflow-y-auto pr-2 pb-10 space-y-4 custom-scrollbar-subtle">
                <AnimatePresence initial={false} mode="popLayout">
                    {archivedTasks && archivedTasks.length > 0 ? (
                        archivedTasks.map((task) => (
                            <motion.div
                                key={`archived-${task.id}`}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                className="group flex items-center justify-between p-4 bg-surface-50 rounded-2xl border border-surface-100 hover:border-primary-200 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner text-white",
                                        task.priority === 'hot' ? "bg-danger-500" :
                                            task.priority === 'warm' ? "bg-accent-500" : "bg-primary-500"
                                    )}>
                                        <Archive size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-surface-900 group-hover:text-primary-600 transition-colors truncate max-w-[200px]">
                                            {task.title}
                                        </h4>
                                        <p className="text-[10px] text-surface-500 font-medium uppercase tracking-tight">
                                            {task.type} • Session Record
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-all text-primary-600 font-black uppercase tracking-widest text-[10px]"
                                    leftIcon={<RefreshCw size={12} />}
                                    onClick={() => onRestore(task.id)}
                                >
                                    Restore
                                </Button>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mx-auto text-surface-200">
                                <Trash2 size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-surface-900 uppercase tracking-widest">Bin is Empty</h3>
                                <p className="text-xs text-surface-500 mt-1 font-medium italic">Your archived history is currently clear.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Modal>
    );
}

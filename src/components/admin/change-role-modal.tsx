'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { ShieldCheck, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useChangeUserRole } from '@/hooks/api/use-users';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

const ROLE_TIERS = [
    { value: 'ADMINISTRATOR', label: 'Administrator', level: 7, description: 'Full system control within workspace.' },
    { value: 'MANAGER', label: 'Manager', level: 5, description: 'Approvals, reports, team oversight.' },
    { value: 'SUPERVISOR', label: 'Supervisor', level: 4, description: 'Branch/team monitoring, limited approvals.' },
    { value: 'AGENT', label: 'Agent', level: 2, description: 'Daily operations, scoped by permissions.' },
] as const;

const ROLE_LEVEL: Record<string, number> = {
    PLATFORM_SUPER_ADMIN: 10,
    WORKSPACE_OWNER: 8,
    ADMINISTRATOR: 7,
    MANAGER: 5,
    SUPERVISOR: 4,
    AGENT: 2,
};

interface ChangeRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: { id: string; name: string; email?: string; role: string } | null;
}

export function ChangeRoleModal({ isOpen, onClose, user }: ChangeRoleModalProps) {
    const [selectedRole, setSelectedRole] = useState('');
    const [resetPermissions, setResetPermissions] = useState(true);
    const changeRoleMutation = useChangeUserRole();
    const currentUserRole = useAuthStore(s => s.user?.role) || 'AGENT';
    const currentUserLevel = ROLE_LEVEL[currentUserRole] ?? 0;

    useEffect(() => {
        if (isOpen && user) {
            setSelectedRole(user.role);
            setResetPermissions(true);
        }
    }, [isOpen, user]);

    if (!user) return null;

    const hasChanged = selectedRole !== user.role;

    const handleSave = () => {
        if (!hasChanged) return;
        changeRoleMutation.mutate(
            { userId: user.id, role: selectedRole, resetPermissions },
            {
                onSuccess: () => {
                    toast.success('Role Updated', {
                        description: `${user.name} is now a ${selectedRole.replace(/_/g, ' ')}.`,
                    });
                    onClose();
                },
                onError: (error: any) => {
                    const message = error?.response?.data?.message || 'Failed to change role';
                    toast.error('Update Failed', { description: Array.isArray(message) ? message[0] : message });
                }
            }
        );
    };

    const footer = (
        <div className="flex items-center justify-between w-full pt-2">
            <div className="text-xs text-surface-500 font-medium">
                {hasChanged ? `${user.role.replace(/_/g, ' ')} → ${selectedRole.replace(/_/g, ' ')}` : 'No change'}
            </div>
            <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="py-2.5 px-6 rounded-xl bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 text-sm">
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!hasChanged || changeRoleMutation.isPending}
                    type="button"
                    className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {changeRoleMutation.isPending ? (
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save size={16} />
                    )}
                    Save Change
                </button>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Change Access Right"
            description={`Adjust the role tier for ${user.name}.`}
            size="lg"
            footer={footer}
        >
            <div className="flex flex-col gap-5">
                {/* Current user info */}
                <div className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-slate-800/50 rounded-xl border border-surface-200 dark:border-slate-700">
                    <div className="size-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-surface-900 dark:text-slate-100 truncate">{user.name}</p>
                        {user.email && <p className="text-xs text-surface-500 truncate">{user.email}</p>}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-surface-500 bg-surface-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        Current: {user.role.replace(/_/g, ' ')}
                    </span>
                </div>

                {/* Role selector */}
                <div className="flex flex-col gap-2">
                    {ROLE_TIERS.map(tier => {
                        const isDisabled = tier.level >= currentUserLevel;
                        const isSelected = selectedRole === tier.value;
                        const isCurrent = user.role === tier.value;
                        return (
                            <button
                                key={tier.value}
                                disabled={isDisabled}
                                onClick={() => setSelectedRole(tier.value)}
                                className={cn(
                                    'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                                    isDisabled
                                        ? 'opacity-40 cursor-not-allowed border-surface-100 dark:border-slate-800'
                                        : isSelected
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
                                            : 'border-surface-200 dark:border-slate-700 hover:border-surface-300 dark:hover:border-slate-600 cursor-pointer'
                                )}
                            >
                                <div className={cn(
                                    'size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                                    isSelected ? 'border-primary-600 bg-primary-600' : 'border-surface-300 dark:border-slate-600'
                                )}>
                                    {isSelected && <div className="size-2 rounded-full bg-white" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-surface-900 dark:text-slate-100">{tier.label}</span>
                                        {isCurrent && (
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-primary-600 bg-primary-100 dark:bg-primary-900/30 px-1.5 py-0.5 rounded">Current</span>
                                        )}
                                        {isDisabled && (
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-surface-400 bg-surface-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Above your level</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-surface-500 mt-0.5">{tier.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Reset permissions toggle */}
                {hasChanged && (
                    <label className="flex items-center gap-3 p-4 bg-warning-50 dark:bg-amber-900/10 rounded-xl border border-warning-200 dark:border-amber-800/30 cursor-pointer group">
                        <div className="relative flex items-center justify-center shrink-0">
                            <input
                                type="checkbox"
                                checked={resetPermissions}
                                onChange={(e) => setResetPermissions(e.target.checked)}
                                className="peer h-4 w-4 appearance-none rounded border border-warning-400 bg-white dark:bg-slate-900 checked:bg-warning-600 checked:border-warning-600 focus:outline-none focus:ring-2 focus:ring-warning-500/30 transition-colors cursor-pointer"
                            />
                            <RotateCcw size={10} strokeWidth={3} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-warning-900 dark:text-amber-300">Reset permissions to role defaults</span>
                            <span className="text-xs text-warning-700 dark:text-amber-500">Recommended when changing tiers to ensure the correct permission baseline.</span>
                        </div>
                    </label>
                )}
            </div>
        </Modal>
    );
}

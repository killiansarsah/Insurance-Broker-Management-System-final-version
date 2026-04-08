'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { ShieldAlert, Check, Search, Save } from 'lucide-react';
import { toast } from 'sonner';
import { PERMISSION_GROUPS } from '@/lib/permissions';
import { useUpdateUserPermissions } from '@/hooks/api/use-users';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

interface UserPermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: { id: string; name: string; role?: string; permissions?: string[] } | null;
}

export function UserPermissionsModal({ isOpen, onClose, user }: UserPermissionsModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [localPermissions, setLocalPermissions] = useState<Set<string>>(new Set());
    const updatePermissionsMutation = useUpdateUserPermissions();
    const currentUserRole = useAuthStore(s => s.user?.role) || 'AGENT';

    useEffect(() => {
        if (isOpen && user) {
            setLocalPermissions(new Set(user.permissions || []));
            setSearchQuery('');
        }
    }, [isOpen, user]);

    if (!user) return null;

    const togglePermission = (permissionId: string) => {
        setLocalPermissions(prev => {
            const next = new Set(prev);
            if (next.has(permissionId)) {
                next.delete(permissionId);
            } else {
                next.add(permissionId);
            }
            return next;
        });
    };

    const toggleGroup = (groupIds: string[], selectAll: boolean) => {
        setLocalPermissions(prev => {
            const next = new Set(prev);
            groupIds.forEach(id => {
                if (selectAll) next.add(id);
                else next.delete(id);
            });
            return next;
        });
    };

    const handleSave = () => {
        const permissionsArray = Array.from(localPermissions);
        updatePermissionsMutation.mutate(
            { userId: user.id, permissions: permissionsArray },
            {
                onSuccess: () => {
                    toast.success('Permissions Updated', {
                        description: `Access rights for ${user.name} have been updated successfully.`,
                    });
                    onClose();
                },
                onError: (error: any) => {
                    const message = error?.response?.data?.message || 'Failed to update user permissions';
                    toast.error('Update Failed', { description: Array.isArray(message) ? message[0] : message });
                }
            }
        );
    };

    const filteredGroups = PERMISSION_GROUPS.map(group => {
        const filteredPerms = group.permissions.filter(p =>
            p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { ...group, permissions: filteredPerms };
    }).filter(group => group.permissions.length > 0);

    const isSystemAdmin = localPermissions.has('*:*');
    const totalEnabled = localPermissions.size;

    const handleResetToDefaults = async () => {
        try {
            const { DEFAULT_PERMISSIONS_MAP } = await import('@/lib/permissions');
            const defaults = DEFAULT_PERMISSIONS_MAP[user.role || 'AGENT'] || [];
            setLocalPermissions(new Set(defaults));
            toast.info('Permissions reset to role defaults', { description: `Applied ${defaults.length} default permissions for ${(user.role || 'AGENT').replace(/_/g, ' ')}.` });
        } catch {
            toast.error('Could not load defaults');
        }
    };

    const footer = (
        <div className="flex items-center justify-between w-full pt-2">
            <div className="text-xs text-surface-500 font-medium">
                {isSystemAdmin ? 'Full System Access Enabled' : `${totalEnabled} permissions enabled`}
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="py-2.5 px-4 rounded-xl border border-warning-300 text-warning-700 font-bold hover:bg-warning-50 transition-all active:scale-95 text-sm dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
                >
                    Reset to Defaults
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-6 rounded-xl bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={updatePermissionsMutation.isPending}
                    type="button"
                    className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20 active:scale-95 text-sm disabled:opacity-50"
                >
                    {updatePermissionsMutation.isPending ? (
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save size={16} />
                    )}
                    Save Permissions
                </button>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Access Rights: ${user.name}`}
            description="Manage fine-grained permissions for this user."
            size="2xl"
            footer={footer}
        >
            <div className="flex flex-col gap-5">
                {/* Search & Super Admin Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-surface-50 p-4 rounded-xl border border-surface-200 dark:bg-slate-800/50 dark:border-slate-700">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Find permission..."
                            className="w-full h-10 pl-10 pr-4 rounded-lg border border-surface-200 bg-white text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                        />
                    </div>
                    
                    <button
                        onClick={() => togglePermission('*:*')}
                        className={cn(
                            'shrink-0 flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-bold border transition-colors',
                            isSystemAdmin
                                ? 'bg-danger-50 border-danger-200 text-danger-700 hover:bg-danger-100 dark:bg-danger-900/30 dark:border-danger-800/50 dark:text-danger-400'
                                : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
                        )}
                    >
                        <ShieldAlert size={16} className={isSystemAdmin ? 'text-danger-500' : 'text-surface-400'} />
                        Super Admin Access
                        <div className={cn(
                            'ml-2 size-4 rounded flex items-center justify-center border',
                            isSystemAdmin ? 'bg-danger-600 border-danger-600 text-white' : 'border-surface-300 dark:border-slate-600'
                        )}>
                            {isSystemAdmin && <Check size={12} strokeWidth={3} />}
                        </div>
                    </button>
                </div>

                {/* Permissions Breakdown */}
                {isSystemAdmin ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center bg-danger-50/50 border border-dashed border-danger-200 rounded-xl dark:bg-danger-900/10 dark:border-danger-800/30">
                        <ShieldAlert size={48} className="text-danger-300 dark:text-danger-800 mb-4" />
                        <h4 className="text-lg font-bold text-danger-900 dark:text-danger-400">Total System Control Override Active</h4>
                        <p className="text-sm text-danger-700 dark:text-danger-500 max-w-md mt-2">
                            This user has the `*:*` wildcard permission. They bypass all fine-grained checks across the entire platform.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredGroups.map(group => {
                            const groupPermIds = group.permissions.map(p => p.id);
                            const groupEnabledCount = groupPermIds.filter(id => localPermissions.has(id)).length;
                            const isAllSelected = groupEnabledCount === groupPermIds.length;
                            const isPartial = groupEnabledCount > 0 && !isAllSelected;

                            return (
                                <div key={group.name} className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between border-b border-surface-100 dark:border-slate-800 pb-2">
                                        <h4 className="text-sm font-bold text-surface-900 dark:text-slate-100">{group.name}</h4>
                                        <button
                                            onClick={() => toggleGroup(groupPermIds, !isAllSelected)}
                                            className={cn(
                                                'text-[11px] font-semibold tracking-wide uppercase px-2 py-1 rounded transition-colors',
                                                isAllSelected ? 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20' : 'text-surface-500 hover:bg-surface-100 hover:text-surface-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                                            )}
                                        >
                                            {isAllSelected ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {group.permissions.map(perm => (
                                            <label
                                                key={perm.id}
                                                className="flex items-start gap-3 p-2.5 rounded-lg border border-transparent hover:border-surface-200 hover:bg-surface-50 dark:hover:bg-slate-800 dark:hover:border-slate-700 transition cursor-pointer group"
                                            >
                                                <div className="mt-0.5 relative flex items-center justify-center shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={localPermissions.has(perm.id)}
                                                        onChange={() => togglePermission(perm.id)}
                                                        className="peer h-4 w-4 appearance-none rounded border border-surface-300 bg-white dark:bg-slate-900 dark:border-slate-600 checked:bg-primary-600 checked:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors cursor-pointer"
                                                    />
                                                    <Check size={12} strokeWidth={3} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-sm font-semibold text-surface-800 group-hover:text-surface-900 dark:text-slate-300 dark:group-hover:text-slate-100">
                                                        {perm.label}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-surface-400 mt-0.5 bg-surface-100 dark:bg-slate-800 self-start px-1.5 py-0.5 rounded">
                                                        {perm.id}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredGroups.length === 0 && (
                            <div className="col-span-full py-10 text-center text-surface-400">
                                <Search size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No permissions found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}

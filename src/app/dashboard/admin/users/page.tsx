'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    User as UserIcon,
    Shield,
    Mail,
    Phone,
    MoreVertical,
    Lock,
    Unlock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { users } from '@/mock/users';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { UserRole, User } from '@/types';
import { InviteUserModal } from '@/components/admin/invite-user-modal';
import { CustomSelect } from '@/components/ui/select-custom';

const ROLE_COLORS: Record<UserRole, 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'outline'> = {
    super_admin: 'danger',
    admin: 'danger',
    branch_manager: 'warning',
    senior_broker: 'primary',
    broker: 'primary',
    data_entry: 'default',
    viewer: 'outline',
};

const ROLE_LABELS: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    branch_manager: 'Branch Manager',
    senior_broker: 'Senior Broker',
    broker: 'Broker',
    data_entry: 'Data Entry',
    viewer: 'Viewer',
};

export default function UsersPage() {
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const filteredUsers = roleFilter === 'all'
        ? users
        : users.filter(u => u.role === roleFilter);

    const handleAction = (action: string, userName: string) => {
        setOpenMenuId(null);
        // Simulate action
        import('sonner').then(({ toast }) => {
            if (action === 'password') {
                toast.success('Password Reset Sent', { description: `Reset link sent to ${userName}` });
            } else if (action === 'deactivate') {
                toast.warning('User Deactivated', { description: `${userName} is now inactive.` });
            }
        });
    };

    return (
        <div className="space-y-6 animate-fade-in" onClick={() => setOpenMenuId(null)}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">User Management</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage system access and roles.</p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<Plus size={16} />}
                    onClick={() => setIsInviteOpen(true)}
                >
                    Invite User
                </Button>
            </div>

            <InviteUserModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
            />

            {/* List */}
            <DataTable<User>
                data={filteredUsers}
                columns={[
                    {
                        key: 'firstName',
                        label: 'User',
                        sortable: true,
                        render: (row) => (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-500 font-medium text-xs overflow-hidden">
                                    {row.avatarUrl ? (
                                        <img src={row.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{row.firstName[0]}{row.lastName[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-surface-900">{row.firstName} {row.lastName}</p>
                                    <p className="text-xs text-surface-500">{row.email}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        key: 'role',
                        label: 'Role',
                        sortable: true,
                        render: (row) => <Badge variant={ROLE_COLORS[row.role]}>{ROLE_LABELS[row.role]}</Badge>
                    },
                    { key: 'branchId', label: 'Branch', sortable: true },
                    {
                        key: 'isActive',
                        label: 'Status',
                        sortable: true,
                        render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} />
                    },
                    { key: 'lastLogin', label: 'Last Login', sortable: true, render: (row) => row.lastLogin ? formatDate(String(row.lastLogin)) : 'Never' },
                    {
                        key: 'id',
                        label: 'Actions',
                        render: (row) => (
                            <div className="relative flex justify-end">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === row.id ? null : row.id);
                                    }}
                                    className="p-1 text-surface-400 hover:text-primary-600 transition-colors rounded hover:bg-surface-100"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {openMenuId === row.id && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border border-surface-200 z-20 animate-scale-in origin-top-right overflow-hidden">
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors flex items-center gap-2"
                                            onClick={(e) => { e.stopPropagation(); handleAction('edit', row.firstName); }}
                                        >
                                            <UserIcon size={14} /> Edit Profile
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors flex items-center gap-2"
                                            onClick={(e) => { e.stopPropagation(); handleAction('password', row.firstName); }}
                                        >
                                            <Lock size={14} /> Reset Password
                                        </button>
                                        <div className="h-px bg-surface-100 my-1" />
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors flex items-center gap-2 font-medium"
                                            onClick={(e) => { e.stopPropagation(); handleAction('deactivate', row.firstName); }}
                                        >
                                            <Unlock size={14} /> Deactivate User
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                ]}
                searchKeys={['firstName', 'lastName', 'email', 'role']}
                headerActions={
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            label="Role"
                            options={[
                                { label: 'All Roles', value: 'all' },
                                ...Object.entries(ROLE_LABELS).map(([key, label]) => ({ label, value: key }))
                            ]}
                            value={roleFilter}
                            onChange={(v) => setRoleFilter(v as string)}
                        />
                    </div>
                }
            />
        </div>
    );
}

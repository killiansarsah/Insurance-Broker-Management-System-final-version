'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import dynamic from 'next/dynamic';
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
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { useUsers } from '@/hooks/api/use-users';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { UserRole, User } from '@/types';

const InviteUserModal = dynamic(
    () => import('@/components/admin/invite-user-modal').then(m => ({ default: m.InviteUserModal })),
    { ssr: false }
);
import { CustomSelect } from '@/components/ui/select-custom';

const ROLE_COLORS: Record<UserRole, 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'outline'> = {
    // New 5-tier roles + platform admin
    PLATFORM_SUPER_ADMIN: 'danger',
    WORKSPACE_OWNER: 'danger',
    ADMINISTRATOR: 'danger',
    MANAGER: 'warning',
    SUPERVISOR: 'primary',
    AGENT: 'default',
};

const ROLE_LABELS: Record<UserRole, string> = {
    // New 5-tier roles + platform admin
    PLATFORM_SUPER_ADMIN: 'Platform Admin',
    WORKSPACE_OWNER: 'Workspace Owner',
    ADMINISTRATOR: 'Administrator',
    MANAGER: 'Manager',
    SUPERVISOR: 'Supervisor',
    AGENT: 'Agent',
};

export default function UsersPage() {
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const { data: usersData } = useUsers();
    const users: any[] = (usersData as any)?.items ?? (usersData as any)?.data ?? (Array.isArray(usersData) ? usersData : []);

    const filteredUsers = roleFilter === 'all'
        ? users
        : users.filter((u: any) => u.role === roleFilter);

    const handleAction = (action: string, userName: string) => {
        setOpenMenuId(null);
        if (action === 'password') {
            toast.success('Password Reset Sent', { description: `Reset link sent to ${userName}` });
        } else if (action === 'deactivate') {
            toast.warning('User Deactivated', { description: `${userName} is now inactive.` });
        }
    };

    const columns = useMemo(() => [
        {
            key: 'firstName',
            label: 'User',
            sortable: true,
            render: (row: any) => (
                <div className="flex items-center gap-3">
                    <Avatar 
                        name={`${row.firstName} ${row.lastName}`}
                        src={row.avatarUrl || undefined}
                        size="sm"
                    />
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
            render: (row: any) => <Badge variant={ROLE_COLORS[row.role as UserRole]}>{ROLE_LABELS[row.role as UserRole]}</Badge>
        },
        { key: 'branchId', label: 'Branch', sortable: true },
        {
            key: 'isActive',
            label: 'Status',
            sortable: true,
            render: (row: any) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />
        },
        { key: 'lastLogin', label: 'Last Login', sortable: true, render: (row: any) => row.lastLogin ? formatDate(String(row.lastLogin)) : 'Never' },
        {
            key: 'id',
            label: 'Actions',
            render: (row: any) => (
                <div className="relative flex justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === row.id ? null : row.id);
                        }}
                        className="p-1 text-surface-400 hover:text-primary-600 transition-colors rounded hover:bg-surface-100 cursor-pointer"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {openMenuId === row.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-background rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border border-surface-200 z-20 animate-scale-in origin-top-right overflow-hidden">
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
    ], [openMenuId]);

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
            <DataTable<any>
                data={filteredUsers}
                columns={columns}
                searchKeys={['firstName', 'lastName', 'email', 'role', 'branchId']}
                emptyMessage="No team members found."
                headerActions={
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            label="Role"
                            options={[
                                { label: 'All Roles', value: 'all' },
                                { label: 'Workspace Owner', value: 'WORKSPACE_OWNER' },
                                { label: 'Administrator', value: 'ADMINISTRATOR' },
                                { label: 'Manager', value: 'MANAGER' },
                                { label: 'Supervisor', value: 'SUPERVISOR' },
                                { label: 'Agent', value: 'AGENT' },
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

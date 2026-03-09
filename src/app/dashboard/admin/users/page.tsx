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
    PLATFORM_SUPER_ADMIN: 'danger',
    SUPER_ADMIN: 'danger',
    TENANT_ADMIN: 'danger',
    ADMIN: 'danger',
    BRANCH_MANAGER: 'warning',
    COMPLIANCE_OFFICER: 'warning',
    FINANCE_MANAGER: 'warning',
    SENIOR_BROKER: 'primary',
    BROKER: 'primary',
    UNDERWRITER: 'primary',
    AGENT: 'default',
    SECRETARY: 'default',
    DATA_ENTRY: 'default',
    VIEWER: 'outline',
};

const ROLE_LABELS: Record<UserRole, string> = {
    PLATFORM_SUPER_ADMIN: 'Platform Admin',
    SUPER_ADMIN: 'Super Admin',
    TENANT_ADMIN: 'Tenant Admin',
    ADMIN: 'Admin',
    BRANCH_MANAGER: 'Branch Manager',
    COMPLIANCE_OFFICER: 'Compliance Officer',
    FINANCE_MANAGER: 'Finance Manager',
    SENIOR_BROKER: 'Senior Broker',
    BROKER: 'Broker',
    UNDERWRITER: 'Underwriter',
    AGENT: 'Agent',
    SECRETARY: 'Secretary',
    DATA_ENTRY: 'Data Entry',
    VIEWER: 'Viewer',
};

export default function UsersPage() {
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const { data: usersData } = useUsers();
    const users = usersData?.data || [];

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
                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-500 font-medium text-xs overflow-hidden">
                        {row.avatarUrl ? (
                            <Image src={row.avatarUrl} alt="" width={32} height={32} className="w-full h-full object-cover" />
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
            render: (row: any) => <Badge variant={ROLE_COLORS[row.role as UserRole]}>{ROLE_LABELS[row.role as UserRole]}</Badge>
        },
        { key: 'branchId', label: 'Branch', sortable: true },
        {
            key: 'isActive',
            label: 'Status',
            sortable: true,
            render: (row: any) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} />
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
                searchKeys={['firstName', 'lastName', 'email', 'role']}
                emptyMessage="No team members found."
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

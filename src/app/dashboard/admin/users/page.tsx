'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    User,
    Shield,
    Mail,
    Phone,
    MoreVertical,
    Lock,
    Unlock,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { StatusBadge } from '@/components/data-display/status-badge';
import { users } from '@/mock/users';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';

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

    const filteredUsers = roleFilter === 'all'
        ? users
        : users.filter(u => u.role === roleFilter);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">User Management</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage system access and roles.</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={16} />}>
                    Invite User
                </Button>
            </div>

            {/* List */}
            <DataTable
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
                        render: () => (
                            <div className="flex justify-end gap-2">
                                <button className="p-1 text-surface-400 hover:text-primary-600 transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        )
                    }
                ]}
                searchKeys={['firstName', 'lastName', 'email', 'role']}
                headerActions={
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="pl-8 pr-3 py-2 text-xs font-medium bg-surface-50 border border-surface-200 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none cursor-pointer"
                            >
                                <option value="all">All Roles</option>
                                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                }
            />
        </div>
    );
}

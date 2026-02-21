'use client';

import { Users, Building2, Shield } from 'lucide-react';
import { CustomSelect } from '@/components/ui/select-custom';

interface TeamFiltersProps {
    role: string | null;
    branch: string | null;
    onRoleChange: (val: string | null) => void;
    onBranchChange: (val: string | null) => void;
}

const roleOptions = [
    { label: 'All Roles', value: '' },
    { label: 'Platform Admins', value: 'platform_super_admin' },
    { label: 'Tenant Admins', value: 'tenant_admin' },
    { label: 'Brokers', value: 'broker' },
    { label: 'Secretaries', value: 'secretary' },
    { label: 'Managers', value: 'branch_manager' },
    { label: 'Staff', value: 'data_entry' },
];

const branchOptions = [
    { label: 'All Branches', value: '' },
    { label: 'Accra Office', value: 'BR-ACC-01' },
    { label: 'Kumasi Office', value: 'BR-KUM-01' },
];

export function TeamFilters({ role, branch, onRoleChange, onBranchChange }: TeamFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <CustomSelect
                    placeholder="Filter by Role"
                    options={roleOptions}
                    value={role || ''}
                    onChange={(v) => onRoleChange(v ? String(v) : null)}
                    icon={<Shield size={14} />}
                    clearable
                />
            </div>
            <div className="flex items-center gap-2">
                <CustomSelect
                    placeholder="Filter by Branch"
                    options={branchOptions}
                    value={branch || ''}
                    onChange={(v) => onBranchChange(v ? String(v) : null)}
                    icon={<Building2 size={14} />}
                    clearable
                />
            </div>

            <div className="h-4 w-px bg-surface-200 mx-2 hidden md:block" />

            <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-50 rounded-full border border-surface-200/50">
                <Users size={12} className="text-surface-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-surface-500">
                    Live Directory
                </span>
            </div>
        </div>
    );
}

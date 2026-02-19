'use client';

import { Check, X, Shield, Lock, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'broker', label: 'Broker', icon: Edit },
    { id: 'secretary', label: 'Secretary', icon: Eye },
    { id: 'data_entry', label: 'Support', icon: Lock },
];

const permissions = [
    { label: 'Register New Clients', admin: true, broker: true, secretary: true, data_entry: true },
    { label: 'Edit Policy Details', admin: true, broker: true, secretary: true, data_entry: false },
    { label: 'Approve Settlements', admin: true, broker: false, secretary: false, data_entry: false },
    { label: 'View Premium Reports', admin: true, broker: true, secretary: true, data_entry: false },
    { label: 'Delete Records', admin: true, broker: false, secretary: false, data_entry: false },
    { label: 'Manage Team Roles', admin: true, broker: false, secretary: false, data_entry: false },
];

export function PermissionsMatrix() {
    return (
        <div className="bg-white/40 backdrop-blur-xl rounded-[32px] border border-surface-200/50 overflow-hidden shadow-xl ring-1 ring-white/20">
            <div className="p-6 border-b border-surface-200/50 bg-surface-50/50 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black text-surface-900 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={16} className="text-primary-500" />
                        Role-Based Access Control (RBAC)
                    </h3>
                    <p className="text-[10px] text-surface-500 font-bold uppercase tracking-tight mt-1">
                        Global Matrix of Permissions & Authority Levels
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-50/30">
                            <th className="px-6 py-4 text-[10px] font-black text-surface-400 uppercase tracking-widest">Capabilities</th>
                            {roles.map((role) => (
                                <th key={role.id} className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <role.icon size={14} className="text-surface-400" />
                                        <span className="text-[10px] font-black text-surface-900 uppercase tracking-tighter">{role.label}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200/30">
                        {permissions.map((perm, idx) => (
                            <tr key={idx} className="hover:bg-primary-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="text-[11px] font-bold text-surface-700 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                        {perm.label}
                                    </span>
                                </td>
                                <PermissionCell active={perm.admin} />
                                <PermissionCell active={perm.broker} />
                                <PermissionCell active={perm.secretary} />
                                <PermissionCell active={perm.data_entry} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-blue-50/50 border-t border-blue-100 flex items-center gap-3">
                <Shield size={14} className="text-blue-500" />
                <p className="text-[9px] font-bold text-blue-700 uppercase tracking-widest">
                    Note: Super Admins bypass all matrix restrictions for emergency maintenance.
                </p>
            </div>
        </div>
    );
}

function PermissionCell({ active }: { active: boolean }) {
    return (
        <td className="px-6 py-4 text-center">
            <div className="flex justify-center">
                {active ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Check size={12} strokeWidth={4} />
                    </div>
                ) : (
                    <div className="w-5 h-5 rounded-full bg-surface-100 flex items-center justify-center text-surface-300">
                        <X size={12} strokeWidth={4} />
                    </div>
                )}
            </div>
        </td>
    );
}

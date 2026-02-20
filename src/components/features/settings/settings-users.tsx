'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Shield, Search, Building2, Briefcase,
    Mail, ArrowUpRight, Palette, Sun, Moon, Laptop
} from 'lucide-react';
import { users as initialUsers } from '@/mock/users';
import { User } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TeamFilters } from '@/components/features/team/team-filters';
import { DelegationModal } from '@/components/features/team/delegation-modal';
import { PermissionsMatrix } from '@/components/features/team/permissions-matrix';
import { AddStaffModal } from '@/components/features/team/add-staff-modal';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

const themes = [
    { value: 'gold', label: 'Gold / Industrial', colors: ['#c28532', '#1a1a2e', '#f4f1ec'] },
    { value: 'glass', label: 'Liquid Glass', colors: ['#3b82f6', '#f8fafc', '#e2e8f0'] },
    { value: 'compact', label: 'Compact Classic', colors: ['#6366f1', '#ffffff', '#f1f5f9'] },
] as const;

export function SettingsUsers() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [branchFilter, setBranchFilter] = useState<string | null>(null);
    const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

    const currentTheme = useUiStore((s) => s.currentTheme);
    const setTheme = useUiStore((s) => s.setTheme);

    const stats = [
        { label: 'Total Staff', value: users.length, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Active Brokers', value: users.filter(u => u.role.includes('broker')).length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Proxies', value: users.filter(u => u.delegatedTo).length, icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Branches', value: 2, icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = !roleFilter || u.role === roleFilter;
            const matchesBranch = !branchFilter || u.branchId === branchFilter;
            return matchesSearch && matchesRole && matchesBranch;
        });
    }, [users, searchQuery, roleFilter, branchFilter]);

    const handleUpdateDelegation = (staffId: string, backupId: string | null) => {
        setUsers(prev => prev.map(u => {
            if (u.id === staffId) return { ...u, delegatedTo: backupId || undefined };
            return u;
        }));
    };

    const handleAddStaff = (newStaff: User) => {
        setUsers(prev => [newStaff, ...prev]);
    };

    return (
        <div className="space-y-6">
            {/* KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                    >
                        <Card className="p-5 hover:-translate-y-0.5 transition-all overflow-hidden relative border-surface-100">
                            <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12">
                                <stat.icon size={40} />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                    <stat.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-surface-900 tracking-tighter">{String(stat.value).padStart(2, '0')}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Staff Directory */}
            <Card padding="lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                            <Users size={18} />
                        </div>
                        Staff Directory
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Find staff..."
                                className="pl-9 h-9 text-sm rounded-xl border-surface-200 bg-surface-50 w-52"
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setIsAddStaffModalOpen(true)}
                            className="shadow-lg shadow-primary-500/20 whitespace-nowrap"
                        >
                            Add Staff
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 p-3 bg-surface-50/80 rounded-xl border border-surface-100 relative z-30">
                    <TeamFilters
                        role={roleFilter}
                        branch={branchFilter}
                        onRoleChange={setRoleFilter}
                        onBranchChange={setBranchFilter}
                    />
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest whitespace-nowrap">
                        {filteredUsers.length} match{filteredUsers.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-surface-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50/80 border-b border-surface-100">
                                    <th className="px-5 py-3 text-[10px] font-black text-surface-400 uppercase tracking-widest">Team Member</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-surface-400 uppercase tracking-widest">Role</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-surface-400 uppercase tracking-widest">Branch</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-surface-400 uppercase tracking-widest">Delegation</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-surface-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                <AnimatePresence mode="popLayout">
                                    {filteredUsers.map((member) => (
                                        <motion.tr
                                            key={member.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            layout
                                            className="hover:bg-surface-50/60 transition-colors group"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 font-bold text-sm border-2 border-white shadow-sm ring-1 ring-surface-200 group-hover:scale-105 transition-transform">
                                                        {member.firstName[0]}{member.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-surface-900">{member.firstName} {member.lastName}</p>
                                                        <p className="text-xs text-surface-400 font-medium flex items-center gap-1">
                                                            <Mail size={10} className="text-primary-400" /> {member.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                    member.role === 'platform_super_admin' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                                        member.role === 'tenant_admin' ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                                                            member.role.includes('broker') ? "bg-primary-50 text-primary-700 border-primary-200" :
                                                                member.role === 'secretary' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                    "bg-surface-100 text-surface-600 border-surface-200"
                                                )}>
                                                    {member.role.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 size={12} className="text-surface-300" />
                                                    <span className="text-xs font-bold text-surface-600 uppercase tracking-tight">{member.branchId}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                {member.delegatedTo ? (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-200 w-fit">
                                                        <Shield size={11} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Proxy Active</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-surface-300">
                                                        <ArrowUpRight size={12} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Direct</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedStaff(member);
                                                        setIsDelegationModalOpen(true);
                                                    }}
                                                    className="rounded-full hover:bg-primary-50 text-primary-600 font-bold text-[9px] uppercase tracking-widest px-3"
                                                >
                                                    Delegate
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="py-12 text-center">
                                <Users size={32} className="mx-auto text-surface-300 mb-3" />
                                <p className="text-sm font-bold text-surface-400">No staff found</p>
                                <p className="text-xs text-surface-300 mt-1">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Permissions Matrix */}
            <PermissionsMatrix />

            {/* Appearance */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                        <Palette size={18} />
                    </div>
                    Appearance
                </h3>

                <div className="space-y-5">
                    <div>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-3">Color Theme</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {themes.map((theme) => (
                                <button
                                    key={theme.value}
                                    onClick={() => setTheme(theme.value as 'gold' | 'glass' | 'compact')}
                                    className={cn(
                                        "p-4 rounded-2xl border-2 text-left transition-all",
                                        currentTheme === theme.value
                                            ? "border-primary-500 bg-primary-50/50 shadow-md shadow-primary-500/10"
                                            : "border-surface-200 hover:border-surface-300"
                                    )}
                                >
                                    <div className="flex gap-1.5 mb-2">
                                        {theme.colors.map((color, i) => (
                                            <div key={i} className="w-5 h-5 rounded-md shadow-sm border border-black/5" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-surface-900">{theme.label}</p>
                                    {currentTheme === theme.value && (
                                        <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest">Active</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-3">Display Mode</p>
                        <div className="grid grid-cols-3 gap-3">
                            {[{ icon: Sun, label: 'Light' }, { icon: Moon, label: 'Dark' }, { icon: Laptop, label: 'System' }].map(({ icon: Icon, label }) => (
                                <button
                                    key={label}
                                    className={cn(
                                        "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                                        label === 'Light'
                                            ? "border-primary-500 bg-primary-50"
                                            : "border-surface-200 hover:border-surface-300"
                                    )}
                                >
                                    <Icon size={20} className={label === 'Light' ? "text-primary-600" : "text-surface-400"} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-surface-600">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Modals */}
            <DelegationModal
                isOpen={isDelegationModalOpen}
                onClose={() => setIsDelegationModalOpen(false)}
                staffMember={selectedStaff}
                allStaff={users}
                onSave={handleUpdateDelegation}
            />
            <AddStaffModal
                isOpen={isAddStaffModalOpen}
                onClose={() => setIsAddStaffModalOpen(false)}
                onAdd={handleAddStaff}
            />
        </div>
    );
}

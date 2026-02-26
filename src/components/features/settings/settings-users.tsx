'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { users as initialUsers } from '@/mock/users';
import { User } from '@/types';
import { TeamFilters } from '@/components/features/team/team-filters';
import { DelegationModal } from '@/components/features/team/delegation-modal';
import { PermissionsMatrix } from '@/components/features/team/permissions-matrix';
import { AddStaffModal } from '@/components/features/team/add-staff-modal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SettingsUsers() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [branchFilter, setBranchFilter] = useState<string | null>(null);
    const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

    const stats = [
        { label: 'Total Staff', value: users.length, icon: 'group', color: 'text-primary' },
        { label: 'Active Brokers', value: users.filter(u => u.role.includes('broker')).length, icon: 'badge', color: 'text-blue-600' },
        { label: 'Active Proxies', value: users.filter(u => u.delegatedTo).length, icon: 'shield_person', color: 'text-emerald-600' },
        { label: 'Branches', value: 2, icon: 'corporate_fare', color: 'text-amber-600' },
    ];

    const filteredUsers = users.filter(u => {
        const matchesSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !roleFilter || u.role === roleFilter;
        const matchesBranch = !branchFilter || u.branchId === branchFilter;
        return matchesSearch && matchesRole && matchesBranch;
    });

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
        <div className="flex flex-col gap-10">
            {/* KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-all"
                    >
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-slate-100/50 dark:text-slate-800/20 group-hover:scale-110 transition-transform group-hover:text-primary/5">{stat.icon}</span>
                        <div className={cn("size-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800", stat.color)}>
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mt-1">{String(stat.value).padStart(2, '0')}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Staff Directory */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-2xl">group</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Staff Directory</h3>
                            <p className="text-sm font-medium text-slate-500">Manage system users and access permissions.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">search</span>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Find staff member..."
                                className="h-12 w-64 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
                            />
                        </div>
                        <button
                            onClick={() => setIsAddStaffModalOpen(true)}
                            className="h-12 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-base">person_add</span>
                            Add Staff
                        </button>
                    </div>
                </div>

                <div className="px-10 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <TeamFilters
                        role={roleFilter}
                        branch={branchFilter}
                        onRoleChange={setRoleFilter}
                        onBranchChange={setBranchFilter}
                    />
                    <div className="px-4 py-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {filteredUsers.length} MEMBERS FOUND
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Level</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.map((member) => (
                                    <motion.tr
                                        key={member.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        layout
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-black text-xs border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                                                    {member.firstName[0]}{member.lastName[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">{member.firstName} {member.lastName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <Badge variant="surface" className={cn(
                                                "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                                member.role === 'platform_super_admin' ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/30" :
                                                    member.role === 'tenant_admin' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30" :
                                                        member.role.includes('broker') ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-800/30" :
                                                            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                            )}>
                                                {member.role.replace(/_/g, ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-300 text-lg">location_on</span>
                                                <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{member.branchId}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            {member.delegatedTo ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-amber-800/30 w-fit">
                                                    <span className="material-symbols-outlined text-base">shield_person</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Proxy Active</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-300 dark:text-slate-700 px-3 py-1.5">
                                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedStaff(member);
                                                    setIsDelegationModalOpen(true);
                                                }}
                                                className="h-10 px-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:border-slate-900 dark:hover:border-white transition-all"
                                            >
                                                Delegate
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700">
                                <span className="material-symbols-outlined text-5xl">group_off</span>
                            </div>
                            <div>
                                <p className="text-lg font-black text-slate-900 dark:text-white uppercase">No results found</p>
                                <p className="text-sm font-medium text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Permissions Matrix Placeholder or Content */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Permission Control Matrix</h3>
                <PermissionsMatrix />
            </div>


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

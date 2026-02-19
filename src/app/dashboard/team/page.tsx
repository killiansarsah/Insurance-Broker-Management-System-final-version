'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserIcon,
    Shield,
    Search,
    Building2,
    Activity,
    Mail,
    ArrowUpRight,
    Briefcase
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

export default function TeamDashboardPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [branchFilter, setBranchFilter] = useState<string | null>(null);
    const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

    // KPI Stats
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
        <div className="max-w-[1600px] mx-auto space-y-8 pb-24 p-4 lg:p-8 animate-fade-in relative">
            {/* Background Atmosphere */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/40 backdrop-blur-xl p-8 rounded-[32px] border border-surface-200/50 shadow-xl ring-1 ring-white/20">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary-900 flex items-center justify-center text-white shadow-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-surface-900 tracking-tighter uppercase leading-none">Fleet Operations</h1>
                            <p className="text-[10px] text-surface-500 font-bold uppercase tracking-[3px] mt-1.5 flex items-center gap-2">
                                <Activity size={12} className="text-primary-500" />
                                Team Resource Management & Delegation
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find staff members..."
                            className="pl-12 h-12 rounded-full border-surface-200 bg-white/60 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium"
                        />
                    </div>
                    <Button
                        onClick={() => setIsAddStaffModalOpen(true)}
                        className="h-12 px-8 rounded-full bg-surface-900 text-white font-bold text-[11px] uppercase tracking-widest shadow-xl hover:bg-primary-600 transition-all active:scale-95"
                    >
                        Add Staff
                    </Button>
                </div>
            </div>

            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-6 bg-white/60 backdrop-blur-md border-surface-200/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover:scale-[2] transition-transform">
                                <stat.icon size={48} />
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", stat.bg, stat.color)}>
                                    <stat.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                                    <p className="text-3xl font-black text-surface-900 tracking-tighter">{String(stat.value).padStart(2, '0')}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Filters Hub */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 py-4 bg-white/20 backdrop-blur-md rounded-[24px] border border-surface-200/30 relative z-30">
                    <TeamFilters
                        role={roleFilter}
                        branch={branchFilter}
                        onRoleChange={setRoleFilter}
                        onBranchChange={setBranchFilter}
                    />
                    <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                        Total {filteredUsers.length} matches found
                    </div>
                </div>

                {/* Staff Directory Table */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-surface-200/50 overflow-hidden shadow-xl ring-1 ring-white/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50/50 border-b border-surface-200/30">
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-400 uppercase tracking-widest">Team Member</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-400 uppercase tracking-widest">Role & Authority</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-400 uppercase tracking-widest">Branch Location</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-400 uppercase tracking-widest">Delegation Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-400 uppercase tracking-widest text-right">Utility</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-200/30">
                                <AnimatePresence mode="popLayout">
                                    {filteredUsers.map((member) => (
                                        <motion.tr
                                            key={member.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            layout
                                            className="hover:bg-primary-500/[0.02] transition-colors group cursor-default"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center text-surface-500 font-bold border-2 border-white shadow-md ring-1 ring-surface-200 group-hover:scale-105 transition-transform">
                                                        {member.firstName[0]}{member.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-black text-surface-900 uppercase tracking-tight">{member.firstName} {member.lastName}</div>
                                                        <div className="text-[10px] font-medium text-surface-400 flex items-center gap-1.5 mt-0.5">
                                                            <Mail size={10} className="text-primary-400" /> {member.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit shadow-sm",
                                                        member.role.includes('admin') ? "bg-primary-50 text-primary-600 border-primary-200/50" :
                                                            member.role === 'secretary' ? "bg-emerald-50 text-emerald-600 border-emerald-200/50" :
                                                                "bg-surface-50 text-surface-500 border-surface-200/50"
                                                    )}>
                                                        {member.role.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={14} className="text-surface-300" />
                                                    <span className="text-[11px] font-bold text-surface-600 uppercase tracking-tight">
                                                        {member.branchId}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {member.delegatedTo ? (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-200/50 w-fit">
                                                        <Shield size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                            Proxy Active
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-surface-300">
                                                        <ArrowUpRight size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                                            Direct Assignment
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedStaff(member);
                                                        setIsDelegationModalOpen(true);
                                                    }}
                                                    className="rounded-full hover:bg-primary-50 text-primary-600 font-bold text-[9px] uppercase tracking-widest px-4"
                                                >
                                                    Delegate Tasks
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Permissions Matrix Section */}
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

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Users, ShieldCheck, Crown, UserCog, Briefcase, UserCheck,
    FileText, FilePen, Trash2, DollarSign, Settings, Download,
    Search, UserPlus, PlusCircle, RotateCcw, Save,
    Pencil, Ban, CheckCircle, Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    active: string;
    img?: string;
    initial?: string;
}

interface Permission {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

interface Role {
    id: string;
    name: string;
    userCount: number;
    permissions: string[];
    color: string;
    icon: React.ElementType;
}

type ModalType = 'edit' | 'terminate' | null;

export function SettingsAccessControl() {
    const [subTab, setSubTab] = useState<'users' | 'roles'>('users');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const roleOptions = ['Workspace owner', 'Administrator', 'Manager', 'Supervisor', 'Agent'];

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setEditName(user.name);
        setEditRole(user.role);
        setModalType('edit');
    };

    const openTerminateModal = (user: User) => {
        setSelectedUser(user);
        setModalType('terminate');
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
    };

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
    };

    useEffect(() => {
        if (!showToast) return;
        const t = setTimeout(() => setShowToast(false), 3000);
        return () => clearTimeout(t);
    }, [showToast]);

    const confirmEdit = () => {
        if (!selectedUser) return;
        setIsSaving(true);
        setTimeout(() => {
            setUsers(prev => prev.map(u =>
                u.id === selectedUser.id ? { ...u, name: editName, role: editRole } : u
            ));
            setIsSaving(false);
            closeModal();
            triggerToast(`${editName} updated successfully`);
        }, 600);
    };

    const confirmTerminate = () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const isSuspended = selectedUser.status === 'Suspended';
        setTimeout(() => {
            setUsers(prev => prev.map(u =>
                u.id === selectedUser.id ? { ...u, status: isSuspended ? 'Active' : 'Suspended' } : u
            ));
            setIsSaving(false);
            closeModal();
            triggerToast(isSuspended ? `${selectedUser.name} has been restored` : `${selectedUser.name} has been suspended`);
        }, 600);
    };

    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'Amara Ndiaye', email: 'amara.ndiaye@ibms.africa', role: 'Workspace owner', status: 'Active', active: 'Feb 24, 2026', img: '12' },
        { id: '2', name: 'David Osei', email: 'david.osei@ibms.africa', role: 'Administrator', status: 'Active', active: 'Feb 24, 2026', img: '15' },
        { id: '3', name: 'Sarah Smith', email: 'sarah.smith@ibms.africa', role: 'Manager', status: 'Inactive', active: 'Feb 20, 2026', initial: 'SS' },
        { id: '4', name: 'Kwame Mensah', email: 'kwame.m@ibms.africa', role: 'Supervisor', status: 'Active', active: 'Feb 23, 2026', img: '18' },
        { id: '5', name: 'Zainab Oladipo', email: 'zainab.o@ibms.africa', role: 'Agent', status: 'Suspended', active: 'Jan 12, 2026', initial: 'ZO' },
    ]);

    const [permissions] = useState<Permission[]>([
        { id: 'view_policies', name: 'View Policies', category: 'Policies', description: 'Can view motor and non-motor policy lists', icon: FileText, color: 'blue' },
        { id: 'edit_policies', name: 'Edit Policies', category: 'Policies', description: 'Can update policy details and coverage', icon: FilePen, color: 'blue' },
        { id: 'delete_policies', name: 'Delete Policies', category: 'Policies', description: 'Can remove policy records from system', icon: Trash2, color: 'red' },
        { id: 'view_financials', name: 'View Financials', category: 'Finance', description: 'Can view commissions and accounting ledgers', icon: DollarSign, color: 'emerald' },
        { id: 'manage_users', name: 'Manage Users', category: 'System', description: 'Can add, edit, and suspend team members', icon: Settings, color: 'violet' },
        { id: 'export_data', name: 'Export Data', category: 'Reports', description: 'Can download bulk data in Excel/CSV', icon: Download, color: 'amber' },
    ]);

    const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
        '1': ['view_policies', 'edit_policies', 'delete_policies', 'view_financials', 'manage_users', 'export_data'],
        '2': ['view_policies', 'edit_policies', 'view_financials', 'manage_users', 'export_data'],
        '3': ['view_policies', 'edit_policies', 'view_financials', 'export_data'],
        '4': ['view_policies', 'edit_policies'],
    };

    const [roles, setRoles] = useState<Role[]>([
        { id: '1', name: 'Workspace Owner', userCount: 1, permissions: DEFAULT_ROLE_PERMISSIONS['1'], color: 'violet', icon: Crown },
        { id: '2', name: 'Administrator', userCount: 2, permissions: DEFAULT_ROLE_PERMISSIONS['2'], color: 'blue', icon: ShieldCheck },
        { id: '3', name: 'Manager', userCount: 5, permissions: DEFAULT_ROLE_PERMISSIONS['3'], color: 'emerald', icon: Briefcase },
        { id: '4', name: 'Agent', userCount: 12, permissions: DEFAULT_ROLE_PERMISSIONS['4'], color: 'amber', icon: UserCheck },
    ]);

    const [selectedRoleId, setSelectedRoleId] = useState<string>('1');
    const selectedRole = roles.find(r => r.id === selectedRoleId);

    const togglePermission = (permissionId: string) => {
        setRoles(prev => prev.map(role => {
            if (role.id !== selectedRoleId) return role;
            const has = role.permissions.includes(permissionId);
            return {
                ...role,
                permissions: has
                    ? role.permissions.filter(p => p !== permissionId)
                    : [...role.permissions, permissionId],
            };
        }));
    };

    const resetSelectedRole = () => {
        setRoles(prev => prev.map(role =>
            role.id === selectedRoleId
                ? { ...role, permissions: DEFAULT_ROLE_PERMISSIONS[role.id] ?? [] }
                : role
        ));
        toast.success('Permissions Reset', { description: `${selectedRole?.name} permissions restored to defaults.` });
    };

    const roleColorMap: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
        violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400', ring: 'ring-violet-200 dark:ring-violet-800', dot: 'bg-violet-500' },
        blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',    text: 'text-blue-700 dark:text-blue-400',    ring: 'ring-blue-200 dark:ring-blue-800',   dot: 'bg-blue-500' },
        emerald:{ bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-800', dot: 'bg-emerald-500' },
        amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',  text: 'text-amber-700 dark:text-amber-400',  ring: 'ring-amber-200 dark:ring-amber-800', dot: 'bg-amber-500' },
    };

    const permColorMap: Record<string, { bg: string; text: string; trackOn: string }> = {
        blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',       text: 'text-blue-600 dark:text-blue-400',       trackOn: 'bg-blue-500' },
        red:     { bg: 'bg-red-50 dark:bg-red-900/20',         text: 'text-red-600 dark:text-red-400',         trackOn: 'bg-red-500' },
        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', trackOn: 'bg-emerald-500' },
        violet:  { bg: 'bg-violet-50 dark:bg-violet-900/20',   text: 'text-violet-600 dark:text-violet-400',   trackOn: 'bg-violet-500' },
        amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',     text: 'text-amber-600 dark:text-amber-400',     trackOn: 'bg-amber-500' },
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const userRoleColor: Record<string, string> = {
        'Workspace owner': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
        'Administrator':   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'Manager':         'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        'Supervisor':      'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
        'Agent':           'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    };

    return (
        <div className="flex flex-col gap-8">

            {/* Tab Bar */}
            <div className="flex items-center gap-1 border-b border-surface-200 dark:border-slate-700">
                {([
                    { key: 'users', label: 'Team Members', icon: Users },
                    { key: 'roles', label: 'Roles & Permissions', icon: Lock },
                ] as const).map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setSubTab(key)}
                        className={cn(
                            'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px',
                            subTab === key
                                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-surface-500 hover:text-surface-800 dark:hover:text-slate-200'
                        )}
                    >
                        <Icon size={15} />
                        {label}
                    </button>
                ))}
            </div>

            {/* USERS TAB */}
            {subTab === 'users' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search members..."
                                className="w-full h-10 pl-10 pr-4 rounded-xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-surface-800 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                            />
                        </div>
                        <button
                            onClick={() => toast.info('Invite User', { description: 'User invitation will be available in a future update.' })}
                            className="h-10 px-5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold flex items-center gap-2 transition active:scale-95 shadow-sm"
                        >
                            <UserPlus size={15} />
                            Invite Member
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {filteredUsers.map(u => (
                            <div
                                key={u.id}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-surface-100 dark:border-slate-800 hover:border-surface-200 dark:hover:border-slate-700 hover:shadow-sm transition-all"
                            >
                                {u.img ? (
                                    <Image src={`https://picsum.photos/seed/${u.img}/80/80`} alt={u.name} width={44} height={44} className="size-11 rounded-xl object-cover shrink-0" />
                                ) : (
                                    <div className="size-11 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold shrink-0">
                                        {u.initial}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{u.name}</p>
                                    <p className="text-xs text-surface-400 truncate">{u.email}</p>
                                </div>
                                <span className={cn('hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', userRoleColor[u.role] ?? 'bg-surface-100 text-surface-600')}>
                                    {u.role}
                                </span>
                                <div className="hidden md:flex items-center gap-1.5">
                                    <span className={cn('size-2 rounded-full', u.status === 'Active' ? 'bg-emerald-500 animate-pulse' : u.status === 'Suspended' ? 'bg-rose-500' : 'bg-surface-300')} />
                                    <span className={cn('text-xs font-medium', u.status === 'Active' ? 'text-emerald-600' : u.status === 'Suspended' ? 'text-rose-600' : 'text-surface-400')}>{u.status}</span>
                                </div>
                                <span className="hidden lg:block text-xs text-surface-400 font-mono w-28 text-right">{u.active}</span>
                                <div className="flex items-center gap-1.5 ml-2">
                                    <button onClick={() => openEditModal(u)} aria-label="Edit user" className="p-2 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => openTerminateModal(u)} aria-label={u.status === 'Suspended' ? 'Restore user' : 'Suspend user'} className={cn('p-2 rounded-lg transition', u.status === 'Suspended' ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-surface-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20')}>
                                        {u.status === 'Suspended' ? <CheckCircle size={15} /> : <Ban size={15} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="py-16 text-center text-surface-400">
                                <Users size={32} className="mx-auto mb-3 opacity-40" />
                                <p className="text-sm">No members match your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ROLES TAB */}
            {subTab === 'roles' && (
                <div className="flex flex-col gap-6 animate-fade-in">

                    {/* Role selector pills */}
                    <div className="flex flex-wrap gap-2">
                        {roles.map(role => {
                            const c = roleColorMap[role.color] ?? roleColorMap.blue;
                            const RoleIcon = role.icon;
                            const isSelected = selectedRoleId === role.id;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={cn(
                                        'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                                        isSelected
                                            ? cn('border-transparent ring-1', c.bg, c.text, c.ring)
                                            : 'bg-white dark:bg-slate-900 border-surface-200 dark:border-slate-700 text-surface-600 dark:text-slate-400 hover:border-surface-300'
                                    )}
                                >
                                    <RoleIcon size={15} className={isSelected ? c.text : 'text-surface-400'} />
                                    {role.name}
                                    <span className={cn('text-xs px-1.5 py-0.5 rounded-md font-medium', isSelected ? cn(c.bg, c.text) : 'bg-surface-100 dark:bg-slate-800 text-surface-400')}>
                                        {role.userCount}
                                    </span>
                                </button>
                            );
                        })}
                        <button
                            onClick={() => toast.info('New Role', { description: 'Custom role creation coming soon.' })}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-surface-300 dark:border-slate-700 text-sm text-surface-400 hover:text-primary-600 hover:border-primary-400 transition"
                        >
                            <PlusCircle size={15} />
                            New Role
                        </button>
                    </div>

                    {/* Permissions panel */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-slate-800 bg-surface-50/60 dark:bg-slate-800/30">
                            <div className="flex items-center gap-3">
                                {selectedRole && (() => {
                                    const RoleIcon = selectedRole.icon;
                                    const c = roleColorMap[selectedRole.color] ?? roleColorMap.blue;
                                    return (
                                        <div className={cn('p-2 rounded-lg', c.bg)}>
                                            <RoleIcon size={16} className={c.text} />
                                        </div>
                                    );
                                })()}
                                <div>
                                    <h4 className="text-sm font-semibold text-surface-900 dark:text-white">{selectedRole?.name}</h4>
                                    <p className="text-xs text-surface-400">{selectedRole?.permissions.length} of {permissions.length} permissions enabled</p>
                                </div>
                            </div>
                            <button onClick={resetSelectedRole} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-slate-700 text-xs font-medium text-surface-500 hover:text-surface-800 hover:bg-surface-50 dark:hover:bg-slate-800 transition">
                                <RotateCcw size={12} />
                                Reset
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            {permissions.map((perm, i) => {
                                const isEnabled = selectedRole?.permissions.includes(perm.id) ?? false;
                                const pc = permColorMap[perm.color] ?? permColorMap.blue;
                                const PermIcon = perm.icon;
                                return (
                                    <div
                                        key={perm.id}
                                        className={cn(
                                            'flex items-start gap-4 p-5 border-surface-100 dark:border-slate-800 transition-colors',
                                            i >= 2 ? 'border-t' : '',
                                            i % 2 === 1 ? 'sm:border-l' : '',
                                            isEnabled ? 'bg-white dark:bg-slate-900' : 'bg-surface-50/60 dark:bg-slate-800/20'
                                        )}
                                    >
                                        <div className={cn('p-2.5 rounded-xl shrink-0 mt-0.5', pc.bg)}>
                                            <PermIcon size={16} className={pc.text} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-surface-900 dark:text-white leading-tight">{perm.name}</p>
                                                    <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{perm.description}</p>
                                                    <span className={cn('inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-md', pc.bg, pc.text)}>
                                                        {perm.category}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => togglePermission(perm.id)}
                                                    role="switch"
                                                    aria-checked={isEnabled}
                                                    aria-label={`Toggle ${perm.name}`}
                                                    className={cn(
                                                        'relative inline-flex items-center h-6 w-11 shrink-0 mt-0.5 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                                                        isEnabled ? pc.trackOn : 'bg-surface-200 dark:bg-slate-700'
                                                    )}
                                                >
                                                    <span className={cn('inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200', isEnabled ? 'translate-x-5' : 'translate-x-0.5')} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-100 dark:border-slate-800 bg-surface-50/60 dark:bg-slate-800/30">
                            <p className="text-xs text-surface-400">Changes apply immediately to all users with this role.</p>
                            <button
                                onClick={() => toast.success('Role Saved', { description: `Permissions for ${selectedRole?.name} have been committed.` })}
                                className="flex items-center gap-2 h-9 px-5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition active:scale-95 shadow-sm"
                            >
                                <Save size={14} />
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Role summary cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {roles.map(role => {
                            const c = roleColorMap[role.color] ?? roleColorMap.blue;
                            const RoleIcon = role.icon;
                            const pct = Math.round((role.permissions.length / permissions.length) * 100);
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={cn('text-left p-4 rounded-xl border transition-all hover:shadow-sm', selectedRoleId === role.id ? cn('border-transparent ring-1', c.bg, c.ring) : 'bg-white dark:bg-slate-900 border-surface-200 dark:border-slate-800')}
                                >
                                    <div className={cn('inline-flex p-2 rounded-lg mb-3', c.bg)}>
                                        <RoleIcon size={15} className={c.text} />
                                    </div>
                                    <p className="text-sm font-semibold text-surface-900 dark:text-white leading-tight">{role.name}</p>
                                    <p className="text-xs text-surface-400 mt-0.5">{role.userCount} user{role.userCount !== 1 ? 's' : ''}</p>
                                    <div className="mt-3 h-1.5 rounded-full bg-surface-100 dark:bg-slate-800 overflow-hidden">
                                        <div className={cn('h-full rounded-full transition-all', c.dot)} style={{ width: `${pct}%` }} />
                                    </div>
                                    <p className="text-[10px] text-surface-400 mt-1">{role.permissions.length}/{permissions.length} permissions</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {modalType === 'edit' && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-5 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                                <UserCog size={18} className="text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Edit Member</h3>
                                <p className="text-xs text-surface-400">{selectedUser.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-surface-600 dark:text-slate-400">Full Name</label>
                                <input value={editName} onChange={e => setEditName(e.target.value)} className="h-11 rounded-xl border border-surface-200 dark:border-slate-700 bg-surface-50 dark:bg-slate-800 px-4 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-surface-600 dark:text-slate-400">Role</label>
                                <select value={editRole} onChange={e => setEditRole(e.target.value)} className="h-11 rounded-xl border border-surface-200 dark:border-slate-700 bg-surface-50 dark:bg-slate-800 px-4 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition appearance-none cursor-pointer">
                                    {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-1">
                            <button onClick={closeModal} className="flex-1 h-10 rounded-xl border border-surface-200 dark:border-slate-700 text-sm font-medium text-surface-600 hover:bg-surface-50 dark:hover:bg-slate-800 transition">Cancel</button>
                            <button onClick={confirmEdit} disabled={isSaving || !editName.trim()} className="flex-1 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition active:scale-95 shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
                                {isSaving ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Suspend / Restore Modal */}
            {modalType === 'terminate' && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col items-center gap-4 text-center animate-fade-in">
                        <div className={cn('p-4 rounded-2xl', selectedUser.status === 'Suspended' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20')}>
                            {selectedUser.status === 'Suspended' ? <CheckCircle size={24} className="text-emerald-600" /> : <Ban size={24} className="text-rose-600" />}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{selectedUser.status === 'Suspended' ? 'Restore Access?' : 'Suspend User?'}</h3>
                            <p className="text-xs text-surface-500 mt-1.5 leading-relaxed">
                                {selectedUser.status === 'Suspended' ? `${selectedUser.name}'s access will be restored.` : `${selectedUser.name}'s access will be revoked. This can be undone.`}
                            </p>
                        </div>
                        <div className="flex gap-3 w-full">
                            <button onClick={closeModal} className="flex-1 h-10 rounded-xl border border-surface-200 dark:border-slate-700 text-sm font-medium text-surface-600 hover:bg-surface-50 dark:hover:bg-slate-800 transition">Cancel</button>
                            <button onClick={confirmTerminate} disabled={isSaving} className={cn('flex-1 h-10 rounded-xl text-white text-sm font-semibold transition active:scale-95 shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2', selectedUser.status === 'Suspended' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700')}>
                                {isSaving ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                                {selectedUser.status === 'Suspended' ? 'Restore' : 'Suspend'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl bg-surface-900 dark:bg-white text-white dark:text-surface-900 shadow-2xl animate-fade-in">
                    <CheckCircle size={16} className="text-emerald-400 dark:text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import {
    Users, ShieldCheck, Crown, UserCog, Briefcase, UserCheck,
    FileText, FilePen, Trash2, DollarSign, Settings, Download,
    Search, UserPlus, PlusCircle, RotateCcw, Save,
    Pencil, Ban, CheckCircle, Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUsers, useUpdateUser, useDeactivateUser, useReactivateUser } from '@/hooks/api/use-users';
import { useCreateInvitation } from '@/hooks/api/use-invitations';

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

type ModalType = 'edit' | 'terminate' | 'invite' | 'new-role' | null;

// Map backend roles to display-friendly labels (5-tier + legacy backward compat)
const ROLE_DISPLAY: Record<string, string> = {
    WORKSPACE_OWNER: 'Workspace Owner',
    ADMINISTRATOR: 'Administrator',
    MANAGER: 'Manager',
    SUPERVISOR: 'Supervisor',
    AGENT: 'Agent',
    // Legacy backward compat
    PLATFORM_SUPER_ADMIN: 'Workspace Owner',
    SUPER_ADMIN: 'Administrator',
    TENANT_ADMIN: 'Administrator',
    ADMIN: 'Administrator',
    BRANCH_MANAGER: 'Manager',
    COMPLIANCE_OFFICER: 'Supervisor',
    FINANCE_MANAGER: 'Manager',
    SENIOR_BROKER: 'Manager',
    BROKER: 'Agent',
    UNDERWRITER: 'Agent',
    SECRETARY: 'Agent',
    DATA_ENTRY: 'Agent',
    VIEWER: 'Agent',
};

// Map display roles to backend roles for invitations/updates
const ROLE_TO_BACKEND: Record<string, string> = {
    'Workspace Owner': 'WORKSPACE_OWNER',
    'Administrator': 'ADMINISTRATOR',
    'Manager': 'MANAGER',
    'Supervisor': 'SUPERVISOR',
    'Agent': 'AGENT',
};

interface DisplayUser {
    id: string;
    name: string;
    email: string;
    role: string;
    backendRole: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    active: string;
    img?: string;
    initial?: string;
}

export function SettingsAccessControl() {
    const [subTab, setSubTab] = useState<'users' | 'roles'>('users');
    const [selectedUser, setSelectedUser] = useState<DisplayUser | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Agent');
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleColor, setNewRoleColor] = useState<'violet' | 'blue' | 'emerald' | 'amber'>('blue');
    const [newRoleIconKey, setNewRoleIconKey] = useState<string>('UserCheck');



    // API hooks
    const { data: usersData } = useUsers();
    const updateUserMutation = useUpdateUser();
    const deactivateUserMutation = useDeactivateUser();
    const reactivateUserMutation = useReactivateUser();
    const createInvitationMutation = useCreateInvitation();

    // Transform API users to display format
    const apiUsers: any[] = (usersData as any)?.items ?? (usersData as any)?.data ?? (Array.isArray(usersData) ? usersData : []);
    const users: DisplayUser[] = (apiUsers as any[]).map((u: any) => ({
        id: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        email: u.email,
        role: ROLE_DISPLAY[u.role] || 'Agent',
        backendRole: u.role,
        status: u.isActive === false ? 'Suspended' : 'Active',
        active: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never',
        initial: `${(u.firstName || '?')[0]}${(u.lastName || '?')[0]}`.toUpperCase(),
    }));

    const openEditModal = (user: DisplayUser) => {
        setSelectedUser(user);
        setEditName(user.name);
        setEditRole(user.role);
        setModalType('edit');
    };

    const openTerminateModal = (user: DisplayUser) => {
        setSelectedUser(user);
        setModalType('terminate');
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
    };

    const confirmEdit = () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const [firstName, ...rest] = editName.split(' ');
        const lastName = rest.join(' ');
        const backendRole = ROLE_TO_BACKEND[editRole] || selectedUser.backendRole;
        updateUserMutation.mutate(
            { id: selectedUser.id, data: { firstName, lastName, role: backendRole } },
            {
                onSuccess: () => {
                    setIsSaving(false);
                    closeModal();
                    toast.success('Member Updated', { description: `${editName} updated successfully.` });
                },
                onError: () => {
                    setIsSaving(false);
                    toast.error('Update Failed', { description: 'Could not update member. Please try again.' });
                },
            }
        );
    };

    const confirmTerminate = () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const isSuspended = selectedUser.status === 'Suspended';
        const mutation = isSuspended ? reactivateUserMutation : deactivateUserMutation;
        mutation.mutate(selectedUser.id, {
            onSuccess: () => {
                setIsSaving(false);
                closeModal();
                toast.success(
                    isSuspended ? 'Access Restored' : 'User Suspended',
                    { description: isSuspended ? `${selectedUser.name} has been restored.` : `${selectedUser.name} has been suspended.` }
                );
            },
            onError: () => {
                setIsSaving(false);
                toast.error('Action Failed', { description: 'Could not update user status. Please try again.' });
            },
        });
    };

    const roleIconOptions: Array<{ key: string; icon: React.ElementType; label: string }> = [
        { key: 'Crown', icon: Crown, label: 'Crown' },
        { key: 'ShieldCheck', icon: ShieldCheck, label: 'Shield' },
        { key: 'Briefcase', icon: Briefcase, label: 'Briefcase' },
        { key: 'UserCheck', icon: UserCheck, label: 'Agent' },
        { key: 'Users', icon: Users, label: 'Team' },
        { key: 'UserCog', icon: UserCog, label: 'Config' },
    ];

    const openInviteModal = () => {
        setInviteName('');
        setInviteEmail('');
        setInviteRole('Agent');
        setModalType('invite');
    };

    const openNewRoleModal = () => {
        setNewRoleName('');
        setNewRoleColor('blue');
        setNewRoleIconKey('UserCheck');
        setModalType('new-role');
    };

    const confirmInvite = () => {
        if (!inviteEmail.trim()) return;
        setIsSaving(true);
        const backendRole = (ROLE_TO_BACKEND[inviteRole] || 'BROKER') as 'BROKER';
        createInvitationMutation.mutate(
            { email: inviteEmail.trim(), role: backendRole },
            {
                onSuccess: () => {
                    setIsSaving(false);
                    closeModal();
                    toast.success('Invitation Sent', { description: `Invite sent to ${inviteEmail.trim()}.` });
                },
                onError: (error: any) => {
                    setIsSaving(false);
                    const msg = error?.response?.data?.message || 'Could not send invitation. Please try again.';
                    console.error("Invite error:", error?.response?.data || error);
                    toast.error('Invite Failed', { description: Array.isArray(msg) ? msg[0] : msg });
                },
            }
        );
    };

    const confirmNewRole = () => {
        if (!newRoleName.trim()) return;
        setIsSaving(true);
        const icon = roleIconOptions.find(o => o.key === newRoleIconKey)?.icon ?? UserCheck;
        // Roles are managed locally until a roles API is available
        const newRole: Role = {
            id: String(Date.now()),
            name: newRoleName.trim(),
            userCount: 0,
            permissions: [],
            color: newRoleColor,
            icon,
        };
        setRoles(prev => [...prev, newRole]);
        setSelectedRoleId(newRole.id);
        setIsSaving(false);
        closeModal();
        toast.success('Role Created', { description: `Role "${newRoleName.trim()}" created.` });
    };

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
        { id: '2', name: 'Administrator', userCount: 2, permissions: DEFAULT_ROLE_PERMISSIONS['1'], color: 'blue', icon: ShieldCheck },
        { id: '3', name: 'Manager', userCount: 5, permissions: DEFAULT_ROLE_PERMISSIONS['2'], color: 'emerald', icon: Briefcase },
        { id: '4', name: 'Supervisor', userCount: 4, permissions: DEFAULT_ROLE_PERMISSIONS['3'], color: 'amber', icon: UserCheck },
        { id: '5', name: 'Agent', userCount: 15, permissions: DEFAULT_ROLE_PERMISSIONS['4'], color: 'blue', icon: Users },
    ]);

    // Dynamically derive role options from the local state so new roles appear
    const roleOptions = roles.map(r => r.name);

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
        'Workspace Owner':  'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
        'Administrator':    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'Manager':          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        'Supervisor':       'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        'Agent':            'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
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
                            onClick={openInviteModal}
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
                                <div className="size-11 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold shrink-0">
                                    {u.initial}
                                </div>
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
                <div className="flex flex-col gap-6 animate-fade-in relative">
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-4 min-h-[400px]">
                        <div className="flex items-center gap-3 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full">
                            <span className="lucide lucide-construction text-amber-500 animate-pulse"></span>
                            <span className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Coming Soon in v2.4</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 max-w-md text-center px-8">
                            Role and permission management requires a dedicated API. The Users tab above is fully functional.
                        </p>
                    </div>

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
                            onClick={openNewRoleModal}
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

            {/* Invite Member Modal */}
            {modalType === 'invite' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-5 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                                <UserPlus size={18} className="text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Invite Team Member</h3>
                                <p className="text-xs text-surface-400">They will be added to your workspace</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-surface-600 dark:text-slate-400">Full Name</label>
                                <input
                                    value={inviteName}
                                    onChange={e => setInviteName(e.target.value)}
                                    placeholder="e.g. Kofi Mensah"
                                    className="h-11 rounded-xl border border-surface-200 dark:border-slate-700 bg-surface-50 dark:bg-slate-800 px-4 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-surface-600 dark:text-slate-400">Email Address</label>
                                <input
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="e.g. kofi@ibms.africa"
                                    type="email"
                                    className="h-11 rounded-xl border border-surface-200 dark:border-slate-700 bg-surface-50 dark:bg-slate-800 px-4 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-surface-600 dark:text-slate-400">Role</label>
                                <select
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value)}
                                    className="h-11 rounded-xl border border-surface-200 dark:border-slate-700 bg-surface-50 dark:bg-slate-800 px-4 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition appearance-none cursor-pointer"
                                >
                                    {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-1">
                            <button onClick={closeModal} className="flex-1 h-10 rounded-xl border border-surface-200 dark:border-slate-700 text-sm font-medium text-surface-600 hover:bg-surface-50 dark:hover:bg-slate-800 transition">Cancel</button>
                            <button
                                onClick={confirmInvite}
                                disabled={isSaving || !inviteName.trim() || !inviteEmail.trim()}
                                className="flex-1 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition active:scale-95 shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                {isSaving ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Role Modal */}
            {modalType === 'new-role' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-5 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                                <PlusCircle size={18} className="text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Create New Role</h3>
                                <p className="text-xs text-surface-400">Assign permissions after creating the role</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-surface-600 dark:text-slate-400">Role Name</label>
                                <input
                                    value={newRoleName}
                                    onChange={e => setNewRoleName(e.target.value)}
                                    placeholder="e.g. Compliance Officer"
                                    className="h-11 rounded-xl border border-surface-200 dark:border-slate-700 bg-surface-50 dark:bg-slate-800 px-4 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-surface-600 dark:text-slate-400">Color Theme</label>
                                <div className="flex gap-2">
                                    {(['violet', 'blue', 'emerald', 'amber'] as const).map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setNewRoleColor(c)}
                                            className={cn(
                                                'h-8 w-8 rounded-lg transition ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900',
                                                c === 'violet' ? 'bg-violet-500' : c === 'blue' ? 'bg-blue-500' : c === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500',
                                                newRoleColor === c
                                                    ? (c === 'violet' ? 'ring-violet-500' : c === 'blue' ? 'ring-blue-500' : c === 'emerald' ? 'ring-emerald-500' : 'ring-amber-500')
                                                    : 'ring-transparent'
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-surface-600 dark:text-slate-400">Icon</label>
                                <div className="flex gap-2 flex-wrap">
                                    {roleIconOptions.map(({ key, icon: Icon, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => setNewRoleIconKey(key)}
                                            aria-label={label}
                                            className={cn(
                                                'p-2.5 rounded-xl border text-sm transition',
                                                newRoleIconKey === key
                                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                                    : 'border-surface-200 dark:border-slate-700 text-surface-500 hover:border-surface-300 bg-white dark:bg-slate-800'
                                            )}
                                        >
                                            <Icon size={16} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-1">
                            <button onClick={closeModal} className="flex-1 h-10 rounded-xl border border-surface-200 dark:border-slate-700 text-sm font-medium text-surface-600 hover:bg-surface-50 dark:hover:bg-slate-800 transition">Cancel</button>
                            <button
                                onClick={confirmNewRole}
                                disabled={isSaving || !newRoleName.trim()}
                                className="flex-1 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition active:scale-95 shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                {isSaving ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                                Create Role
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
        </div>
    );
}

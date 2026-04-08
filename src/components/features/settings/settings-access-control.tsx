'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { UserPermissionsModal } from '@/components/admin/user-permissions-modal';
import { ChangeRoleModal } from '@/components/admin/change-role-modal';

interface Permission { id: string; name: string; category: string; description: string; icon: React.ElementType; color: string; }
interface Role { id: string; name: string; userCount: number; permissions: string[]; color: string; icon: React.ElementType; }
type ModalType = 'edit' | 'terminate' | 'invite' | 'new-role' | 'permissions' | 'role' | null;

const ROLE_DISPLAY: Record<string, string> = {
    WORKSPACE_OWNER: 'Workspace Owner', ADMINISTRATOR: 'Administrator', MANAGER: 'Manager',
    SUPERVISOR: 'Supervisor', AGENT: 'Agent', PLATFORM_SUPER_ADMIN: 'Platform Admin',
};

const ROLE_TO_BACKEND: Record<string, string> = {
    'Workspace Owner': 'WORKSPACE_OWNER', 'Administrator': 'ADMINISTRATOR', 'Manager': 'MANAGER',
    'Supervisor': 'SUPERVISOR', 'Agent': 'AGENT',
};

interface DisplayUser {
    id: string; name: string; email: string; role: string; backendRole: string;
    status: 'Active' | 'Inactive' | 'Suspended'; active: string; img?: string; initial?: string;
}

export function SettingsAccessControl() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    
    const [subTab, setSubTab] = useState<'users' | 'roles'>('users');
    const [selectedUser, setSelectedUser] = useState<DisplayUser | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [editName, setEditName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Agent');

    // API hooks
    const { data: usersData } = useUsers();
    const updateUserMutation = useUpdateUser();
    const deactivateUserMutation = useDeactivateUser();
    const reactivateUserMutation = useReactivateUser();
    const createInvitationMutation = useCreateInvitation();

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
        permissions: u.permissions || [],
    }));

    // Action Handlers
    const openEditModal = (u: DisplayUser) => { setSelectedUser(u); setEditName(u.name); setModalType('edit'); };
    const openTerminateModal = (u: DisplayUser) => { setSelectedUser(u); setModalType('terminate'); };
    const openPermissionsModal = (u: DisplayUser) => { setSelectedUser(u); setModalType('permissions'); };
    const openRoleModal = (u: DisplayUser) => { setSelectedUser(u); setModalType('role'); };
    const closeModal = () => { setModalType(null); setSelectedUser(null); };

    const confirmEdit = () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const [firstName, ...rest] = editName.split(' ');
        const lastName = rest.join(' ');
        updateUserMutation.mutate({ id: selectedUser.id, data: { firstName, lastName } }, {
            onSuccess: () => { setIsSaving(false); closeModal(); toast.success('Member Updated'); },
            onError: () => { setIsSaving(false); toast.error('Update Failed'); },
        });
    };

    const confirmTerminate = () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const mutation = selectedUser.status === 'Suspended' ? reactivateUserMutation : deactivateUserMutation;
        mutation.mutate(selectedUser.id, {
            onSuccess: () => { setIsSaving(false); closeModal(); toast.success(selectedUser.status === 'Suspended' ? 'Restored' : 'Suspended'); },
            onError: () => { setIsSaving(false); toast.error('Action Failed'); },
        });
    };

    const confirmInvite = () => {
        if (!inviteEmail.trim()) return;
        setIsSaving(true);
        createInvitationMutation.mutate({ email: inviteEmail.trim(), role: ROLE_TO_BACKEND[inviteRole] as 'AGENT' }, {
            onSuccess: () => { setIsSaving(false); closeModal(); toast.success('Invitation Sent'); },
            onError: (err: any) => { setIsSaving(false); toast.error('Invite Failed', { description: err?.response?.data?.message?.[0] || 'Error' }); },
        });
    };

    const filteredUsers = users.filter(u =>
        u.backendRole !== 'PLATFORM_SUPER_ADMIN' &&
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Grouping for Bento Grid Display
    const usersByRole = filteredUsers.reduce((acc, user) => {
        if (!acc[user.role]) acc[user.role] = [];
        acc[user.role].push(user);
        return acc;
    }, {} as Record<string, DisplayUser[]>);

    const sortedRoles = ['Workspace Owner', 'Administrator', 'Manager', 'Supervisor', 'Agent', 'Platform Admin'].filter(r => usersByRole[r]);

    const ROLE_ICONS: Record<string, React.ElementType> = {
        'Workspace Owner': Crown, 'Administrator': ShieldCheck, 'Manager': Briefcase,
        'Supervisor': UserCheck, 'Agent': Users, 'Platform Admin': UserCog
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* LIQUID TABS */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full max-w-[400px]">
                {([
                    { key: 'users', label: 'Team Members', icon: Users },
                    { key: 'roles', label: 'Roles & Models', icon: Lock },
                ] as const).map(({ key, label, icon: Icon }) => {
                    const isActive = subTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setSubTab(key)}
                            className={cn(
                                "relative flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-md outline-none",
                                isActive ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="accessControlTab"
                                    className="absolute inset-0 bg-white dark:bg-slate-700 shadow-sm border border-slate-200/50 dark:border-slate-600/50 rounded-md"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <Icon size={16} className="relative z-10" />
                            <span className="relative z-10">{label}</span>
                        </button>
                    );
                })}
            </div>

            {/* CONTENT AREA */}
            <div className="mt-2">
                <AnimatePresence mode="wait">
                    {/* USERS TAB */}
                    {subTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-8"
                        >
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="relative flex-1 max-w-[320px]">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search members..."
                                        className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    />
                                </div>
                                <button
                                    onClick={() => { setInviteName(''); setInviteEmail(''); setModalType('invite'); }}
                                    className="h-10 px-5 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-bold flex items-center gap-2 transition active:scale-95 ml-auto"
                                >
                                    <UserPlus size={16} />
                                    Invite Member
                                </button>
                            </div>

                            {/* Fragmented Bento Grid of Roles */}
                            {sortedRoles.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {sortedRoles.map(role => {
                                        const roleUsers = usersByRole[role];
                                        const RIcon = ROLE_ICONS[role] || Users;
                                        return (
                                            <div key={role} className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2 px-1">
                                                    <RIcon size={16} className="text-slate-400" />
                                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                                        {role} <span className="text-slate-400 font-medium ml-1">({roleUsers.length})</span>
                                                    </h3>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {roleUsers.map(u => (
                                                        <div key={u.id} className="group relative flex items-start gap-4 p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition duration-200">
                                                            <div className="size-10 rounded text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                                                                {u.initial}
                                                            </div>
                                                            <div className="flex-1 min-w-0 pr-[100px]">
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                                                                <p className="text-xs font-mono text-slate-500 truncate">{u.email}</p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className={cn('size-1.5 rounded-full', u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500')} />
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{u.status}</span>
                                                                </div>
                                                            </div>

                                                            {/* Actions Overlay - Sharp Buttons */}
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => openEditModal(u)} className="p-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm hover:text-primary-600" title="Edit Profile">
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button onClick={() => openRoleModal(u)} className="p-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm hover:text-amber-600" title="Change Role">
                                                                    <Crown size={14} />
                                                                </button>
                                                                <button onClick={() => openPermissionsModal(u)} className="p-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm hover:text-blue-600" title="Direct Permissions">
                                                                    <ShieldCheck size={14} />
                                                                </button>
                                                                <button onClick={() => openTerminateModal(u)} className={cn("p-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm", u.status === 'Suspended' ? 'hover:text-emerald-600' : 'hover:text-rose-600')} title="Toggle Status">
                                                                    {u.status === 'Suspended' ? <CheckCircle size={14} /> : <Ban size={14} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                    <Users size={32} className="text-slate-300 mb-2" />
                                    <p className="text-sm font-semibold text-slate-500">No members match your search.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ROLES TAB */}
                    {subTab === 'roles' && (
                        <motion.div
                            key="roles"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="relative min-h-[400px] border border-slate-200 dark:border-slate-800 border-dashed rounded-xl flex items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/30"
                        >
                            <div className="flex flex-col items-center gap-3 max-w-sm">
                                <div className="size-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center animate-pulse">
                                    <Lock size={20} />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Role Engine Active</h3>
                                <p className="text-sm text-slate-500">
                                    The 6-tier RBAC system is firmly established in the backend. Visual role schema management is slated for v2.4 to maintain absolute data integrity.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Inline Modals (Rendered via Portal to escape Framer Motion stacking context) */}
            {mounted && modalType === 'edit' && selectedUser && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200 font-sans">
                        <h3 className="text-lg font-bold">Edit Name</h3>
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="h-10 rounded border border-slate-300 dark:border-slate-600 bg-transparent px-3 text-sm focus:outline-none focus:border-primary-500" />
                        <div className="flex gap-2">
                            <button onClick={closeModal} className="flex-1 h-9 border border-slate-200 dark:border-slate-700 rounded font-medium text-sm">Cancel</button>
                            <button onClick={confirmEdit} disabled={isSaving} className="flex-1 h-9 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded font-bold text-sm">Save</button>
                        </div>
                    </div>
                </div>, document.body
            )}

            {mounted && modalType === 'invite' && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200 font-sans">
                        <h3 className="text-lg font-bold">Invite Member</h3>
                        <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Full Name" className="h-10 rounded border border-slate-300 dark:border-slate-600 bg-transparent px-3 text-sm focus:outline-none focus:border-primary-500" />
                        <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email Address" type="email" className="h-10 rounded border border-slate-300 dark:border-slate-600 bg-transparent px-3 text-sm focus:outline-none focus:border-primary-500" />
                        <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="h-10 rounded border border-slate-300 dark:border-slate-600 bg-transparent px-3 text-sm focus:outline-none focus:border-primary-500">
                            {Object.keys(ROLE_TO_BACKEND).map(r => <option key={r}>{r}</option>)}
                        </select>
                        <div className="flex gap-2 mt-2">
                            <button onClick={closeModal} className="flex-1 h-9 border border-slate-200 dark:border-slate-700 rounded font-medium text-sm">Cancel</button>
                            <button onClick={confirmInvite} disabled={isSaving} className="flex-1 h-9 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded font-bold text-sm">Send Invite</button>
                        </div>
                    </div>
                </div>, document.body
            )}

            {/* Suspend/Restore modal */}
            {mounted && modalType === 'terminate' && selectedUser && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 flex flex-col gap-4 text-center animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold">{selectedUser.status === 'Suspended' ? 'Restore User?' : 'Suspend User?'}</h3>
                        <p className="text-sm text-slate-500">Confirm action for {selectedUser.name}</p>
                        <div className="flex gap-2 mt-2">
                            <button onClick={closeModal} className="flex-1 h-9 border border-slate-200 dark:border-slate-700 rounded font-medium text-sm">Cancel</button>
                            <button onClick={confirmTerminate} disabled={isSaving} className={cn("flex-1 h-9 text-white rounded font-bold text-sm", selectedUser.status === 'Suspended' ? 'bg-emerald-600' : 'bg-rose-600')}>Confirm</button>
                        </div>
                    </div>
                </div>, document.body
            )}

            <UserPermissionsModal isOpen={modalType === 'permissions'} onClose={closeModal} user={selectedUser as any} />
            <ChangeRoleModal isOpen={modalType === 'role'} onClose={closeModal} user={selectedUser ? { id: selectedUser.id, name: selectedUser.name, role: selectedUser.backendRole, email: selectedUser.email } : null} />
        </div>
    );
}

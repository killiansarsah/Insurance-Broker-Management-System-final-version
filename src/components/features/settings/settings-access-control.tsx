'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
}

interface Role {
    id: string;
    name: string;
    userCount: number;
    permissions: string[];
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
        { id: '1', name: 'Amara Ndiaye', email: 'amara.ndiaye@ibms.africa', role: 'Workspace owner', status: 'Active', active: 'Oct 24, 2023', img: '12' },
        { id: '2', name: 'David Osei', email: 'david.osei@ibms.africa', role: 'Administrator', status: 'Active', active: 'Oct 24, 2023', img: '15' },
        { id: '3', name: 'Sarah Smith', email: 'sarah.smith@ibms.africa', role: 'Manager', status: 'Inactive', active: 'Oct 20, 2023', initial: 'SS' },
        { id: '4', name: 'Kwame Mensah', email: 'kwame.m@ibms.africa', role: 'Supervisor', status: 'Active', active: 'Oct 23, 2023', img: '18' },
        { id: '5', name: 'Zainab Oladipo', email: 'zainab.o@ibms.africa', role: 'Agent', status: 'Suspended', active: 'Sep 12, 2023', initial: 'ZO' },
    ]);

    const [permissions] = useState<Permission[]>([
        { id: 'view_policies', name: 'View Policies', category: 'Policies', description: 'Can view motor and non-motor policy lists' },
        { id: 'edit_policies', name: 'Edit Policies', category: 'Policies', description: 'Can update policy details and coverage' },
        { id: 'delete_policies', name: 'Delete Policies', category: 'Policies', description: 'Can remove policy records from system' },
        { id: 'view_financials', name: 'View Financials', category: 'Finance', description: 'Can view commissions and accounting ledgers' },
        { id: 'manage_users', name: 'Manage Users', category: 'System', description: 'Can add, edit, and suspend team members' },
        { id: 'export_data', name: 'Export Data', category: 'Reports', description: 'Can download bulk data in Excel/CSV' },
    ]);

    const [roles] = useState<Role[]>([
        { id: '1', name: 'Workspace Owner', userCount: 1, permissions: permissions.map(p => p.id) },
        { id: '2', name: 'Administrator', userCount: 2, permissions: permissions.map(p => p.id).filter(id => id !== 'delete_policies') },
        { id: '3', name: 'Manager', userCount: 5, permissions: ['view_policies', 'edit_policies', 'view_financials', 'export_data'] },
        { id: '4', name: 'Agent', userCount: 12, permissions: ['view_policies', 'edit_policies'] },
    ]);

    const [selectedRoleId, setSelectedRoleId] = useState<string>('1');
    const selectedRole = roles.find(r => r.id === selectedRoleId);

    return (
        <div className="flex flex-col gap-10">
            {/* Sub Tabs */}
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit self-center">
                <button
                    onClick={() => setSubTab('users')}
                    className={cn(
                        "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        subTab === 'users' ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    User Management
                </button>
                <button
                    onClick={() => setSubTab('roles')}
                    className={cn(
                        "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        subTab === 'roles' ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    Roles & Permissions
                </button>
            </div>

            {subTab === 'users' && (
                <div className="flex flex-col gap-8 animate-fade-in">
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">search</span>
                            <input className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 dark:text-white" placeholder="Search team members..." />
                        </div>
                        <button className="h-12 px-8 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            Invite User
                        </button>
                    </div>

                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                        <th className="px-8 py-5">System User</th>
                                        <th className="px-8 py-5">Role</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Activity</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    {u.img ? (
                                                        <img className="size-10 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" src={`https://picsum.photos/seed/${u.img}/100/100`} alt="" />
                                                    ) : (
                                                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-800 shadow-sm">{u.initial}</div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{u.name}</div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "size-2 rounded-full",
                                                        u.status === 'Active' ? "bg-emerald-500 animate-pulse" : u.status === 'Suspended' ? "bg-rose-500" : "bg-slate-300"
                                                    )}></span>
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest",
                                                        u.status === 'Active' ? "text-emerald-600" : u.status === 'Suspended' ? "text-rose-600" : "text-slate-400"
                                                    )}>{u.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-tight font-mono">{u.active}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEditModal(u)} className="size-9 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button onClick={() => openTerminateModal(u)} className="size-9 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-lg">{u.status === 'Suspended' ? 'check_circle' : 'block'}</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'roles' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Defined Access Tiers</h3>
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={cn(
                                        "w-full p-6 rounded-[2rem] border text-left transition-all",
                                        selectedRoleId === role.id
                                            ? "bg-white dark:bg-slate-900 border-primary shadow-xl shadow-primary/5 ring-1 ring-primary"
                                            : "bg-white/50 dark:bg-slate-930 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            "text-sm font-black uppercase tracking-tight",
                                            selectedRoleId === role.id ? "text-primary" : "text-slate-900 dark:text-white"
                                        )}>{role.name}</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{role.userCount} Active</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {role.permissions.length} Authorized Modules
                                    </p>
                                </button>
                            ))}
                        </div>
                        <button className="w-full h-14 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">add_circle</span>
                            New System Role
                        </button>
                    </div>

                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined">verified_user</span>
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedRole?.name} Permissions</h4>
                                </div>
                                <button className="h-10 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Reset</button>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {permissions.map(permission => {
                                    const isEnabled = selectedRole?.permissions.includes(permission.id);
                                    return (
                                        <div key={permission.id} className="p-10 hover:bg-slate-50/30 transition-colors">
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h5 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{permission.name}</h5>
                                                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest">{permission.category}</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{permission.description}</p>
                                                </div>
                                                <button className={cn(
                                                    "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
                                                    isEnabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                                )}>
                                                    <span className={cn(
                                                        "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out",
                                                        isEnabled ? "translate-x-6" : "translate-x-0"
                                                    )} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-10 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button className="h-14 px-10 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    Commit Role Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ── Edit User Modal ── */}
            {modalType === 'edit' && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 flex flex-col gap-6 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">person_edit</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Edit User</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                <input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                                <select
                                    value={editRole}
                                    onChange={e => setEditRole(e.target.value)}
                                    className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    {roleOptions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={closeModal}
                                className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmEdit}
                                disabled={isSaving || !editName.trim()}
                                className="flex-1 h-12 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                {isSaving && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
                                Update User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Suspend / Restore Confirmation Modal ── */}
            {modalType === 'terminate' && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 flex flex-col items-center gap-5 text-center animate-fade-in">
                        <div className={cn(
                            "size-16 rounded-2xl flex items-center justify-center",
                            selectedUser.status === 'Suspended' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600"
                        )}>
                            <span className="material-symbols-outlined text-3xl">
                                {selectedUser.status === 'Suspended' ? 'check_circle' : 'gpp_bad'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {selectedUser.status === 'Suspended' ? 'Restore User?' : 'Suspend User?'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                {selectedUser.status === 'Suspended'
                                    ? `This will restore ${selectedUser.name}'s access to the system.`
                                    : `This will revoke ${selectedUser.name}'s access to the system. They can be restored later.`
                                }
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full pt-2">
                            <button
                                onClick={closeModal}
                                className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmTerminate}
                                disabled={isSaving}
                                className={cn(
                                    "flex-1 h-12 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
                                    selectedUser.status === 'Suspended'
                                        ? "bg-emerald-600 shadow-emerald-600/20"
                                        : "bg-rose-600 shadow-rose-600/20"
                                )}
                            >
                                {isSaving && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
                                {selectedUser.status === 'Suspended' ? 'Restore' : 'Suspend'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toast Notification ── */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30 animate-fade-in">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    <span className="text-sm font-bold">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}

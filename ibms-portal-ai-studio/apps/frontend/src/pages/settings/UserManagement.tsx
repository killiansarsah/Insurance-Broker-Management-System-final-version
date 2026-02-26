
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  active: string;
  img?: string;
  initial?: string;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Amara Ndiaye', email: 'amara.ndiaye@ibms.africa', role: 'Workspace owner', status: 'Active', active: 'Oct 24, 2023', img: '12' },
    { id: '2', name: 'David Osei', email: 'david.osei@ibms.africa', role: 'Administrator', status: 'Active', active: 'Oct 24, 2023', img: '15' },
    { id: '3', name: 'Sarah Smith', email: 'sarah.smith@ibms.africa', role: 'Manager', status: 'Inactive', active: 'Oct 20, 2023', initial: 'SS' },
    { id: '4', name: 'Kwame Mensah', email: 'kwame.m@ibms.africa', role: 'Supervisor', status: 'Active', active: 'Oct 23, 2023', img: '18' },
    { id: '5', name: 'Zainab Oladipo', email: 'zainab.o@ibms.africa', role: 'Agent', status: 'Suspended', active: 'Sep 12, 2023', initial: 'ZO' },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'edit' | 'terminate' | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalType('edit');
  };

  const handleTerminate = (user: User) => {
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
    setTimeout(() => setShowToast(false), 3000);
  };

  const confirmEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    triggerToast(`User ${selectedUser.name} updated successfully.`);
    closeModal();
  };

  const confirmTerminate = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' } : u
    ));
    triggerToast(`User status for ${selectedUser.name} toggled.`);
    closeModal();
  };

  return (
    <div className="flex flex-col gap-8 relative pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-slate-600">arrow_back</span>
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">User Management</h1>
            <p className="text-slate-500 font-medium mt-1">Manage system access for brokers, officers, and administrators.</p>
          </div>
        </div>
        <Link to="/users/add" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] transition-all uppercase tracking-widest">
          <span className="material-symbols-outlined">add</span>
          Add New User
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><span className="material-symbols-outlined text-[20px]">search</span></span>
            <input className="w-full rounded-xl border-none bg-slate-50 dark:bg-slate-800 py-3 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400" placeholder="Search users by name or email..." />
          </div>
          <div className="flex w-full md:w-auto flex-wrap items-center gap-3">
            <select className="h-11 min-w-[140px] rounded-xl border-none bg-slate-50 dark:bg-slate-800 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all px-4">
              <option>All Roles</option>
              <option>Workspace owner</option>
              <option>Administrator</option>
              <option>Manager</option>
              <option>Supervisor</option>
              <option>Agent</option>
            </select>
            <select className="h-11 min-w-[140px] rounded-xl border-none bg-slate-50 dark:bg-slate-800 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all px-4">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
            <button className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">download</span> Export
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[10px] uppercase font-black text-slate-500 tracking-widest">
                <th className="px-8 py-5 w-12"><input type="checkbox" className="rounded-md border-slate-200" /></th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Last Active</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-6"><input type="checkbox" className="rounded-md border-slate-200" /></td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {u.img ? (
                        <img className="size-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" src={`https://picsum.photos/seed/${u.img}/100/100`} alt="" />
                      ) : (
                        <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-800 shadow-sm">{u.initial}</div>
                      )}
                      <div>
                        <div className="text-slate-900 dark:text-white uppercase tracking-tight">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-black mt-0.5 tracking-widest">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 animate-pulse' : u.status === 'Suspended' ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${u.status === 'Active' ? 'text-emerald-700' : u.status === 'Suspended' ? 'text-red-700' : 'text-slate-400'}`}>
                        {u.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-400 font-mono tracking-tight">{u.active}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(u)}
                        className="p-2 text-slate-400 hover:text-primary transition-all rounded-lg hover:bg-primary/5"
                        title="Edit User"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleTerminate(u)}
                        className={`p-2 transition-all rounded-lg ${u.status === 'Suspended' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                        title={u.status === 'Suspended' ? 'Reactivate' : 'Terminate Access'}
                      >
                        <span className="material-symbols-outlined text-[20px]">{u.status === 'Suspended' ? 'settings_backup_restore' : 'block'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {modalType === 'edit' && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn">
            <form onSubmit={confirmEdit} className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Edit Access</h2>
                <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm" 
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Role</label>
                  <select 
                    className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-sm"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  >
                    <option>Workspace owner</option>
                    <option>Administrator</option>
                    <option>Manager</option>
                    <option>Supervisor</option>
                    <option>Agent</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button type="button" onClick={closeModal} className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">Update User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terminate Confirmation Modal */}
      {modalType === 'terminate' && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn">
            <div className="flex flex-col items-center text-center gap-6">
              <div className={`size-16 rounded-2xl flex items-center justify-center ${selectedUser.status === 'Suspended' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <span className="material-symbols-outlined text-4xl">{selectedUser.status === 'Suspended' ? 'verified_user' : 'person_off'}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {selectedUser.status === 'Suspended' ? 'Restore User?' : 'Suspend User?'}
                </h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {selectedUser.status === 'Suspended' 
                    ? `Restore portal access for ${selectedUser.name}? They will be able to log in immediately.` 
                    : `Are you sure you want to suspend ${selectedUser.name}? This will revoke their access to all portfolios and reports.`}
                </p>
              </div>
              <div className="flex w-full gap-4 mt-2">
                <button onClick={closeModal} className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest text-slate-500">Cancel</button>
                <button 
                  onClick={confirmTerminate}
                  className={`flex-1 h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg transition-all ${selectedUser.status === 'Suspended' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-red-600 shadow-red-600/20'}`}
                >
                  {selectedUser.status === 'Suspended' ? 'Restore Access' : 'Confirm Suspend'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-fadeIn">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <span className="material-symbols-outlined font-black text-emerald-500">check_circle</span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Success</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{toastMsg}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

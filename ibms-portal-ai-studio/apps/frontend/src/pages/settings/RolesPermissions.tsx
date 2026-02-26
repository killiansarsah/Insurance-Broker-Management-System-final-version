
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  permissions: string[]; // IDs of permissions
}

const RolesPermissions: React.FC = () => {
  const navigate = useNavigate();
  
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

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>('1');
  const selectedRole = roles.find(r => r.id === selectedRoleId);

  return (
    <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-slate-600">arrow_back</span>
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Roles & Permissions</h1>
            <p className="text-slate-500 font-medium">Fine-tune system access levels and functional permissions across your team.</p>
          </div>
        </div>
        <button className="h-12 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2">
           <span className="material-symbols-outlined text-lg">add</span>
           Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Available Roles</h3>
           <div className="flex flex-col gap-3">
              {roles.map(role => (
                <button 
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full p-6 rounded-3xl border text-left transition-all ${
                    selectedRoleId === role.id 
                    ? 'bg-white dark:bg-slate-900 border-primary shadow-xl shadow-primary/5 ring-1 ring-primary' 
                    : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className={`text-sm font-black uppercase tracking-tight ${selectedRoleId === role.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                        {role.name}
                     </span>
                     <span className="text-[10px] font-black text-slate-400 uppercase">{role.userCount} Users</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                     {role.permissions.length} active permissions enabled
                  </p>
                </button>
              ))}
           </div>
        </div>

        {/* Permissions Table/View */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
              Permissions for {selectedRole?.name}
           </h3>
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <span className="material-symbols-outlined">security</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Module Permissions</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Toggle access for specific application modules</p>
                    </div>
                 </div>
                 <button className="h-10 px-5 rounded-xl border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    Reset to Default
                 </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {permissions.map(permission => {
                    const isEnabled = selectedRole?.permissions.includes(permission.id);
                    return (
                      <div key={permission.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                         <div className="flex items-start justify-between gap-6">
                            <div className="flex flex-col gap-1 flex-1">
                               <div className="flex items-center gap-2">
                                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{permission.name}</span>
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest">{permission.category}</span>
                               </div>
                               <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-md">
                                  {permission.description}
                               </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-4">
                               <button 
                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                               >
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                               </button>
                            </div>
                         </div>
                      </div>
                    );
                 })}
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                 <button className="h-12 px-8 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                    Save Changes
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;

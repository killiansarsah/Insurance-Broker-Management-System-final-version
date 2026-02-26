
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddUser: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/users')}
          className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-slate-600">arrow_back</span>
        </button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Invite New Team Member</h1>
          <p className="text-slate-500 font-medium text-sm">Grant system access and assign functional roles to new employees.</p>
        </div>
      </div>

      <form className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-sm flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
            <input className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 font-bold text-sm focus:bg-white transition-all" placeholder="e.g. John Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
            <input className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 font-bold text-sm focus:bg-white transition-all" type="email" placeholder="john@company.com" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Access Role</label>
            <select className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 font-black text-[10px] uppercase tracking-widest focus:bg-white transition-all">
              <option>Workspace owner</option>
              <option>Administrator</option>
              <option>Manager</option>
              <option>Supervisor</option>
              <option>Agent</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Office Branch</label>
            <select className="h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 font-black text-[10px] uppercase tracking-widest focus:bg-white transition-all">
              <option>Lagos HQ</option>
              <option>Abuja Office</option>
              <option>Port Harcourt</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Permission Overrides</h4>
          <div className="flex flex-col gap-3">
            {[
              { id: 'can-delete', label: 'Can delete active policies' },
              { id: 'can-export', label: 'Can export bulk financial data' },
              { id: 'can-invite', label: 'Can invite other users' },
            ].map(p => (
              <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="size-5 rounded-md border-slate-200 text-primary focus:ring-primary" />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6">
          <button type="button" onClick={() => navigate('/users')} className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">Cancel</button>
          <button type="submit" className="h-12 px-10 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
            Send Invitation
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;

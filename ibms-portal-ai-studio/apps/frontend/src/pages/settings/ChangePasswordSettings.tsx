
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePasswordSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [password, setPassword] = useState('');

  const calculateStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 33;
    if (password.length < 10) return 66;
    return 100;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-10 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/settings')}
          className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Change Password</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Keep your portal access secure by updating your credentials regularly.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-10 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
            <input 
              type="password"
              className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm" 
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <input 
                type="password"
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm" 
                placeholder="Minimum 12 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Strength Indicator */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security Strength</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${calculateStrength() === 100 ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {calculateStrength() === 100 ? 'Verified Secure' : calculateStrength() === 66 ? 'Moderate' : 'Weak'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${calculateStrength() === 100 ? 'bg-emerald-500' : calculateStrength() === 66 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${calculateStrength()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
            <input 
              type="password"
              className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white transition-all text-sm" 
              placeholder="Re-type new password"
              required
            />
          </div>
        </div>

        <button 
          disabled={isSaving}
          className={`h-14 w-full rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 ${isSaving ? 'opacity-50' : 'hover:scale-[1.02] active:scale-95'}`}
        >
          {isSaving ? <span className="animate-spin material-symbols-outlined text-lg">sync</span> : <span className="material-symbols-outlined text-lg">verified_user</span>}
          {isSaving ? 'Updating...' : 'Securely Change Password'}
        </button>
      </form>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-fadeIn">
          <div className="bg-emerald-600 text-white px-10 py-5 rounded-3xl shadow-2xl flex items-center gap-4">
            <span className="material-symbols-outlined font-black">check_circle</span>
            <p className="text-sm font-black uppercase tracking-widest">Password Updated Successfully</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordSettings;

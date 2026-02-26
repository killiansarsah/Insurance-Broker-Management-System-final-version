
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TwoFactorSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/settings')}
          className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Two-Factor Auth (2FA)</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Add an extra layer of security to your BrokerSys account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-10 flex flex-col gap-10">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authenticator App</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">
                  Use an app like Google Authenticator or Authy to generate secure verification codes.
                </p>
              </div>
              <button 
                onClick={() => { if(!isEnabled) setIsEnabled(true); else setIsEnabled(false); }}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${isEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {isEnabled && (
              <div className="flex flex-col gap-8 p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-fadeIn">
                <div className="flex items-center gap-6">
                   <div className="size-24 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                      <div className="size-full bg-slate-100 flex items-center justify-center">
                         <span className="material-symbols-outlined text-4xl text-slate-300">qr_code_2</span>
                      </div>
                   </div>
                   <div className="flex flex-col gap-1 flex-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step 1 of 2</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Scan QR Code</h4>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">Open your authenticator app and scan this code to link your account.</p>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
                   <div className="flex gap-3">
                      <input className="flex-1 h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-black text-2xl tracking-[0.5em] text-center focus:ring-4 focus:ring-primary/10 transition-all" placeholder="000000" />
                      <button className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Verify</button>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-primary/5 dark:bg-slate-900/50 p-8 rounded-3xl border border-primary/20 flex flex-col gap-6">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Account Recovery</h4>
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed tracking-tight">
                Print or securely store your backup codes. These allow you to regain access if you lose your authentication device.
             </p>
             <button className="h-11 w-full rounded-xl border-2 border-primary text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all">
                Download Recovery Codes
             </button>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col gap-4">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Security Recommendation</h4>
             <p className="text-xs font-bold leading-relaxed uppercase tracking-tight italic opacity-80">
                2FA is mandatory for all accounts with "Administrator" or "Workspace Owner" privileges to prevent unauthorized financial exports.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSettings;

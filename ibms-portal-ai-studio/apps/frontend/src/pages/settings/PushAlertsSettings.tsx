
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PushAlertsSettings: React.FC = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const [toggles, setToggles] = useState([
    { id: 'browser', title: 'Browser Notifications', desc: 'Receive real-time alerts while the portal is open in your browser.', enabled: true },
    { id: 'sound', title: 'Sound Effects', desc: 'Play a notification sound for urgent task reminders.', enabled: false },
    { id: 'mobile', title: 'Mobile App Push', desc: 'Receive alerts on the IBMS mobile application.', enabled: true },
    { id: 'desktop', title: 'Desktop Banners', desc: 'Show floating banners on your OS desktop (Windows/Mac).', enabled: true }
  ]);

  const handleToggle = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const simulatePush = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Push Alerts</h1>
            <p className="text-slate-500 font-medium text-lg mt-1">Configure instant real-time notifications for this device.</p>
          </div>
        </div>
        <button 
          onClick={simulatePush}
          className="h-12 px-6 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">notifications_active</span>
          Test Push Signal
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Alert Channels</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {toggles.map((t) => (
            <div key={t.id} className={`p-8 flex items-center justify-between gap-6 transition-colors ${!t.enabled ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex flex-col gap-1">
                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.title}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md">{t.desc}</p>
              </div>
              <button 
                onClick={() => handleToggle(t.id)}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${t.enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${t.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-800 flex items-start gap-6">
        <div className="size-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl">error</span>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-black text-amber-900 dark:text-amber-300 uppercase tracking-tight">Notification Permissions</h4>
          <p className="text-sm font-medium text-amber-800/70 dark:text-amber-400/50 leading-relaxed">
            If you are not receiving browser alerts, please ensure that notifications are permitted in your browser settings for <strong>ibms-portal.com</strong>.
          </p>
        </div>
      </div>

      {isSimulating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-4">
             <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-white dark:bg-slate-900 px-4 py-1 rounded-full shadow-lg">Connecting to Push Hub...</span>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-10 right-10 z-[200] animate-bounce">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-slate-700 max-w-sm">
            <span className="material-symbols-outlined text-primary text-3xl">notifications_active</span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Test Push Success</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Push channel verified for this workstation.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushAlertsSettings;

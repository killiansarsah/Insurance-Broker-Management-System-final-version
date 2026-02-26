
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginHistorySettings: React.FC = () => {
  const navigate = useNavigate();

  const sessions = [
    { device: 'MacBook Pro 14"', browser: 'Chrome', location: 'Accra, Ghana', ip: '197.251.144.102', date: 'Today, 10:45 AM', current: true },
    { device: 'iPhone 15 Pro', browser: 'Mobile Safari', location: 'Accra, Ghana', ip: '197.251.144.102', date: 'Today, 08:22 AM', current: false },
    { device: 'Windows Desktop', browser: 'Edge', location: 'Lagos, Nigeria', ip: '41.218.231.10', date: 'Oct 24, 2024, 04:15 PM', current: false },
    { device: 'iPad Air', browser: 'Safari', location: 'Accra, Ghana', ip: '102.176.1.45', date: 'Oct 22, 2024, 11:30 AM', current: false },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Login History</h1>
            <p className="text-slate-500 font-medium text-lg mt-1">Review your recent session activity to ensure account integrity.</p>
          </div>
        </div>
        <button className="h-12 px-6 rounded-xl border-2 border-rose-500 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all">
          Sign out all devices
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                {['Device & Browser', 'Location', 'IP Address', 'Last Accessed', 'Status'].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessions.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined">{s.device.includes('iPhone') || s.device.includes('iPad') ? 'smartphone' : 'laptop'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.device}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.browser}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-300">{s.location}</td>
                  <td className="px-8 py-6 font-mono text-xs text-slate-400">{s.ip}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{s.date}</td>
                  <td className="px-8 py-6">
                    {s.current ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800 animate-pulse">
                        Active Now
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Logged out</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginHistorySettings;

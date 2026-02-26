
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LayoutSettings: React.FC = () => {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState([
    { id: 'kpis', title: 'Top KPIs', desc: 'Premium, Commission, and Sum Insured summaries.', enabled: true, icon: 'analytics' },
    { id: 'revenue', title: 'Revenue Trend Chart', desc: 'Monthly net commission performance area chart.', enabled: true, icon: 'show_chart' },
    { id: 'insurer_yield', title: 'Insurer Yield', desc: 'Pie chart showing portfolio concentration by underwriter.', enabled: true, icon: 'pie_chart' },
    { id: 'quick_actions', title: 'Quick Action Bar', desc: 'Shortcut buttons for Excel Import, Add Policy, etc.', enabled: true, icon: 'bolt' },
    { id: 'recent_activity', title: 'Recent Activity', desc: 'A log of recent ledger entries and client updates.', enabled: false, icon: 'history' },
    { id: 'tasks_summary', title: 'Task List Summary', desc: 'Mini-view of high-priority daily tasks.', enabled: false, icon: 'checklist' },
  ]);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Dashboard Layout</h1>
            <p className="text-slate-500 font-medium text-lg mt-1">Configure which data widgets appear on your primary overview.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Dashboard Widgets</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toggle to show/hide</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {widgets.map((w) => (
              <div key={w.id} className={`p-8 flex items-center justify-between gap-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20 ${!w.enabled ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-6">
                  <div className={`size-12 rounded-2xl flex items-center justify-center ${w.enabled ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-2xl">{w.icon}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{w.title}</h4>
                    <p className="text-sm font-medium text-slate-500">{w.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${w.enabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {w.enabled ? 'Visible' : 'Hidden'}
                  </span>
                  <button 
                    onClick={() => toggleWidget(w.id)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${w.enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${w.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl border border-slate-700 text-white flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500">drag_indicator</span>
                <h4 className="text-sm font-black uppercase tracking-widest">Reorder Preview</h4>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Coming Soon</span>
           </div>
           <p className="text-xs font-medium text-slate-400 leading-relaxed">
             In the upcoming v2.4 update, you will be able to drag and drop these blocks directly on your dashboard to customize their exact position. Currently, toggling a widget off will simply collapse its corresponding space.
           </p>
           <button className="h-12 w-full border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
             Save Custom View
           </button>
        </div>
      </div>
    </div>
  );
};

export default LayoutSettings;

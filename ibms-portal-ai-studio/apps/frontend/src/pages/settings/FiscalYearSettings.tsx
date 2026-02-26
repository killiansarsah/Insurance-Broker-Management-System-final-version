
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useYear } from '../../context/YearContext';

const FiscalYearSettings: React.FC = () => {
  const navigate = useNavigate();
  const { selectedYear, setSelectedYear, availableYears } = useYear();

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/settings')}
          className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Fiscal Year Context</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Select the active reporting year for all analytics, ledgers, and portfolios.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Active Context</h3>
           <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">calendar_today</span>
                 </div>
                 <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Fiscal Year {selectedYear}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Database Archive Active</p>
                 </div>
              </div>
              <span className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">verified</span>
                 Current Context
              </span>
           </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Switch Reporting Year</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {availableYears.map((year) => (
              <button 
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col gap-4 group hover:scale-[1.02] ${
                  selectedYear === year 
                  ? 'border-primary bg-primary/5 shadow-lg' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                   <span className={`material-symbols-outlined text-3xl ${selectedYear === year ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>history</span>
                   {selectedYear === year && (
                     <span className="material-symbols-outlined text-emerald-500 font-black">check_circle</span>
                   )}
                </div>
                <div className="text-left">
                   <p className={`text-xl font-black ${selectedYear === year ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{year}</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Full Audit Log</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-800 flex items-start gap-6">
        <div className="size-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl">info</span>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-black text-amber-900 dark:text-amber-300 uppercase tracking-tight">System-Wide Impact</h4>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Changing the fiscal year will update all data views including your Dashboard, Policy Lists, and Financial Ledgers. This is used for historical auditing and compliance reporting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FiscalYearSettings;

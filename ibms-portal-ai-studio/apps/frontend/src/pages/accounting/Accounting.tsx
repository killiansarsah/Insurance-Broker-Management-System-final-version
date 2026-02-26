
import React from 'react';

const Accounting: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Accounting & Ledgers</h2>
          <p className="text-slate-500 font-medium text-lg mt-2">Centralized management of premium collections, settlements, and agency billing.</p>
        </div>
        <div className="flex gap-4">
          <button className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">history</span>
            Audit Trail
          </button>
          <button className="h-12 px-6 rounded-xl bg-primary hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">receipt</span>
            New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover-lift cursor-pointer">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Cash Flow</span>
            <span className="material-symbols-outlined text-emerald-500">trending_up</span>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white">GH₵ 1.24M</p>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[75%] rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover-lift cursor-pointer">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unpaid Premiums</span>
            <span className="material-symbols-outlined text-orange-500">pending_actions</span>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white">GH₵ 142.5k</p>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[40%] rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover-lift cursor-pointer">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payables</span>
            <span className="material-symbols-outlined text-blue-500">outbound</span>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white">GH₵ 28.9k</p>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[15%] rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-8">
            {['Invoices', 'Receipts', 'Debit Notes', 'Credit Notes'].map((tab, i) => (
              <button key={tab} className={`text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${i === 0 ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined text-5xl">inventory_2</span>
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Transactions for current period</h4>
            <p className="text-slate-500 text-sm font-medium mt-1">Select a different month or create a new ledger entry.</p>
          </div>
          <button className="mt-4 px-6 py-2 rounded-xl border border-primary text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all">Select Period</button>
        </div>
      </div>
    </div>
  );
};

export default Accounting;

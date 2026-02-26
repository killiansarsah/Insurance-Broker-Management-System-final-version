
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const trendData = [
  { month: 'Jan', premium: 4000, commission: 2400 },
  { month: 'Feb', premium: 3000, commission: 1398 },
  { month: 'Mar', premium: 2000, commission: 9800 },
  { month: 'Apr', premium: 2780, commission: 3908 },
  { month: 'May', premium: 1890, commission: 4800 },
  { month: 'Jun', premium: 2390, commission: 3800 },
];

const distributionData = [
  { name: 'Motor', value: 45, color: '#137fec' },
  { name: 'Life', value: 25, color: '#10b981' },
  { name: 'Health', value: 20, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#ef4444' },
];

const Finance: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Finance & Commission</h2>
          <p className="text-slate-500 font-medium text-lg mt-2">Overview of monthly commissions, premiums, and revenue performance.</p>
        </div>
        <div className="flex gap-4">
          <button className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
            Download PDF
          </button>
          <button className="h-12 px-6 rounded-xl bg-primary hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">table_view</span>
            Export to Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Commission', value: 'GH₵ 18,675', trend: '+12%', icon: 'payments', color: 'blue' },
          { label: 'Total Premium', value: 'GH₵ 124,500', trend: '+5%', icon: 'account_balance_wallet', color: 'emerald' },
          { label: 'Outstanding', value: 'GH₵ 4,200', trend: '-2%', icon: 'pending_actions', color: 'orange' },
          { label: 'Net Revenue', value: 'GH₵ 14,475', trend: '+8%', icon: 'savings', color: 'primary' },
        ].map((k, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover-lift cursor-pointer">
            <div className="flex justify-between items-start">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{k.label}</p>
              <div className="bg-primary/5 p-3 rounded-2xl text-primary"><span className="material-symbols-outlined">{k.icon}</span></div>
            </div>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{k.value}</p>
              <span className={`text-xs font-black uppercase tracking-widest ${k.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Commission vs Premium Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip 
                   cursor={{ fill: '#f1f5f980' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="premium" fill="#137fec33" radius={[4, 4, 0, 0]} name="Premium Vol" />
                <Bar dataKey="commission" fill="#137fec" radius={[4, 4, 0, 0]} name="Commission" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Revenue by Policy</h3>
          <div className="h-64 relative flex items-center justify-center mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                  {distributionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">GH₵ 14.4k</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {distributionData.map(d => (
              <div key={d.name} className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                  <span className="size-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{d.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;

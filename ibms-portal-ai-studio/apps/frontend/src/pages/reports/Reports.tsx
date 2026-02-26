import React, { useState } from 'react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Financial' | 'Operational' | 'Regulatory' | 'Analytics';
  icon: string;
  color: string;
}

const Reports: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'premium-register',
      name: 'Premium Register',
      description: 'Complete list of all policies with premium details, payment status, and commission breakdown',
      category: 'Financial',
      icon: 'payments',
      color: 'blue'
    },
    {
      id: 'commission-statement',
      name: 'Commission Statement',
      description: 'Detailed commission report by insurer, policy type, and payment status with aging analysis',
      category: 'Financial',
      icon: 'account_balance',
      color: 'emerald'
    },
    {
      id: 'claims-register',
      name: 'Claims Register',
      description: 'All claims with status, amounts, settlement dates, and loss ratio calculations',
      category: 'Operational',
      icon: 'description',
      color: 'rose'
    },
    {
      id: 'renewal-schedule',
      name: 'Renewal Schedule',
      description: 'Upcoming policy renewals organized by expiry date with client contact information',
      category: 'Operational',
      icon: 'autorenew',
      color: 'amber'
    },
    {
      id: 'client-portfolio',
      name: 'Client Portfolio Report',
      description: 'Client-wise summary of policies, premiums, claims, and lifetime value analysis',
      category: 'Analytics',
      icon: 'group',
      color: 'purple'
    },
    {
      id: 'insurer-performance',
      name: 'Insurer Performance',
      description: 'Comparative analysis of insurers by premium volume, commission rates, and claims settlement',
      category: 'Analytics',
      icon: 'domain',
      color: 'indigo'
    },
    {
      id: 'agent-performance',
      name: 'Agent Performance',
      description: 'Individual agent metrics including policies sold, premium generated, and retention rates',
      category: 'Analytics',
      icon: 'person',
      color: 'cyan'
    },
    {
      id: 'loss-ratio',
      name: 'Loss Ratio Report',
      description: 'Claims vs premiums analysis by policy type, insurer, and time period with trend analysis',
      category: 'Analytics',
      icon: 'trending_down',
      color: 'orange'
    },
    {
      id: 'outstanding-premiums',
      name: 'Outstanding Premiums',
      description: 'Unpaid premiums report with aging analysis and client follow-up recommendations',
      category: 'Financial',
      icon: 'receipt_long',
      color: 'red'
    },
    {
      id: 'nic-quarterly',
      name: 'NIC Quarterly Return',
      description: 'Regulatory submission report for National Insurance Commission with all required metrics',
      category: 'Regulatory',
      icon: 'verified',
      color: 'green'
    }
  ];

  const filteredReports = selectedCategory === 'all' 
    ? reportTemplates 
    : reportTemplates.filter(r => r.category === selectedCategory);

  const categories = ['all', 'Financial', 'Operational', 'Regulatory', 'Analytics'];

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Reports & Analytics</h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Generate standard insurance reports and export data</p>
        </div>
        <div className="flex gap-4">
          <button className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Select Date Range
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Reports</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{reportTemplates.length}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Templates</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Financial</p>
          <p className="text-3xl font-black text-blue-500 tracking-tighter">{reportTemplates.filter(r => r.category === 'Financial').length}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Analytics</p>
          <p className="text-3xl font-black text-purple-500 tracking-tighter">{reportTemplates.filter(r => r.category === 'Analytics').length}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Regulatory</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{reportTemplates.filter(r => r.category === 'Regulatory').length}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIC Reports</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category === 'all' ? 'All Reports' : category}
            </button>
          ))}
        </div>
      </section>

      {/* Report Templates Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all group cursor-pointer hover-lift">
            <div className="flex items-start justify-between mb-6">
              <div className={`size-14 rounded-2xl bg-${report.color}-50 dark:bg-${report.color}-900/20 flex items-center justify-center text-${report.color}-600 dark:text-${report.color}-400`}>
                <span className="material-symbols-outlined text-3xl">{report.icon}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${report.color}-100 text-${report.color}-700 dark:bg-${report.color}-900/20 dark:text-${report.color}-400`}>
                {report.category}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
              {report.name}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {report.description}
            </p>

            <div className="flex gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                Generate
              </button>
              <button className="size-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">download</span>
              </button>
              <button className="size-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">mail</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Export Options */}
      <section className="bg-gradient-to-r from-blue-50 to-primary/5 dark:from-slate-900 dark:to-slate-900 rounded-3xl p-8 border border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Export Options</h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Download reports in your preferred format</p>
          </div>
          <div className="flex gap-3">
            <button className="h-12 px-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-rose-500">picture_as_pdf</span>
              Export PDF
            </button>
            <button className="h-12 px-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-emerald-500">table_chart</span>
              Export Excel
            </button>
            <button className="h-12 px-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-blue-500">mail</span>
              Schedule Email
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;

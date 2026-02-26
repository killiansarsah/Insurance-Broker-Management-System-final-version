import React, { useState, useMemo } from 'react';
import { ComplianceItem, ComplianceStatus } from '../../types';

// Mock compliance data
const generateMockCompliance = (): ComplianceItem[] => {
  const today = new Date();
  
  return [
    {
      _id: 'COMP-001',
      requirement: 'Q1 2024 Quarterly Return to NIC',
      category: 'NIC Returns',
      dueDate: '2024-04-15',
      status: ComplianceStatus.Compliant,
      lastSubmission: '2024-04-10',
      nextDeadline: '2024-07-15',
      description: 'Quarterly business returns including premium income, claims paid, and commission earned',
      responsible: 'Compliance Officer'
    },
    {
      _id: 'COMP-002',
      requirement: 'Broker License Renewal 2024',
      category: 'License',
      dueDate: '2024-12-31',
      status: ComplianceStatus.Pending,
      lastSubmission: '2023-12-15',
      nextDeadline: '2024-12-31',
      description: 'Annual broker license renewal with NIC including updated business information',
      responsible: 'Managing Director'
    },
    {
      _id: 'COMP-003',
      requirement: 'Professional Indemnity Insurance',
      category: 'Insurance',
      dueDate: '2024-03-31',
      status: ComplianceStatus.Compliant,
      lastSubmission: '2024-03-15',
      nextDeadline: '2025-03-31',
      description: 'Mandatory professional indemnity insurance coverage (minimum GH₵ 500,000)',
      responsible: 'Risk Manager'
    },
    {
      _id: 'COMP-004',
      requirement: 'AML/CFT Training Certification',
      category: 'Training',
      dueDate: '2024-06-30',
      status: ComplianceStatus.Overdue,
      lastSubmission: '2023-06-20',
      nextDeadline: '2024-06-30',
      description: 'Annual anti-money laundering and counter-terrorism financing training for all staff',
      responsible: 'HR Manager'
    },
    {
      _id: 'COMP-005',
      requirement: 'Annual Financial Statements',
      category: 'Financial',
      dueDate: '2024-03-31',
      status: ComplianceStatus.Compliant,
      lastSubmission: '2024-03-25',
      nextDeadline: '2025-03-31',
      description: 'Audited financial statements for the previous fiscal year',
      responsible: 'CFO'
    },
    {
      _id: 'COMP-006',
      requirement: 'Q2 2024 Quarterly Return to NIC',
      category: 'NIC Returns',
      dueDate: '2024-07-15',
      status: ComplianceStatus.Pending,
      nextDeadline: '2024-07-15',
      description: 'Second quarter business returns to National Insurance Commission',
      responsible: 'Compliance Officer'
    },
    {
      _id: 'COMP-007',
      requirement: 'Data Protection Compliance',
      category: 'Training',
      dueDate: '2024-09-30',
      status: ComplianceStatus.Pending,
      nextDeadline: '2024-09-30',
      description: 'GDPR/Data Protection Act compliance training and certification',
      responsible: 'IT Manager'
    }
  ];
};

const Compliance: React.FC = () => {
  const [compliance] = useState<ComplianceItem[]>(generateMockCompliance());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<ComplianceStatus | 'all'>('all');

  const filteredCompliance = useMemo(() => {
    return compliance.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      return true;
    });
  }, [compliance, selectedCategory, selectedStatus]);

  const stats = useMemo(() => {
    const compliant = compliance.filter(c => c.status === ComplianceStatus.Compliant).length;
    const pending = compliance.filter(c => c.status === ComplianceStatus.Pending).length;
    const overdue = compliance.filter(c => c.status === ComplianceStatus.Overdue).length;
    const complianceRate = (compliant / compliance.length) * 100;

    return { compliant, pending, overdue, complianceRate };
  }, [compliance]);

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.Compliant: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case ComplianceStatus.Pending: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case ComplianceStatus.Overdue: return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'NIC Returns': return 'description';
      case 'License': return 'badge';
      case 'Insurance': return 'shield';
      case 'Training': return 'school';
      case 'Financial': return 'account_balance';
      default: return 'task_alt';
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Compliance Dashboard</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Track NIC requirements and regulatory obligations</p>
        </div>
        <button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">add_task</span>
          Add Requirement
        </button>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Compliance Rate</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{stats.complianceRate.toFixed(0)}%</p>
          <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.complianceRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Compliant</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{stats.compliant}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Up to Date</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Pending</p>
          <p className="text-3xl font-black text-blue-500 tracking-tighter">{stats.pending}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action Needed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Overdue</p>
          <p className="text-3xl font-black text-rose-500 tracking-tighter">{stats.overdue}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urgent</p>
        </div>
      </section>

      {/* Alert Panel for Overdue */}
      {stats.overdue > 0 && (
        <section className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-slate-900 dark:to-slate-900 rounded-3xl p-6 border border-rose-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-rose-500 text-3xl">warning</span>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Compliance Alert</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                You have {stats.overdue} overdue compliance requirement{stats.overdue > 1 ? 's' : ''}. Immediate action required to avoid penalties.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', count: compliance.length },
              { value: ComplianceStatus.Compliant, label: 'Compliant', count: stats.compliant },
              { value: ComplianceStatus.Pending, label: 'Pending', count: stats.pending },
              { value: ComplianceStatus.Overdue, label: 'Overdue', count: stats.overdue }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedStatus === filter.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-bold"
          >
            <option value="all">All Categories</option>
            <option value="NIC Returns">NIC Returns</option>
            <option value="License">License</option>
            <option value="Insurance">Insurance</option>
            <option value="Training">Training</option>
            <option value="Financial">Financial</option>
          </select>
        </div>
      </section>

      {/* Compliance Table */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Requirement</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Responsible</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCompliance.map(item => (
                <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer hover-lift">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{item.requirement}</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">{item.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">{getCategoryIcon(item.category)}</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(item.dueDate).toLocaleDateString()}</p>
                    {item.lastSubmission && (
                      <p className="text-xs font-medium text-slate-500">Last: {new Date(item.lastSubmission).toLocaleDateString()}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.responsible}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="size-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      {item.status !== ComplianceStatus.Compliant && (
                        <button className="size-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-600 flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCompliance.length === 0 && (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">task_alt</span>
            <p className="text-lg font-bold text-slate-400">No compliance items found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Compliance;

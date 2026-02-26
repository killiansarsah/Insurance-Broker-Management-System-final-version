/**
 * IBMS Portal - Commission Tracking Page
 * 
 * @fileoverview Commission tracking and management page with Ghana-specific calculations.
 * Monitors commission payments from insurers with NIC levy and WHT deductions.
 * 
 * @description
 * The Commissions page provides:
 * - Commission status tracking (Pending, Received, Overdue)
 * - Aging analysis for overdue commissions (0-30, 31-60, 60+ days)
 * - Ghana-specific deductions (NIC levy 1%, WHT 5%)
 * - Insurer-wise commission filtering
 * - Detailed commission breakdown table
 * - Export functionality for accounting
 * 
 * @remarks
 * **Ghana Insurance Commission Calculations:**
 * 1. Gross Commission = Premium × Commission Rate (8-15%)
 * 2. NIC Levy = Gross Commission × 1% (mandatory regulatory levy)
 * 3. Net Before Tax = Gross Commission - NIC Levy
 * 4. Withholding Tax (WHT) = Net Before Tax × 5%
 * 5. Net Commission = Net Before Tax - WHT
 * 
 * **Example Calculation:**
 * - Premium: GH₵ 10,000
 * - Commission Rate: 10%
 * - Gross Commission: GH₵ 1,000
 * - NIC Levy (1%): -GH₵ 10
 * - Net Before Tax: GH₵ 990
 * - WHT (5%): -GH₵ 49.50
 * - **Net Commission: GH₵ 940.50**
 * 
 * **Aging Buckets:**
 * - 0-30 days: Recent overdue, follow up recommended
 * - 31-60 days: Requires active follow-up
 * - 60+ days: Urgent action needed, escalation required
 * 
 * **Status Definitions:**
 * - Pending: Commission not yet due for payment
 * - Received: Commission successfully paid by insurer
 * - Overdue: Payment past due date, aging counter active
 * 
 * @author IBMS Ghana Development Team
 */

import React, { useState, useMemo } from 'react';
import { Commission, CommissionStatus } from '../../types';

/**
 * Generate mock commission data
 * 
 * @description
 * Creates sample commission records with realistic Ghana insurance data.
 * In production, this would fetch from the backend API.
 * 
 * @returns {Commission[]} Array of commission records
 * 
 * @remarks
 * - Includes major Ghana insurers: GLICO, Enterprise, Hollard, Star, SIC
 * - Commission rates vary from 8-15% based on policy type
 * - Automatically calculates NIC levy (1%) and WHT (5%)
 * - Generates aging data for overdue commissions
 * - Assigns realistic payment statuses
 * 
 * @example
 * const commissions = generateMockCommissions();
 * const totalNet = commissions.reduce((sum, c) => sum + c.netCommission, 0);
 */
const generateMockCommissions = (): Commission[] => {
  const clients = ['Kofi Mensah', 'Ama Asante', 'Kwame Boateng', 'Akua Owusu', 'Yaw Agyeman', 'Abena Osei', 'Kwesi Appiah', 'Efua Darko'];
  const policyTypes = ['Motor - Comprehensive', 'Fire & Property', 'Life Insurance', 'Marine Cargo', 'Health Insurance'];
  const insurers = ['GLICO', 'Enterprise', 'Hollard', 'Star Assurance', 'SIC'];

  return Array.from({ length: 35 }, (_, i) => {
    const grossPremium = Math.floor(Math.random() * 20000) + 5000;
    const commissionRate = 8 + Math.floor(Math.random() * 7); // 8-15%
    const grossCommission = grossPremium * (commissionRate / 100);
    const nicLevy = grossCommission * 0.01; // 1% of gross commission
    const netBeforeTax = grossCommission - nicLevy;
    const withholdingTax = netBeforeTax * 0.05; // 5% WHT
    const netCommission = netBeforeTax - withholdingTax;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 90) + 30);
    
    const aging = Math.floor((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: CommissionStatus;
    if (aging < 0) status = CommissionStatus.Pending;
    else if (aging > 0 && Math.random() > 0.4) status = CommissionStatus.Overdue;
    else status = CommissionStatus.Received;

    const receivedDate = status === CommissionStatus.Received 
      ? new Date(dueDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : undefined;

    return {
      _id: `COM-${String(i + 1).padStart(5, '0')}`,
      policyId: `POL-${String(i + 300).padStart(5, '0')}`,
      policyNumber: `GH-2024-${String(i + 3000).padStart(4, '0')}`,
      clientName: clients[i % clients.length],
      insurer: insurers[i % insurers.length],
      policyType: policyTypes[i % policyTypes.length],
      grossPremium,
      commissionRate,
      grossCommission,
      nicLevy,
      withholdingTax,
      netCommission,
      status,
      dueDate: dueDate.toISOString().split('T')[0],
      receivedDate,
      paymentReference: status === CommissionStatus.Received ? `PAY-${String(i + 1000).padStart(6, '0')}` : undefined,
      aging: status === CommissionStatus.Overdue ? aging : 0
    };
  });
};

const Commissions: React.FC = () => {
  const [commissions] = useState<Commission[]>(generateMockCommissions());
  const [selectedStatus, setSelectedStatus] = useState<CommissionStatus | 'all'>('all');
  const [selectedInsurer, setSelectedInsurer] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommissions = useMemo(() => {
    return commissions.filter(commission => {
      if (selectedStatus !== 'all' && commission.status !== selectedStatus) return false;
      if (selectedInsurer !== 'all' && commission.insurer !== selectedInsurer) return false;
      if (searchTerm && !commission.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !commission.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [commissions, selectedStatus, selectedInsurer, searchTerm]);

  const stats = useMemo(() => {
    const totalCommissions = commissions.reduce((sum, c) => sum + c.netCommission, 0);
    const pending = commissions.filter(c => c.status === CommissionStatus.Pending);
    const received = commissions.filter(c => c.status === CommissionStatus.Received);
    const overdue = commissions.filter(c => c.status === CommissionStatus.Overdue);
    
    const pendingAmount = pending.reduce((sum, c) => sum + c.netCommission, 0);
    const receivedAmount = received.reduce((sum, c) => sum + c.netCommission, 0);
    const overdueAmount = overdue.reduce((sum, c) => sum + c.netCommission, 0);

    // Aging buckets
    const aging0to30 = overdue.filter(c => c.aging <= 30).length;
    const aging31to60 = overdue.filter(c => c.aging > 30 && c.aging <= 60).length;
    const aging60plus = overdue.filter(c => c.aging > 60).length;

    const insurers = Array.from(new Set(commissions.map(c => c.insurer)));

    return {
      totalCommissions,
      pending: pending.length,
      received: received.length,
      overdue: overdue.length,
      pendingAmount,
      receivedAmount,
      overdueAmount,
      aging0to30,
      aging31to60,
      aging60plus,
      insurers
    };
  }, [commissions]);

  const getStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.Pending: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case CommissionStatus.Received: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case CommissionStatus.Overdue: return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400';
    }
  };

  const getAgingColor = (aging: number) => {
    if (aging <= 0) return 'text-slate-500';
    if (aging <= 30) return 'text-amber-500';
    if (aging <= 60) return 'text-orange-500';
    return 'text-rose-500';
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Commission Tracking</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Monitor commission payments from insurers</p>
        </div>
        <div className="flex gap-3">
          <button className="h-12 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Commissions</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">GH₵ {stats.totalCommissions.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net After Deductions</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Pending</p>
          <p className="text-3xl font-black text-blue-500 tracking-tighter">GH₵ {stats.pendingAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">{stats.pending} Policies</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Received</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">GH₵ {stats.receivedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">{stats.received} Paid</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Overdue</p>
          <p className="text-3xl font-black text-rose-500 tracking-tighter">GH₵ {stats.overdueAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-lg">{stats.overdue} Overdue</span>
          </div>
        </div>
      </section>

      {/* Aging Analysis */}
      <section className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 rounded-3xl p-6 border border-rose-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-rose-500 text-2xl">schedule</span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Aging Analysis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4">
            <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <span className="text-xl font-black text-amber-600">{stats.aging0to30}</span>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">0-30 Days</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Recent Overdue</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4">
            <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <span className="text-xl font-black text-orange-600">{stats.aging31to60}</span>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">31-60 Days</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Follow Up Needed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4">
            <div className="size-10 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
              <span className="text-xl font-black text-rose-600">{stats.aging60plus}</span>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">60+ Days</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Urgent Action</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', count: commissions.length },
              { value: CommissionStatus.Pending, label: 'Pending', count: stats.pending },
              { value: CommissionStatus.Received, label: 'Received', count: stats.received },
              { value: CommissionStatus.Overdue, label: 'Overdue', count: stats.overdue }
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

          {/* Insurer Filter */}
          <select
            value={selectedInsurer}
            onChange={(e) => setSelectedInsurer(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-bold"
          >
            <option value="all">All Insurers</option>
            {stats.insurers.map(insurer => (
              <option key={insurer} value={insurer}>{insurer}</option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search by client or policy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-medium"
            />
          </div>
        </div>
      </section>

      {/* Commissions Table */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Policy</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Insurer</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Premium</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Rate</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Comm.</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Comm.</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCommissions.map(commission => (
                <tr key={commission._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer hover-lift">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-primary">{commission.policyNumber}</p>
                    <p className="text-xs font-medium text-slate-500">{commission.policyType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{commission.clientName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{commission.insurer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white">GH₵ {commission.grossPremium.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{commission.commissionRate}%</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white">GH₵ {commission.grossCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs font-medium text-slate-500">
                      -GH₵ {commission.nicLevy.toFixed(0)} NIC | -GH₵ {commission.withholdingTax.toFixed(0)} WHT
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-emerald-600">GH₵ {commission.netCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(commission.dueDate).toLocaleDateString()}</p>
                    {commission.status === CommissionStatus.Overdue && (
                      <p className={`text-xs font-black uppercase ${getAgingColor(commission.aging)}`}>
                        {commission.aging} days overdue
                      </p>
                    )}
                    {commission.receivedDate && (
                      <p className="text-xs font-medium text-emerald-600">
                        Paid: {new Date(commission.receivedDate).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(commission.status)}`}>
                      {commission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCommissions.length === 0 && (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">payments</span>
            <p className="text-lg font-bold text-slate-400">No commissions found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Commissions;

/**
 * IBMS Portal - Renewals Pipeline Page
 * 
 * @fileoverview Renewal pipeline management with 30/60/90-day tracking system.
 * Helps insurance brokers proactively manage policy renewals and prevent lapses.
 * 
 * @description
 * The Renewals page provides:
 * - Pipeline tracking (0-30, 31-60, 61-90 days, Overdue)
 * - Renewal status workflow (Pending → Contacted → Quoted → Renewed/Lost)
 * - Agent assignment and contact tracking
 * - Renewal rate analytics
 * - Premium value at risk calculations
 * 
 * @remarks
 * **Pipeline Buckets:**
 * - **0-30 Days**: Urgent - Immediate action required
 * - **31-60 Days**: Important - Active follow-up needed
 * - **61-90 Days**: Upcoming - Initial contact recommended
 * - **Overdue**: Critical - Recovery efforts required
 * 
 * **Renewal Workflow:**
 * 1. **Pending**: No contact made yet
 * 2. **Contacted**: Client reached, awaiting response
 * 3. **Quoted**: Renewal quote provided to client
 * 4. **Renewed**: Policy successfully renewed
 * 5. **Lost**: Client did not renew (track reason)
 * 
 * **Key Metrics:**
 * - **Total Value at Risk**: Sum of all renewal premiums
 * - **Renewal Rate**: (Renewed / (Renewed + Lost)) × 100
 * - **Contact Attempts**: Number of times agent contacted client
 * - **Days to Expiry**: Countdown to policy expiration
 * 
 * **Best Practices:**
 * - Contact clients 60-90 days before expiry
 * - Follow up at 30 days if no response
 * - Escalate overdue renewals immediately
 * - Track lost reasons for business intelligence
 * 
 * @author IBMS Ghana Development Team
 */

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Renewal, RenewalStatus } from '../../types';

/**
 * Generate mock renewal data
 * 
 * @description
 * Creates sample renewal records with realistic timelines and statuses.
 * In production, this would fetch from the backend API.
 * 
 * @returns {Renewal[]} Array of renewal records
 * 
 * @remarks
 * - Includes Ghana insurers: GLICO, Enterprise, Hollard, Star, SIC
 * - Assigns realistic statuses based on days to expiry
 * - Tracks contact attempts and last contact date
 * - Records lost reasons for analysis
 * 
 * @example
 * const renewals = generateMockRenewals();
 * const urgent = renewals.filter(r => r.daysToExpiry <= 30);
 */
const generateMockRenewals = (): Renewal[] => {
  const clients = ['Kofi Mensah', 'Ama Asante', 'Kwame Boateng', 'Akua Owusu', 'Yaw Agyeman', 'Abena Osei', 'Kwesi Appiah', 'Efua Darko'];
  const policyTypes = ['Motor - Comprehensive', 'Fire & Property', 'Life Insurance', 'Marine Cargo', 'Health Insurance'];
  const insurers = ['GLICO', 'Enterprise', 'Hollard', 'Star Assurance', 'SIC'];
  const agents = ['James Mensah', 'Sarah Osei', 'Michael Addo', 'Grace Adu'];

  return Array.from({ length: 45 }, (_, i) => {
    const daysToExpiry = Math.floor(Math.random() * 120);
    const currentPremium = Math.floor(Math.random() * 5000) + 1000;
    
    let status: RenewalStatus;
    if (daysToExpiry > 90) status = RenewalStatus.Pending;
    else if (daysToExpiry > 60) status = Math.random() > 0.5 ? RenewalStatus.Contacted : RenewalStatus.Pending;
    else if (daysToExpiry > 30) status = Math.random() > 0.3 ? RenewalStatus.Quoted : RenewalStatus.Contacted;
    else if (daysToExpiry > 0) status = Math.random() > 0.5 ? RenewalStatus.Renewed : RenewalStatus.Quoted;
    else status = Math.random() > 0.7 ? RenewalStatus.Renewed : RenewalStatus.Lost;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysToExpiry);

    return {
      _id: `REN-${String(i + 1).padStart(5, '0')}`,
      policyId: `POL-${String(i + 100).padStart(5, '0')}`,
      policyNumber: `GH-2024-${String(i + 1000).padStart(4, '0')}`,
      clientName: clients[i % clients.length],
      policyType: policyTypes[i % policyTypes.length],
      insurer: insurers[i % insurers.length],
      expiryDate: expiryDate.toISOString().split('T')[0],
      daysToExpiry,
      currentPremium,
      proposedPremium: currentPremium * (1 + (Math.random() * 0.2 - 0.05)),
      status,
      contactAttempts: status === RenewalStatus.Pending ? 0 : Math.floor(Math.random() * 3) + 1,
      lastContactDate: status !== RenewalStatus.Pending ? new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      renewalDate: status === RenewalStatus.Renewed ? expiryDate.toISOString().split('T')[0] : undefined,
      lostReason: status === RenewalStatus.Lost ? ['Price too high', 'Switched to competitor', 'No longer needs coverage'][Math.floor(Math.random() * 3)] : undefined,
      notes: '',
      assignedAgent: agents[i % agents.length]
    };
  });
};

const Renewals: React.FC = () => {
  const navigate = useNavigate();
  const [renewals] = useState<Renewal[]>(generateMockRenewals());
  const [selectedPipeline, setSelectedPipeline] = useState<'30' | '60' | '90' | 'overdue' | 'all'>('30');
  const [selectedStatus, setSelectedStatus] = useState<RenewalStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRenewals = useMemo(() => {
    return renewals.filter(renewal => {
      // Pipeline filter
      if (selectedPipeline === '30' && renewal.daysToExpiry > 30) return false;
      if (selectedPipeline === '60' && (renewal.daysToExpiry > 60 || renewal.daysToExpiry <= 30)) return false;
      if (selectedPipeline === '90' && (renewal.daysToExpiry > 90 || renewal.daysToExpiry <= 60)) return false;
      if (selectedPipeline === 'overdue' && renewal.daysToExpiry >= 0) return false;

      // Status filter
      if (selectedStatus !== 'all' && renewal.status !== selectedStatus) return false;

      // Search filter
      if (searchTerm && !renewal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !renewal.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      return true;
    });
  }, [renewals, selectedPipeline, selectedStatus, searchTerm]);

  const stats = useMemo(() => {
    const next30 = renewals.filter(r => r.daysToExpiry >= 0 && r.daysToExpiry <= 30);
    const next60 = renewals.filter(r => r.daysToExpiry > 30 && r.daysToExpiry <= 60);
    const next90 = renewals.filter(r => r.daysToExpiry > 60 && r.daysToExpiry <= 90);
    const overdue = renewals.filter(r => r.daysToExpiry < 0);
    const renewed = renewals.filter(r => r.status === RenewalStatus.Renewed);
    const lost = renewals.filter(r => r.status === RenewalStatus.Lost);
    
    const totalValue = renewals.reduce((sum, r) => sum + r.currentPremium, 0);
    const renewalRate = renewals.length > 0 ? (renewed.length / (renewed.length + lost.length)) * 100 : 0;

    return { next30, next60, next90, overdue, renewed, lost, totalValue, renewalRate };
  }, [renewals]);

  const getStatusColor = (status: RenewalStatus) => {
    switch (status) {
      case RenewalStatus.Pending: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case RenewalStatus.Contacted: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case RenewalStatus.Quoted: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case RenewalStatus.Renewed: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case RenewalStatus.Lost: return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days < 0) return 'text-rose-500';
    if (days <= 7) return 'text-rose-500';
    if (days <= 30) return 'text-amber-500';
    return 'text-slate-500';
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Renewals Pipeline</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Track and manage policy renewals</p>
        </div>
        <Link to="/policies/create" className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          New Policy
        </Link>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Value at Risk</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">GH₵ {stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Renewals</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Renewal Rate</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{stats.renewalRate.toFixed(1)}%</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">{stats.renewed.length} Renewed</span>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-lg">{stats.lost.length} Lost</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Urgent (30 Days)</p>
          <p className="text-3xl font-black text-rose-500 tracking-tighter">{stats.next30.length}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Immediate Action</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Overdue</p>
          <p className="text-3xl font-black text-rose-600 tracking-tighter">{stats.overdue.length}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recovery Needed</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Pipeline Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', count: renewals.length },
              { value: '30', label: '0-30 Days', count: stats.next30.length },
              { value: '60', label: '31-60 Days', count: stats.next60.length },
              { value: '90', label: '61-90 Days', count: stats.next90.length },
              { value: 'overdue', label: 'Overdue', count: stats.overdue.length }
            ].map(pipeline => (
              <button
                key={pipeline.value}
                onClick={() => setSelectedPipeline(pipeline.value as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedPipeline === pipeline.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pipeline.label} ({pipeline.count})
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-bold"
          >
            <option value="all">All Status</option>
            {Object.values(RenewalStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search by client or policy number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-medium"
            />
          </div>
        </div>
      </section>

      {/* Renewals Table */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Policy</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Insurer</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Expiry</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Premium</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRenewals.map(renewal => (
                <tr 
                  key={renewal._id} 
                  onClick={() => navigate(`/renewals/view/${renewal._id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group hover-lift"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{renewal.clientName}</p>
                      <p className="text-xs font-medium text-slate-500">{renewal.policyNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{renewal.policyType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{renewal.insurer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(renewal.expiryDate).toLocaleDateString()}</p>
                      <p className={`text-xs font-black uppercase ${getUrgencyColor(renewal.daysToExpiry)}`}>
                        {renewal.daysToExpiry < 0 ? `${Math.abs(renewal.daysToExpiry)} days overdue` : `${renewal.daysToExpiry} days left`}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white">GH₵ {renewal.currentPremium.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(renewal.status)}`}>
                      {renewal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{renewal.assignedAgent}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/renewals/view/${renewal._id}`);
                        }}
                        className="size-8 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/renewals/edit/${renewal._id}`);
                        }}
                        className="size-8 rounded-lg bg-slate-100 hover:bg-slate-600 dark:bg-slate-800 text-slate-600 hover:text-white flex items-center justify-center transition-all"
                        title="Edit Record"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Initiating contact with ${renewal.clientName}...`);
                        }}
                        className="size-8 rounded-lg bg-emerald-50 hover:bg-emerald-500 dark:bg-emerald-900/20 text-emerald-600 hover:text-white flex items-center justify-center transition-all"
                        title="Call Client"
                      >
                        <span className="material-symbols-outlined text-lg">phone</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRenewals.length === 0 && (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">event_busy</span>
            <p className="text-lg font-bold text-slate-400">No renewals found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Renewals;

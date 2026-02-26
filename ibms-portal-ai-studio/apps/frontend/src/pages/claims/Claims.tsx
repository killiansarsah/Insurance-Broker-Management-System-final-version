import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Claim, ClaimStatus } from '../../types';

// Mock claims data
const generateMockClaims = (): Claim[] => {
  const clients = ['Kofi Mensah', 'Ama Asante', 'Kwame Boateng', 'Akua Owusu', 'Yaw Agyeman', 'Abena Osei'];
  const policyTypes = ['Motor - Comprehensive', 'Fire & Property', 'Life Insurance', 'Marine Cargo', 'Health Insurance'];
  const insurers = ['GLICO', 'Enterprise', 'Hollard', 'Star Assurance', 'SIC'];
  const claimTypes = ['Accident', 'Theft', 'Fire Damage', 'Water Damage', 'Medical', 'Death Benefit'];
  const adjusters = ['John Adjei', 'Mary Osei', 'Peter Mensah', 'Grace Adu'];

  return Array.from({ length: 25 }, (_, i) => {
    const daysOpen = Math.floor(Math.random() * 60);
    const reportedDate = new Date();
    reportedDate.setDate(reportedDate.getDate() - daysOpen);
    
    const incidentDate = new Date(reportedDate);
    incidentDate.setDate(incidentDate.getDate() - Math.floor(Math.random() * 7));

    let status: ClaimStatus;
    if (daysOpen < 5) status = ClaimStatus.Reported;
    else if (daysOpen < 15) status = ClaimStatus.Investigating;
    else if (daysOpen < 25) status = ClaimStatus.Documented;
    else if (daysOpen < 40) status = Math.random() > 0.3 ? ClaimStatus.Approved : ClaimStatus.Documented;
    else status = Math.random() > 0.2 ? ClaimStatus.Settled : ClaimStatus.Rejected;

    const claimAmount = Math.floor(Math.random() * 50000) + 5000;
    const approvedAmount = status === ClaimStatus.Approved || status === ClaimStatus.Settled 
      ? claimAmount * (0.8 + Math.random() * 0.2) 
      : undefined;

    return {
      _id: `CLM-${String(i + 1).padStart(5, '0')}`,
      claimNumber: `GH-CLM-2024-${String(i + 1000).padStart(4, '0')}`,
      policyId: `POL-${String(i + 200).padStart(5, '0')}`,
      policyNumber: `GH-2024-${String(i + 2000).padStart(4, '0')}`,
      clientName: clients[i % clients.length],
      policyType: policyTypes[i % policyTypes.length],
      insurer: insurers[i % insurers.length],
      incidentDate: incidentDate.toISOString().split('T')[0],
      reportedDate: reportedDate.toISOString().split('T')[0],
      claimType: claimTypes[i % claimTypes.length],
      claimAmount,
      approvedAmount,
      status,
      adjusterName: status !== ClaimStatus.Reported ? adjusters[i % adjusters.length] : undefined,
      documents: [],
      timeline: [
        { date: reportedDate.toISOString().split('T')[0], event: 'Claim Reported', description: 'Initial claim submission', user: 'System' }
      ],
      settlementDate: status === ClaimStatus.Settled ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      notes: '',
      daysOpen
    };
  });
};

const Claims: React.FC = () => {
  const navigate = useNavigate();
  const [claims] = useState<Claim[]>(generateMockClaims());
  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      if (selectedStatus !== 'all' && claim.status !== selectedStatus) return false;
      if (searchTerm && !claim.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [claims, selectedStatus, searchTerm]);

  const stats = useMemo(() => {
    const totalClaims = claims.length;
    const reported = claims.filter(c => c.status === ClaimStatus.Reported).length;
    const investigating = claims.filter(c => c.status === ClaimStatus.Investigating).length;
    const approved = claims.filter(c => c.status === ClaimStatus.Approved).length;
    const settled = claims.filter(c => c.status === ClaimStatus.Settled).length;
    const rejected = claims.filter(c => c.status === ClaimStatus.Rejected).length;
    
    const totalClaimAmount = claims.reduce((sum, c) => sum + c.claimAmount, 0);
    const totalApprovedAmount = claims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
    
    const avgProcessingTime = claims.filter(c => c.status === ClaimStatus.Settled)
      .reduce((sum, c) => sum + c.daysOpen, 0) / settled || 0;

    // Loss Ratio Calculation (simplified - claims vs premiums)
    const estimatedPremiums = 2500000; // Mock total premiums
    const lossRatio = (totalClaimAmount / estimatedPremiums) * 100;
    const lossRatioStatus = lossRatio < 40 ? 'healthy' : lossRatio < 60 ? 'warning' : 'critical';

    return { 
      totalClaims, reported, investigating, approved, settled, rejected,
      totalClaimAmount, totalApprovedAmount, avgProcessingTime,
      lossRatio, lossRatioStatus
    };
  }, [claims]);

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.Reported: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case ClaimStatus.Investigating: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case ClaimStatus.Documented: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case ClaimStatus.Approved: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case ClaimStatus.Settled: return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case ClaimStatus.Rejected: return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400';
      case ClaimStatus.Disputed: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
    }
  };

  const getLossRatioColor = () => {
    if (stats.lossRatioStatus === 'healthy') return 'text-emerald-500';
    if (stats.lossRatioStatus === 'warning') return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Claims Management</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Track and process insurance claims</p>
        </div>
        <Link to="/claims/create" className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
          <span className="material-symbols-outlined">add_alert</span>
          Register Claim
        </Link>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Claims</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalClaims}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">{stats.investigating} Investigating</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Claim Value</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">GH₵ {(stats.totalClaimAmount / 1000).toFixed(0)}K</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Claimed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Avg Processing</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{stats.avgProcessingTime.toFixed(1)} Days</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">{stats.settled} Settled</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Loss Ratio</p>
          <p className={`text-3xl font-black tracking-tighter ${getLossRatioColor()}`}>{stats.lossRatio.toFixed(1)}%</p>
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              stats.lossRatioStatus === 'healthy' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' :
              stats.lossRatioStatus === 'warning' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' :
              'text-rose-500 bg-rose-50 dark:bg-rose-900/20'
            }`}>
              {stats.lossRatioStatus === 'healthy' ? '✓ Healthy' : stats.lossRatioStatus === 'warning' ? '⚠ Warning' : '✗ Critical'}
            </span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', count: stats.totalClaims },
              { value: ClaimStatus.Reported, label: 'Reported', count: stats.reported },
              { value: ClaimStatus.Investigating, label: 'Investigating', count: stats.investigating },
              { value: ClaimStatus.Approved, label: 'Approved', count: stats.approved },
              { value: ClaimStatus.Settled, label: 'Settled', count: stats.settled }
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

          {/* Search */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search by client or claim number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-medium"
            />
          </div>
        </div>
      </section>

      {/* Claims Table */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Claim #</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Insurer</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Days Open</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredClaims.map(claim => (
                <tr 
                  key={claim._id} 
                  onClick={() => navigate(`/claims/view/${claim._id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group hover-lift"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-black text-primary">{claim.claimNumber}</p>
                      <p className="text-xs font-medium text-slate-500">{claim.policyNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{claim.clientName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{claim.claimType}</p>
                    <p className="text-xs font-medium text-slate-500">{claim.policyType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{claim.insurer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white">GH₵ {claim.claimAmount.toLocaleString()}</p>
                    {claim.approvedAmount && (
                      <p className="text-xs font-medium text-emerald-600">Approved: GH₵ {claim.approvedAmount.toLocaleString()}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-black ${claim.daysOpen > 30 ? 'text-rose-500' : claim.daysOpen > 14 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                      {claim.daysOpen} days
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/claims/view/${claim._id}`);
                        }}
                        className="size-8 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/claims/edit/${claim._id}`);
                        }}
                        className="size-8 rounded-lg bg-amber-50 hover:bg-amber-500 dark:bg-amber-900/20 text-amber-600 hover:text-white flex items-center justify-center transition-all"
                        title="Edit Claim"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      {claim.status === ClaimStatus.Documented && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`Approving claim ${claim.claimNumber}...`);
                          }}
                          className="size-8 rounded-lg bg-emerald-50 hover:bg-emerald-500 dark:bg-emerald-900/20 text-emerald-600 hover:text-white flex items-center justify-center transition-all"
                          title="Approve Claim"
                        >
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

        {filteredClaims.length === 0 && (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">description</span>
            <p className="text-lg font-bold text-slate-400">No claims found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Claims;

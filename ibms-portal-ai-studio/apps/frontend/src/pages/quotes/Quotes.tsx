
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote, QuoteStatus, QuoteSource } from '../../types';

const Quotes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [quotes] = useState<Quote[]>([
    { 
      _id: '1', 
      name: 'John Mensah', 
      source: QuoteSource.Referral, 
      phone: '+233 24 123 4567', 
      email: 'john.mensah@email.com',
      protectionType: 'Motor - Comprehensive', 
      status: QuoteStatus.Quoted,
      premiumAmount: 8400,
      dateCreated: '2024-10-25',
      followUpDate: '2024-11-05',
      assignedAgent: 'Sarah Adeyemi',
      createdBy: 'user1'
    },
    { 
      _id: '2', 
      name: 'Dangote Ghana Ltd', 
      source: QuoteSource.Website, 
      phone: '+233 30 276 1234', 
      email: 'info@dangote.com.gh',
      protectionType: 'Fire - Commercial Property', 
      status: QuoteStatus.Won,
      premiumAmount: 42000,
      dateCreated: '2024-10-22',
      assignedAgent: 'David Musa',
      createdBy: 'user1'
    },
    { 
      _id: '3', 
      name: 'Sarah Adjoa', 
      source: QuoteSource.PhoneCall, 
      phone: '+233 55 987 6543', 
      email: 'sarah.adjoa@gmail.com',
      protectionType: 'Motor - Third Party', 
      status: QuoteStatus.New,
      premiumAmount: 12500,
      dateCreated: '2024-10-20',
      followUpDate: '2024-10-27',
      assignedAgent: 'John Okafor',
      createdBy: 'user1'
    },
    { 
      _id: '4', 
      name: 'EAP Logistics', 
      source: QuoteSource.Email, 
      phone: '+233 24 555 7890', 
      email: 'ops@eaplogistics.com',
      protectionType: 'Marine Cargo', 
      status: QuoteStatus.FollowUp,
      premiumAmount: 18900,
      dateCreated: '2024-10-15',
      followUpDate: '2024-10-30',
      assignedAgent: 'Grace Nwosu',
      createdBy: 'user1'
    },
    { 
      _id: '5', 
      name: 'Kwame Antwi', 
      source: QuoteSource.SocialMedia, 
      phone: '+233 20 111 2233', 
      email: 'kwame.antwi@yahoo.com',
      protectionType: 'Life Insurance', 
      status: QuoteStatus.Lost,
      premiumAmount: 25000,
      dateCreated: '2024-09-10',
      assignedAgent: 'Sarah Adeyemi',
      createdBy: 'user1'
    },
  ]);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || quote.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: quotes.length,
    new: quotes.filter(q => q.status === QuoteStatus.New).length,
    contacted: quotes.filter(q => q.status === QuoteStatus.Contacted).length,
    won: quotes.filter(q => q.status === QuoteStatus.Won).length,
    totalValue: quotes.reduce((sum, q) => sum + (q.premiumAmount || 0), 0)
  };

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.New: return 'bg-blue-50 text-blue-600';
      case QuoteStatus.Contacted: return 'bg-purple-50 text-purple-600';
      case QuoteStatus.Quoted: return 'bg-amber-50 text-amber-600';
      case QuoteStatus.FollowUp: return 'bg-orange-50 text-orange-600';
      case QuoteStatus.Won: return 'bg-emerald-500 text-white shadow-sm';
      case QuoteStatus.Lost: return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case QuoteSource.Website: return 'language';
      case QuoteSource.Referral: return 'person_add';
      case QuoteSource.SocialMedia: return 'share';
      case QuoteSource.PhoneCall: return 'call';
      case QuoteSource.WalkIn: return 'store';
      case QuoteSource.Email: return 'mail';
      case QuoteSource.Advertisement: return 'campaign';
      default: return 'help';
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Quotes & Leads</h1>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Manage insurance quotes and track leads</p>
        </div>
        <button 
          onClick={() => navigate('/quotes/create')}
          className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white text-[10px] font-black shadow-lg shadow-primary/20 transition-all uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-lg">add_task</span>
          New Quote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Quotes', count: stats.total.toString(), icon: 'description', color: 'blue' },
          { label: 'New Leads', count: stats.new.toString(), icon: 'person_add', color: 'emerald' },
          { label: 'Total Value', count: `GH₵ ${(stats.totalValue / 1000).toFixed(1)}K`, icon: 'analytics', color: 'purple' },
          { label: 'Conversion Rate', count: `${Math.round((stats.won / stats.total) * 100)}%`, icon: 'trending_up', color: 'amber' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`size-10 rounded-xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600 dark:bg-${s.color}-900/20 dark:text-${s.color}-400`}>
              <span className="material-symbols-outlined text-2xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white uppercase">{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              className="h-9 w-full pl-9 pr-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold" 
              placeholder="Search by name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-800"
            >
              <option value="all">All Status</option>
              <option value={QuoteStatus.New}>New</option>
              <option value={QuoteStatus.Contacted}>Contacted</option>
              <option value={QuoteStatus.Quoted}>Quoted</option>
              <option value={QuoteStatus.FollowUp}>Follow-up</option>
              <option value={QuoteStatus.Won}>Won</option>
              <option value={QuoteStatus.Lost}>Lost</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30">
                <th className="py-4 px-8">Name</th>
                <th className="py-4 px-8">Source</th>
                <th className="py-4 px-8">Phone</th>
                <th className="py-4 px-8">Protection Type</th>
                <th className="py-4 px-8">Date</th>
                <th className="py-4 px-8 text-right">Premium</th>
                <th className="py-4 px-8">Status</th>
                <th className="py-4 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredQuotes.map((q) => (
                <tr 
                  key={q._id} 
                  onClick={() => navigate(`/quotes/view/${q._id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer hover-lift"
                >
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{q.name}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{q.email}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">{getSourceIcon(q.source)}</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{q.source}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-xs font-bold text-slate-600 dark:text-slate-400">{q.phone}</td>
                  <td className="py-6 px-8">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{q.protectionType}</span>
                  </td>
                  <td className="py-6 px-8 text-xs font-bold text-slate-600 dark:text-slate-400">
                    {new Date(q.dateCreated).toLocaleDateString()}
                  </td>
                  <td className="py-6 px-8 text-xs font-black text-slate-900 dark:text-white text-right">
                    {q.premiumAmount ? `GH₵ ${q.premiumAmount.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-6 px-8">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(q.status)}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/quotes/view/${q._id}`); }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="View Quote"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/quotes/edit/${q._id}`); }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Edit Quote"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${q.email}?subject=Quote Inquiry - ${q.name}`; }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Send Email"
                      >
                        <span className="material-symbols-outlined text-sm">mail</span>
                      </button>
                    </div>
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

export default Quotes;

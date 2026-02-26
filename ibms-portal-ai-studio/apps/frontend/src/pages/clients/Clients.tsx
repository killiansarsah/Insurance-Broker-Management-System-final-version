import React, { useState, useMemo } from 'react';
import { ClientSegment } from '../../types';

interface ClientEntry {
  id: string;
  name: string;
  location: string;
  email: string;
  phone: string;
  totalPremium: number;
  outstanding: number;
  activePolicies: number;
  nextRenewal: string;
  logo: string;
  industry: string;
  segment: ClientSegment;
  lifetimeValue: number;
  retentionRate: number;
  lastContactDate: string;
  joinedDate: string;
}

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<ClientSegment | 'all'>('all');
  const [selectedClient, setSelectedClient] = useState<ClientEntry | null>(null);
  const [activeTab, setActiveTab] = useState('Policies');

  // Enhanced client data with segmentation
  const clientsData: ClientEntry[] = [
    { 
      id: 'CL-8821', 
      name: 'Acme Logistics Ltd', 
      location: 'Lagos, Nigeria', 
      phone: '+234 800 123 4567', 
      email: 'contact@acme.com', 
      totalPremium: 1245000,
      outstanding: 45000,
      activePolicies: 5, 
      nextRenewal: 'Oct 14, 2024',
      industry: 'Transport',
      logo: '',
      segment: ClientSegment.Gold,
      lifetimeValue: 3500000,
      retentionRate: 95,
      lastContactDate: '2024-01-02',
      joinedDate: '2021-03-15'
    },
    { 
      id: 'CL-9022', 
      name: 'Dangote Industries', 
      location: 'Victoria Island, Nigeria', 
      phone: '+234 1 271 2810', 
      email: 'info@dangote.com', 
      totalPremium: 8520000,
      outstanding: 210000,
      activePolicies: 12, 
      nextRenewal: 'Nov 05, 2024',
      industry: 'Manufacturing',
      logo: '',
      segment: ClientSegment.Platinum,
      lifetimeValue: 25000000,
      retentionRate: 100,
      lastContactDate: '2024-01-03',
      joinedDate: '2019-01-10'
    },
    { 
      id: 'CL-4410', 
      name: 'Sarah Okonjo', 
      location: 'Accra, Ghana', 
      phone: '+233 55 123 4567', 
      email: 's.okonjo@gmail.com', 
      totalPremium: 42000,
      outstanding: 0,
      activePolicies: 2, 
      nextRenewal: 'Dec 12, 2024',
      industry: 'Individual',
      logo: '',
      segment: ClientSegment.Bronze,
      lifetimeValue: 120000,
      retentionRate: 88,
      lastContactDate: '2023-12-28',
      joinedDate: '2022-06-20'
    },
    { 
      id: 'CL-7731', 
      name: 'Global Motors West Africa', 
      location: 'Tema Harbor Road, Ghana', 
      phone: '+233 30 222 9988', 
      email: 'fleet@globalmotors.com', 
      totalPremium: 280000,
      outstanding: 12000,
      activePolicies: 8, 
      nextRenewal: 'Jan 20, 2025',
      industry: 'Automotive',
      logo: '',
      segment: ClientSegment.Silver,
      lifetimeValue: 850000,
      retentionRate: 92,
      lastContactDate: '2024-01-01',
      joinedDate: '2020-08-05'
    },
    { 
      id: 'CL-5512', 
      name: 'Kwame Trading Co', 
      location: 'Kumasi, Ghana', 
      phone: '+233 24 555 6677', 
      email: 'info@kwametrading.com', 
      totalPremium: 650000,
      outstanding: 0,
      activePolicies: 6, 
      nextRenewal: 'Feb 15, 2025',
      industry: 'Retail',
      logo: '',
      segment: ClientSegment.Gold,
      lifetimeValue: 1800000,
      retentionRate: 96,
      lastContactDate: '2024-01-04',
      joinedDate: '2020-11-12'
    },
    { 
      id: 'CL-3301', 
      name: 'Ama Beauty Salon', 
      location: 'Accra, Ghana', 
      phone: '+233 20 111 2233', 
      email: 'ama@beautygh.com', 
      totalPremium: 28000,
      outstanding: 0,
      activePolicies: 1, 
      nextRenewal: 'Mar 10, 2025',
      industry: 'Services',
      logo: '',
      segment: ClientSegment.Bronze,
      lifetimeValue: 75000,
      retentionRate: 85,
      lastContactDate: '2023-12-20',
      joinedDate: '2023-03-10'
    }
  ];

  const filteredClients = useMemo(() => {
    return clientsData.filter(client => {
      if (selectedSegment !== 'all' && client.segment !== selectedSegment) return false;
      if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !client.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [searchTerm, selectedSegment]);

  const stats = useMemo(() => {
    const totalPremium = clientsData.reduce((sum, c) => sum + c.totalPremium, 0);
    const totalLTV = clientsData.reduce((sum, c) => sum + c.lifetimeValue, 0);
    const avgRetention = clientsData.reduce((sum, c) => sum + c.retentionRate, 0) / clientsData.length;
    
    const bronze = clientsData.filter(c => c.segment === ClientSegment.Bronze).length;
    const silver = clientsData.filter(c => c.segment === ClientSegment.Silver).length;
    const gold = clientsData.filter(c => c.segment === ClientSegment.Gold).length;
    const platinum = clientsData.filter(c => c.segment === ClientSegment.Platinum).length;

    return { totalPremium, totalLTV, avgRetention, bronze, silver, gold, platinum };
  }, []);

  const getSegmentColor = (segment: ClientSegment) => {
    switch (segment) {
      case ClientSegment.Bronze: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200';
      case ClientSegment.Silver: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
      case ClientSegment.Gold: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200';
      case ClientSegment.Platinum: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200';
    }
  };

  const getSegmentIcon = (segment: ClientSegment) => {
    switch (segment) {
      case ClientSegment.Bronze: return '🥉';
      case ClientSegment.Silver: return '🥈';
      case ClientSegment.Gold: return '🥇';
      case ClientSegment.Platinum: return '💎';
    }
  };

  if (selectedClient) {
    return (
      <div className="flex flex-col gap-8 pb-12 animate-fadeIn">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedClient(null)}
            className="size-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all text-slate-500 shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back to Client Directory</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
            <div className="flex gap-6 items-center">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl size-24 md:size-32 shadow-inner flex items-center justify-center p-4 border border-slate-100 dark:border-slate-700">
                {selectedClient.logo ? (
                  <img src={selectedClient.logo} className="size-full object-contain" alt="Logo" />
                ) : (
                  <div className="size-full bg-primary/10 text-primary flex items-center justify-center font-black text-2xl rounded-xl">
                    {selectedClient.name.substring(0,2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{selectedClient.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${getSegmentColor(selectedClient.segment)}`}>
                    {getSegmentIcon(selectedClient.segment)} {selectedClient.segment}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm font-black uppercase tracking-widest">
                  <span>ID: {selectedClient.id}</span>
                  <span className="hidden sm:inline text-slate-200">|</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">location_on</span> {selectedClient.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-primary text-xs font-black uppercase tracking-widest mt-2">
                  <a className="hover:underline flex items-center gap-2" href={`mailto:${selectedClient.email}`}>
                    <span className="material-symbols-outlined text-base">mail</span> {selectedClient.email}
                  </a>
                  <a className="hover:underline flex items-center gap-2" href={`tel:${selectedClient.phone}`}>
                    <span className="material-symbols-outlined text-base">call</span> {selectedClient.phone}
                  </a>
                </div>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-widest shadow-lg transition-all">
              <span className="material-symbols-outlined text-lg">edit</span>
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Lifetime Value', value: `GH₵ ${(selectedClient.lifetimeValue / 1000).toFixed(0)}K`, icon: 'trending_up', color: 'emerald' },
            { label: 'Total Premium Paid', value: `GH₵ ${(selectedClient.totalPremium / 1000).toFixed(0)}K`, icon: 'payments', color: 'blue' },
            { label: 'Retention Rate', value: `${selectedClient.retentionRate}%`, icon: 'verified_user', color: 'purple' },
            { label: 'Active Policies', value: selectedClient.activePolicies.toString(), icon: 'description', color: 'amber' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`size-10 rounded-xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600 dark:bg-${s.color}-900/20 dark:text-${s.color}-400`}>
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
              </div>
              <p className="text-slate-900 dark:text-white text-2xl font-black uppercase tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col min-h-[500px] overflow-hidden">
          <div className="border-b border-slate-100 dark:border-slate-800 px-8 bg-slate-50/50">
            <div className="flex gap-10 overflow-x-auto no-scrollbar">
              {['Policies', 'Claims History', 'Communications', 'Documents'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`py-6 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="p-8">
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-slate-200 text-6xl mb-4">folder_open</span>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Viewing {activeTab} for {selectedClient.name}</p>
                <p className="text-slate-400 text-sm mt-2">Client 360° view - Full history and portfolio</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Client Portfolio</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Manage your client relationships and lifetime value</p>
        </div>
        <button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">person_add</span>
          New Client
        </button>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Lifetime Value</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">GH₵ {(stats.totalLTV / 1000000).toFixed(1)}M</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Clients</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Active Clients</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{clientsData.length}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">{stats.avgRetention.toFixed(1)}% Retention</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Annual Premium</p>
          <p className="text-3xl font-black text-blue-500 tracking-tighter">GH₵ {(stats.totalPremium / 1000000).toFixed(1)}M</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Year</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Premium Clients</p>
          <p className="text-3xl font-black text-purple-500 tracking-tighter">{stats.platinum + stats.gold}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1 rounded-lg">💎 {stats.platinum} Platinum</span>
          </div>
        </div>
      </section>

      {/* Segmentation Overview */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-900 rounded-3xl p-6 border border-purple-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-purple-500 text-2xl">workspace_premium</span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Client Segmentation</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { segment: ClientSegment.Platinum, count: stats.platinum, icon: '💎', color: 'purple' },
            { segment: ClientSegment.Gold, count: stats.gold, icon: '🥇', color: 'amber' },
            { segment: ClientSegment.Silver, count: stats.silver, icon: '🥈', color: 'slate' },
            { segment: ClientSegment.Bronze, count: stats.bronze, icon: '🥉', color: 'orange' }
          ].map((tier) => (
            <div key={tier.segment} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4">
              <div className={`size-10 rounded-full bg-${tier.color}-100 dark:bg-${tier.color}-900/20 flex items-center justify-center text-xl`}>
                {tier.icon}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{tier.segment}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{tier.count} Clients</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Segment Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All Clients', count: clientsData.length },
              { value: ClientSegment.Platinum, label: '💎 Platinum', count: stats.platinum },
              { value: ClientSegment.Gold, label: '🥇 Gold', count: stats.gold },
              { value: ClientSegment.Silver, label: '🥈 Silver', count: stats.silver },
              { value: ClientSegment.Bronze, label: '🥉 Bronze', count: stats.bronze }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setSelectedSegment(filter.value as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedSegment === filter.value
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
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-medium"
            />
          </div>
        </div>
      </section>

      {/* Client Cards */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
          {filteredClients.map((client) => (
            <div 
              key={client.id} 
              onClick={() => setSelectedClient(client)}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col gap-6 hover-lift"
            >
              <div className="flex items-start justify-between">
                <div className="size-16 rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                  {client.logo ? (
                    <img src={client.logo} alt="" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-xl font-black text-primary uppercase">{client.name.substring(0,2)}</span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSegmentColor(client.segment)}`}>
                  {getSegmentIcon(client.segment)} {client.segment}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                  {client.name}
                </h3>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    <span className="text-xs font-bold truncate uppercase">{client.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-lg">trending_up</span>
                    <span className="text-xs font-bold">LTV: GH₵ {(client.lifetimeValue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Policies</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{client.activePolicies} Coverages</span>
                 </div>
                 <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-fadeIn">
          <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-slate-300">person_search</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Clients Found</h3>
          <p className="text-slate-500 font-medium max-w-sm mt-2">
            No clients match your current filters. Try adjusting your search or segment selection.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedSegment('all'); }}
            className="mt-8 px-6 py-2 rounded-xl border border-primary text-primary font-black uppercase text-[10px] tracking-[0.2em] hover:bg-primary/5 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Clients;

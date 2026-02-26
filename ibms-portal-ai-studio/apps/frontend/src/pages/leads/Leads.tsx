
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiget, deleteManyApi } from '../../services/api';
import Iconify from '../../components/ui/Iconify';
import DeleteModal from '../../components/ui/DeleteModal';
import AddLead from './AddLead';
import EditLead from './EditLead';
import LeadKanban from './LeadKanban';
import { Lead, LeadStatus } from '../../types';

const Leads: React.FC = () => {
  const [leadData, setLeadData] = useState<Lead[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editId, setEditId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEditId(id);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const fetchData = async () => {
    try {
      const result = await apiget('lead/list');
      if (result && result.status === 200) {
        setLeadData(result?.data?.result || []);
      } else {
        setLeadData([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeadData([]);
    }
  };

  const deleteManyLeads = async () => {
    try {
      const result = await deleteManyApi('lead/deletemany', selectedRowIds);
      if (result && result.status === 200) {
        toast.success(result.data.message);
        setSelectedRowIds([]);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
      toast.error('Failed to delete leads');
    }
    handleCloseDelete();
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const { apiput } = await import('../../services/api');
      await apiput(`lead/edit/${leadId}`, { leadStatus: newStatus });
      fetchData();
      toast.success('Lead status updated');
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update lead status');
    }
  };

  useEffect(() => {
    fetchData();
  }, [openAdd]);

  const filteredLeads = leadData.filter(lead => 
    `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phoneNumber.includes(searchTerm)
  );

  const stats = [
    { label: 'Total Leads', value: leadData.length, icon: 'hugeicons:user-group', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Qualified', value: leadData.filter(l => l.leadStatus === LeadStatus.Qualified).length, icon: 'hugeicons:checkmark-badge-01', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'In Progress', value: leadData.filter(l => l.leadStatus === LeadStatus.InProgress).length, icon: 'hugeicons:loading-03', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Contacted', value: leadData.filter(l => l.leadStatus === LeadStatus.Contacted).length, icon: 'hugeicons:agreement-01', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case LeadStatus.New: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case LeadStatus.Contacted: return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case LeadStatus.Qualified: return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case LeadStatus.InProgress: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case LeadStatus.ClosedWon: return 'bg-emerald-600 text-white border-emerald-600';
      case LeadStatus.ClosedLost: return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <AddLead open={openAdd} onClose={handleCloseAdd} onSuccess={fetchData} />
      <EditLead open={openEdit} onClose={handleCloseEdit} leadId={editId} onSuccess={fetchData} />
      <DeleteModal
        open={openDelete}
        onClose={handleCloseDelete}
        onDelete={deleteManyLeads}
        itemCount={selectedRowIds.length}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Lead Pipeline</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-1">Managing {leadData.length} insurance leads</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-slate-900 rounded-2xl p-1 border border-slate-200 dark:border-slate-800 shadow-sm">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <Iconify icon="hugeicons:list-view" className="text-lg" />
              List
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'board' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <Iconify icon="hugeicons:kanban-02" className="text-lg" />
              Board
            </button>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="h-12 px-6 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Iconify icon="hugeicons:plus-01" className="text-lg" />
            New Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">
            <div className="flex items-center justify-between">
              <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <Iconify icon={stat.icon} className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{stat.value}</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${stat.color.replace('text', 'bg')} opacity-60`} 
                style={{ width: `${(stat.value / (leadData.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'list' ? (
        <div className="flex flex-col gap-6">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Iconify icon="hugeicons:search-02" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              <input 
                type="text" 
                placeholder="Search leads by name, email or phone..." 
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {selectedRowIds.length > 0 && (
              <button 
                onClick={handleOpenDelete}
                className="h-12 px-6 rounded-2xl bg-rose-500/10 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
              >
                <Iconify icon="hugeicons:delete-02" className="text-lg" />
                Delete Selected ({selectedRowIds.length})
              </button>
            )}
          </div>

          {/* Custom Table */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="size-5 rounded-lg border-2 border-slate-200 dark:border-slate-800 text-primary focus:ring-primary appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[6px] after:top-[2px] after:w-[6px] after:h-[10px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45"
                          onChange={(e) => {
                            if (e.target.checked) setSelectedRowIds(filteredLeads.map(l => l._id));
                            else setSelectedRowIds([]);
                          }}
                        />
                      </div>
                    </th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Name</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Insurance Type</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead._id}
                      onClick={() => navigate(`/leads/view/${lead._id}`)}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer hover-lift"
                    >
                      <td className="p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={selectedRowIds.includes(lead._id)}
                            className="size-5 rounded-lg border-2 border-slate-200 dark:border-slate-800 text-primary focus:ring-primary appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[6px] after:top-[2px] after:w-[6px] after:h-[10px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45"
                            onChange={(e) => {
                              if (e.target.checked) setSelectedRowIds(prev => [...prev, lead._id]);
                              else setSelectedRowIds(prev => prev.filter(id => id !== lead._id));
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary text-sm uppercase">
                            {lead.firstName[0]}{lead.lastName[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase leading-tight tracking-tight">{lead.firstName} {lead.lastName}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: #{lead._id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Iconify icon="hugeicons:mail-01" className="text-sm" />
                            <span className="text-xs font-bold">{lead.emailAddress}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Iconify icon="hugeicons:smart-phone-01" className="text-sm" />
                            <span className="text-[10px] font-black tracking-widest">{lead.phoneNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                            {lead.typeOfInsurance}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center">
                          <span className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(lead.leadStatus)}`}>
                            {lead.leadStatus}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => handleOpenEdit(e, lead._id)}
                            className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                          >
                            <Iconify icon="hugeicons:pencil-edit-02" className="text-lg" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRowIds([lead._id]);
                              handleOpenDelete();
                            }}
                            className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                          >
                            <Iconify icon="hugeicons:delete-02" className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4 animate-fadeIn">
                          <div className="size-20 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-300">
                            <Iconify icon="hugeicons:bubble-chat-search" className="text-5xl" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No leads found</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adjust your search or add a new lead</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredLeads.length} of {leadData.length} records</p>
              <div className="flex items-center gap-2">
                <button className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-50" disabled>Previous</button>
                <button className="h-10 px-4 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">1</button>
                <button className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LeadKanban leads={leadData} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
};

export default Leads;

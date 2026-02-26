import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Claim, ClaimStatus } from '../../types';
import IconWrapper from '../../components/ui/IconWrapper';

const ViewClaim: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [claim, setClaim] = useState<Claim | null>(null);

  // Mock fetching claim data
  useEffect(() => {
    const mockClaim: Claim = {
      _id: id || 'CLM-00001',
      claimNumber: `GH-CLM-2024-1234`,
      policyId: 'POL-00123',
      policyNumber: 'GH-2024-5566',
      clientName: 'Kofi Mensah',
      policyType: 'Motor - Comprehensive',
      insurer: 'GLICO',
      incidentDate: '2024-05-15',
      reportedDate: '2024-05-16',
      claimType: 'Accident',
      claimAmount: 15500,
      approvedAmount: 14200,
      status: ClaimStatus.Approved,
      adjusterName: 'John Adjei',
      documents: [
        { name: 'Police Report.pdf', size: '1.2 MB', uploadDate: '2024-05-17' },
        { name: 'Damage Photos.zip', size: '15.4 MB', uploadDate: '2024-05-17' },
        { name: 'Repair Estimate.pdf', size: '0.8 MB', uploadDate: '2024-05-18' }
      ] as any,
      timeline: [
        { date: '2024-05-16', event: 'Claim Reported', description: 'Initial claim submission by client', user: 'System' },
        { date: '2024-05-17', event: 'Documents Uploaded', description: 'Police report and photos received', user: 'James M.' },
        { date: '2024-05-18', event: 'Adjuster Assigned', description: 'John Adjei assigned to investigate', user: 'James M.' },
        { date: '2024-05-20', event: 'Offer Issued', description: 'Settlement offer of GH₵ 14,200 generated', user: 'John Adjei' }
      ],
      notes: 'Vehicle sustained front-end damage. Repair shop confirmed quote is reasonable.',
      daysOpen: 5
    };
    setClaim(mockClaim);
  }, [id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && claim) {
      const newDoc = {
        name: files[0].name,
        size: `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      setClaim({
        ...claim,
        documents: [...claim.documents, newDoc] as any
      });
      toast.success(`${files[0].name} uploaded successfully`);
    }
  };

  const handleDeleteDocument = (docName: string) => {
    if (claim) {
      setClaim({
        ...claim,
        documents: claim.documents.filter((doc: any) => doc.name !== docName)
      });
      toast.info(`Document "${docName}" removed`);
    }
  };

  if (!claim) return <div>Loading...</div>;

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.Reported: return 'bg-slate-100 text-slate-700';
      case ClaimStatus.Investigating: return 'bg-blue-100 text-blue-700';
      case ClaimStatus.Documented: return 'bg-purple-100 text-purple-700';
      case ClaimStatus.Approved: return 'bg-emerald-100 text-emerald-700';
      case ClaimStatus.Settled: return 'bg-green-100 text-green-700';
      case ClaimStatus.Rejected: return 'bg-rose-100 text-rose-700';
      case ClaimStatus.Disputed: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileUpload}
      />
      
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link to="/claims" className="hover:text-primary transition-colors">Claims</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-bold">{claim.claimNumber}</span>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">print</span>
            Print
          </button>
          <button 
            onClick={() => navigate(`/claims/edit/${claim._id}`)}
            className="h-10 px-6 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Modify details
          </button>
          <button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">update</span>
            Update Status
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(claim.status)}`}>
                {claim.status}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Reported {new Date(claim.reportedDate).toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">{claim.clientName}</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
              {claim.claimType} claim for {claim.policyType} policy underwritten by <span className="text-primary font-bold">{claim.insurer}</span>
            </p>
          </div>
          
          <div className="flex flex-row md:flex-col lg:flex-row gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 min-w-[160px] border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Claimed Amount</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">GH₵ {claim.claimAmount.toLocaleString()}</p>
            </div>
            {claim.approvedAmount && (
              <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-4 min-w-[160px] border border-emerald-100 dark:border-emerald-900/20">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Settlement Offer</p>
                <p className="text-2xl font-black text-emerald-600">GH₵ {claim.approvedAmount.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Claim Info */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Claim Particulars</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Policy Number</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{claim.policyNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Incident Date</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(claim.incidentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Adjuster</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{claim.adjusterName || 'Not Assigned'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Days Open</p>
                <p className="text-sm font-black text-rose-500">{claim.daysOpen} Days</p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Claim Notes</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                {claim.notes || 'No adjustment notes recorded.'}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Processing Timeline</h3>
            <div className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 flex flex-col gap-10">
              {claim.timeline.slice().reverse().map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[41px] top-0 size-5 rounded-full bg-white dark:bg-slate-900 border-4 border-primary shadow-sm" />
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">{event.event}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">{event.description}</p>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest">Action by: {event.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Documents & Related */}
        <div className="flex flex-col gap-8">
          {/* Documents */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Supporting Docs</h3>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
              >
                + Add New
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {claim.documents.map((doc: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-primary/30 transition-all group">
                  <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{doc.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => toast.info(`Downloading ${doc.name}...`)}
                      className="size-8 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-primary flex items-center justify-center transition-all"
                      title="Download"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.name)}
                      className="size-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {claim.documents.length === 0 && (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">cloud_upload</span>
                  <p className="text-xs font-bold text-slate-400">No documents uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-6 shadow-xl shadow-primary/20">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full h-11 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/10">
                <span className="material-symbols-outlined text-lg">mail</span>
                Notify Carrier
              </button>
              <button className="w-full h-11 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/10">
                <span className="material-symbols-outlined text-lg">sms</span>
                Update Client
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button className="w-full h-11 bg-rose-500 hover:bg-rose-600 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">cancel</span>
                Reject Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClaim;

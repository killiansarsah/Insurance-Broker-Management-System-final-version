
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PolicyDetails: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [timelineTab, setTimelineTab] = useState<'activities' | 'notes'>('activities');

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowActionsMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Expanded Data based on User's "Policy Overview"
  const policy = {
    id: policyId,
    // Header Info
    no: 'GG-DSDM-1011-23-006822',
    status: 'Active',
    class: 'Motor',
    type: 'Saloon/Sedan',
    insurer: 'GLICO GENERAL',
    broker: 'Dezag Brokers',
    source: 'OTHER',
    midReference: '-',
    insurerReference: '-',
    inceptionDate: '-',
    expiryDate: '-',
    
    // Dates
    createdDate: '24-12-2025',
    startDate: '-',
    endDate: '-',
    coverPeriod: 12,
    daysToCompletion: '-',
    
    // Financials
    currency: 'GHS',
    sumInsured: 40000.00,
    totalPremium: 3081.00,
    totalPaid: 0.00,
    balanceRemaining: 3081.00,
    discountApplied: 'NO',
    paymentFrequency: 'Annually',
    paymentReceived: 'No',
    paymentReceivedOn: '-',
    payoutReference: '-',
    outrightPremium: 3081.00,
    payoutStatus: '-',
    
    // Commission Summary
    grossPremium: '-',
    netPremium: '-',
    grossCom: 0,
    amountReceived: 0,
    balanceCom: 0,
    wht: '-',
    netCom: '-',
    comRate: '-',
    paymentStatus: '-',
    commissionReference: '-',

    // Customer Verification
    client: {
      name: 'Steve Apeadu-Baah',
      phone: '0553503110',
      kycStatus: 'Not Verified',
      riskScore: 'High',
      type: '-',
      id: '-',
      email: '-',
      address: 'PO Box 123, Accra',
      details: 'Steve Apeadu-Baah (Customer)'
    },

    // Vehicle Information
    vehicle: {
      make: 'TOYOTA',
      model: 'TOYOTA VITZ - Hatchback',
      type: 'Saloon/Sedan',
      color: 'Black',
      year: '2010',
      regYear: '2022',
      regNo: 'Pending',
      chassis: 'Pending',
      cc: 1050,
      usage: 'Hailing Services (Uber/Bolt/Yango ...)',
      passengers: 5,
      region: 'N/A',
      owner: 'Steve Apeadu-Baah',
      ownerPhone: '0553503110',
      driver: '-',
      interest: '-',
      value: 40000,
      accessories: '-',
      accessoriesValue: 0,
      photosReceived: 'No'
    },

    // Other Information (Q&A)
    qa: [
      { q: 'Has vehicle been altered in any way?', a: 'No' },
      { q: 'Is this vehicle in good repair state?', a: 'No' },
      { q: 'Vehicle repair state details', a: '', isText: true },
      { q: 'Does driver have any disease or complications?', a: 'No' },
      { q: 'Ever been declined by other insurer?', a: 'No' },
      { q: 'Have you ever made a claim on another insurance policy?', a: 'No' },
      { q: 'Is this vehicle on hire purchase?', a: 'No' },
    ],

    // Timeline / Activities
    timeline: [
      { date: 'Dec 24, 2025', time: '3:36 PM', title: 'Payment Schedule', desc: 'Created all 1 payment schedules', type: 'system' },
      { date: 'Dec 24, 2025', time: '3:36 PM', title: 'New Policy', desc: 'New policy created from quote with ref 145f5ae9-bf26-4224-ab6e-8af1c557a937', type: 'create' },
    ],
    
    // Notes
    notes: [
       { date: 'Dec 25, 2025', author: 'System', text: 'Policy verified automatically.'}
    ],

    // Payment History
    payments: [
      { 
         id: '1006757', 
         due: '24-12-2025', 
         paid: '-', 
         channel: '-',
         processor: '-',
         amount: 3081.00, 
         charged: 3081.00,
         ref: '01d06753-df15-4269-840d-18e9b6034264',
         status: 'Pending'
      }
    ],
    
    // Stats
    stats: {
      payments: 1,
      tasks: 0,
      claims: 0
    },
    
    documents: [],
    claims: []
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'risk', label: 'Risk & Asset', icon: 'directions_car' },
    { id: 'financials', label: 'Financials', icon: 'payments' },
    { id: 'docs', label: 'Documents', icon: 'folder_open' },
    { id: 'claims', label: 'Claims', icon: 'warning' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-primary transition-colors">
               <span className="material-symbols-outlined">arrow_back</span>
             </button>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Policy Master Record</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm ml-9">
            Ref: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{policy.no}</span> • {policy.vehicle.make} {policy.vehicle.model}
          </p>
        </div>
        
        {/* Actions Button with Dropdown */}
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowActionsMenu(!showActionsMenu); }}
            className="h-12 px-6 bg-primary text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-hover hover-lift transition-all"
          >
            <span className="material-symbols-outlined text-lg">bolt</span> Actions <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
          
          {showActionsMenu && (
             <div className="absolute right-0 top-14 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-[60] overflow-hidden flex flex-col animate-fadeIn origin-top-right">
                <ActionMenuItem icon="request_quote" label="Apply Loan" />
                <ActionMenuItem icon="download" label="Download Policy" />
                <ActionMenuItem icon="edit" label="Edit" onClick={() => navigate(`/policies/edit/${policy.id}`)} />
                <ActionMenuItem icon="photo_camera" label="Request Vehicle Photos" />
                <ActionMenuItem icon="schedule" label="Set to Due Later" />
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                <ActionMenuItem icon="share" label="Share Document" />
                <ActionMenuItem icon="upload_file" label="Upload Document" />
                <ActionMenuItem icon="update" label="View / Add Updates" />
             </div>
          )}
        </div>
      </div>

       {/* Tabs Navigation */}
       <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
           
            {/* Card 1: Policy Overview (Hero Card) */}
            <DashboardCard title="Policy Overview" icon="assignment" color="blue" className="md:col-span-2">
               <div className="flex flex-col gap-6">
                  {/* Top Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Status</span>
                        <div className="flex items-center gap-2">
                           <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                           </span>
                           <span className="text-sm font-black text-slate-700 dark:text-slate-200">{policy.status}</span>
                        </div>
                     </div>
                     <InfoItem label="Created On" value={policy.createdDate} />
                     <InfoItem label="Start Date" value={policy.startDate} />
                     <InfoItem label="End Date" value={policy.endDate} />
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy Duration Progress</span>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{policy.daysToCompletion} Remaining</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[15%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                     </div>
                  </div>

                  {/* Detailed Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                     <InfoRow label="Policy Source" value={policy.source} />
                     <InfoRow label="Risk Score" value={policy.client.riskScore} />
                     <InfoRow label="Broker" value={policy.broker} />
                     <InfoRow label="Payment Received" value={policy.paymentReceived} highlight={policy.paymentReceived === 'Yes'} />
                     <InfoRow label="Payment Received On" value={policy.paymentReceivedOn} />
                     <InfoRow label="Vehicle Photos Received" value={policy.vehicle.photosReceived} highlight={policy.vehicle.photosReceived === 'Yes'} />
                  </div>
               </div>
            </DashboardCard>
           
           {/* Card 2a: Vehicle Information */}
           <DashboardCard title="Vehicle Information" icon="directions_car" color="emerald">
              <div className="flex flex-col gap-6">
                 {/* Header Action */}
                 <button onClick={() => alert('Photo Request sent to ' + policy.vehicle.owner)} className="w-full py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">photo_camera</span> Request Vehicle Photos
                 </button>

                 {/* Specifications */}
                 <div className="flex flex-col gap-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1">Specifications</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                       <InfoRow label="Make" value={policy.vehicle.make} />
                       <InfoRow label="Model" value={policy.vehicle.model} />
                       <InfoRow label="Type" value={policy.vehicle.type} />
                       <InfoRow label="Color" value={policy.vehicle.color} />
                       <InfoRow label="Color" value={policy.vehicle.color} />
                       <InfoRow label="Chassis / VIN Number" value={policy.vehicle.chassis} />
                       <InfoRow label="CC" value={policy.vehicle.cc} />
                    </div>
                 </div>

                 {/* Registration & Usage */}
                 <div className="flex flex-col gap-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1">Registration & Usage</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                       <InfoRow label="Manufactured Year" value={policy.vehicle.year} />
                       <InfoRow label="Registration Year" value={policy.vehicle.regYear} />
                       <InfoRow label="Vehicle Registration Number" value={policy.vehicle.regNo} />
                       <InfoRow label="Number of Passengers" value={policy.vehicle.passengers} />
                       <InfoRow label="Vehicle Usage" value={policy.vehicle.usage} fullWidth />
                       <InfoRow label="Vehicle Region" value={policy.vehicle.region} />
                    </div>
                 </div>
              </div>
           </DashboardCard>

           {/* Card 2b: Owner & Value */}
           <DashboardCard title="Owner & Value" icon="person_pin" color="emerald">
              <div className="flex flex-col gap-3">
                 <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <InfoRow label="Vehicle Owner" value={policy.vehicle.owner} fullWidth />
                    <InfoRow label="Owner's Phone" value={policy.vehicle.ownerPhone} />
                     <InfoRow label="Vehicle Main Driver" value={policy.vehicle.driver} />
                     <InfoRow label="Nature of Interest in Vehicle" value={policy.vehicle.interest} />
                     <InfoRow label="Vehicle Insurance Value" value={policy.vehicle.value.toLocaleString()} prefix="GH₵" highlight />
                     <InfoRow label="Accessories Installed" value={policy.vehicle.accessories} />
                    <InfoRow label="Accessories Value" value={policy.vehicle.accessoriesValue.toLocaleString()} prefix="GH₵" />
                 </div>
              </div>
           </DashboardCard>

           {/* Card 3: Customer Verification */}
           <DashboardCard title="Customer Verification" icon="verified_user" color="purple">
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3 pb-2 border-b border-slate-50 dark:border-slate-800">
                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm">
                       <span className="material-symbols-outlined text-slate-400">person</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="font-bold text-slate-900 dark:text-white">{policy.client.name}</span>
                       <span className="text-[10px] text-slate-400 uppercase tracking-widest">Customer</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <InfoRow label="KYC Status" value={policy.client.kycStatus} highlight={policy.client.kycStatus === 'Verified'} />
                    <InfoRow label="Risk Profile" value={policy.client.riskScore} highlight={policy.client.riskScore === 'Low'} />
                    <InfoRow label="Type" value={policy.client.type} />
                    <InfoRow label="ID Number" value={policy.client.id} />
                    <InfoRow label="Phone Number" value={policy.client.phone} />
                    <InfoRow label="Email Address" value={policy.client.email} />
                 </div>
              </div>
           </DashboardCard>

           {/* Card 4: Insurance Information */}
           <DashboardCard title="Insurance Information" icon="admin_panel_settings" color="blue">
              <div className="flex flex-col gap-6">
                 {/* Provider Details */}
                 <div className="flex flex-col gap-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1">Provider Details</h4>
                     <div className="flex flex-col gap-4">
                       <InfoRow label="Insurance Provider" value={policy.insurer} />
                        <div className="grid grid-cols-2 gap-4">
                          <InfoRow label="MID Reference" value={policy.midReference} />
                          <InfoRow label="Insurer Reference" value={policy.insurerReference} />
                       </div>
                       <InfoRow label="Broker" value={policy.broker} />
                       <InfoRow label="Premium" value={policy.totalPremium.toLocaleString()} prefix="GH₵" highlight />
                     </div>
                 </div>

                 {/* Policy Terms */}
                 <div className="flex flex-col gap-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1">Policy Terms</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                       <div className="col-span-2 flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cover Type</span>
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-100">85% Comprehensive</span>
                       </div>
                       <InfoRow label="Cover Period" value={`${policy.coverPeriod} Months`} />
                       <InfoRow label="Sum Insured" value={policy.sumInsured.toLocaleString()} prefix="GH₵" />
                       <InfoRow label="Inception Date" value={policy.inceptionDate} />
                       <InfoRow label="Expiry Date" value={policy.expiryDate} />
                    </div>
                 </div>
              </div>
           </DashboardCard>

           {/* Card 5: Premium Summary */}
           <DashboardCard title="Premium Summary" icon="payments" color="amber">
              <div className="flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <InfoRow label="Currency" value={policy.currency} />
                    <InfoRow label="Total Premium" value={policy.totalPremium.toLocaleString()} prefix="GH₵" highlight />
                    <InfoRow label="Total Paid" value={policy.totalPaid.toLocaleString()} prefix="GH₵" />
                    <InfoRow label="Balance Remaining" value={policy.balanceRemaining.toLocaleString()} prefix="GH₵" highlight />
                    <InfoRow label="Payout Reference" value={policy.payoutReference} />
                    <InfoRow label="Outright Premium" value={policy.outrightPremium.toLocaleString()} prefix="GH₵" />
                    <InfoRow label="Discount Applied" value={policy.discountApplied} />
                    <InfoRow label="Payment Frequency" value={policy.paymentFrequency} />
                    <InfoRow label="Payout Status" value={policy.payoutStatus} />
                 </div>
              </div>
           </DashboardCard>

           {/* Card 6: Commission Summary */}
           <DashboardCard title="Commission Summary" icon="account_balance_wallet" color="amber">
              <div className="flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <InfoRow label="Gross Premium" value={policy.grossPremium} prefix="GH₵" />
                    <InfoRow label="Net Premium" value={policy.netPremium} prefix="GH₵" />
                    <InfoRow label="Gross Com" value={policy.grossCom} prefix="GH₵" />
                    <InfoRow label="Amount Received" value={policy.amountReceived} prefix="GH₵" />
                    <InfoRow label="Balance Remaining" value={policy.balanceCom} prefix="GH₵" highlight />
                    <InfoRow label="WHT" value={policy.wht} prefix="GH₵" />
                    <InfoRow label="Net Com" value={policy.netCom} prefix="GH₵" />
                    <InfoRow label="Com Rate(%)" value={policy.comRate} />
                    <InfoRow label="Commission Reference" value={policy.commissionReference} />
                    <InfoRow label="Payment Status" value={policy.paymentStatus} />
                 </div>
              </div>
           </DashboardCard>

           {/* Card 7: Timeline & Notes */}
           <DashboardCard title="Policy Timeline" icon="history" color="slate">
              <div className="flex flex-col h-full">
                 {/* Tabs */}
                 <div className="flex border-b border-slate-100 dark:border-slate-800 mb-4">
                    <button 
                       onClick={() => setTimelineTab('activities')}
                       className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest transition-colors ${timelineTab === 'activities' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       Activities
                    </button>
                    <button 
                       onClick={() => setTimelineTab('notes')}
                       className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest transition-colors ${timelineTab === 'notes' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       Notes
                    </button>
                 </div>

                 {/* Content */}
                 {timelineTab === 'activities' ? (
                    <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2 space-y-6 py-1">
                       {policy.timeline.map((event, idx) => (
                          <div key={idx} className="relative pl-6">
                             <div className={`absolute -left-[7px] top-1 size-3 rounded-full border-2 border-white dark:border-slate-900 ${event.type === 'create' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                             <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{event.date} • {event.time}</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{event.title}</span>
                                <p className="text-[10px] leading-relaxed text-slate-500">{event.desc}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="flex flex-col gap-4">
                       {policy.notes.length > 0 ? (
                          policy.notes.map((note, idx) => (
                             <div key={idx} className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
                                <div className="flex justify-between items-center mb-1">
                                   <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{note.author}</span>
                                   <span className="text-[9px] text-amber-400">{note.date}</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{note.text}</p>
                             </div>
                          ))
                       ) : (
                          <div className="text-center py-6 text-slate-400 text-xs">No notes added yet.</div>
                       )}
                       <button onClick={() => alert('Adding new note...')} className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          + Add Note
                       </button>
                    </div>
                 )}
              </div>
           </DashboardCard>

           {/* Card 8: Other Information */}
           <DashboardCard title="Other Information" icon="info" color="rose">
              <div className="flex flex-col gap-3">
                 {policy.qa.map((item, idx) => (
                    <div key={idx} className="flex flex-col border-b border-slate-50 dark:border-slate-800 last:border-0 pb-2">
                       <div className="flex justify-between items-center py-1">
                          <span className="text-[10px] font-medium text-slate-500 w-3/4" title={item.q}>{item.q}</span>
                          {!item.isText && (
                             <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.a === 'No' ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'}`}>{item.a}</span>
                          )}
                       </div>
                       {item.isText && (
                          <div className="w-full h-8 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700/50"></div>
                       )}
                    </div>
                 ))}
                  <button onClick={() => setActiveTab('risk')} className="text-[10px] font-black text-primary uppercase tracking-widest text-center mt-2 hover:underline">View All Risk Details</button>
               </div>
            </DashboardCard>

            {/* Card 9: Documents (Added to match user flow) */}
            <DashboardCard title="Documents" icon="folder_open" color="slate">
               <div className="flex flex-col items-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <button onClick={() => alert('Opening File Uploader...')} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2">
                     <span className="material-symbols-outlined text-sm">upload_file</span> Upload Document
                  </button>
               </div>
            </DashboardCard>
            
            {/* Card 10: Payment Analysis (Added to match user flow) */}
            <DashboardCard title="Payment Analysis" icon="analytics" color="slate">
               <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                     <InfoRow label="Payment History" value="No history found" />
                     <InfoRow label="Payment Trend" value="Trend status not found" />
                     <InfoRow label="Credit Score" value="No score available" />
                     <div className="col-span-2 grid grid-cols-2 gap-2">
                       <InfoRow label="Last Payment" value="-" />
                       <InfoRow label="Next Payment" value="-" />
                     </div>
                     <InfoRow label="Outstanding Balance" value="-" />
                     <InfoRow label="Average Days Late" value="-" />
                  </div>
                  <div className="flex justify-end border-t border-slate-50 dark:border-slate-800 pt-2">
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                         <span className="material-symbols-outlined text-sm">history</span> History Run
                      </button>
                  </div>
               </div>
            </DashboardCard>


        </div>
      )}

      {/* OTHER TABS (Maintained from previous version) */}
      {activeTab === 'risk' && (
         <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Vehicle Specs */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Vehicle Specifications</h3>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">photo_camera</span> Request Photos
                 </button>
               </div>
               <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-12">
                  {/* Specs Column */}
                  <div className="flex flex-col gap-6">
                     <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-primary/20 pb-2">Specifications</h4>
                     <div className="grid grid-cols-2 gap-6">
                        <InfoItem label="Make" value={policy.vehicle.make} />
                        <InfoItem label="Model" value={policy.vehicle.model} />
                        <InfoItem label="Type" value={policy.vehicle.type} />
                        <InfoItem label="Color" value={policy.vehicle.color} />
                        <InfoItem label="Chassis / VIN" value={policy.vehicle.chassis} highlight />
                        <InfoItem label="Engine Capacity" value={`${policy.vehicle.cc} CC`} />
                     </div>
                  </div>

                  {/* Reg Column */}
                  <div className="flex flex-col gap-6">
                     <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-primary/20 pb-2">Registration & Usage</h4>
                     <div className="grid grid-cols-2 gap-6">
                        <InfoItem label="Manufactured Year" value={policy.vehicle.year} />
                        <InfoItem label="Registration Year" value={policy.vehicle.regYear} />
                        <InfoItem label="Reg Number" value={policy.vehicle.regNo} highlight />
                        <InfoItem label="Passengers" value={policy.vehicle.passengers} />
                        <div className="col-span-2">
                           <InfoItem label="Usage" value={policy.vehicle.usage} />
                        </div>
                        <InfoItem label="Region" value={policy.vehicle.region} />
                     </div>
                  </div>

                  {/* Owner Column */}
                  <div className="flex flex-col gap-6">
                     <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-primary/20 pb-2">Owner & Value</h4>
                     <div className="flex flex-col gap-6">
                        <InfoItem label="Vehicle Owner" value={policy.vehicle.owner} />
                        <div className="grid grid-cols-2 gap-6">
                           <InfoItem label="Owner's Phone" value={policy.vehicle.ownerPhone} />
                           <InfoItem label="Main Driver" value={policy.vehicle.driver} />
                        </div>
                        <InfoItem label="Nature of Interest" value={policy.vehicle.interest} />
                        <InfoItem label="Insurance Value" value={policy.vehicle.value.toLocaleString()} prefix="GH₵" highlight />
                        <div className="grid grid-cols-2 gap-6">
                           <InfoItem label="Accessories" value={policy.vehicle.accessories} />
                           <InfoItem label="Acc. Value" value={policy.vehicle.accessoriesValue.toLocaleString()} prefix="GH₵" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Other Info Q&A */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Risk Assessment Details</h3>
               </div>
               <div className="p-8 flex flex-col gap-4">
                  {policy.qa.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                       <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-3/4">{item.q}</span>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.a === 'No' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{item.a}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {activeTab === 'financials' && (
         <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Top Stats */}
            <div className="grid grid-cols-3 gap-6">
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payments</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{policy.stats.payments}</span>
               </div>
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{policy.stats.tasks}</span>
               </div>
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Claims</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{policy.stats.claims}</span>
               </div>
            </div>

            <div className="bg-emerald-50/50 dark:bg-emerald-900/5 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-emerald-100 dark:border-emerald-900/20 bg-emerald-100/20">
                  <h3 className="text-xs font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">payments</span> Premium Summary
                  </h3>
               </div>
               <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <InfoItem label="Total Premium" value={policy.totalPremium.toLocaleString()} prefix="GH₵" highlight />
                  <InfoItem label="Total Paid" value={policy.totalPaid.toLocaleString()} prefix="GH₵" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</span>
                    <span className="text-lg font-black text-rose-500">GH₵ {policy.balanceRemaining.toLocaleString()}</span>
                  </div>
                  <InfoItem label="Discount Applied" value={policy.discountApplied} />
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Payment Ledger</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left whitespace-nowrap">
                   <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                     <tr>
                       {['ID', 'Due Date', 'Paid Date', 'Channel', 'Processor', 'Amount', 'Charged Amt', 'Processor Ref', 'Status'].map(h => (
                         <th key={h} className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     {policy.payments.map(pay => (
                       <tr key={pay.id}>
                         <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{pay.id}</td>
                         <td className="px-6 py-4 text-xs font-bold text-slate-700">{pay.due}</td>
                         <td className="px-6 py-4 text-xs text-slate-500">{pay.paid}</td>
                         <td className="px-6 py-4 text-xs text-slate-500">{pay.channel}</td>
                         <td className="px-6 py-4 text-xs text-slate-500">{pay.processor}</td>
                         <td className="px-6 py-4 text-xs font-black text-slate-900">GH₵ {pay.amount.toLocaleString()}</td>
                         <td className="px-6 py-4 text-xs font-bold text-slate-700">GH₵ {pay.charged.toLocaleString()}</td>
                         <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{pay.ref}</td>
                         <td className="px-6 py-4">
                           <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest">{pay.status}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'docs' && (
         <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed animate-fadeIn">
            <div className="size-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-3xl">folder_off</span>
            </div>
            <p className="text-slate-500 font-bold mb-6">No documents uploaded yet</p>
            <button onClick={() => alert('Opening File Uploader...')} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
              Upload Document
            </button>
         </div>
      )}

      {activeTab === 'claims' && (
         <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed animate-fadeIn">
            <div className="size-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <p className="text-slate-500 font-bold">No claims history record</p>
         </div>
      )}

    </div>
  );
};

// --- Sub-components for Modular Design ---

const DashboardCard = ({ title, icon, children, color = 'slate', className = '' }: { title: string, icon: string, children: React.ReactNode, color?: string, className?: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',
    purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    slate: 'text-slate-400 bg-slate-50 dark:bg-slate-800/50',
  };

  return (
     <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover-lift transition-all ${className}`}>
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
           <div className={`size-8 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.slate}`}>
              <span className="material-symbols-outlined text-lg">{icon}</span>
           </div>
           <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h3>
        </div>
        <div className="p-6 flex-1">
           {children}
        </div>
     </div>
  );
};

const InfoRow = ({ label, value, highlight, fullWidth, prefix }: { label: string, value: string | number, highlight?: boolean, fullWidth?: boolean, prefix?: string }) => (
  <div className={`flex flex-col gap-1 ${fullWidth ? 'col-span-2' : ''}`}>
     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
     <span className={`text-xs font-bold truncate ${highlight ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
        {prefix && <span className="text-slate-400 mr-1">{prefix}</span>}
        {value}
     </span>
  </div>
);

const ActionMenuItem = ({ icon, label, onClick }: { icon: string, label: string, onClick?: () => void }) => (
  <button onClick={onClick} className="w-full px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3">
     <span className="material-symbols-outlined text-lg opacity-70">{icon}</span> {label}
  </button>
);

const InfoItem = ({ label, value, highlight, prefix }: { label: string, value: string | number, highlight?: boolean, prefix?: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`text-sm ${highlight ? 'font-black text-emerald-600' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
      {prefix && <span className="text-slate-400 mr-1">{prefix}</span>}
      {value}
    </span>
  </div>
);

export default PolicyDetails;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Quote, QuoteStatus, QuoteSource } from '../../types';

const ViewQuote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);

  // Mock data fetching - in a real app, this would be an API call
  useEffect(() => {
    const mockQuotes: Quote[] = [
      { 
        _id: '1', 
        name: 'John Mensah',
        firstName: 'John',
        lastName: 'Mensah',
        source: QuoteSource.Referral, 
        phone: '+233 24 123 4567', 
        mobileNumber: '+233 55 987 6543',
        email: 'john.mensah@email.com',
        protectionType: 'Motor - Comprehensive', 
        status: QuoteStatus.Quoted,
        premiumAmount: 8400,
        dateCreated: '2024-10-25',
        followUpDate: '2024-11-05',
        assignedAgent: 'Sarah Adeyemi',
        createdBy: 'user1',
        installmentType: 'Monthly',
        initialDeposit: 2100,
        installmentPeriod: 6,
        monthlyInstallment: 1050,
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        registrationNumber: 'GW-1234-22',
        yearOfManufacture: 2022,
        activities: [
          { date: '2024-10-25 09:00', action: 'Quote Generated', user: 'Sarah Adeyemi', details: 'Initial comprehensive quote created.' },
          { date: '2024-10-26 14:30', action: 'Client Contacted', user: 'Sarah Adeyemi', details: 'Called client to discuss premium options.' },
          { date: '2024-10-27 11:15', action: 'Plan Updated', user: 'Sarah Adeyemi', details: 'Changed to 6-month installment plan.' }
        ]
      },
      { 
        _id: '2', 
        name: 'Dangote Ghana Ltd', 
        firstName: 'Aliko',
        lastName: 'Dangote',
        source: QuoteSource.Website, 
        phone: '+233 30 276 1234', 
        email: 'info@dangote.com.gh',
        protectionType: 'Fire - Commercial Property', 
        status: QuoteStatus.Won,
        premiumAmount: 42000,
        dateCreated: '2024-10-22',
        assignedAgent: 'David Musa',
        createdBy: 'user1',
        installmentType: 'Single',
        initialDeposit: 42000,
        activities: [
          { date: '2024-10-22 10:00', action: 'Quote Generated', user: 'David Musa' },
          { date: '2024-10-24 16:00', action: 'Policy Issued', user: 'David Musa', details: 'Quote converted to formal policy.' }
        ]
      },
    ];

    const found = mockQuotes.find(q => q._id === id);
    if (found) {
      setQuote(found);
    } else {
      setQuote(mockQuotes[0]);
    }
  }, [id]);

  if (!quote) return null;

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

  const netPremium = quote.premiumAmount || 0;
  const stampDuty = 50;
  const tax = netPremium * 0.075;
  const total = netPremium + tax + stampDuty;

  const handleConvertToPolicy = () => {
    toast.success('Quote successfully converted to Policy! Redirecting to motor portfolio...');
    setTimeout(() => navigate('/policies/motor'), 2000);
  };

  const handleShareEmail = () => {
    toast.info(`Drafting quotation email for ${quote.name}...`);
  };

  const handleShareWhatsApp = () => {
    toast.info(`Opening WhatsApp for ${quote.name}...`);
  };

  const handleSetReminder = () => {
    toast.success('Follow-up reminder set for this quote.');
  };

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/quotes')} className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-600">arrow_back</span>
             </button>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Quote Details</h1>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-14">Ref: #{quote._id?.toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => navigate(`/quotes/edit/${quote._id}`)}
             className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-lg">edit</span>
             Edit
           </button>
           <button 
             onClick={handleConvertToPolicy}
             className="h-12 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-lg">description</span>
             Convert to Policy
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Summary Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(quote.status)}`}>
                  {quote.status}
                </span>
             </div>
             <div className="flex items-center gap-6">
                <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined text-4xl font-bold">description</span>
                </div>
                <div className="flex flex-col gap-1">
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{quote.name}</h2>
                   <div className="flex items-center gap-4">
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{quote.protectionType}</p>
                      <div className="size-1 rounded-full bg-slate-300"></div>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Added {new Date(quote.dateCreated).toLocaleDateString()}</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">person</span>
                    Contact Information
                  </h3>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">First Name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{quote.firstName || quote.name.split(' ')[0]}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{quote.lastName || quote.name.split(' ')[1] || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{quote.mobileNumber || quote.phone}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{quote.email}</p>
                  </div>
               </div>
            </div>

            {/* Quote Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-8">
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-lg">payments</span>
                 Quote Plan
               </h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Installment Type</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{quote.installmentType || 'Single'}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Initial Deposit</p>
                    <p className="text-sm font-bold text-emerald-600">GH₵ {(quote.initialDeposit || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Installment Period</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{quote.installmentPeriod ? `${quote.installmentPeriod} Months` : 'N/A'}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monthly Installment</p>
                    <p className="text-sm font-bold text-primary">GH₵ {(quote.monthlyInstallment || 0).toLocaleString()}</p>
                  </div>
               </div>
            </div>

            {/* Vehicle Information (Conditional) */}
            {quote.protectionType.toLowerCase().includes('motor') && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-8 md:col-span-2">
                 <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary text-lg">directions_car</span>
                   Vehicle Information
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Make / Model</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{quote.vehicleMake} {quote.vehicleModel}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reg Number</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-tight">{quote.registrationNumber || 'N/A'}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Year</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{quote.yearOfManufacture || '-'}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Usage</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">Private / Business</p>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-6">
             <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
               <span className="material-symbols-outlined text-primary text-lg">history</span>
               Activity Feed
             </h3>
             <div className="flex flex-col gap-0">
                {quote.activities?.map((activity, idx) => (
                   <div key={idx} className="flex gap-4 relative pb-6 group last:pb-0">
                      {idx !== quote.activities!.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                      )}
                      <div className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center relative z-10">
                         <div className="size-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                         <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{activity.action}</p>
                            <p className="text-[10px] font-bold text-slate-400">{activity.date}</p>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                           Performed by <span className="text-primary tracking-widest">{activity.user}</span>
                         </p>
                         {activity.details && (
                           <p className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl mt-2 border border-slate-100 dark:border-slate-800">
                             {activity.details}
                           </p>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column - Financials & Agent */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           {/* Premium Summary */}
           <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Premium Breakdown</h3>
              <div className="flex flex-col gap-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Premium</span>
                    <span className="text-sm font-black text-white">GH₵ {netPremium.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VAT & Levies (7.5%)</span>
                    <span className="text-sm font-black text-slate-400 tracking-tight">GH₵ {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIC Levy / Stamp</span>
                    <span className="text-sm font-black text-slate-400">GH₵ {stampDuty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="h-px bg-slate-800"></div>
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Total Payable</span>
                    <span className="text-4xl font-black text-primary">GH₵ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                 <button className="h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">mail</span>
                    Email
                 </button>
                 <button className="h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">share</span>
                    WhatsApp
                 </button>
              </div>
           </div>

           {/* Internal Context */}
           <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-6">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Internal Assignment</h3>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                 <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20">
                    {quote.assignedAgent?.split(' ').map(n => n[0]).join('')}
                 </div>
                 <div className="flex flex-col">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{quote.assignedAgent}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Relationship Manager</p>
                 </div>
              </div>
              <div className="flex flex-col gap-4">
                 <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Follow-up Goal</p>
                    <p className="text-xs font-bold text-amber-600 uppercase italic">Expected Closure by Nov 15</p>
                 </div>
                 <button className="w-full h-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg font-bold">add_task</span>
                    Set Reminder
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuote;

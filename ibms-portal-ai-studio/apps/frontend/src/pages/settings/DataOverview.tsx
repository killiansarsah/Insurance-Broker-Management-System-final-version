
import React, { useState, useMemo, useEffect } from 'react';
import { useYear } from '../../context/YearContext';

// Generator for a realistic master dataset for a specific year
interface DataRecord {
  id: string;
  insured: string;
  insurer: string;
  class: string;
  type: string;
  no: string;
  rate: string;
  premium: number;
  gross: number;
  levy: number;
  net: number;
  month: string;
  issueDate: string;
  expiry: string;
  location: string;
  sumInsured: number;
  fiscalYear: number;
}

const generateDemoDataForYear = (year: number): DataRecord[] => {
  const insurers = ['GLICO GEN', 'IMPERIAL', 'GLICO LIFE', 'Enterprise', 'Prime', 'Star Assurance', 'SIC Insurance', 'Vanguard', 'Phoenix'];
  const classes = ['Motor', 'Life', 'Fire', 'Marine', 'Bonds', 'Health', 'Travel'];
  const types = ['Comprehensive', 'Third Party', 'Grouplife', 'Fire & Perils', 'Marine Cargo', 'Bonds', 'HMO', 'Personal Accident'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const companies = ['Dangote Industries', 'Acme Logistics', 'Salt To Ghana', 'Rainbow Agrosciences', 'Ghana Shippers\' Auth.', 'Radiance Petroleum', 'EAP Logistics', 'MTN Ghana', 'Telecel', 'Graphic Communications', 'GOIL Ghana', 'Tullow Oil', 'Newmont Gold', 'Ecobank', 'GCB Bank'];
  const individuals = ['Loretta Boakye', 'Ernest Asante Offei', 'Edmund Nii Lante', 'Ato Kwamena', 'Kofi Mensah', 'Ama Serwaa', 'Kwesi Arthur', 'Abena Boateng', 'Yaw Antwi', 'Ekow Blankson', 'Serwaa Amihere', 'Nana Aba', 'John Dumelo', 'Yvonne Nelson', 'Adjoa Bayor'];

  // Seed variability based on year to make the data look different
  const seed = year * 7;
  const count = 80 + (seed % 40); // 80 to 120 records per year

  const data = [];
  for (let i = 1; i <= count; i++) {
    const isCompany = (i + seed) % 3 === 0;
    const insured = isCompany ? companies[(i + seed) % companies.length] : individuals[(i + seed) % individuals.length];
    const insurer = insurers[(i + seed) % insurers.length];
    const policyClass = classes[(i + seed) % classes.length];
    const type = types[(i + seed) % types.length];
    const month = months[(i + seed) % months.length];
    
    // Financial variability per year
    const basePremium = (year - 2019) * 200; 
    const premium = Math.floor(Math.random() * 40000) + 400 + basePremium;
    const commRate = 0.10 + (Math.random() * 0.12);
    const gross = premium * commRate;
    const levy = gross * 0.075;
    const net = gross - levy;
    const sumInsured = policyClass === 'Motor' ? premium * 20 : (policyClass === 'Life' ? 1000000 : premium * 50);

    data.push({
      id: `${year}-${i}`,
      insured,
      insurer,
      class: policyClass,
      type,
      no: `${insurer.substring(0,2)}-${policyClass.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${year.toString().slice(-2)}-00${10000 + i}`,
      rate: commRate.toFixed(2),
      premium,
      gross,
      levy,
      net,
      month,
      issueDate: `${Math.floor(Math.random()*28)+1}/${Math.floor(Math.random()*12)+1}/${year}`,
      expiry: `${Math.floor(Math.random()*28)+1}/${Math.floor(Math.random()*12)+1}/${year + 1}`,
      location: isCompany ? 'Head Office' : `GW ${Math.floor(Math.random()*1000)}-${year.toString().slice(-2)}`,
      sumInsured,
      fiscalYear: year
    });
  }
  return data;
};

const DataOverview: React.FC = () => {
  const { selectedYear, setSelectedYear, availableYears } = useYear();
  const [searchTerm, setSearchTerm] = useState('');
  const [isChangingYear, setIsChangingYear] = useState(false);
  const [yearData, setYearData] = useState<DataRecord[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newItem, setNewItem] = useState({
     insured: '',
     insurer: 'Enterprise',
     policyClass: 'Motor',
     coverType: 'Comprehensive',
     premium: '',
     sumInsured: '',
     issueDate: '',
     expiryDate: '',
     location: ''
  });

  // Effect to load data when year changes
  useEffect(() => {
     setYearData(generateDemoDataForYear(selectedYear));
  }, [selectedYear]);

  const handleCreateRecord = () => {
     if (!newItem.insured || !newItem.premium) return alert('Please fill in all required fields');
     
     const premium = parseFloat(newItem.premium);
     const sumInsured = parseFloat(newItem.sumInsured) || 0;
     const commRate = 0.12; 
     const gross = premium * commRate;
     const levy = gross * 0.075;
     
     // Format dates if provided, else defaults
     const issueDate = newItem.issueDate ? new Date(newItem.issueDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
     const expiryDate = newItem.expiryDate ? new Date(newItem.expiryDate).toLocaleDateString('en-GB') : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-GB');
     const month = newItem.issueDate ? new Date(newItem.issueDate).toLocaleString('default', { month: 'long' }) : new Date().toLocaleString('default', { month: 'long' });

     const newRecord: DataRecord = {
        id: `${selectedYear}-${Date.now()}`,
        insured: newItem.insured,
        insurer: newItem.insurer,
        class: newItem.policyClass,
        type: newItem.coverType,
        no: `${newItem.insurer.substring(0,2).toUpperCase()}-${newItem.policyClass.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${selectedYear.toString().slice(-2)}-${Math.floor(10000 + Math.random() * 90000)}`,
        rate: commRate.toFixed(2),
        premium,
        gross,
        levy,
        net: gross - levy,
        month,
        issueDate,
        expiry: expiryDate,
        location: newItem.location || 'Head Office',
        sumInsured,
        fiscalYear: selectedYear
     };

     setYearData(prev => [newRecord, ...prev]);
     
     // Success Checkmark Effect
     setIsSuccess(true);
     setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
        setNewItem({ insured: '', insurer: 'Enterprise', policyClass: 'Motor', coverType: 'Comprehensive', premium: '', sumInsured: '', issueDate: '', expiryDate: '', location: '' });
     }, 1000);
  };

  const filteredData = useMemo(() => {
    return yearData.filter(p => 
      p.insured.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.insurer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [yearData, searchTerm]);

  const totals = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      premium: acc.premium + curr.premium,
      gross: acc.gross + curr.gross,
      levy: acc.levy + (curr.levy || 0),
      net: acc.net + curr.net,
      sumInsured: acc.sumInsured + curr.sumInsured
    }), { premium: 0, gross: 0, levy: 0, net: 0, sumInsured: 0 });
  }, [filteredData]);

  // Handle local year selection (syncs with global)
  const handleYearChange = (year: number) => {
    setIsChangingYear(true);
    setTimeout(() => {
      setSelectedYear(year);
      setIsChangingYear(false);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full gap-4 pb-10 relative">
      {/* Header Info */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Master Ledger Archive</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">NIC Compliance Vault • Retention Period: 6 Years</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
          <span className="material-symbols-outlined text-primary text-sm">event</span>
          <span className="text-xs font-black text-primary uppercase">Viewing Fiscal Year: {selectedYear}</span>
        </div>
      </div>

      {/* Search and Tool Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-3 items-center flex-1">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400"
              placeholder={`Search in ${selectedYear} records...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Year Selector (Synchronized with Global) */}
          <div className="relative">
            <select 
              className="h-11 pl-10 pr-10 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.15em] appearance-none cursor-pointer focus:ring-4 focus:ring-primary/10"
              value={selectedYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y} Ledger</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">history</span>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">expand_more</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="h-11 px-4 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Create Record
            </button>
            <button className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">filter_alt</span>
              Filter
            </button>
            <button className="h-11 px-4 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">download</span>
              Export {selectedYear}
            </button>
          </div>
        </div>
      </div>

      {/* Spreadsheet Master View */}
      <div className={`relative flex flex-col flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl min-h-[600px] transition-opacity duration-300 ${isChangingYear ? 'opacity-40' : 'opacity-100'}`}>
        
        {isChangingYear && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
             <div className="flex flex-col items-center gap-3">
                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Accessing Archive...</span>
             </div>
          </div>
        )}

        <div className="overflow-auto flex-1 scroll-smooth">
          <table className="table-fixed min-w-[2200px] border-collapse w-full text-left">
            <thead className="sticky top-0 z-20 shadow-sm">
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="w-12 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase text-center sticky left-0 z-30 bg-slate-100 dark:bg-slate-800">S/N</th>
                <th className="w-72 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase sticky left-12 z-30 bg-slate-100 dark:bg-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Insured Name</th>
                <th className="w-44 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase">Insurer</th>
                <th className="w-32 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase">Class</th>
                <th className="w-48 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase">Type of Cover</th>
                <th className="w-64 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase">Policy Number</th>
                <th className="w-24 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase text-center">Rate</th>
                <th className="w-36 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase text-right">Premium</th>
                <th className="w-36 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase text-right">Gross Comm</th>
                <th className="w-28 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase text-right">8% Levy</th>
                <th className="w-36 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-emerald-600 uppercase text-right">Net Comm</th>
                <th className="w-32 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase text-center">Month</th>
                <th className="w-32 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase text-center">Issue Date</th>
                <th className="w-32 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase text-center">Expiry Date</th>
                <th className="w-64 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-slate-500 uppercase">Vehicle / Location</th>
                <th className="w-48 border-b border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black text-primary uppercase text-right">Sum Insured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredData.map((row, idx) => (
                <tr key={row.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-[10px] font-bold text-slate-400 text-center sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60">{idx + 1}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-xs font-black text-slate-900 dark:text-white uppercase truncate sticky left-12 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">{row.insured}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">
                    <span className={`px-2 py-0.5 rounded border ${
                      row.insurer.includes('GLICO') ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800' : 
                      row.insurer === 'Enterprise' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                      'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                      {row.insurer}
                    </span>
                  </td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black uppercase text-slate-500">{row.class}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-xs text-slate-500 font-medium">{row.type}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-[10px] font-mono font-bold text-slate-400">{row.no}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-xs font-bold text-slate-400 text-center">{row.rate}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-xs font-black text-slate-900 dark:text-white text-right">{row.premium.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-xs font-bold text-slate-400 text-right">{row.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-xs font-bold text-rose-400 text-right">{row.levy.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-xs font-black text-emerald-600 text-right">{row.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-[10px] font-black uppercase text-slate-500 text-center">{row.month}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-[10px] font-bold text-slate-400 text-center">{row.issueDate}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-[10px] font-bold text-slate-400 text-center">{row.expiry}</td>
                  <td className="border-r border-slate-200 dark:border-slate-700 p-2 text-xs text-slate-500 font-bold truncate">{row.location}</td>
                  <td className="p-2 text-xs font-black text-primary text-right">{row.sumInsured > 0 ? row.sumInsured.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                </tr>
              ))}
              
              {/* Fill empty space if data is small */}
              {filteredData.length < 20 && Array.from({ length: 20 - filteredData.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-10">
                  {Array.from({ length: 16 }).map((_, j) => (
                    <td key={`cell-${i}-${j}`} className={`border-r border-b border-slate-50 dark:border-slate-800 ${j === 0 ? 'sticky left-0 bg-white dark:bg-slate-900' : ''} ${j === 1 ? 'sticky left-12 bg-white dark:bg-slate-900' : ''}`}></td>
                  ))}
                </tr>
              ))}
            </tbody>
            {/* Spreadsheet Sticky Footer */}
            <tfoot className="sticky bottom-0 z-20 bg-slate-900 text-white shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
              <tr className="divide-x divide-slate-800">
                <td className="p-3 sticky left-0 z-30 bg-slate-900" colSpan={2}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ledger Totals ({selectedYear})</span>
                    <span className="text-[9px] text-slate-500 italic">Across {filteredData.length} fiscal records</span>
                  </div>
                </td>
                <td className="p-3" colSpan={5}></td>
                <td className="p-3 text-right text-xs font-black">
                   {totals.premium.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-right text-xs font-bold text-slate-400">
                   {totals.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-right text-xs font-bold text-rose-400">
                   {totals.levy.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-right text-xs font-black text-emerald-400">
                   {totals.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3" colSpan={4}></td>
                <td className="p-3 text-right text-xs font-black text-primary">
                   {totals.sumInsured.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>


      {/* Create Record Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
               <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">New Ledger Entry</h3>
                  <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors">
                     <span className="material-symbols-outlined text-sm">close</span>
                  </button>
               </div>
               <div className="p-8 flex flex-col gap-6">
                  {/* Form Fields */}
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Insured Name</label>
                        <input 
                           type="text" 
                           className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                           placeholder="e.g. Acme Logistics Ltd."
                           value={newItem.insured}
                           onChange={e => setNewItem({...newItem, insured: e.target.value})}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Insurer</label>
                           <select 
                              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
                              value={newItem.insurer}
                              onChange={e => setNewItem({...newItem, insurer: e.target.value})}
                           >
                              {['GLICO GEN', 'Enterprise', 'Star Assurance', 'Vanguard', 'SIC Insurance'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Business Class</label>
                           <select 
                              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
                              value={newItem.policyClass}
                              onChange={e => setNewItem({...newItem, policyClass: e.target.value})}
                           >
                              {['Motor', 'Fire', 'Marine', 'General Accident', 'Engineering'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cover Type</label>
                        <select 
                           className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
                           value={newItem.coverType}
                           onChange={e => setNewItem({...newItem, coverType: e.target.value})}
                        >
                           {['Comprehensive', 'Third Party', 'Fire & Perils', 'Marine Cargo', 'All Risk'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Premium (GHS)</label>
                           <input 
                              type="number" 
                              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                              placeholder="0.00"
                              value={newItem.premium}
                              onChange={e => setNewItem({...newItem, premium: e.target.value})}
                           />
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sum Insured</label>
                           <input 
                              type="number" 
                              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                              placeholder="0.00"
                              value={newItem.sumInsured}
                              onChange={e => setNewItem({...newItem, sumInsured: e.target.value})}
                           />
                        </div>
                     </div>
                     
                     {/* New Date and Location Fields */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Issue Date</label>
                           <input 
                              type="date" 
                              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
                              value={newItem.issueDate}
                              onChange={e => setNewItem({...newItem, issueDate: e.target.value})}
                           />
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expiry Date</label>
                           <input 
                              type="date" 
                              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
                              value={newItem.expiryDate}
                              onChange={e => setNewItem({...newItem, expiryDate: e.target.value})}
                           />
                        </div>
                     </div>
                     
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vehicle / Location</label>
                        <input 
                           type="text" 
                           className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                           placeholder="e.g. GW-2024-123 or Head Office"
                           value={newItem.location}
                           onChange={e => setNewItem({...newItem, location: e.target.value})}
                        />
                     </div>
                  </div>

                  <button 
                     onClick={handleCreateRecord}
                     disabled={isSuccess}
                     className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isSuccess 
                           ? 'bg-emerald-500 text-white shadow-emerald-500/20 scale-100' 
                           : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20 hover-lift'
                     }`}
                  >
                     {isSuccess ? (
                        <>
                           <span className="material-symbols-outlined text-sm">check_circle</span>
                           Success!
                        </>
                     ) : (
                        'Create Ledger Entry'
                     )}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default DataOverview;

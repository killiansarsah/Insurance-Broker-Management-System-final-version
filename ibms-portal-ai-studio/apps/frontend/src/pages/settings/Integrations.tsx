import React, { useState, useEffect } from 'react';
import Iconify from '../../components/ui/Iconify';

interface Integration {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  connected: boolean;
  type: 'accounting' | 'payment' | 'storage' | 'import';
}

const Integrations: React.FC = () => {
  const [services, setServices] = useState<Integration[]>([
    { id: 'gcal', name: 'Google Calendar', desc: 'Sync policy renewals and client meetings automatically.', icon: 'logos:google-calendar', color: 'blue', connected: false, type: 'import' },
    { id: 'gsheets', name: 'Google Sheets', desc: 'Export reports directly to your drive for analysis.', icon: 'vscode-icons:file-type-excel', color: 'emerald', connected: false, type: 'import' },
    { id: 'gdrive', name: 'Google Drive', desc: 'Store policy documents and claim photos securely.', icon: 'logos:google-drive', color: 'amber', connected: false, type: 'storage' },
    { id: 'quickbooks', name: 'QuickBooks Online', desc: 'Sync invoices, payments, and clients with QuickBooks.', icon: 'simple-icons:quickbooks', color: 'blue', connected: false, type: 'accounting' },
    { id: 'xero', name: 'Xero', desc: 'Seamless accounting data synchronization.', icon: 'simple-icons:xero', color: 'blue', connected: false, type: 'accounting' },
    { id: 'paystack', name: 'Paystack', desc: 'Accept payments via Mobile Money and Card.', icon: 'cib:paystack', color: 'emerald', connected: false, type: 'payment' },
  ]);

  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  useEffect(() => {
    // Load connection status from localStorage
    const storedIntegrations = localStorage.getItem('integrations');
    if (storedIntegrations) {
      const connected = JSON.parse(storedIntegrations);
      setServices(prev => prev.map(service => ({
        ...service,
        connected: connected.some((c: any) => c.provider === service.id && c.status === 'active')
      })));
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleToggle = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    if (service.connected) {
      // Disconnect
      if (!window.confirm(`Disconnect ${service.name}?`)) return;
      
      const storedIntegrations = JSON.parse(localStorage.getItem('integrations') || '[]');
      const updated = storedIntegrations.filter((i: any) => i.provider !== id);
      localStorage.setItem('integrations', JSON.stringify(updated));
      
      setServices(prev => prev.map(s => s.id === id ? { ...s, connected: false } : s));
      showNotification(`${service.name} disconnected`, 'info');
    } else {
      // Connect
      const storedIntegrations = JSON.parse(localStorage.getItem('integrations') || '[]');
      storedIntegrations.push({
        provider: id,
        status: 'active',
        connectedAt: new Date().toISOString()
      });
      localStorage.setItem('integrations', JSON.stringify(storedIntegrations));
      
      setServices(prev => prev.map(s => s.id === id ? { ...s, connected: true } : s));
      showNotification(`Connected to ${service.name} successfully!`, 'success');
    }
  };

  const handleSync = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    showNotification(`Syncing ${service.name}... (Demo mode)`, 'info');
    setTimeout(() => {
      showNotification(`${service.name} sync completed!`, 'success');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl border animate-fadeIn ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">
              {notification.type === 'success' ? 'check_circle' : notification.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Integrations & Imports</h1>
        <p className="text-slate-500 font-medium max-w-2xl text-lg">Manage your connections with third-party services and handle bulk data imports for policies, clients, and claims.</p>
      </div>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Available Integrations</h2>
          <div className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">lock</span>
            Encrypted Connection
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="group flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl bg-${s.color}-50 text-${s.color}-600 dark:bg-${s.color}-900/20 dark:text-${s.color}-400 group-hover:scale-110 transition-transform flex items-center justify-center`}>
                  <Iconify icon={s.icon} width={48} />
                </div>
                <button 
                  onClick={() => handleToggle(s.id)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${s.connected ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${s.connected ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2 leading-relaxed">{s.desc}</p>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${s.connected ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className={`size-2 rounded-full ${s.connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                  {s.connected ? 'Connected' : 'Disconnected'}
                </span>
                {s.connected && (
                  <button 
                    onClick={() => handleSync(s.id)}
                    className="text-sm font-black uppercase tracking-widest flex items-center gap-1 transition-colors text-primary hover:text-blue-700"
                  >
                    Sync <span className="material-symbols-outlined text-lg">sync</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Bulk Data Import</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-4">
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group cursor-pointer">
              <div className="bg-primary/10 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
              </div>
              <p className="text-slate-900 dark:text-white text-lg font-black text-center mb-1 uppercase tracking-tight">Click to upload</p>
              <p className="text-slate-500 text-xs font-bold text-center mb-8 uppercase tracking-widest">CSV, XLSX or JSON (max. 10MB)</p>
              <button 
                onClick={() => showNotification('File upload available in full version', 'info')}
                className="bg-primary text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20"
              >
                Browse Files
              </button>
            </div>
          </div>
          
          {/* History */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Recent Imports</h3>
              <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">View Full Logs</button>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white dark:bg-slate-900 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    {['File Name', 'Date', 'Imported By', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                  {[
                    { name: 'clients_q3_2023.csv', date: 'Oct 24, 2023', by: 'Alex J.', status: 'Success', color: 'emerald' },
                    { name: 'new_policies_batch_02.xlsx', date: 'Oct 22, 2023', by: 'Sarah K.', status: 'Success', color: 'emerald' },
                    { name: 'claims_legacy_data.csv', date: 'Oct 20, 2023', by: 'Alex J.', status: 'Failed', color: 'red' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-5 flex items-center gap-3">
                        <span className={`material-symbols-outlined text-${row.color}-600`}>description</span>
                        <span className="font-bold text-slate-900 dark:text-white">{row.name}</span>
                      </td>
                      <td className="px-8 py-5 text-slate-500 font-mono text-xs">{row.date}</td>
                      <td className="px-8 py-5 text-slate-500 font-bold">{row.by}</td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-${row.color}-100 text-${row.color}-700`}>{row.status}</span>
                      </td>
                      <td className="px-8 py-5"><button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">visibility</span></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Integrations;

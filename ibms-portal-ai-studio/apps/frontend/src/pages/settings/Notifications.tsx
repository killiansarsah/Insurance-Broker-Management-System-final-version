
import React from 'react';

const Notifications: React.FC = () => {
  const alerts = [
    { id: 1, type: 'Renewal', title: 'Policy POL-8821 expiring in 3 days', user: 'TechVision Ltd', time: '2 hours ago', priority: 'High', icon: 'timelapse' },
    { id: 2, type: 'Claim', title: 'New claim documentation uploaded', user: 'Dangote Industries', time: '5 hours ago', priority: 'Medium', icon: 'upload_file' },
    { id: 3, type: 'System', title: 'Q3 Financial Report is ready for review', user: 'System Bot', time: '1 day ago', priority: 'Low', icon: 'analytics' },
    { id: 4, type: 'Policy', title: 'Policy POL-9940 has been cancelled', user: 'Leadway Assurance', time: '2 days ago', priority: 'High', icon: 'cancel' },
    { id: 5, type: 'Renewal', title: 'Renewal reminder sent to client', user: 'Acme Logistics', time: '2 days ago', priority: 'Low', icon: 'send' },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">System Notifications</h1>
        <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="flex flex-col gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-6 hover:border-primary/30 transition-colors group cursor-pointer">
            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${
              alert.priority === 'High' ? 'bg-red-50 text-red-600' : alert.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <span className="material-symbols-outlined">{alert.icon}</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{alert.type}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{alert.time}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{alert.title}</h3>
              <p className="text-sm font-bold text-slate-500">Related to: {alert.user}</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-slate-600 transition-all">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

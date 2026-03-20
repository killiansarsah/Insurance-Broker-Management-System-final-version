'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Megaphone, Send, Mail as MailIcon, MonitorSmartphone, Eye, Trash2, Globe, Clock, Tag } from 'lucide-react';

const mockAnnouncements = [
  { id: 'an_1', title: 'Schedule Maintenance Window', type: 'maintenance', target: 'All Tenants', delivery: 'Both', date: '2 hours ago', readRate: 45 },
  { id: 'an_2', title: 'New Multi-Currency Feature', type: 'info', target: 'Enterprise Plan', delivery: 'In-App', date: 'Mar 15, 2026', readRate: 88 },
  { id: 'an_3', title: 'URGENT: Upcoming NIC Server Change', type: 'critical', target: 'All Tenants', delivery: 'Both', date: 'Feb 28, 2026', readRate: 98 },
];

export default function AnnouncementsPage() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'info',
    target: 'all',
    delivery: 'both',
  });
  
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof mockAnnouncements[0] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending announcement:', formData);
    // Submit log...
  };

  const getSeverityColor = (type: string) => {
    switch(type) {
      case 'info': return 'bg-[#e0f2fe] text-[#0284c7]';
      case 'maintenance': return 'bg-[#fef9c3] text-[#ca8a04]';
      case 'critical': return 'bg-[#fee2e2] text-[#b91c1c]';
      default: return 'bg-[#f1f5f9] text-[#475569]';
    }
  };

  return (
    <div className="space-y-6 sa-stagger">
      <PageHeader
        title="Global Broadcasting"
        subtitle="Dispatch critical notices, release notes, and maintenance schedules."
        icon={Megaphone}
        breadcrumbs={[
          { label: 'Overview', href: '/super-admin' },
          { label: 'Announcements', href: '/super-admin/announcements' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        
        {/* Left Col: Composer Form */}
        <div className="xl:col-span-1 lg:col-span-1 border border-[#085041] rounded-sm bg-[#021a13] text-[#f0f4f3] p-5 shadow-sm flex flex-col min-h-[600px]">
          <div className="flex items-center gap-2 text-[#9FE1CB] border-b border-[#05291e] pb-4 mb-6">
            <Megaphone size={18} />
            <h3 className="text-sm font-bold uppercase tracking-widest leading-none">Draft Bulletin</h3>
          </div>
          
          <form className="flex-1 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5]">Headline Title</label>
              <input 
                type="text" 
                required
                placeholder="E.g., System Update v2.4"
                className="w-full p-2 bg-[#05291e] border border-[#085041] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3] placeholder:text-[#38705f]"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5]">Body Content</label>
              <div className="bg-[#05291e] border border-[#085041] rounded-sm p-2 flex gap-2">
                <button type="button" className="text-[#5DCAA5] hover:text-[#9FE1CB] px-2 py-1 bg-[#021a13] text-xs font-bold rounded-sm border border-[#085041]">B</button>
                <button type="button" className="text-[#5DCAA5] hover:text-[#9FE1CB] px-2 py-1 bg-[#021a13] text-xs italic font-serif rounded-sm border border-[#085041]">I</button>
                <button type="button" className="text-[#5DCAA5] hover:text-[#9FE1CB] px-2 py-1 bg-[#021a13] text-xs rounded-sm border border-[#085041]">&lt;/&gt;</button>
              </div>
              <textarea 
                required
                rows={8}
                placeholder="Compose your message here..."
                className="w-full p-3 bg-[#05291e] border border-[#085041] border-t-0 rounded-sm rounded-t-none focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3] placeholder:text-[#38705f] font-sans resize-none"
                value={formData.body}
                onChange={e => setFormData({...formData, body: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5]">Categorisation</label>
                <select 
                  className="w-full p-2 bg-[#05291e] border border-[#085041] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3]"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="info">Information</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="critical">Critical / Outage</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5]">Target Audience</label>
                <select 
                  className="w-full p-2 bg-[#05291e] border border-[#085041] rounded-sm focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3]"
                  value={formData.target}
                  onChange={e => setFormData({...formData, target: e.target.value})}
                >
                  <option value="all">All Tenants</option>
                  <option value="enterprise">Enterprise Plan Only</option>
                  <option value="custom">Select Specific Tenants</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5] block">Delivery Method</label>
              <div className="flex gap-4">
                <label className={`flex-1 border p-3 rounded-sm cursor-pointer transition-colors ${formData.delivery === 'in-app' ? 'border-[#1D9E75] bg-[#05291e]' : 'border-[#085041] hover:border-[#38705f]'}`}>
                  <input type="radio" name="delivery" value="in-app" className="sr-only" checked={formData.delivery === 'in-app'} onChange={e => setFormData({...formData, delivery: e.target.value})} />
                  <div className="flex flex-col items-center gap-2">
                    <MonitorSmartphone size={16} className={formData.delivery === 'in-app' ? 'text-[#9FE1CB]' : 'text-gray-500'} />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-center">In-App Notification</span>
                  </div>
                </label>
                <label className={`flex-1 border p-3 rounded-sm cursor-pointer transition-colors ${formData.delivery === 'email' ? 'border-[#1D9E75] bg-[#05291e]' : 'border-[#085041] hover:border-[#38705f]'}`}>
                  <input type="radio" name="delivery" value="email" className="sr-only" checked={formData.delivery === 'email'} onChange={e => setFormData({...formData, delivery: e.target.value})} />
                  <div className="flex flex-col items-center gap-2">
                    <MailIcon size={16} className={formData.delivery === 'email' ? 'text-[#9FE1CB]' : 'text-gray-500'} />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-center">Email Blast</span>
                  </div>
                </label>
                <label className={`flex-1 border p-3 rounded-sm cursor-pointer transition-colors ${formData.delivery === 'both' ? 'border-[#1D9E75] bg-[#05291e]' : 'border-[#085041] hover:border-[#38705f]'}`}>
                  <input type="radio" name="delivery" value="both" className="sr-only" checked={formData.delivery === 'both'} onChange={e => setFormData({...formData, delivery: e.target.value})} />
                  <div className="flex flex-col items-center gap-2">
                    <Globe size={16} className={formData.delivery === 'both' ? 'text-[#9FE1CB]' : 'text-gray-500'} />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-center">Both Mediums</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="pt-6 mt-6 border-t border-[#05291e] flex gap-3">
              <button type="submit" className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-[#1D9E75] text-[#021a13] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#3BB58D] transition-colors sa-btn-hover">
                <Send size={14} /> Dispatch Transmission
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Sent Logs */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#d4e0dc] p-4 rounded-sm shadow-sm flex flex-col justify-end">
              <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Total Dispatches (30d)</div>
              <div className="font-mono text-2xl text-[#1D9E75]">24</div>
            </div>
            <div className="bg-white border border-[#d4e0dc] p-4 rounded-sm shadow-sm flex flex-col justify-end">
              <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Avg Read Rate (In-App)</div>
              <div className="font-mono text-2xl text-[#0369a1]">62%</div>
            </div>
            <div className="bg-white border border-[#d4e0dc] p-4 rounded-sm shadow-sm flex flex-col justify-end">
              <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Avg Email Open Rate</div>
              <div className="font-mono text-2xl text-[#ca8a04]">34%</div>
            </div>
          </div>

          <div className="bg-white rounded-sm border border-[#d4e0dc] shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="p-4 border-b border-[#d4e0dc] bg-[#f8faf9] flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-[#0c6a55] flex items-center gap-2">
                <Clock size={16} /> Broadcast History
              </h3>
            </div>
            
            <ul className="divide-y divide-[#f0f4f3] flex-1 overflow-y-auto">
              {mockAnnouncements.map((ann) => (
                <li key={ann.id} className="p-4 hover:bg-[#f8faf9] transition-colors sa-card-hover group cursor-pointer" onClick={() => setSelectedAnnouncement(ann)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                      <span className={`text-[9px] px-2 py-0.5 rounded-sm font-mono tracking-wider uppercase font-bold ${getSeverityColor(ann.type)}`}>
                        {ann.type}
                      </span>
                      <h4 className="font-bold text-gray-900 group-hover:text-[#1D9E75] transition-colors">{ann.title}</h4>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">{ann.date}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mt-3 align-middle">
                    <span className="flex items-center gap-1.5"><Tag size={12} /> {ann.target}</span>
                    <span className="flex items-center gap-1.5"><Globe size={12} /> {ann.delivery}</span>
                    <span className="flex items-center gap-1.5 font-bold text-[#1D9E75]"><Eye size={12} /> {ann.readRate}% Read</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

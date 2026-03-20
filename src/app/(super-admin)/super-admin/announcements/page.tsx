'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/super-admin/PageHeader';
import { StatusPill } from '@/components/super-admin/StatusPill';
import { Megaphone, Send, Mail as MailIcon, MonitorSmartphone, Eye, Trash2, Globe, Clock, Tag } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { useLiveMetric } from '@/hooks/super-admin/useLiveMetric';

interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  type: string;
  targetType: string;
  delivery: string;
  isPinned: boolean;
  sentAt: string | null;
  createdAt: string;
  _count: { reads: number };
  createdBy: { firstName: string; lastName: string } | null;
}

interface AnnouncementsResponse {
  data: AnnouncementRow[];
  meta?: { total: number; page: number; limit: number };
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'INFO',
    target: 'ALL',
    delivery: 'BOTH',
  });

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await apiClient.get<AnnouncementsResponse>('/platform-admin/announcements');
      setAnnouncements(res.data ?? []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error('Title and body are required.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/platform-admin/announcements', {
        title: formData.title,
        body: formData.body,
        type: formData.type,
        targetType: formData.target,
        delivery: formData.delivery,
      });
      toast.success('Announcement broadcasted successfully!', {
        description: `"${formData.title}" dispatched to ${formData.target === 'ALL' ? 'all tenants' : 'selected tenants'}.`,
      });
      setFormData({ title: '', body: '', type: 'INFO', target: 'ALL', delivery: 'BOTH' });
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to send announcement:', err);
      toast.error('Failed to dispatch announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/platform-admin/announcements/${id}`);
      toast.success('Announcement deleted.');
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      toast.error('Failed to delete announcement.');
    }
  };

  const getSeverityColor = (type: string) => {
    switch(type?.toUpperCase()) {
      case 'INFO': return 'bg-[#e0f2fe] text-[#0284c7]';
      case 'MAINTENANCE': return 'bg-[#fef9c3] text-[#ca8a04]';
      case 'CRITICAL': return 'bg-[#fee2e2] text-[#b91c1c]';
      case 'WARNING': return 'bg-[#ffedd5] text-[#c2410c]';
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
        <div className="xl:col-span-1 lg:col-span-1 border border-[#085041] rounded-[var(--sa-radius-md)] bg-[#021a13] text-[#f0f4f3] p-5 shadow-sm flex flex-col min-h-[600px]">
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
                className="w-full p-2 bg-[#05291e] border border-[#085041] rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3] placeholder:text-[#38705f]"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5]">Body Content</label>
              <textarea 
                required
                rows={8}
                placeholder="Compose your message here..."
                className="w-full p-3 bg-[#05291e] border border-[#085041] rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3] placeholder:text-[#38705f] font-sans resize-none"
                value={formData.body}
                onChange={e => setFormData({...formData, body: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5]">Categorisation</label>
                <select 
                  className="w-full p-2 bg-[#05291e] border border-[#085041] rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3]"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="INFO">Information</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="WARNING">Warning</option>
                  <option value="CRITICAL">Critical / Outage</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5]">Target Audience</label>
                <select 
                  className="w-full p-2 bg-[#05291e] border border-[#085041] rounded-[var(--sa-radius-md)] focus:ring-2 focus:ring-[#1D9E75] focus:outline-none text-[#f0f4f3]"
                  value={formData.target}
                  onChange={e => setFormData({...formData, target: e.target.value})}
                >
                  <option value="ALL">All Tenants</option>
                  <option value="BY_PLAN">Enterprise Plan Only</option>
                  <option value="SPECIFIC">Select Specific Tenants</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5DCAA5] block">Delivery Method</label>
              <div className="flex gap-4">
                {[
                  { value: 'IN_APP', icon: MonitorSmartphone, label: 'In-App Notification' },
                  { value: 'EMAIL', icon: MailIcon, label: 'Email Blast' },
                  { value: 'BOTH', icon: Globe, label: 'Both Mediums' },
                ].map(opt => (
                  <label key={opt.value} className={`flex-1 border p-3 rounded-[var(--sa-radius-md)] cursor-pointer transition-colors ${formData.delivery === opt.value ? 'border-[#1D9E75] bg-[#05291e]' : 'border-[#085041] hover:border-[#38705f]'}`}>
                    <input type="radio" name="delivery" value={opt.value} className="sr-only" checked={formData.delivery === opt.value} onChange={e => setFormData({...formData, delivery: e.target.value})} />
                    <div className="flex flex-col items-center gap-2">
                      <opt.icon size={16} className={formData.delivery === opt.value ? 'text-[#9FE1CB]' : 'text-gray-500'} />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-center">{opt.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="pt-6 mt-6 border-t border-[#05291e] flex gap-3">
              <button 
                type="submit" 
                disabled={submitting}
                className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-[#1D9E75] text-[#021a13] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#3BB58D] transition-colors sa-btn-hover disabled:opacity-50">
                <Send size={14} /> {submitting ? 'Dispatching...' : 'Dispatch Transmission'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Sent Logs */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] p-4 rounded-[var(--sa-radius-md)] shadow-sm flex flex-col justify-end">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--sa-text-muted)] mb-2">Total Dispatches (30d)</div>
              <div className="font-mono text-2xl text-[#1D9E75]">{announcements.length}</div>
            </div>
            <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] p-4 rounded-[var(--sa-radius-md)] shadow-sm flex flex-col justify-end">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--sa-text-muted)] mb-2">Avg Read Rate (In-App)</div>
              <div className="font-mono text-2xl text-[#0369a1]">
                {announcements.length > 0 ? Math.round(announcements.reduce((sum, a) => sum + (a._count?.reads ?? 0), 0) / announcements.length) : 0}
              </div>
            </div>
            <div className="bg-[var(--sa-bg-card)] border border-[var(--sa-border)] p-4 rounded-[var(--sa-radius-md)] shadow-sm flex flex-col justify-end">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--sa-text-muted)] mb-2">Pinned Active</div>
              <div className="font-mono text-2xl text-[#ca8a04]">{announcements.filter(a => a.isPinned).length}</div>
            </div>
          </div>

          <div className="bg-[var(--sa-bg-card)] rounded-[var(--sa-radius-md)] border border-[var(--sa-border)] shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="p-4 border-b border-[var(--sa-border)] bg-[var(--sa-bg-card-alt)] flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] flex items-center gap-2">
                <Clock size={16} /> Broadcast History
              </h3>
            </div>
            
            {loading ? (
              <div className="p-6 text-center text-[var(--sa-text-muted)]">Loading announcements...</div>
            ) : announcements.length === 0 ? (
              <div className="p-12 text-center text-[var(--sa-text-muted)]">No announcements dispatched yet.</div>
            ) : (
              <ul className="divide-y divide-[var(--sa-border)] flex-1 overflow-y-auto">
                {announcements.map((ann) => (
                  <li key={ann.id} className="p-4 hover:bg-[var(--sa-bg-card-alt)] transition-colors sa-card-hover group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 items-center">
                        <span className={`text-[9px] px-2 py-0.5 rounded-sm font-mono tracking-wider uppercase font-bold ${getSeverityColor(ann.type)}`}>
                          {ann.type}
                        </span>
                        <h4 className="font-bold text-[var(--sa-text-primary)] group-hover:text-[#1D9E75] transition-colors">{ann.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[var(--sa-text-muted)]">{timeAgo(ann.sentAt ?? ann.createdAt)}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(ann.id); }}
                          className="p-1 text-[var(--sa-text-muted)] hover:text-[#b91c1c] transition-colors rounded-full hover:bg-[#fee2e2]">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--sa-text-muted)] mt-3 align-middle">
                      <span className="flex items-center gap-1.5"><Tag size={12} /> {ann.targetType}</span>
                      <span className="flex items-center gap-1.5"><Globe size={12} /> {ann.delivery}</span>
                      <span className="flex items-center gap-1.5 font-bold text-[#1D9E75]"><Eye size={12} /> {ann._count?.reads ?? 0} reads</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

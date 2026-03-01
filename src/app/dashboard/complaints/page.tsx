'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    AlertTriangle,
    Plus,
    Filter,
    ArrowUpRight,
    Clock,
    User,
    CheckCircle2,
    Search
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/data-display/status-badge';
import { DataTable } from '@/components/data-display/data-table';
import { MOCK_COMPLAINTS } from '@/mock/documents-complaints';
import { formatDate, cn } from '@/lib/utils';
import { Complaint } from '@/types';

import { NewComplaintModal } from '@/components/complaints/new-complaint-modal';
import { toast } from 'sonner';

export default function ComplaintsPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState('all');
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const filtered = statusFilter === 'all'
        ? MOCK_COMPLAINTS
        : MOCK_COMPLAINTS.filter(c => c.status === statusFilter);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Complaints</h1>
                    <p className="text-sm text-surface-500 mt-1">Track regulatory disputes and resolve client issues.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Filter size={16} />} onClick={() => toast.info('Complaint filters', { description: 'Advanced filtering coming soon.' })}>Filter Log</Button>
                    <Button
                        variant="primary"
                        leftIcon={<Plus size={16} />}
                        onClick={() => setIsNewModalOpen(true)}
                    >
                        Log New Complaint
                    </Button>
                </div>
            </div>

            <NewComplaintModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
            />

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="md" className="flex items-center gap-4 bg-danger-50/30 border-danger-100">
                    <div className="p-3 rounded-full bg-danger-50 text-danger-600"><AlertTriangle size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Attention Needed</p>
                        <p className="text-2xl font-bold text-danger-900">{MOCK_COMPLAINTS.filter(c => c.priority === 'high').length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4 bg-warning-50/30 border-warning-100">
                    <div className="p-3 rounded-full bg-warning-50 text-warning-600"><Clock size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">SLA Imminent</p>
                        <p className="text-2xl font-bold text-warning-900">1</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4 bg-success-50/30 border-success-100">
                    <div className="p-3 rounded-full bg-success-50 text-success-600"><CheckCircle2 size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Resolved Today</p>
                        <p className="text-2xl font-bold text-success-900">1</p>
                    </div>
                </Card>
            </div>

            {/* List */}
            <Card padding="none" className="overflow-hidden border-surface-200">
                <CardHeader
                    title="Complaint Log"
                    subtitle="NIC-required tracking of client disputes"
                />
                <DataTable<Complaint>
                    data={filtered}
                    columns={[
                        { key: 'complaintNumber', label: 'ID', render: (c) => <span className="font-mono text-xs">{c.complaintNumber}</span> },
                        { key: 'subject', label: 'Subject', render: (c) => <span className="font-bold text-surface-900">{c.subject}</span> },
                        { key: 'complainantName', label: 'Complainant' },
                        { key: 'status', label: 'Status', render: (c) => <StatusBadge status={c.status} /> },
                        { key: 'priority', label: 'Priority', render: (c) => <StatusBadge status={c.priority} showDot={false} /> },
                        {
                            key: 'escalationLevel', label: 'Escalation', render: (c) => (
                                <Badge variant={c.escalationLevel > 0 ? 'warning' : 'outline'}>
                                    {c.escalationLevel === 0 ? 'Brokerage' : c.escalationLevel === 1 ? 'Compliance' : 'NIC'}
                                </Badge>
                            )
                        },
                        { key: 'createdAt', label: 'Logged', render: (c) => formatDate(c.createdAt) },
                    ]}
                    searchKeys={['subject', 'complainantName', 'complaintNumber']}
                    onRowClick={(c) => router.push(`/dashboard/complaints/${c.id}`)}
                />
            </Card>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle,
    CheckCircle2,
    FileText,
    MessageSquare,
    User,
    Shield,
    Flag
} from 'lucide-react';
import { toast } from 'sonner';

interface NewComplaintModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewComplaintModal({ isOpen, onClose }: NewComplaintModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [complainant, setComplainant] = useState('');
    const [policyNo, setPolicyNo] = useState('');
    const [type, setType] = useState('service');
    const [priority, setPriority] = useState('medium');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        toast.success('Complaint Logged', {
            description: `Complaint #${Math.floor(Math.random() * 10000)} has been registered.`,
            icon: <CheckCircle2 className="text-success-500" size={18} />
        });

        // Reset
        setSubject('');
        setComplainant('');
        setPolicyNo('');
        setDescription('');
        setIsLoading(false);
        onClose();
    };

    const footer = (
        <div className="flex gap-3 w-full">
            <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
                Cancel
            </Button>
            <Button
                variant="primary"
                className="flex-[2]"
                onClick={handleSubmit}
                isLoading={isLoading}
                leftIcon={<AlertTriangle size={18} />}
            >
                Log Complaint
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Log New Complaint"
            description="Register a client dispute for regulatory tracking."
            size="lg"
            footer={footer}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Complainant Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <User size={12} /> Complainant Name <span className="text-danger-500">*</span>
                        </label>
                        <input
                            required
                            autoFocus
                            type="text"
                            value={complainant}
                            onChange={(e) => setComplainant(e.target.value)}
                            placeholder="e.g. Ama Ghana"
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <Shield size={12} /> Policy Number (Optional)
                        </label>
                        <input
                            type="text"
                            value={policyNo}
                            onChange={(e) => setPolicyNo(e.target.value)}
                            placeholder="e.g. POL-2024-001"
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm"
                        />
                    </div>
                </div>

                {/* Complaint Details */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={12} /> Subject / Summary <span className="text-danger-500">*</span>
                    </label>
                    <input
                        required
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Delay in claim settlement"
                        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-bold text-surface-800"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <Flag size={12} /> Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm bg-white"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High (Immediate Action)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <AlertTriangle size={12} /> Category
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm bg-white"
                        >
                            <option value="service">Service Quality</option>
                            <option value="claims">Claims Dispute</option>
                            <option value="policy">Policy Terms</option>
                            <option value="billing">Billing / Commission</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare size={12} /> Detailed Description
                    </label>
                    <textarea
                        required
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide full details of the customer's complaint..."
                        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm resize-none"
                    />
                </div>
            </form>
        </Modal>
    );
}

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
        <div className="flex justify-center gap-3 w-full">
            <button
                type="button"
                onClick={onClose}
                className="py-3 px-8 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                type="button"
                className="py-3 px-12 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm"
            >
                Log Complaint
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Log New Complaint"
            description="Register a client dispute for regulatory tracking."
            size="xl"
            footer={footer}
            className="overflow-visible"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <User size={12} className="text-primary-500" /> Complainant Name
                        </label>
                        <input
                            required
                            autoFocus
                            type="text"
                            value={complainant}
                            onChange={(e) => setComplainant(e.target.value)}
                            placeholder="e.g. Ama Ghana"
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400 bg-white/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Shield size={12} className="text-primary-500" /> Policy Number (Optional)
                        </label>
                        <input
                            type="text"
                            value={policyNo}
                            onChange={(e) => setPolicyNo(e.target.value)}
                            placeholder="e.g. POL-2024-001"
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 shadow-sm placeholder:text-surface-400 bg-white/50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <FileText size={12} className="text-primary-500" /> Subject / Summary
                    </label>
                    <input
                        required
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Delay in claim settlement"
                        className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 shadow-sm placeholder:text-surface-400"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Flag size={12} className="text-danger-500" /> Priority
                        </label>
                        <div className="relative">
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 appearance-none cursor-pointer"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High (Immediate Action)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <AlertTriangle size={12} className="text-accent-500" /> Category
                        </label>
                        <div className="relative">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 appearance-none cursor-pointer"
                            >
                                <option value="service">Service Quality</option>
                                <option value="claims">Claims Dispute</option>
                                <option value="policy">Policy Terms</option>
                                <option value="billing">Billing / Commission</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MessageSquare size={12} className="text-surface-400" /> Detailed Description
                    </label>
                    <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide full details of the customer's complaint for our records..."
                        className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 bg-white/50 shadow-sm placeholder:text-surface-400 resize-none"
                    />
                </div>
            </form>
        </Modal>
    );
}

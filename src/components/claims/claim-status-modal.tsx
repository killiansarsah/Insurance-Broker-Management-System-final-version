'use client';

import { useState } from 'react';
import {
    CheckCircle2,
    XCircle,
    Search,
    DollarSign,
    Clock,
    AlertCircle,
    FileText,
    ShieldCheck
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect } from '@/components/ui/select-custom';
import { Claim, ClaimStatus } from '@/types';
import { cn } from '@/lib/utils';

interface ClaimStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    claim: Claim;
    onUpdate: (updatedClaim: Partial<Claim>) => void;
}

const statusOptions = [
    { label: 'Registered', value: 'registered', icon: <FileText size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Under Review', value: 'under_review', icon: <Clock size={16} />, color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Assessed', value: 'assessed', icon: <Search size={16} />, color: 'text-info-600', bg: 'bg-info-50' },
    { label: 'Approved', value: 'approved', icon: <ShieldCheck size={16} />, color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Settled', value: 'settled', icon: <DollarSign size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejected', value: 'rejected', icon: <XCircle size={16} />, color: 'text-error-600', bg: 'bg-error-50' },
];

export function ClaimStatusModal({ isOpen, onClose, claim, onUpdate }: ClaimStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<ClaimStatus>(claim.status);
    const [amount, setAmount] = useState<string>(
        (selectedStatus === 'settled' ? claim.settledAmount : selectedStatus === 'assessed' ? claim.assessedAmount : 0)?.toString() || ''
    );
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const updates: Partial<Claim> = {
            status: selectedStatus,
            updatedAt: new Date().toISOString(),
        };

        if (selectedStatus === 'assessed') {
            updates.assessedAmount = parseFloat(amount);
            updates.assessmentDate = new Date().toISOString();
        } else if (selectedStatus === 'approved') {
            updates.approvalDate = new Date().toISOString();
        } else if (selectedStatus === 'settled') {
            updates.settledAmount = parseFloat(amount);
            updates.settlementDate = new Date().toISOString();
        } else if (selectedStatus === 'rejected') {
            updates.delayReason = note; // Using delayReason as a proxy for rejection reason in mock
        }

        onUpdate(updates);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Claim Status"
            description={`Updating status for claim ${claim.claimNumber}`}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Selection Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedStatus(option.value as ClaimStatus)}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all active:scale-95 text-center gap-2",
                                selectedStatus === option.value
                                    ? "bg-white border-primary-500 shadow-lg shadow-primary-500/10"
                                    : "bg-surface-50 border-transparent hover:border-surface-200"
                            )}
                        >
                            <div className={cn("p-2 rounded-full", option.bg, option.color)}>
                                {option.icon}
                            </div>
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider",
                                selectedStatus === option.value ? "text-primary-600" : "text-surface-500"
                            )}>
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Dynamic Fields */}
                {(selectedStatus === 'assessed' || selectedStatus === 'settled') && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                            {selectedStatus === 'assessed' ? 'Assessed Amount' : 'Settlement Amount'} (GHS)
                        </label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="bg-white border-surface-200"
                            required
                        />
                    </div>
                )}

                {selectedStatus === 'rejected' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                            Rejection Reason
                        </label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Explain why the claim was rejected..."
                            className="bg-white border-surface-200 min-h-[100px]"
                            required
                        />
                    </div>
                )}

                {selectedStatus !== 'rejected' && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                            Internal Note (Optional)
                        </label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add any internal details about this update..."
                            className="bg-white border-surface-200 min-h-[80px]"
                        />
                    </div>
                )}

                {/* NIC Compliance Info */}
                <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-primary-600 mt-0.5" size={18} />
                    <div className="text-[11px] leading-relaxed text-primary-800">
                        <p className="font-bold uppercase tracking-tight mb-1">NIC Compliance Reminder</p>
                        <p>Updating status will be logged in the audit trail. Ensure all supporting documents are verified before final approval or settlement.</p>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Confirm Update
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

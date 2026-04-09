'use client';

import { useState } from 'react';
import {
    XCircle,
    Search,
    DollarSign,
    Clock,
    AlertCircle,
    FileText,
    ShieldCheck,
    RefreshCw,
    CheckCircle2,
    Archive,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    useAcknowledgeClaim,
    useInvestigateClaim,
    useUpdateClaim,
    useApproveClaim,
    useRejectClaim,
    useSettleClaim,
    useReopenClaim,
} from '@/hooks/api/use-claims';
import { Claim, ClaimStatus } from '@/types';
import { cn } from '@/lib/utils';

interface ClaimStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    claim: Claim;
    onUpdate: (updatedClaim: Partial<Claim>) => void;
}

// ─── Standard Brokerium Claim Workflow ─────────────────────────────────────────────
// INTIMATED → REGISTERED     (Acknowledge — NIC 5 business day rule)
// REGISTERED → UNDER_REVIEW  (Investigate — assign loss adjuster)
// UNDER_REVIEW → ASSESSED    (Assess — record loss amount after survey)
// UNDER_REVIEW → REJECTED    (Reject — must provide reason)
// ASSESSED → APPROVED        (Approve — confirm final amount)
// APPROVED → SETTLED         (Settle — record payment details)
// REJECTED → UNDER_REVIEW    (Reopen — dispute/new evidence)
// SETTLED → CLOSED           (Close — archive)
// ──────────────────────────────────────────────────────────────────────────────

type TransitionConfig = {
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
    requiresAmount?: 'assessed' | 'approved' | 'settled';
    requiresReason?: boolean;
    requiresPayment?: boolean;
    requiresNote?: boolean;
    requiresAssessor?: boolean;
    noteLabel?: string;
};

const VALID_TRANSITIONS: Record<ClaimStatus, Partial<Record<ClaimStatus, TransitionConfig>>> = {
    INTIMATED: {
        REGISTERED: {
            label: 'Acknowledge',
            description: 'Formally register and acknowledge receipt of this claim (NIC requirement)',
            icon: <FileText size={16} />,
            color: 'text-blue-700',
            bg: 'bg-blue-50',
            border: 'border-blue-300',
            requiresNote: true,
            noteLabel: 'Acknowledgment Note (optional)',
        },
    },
    REGISTERED: {
        UNDER_REVIEW: {
            label: 'Start Investigation',
            description: 'Assign a loss adjuster and begin the claims investigation process',
            icon: <Search size={16} />,
            color: 'text-warning-700',
            bg: 'bg-warning-50',
            border: 'border-warning-300',
            requiresAssessor: true,
            requiresNote: true,
            noteLabel: 'Investigation Notes (optional)',
        },
    },
    DOCUMENTS_PENDING: {
        UNDER_REVIEW: {
            label: 'Start Investigation',
            description: 'Begin investigation after documents have been received',
            icon: <Search size={16} />,
            color: 'text-warning-700',
            bg: 'bg-warning-50',
            border: 'border-warning-300',
            requiresAssessor: true,
        },
    },
    UNDER_REVIEW: {
        ASSESSED: {
            label: 'Record Assessment',
            description: 'Record the loss adjuster\'s assessed damage/loss amount',
            icon: <DollarSign size={16} />,
            color: 'text-info-700',
            bg: 'bg-info-50',
            border: 'border-info-300',
            requiresAmount: 'assessed',
            requiresNote: true,
            noteLabel: 'Assessment Summary',
        },
        REJECTED: {
            label: 'Reject Claim',
            description: 'Reject this claim — a detailed reason is required for NIC compliance',
            icon: <XCircle size={16} />,
            color: 'text-danger-700',
            bg: 'bg-danger-50',
            border: 'border-danger-300',
            requiresReason: true,
        },
    },
    ASSESSED: {
        APPROVED: {
            label: 'Approve Claim',
            description: 'Formally approve the claim and confirm the approved settlement amount',
            icon: <ShieldCheck size={16} />,
            color: 'text-success-700',
            bg: 'bg-success-50',
            border: 'border-success-300',
            requiresAmount: 'approved',
            requiresNote: true,
            noteLabel: 'Approval Notes (optional)',
        },
        REJECTED: {
            label: 'Reject Claim',
            description: 'Reject after assessment — a detailed reason is required',
            icon: <XCircle size={16} />,
            color: 'text-danger-700',
            bg: 'bg-danger-50',
            border: 'border-danger-300',
            requiresReason: true,
        },
    },
    APPROVED: {
        SETTLED: {
            label: 'Process Settlement',
            description: 'Record the payment details and mark this claim as settled',
            icon: <CheckCircle2 size={16} />,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            border: 'border-emerald-300',
            requiresAmount: 'settled',
            requiresPayment: true,
            requiresNote: true,
            noteLabel: 'Settlement Notes (optional)',
        },
    },
    REJECTED: {
        UNDER_REVIEW: {
            label: 'Reopen Claim',
            description: 'Reopen this claim for re-investigation (new evidence or appeal)',
            icon: <RefreshCw size={16} />,
            color: 'text-primary-700',
            bg: 'bg-primary-50',
            border: 'border-primary-300',
            requiresReason: true,
        },
    },
    SETTLED: {
        CLOSED: {
            label: 'Close Claim',
            description: 'Archive this claim — all payments verified and file complete',
            icon: <Archive size={16} />,
            color: 'text-surface-700',
            bg: 'bg-surface-50',
            border: 'border-surface-300',
            requiresNote: true,
            noteLabel: 'Closing Notes (optional)',
        },
    },
    CLOSED: {},
};

const PAYMENT_METHODS = [
    { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
    { label: 'Cheque', value: 'CHEQUE' },
    { label: 'Mobile Money (MTN)', value: 'MOBILE_MONEY_MTN' },
    { label: 'Mobile Money (Telecel)', value: 'MOBILE_MONEY_TELECEL' },
    { label: 'Cash', value: 'CASH' },
];

export function ClaimStatusModal({ isOpen, onClose, claim, onUpdate }: ClaimStatusModalProps) {
    const validMoves = VALID_TRANSITIONS[claim.status] ?? {};
    const targetStatuses = Object.keys(validMoves) as ClaimStatus[];

    const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | null>(
        targetStatuses.length === 1 ? targetStatuses[0] : null
    );
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [reason, setReason] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
    const [paymentReference, setPaymentReference] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const acknowledgeClaim = useAcknowledgeClaim();
    const investigateClaim = useInvestigateClaim();
    const updateClaim = useUpdateClaim();
    const approveClaim = useApproveClaim();
    const rejectClaim = useRejectClaim();
    const settleClaim = useSettleClaim();
    const reopenClaim = useReopenClaim();

    const config = selectedStatus ? validMoves[selectedStatus] : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStatus || !config) return;

        // Validate required fields
        if (config.requiresAmount && !amount) {
            toast.error('Amount required', { description: 'Please enter the amount to proceed.' });
            return;
        }
        if ((config.requiresReason) && reason.trim().length < 10) {
            toast.error('Reason too short', { description: 'Please provide at least 10 characters explaining the reason.' });
            return;
        }
        if (config.requiresPayment && !paymentReference.trim()) {
            toast.error('Payment reference required', { description: 'Enter the payment reference or transaction ID.' });
            return;
        }

        setIsSubmitting(true);
        try {
            let updates: Partial<Claim> = { status: selectedStatus, updatedAt: new Date().toISOString() };

            switch (selectedStatus) {
                case 'REGISTERED':
                    await acknowledgeClaim.mutateAsync({ id: claim.id, data: { notes: note || undefined } });
                    updates.registrationDate = new Date().toISOString();
                    break;

                case 'UNDER_REVIEW':
                    if (claim.status === 'REJECTED') {
                        await reopenClaim.mutateAsync({ id: claim.id, reason: reason || 'Claim reopened for re-investigation' });
                    } else {
                        await investigateClaim.mutateAsync({ id: claim.id, data: { notes: note || undefined, assignedTo: assignedTo || undefined } });
                    }
                    break;

                case 'ASSESSED':
                    // Use generic update with assessed amount — backend UpdateClaimDto doesn't have status,
                    // so we directly update via PATCH with the assessedAmount field added to the claim
                    await updateClaim.mutateAsync({
                        id: claim.id,
                        data: { assessedAmount: parseFloat(amount), notes: note || undefined },
                    });
                    updates.assessedAmount = parseFloat(amount);
                    updates.assessmentDate = new Date().toISOString();
                    break;

                case 'APPROVED':
                    await approveClaim.mutateAsync({
                        id: claim.id,
                        data: { approvedAmount: parseFloat(amount), notes: note || undefined },
                    });
                    updates.approvalDate = new Date().toISOString();
                    updates.assessedAmount = parseFloat(amount);
                    break;

                case 'REJECTED':
                    await rejectClaim.mutateAsync({ id: claim.id, reason });
                    break;

                case 'SETTLED':
                    await settleClaim.mutateAsync({
                        id: claim.id,
                        data: {
                            settledAmount: parseFloat(amount),
                            paymentMethod,
                            paymentReference: paymentReference || undefined,
                            notes: note || undefined,
                        },
                    });
                    updates.settledAmount = parseFloat(amount);
                    updates.settlementDate = new Date().toISOString();
                    break;

                case 'CLOSED':
                    await updateClaim.mutateAsync({ id: claim.id, data: { notes: note || undefined } });
                    break;
            }

            onUpdate(updates);
            toast.success('Claim updated', {
                description: `${claim.claimNumber} → ${config.label}`,
            });
            onClose();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to update claim status';
            toast.error('Update Failed', { description: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isTerminal = targetStatuses.length === 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Claim Status"
            description={`Current status: ${claim.status} — ${claim.claimNumber}`}
            size="md"
        >
            {isTerminal ? (
                <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto">
                        <Archive size={20} className="text-surface-500" />
                    </div>
                    <p className="text-sm font-semibold text-surface-700">This claim is closed</p>
                    <p className="text-xs text-surface-400">No further status transitions are available.</p>
                    <Button variant="outline" onClick={onClose} className="mt-2">Close</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Transition Options */}
                    {targetStatuses.length > 1 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Select Next Action</p>
                            <div className="grid grid-cols-1 gap-2">
                                {targetStatuses.map((status) => {
                                    const cfg = validMoves[status]!;
                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => {
                                                setSelectedStatus(status);
                                                setAmount('');
                                                setNote('');
                                                setReason('');
                                            }}
                                            className={cn(
                                                'flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                                                selectedStatus === status
                                                    ? `${cfg.bg} ${cfg.border} shadow-sm`
                                                    : 'bg-surface-50 border-transparent hover:border-surface-200'
                                            )}
                                        >
                                            <div className={cn('p-2 rounded-lg', cfg.bg, cfg.color)}>{cfg.icon}</div>
                                            <div>
                                                <p className={cn('text-sm font-bold', selectedStatus === status ? cfg.color : 'text-surface-700')}>{cfg.label}</p>
                                                <p className="text-xs text-surface-500">{cfg.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Single option — show description inline */}
                    {targetStatuses.length === 1 && config && (
                        <div className={cn('flex items-start gap-3 p-4 rounded-xl border-2', config.bg, config.border)}>
                            <div className={cn('p-2 rounded-lg mt-0.5', config.bg, config.color)}>{config.icon}</div>
                            <div>
                                <p className={cn('text-sm font-bold', config.color)}>{config.label}</p>
                                <p className="text-xs text-surface-600 mt-0.5">{config.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Dynamic Fields */}
                    {config && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            {/* Amount field */}
                            {config.requiresAmount && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                                        {config.requiresAmount === 'assessed' ? 'Assessed Loss Amount'
                                            : config.requiresAmount === 'approved' ? 'Approved Amount'
                                                : 'Settlement Amount'} (GHS)
                                    </label>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder={`e.g. ${claim.claimAmount?.toLocaleString()}`}
                                        className="bg-surface-50"
                                        required
                                        min={0}
                                    />
                                    {config.requiresAmount === 'approved' && claim.assessedAmount && (
                                        <p className="text-xs text-surface-400">Assessed at: GHS {Number(claim.assessedAmount).toLocaleString()}</p>
                                    )}
                                </div>
                            )}

                            {/* Assessor selection */}
                            {config.requiresAssessor && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                                        Assign Loss Adjuster / Investigator (Optional)
                                    </label>
                                    <Input
                                        type="text"
                                        value={assignedTo}
                                        onChange={(e) => setAssignedTo(e.target.value)}
                                        placeholder="Name or email of the assigned investigator..."
                                        className="bg-surface-50"
                                    />
                                </div>
                            )}

                            {/* Payment method + reference (settlement only) */}
                            {config.requiresPayment && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Payment Method</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full rounded-[var(--radius-md)] border border-surface-300 px-3 py-2 text-sm bg-white"
                                        >
                                            {PAYMENT_METHODS.map(m => (
                                                <option key={m.value} value={m.value}>{m.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Payment Reference</label>
                                        <Input
                                            type="text"
                                            value={paymentReference}
                                            onChange={(e) => setPaymentReference(e.target.value)}
                                            placeholder="TXN-12345 / Cheque No."
                                            className="bg-surface-50"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Reason field (rejection/reopen) */}
                            {config.requiresReason && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                                        {selectedStatus === 'REJECTED' ? 'Rejection Reason' : 'Reason for Reopening'}
                                        <span className="text-danger-500 ml-1">*</span>
                                    </label>
                                    <Textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder={selectedStatus === 'REJECTED'
                                            ? 'State clearly why this claim is being rejected (min. 10 characters)...'
                                            : 'Explain why the claim is being reopened (new evidence, appeal, etc.)...'}
                                        className="bg-surface-50 min-h-[90px]"
                                        required
                                    />
                                </div>
                            )}

                            {/* Optional note */}
                            {config.requiresNote && !config.requiresReason && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                                        {config.noteLabel || 'Internal Note'}
                                    </label>
                                    <Textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add any internal details about this update..."
                                        className="bg-surface-50 min-h-[75px]"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* NIC Compliance Info */}
                    <div className="bg-primary-50 border border-primary-100 p-3 rounded-xl flex items-start gap-2.5">
                        <AlertCircle className="text-primary-600 mt-0.5 shrink-0" size={15} />
                        <p className="text-[11px] leading-relaxed text-primary-800">
                            <span className="font-bold">NIC Compliance:</span> All status changes are audit-logged. Ensure documents are verified and approvals meet the NIC regulatory requirements before proceeding.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-surface-100">
                        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!selectedStatus || isSubmitting}
                            isLoading={isSubmitting}
                        >
                            {config ? config.label : 'Select an action'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

import { cn } from '@/lib/utils';
import type {
    ClientStatus,
    KycStatus,
    AmlRiskLevel,
    PolicyStatus,
    LeadStatus,
    LeadPriority,
    ClaimStatus,
    ComplaintStatus,
} from '@/types';

type StatusType =
    | ClientStatus
    | KycStatus
    | AmlRiskLevel
    | PolicyStatus
    | LeadStatus
    | LeadPriority
    | ClaimStatus
    | ComplaintStatus
    | 'earned' | 'paid' | 'clawback' | 'clawed_back'
    | 'outstanding' | 'overdue' | 'partial' | 'refunded'
    | 'approved' | 'pending';

const STATUS_STYLES: Record<string, string> = {
    // Client
    active: 'bg-success-50 text-success-700 ring-success-200',
    inactive: 'bg-surface-100 text-surface-600 ring-surface-200',
    suspended: 'bg-accent-50 text-accent-700 ring-accent-200',
    blacklisted: 'bg-danger-50 text-danger-700 ring-danger-200',

    // KYC
    pending: 'bg-accent-50 text-accent-700 ring-accent-200',
    verified: 'bg-success-50 text-success-700 ring-success-200',
    rejected: 'bg-danger-50 text-danger-700 ring-danger-200',
    expired: 'bg-surface-100 text-surface-600 ring-surface-200',

    // AML Risk
    low: 'bg-success-50 text-success-700 ring-success-200',
    medium: 'bg-accent-50 text-accent-700 ring-accent-200',
    high: 'bg-danger-50 text-danger-700 ring-danger-200',
    critical: 'bg-danger-100 text-danger-800 ring-danger-300',

    // Policy
    draft: 'bg-surface-100 text-surface-600 ring-surface-200',
    lapsed: 'bg-danger-50 text-danger-700 ring-danger-200',
    cancelled: 'bg-danger-50 text-danger-700 ring-danger-200',

    // Lead
    new: 'bg-primary-50 text-primary-700 ring-primary-200',
    contacted: 'bg-accent-50 text-accent-700 ring-accent-200',
    qualified: 'bg-success-50 text-success-700 ring-success-200',
    quoted: 'bg-primary-100 text-primary-700 ring-primary-200',
    negotiation: 'bg-accent-100 text-accent-700 ring-accent-200',
    converted: 'bg-success-100 text-success-700 ring-success-200',
    lost: 'bg-danger-50 text-danger-700 ring-danger-200',
    nurturing: 'bg-surface-200 text-surface-700 ring-surface-300',

    // Lead Priority
    hot: 'bg-danger-50 text-danger-700 ring-danger-200',
    warm: 'bg-accent-50 text-accent-700 ring-accent-200',
    cold: 'bg-primary-50 text-primary-700 ring-primary-200',

    // Claim
    intimated: 'bg-primary-50 text-primary-700 ring-primary-200',
    registered: 'bg-primary-100 text-primary-700 ring-primary-200',
    documents_pending: 'bg-accent-50 text-accent-700 ring-accent-200',
    under_review: 'bg-accent-100 text-accent-700 ring-accent-200',
    assessed: 'bg-primary-50 text-primary-700 ring-primary-200',
    approved: 'bg-success-50 text-success-700 ring-success-200',
    settled: 'bg-success-100 text-success-700 ring-success-200',
    closed: 'bg-surface-100 text-surface-600 ring-surface-200',

    // Complaint
    assigned: 'bg-primary-50 text-primary-700 ring-primary-200',
    under_investigation: 'bg-accent-50 text-accent-700 ring-accent-200',
    resolved: 'bg-success-50 text-success-700 ring-success-200',
    escalated: 'bg-danger-50 text-danger-700 ring-danger-200',

    // Commission
    earned: 'bg-success-50 text-success-700 ring-success-200',
    paid: 'bg-primary-50 text-primary-700 ring-primary-200',
    clawback: 'bg-danger-50 text-danger-700 ring-danger-200',
    clawed_back: 'bg-danger-50 text-danger-700 ring-danger-200',

    // Finance / Payment
    outstanding: 'bg-accent-50 text-accent-700 ring-accent-200',
    overdue: 'bg-danger-50 text-danger-700 ring-danger-200',
    partial: 'bg-warning-50 text-warning-700 ring-warning-200',
    refunded: 'bg-primary-50 text-primary-700 ring-primary-200',
};

const STATUS_LABELS: Record<string, string> = {
    documents_pending: 'Docs Pending',
    under_review: 'Under Review',
    under_investigation: 'Investigating',
    clawed_back: 'Clawed Back',
    professional_indemnity: 'Prof. Indemnity',
    oil_gas: 'Oil & Gas',
};

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
    showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
    const style = STATUS_STYLES[status] || 'bg-surface-100 text-surface-600 ring-surface-200';
    const label = STATUS_LABELS[status] || status.replace(/_/g, ' ');

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ring-1 ring-inset capitalize',
                style,
                className
            )}
        >
            {showDot && (
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            )}
            {label}
        </span>
    );
}

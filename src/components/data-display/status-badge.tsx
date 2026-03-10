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
    | 'EARNED' | 'PAID' | 'clawback' | 'CLAWED_BACK'
    | 'OUTSTANDING' | 'OVERDUE' | 'PARTIAL' | 'REFUNDED'
    | 'APPROVED' | 'PENDING'
    | 'RENEWED'
    | 'COMPLETED' | 'DEFAULTED' | 'SUBMITTED' | 'DISBURSED';

const STATUS_STYLES: Record<string, string> = {
    // Client
    ACTIVE: 'bg-success-50 text-success-700 ring-success-200',
    INACTIVE: 'bg-surface-100 text-surface-600 ring-surface-200',
    SUSPENDED: 'bg-accent-50 text-accent-700 ring-accent-200',
    BLACKLISTED: 'bg-danger-50 text-danger-700 ring-danger-200',

    // KYC
    PENDING: 'bg-accent-50 text-accent-700 ring-accent-200',
    VERIFIED: 'bg-success-50 text-success-700 ring-success-200',
    REJECTED: 'bg-danger-50 text-danger-700 ring-danger-200',
    EXPIRED: 'bg-surface-100 text-surface-600 ring-surface-200',

    // AML Risk
    LOW: 'bg-success-50 text-success-700 ring-success-200',
    MEDIUM: 'bg-accent-50 text-accent-700 ring-accent-200',
    HIGH: 'bg-danger-50 text-danger-700 ring-danger-200',
    CRITICAL: 'bg-danger-100 text-danger-800 ring-danger-300',

    // Policy
    DRAFT: 'bg-surface-100 text-surface-600 ring-surface-200',
    LAPSED: 'bg-danger-50 text-danger-700 ring-danger-200',
    CANCELLED: 'bg-danger-50 text-danger-700 ring-danger-200',

    // Lead
    NEW: 'bg-primary-50 text-primary-700 ring-primary-200',
    CONTACTED: 'bg-accent-50 text-accent-700 ring-accent-200',
    QUALIFIED: 'bg-success-50 text-success-700 ring-success-200',
    QUOTED: 'bg-primary-100 text-primary-700 ring-primary-200',
    NEGOTIATION: 'bg-accent-100 text-accent-700 ring-accent-200',
    CONVERTED: 'bg-success-100 text-success-700 ring-success-200',
    LOST: 'bg-danger-50 text-danger-700 ring-danger-200',
    NURTURING: 'bg-surface-200 text-surface-700 ring-surface-300',

    // Lead Priority
    HOT: 'bg-danger-50 text-danger-700 ring-danger-200',
    WARM: 'bg-accent-50 text-accent-700 ring-accent-200',
    COLD: 'bg-primary-50 text-primary-700 ring-primary-200',

    // Claim
    INTIMATED: 'bg-primary-50 text-primary-700 ring-primary-200',
    REGISTERED: 'bg-primary-100 text-primary-700 ring-primary-200',
    DOCUMENTS_PENDING: 'bg-accent-50 text-accent-700 ring-accent-200',
    UNDER_REVIEW: 'bg-accent-100 text-accent-700 ring-accent-200',
    ASSESSED: 'bg-primary-50 text-primary-700 ring-primary-200',
    APPROVED: 'bg-success-50 text-success-700 ring-success-200',
    SETTLED: 'bg-success-100 text-success-700 ring-success-200',
    CLOSED: 'bg-surface-100 text-surface-600 ring-surface-200',

    // Complaint
    ASSIGNED: 'bg-primary-50 text-primary-700 ring-primary-200',
    UNDER_INVESTIGATION: 'bg-accent-50 text-accent-700 ring-accent-200',
    RESOLVED: 'bg-success-50 text-success-700 ring-success-200',
    ESCALATED: 'bg-danger-50 text-danger-700 ring-danger-200',

    // Commission
    EARNED: 'bg-success-50 text-success-700 ring-success-200',
    PAID: 'bg-primary-50 text-primary-700 ring-primary-200',
    CLAWBACK: 'bg-danger-50 text-danger-700 ring-danger-200',
    CLAWED_BACK: 'bg-danger-50 text-danger-700 ring-danger-200',

    // Finance / Payment
    OUTSTANDING: 'bg-accent-50 text-accent-700 ring-accent-200',
    OVERDUE: 'bg-danger-50 text-danger-700 ring-danger-200',
    PARTIAL: 'bg-warning-50 text-warning-700 ring-warning-200',
    REFUNDED: 'bg-primary-50 text-primary-700 ring-primary-200',

    // Renewal workflow
    RENEWED: 'bg-success-100 text-success-700 ring-success-200',

    // Premium Financing
    COMPLETED: 'bg-success-100 text-success-800 ring-success-300',
    DEFAULTED: 'bg-danger-100 text-danger-800 ring-danger-300',
    SUBMITTED: 'bg-blue-50 text-blue-700 ring-blue-200',
    DISBURSED: 'bg-primary-50 text-primary-700 ring-primary-200',
};

const STATUS_LABELS: Record<string, string> = {
    DOCUMENTS_PENDING: 'Docs Pending',
    UNDER_REVIEW: 'Under Review',
    UNDER_INVESTIGATION: 'Investigating',
    CLAWED_BACK: 'Clawed Back',
    PROFESSIONAL_INDEMNITY: 'Prof. Indemnity',
    OIL_GAS: 'Oil & Gas',
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

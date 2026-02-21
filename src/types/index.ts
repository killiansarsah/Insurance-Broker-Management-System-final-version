// ============================================================
// IBMS TypeScript Interfaces — Derived from SRS Database Schema
// ============================================================

// --- Enums ---

export type UserRole =
    | 'platform_super_admin'
    | 'super_admin'
    | 'tenant_admin'
    | 'admin'
    | 'branch_manager'
    | 'senior_broker'
    | 'broker'
    | 'secretary'
    | 'data_entry'
    | 'viewer';

export type ClientType = 'individual' | 'corporate';
export type ClientStatus = 'active' | 'inactive' | 'suspended' | 'blacklisted';
export type KycStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type AmlRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Gender = 'male' | 'female' | 'other';

export type PolicyStatus =
    | 'draft'
    | 'pending'
    | 'active'
    | 'expired'
    | 'cancelled'
    | 'lapsed'
    | 'suspended';

export type InsuranceType =
    | 'motor'
    | 'fire'
    | 'marine'
    | 'life'
    | 'health'
    | 'liability'
    | 'engineering'
    | 'bonds'
    | 'travel'
    | 'agriculture'
    | 'oil_gas'
    | 'aviation'
    | 'professional_indemnity'
    | 'other';

export type LeadStatus =
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'quoted'
    | 'negotiation'
    | 'converted'
    | 'lost'
    | 'nurturing';

export type LeadPriority = 'hot' | 'warm' | 'cold';
export type LeadSource =
    | 'referral'
    | 'walk_in'
    | 'phone'
    | 'email'
    | 'website'
    | 'social_media'
    | 'event'
    | 'partner'
    | 'other';

export type ClaimStatus =
    | 'intimated'
    | 'registered'
    | 'documents_pending'
    | 'under_review'
    | 'assessed'
    | 'approved'
    | 'rejected'
    | 'settled'
    | 'closed';

export type ComplaintStatus =
    | 'registered'
    | 'assigned'
    | 'under_investigation'
    | 'resolved'
    | 'escalated'
    | 'closed';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export type ChatMessageType = 'text' | 'file' | 'image' | 'voice' | 'link' | 'system';
export type ReadStatus = 'sent' | 'delivered' | 'read';

export type DocumentCategory =
    | 'client'
    | 'policy'
    | 'claim'
    | 'compliance'
    | 'internal'
    | 'report'
    | 'kyc';

export type PaymentMethod = 'cash' | 'cheque' | 'bank_transfer' | 'mobile_money' | 'card';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'refunded';
export type MoMoNetwork = 'mtn' | 'telecel' | 'airteltigo';

// --- Core Entities ---

export interface User {
    id: string;
    tenantId?: string; // Multi-tenancy support
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone: string;
    branchId: string;
    avatarUrl?: string;
    isActive: boolean;
    lastLogin?: string;
    delegatedTo?: string; // User ID of the person handling backup
    isActingAsBackupFor?: string[]; // Array of User IDs this person is covering for
    createdAt: string;
}

export interface Client {
    id: string;
    clientNumber: string;
    type: ClientType;
    status: ClientStatus;

    // Individual fields
    firstName?: string;
    lastName?: string;
    otherNames?: string;
    dateOfBirth?: string;
    gender?: Gender;
    ghanaCardNumber?: string;
    nationality?: string;

    // Corporate fields
    companyName?: string;
    registrationNumber?: string;
    tin?: string;
    dateOfIncorporation?: string;
    industry?: string;

    // Contact
    phone: string;
    alternatePhone?: string;
    email?: string;
    digitalAddress?: string;
    postalAddress?: string;
    region?: string;
    city?: string;

    // KYC/AML
    kycStatus: KycStatus;
    kycVerifiedAt?: string;
    amlRiskLevel: AmlRiskLevel;
    isPep: boolean;
    eddRequired: boolean;

    // Assignment
    assignedBrokerId?: string;
    assignedBrokerName?: string;

    // Metadata
    totalPolicies: number;
    totalPremium: number;
    activePolicies: number;
    createdAt: string;
    updatedAt: string;
}

export interface Policy {
    id: string;
    policyNumber: string;
    status: PolicyStatus;
    insuranceType: InsuranceType;

    // Parties
    clientId: string;
    clientName: string;
    insurerName: string;
    insurerId: string;
    brokerId: string;
    brokerName: string;

    // Dates
    inceptionDate: string;
    expiryDate: string;
    issueDate: string;

    // Financial
    sumInsured: number;
    premiumAmount: number;
    commissionRate: number;
    commissionAmount: number;
    currency: string;

    // Coverage
    coverageDetails?: string;
    endorsements?: string[];
    exclusions?: string[];

    // Metadata
    isRenewal: boolean;
    previousPolicyId?: string;
    daysToExpiry?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Lead {
    id: string;
    leadNumber: string;
    status: LeadStatus;
    priority: LeadPriority;
    source: LeadSource;

    // Contact
    contactName: string;
    companyName?: string;
    phone: string;
    email?: string;

    // Interest
    productInterest: InsuranceType[];
    estimatedPremium?: number;
    estimatedCommission?: number;

    // Assignment
    assignedBrokerId: string;
    assignedBrokerName: string;

    // Scoring
    score: number; // 0-100

    // Activity
    lastContactDate?: string;
    nextFollowUpDate?: string;
    notes?: string;

    createdAt: string;
    updatedAt: string;
}

export interface Claim {
    id: string;
    claimNumber: string;
    status: ClaimStatus;

    // Related
    policyId: string;
    policyNumber: string;
    insuranceType: InsuranceType;
    clientId: string;
    clientName: string;

    // Incident
    incidentDate: string;
    incidentDescription: string;
    incidentLocation?: string;

    // Financial
    claimAmount: number;
    assessedAmount?: number;
    settledAmount?: number;
    currency: string;

    // Timeline
    intimationDate: string;
    registrationDate?: string;
    acknowledgmentDate?: string;
    assessmentDate?: string;
    approvalDate?: string;
    settlementDate?: string;
    closedDate?: string;

    // NIC Compliance
    acknowledgmentDeadline: string; // 5 business days
    processingDeadline: string; // 30 business days
    isOverdue: boolean;
    delayReason?: string;

    createdAt: string;
    updatedAt: string;
}

export interface Complaint {
    id: string;
    complaintNumber: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;

    // Complainant
    complainantName: string;
    complainantPhone: string;
    complainantEmail?: string;

    // Related
    clientId?: string;
    policyId?: string;
    claimId?: string;

    // Details
    category: string;
    subject: string;
    description: string;
    resolution?: string;

    // Assignment
    assignedTo?: string;
    escalationLevel: number; // 0=none, 1=manager, 2=compliance, 3=NIC

    // Deadlines
    slaDeadline: string;
    isBreached: boolean;

    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}

export interface ChatMessage {
    id: string;
    content: string;
    senderId: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
    id: string;
    participantId: string;
    participantName: string;
    participantAvatar?: string;
    participantRole: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
    type: 'direct' | 'group' | 'ai';
    linkedResourceId?: string;
    linkedResourceType?: 'policy' | 'claim' | 'complaint' | 'client';
}

export interface Document {
    id: string;
    name: string;
    category: DocumentCategory;
    mimeType: string;
    sizeBytes: number;
    url: string;
    thumbnailUrl?: string;

    // Relations
    clientId?: string;
    policyId?: string;
    claimId?: string;

    // Version
    version: number;
    uploadedBy: string;
    uploadedByName: string;

    // Retention
    retentionDate?: string;
    isExpired: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    policyId: string;
    policyNumber: string;
    clientId: string;
    clientName: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    momoNetwork?: MoMoNetwork;
    phoneNumber?: string;
    reference: string;
    description: string;
    processedAt?: string;
    createdAt: string;
}

// --- UI Types ---

export interface NavItem {
    label: string;
    href: string;
    icon: string;
    children?: NavItem[];
    requiredRoles?: UserRole[];
    badge?: number;
}

export interface KpiCard {
    label: string;
    value: string | number;
    change?: number; // percentage
    changeDirection?: 'up' | 'down' | 'neutral';
    icon: string;
}

export interface TableColumn<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

// --- Data Import Types ---

export type ImportEntityType = 'clients' | 'policies' | 'claims' | 'leads' | 'universal';

export interface ImportColumnMapping {
    sourceColumn: string;
    targetField: string;
    isRequired: boolean;
    entityGroup?: 'client' | 'policy' | 'asset' | 'claim' | 'lead'; // Used for universal import grouping
}

export interface ImportValidationError {
    row: number;
    column: string;
    value: string;
    message: string;
    entityGroup?: string;
}

export interface ImportResult {
    totalRows: number;
    imported: number;
    skipped: number;
    errors: ImportValidationError[];
    duplicates: number;
    entitiesCreated: {
        clients: number;
        policies: number;
        claims: number;
        leads: number;
    };
}

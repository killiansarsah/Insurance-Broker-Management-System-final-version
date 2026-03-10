// ============================================================
// IBMS TypeScript Interfaces — Derived from SRS Database Schema
// ============================================================

// --- Enums ---

export type UserRole =
    | 'PLATFORM_SUPER_ADMIN'
    | 'SUPER_ADMIN'
    | 'TENANT_ADMIN'
    | 'ADMIN'
    | 'BRANCH_MANAGER'
    | 'COMPLIANCE_OFFICER'
    | 'FINANCE_MANAGER'
    | 'SENIOR_BROKER'
    | 'BROKER'
    | 'UNDERWRITER'
    | 'AGENT'
    | 'SECRETARY'
    | 'DATA_ENTRY'
    | 'VIEWER';

export type ClientType = 'INDIVIDUAL' | 'CORPORATE';
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLACKLISTED';
export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
export type AmlRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type PolicyStatus =
    | 'DRAFT'
    | 'COVER_NOTE'
    | 'PENDING'
    | 'ACTIVE'
    | 'EXPIRED'
    | 'CANCELLED'
    | 'LAPSED'
    | 'SUSPENDED';

export type InsuranceType =
    | 'MOTOR'
    | 'FIRE'
    | 'MARINE'
    | 'LIFE'
    | 'HEALTH'
    | 'LIABILITY'
    | 'ENGINEERING'
    | 'BONDS'
    | 'TRAVEL'
    | 'AGRICULTURE'
    | 'OIL_GAS'
    | 'AVIATION'
    | 'PROFESSIONAL_INDEMNITY'
    | 'OTHER';

export type LeadStatus =
    | 'NEW'
    | 'CONTACTED'
    | 'QUALIFIED'
    | 'QUOTED'
    | 'NEGOTIATION'
    | 'CONVERTED'
    | 'LOST'
    | 'NURTURING';

export type LeadPriority = 'HOT' | 'WARM' | 'COLD';
export type LeadSource =
    | 'REFERRAL'
    | 'WALK_IN'
    | 'PHONE'
    | 'EMAIL'
    | 'WEBSITE'
    | 'SOCIAL_MEDIA'
    | 'EVENT'
    | 'PARTNER'
    | 'OTHER';

export type ClaimStatus =
    | 'INTIMATED'
    | 'REGISTERED'
    | 'DOCUMENTS_PENDING'
    | 'UNDER_REVIEW'
    | 'ASSESSED'
    | 'APPROVED'
    | 'REJECTED'
    | 'SETTLED'
    | 'CLOSED';

export type ComplaintStatus =
    | 'REGISTERED'
    | 'ASSIGNED'
    | 'UNDER_INVESTIGATION'
    | 'RESOLVED'
    | 'ESCALATED'
    | 'CLOSED';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ChatMessageType = 'TEXT' | 'FILE' | 'IMAGE' | 'VOICE' | 'LINK' | 'SYSTEM';
export type ReadStatus = 'SENT' | 'DELIVERED' | 'READ';

export type DocumentCategory =
    | 'CLIENT'
    | 'POLICY'
    | 'CLAIM'
    | 'COMPLIANCE'
    | 'INTERNAL'
    | 'REPORT'
    | 'KYC';

export type PaymentMethod = 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CARD';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'REFUNDED';
export type MoMoNetwork = 'MTN' | 'TELECEL' | 'AIRTELTIGO';

// --- Policy-specific enums ---

export type PolicyType = 'LIFE' | 'NON_LIFE';
export type PremiumFrequency = 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'SINGLE';
export type CommissionStatus = 'PENDING' | 'PAID' | 'CLAWED_BACK';

export type EndorsementType =
    | 'COVERAGE_CHANGE'
    | 'COVERAGE_CHANGE'
    | 'SUM_INSURED_CHANGE'
    | 'COVERAGE_CHANGE'
    | 'cancellation';

export type EndorsementStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type MotorCoverType = 'COMPREHENSIVE' | 'THIRD_PARTY' | 'THIRD_PARTY_FIRE_THEFT' | 'COMMERCIAL';
export type CancellationReason =
    | 'NON_PAYMENT'
    | 'CLIENT_REQUEST'
    | 'INSURER_CANCELLATION'
    | 'MISREPRESENTATION'
    | 'DUPLICATE_POLICY'
    | 'OTHER';

// --- Policy sub-entities ---

export interface VehicleDetails {
    registrationNumber: string;
    chassisNumber?: string;
    engineNumber?: string;
    make: string;
    model: string;
    year: number;
    bodyType?: string;
    color?: string;
    engineCapacity?: string;
    seatingCapacity?: number;
    usageType: 'PRIVATE' | 'COMMERCIAL' | 'GOVERNMENT' | 'DIPLOMATIC';
    estimatedValue: number;
}

export interface PropertyDetails {
    propertyAddress: string;
    propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'WAREHOUSE';
    constructionType?: string;
    yearBuilt?: number;
    contents?: string;
    occupancy?: string;
}

export interface MarineDetails {
    vesselName?: string;
    voyageFrom?: string;
    voyageTo?: string;
    cargoDescription?: string;
    cargoValue?: number;
    invoiceNumber?: string;
}

export interface PolicyEndorsement {
    id: string;
    endorsementNumber: string;
    type: EndorsementType;
    status: EndorsementStatus;
    effectiveDate: string;
    description: string;
    premiumAdjustment: number;
    createdAt: string;
    approvedBy?: string;
    approvedAt?: string;
}

export interface PremiumInstallment {
    id: string;
    dueDate: string;
    amount: number;
    status: PaymentStatus;
    paidDate?: string;
    reference?: string;
}

export interface PolicyDocument {
    id: string;
    name: string;
    type: 'POLICY_SCHEDULE' | 'COVER_NOTE' | 'PROPOSAL_FORM' | 'ENDORSEMENT' | 'CERTIFICATE' | 'INSPECTION_REPORT' | 'DEBIT_NOTE' | 'CREDIT_NOTE' | 'RECEIPT' | 'OTHER';
    url?: string;
    uploadedAt: string;
}

export interface PolicyTimelineEvent {
    id: string;
    date: string;
    event: string;
    description: string;
    performedBy?: string;
}

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

export interface NextOfKin {
    fullName: string;
    relationship: string;
    phone: string;
    address?: string;
}

export interface Beneficiary {
    fullName: string;
    relationship: string;
    dateOfBirth?: string;
    ghanaCardNumber?: string;
    phone?: string;
    percentage: number; // allocation percentage
    guardianName?: string; // for minor beneficiaries
}

export interface BankDetails {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
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
    maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
    occupation?: string;
    employerName?: string;
    employerAddress?: string;

    // Corporate fields
    companyName?: string;
    registrationNumber?: string;
    tin?: string;
    dateOfIncorporation?: string;
    industry?: string;
    contactPerson?: string;
    contactPersonPhone?: string;

    // Contact
    phone: string;
    alternatePhone?: string;
    email?: string;
    digitalAddress?: string;
    postalAddress?: string;
    region?: string;
    city?: string;
    preferredCommunication?: 'PHONE' | 'EMAIL' | 'SMS' | 'WHATSAPP';

    // KYC/AML
    kycStatus: KycStatus;
    kycVerifiedAt?: string;
    amlRiskLevel: AmlRiskLevel;
    isPep: boolean;
    eddRequired: boolean;
    sourceOfFunds?: string;
    purposeOfRelationship?: string;
    expectedTransactionVolume?: string;

    // Banking
    bankDetails?: BankDetails;

    // Next of Kin
    nextOfKin?: NextOfKin;

    // Beneficiaries
    beneficiaries?: Beneficiary[];

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
    policyType: PolicyType;

    // Coverage classification
    coverageType?: string; // e.g. "Comprehensive", "Third Party Only", "Term Life"
    motorCoverType?: MotorCoverType;
    nicClassOfBusiness?: string; // NIC regulatory classification

    // Product reference
    productId?: string;
    productName?: string;

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
    commissionStatus: CommissionStatus;
    currency: string;
    premiumFrequency: PremiumFrequency;
    nextPremiumDueDate?: string;
    paymentStatus: PaymentStatus;
    outstandingBalance?: number;

    // Coverage
    coverageDetails?: string;
    endorsements?: PolicyEndorsement[];
    exclusions?: string[];

    // Motor-specific
    vehicleDetails?: VehicleDetails;

    // Property/Fire-specific
    propertyDetails?: PropertyDetails;

    // Marine-specific
    marineDetails?: MarineDetails;

    // Premium installments
    installments?: PremiumInstallment[];

    // Documents
    documents?: PolicyDocument[];

    // Timeline
    timeline?: PolicyTimelineEvent[];

    // Beneficiaries (for life policies)
    beneficiaries?: Array<{ name: string; relationship: string; percentage: number }>;

    // Riders (for life/health)
    riders?: string[];

    // Renewal
    isRenewal: boolean;
    previousPolicyId?: string;
    daysToExpiry?: number;

    // Cancellation
    cancellationDate?: string;
    cancellationReason?: CancellationReason;
    cancellationNotes?: string;

    // Audit
    createdBy?: string;
    updatedBy?: string;
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
    status: 'SENT' | 'DELIVERED' | 'READ';
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
    linkedResourceType?: 'POLICY' | 'CLAIM' | 'complaint' | 'CLIENT';
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
    entityGroup?: 'CLIENT' | 'POLICY' | 'asset' | 'CLAIM' | 'lead'; // Used for universal import grouping
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

// ─── Notifications ───────────────────────────────────────────────────────
export type NotificationType =
    | 'RENEWAL'
    | 'CLAIM'
    | 'COMMISSION'
    | 'LEAD'
    | 'FOLLOWUP'
    | 'COMPLIANCE'
    | 'FINANCE'
    | 'SYSTEM'
    | 'DOCUMENT'
    | 'APPROVAL';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    read: boolean;
    archived: boolean;
    link?: string;
    createdAt: string;
    readAt?: string;
}

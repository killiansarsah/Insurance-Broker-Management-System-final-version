-- CreateEnum
CREATE TYPE "TenantPlan" AS ENUM ('BASIC', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'BRANCH_MANAGER', 'SENIOR_BROKER', 'BROKER', 'SECRETARY', 'DATA_ENTRY', 'VIEWER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('INDIVIDUAL', 'CORPORATE');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AmlRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'LAPSED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('MOTOR', 'FIRE', 'MARINE', 'LIFE', 'HEALTH', 'LIABILITY', 'ENGINEERING', 'BONDS', 'TRAVEL', 'AGRICULTURE', 'OIL_GAS', 'AVIATION', 'PROFESSIONAL_INDEMNITY', 'OTHER');

-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('LIFE', 'NON_LIFE');

-- CreateEnum
CREATE TYPE "PremiumFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'SINGLE');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID', 'EARNED', 'CLAWED_BACK');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CHEQUE', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'REFUNDED');

-- CreateEnum
CREATE TYPE "MoMoNetwork" AS ENUM ('MTN', 'TELECEL', 'AIRTELTIGO');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('INTIMATED', 'REGISTERED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'ASSESSED', 'APPROVED', 'REJECTED', 'SETTLED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('REGISTERED', 'ASSIGNED', 'UNDER_INVESTIGATION', 'RESOLVED', 'ESCALATED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ComplaintPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'QUOTED', 'NEGOTIATION', 'CONVERTED', 'LOST', 'NURTURING');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('HOT', 'WARM', 'COLD');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('REFERRAL', 'WEBSITE', 'WALK_IN', 'PHONE', 'EMAIL', 'SOCIAL_MEDIA', 'EVENT', 'PARTNER', 'OTHER');

-- CreateEnum
CREATE TYPE "EndorsementType" AS ENUM ('NAME_CHANGE', 'COVERAGE_CHANGE', 'SUM_INSURED_CHANGE', 'VEHICLE_CHANGE', 'CANCELLATION');

-- CreateEnum
CREATE TYPE "EndorsementStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MotorCoverType" AS ENUM ('COMPREHENSIVE', 'THIRD_PARTY', 'THIRD_PARTY_FIRE_THEFT', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "CancellationReason" AS ENUM ('NON_PAYMENT', 'CLIENT_REQUEST', 'MISREPRESENTATION', 'DUPLICATE_POLICY', 'INSURER_CANCELLATION', 'OTHER');

-- CreateEnum
CREATE TYPE "CarrierType" AS ENUM ('NON_LIFE', 'LIFE', 'REINSURER');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('CLIENT', 'POLICY', 'CLAIM', 'COMPLIANCE', 'INTERNAL', 'REPORT', 'KYC');

-- CreateEnum
CREATE TYPE "ChatRoomType" AS ENUM ('DIRECT', 'GROUP', 'AI');

-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('TEXT', 'FILE', 'IMAGE', 'VOICE', 'LINK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ReadStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RENEWAL', 'CLAIM', 'COMMISSION', 'LEAD', 'FOLLOWUP', 'COMPLIANCE', 'FINANCE', 'SYSTEM', 'DOCUMENT', 'APPROVAL');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PREMIUM', 'COMMISSION', 'REFUND', 'EXPENSE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('OUTSTANDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PFStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ApprovalType" AS ENUM ('POLICY', 'ENDORSEMENT', 'CLAIM_SETTLEMENT', 'CANCELLATION', 'REFUND');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HOT', 'WARM', 'COLD');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'REGISTERED');

-- CreateEnum
CREATE TYPE "CalendarEventType" AS ENUM ('POLICY', 'MEETING', 'CLAIM', 'TEAM', 'COMPLIANCE', 'PAYMENT');

-- CreateEnum
CREATE TYPE "CalendarEventStatus" AS ENUM ('UPCOMING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nicLicense" TEXT,
    "plan" "TenantPlan" NOT NULL DEFAULT 'BASIC',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "logoUrl" TEXT,
    "primaryColor" TEXT DEFAULT '#1E40AF',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'BROKER',
    "branchId" UUID,
    "departmentId" UUID,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "delegatedTo" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'BROKER',
    "branchId" UUID,
    "token" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedById" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "replacedBy" UUID,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "tenantId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carriers" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "CarrierType" NOT NULL,
    "licenseNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "website" TEXT,
    "logoUrl" TEXT,
    "brandColor" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "contactPerson" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "carrierId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "insuranceType" "InsuranceType" NOT NULL,
    "description" TEXT,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "type" "ClientType" NOT NULL,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstName" TEXT,
    "lastName" TEXT,
    "companyName" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "region" TEXT,
    "city" TEXT,
    "digitalAddress" TEXT,
    "ghanaCardNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "occupation" TEXT,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "amlRiskLevel" "AmlRiskLevel" NOT NULL DEFAULT 'LOW',
    "isPep" BOOLEAN NOT NULL DEFAULT false,
    "eddRequired" BOOLEAN NOT NULL DEFAULT false,
    "assignedBrokerId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficiaries" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "ghanaCardNumber" TEXT,
    "phone" TEXT,
    "percentage" DECIMAL(5,2) NOT NULL,
    "guardianName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "next_of_kin" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "next_of_kin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_details" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "branch" TEXT NOT NULL,

    CONSTRAINT "bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "insuranceType" "InsuranceType" NOT NULL,
    "policyType" "PolicyType" NOT NULL,
    "coverageType" TEXT,
    "nicClassOfBusiness" TEXT,
    "clientId" UUID NOT NULL,
    "carrierId" UUID NOT NULL,
    "productId" UUID,
    "brokerId" UUID NOT NULL,
    "inceptionDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "issueDate" TIMESTAMP(3),
    "sumInsured" DECIMAL(15,2) NOT NULL,
    "premiumAmount" DECIMAL(15,2) NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "commissionAmount" DECIMAL(15,2) NOT NULL,
    "commissionStatus" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "premiumFrequency" "PremiumFrequency" NOT NULL DEFAULT 'ANNUAL',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "coverageDetails" TEXT,
    "isRenewal" BOOLEAN NOT NULL DEFAULT false,
    "previousPolicyId" UUID,
    "cancellationReason" "CancellationReason",
    "cancellationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_details" (
    "id" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "registrationNumber" TEXT,
    "chassisNumber" TEXT,
    "engineNumber" TEXT,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "bodyType" TEXT,
    "color" TEXT,
    "engineCapacity" TEXT,
    "seatingCapacity" INTEGER,
    "usageType" TEXT,
    "estimatedValue" DECIMAL(15,2),
    "motorCoverType" "MotorCoverType",

    CONSTRAINT "vehicle_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_details" (
    "id" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "propertyAddress" TEXT,
    "propertyType" TEXT,
    "constructionType" TEXT,
    "yearBuilt" INTEGER,
    "estimatedValue" DECIMAL(15,2),
    "occupancyType" TEXT,

    CONSTRAINT "property_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marine_details" (
    "id" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "vesselName" TEXT,
    "imoNumber" TEXT,
    "voyageRoute" TEXT,
    "cargoDescription" TEXT,
    "cargoValue" DECIMAL(15,2),
    "conveyanceType" TEXT,

    CONSTRAINT "marine_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_endorsements" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "type" "EndorsementType" NOT NULL,
    "status" "EndorsementStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "premiumAdjustment" DECIMAL(15,2),
    "requestedById" UUID NOT NULL,
    "approvedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policy_endorsements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_installments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "paidDate" TIMESTAMP(3),

    CONSTRAINT "premium_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_documents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policy_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'INTIMATED',
    "policyId" UUID NOT NULL,
    "insuranceType" "InsuranceType" NOT NULL,
    "clientId" UUID NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "incidentDescription" TEXT NOT NULL,
    "incidentLocation" TEXT,
    "claimAmount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "intimationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrationDate" TIMESTAMP(3),
    "acknowledgmentDeadline" TIMESTAMP(3) NOT NULL,
    "processingDeadline" TIMESTAMP(3) NOT NULL,
    "assessedAmount" DECIMAL(15,2),
    "settledAmount" DECIMAL(15,2),
    "settlementDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "isOverdue" BOOLEAN NOT NULL DEFAULT false,
    "assessorId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_documents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "claimId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "complaintNumber" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'REGISTERED',
    "priority" "ComplaintPriority" NOT NULL DEFAULT 'MEDIUM',
    "complainantName" TEXT NOT NULL,
    "complainantPhone" TEXT,
    "complainantEmail" TEXT,
    "subject" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT NOT NULL,
    "escalationLevel" INTEGER NOT NULL DEFAULT 0,
    "assignedToId" UUID,
    "slaDeadline" TIMESTAMP(3) NOT NULL,
    "isBreached" BOOLEAN NOT NULL DEFAULT false,
    "resolutionDetails" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "leadNumber" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" "LeadPriority" NOT NULL DEFAULT 'WARM',
    "source" "LeadSource" NOT NULL DEFAULT 'OTHER',
    "contactName" TEXT NOT NULL,
    "companyName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "productInterest" TEXT[],
    "estimatedPremium" DECIMAL(15,2),
    "estimatedCommission" DECIMAL(15,2),
    "assignedBrokerId" UUID,
    "score" INTEGER NOT NULL DEFAULT 0,
    "nextFollowUpDate" TIMESTAMP(3),
    "lastContactDate" TIMESTAMP(3),
    "notes" TEXT,
    "convertedClientId" UUID,
    "convertedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "url" TEXT,
    "storagePath" TEXT,
    "uploadedById" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "linkedEntityType" TEXT,
    "linkedEntityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "transactionNumber" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "momoNetwork" "MoMoNetwork",
    "momoPhone" TEXT,
    "reference" TEXT,
    "clientId" UUID,
    "policyId" UUID,
    "invoiceId" UUID,
    "processedById" UUID,
    "processedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "clientId" UUID NOT NULL,
    "policyId" UUID,
    "description" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "amountPaid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'OUTSTANDING',
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "dateIssued" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateDue" TIMESTAMP(3) NOT NULL,
    "datePaid" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "insurerName" TEXT NOT NULL,
    "productType" TEXT,
    "premiumAmount" DECIMAL(15,2) NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "commissionAmount" DECIMAL(15,2) NOT NULL,
    "nicLevy" DECIMAL(15,2),
    "netCommission" DECIMAL(15,2),
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "brokerId" UUID NOT NULL,
    "dateEarned" TIMESTAMP(3),
    "datePaid" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "vendor" TEXT,
    "reference" TEXT,
    "paymentMethod" TEXT,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedById" UUID,
    "department" TEXT,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_financing" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "applicationNumber" TEXT NOT NULL,
    "clientId" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "totalPremium" DECIMAL(15,2) NOT NULL,
    "downPaymentPct" DECIMAL(5,2) NOT NULL,
    "downPayment" DECIMAL(15,2) NOT NULL,
    "financedAmount" DECIMAL(15,2) NOT NULL,
    "interestRateMonthly" DECIMAL(5,4) NOT NULL,
    "totalInterest" DECIMAL(15,2) NOT NULL,
    "totalRepayment" DECIMAL(15,2) NOT NULL,
    "monthlyInstallment" DECIMAL(15,2) NOT NULL,
    "numberOfInstallments" INTEGER NOT NULL,
    "installmentsPaid" INTEGER NOT NULL DEFAULT 0,
    "amountPaid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "outstandingBalance" DECIMAL(15,2) NOT NULL,
    "status" "PFStatus" NOT NULL DEFAULT 'SUBMITTED',
    "financier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_financing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pf_installments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "pfId" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "paidDate" TIMESTAMP(3),

    CONSTRAINT "pf_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT,
    "type" "ChatRoomType" NOT NULL DEFAULT 'DIRECT',
    "linkedResourceType" TEXT,
    "linkedResourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_participants" (
    "id" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "type" "ChatMessageType" NOT NULL DEFAULT 'TEXT',
    "readStatus" "ReadStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "type" "CalendarEventType" NOT NULL DEFAULT 'MEETING',
    "priority" TEXT,
    "status" "CalendarEventStatus" NOT NULL DEFAULT 'UPCOMING',
    "location" TEXT,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_attendees" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "calendar_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "TaskPriority" NOT NULL DEFAULT 'WARM',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "type" TEXT,
    "link" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "assignedToId" UUID,
    "createdById" UUID NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvals" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "refNumber" TEXT NOT NULL,
    "type" "ApprovalType" NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "priority" TEXT,
    "subject" TEXT NOT NULL,
    "clientName" TEXT,
    "amount" DECIMAL(15,2),
    "requestedById" UUID NOT NULL,
    "approvedById" UUID,
    "dueDate" TIMESTAMP(3),
    "isOverdue" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "linkedEntityType" TEXT,
    "linkedEntityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "headId" UUID,
    "branchId" UUID,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "branches_tenantId_idx" ON "branches"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "branches_tenantId_code_key" ON "branches"("tenantId", "code");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_email_key" ON "users"("tenantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_tenantId_idx" ON "invitations"("tenantId");

-- CreateIndex
CREATE INDEX "invitations_token_idx" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_email_tenantId_idx" ON "invitations"("email", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_token_idx" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_createdAt_idx" ON "audit_logs"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_entity_idx" ON "audit_logs"("tenantId", "entity");

-- CreateIndex
CREATE INDEX "carriers_tenantId_idx" ON "carriers"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "carriers_tenantId_slug_key" ON "carriers"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "products_tenantId_idx" ON "products"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "products_tenantId_code_key" ON "products"("tenantId", "code");

-- CreateIndex
CREATE INDEX "clients_tenantId_idx" ON "clients"("tenantId");

-- CreateIndex
CREATE INDEX "clients_tenantId_type_idx" ON "clients"("tenantId", "type");

-- CreateIndex
CREATE INDEX "clients_tenantId_status_idx" ON "clients"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "clients_tenantId_clientNumber_key" ON "clients"("tenantId", "clientNumber");

-- CreateIndex
CREATE INDEX "beneficiaries_clientId_idx" ON "beneficiaries"("clientId");

-- CreateIndex
CREATE INDEX "next_of_kin_clientId_idx" ON "next_of_kin"("clientId");

-- CreateIndex
CREATE INDEX "bank_details_clientId_idx" ON "bank_details"("clientId");

-- CreateIndex
CREATE INDEX "policies_tenantId_idx" ON "policies"("tenantId");

-- CreateIndex
CREATE INDEX "policies_tenantId_status_idx" ON "policies"("tenantId", "status");

-- CreateIndex
CREATE INDEX "policies_tenantId_insuranceType_idx" ON "policies"("tenantId", "insuranceType");

-- CreateIndex
CREATE INDEX "policies_tenantId_clientId_idx" ON "policies"("tenantId", "clientId");

-- CreateIndex
CREATE INDEX "policies_tenantId_expiryDate_idx" ON "policies"("tenantId", "expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "policies_tenantId_policyNumber_key" ON "policies"("tenantId", "policyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_details_policyId_key" ON "vehicle_details"("policyId");

-- CreateIndex
CREATE UNIQUE INDEX "property_details_policyId_key" ON "property_details"("policyId");

-- CreateIndex
CREATE UNIQUE INDEX "marine_details_policyId_key" ON "marine_details"("policyId");

-- CreateIndex
CREATE INDEX "policy_endorsements_tenantId_idx" ON "policy_endorsements"("tenantId");

-- CreateIndex
CREATE INDEX "policy_endorsements_policyId_idx" ON "policy_endorsements"("policyId");

-- CreateIndex
CREATE INDEX "premium_installments_tenantId_idx" ON "premium_installments"("tenantId");

-- CreateIndex
CREATE INDEX "premium_installments_policyId_idx" ON "premium_installments"("policyId");

-- CreateIndex
CREATE INDEX "policy_documents_tenantId_idx" ON "policy_documents"("tenantId");

-- CreateIndex
CREATE INDEX "policy_documents_policyId_idx" ON "policy_documents"("policyId");

-- CreateIndex
CREATE INDEX "claims_tenantId_idx" ON "claims"("tenantId");

-- CreateIndex
CREATE INDEX "claims_tenantId_status_idx" ON "claims"("tenantId", "status");

-- CreateIndex
CREATE INDEX "claims_tenantId_policyId_idx" ON "claims"("tenantId", "policyId");

-- CreateIndex
CREATE UNIQUE INDEX "claims_tenantId_claimNumber_key" ON "claims"("tenantId", "claimNumber");

-- CreateIndex
CREATE INDEX "claim_documents_tenantId_idx" ON "claim_documents"("tenantId");

-- CreateIndex
CREATE INDEX "claim_documents_claimId_idx" ON "claim_documents"("claimId");

-- CreateIndex
CREATE INDEX "complaints_tenantId_idx" ON "complaints"("tenantId");

-- CreateIndex
CREATE INDEX "complaints_tenantId_status_idx" ON "complaints"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "complaints_tenantId_complaintNumber_key" ON "complaints"("tenantId", "complaintNumber");

-- CreateIndex
CREATE INDEX "leads_tenantId_idx" ON "leads"("tenantId");

-- CreateIndex
CREATE INDEX "leads_tenantId_status_idx" ON "leads"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "leads_tenantId_leadNumber_key" ON "leads"("tenantId", "leadNumber");

-- CreateIndex
CREATE INDEX "documents_tenantId_idx" ON "documents"("tenantId");

-- CreateIndex
CREATE INDEX "documents_tenantId_category_idx" ON "documents"("tenantId", "category");

-- CreateIndex
CREATE INDEX "documents_tenantId_linkedEntityType_linkedEntityId_idx" ON "documents"("tenantId", "linkedEntityType", "linkedEntityId");

-- CreateIndex
CREATE INDEX "transactions_tenantId_idx" ON "transactions"("tenantId");

-- CreateIndex
CREATE INDEX "transactions_tenantId_type_idx" ON "transactions"("tenantId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_tenantId_transactionNumber_key" ON "transactions"("tenantId", "transactionNumber");

-- CreateIndex
CREATE INDEX "invoices_tenantId_idx" ON "invoices"("tenantId");

-- CreateIndex
CREATE INDEX "invoices_tenantId_status_idx" ON "invoices"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_tenantId_invoiceNumber_key" ON "invoices"("tenantId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "commissions_tenantId_idx" ON "commissions"("tenantId");

-- CreateIndex
CREATE INDEX "commissions_tenantId_status_idx" ON "commissions"("tenantId", "status");

-- CreateIndex
CREATE INDEX "commissions_tenantId_brokerId_idx" ON "commissions"("tenantId", "brokerId");

-- CreateIndex
CREATE INDEX "expenses_tenantId_idx" ON "expenses"("tenantId");

-- CreateIndex
CREATE INDEX "expenses_tenantId_status_idx" ON "expenses"("tenantId", "status");

-- CreateIndex
CREATE INDEX "premium_financing_tenantId_idx" ON "premium_financing"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "premium_financing_tenantId_applicationNumber_key" ON "premium_financing"("tenantId", "applicationNumber");

-- CreateIndex
CREATE INDEX "pf_installments_tenantId_idx" ON "pf_installments"("tenantId");

-- CreateIndex
CREATE INDEX "pf_installments_pfId_idx" ON "pf_installments"("pfId");

-- CreateIndex
CREATE INDEX "chat_rooms_tenantId_idx" ON "chat_rooms"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_roomId_userId_key" ON "chat_participants"("roomId", "userId");

-- CreateIndex
CREATE INDEX "chat_messages_tenantId_idx" ON "chat_messages"("tenantId");

-- CreateIndex
CREATE INDEX "chat_messages_roomId_createdAt_idx" ON "chat_messages"("roomId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_tenantId_idx" ON "notifications"("tenantId");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "calendar_events_tenantId_idx" ON "calendar_events"("tenantId");

-- CreateIndex
CREATE INDEX "calendar_events_tenantId_startDate_idx" ON "calendar_events"("tenantId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_attendees_eventId_userId_key" ON "calendar_attendees"("eventId", "userId");

-- CreateIndex
CREATE INDEX "tasks_tenantId_idx" ON "tasks"("tenantId");

-- CreateIndex
CREATE INDEX "tasks_tenantId_status_idx" ON "tasks"("tenantId", "status");

-- CreateIndex
CREATE INDEX "approvals_tenantId_idx" ON "approvals"("tenantId");

-- CreateIndex
CREATE INDEX "approvals_tenantId_status_idx" ON "approvals"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "approvals_tenantId_refNumber_key" ON "approvals"("tenantId", "refNumber");

-- CreateIndex
CREATE INDEX "departments_tenantId_idx" ON "departments"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_tenantId_code_key" ON "departments"("tenantId", "code");

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carriers" ADD CONSTRAINT "carriers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_assignedBrokerId_fkey" FOREIGN KEY ("assignedBrokerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiaries" ADD CONSTRAINT "beneficiaries_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "next_of_kin" ADD CONSTRAINT "next_of_kin_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_details" ADD CONSTRAINT "bank_details_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_details" ADD CONSTRAINT "vehicle_details_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_details" ADD CONSTRAINT "property_details_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marine_details" ADD CONSTRAINT "marine_details_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_endorsements" ADD CONSTRAINT "policy_endorsements_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_endorsements" ADD CONSTRAINT "policy_endorsements_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_endorsements" ADD CONSTRAINT "policy_endorsements_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_installments" ADD CONSTRAINT "premium_installments_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_documents" ADD CONSTRAINT "policy_documents_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_documents" ADD CONSTRAINT "claim_documents_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignedBrokerId_fkey" FOREIGN KEY ("assignedBrokerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_convertedClientId_fkey" FOREIGN KEY ("convertedClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_financing" ADD CONSTRAINT "premium_financing_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_financing" ADD CONSTRAINT "premium_financing_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_financing" ADD CONSTRAINT "premium_financing_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pf_installments" ADD CONSTRAINT "pf_installments_pfId_fkey" FOREIGN KEY ("pfId") REFERENCES "premium_financing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_attendees" ADD CONSTRAINT "calendar_attendees_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_attendees" ADD CONSTRAINT "calendar_attendees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_headId_fkey" FOREIGN KEY ("headId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

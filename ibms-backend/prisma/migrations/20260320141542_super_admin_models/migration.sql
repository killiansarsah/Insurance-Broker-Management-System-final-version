/*
  Warnings:

  - A unique constraint covering the columns `[subdomain]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uploadedBy` to the `claim_documents` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `claim_documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CLIENT_ACCOUNT', 'AGENCY_ACCOUNT');

-- CreateEnum
CREATE TYPE "RemittanceStatus" AS ENUM ('PENDING', 'PARTIAL', 'REMITTED');

-- CreateEnum
CREATE TYPE "ChaseMethod" AS ENUM ('PHONE', 'EMAIL', 'IN_PERSON', 'LETTER', 'OTHER');

-- CreateEnum
CREATE TYPE "ClaimDocumentType" AS ENUM ('POLICE_REPORT', 'MEDICAL_REPORT', 'REPAIR_ESTIMATE', 'ADJUSTER_REPORT', 'SETTLEMENT_LETTER', 'CORRESPONDENCE', 'PHOTOGRAPH', 'OTHER');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING', 'TRIAL');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'OVERDUE', 'CANCELLED', 'TRIAL');

-- CreateEnum
CREATE TYPE "PlatformPaymentStatus" AS ENUM ('PAID', 'FAILED', 'REFUNDED', 'PENDING');

-- CreateEnum
CREATE TYPE "AuditCategory" AS ENUM ('AUTH', 'TENANT', 'USER', 'BILLING', 'POLICY', 'CLAIM', 'COMPLIANCE', 'SYSTEM', 'ERROR', 'SECURITY');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'WARN', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ServiceHealthStatus" AS ENUM ('HEALTHY', 'DEGRADED', 'DOWN');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ErrorSeverity" AS ENUM ('FATAL', 'ERROR', 'WARNING');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRYING');

-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('SENT', 'DELIVERED', 'BOUNCED', 'FAILED', 'SPAM');

-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('INFO', 'WARNING', 'CRITICAL', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "AnnouncementTarget" AS ENUM ('ALL', 'BY_PLAN', 'SPECIFIC');

-- CreateEnum
CREATE TYPE "AnnouncementDelivery" AS ENUM ('IN_APP', 'EMAIL', 'BOTH');

-- AlterEnum
ALTER TYPE "PolicyStatus" ADD VALUE 'COVER_NOTE';

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'CLAIM_SETTLEMENT';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'COMPLIANCE_OFFICER';
ALTER TYPE "UserRole" ADD VALUE 'FINANCE_MANAGER';
ALTER TYPE "UserRole" ADD VALUE 'UNDERWRITER';
ALTER TYPE "UserRole" ADD VALUE 'AGENT';

-- AlterTable
ALTER TABLE "claim_documents" ADD COLUMN     "uploadedBy" UUID NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "ClaimDocumentType" NOT NULL;

-- AlterTable
ALTER TABLE "claims" ADD COLUMN     "appealNotes" TEXT,
ADD COLUMN     "deductibleAmount" DECIMAL(15,2),
ADD COLUMN     "insurerReference" TEXT,
ADD COLUMN     "insurerSubmissionDate" TIMESTAMP(3),
ADD COLUMN     "nicEscalationDate" TIMESTAMP(3),
ADD COLUMN     "nicEscalationRef" TEXT,
ADD COLUMN     "perilType" TEXT;

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "tin" TEXT;

-- AlterTable
ALTER TABLE "commissions" ADD COLUMN     "remittanceId" UUID;

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "tokenFamily" TEXT;

-- AlterTable
ALTER TABLE "password_resets" ADD COLUMN     "tokenFamily" TEXT;

-- AlterTable
ALTER TABLE "policies" ADD COLUMN     "claimCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalClaimsValue" DECIMAL(15,2) NOT NULL DEFAULT 0,
ALTER COLUMN "sumInsured" DROP NOT NULL;

-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "tokenFamily" TEXT;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "adminEmail" TEXT,
ADD COLUMN     "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "customOnboardingNotes" TEXT,
ADD COLUMN     "nicLicenseExpiry" TIMESTAMP(3),
ADD COLUMN     "storageUsedMb" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "subdomain" TEXT,
ADD COLUMN     "tenantStatus" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "trialEndsAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'CLIENT_ACCOUNT',
ADD COLUMN     "remittanceId" UUID;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "claim_status_history" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "claimId" UUID NOT NULL,
    "fromStatus" "ClaimStatus" NOT NULL,
    "toStatus" "ClaimStatus" NOT NULL,
    "changedBy" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remittances" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "remittanceNumber" TEXT NOT NULL,
    "carrierId" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "premiumAmount" DECIMAL(15,2) NOT NULL,
    "amountRemitted" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "status" "RemittanceStatus" NOT NULL DEFAULT 'PENDING',
    "remittanceDate" TIMESTAMP(3),
    "paymentMethod" "PaymentMethod",
    "reference" TEXT,
    "notes" TEXT,
    "processedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "remittances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_follow_ups" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "claimId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "method" "ChaseMethod" NOT NULL,
    "contactName" TEXT,
    "note" TEXT NOT NULL,
    "nextAction" TEXT,
    "followUpDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "clientId" UUID NOT NULL,
    "insuranceType" "InsuranceType" NOT NULL,
    "coverageType" TEXT,
    "policyType" TEXT NOT NULL DEFAULT 'non-life',
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "sumInsuredRequested" DECIMAL(15,2) NOT NULL,
    "riskDescription" TEXT,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "sentDate" TIMESTAMP(3),
    "responseDate" TIMESTAMP(3),
    "preparedById" UUID,
    "convertedPolicyId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_options" (
    "id" UUID NOT NULL,
    "quoteId" UUID NOT NULL,
    "carrierName" TEXT NOT NULL,
    "premium" DECIMAL(15,2) NOT NULL,
    "sumInsured" DECIMAL(15,2) NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "commissionAmount" DECIMAL(15,2) NOT NULL,
    "excessOrDeductible" TEXT,
    "coverageNotes" TEXT,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "serviceKey" TEXT NOT NULL,
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "connectedAt" TIMESTAMP(3),
    "connectedEmail" TEXT,
    "syncFrequency" TEXT NOT NULL DEFAULT 'manual',
    "lastSyncAt" TIMESTAMP(3),
    "config" JSONB NOT NULL DEFAULT '{}',
    "credentials" JSONB NOT NULL DEFAULT '{}',
    "syncEvents" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "plan" "TenantPlan" NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "amountGhs" DECIMAL(12,2) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "paystackSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_payments" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "amountGhs" DECIMAL(12,2) NOT NULL,
    "status" "PlatformPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paystackReference" TEXT,
    "invoiceNumber" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_audit_logs" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "tenantId" UUID,
    "tenantName" TEXT,
    "sessionId" TEXT,
    "impersonatedById" UUID,
    "category" "AuditCategory" NOT NULL,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
    "action" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "description" TEXT NOT NULL,
    "beforeState" JSONB,
    "afterState" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestId" TEXT,
    "status" "AuditStatus" NOT NULL DEFAULT 'SUCCESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_health_checks" (
    "id" UUID NOT NULL,
    "serviceName" TEXT NOT NULL,
    "status" "ServiceHealthStatus" NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorMessage" TEXT,

    CONSTRAINT "system_health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "severity" "AuditSeverity" NOT NULL,
    "affectedServices" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "rootCause" TEXT,
    "resolutionNotes" TEXT,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_logs" (
    "id" UUID NOT NULL,
    "errorType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stackTrace" TEXT NOT NULL,
    "severity" "ErrorSeverity" NOT NULL DEFAULT 'ERROR',
    "tenantId" UUID,
    "userId" UUID,
    "requestMethod" TEXT,
    "requestUrl" TEXT,
    "requestBody" JSONB,
    "statusCode" INTEGER,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" UUID,
    "notes" TEXT,
    "occurrenceCount" INTEGER NOT NULL DEFAULT 1,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "background_jobs" (
    "id" UUID NOT NULL,
    "jobName" TEXT NOT NULL,
    "tenantId" UUID,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB,
    "result" JSONB,
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "enqueuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "nextRetryAt" TIMESTAMP(3),

    CONSTRAINT "background_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" UUID NOT NULL,
    "templateName" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "tenantId" UUID,
    "subject" TEXT NOT NULL,
    "status" "EmailDeliveryStatus" NOT NULL DEFAULT 'SENT',
    "providerMessageId" TEXT,
    "providerResponse" JSONB,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL DEFAULT 'INFO',
    "targetType" "AnnouncementTarget" NOT NULL DEFAULT 'ALL',
    "targetIds" JSONB,
    "delivery" "AnnouncementDelivery" NOT NULL DEFAULT 'IN_APP',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_reads" (
    "id" UUID NOT NULL,
    "announcementId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_reads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "globalEnabled" BOOLEAN NOT NULL DEFAULT false,
    "starterEnabled" BOOLEAN NOT NULL DEFAULT false,
    "proEnabled" BOOLEAN NOT NULL DEFAULT false,
    "enterpriseEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flag_overrides" (
    "id" UUID NOT NULL,
    "flagId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_flag_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedById" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "nic_compliance" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "licenceNumber" TEXT,
    "expiryDate" TIMESTAMP(3),
    "segregationCompliant" BOOLEAN NOT NULL DEFAULT false,
    "lastRemittanceDate" TIMESTAMP(3),
    "nextRemittanceDue" TIMESTAMP(3),
    "levyStatus" TEXT,
    "kycStatus" TEXT,
    "complianceScore" INTEGER NOT NULL DEFAULT 0,
    "lastCheckedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nic_compliance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "claim_status_history_claimId_idx" ON "claim_status_history"("claimId");

-- CreateIndex
CREATE INDEX "claim_status_history_tenantId_createdAt_idx" ON "claim_status_history"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "remittances_tenantId_idx" ON "remittances"("tenantId");

-- CreateIndex
CREATE INDEX "remittances_tenantId_status_idx" ON "remittances"("tenantId", "status");

-- CreateIndex
CREATE INDEX "remittances_tenantId_carrierId_idx" ON "remittances"("tenantId", "carrierId");

-- CreateIndex
CREATE UNIQUE INDEX "remittances_tenantId_remittanceNumber_key" ON "remittances"("tenantId", "remittanceNumber");

-- CreateIndex
CREATE INDEX "claim_follow_ups_tenantId_idx" ON "claim_follow_ups"("tenantId");

-- CreateIndex
CREATE INDEX "claim_follow_ups_claimId_idx" ON "claim_follow_ups"("claimId");

-- CreateIndex
CREATE INDEX "quotes_tenantId_idx" ON "quotes"("tenantId");

-- CreateIndex
CREATE INDEX "quotes_tenantId_status_idx" ON "quotes"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_tenantId_quoteNumber_key" ON "quotes"("tenantId", "quoteNumber");

-- CreateIndex
CREATE INDEX "quote_options_quoteId_idx" ON "quote_options"("quoteId");

-- CreateIndex
CREATE INDEX "integrations_tenantId_idx" ON "integrations"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_tenantId_serviceKey_key" ON "integrations"("tenantId", "serviceKey");

-- CreateIndex
CREATE INDEX "subscriptions_tenantId_idx" ON "subscriptions"("tenantId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "platform_payments_tenantId_idx" ON "platform_payments"("tenantId");

-- CreateIndex
CREATE INDEX "platform_payments_subscriptionId_idx" ON "platform_payments"("subscriptionId");

-- CreateIndex
CREATE INDEX "platform_payments_status_idx" ON "platform_payments"("status");

-- CreateIndex
CREATE INDEX "platform_audit_logs_tenantId_idx" ON "platform_audit_logs"("tenantId");

-- CreateIndex
CREATE INDEX "platform_audit_logs_actorId_idx" ON "platform_audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "platform_audit_logs_category_idx" ON "platform_audit_logs"("category");

-- CreateIndex
CREATE INDEX "platform_audit_logs_severity_idx" ON "platform_audit_logs"("severity");

-- CreateIndex
CREATE INDEX "platform_audit_logs_createdAt_idx" ON "platform_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "platform_audit_logs_status_idx" ON "platform_audit_logs"("status");

-- CreateIndex
CREATE INDEX "system_health_checks_serviceName_idx" ON "system_health_checks"("serviceName");

-- CreateIndex
CREATE INDEX "system_health_checks_checkedAt_idx" ON "system_health_checks"("checkedAt");

-- CreateIndex
CREATE INDEX "incidents_status_idx" ON "incidents"("status");

-- CreateIndex
CREATE INDEX "incidents_createdAt_idx" ON "incidents"("createdAt");

-- CreateIndex
CREATE INDEX "error_logs_tenantId_idx" ON "error_logs"("tenantId");

-- CreateIndex
CREATE INDEX "error_logs_severity_idx" ON "error_logs"("severity");

-- CreateIndex
CREATE INDEX "error_logs_resolved_idx" ON "error_logs"("resolved");

-- CreateIndex
CREATE INDEX "error_logs_lastSeenAt_idx" ON "error_logs"("lastSeenAt");

-- CreateIndex
CREATE INDEX "background_jobs_status_idx" ON "background_jobs"("status");

-- CreateIndex
CREATE INDEX "background_jobs_tenantId_idx" ON "background_jobs"("tenantId");

-- CreateIndex
CREATE INDEX "background_jobs_jobName_idx" ON "background_jobs"("jobName");

-- CreateIndex
CREATE INDEX "background_jobs_enqueuedAt_idx" ON "background_jobs"("enqueuedAt");

-- CreateIndex
CREATE INDEX "email_logs_tenantId_idx" ON "email_logs"("tenantId");

-- CreateIndex
CREATE INDEX "email_logs_status_idx" ON "email_logs"("status");

-- CreateIndex
CREATE INDEX "email_logs_recipientEmail_idx" ON "email_logs"("recipientEmail");

-- CreateIndex
CREATE INDEX "email_logs_createdAt_idx" ON "email_logs"("createdAt");

-- CreateIndex
CREATE INDEX "announcements_createdAt_idx" ON "announcements"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_reads_announcementId_tenantId_key" ON "announcement_reads"("announcementId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "feature_flags"("key");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flag_overrides_flagId_tenantId_key" ON "feature_flag_overrides"("flagId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "nic_compliance_tenantId_key" ON "nic_compliance"("tenantId");

-- CreateIndex
CREATE INDEX "invitations_tokenFamily_idx" ON "invitations"("tokenFamily");

-- CreateIndex
CREATE INDEX "password_resets_tokenFamily_idx" ON "password_resets"("tokenFamily");

-- CreateIndex
CREATE INDEX "refresh_tokens_tokenFamily_idx" ON "refresh_tokens"("tokenFamily");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_subdomain_key" ON "tenants"("subdomain");

-- CreateIndex
CREATE INDEX "transactions_tenantId_accountType_idx" ON "transactions"("tenantId", "accountType");

-- AddForeignKey
ALTER TABLE "claim_status_history" ADD CONSTRAINT "claim_status_history_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_status_history" ADD CONSTRAINT "claim_status_history_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_status_history" ADD CONSTRAINT "claim_status_history_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_documents" ADD CONSTRAINT "claim_documents_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_documents" ADD CONSTRAINT "claim_documents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_remittanceId_fkey" FOREIGN KEY ("remittanceId") REFERENCES "remittances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_remittanceId_fkey" FOREIGN KEY ("remittanceId") REFERENCES "remittances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remittances" ADD CONSTRAINT "remittances_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remittances" ADD CONSTRAINT "remittances_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remittances" ADD CONSTRAINT "remittances_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remittances" ADD CONSTRAINT "remittances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_follow_ups" ADD CONSTRAINT "claim_follow_ups_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_follow_ups" ADD CONSTRAINT "claim_follow_ups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_follow_ups" ADD CONSTRAINT "claim_follow_ups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_convertedPolicyId_fkey" FOREIGN KEY ("convertedPolicyId") REFERENCES "policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_preparedById_fkey" FOREIGN KEY ("preparedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_options" ADD CONSTRAINT "quote_options_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_payments" ADD CONSTRAINT "platform_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_payments" ADD CONSTRAINT "platform_payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_audit_logs" ADD CONSTRAINT "platform_audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_audit_logs" ADD CONSTRAINT "platform_audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_jobs" ADD CONSTRAINT "background_jobs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_reads" ADD CONSTRAINT "announcement_reads_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_reads" ADD CONSTRAINT "announcement_reads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flag_overrides" ADD CONSTRAINT "feature_flag_overrides_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flag_overrides" ADD CONSTRAINT "feature_flag_overrides_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flag_overrides" ADD CONSTRAINT "feature_flag_overrides_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_settings" ADD CONSTRAINT "platform_settings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nic_compliance" ADD CONSTRAINT "nic_compliance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

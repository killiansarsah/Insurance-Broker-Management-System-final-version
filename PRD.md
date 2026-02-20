# Insurance Broker Management System (IBMS)
## Complete Software Requirements Specification
### Ghana Edition - NIC Compliant

---

**Document Version:** 1.0  
**Date:** February 13, 2026  
**Target Market:** Ghana Insurance Brokerage Firms  
**Regulatory Framework:** NIC Ghana, Insurance Act 2021 (Act 1061)

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Regulatory Compliance](#3-regulatory-compliance)
4. [System Architecture](#4-system-architecture)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Specifications](#7-technical-specifications)
8. [Database Schema](#8-database-schema)
9. [API Specifications](#9-api-specifications)
10. [User Interface Requirements](#10-user-interface-requirements)
11. [Security Requirements](#11-security-requirements)
12. [Integration Requirements](#12-integration-requirements)
13. [Testing Requirements](#13-testing-requirements)
14. [Deployment Strategy](#14-deployment-strategy)
15. [Maintenance & Support](#15-maintenance--support)
16. [Project Timeline](#16-project-timeline)
17. [Appendices](#17-appendices)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Purpose
This document provides comprehensive specifications for developing an Insurance Broker Management System (IBMS) tailored for the Ghanaian insurance market. The system will enable insurance brokerages to manage clients, policies, claims, compliance, and internal communications in full compliance with National Insurance Commission (NIC) regulations.

### 1.2 Scope
The IBMS will cover:
- **Multi-tenant SaaS platform** enabling multiple independent brokerage firms to operate on a single shared infrastructure with complete data isolation
- Complete client lifecycle management with KYC/AML compliance
- Policy administration for Life and Non-Life insurance products
- Lead generation and conversion tracking
- Claims processing and complaints management
- Internal messaging system for team collaboration
- Regulatory reporting and compliance monitoring
- Document management with retention policies
- Commission tracking and reconciliation
- Real-time dashboards and analytics
- Tenant management, onboarding, subscription billing, and platform administration

### 1.3 Target Users
- **Platform Super Administrator** (manages the entire multi-tenant platform)
- **Tenant Administrator** (manages a single brokerage firm's instance)
- Insurance Brokers and Agents
- Brokerage Managers and Administrators
- Compliance Officers
- Claims Officers
- Finance Officers
- Customer Service Representatives

---

## 2. SYSTEM OVERVIEW

### 2.1 System Vision
To create a comprehensive, multi-tenant SaaS platform that enables multiple independent insurance brokerage firms in Ghana to streamline their operations while ensuring full compliance with the national regulatory framework. Each brokerage firm (tenant) operates in a fully isolated environment with its own data, users, branding, and configuration, all running on a shared, scalable infrastructure.

### 2.2 Key Features
1. **Multi-Tenant Platform** - SaaS architecture allowing multiple brokerage firms to use the system independently with complete data isolation, custom branding, and per-tenant configuration
2. **Client Management** - Full KYC with Ghana Card integration, digital addresses, and beneficiary tracking
3. **Policy Administration** - Multi-product support with automated renewal workflows
4. **Lead Management** - Track leads from acquisition to conversion
5. **Claims Processing** - NIC-compliant workflow with document management
6. **Internal Chat System** - Real-time messaging for client and claim follow-ups
7. **Compliance Module** - Automated AML checks and regulatory reporting
8. **Document Management** - Secure storage with 6-year retention
9. **Analytics Dashboard** - Real-time business intelligence and reporting
10. **Tenant Management** - Self-service onboarding, subscription billing, and platform administration

### 2.3 System Benefits
- **For Brokers:** Streamlined workflow, instant client information access
- **For Managers:** Real-time oversight, performance tracking, compliance monitoring
- **For Compliance:** Automated checks, audit trails, easy NIC reporting
- **For Clients:** Faster service, transparent processes, better communication
- **For Platform Operators:** Single codebase serving multiple firms, centralized monitoring, scalable revenue model
- **For Brokerage Firms (Tenants):** Zero infrastructure management, rapid onboarding, pay-per-use pricing, automatic updates and security patches

---

## 3. REGULATORY COMPLIANCE

### 3.1 Applicable Legislation
1. **Insurance Act 2021 (Act 1061)**
   - Broker licensing requirements
   - Capital adequacy regulations
   - Client protection measures

2. **National Insurance Commission (NIC) Directives**
   - KYC requirements
   - Claims processing timelines
   - Complaint handling procedures
   - Reporting obligations

3. **Anti-Money Laundering Act 2020 (Act 1044)**
   - Customer Due Diligence (CDD)
   - Enhanced Due Diligence (EDD)
   - Suspicious Transaction Reporting (STR)
   - Record keeping (6 years minimum)

4. **Data Protection Act 2012 (Act 843)**
   - Consent management
   - Data subject rights
   - Data breach notification
   - Cross-border data transfer restrictions

5. **FATF Recommendations**
   - Risk-based approach to AML
   - Beneficial ownership identification
   - Politically Exposed Persons (PEP) screening

### 3.2 Compliance Features

#### 3.2.1 KYC/AML Compliance
- Mandatory Ghana Card number capture
- Digital address verification
- Source of funds documentation
- PEP screening integration
- Automated AML risk scoring
- Transaction monitoring thresholds
- Suspicious activity flagging

#### 3.2.2 Claims Compliance
- Automatic acknowledgment within 5 working days
- 30-day processing target tracking
- Reason codes for delays
- Communication audit trails
- Document completeness checks

#### 3.2.3 Complaints Management
- Mandatory complaint logging
- 15-day acknowledgment requirement
- 30-day resolution tracking
- Escalation workflows
- NIC complaint reporting format

#### 3.2.4 Data Retention
- 6-year minimum retention for all records
- Automatic archival workflows
- Deletion prevention controls
- Audit log of data access

#### 3.2.5 Reporting to NIC
- Monthly premium reports
- Quarterly claims statistics
- Annual compliance certificates
- Ad-hoc regulatory queries
- Standardized report formats

---

## 4. SYSTEM ARCHITECTURE

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Tenant Web App        Mobile App       Platform Admin      │
│  (firmname.ibms.com)   (iOS/Android)    (admin.ibms.com)    │
└────────────────┬────────────────┬───────────────────────────┘
                 │                │
                 │  HTTPS/WSS     │
                 │                │
┌────────────────┴────────────────┴───────────────────────────┐
│                TENANT RESOLUTION LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  Subdomain Resolver → Tenant Context Injection → Auth      │
│  (firmname.ibms.com → tenant_id)                            │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│              API Gateway (Load Balancer)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │  Client  │  │  Policy  │  │  Claims  │  │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Lead   │  │   Chat   │  │Compliance│  │ Document │  │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Reporting│  │  Payment │  │   Email  │  │  Tenant  │  │
│  │ Service  │  │ Service  │  │  Service │  │ Service  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                     DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐    ┌────────────────┐                  │
│  │   PostgreSQL   │    │     Redis      │                  │
│  │  (Primary DB)  │    │ (Cache/Queue)  │                  │
│  │  + RLS per     │    │ + tenant-keyed │                  │
│  │    tenant      │    │   namespaces   │                  │
│  └────────────────┘    └────────────────┘                  │
│                                                             │
│  ┌────────────────┐    ┌────────────────┐                  │
│  │   MongoDB      │    │   S3/MinIO     │                  │
│  │  (Chat/Logs)   │    │  (Documents)   │                  │
│  │  + tenant_id   │    │ + tenant/ prefix│                 │
│  └────────────────┘    └────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

#### 4.2.1 Frontend
**Primary Options:**
- **React.js** (Recommended)
  - Modern, component-based architecture
  - Rich ecosystem and community support
  - Excellent for SPAs and PWAs
  - Libraries: Redux/Context API, React Query, Axios
  
- **Angular** (Alternative)
  - Full-featured framework
  - TypeScript by default
  - Comprehensive tooling
  - Good for large enterprise applications

**Mobile:**
- React Native (cross-platform iOS/Android)
- OR native development (Swift/Kotlin)

**UI Framework:**
- Material-UI or Ant Design
- TailwindCSS for custom styling
- Chart.js or Recharts for analytics

#### 4.2.2 Backend
**Primary Options:**
- **.NET Core** (C#) - Recommended for enterprise
  - Version: .NET 8.0 LTS
  - Frameworks: ASP.NET Core Web API, Entity Framework Core
  - Benefits: Strong typing, excellent performance, Microsoft support
  
- **Node.js** (JavaScript/TypeScript) - Recommended for startups
  - Runtime: Node.js 20 LTS
  - Framework: Express.js or NestJS
  - Benefits: Fast development, JavaScript everywhere, real-time capabilities
  
- **Django** (Python) - Alternative
  - Version: Django 5.0
  - Benefits: Rapid development, built-in admin, ORM

**API Architecture:**
- RESTful APIs
- GraphQL (optional, for complex queries)
- WebSocket for real-time chat
- SignalR (.NET) or Socket.io (Node.js) for real-time features

#### 4.2.3 Database
**Primary Database:**
- PostgreSQL 15+ (Recommended)
  - Relational data integrity
  - JSON support for flexible fields
  - Excellent performance and reliability
  
**Alternative:**
- MySQL 8.0+ or Microsoft SQL Server

**Caching & Session:**
- Redis 7.0+
  - Session management
  - Caching frequently accessed data
  - Message queue for background jobs

**Document Storage:**
- MongoDB 7.0+ (for chat messages and audit logs)
- OR use PostgreSQL JSONB exclusively

**File Storage:**
- Amazon S3 (cloud)
- MinIO (self-hosted S3-compatible)
- Azure Blob Storage (Microsoft stack)

#### 4.2.4 Infrastructure & DevOps
**Cloud Platforms:**
- AWS (Recommended: EC2, RDS, S3, CloudFront)
- Microsoft Azure (Good for .NET stack)
- Google Cloud Platform
- Digital Ocean (Cost-effective option)

**Containerization:**
- Docker
- Kubernetes (for scaling)
- Docker Compose (development)

**CI/CD:**
- GitHub Actions
- GitLab CI/CD
- Jenkins
- Azure DevOps

**Monitoring:**
- Application: New Relic, DataDog, Application Insights
- Logs: ELK Stack (Elasticsearch, Logstash, Kibana)
- Uptime: UptimeRobot, Pingdom

**Security:**
- SSL/TLS certificates (Let's Encrypt or commercial)
- WAF (Web Application Firewall)
- DDoS protection (Cloudflare)
- Vulnerability scanning (Snyk, OWASP ZAP)

### 4.3 Multi-Tenancy Architecture

The IBMS operates as a **multi-tenant SaaS platform** where each brokerage firm (tenant) has a logically isolated environment within a shared infrastructure. This section defines the architectural decisions for tenant management, data isolation, and security boundaries.

#### 4.3.1 Tenant Resolution Strategy

**Subdomain-Based Resolution (Primary):**
- Each tenant is assigned a unique subdomain: `{firm-slug}.ibms.com`
- Example: `starbrokerage.ibms.com`, `goldshieldinsurance.ibms.com`
- The API Gateway / Tenant Resolution Layer extracts the subdomain, resolves it to a `tenant_id`, and injects this into the request context
- Platform administration portal is accessible at `admin.ibms.com` (Platform Super Admin only)

**Custom Domain Support (Optional - Enterprise Tier):**
- Tenants on the Enterprise plan may configure a custom domain (e.g., `portal.starbrokerage.com`)
- DNS CNAME mapping to `{firm-slug}.ibms.com`
- SSL provisioned via Let's Encrypt or tenant-managed certificate

**Tenant Context Flow:**
1. User navigates to `firmname.ibms.com`
2. API Gateway resolves subdomain → `tenant_id`
3. `tenant_id` is injected into JWT claims on login
4. Every API request carries `tenant_id` in the JWT
5. All database queries are automatically scoped to `tenant_id` via Row-Level Security (RLS)

#### 4.3.2 Data Isolation Strategy

**Approach: Shared Database, Shared Schema, Row-Level Security (RLS)**

This is the recommended approach for cost-effective multi-tenancy while maintaining strong data isolation:

- **Single PostgreSQL database** shared across all tenants
- **Every table** includes a mandatory `tenant_id UUID NOT NULL` column
- **PostgreSQL Row-Level Security (RLS)** policies enforce that queries only return rows matching the authenticated user's `tenant_id`
- Application code sets `current_setting('app.current_tenant')` at the start of every request
- RLS policies automatically filter all SELECT, INSERT, UPDATE, DELETE operations

**Example RLS Policy:**
```sql
-- Enable RLS on the clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see rows belonging to their tenant
CREATE POLICY tenant_isolation_policy ON clients
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Policy: new rows must match the authenticated tenant
CREATE POLICY tenant_insert_policy ON clients
  FOR INSERT
  WITH CHECK (tenant_id = current_setting('app.current_tenant')::uuid);
```

**Cross-Tenant Access Prevention:**
- No API endpoint allows querying across tenants (except Platform Super Admin)
- `tenant_id` is never accepted from client input; it is always derived from the JWT
- Foreign key references are scoped within the same tenant (e.g., a policy's client must belong to the same tenant)

**Referential Integrity:**
- Multi-column foreign keys may include `tenant_id` where needed to prevent cross-tenant references
- Example: `FOREIGN KEY (tenant_id, client_id) REFERENCES clients(tenant_id, client_id)`

#### 4.3.3 Tenant-Aware Services

All application services operate in a tenant-aware manner:

**Authentication Service:**
- Login is tenant-scoped (users log in on their tenant's subdomain)
- JWT tokens include `tenant_id`, `user_id`, and `role`
- Password policies can be customized per tenant (within platform-defined minimums)

**Caching (Redis):**
- All cache keys are prefixed with `tenant:{tenant_id}:`
- Example: `tenant:abc123:client:list:page1`
- Tenant data eviction does not affect other tenants

**Message Queue (Redis/RabbitMQ):**
- Background jobs are tagged with `tenant_id`
- Job processing always sets tenant context before execution
- Per-tenant rate limiting for background operations

**File Storage (S3/MinIO):**
- Tenant files are stored using tenant-prefixed paths: `/{tenant_id}/documents/...`
- Bucket-level or prefix-level access policies enforce isolation
- No tenant can access another tenant's files
- Per-tenant storage quotas based on subscription plan

**Email & SMS Services:**
- Outbound communications are branded with the tenant's company name and logo
- Reply-to addresses can be customized per tenant
- Sending limits apply per tenant based on subscription plan

**WebSocket (Chat):**
- WebSocket connections are authenticated with tenant context
- Chat rooms, messages, and participants are all tenant-scoped
- Broadcast messages are scoped to a single tenant (no cross-tenant broadcasts)

#### 4.3.4 Tenant Lifecycle

**Provisioning (Onboarding a New Tenant):**
1. Tenant signs up on the platform landing page
2. System creates a new `tenants` record with a unique `tenant_id`
3. Domain/subdomain is registered (`{slug}.ibms.com`)
4. First admin user is created within the tenant
5. Default configuration is applied (roles, permissions, settings)
6. Welcome email is sent with login credentials

**Suspension:**
- Platform Super Admin can suspend a tenant (e.g., for non-payment)
- Suspended tenants cannot log in; data is preserved
- Grace period before permanent deactivation (30 days)

**Deactivation & Data Deletion:**
- After grace period, tenant data may be archived or deleted
- Data export is offered before deletion (GDPR/Data Protection Act compliance)
- Audit logs of deletion are permanently retained

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 User Management Module

#### 5.1.1 User Roles & Permissions

**Role Hierarchy:**

> **Note:** Roles 1-2 are platform-level roles that operate across tenants. Roles 3-9 are tenant-scoped roles that only have access within their own brokerage firm.

0. **Platform Super Administrator** (Platform-Level)
   - Manage all tenants (create, suspend, deactivate)
   - View platform-wide analytics and usage metrics
   - System-wide configuration and settings
   - Subscription and billing management
   - Cross-tenant access for support and troubleshooting
   - Platform security and infrastructure management
   - No access to individual tenant business data unless explicitly granted

1. **Tenant Administrator** (Tenant-Level)
   - Full access within own tenant/brokerage firm
   - Tenant configuration (branding, settings, preferences)
   - User management within their tenant (create, edit, deactivate)
   - Role assignment within their tenant
   - Subscription management and billing overview
   - Tenant-level security settings
   - Data export for their tenant

2. **System Administrator**
   - Full system access within own tenant
   - User management (create, edit, deactivate)
   - System configuration within tenant
   - Security settings
   - Audit log access
   - Backup management

3. **Brokerage Manager**
   - View all organizational data
   - Approve policy submissions
   - Review compliance reports
   - Performance analytics
   - Team management
   - Commission approval

4. **Compliance Officer**
   - KYC/AML review and approval
   - Compliance dashboard access
   - Regulatory report generation
   - Audit trail review
   - Risk assessment oversight
   - Suspicious activity reports

5. **Claims Officer**
   - Claims processing
   - Document verification
   - Payment processing
   - Claim status updates
   - Insurer communication
   - Claims reporting

6. **Finance Officer**
   - Commission management
   - Payment reconciliation
   - Financial reporting
   - Invoice generation
   - Premium tracking
   - Accounts receivable/payable

7. **Broker/Agent**
   - Client management (assigned clients)
   - Lead management
   - Policy application
   - Renewal management
   - Claims submission
   - Commission tracking (own)

8. **Customer Service Representative**
   - Client inquiry handling
   - Basic information updates
   - Document submission assistance
   - Complaint logging
   - Query resolution
   - Internal chat access

#### 5.1.2 User Authentication
- **Tenant-Aware Login**
  - Users access their tenant's login page via `{firm-slug}.ibms.com`
  - Tenant is resolved from the subdomain before authentication
  - Same email can exist in different tenants (scoped uniqueness)
  - Platform Super Admin logs in via `admin.ibms.com`
  
- **Username/Email + Password**
  - Minimum 8 characters
  - Must include uppercase, lowercase, number, special character
  - Password expiry: 90 days
  - Password history: Cannot reuse last 5 passwords
  
- **Two-Factor Authentication (2FA)**
  - SMS OTP (primary)
  - Email OTP (backup)
  - Authenticator app support (Google Authenticator, Microsoft Authenticator)
  - Mandatory for Admin, Manager, Compliance roles

- **Biometric Authentication** (Mobile App)
  - Fingerprint
  - Face ID/Face Recognition

- **Single Sign-On (SSO)** (Future enhancement)
  - Active Directory integration
  - SAML 2.0 support
  - Per-tenant SSO configuration

#### 5.1.3 User Management Features
- User registration workflow (pending approval)
- Role assignment and modification
- Permission matrix management
- User profile management (photo, contact, signature)
- Password reset (self-service and admin)
- Account activation/deactivation
- Session management (max concurrent sessions)
- Login history and device tracking
- Failed login attempt lockout (5 attempts)

#### 5.1.4 Audit Trail
- All user actions logged with:
  - **Tenant ID** (which brokerage firm)
  - User ID and name
  - Timestamp (with timezone)
  - Action performed
  - IP address
  - Device information
  - Data before/after changes
  - Success/failure status
- Logs retained for 6 years
- Tamper-proof logging
- Searchable and exportable
- **Tenant-scoped:** Each tenant can only view their own audit logs
- **Platform Super Admin:** Can view audit logs across all tenants

---

### 5.2 Client Management Module

> **Multi-Tenancy:** All client data is tenant-scoped. Each brokerage firm can only view, create, and manage clients belonging to their own tenant. Client IDs, Ghana Card numbers, and other identifiers are unique within a tenant. Cross-tenant client sharing is not permitted.

#### 5.2.1 Client Registration

**Personal Information:**
- Full name (as per Ghana Card)
- Ghana Card number (validated)
- Date of birth
- Gender
- Nationality
- Marital status
- Occupation
- Employer name and address

**Contact Information:**
- Primary phone number (Ghana format: +233XXXXXXXXX)
- Alternative phone number
- Email address (validated)
- Digital address (validated with GPS coordinates)
- Physical address
- Preferred communication method

**Identification Documents:**
- Ghana Card (front & back - mandatory)
- Passport photo
- Proof of address (utility bill, bank statement)
- Additional ID (Passport, Voter ID, Driver's License)

**Financial Information:**
- Employment status
- Monthly income range
- Source of funds
- Bank details (for claims payment)
  - Bank name
  - Account number
  - Account name
  - Branch

**Next of Kin/Emergency Contact:**
- Full name
- Relationship
- Phone number
- Address

**Beneficiary Information:**
- Full name
- Relationship to client
- Date of birth
- Ghana Card number
- Phone number
- Percentage allocation (for multiple beneficiaries)
- Guardian information (for minor beneficiaries)

#### 5.2.2 KYC/AML Compliance

**Customer Due Diligence (CDD):**
- Identity verification (Ghana Card + photo)
- Address verification
- Source of funds declaration
- Purpose of insurance relationship
- Expected transaction volume
- Risk classification (Low, Medium, High)

**Enhanced Due Diligence (EDD) - Triggered for:**
- High-value policies (>GHS 100,000)
- Politically Exposed Persons (PEPs)
- High-risk occupations
- Foreign nationals
- Complex ownership structures (corporate clients)

**PEP Screening:**
- Automated screening against PEP database
- Manual review and approval workflow
- Ongoing monitoring
- Senior management approval required

**AML Red Flags:**
- Unusual payment patterns
- Reluctance to provide information
- Frequent policy changes
- Early policy terminations with cash refunds
- Premium payments from third parties without clear reason
- Discrepancies in information provided

**Suspicious Transaction Reporting:**
- Internal flagging mechanism
- Review by Compliance Officer
- Report to Financial Intelligence Centre (FIC)
- Secure communication channel
- Confidentiality maintained

#### 5.2.3 Client Data Management

**Client Profile View:**
- Summary dashboard
- Personal and contact information
- All policies (active and inactive)
- Claims history
- Payment history
- Documents repository
- Communication log
- Risk assessment score
- Assigned broker/agent

**Client Search & Filtering:**
- Search by:
  - Name (partial match)
  - Ghana Card number
  - Phone number
  - Email
  - Policy number
  - Client ID
- Filter by:
  - Registration date range
  - Risk level
  - Broker/agent assigned
  - Policy type
  - Status (active, inactive, suspended)
  - Location (region, city)

**Client Segmentation:**
- High-value clients
- VIP clients
- Lapsed clients (for reactivation)
- Renewal due this month
- Birthday this month
- Claims pending
- KYC pending completion

**Client Communication:**
- Email templates
- SMS notifications
- WhatsApp Business integration (future)
- Communication history tracking
- Bulk messaging for campaigns

**Data Update Workflow:**
- Client self-service portal for updates
- Broker-initiated updates (with client consent)
- Verification workflow for sensitive changes
- Notification to client for all changes
- Change history maintained

#### 5.2.4 Corporate Client Management

**Additional Fields:**
- Company name
- Registration number (RGD number)
- TIN (Tax Identification Number)
- Nature of business
- Incorporation date
- Registered address
- Directors and shareholders
- Ultimate Beneficial Owners (UBOs)
- Authorized signatories
- Company contact person

**Corporate KYC:**
- Certificate of Incorporation
- Business registration certificate
- TIN certificate
- Memorandum and Articles of Association
- Board resolution for insurance purchase
- Proof of registered address
- Directors' IDs

---

### 5.3 Policy Management Module

> **Multi-Tenancy:** All policies, premiums, commissions, and renewal data are tenant-scoped. Policy numbers are unique within a tenant. Each brokerage firm's policy portfolio is completely isolated from other tenants.

#### 5.3.1 Policy Types Supported

**Life Insurance:**
1. **Term Life Insurance**
   - Fixed period coverage
   - Death benefit only
   - No cash value
   
2. **Whole Life Insurance**
   - Lifetime coverage
   - Cash value accumulation
   - Premium payment options (single, limited, continuous)
   
3. **Endowment Policies**
   - Savings + insurance
   - Maturity benefit
   - Loan facility
   
4. **Group Life Insurance**
   - Employer-sponsored
   - Multiple certificates under master policy
   - Bulk premium calculation

**Non-Life Insurance:**
1. **Motor Insurance**
   - Third Party Only
   - Third Party Fire & Theft
   - Comprehensive
   - Commercial vehicle insurance
   
2. **Property Insurance**
   - Fire and special perils
   - Burglary
   - All risks
   - Rent guarantee
   
3. **Liability Insurance**
   - Public liability
   - Professional indemnity
   - Employers' liability
   - Product liability
   
4. **Marine Insurance**
   - Cargo
   - Hull
   - Freight
   
5. **Health Insurance**
   - Individual health
   - Family floater
   - Group medical
   - Travel insurance
   
6. **Business Insurance**
   - Business interruption
   - Fidelity guarantee
   - Money insurance
   - Goods in transit

#### 5.3.2 Policy Application Workflow

**Step 1: Quotation**
- Client details (new or existing)
- Insurance type selection
- Coverage requirements
- Sum insured
- Policy term
- Additional riders/benefits
- Risk assessment questions
- Premium calculation
- Quotation generation (PDF)
- Quotation validity period (30 days default)

**Step 2: Proposal Submission**
- Quotation acceptance
- Detailed proposal form
- Medical examination (for life insurance)
- Risk inspection (for property/business)
- Supporting documents upload
- Declaration and consent
- E-signature capture

**Step 3: Underwriting**
- Risk assessment
- Medical report review (life)
- Inspection report review (property)
- Underwriter decision:
  - Approved as proposed
  - Approved with modifications (loading, exclusions)
  - Declined
- Communication to broker and client
- Counter-offer negotiation (if applicable)

**Step 4: Acceptance & Payment**
- Terms acceptance by client
- Premium calculation (final)
- Payment method selection:
  - Bank transfer
  - Mobile money (MTN, Vodafone, AirtelTigo)
  - Credit/debit card
  - Standing order
  - Direct debit
- Payment confirmation
- Receipt generation

**Step 5: Policy Issuance**
- Policy document generation
- Policy number assignment
- Policy schedule creation
- Digital signature
- PDF generation
- Email to client and broker
- Hard copy printing (if requested)
- Policy activation

#### 5.3.3 Policy Management Features

**Policy Dashboard:**
- Total active policies
- Policies due for renewal (30/60/90 days)
- Policies lapsed
- Premium collection rate
- New policies this month
- Cancellations this month

**Policy Details View:**
- Policy number and type
- Policyholder details
- Insurer name
- Coverage period (start and end dates)
- Sum insured
- Premium (amount, frequency, next due date)
- Payment status
- Beneficiaries
- Riders and endorsements
- Claims history
- Documents attached
- Commission details

**Policy Modifications:**
- **Endorsements:**
  - Change of beneficiary
  - Change of address
  - Change of sum insured
  - Addition of riders
  - Change of premium payment frequency
  - Endorsement request workflow
  - Insurer approval required
  - Endorsement fee calculation
  - Updated policy document
  
- **Policy Surrender:**
  - Surrender value calculation
  - Surrender request form
  - Management approval
  - Surrender payout processing
  - Policy cancellation
  
- **Policy Conversion:**
  - Term to whole life
  - Individual to group
  - Conversion eligibility check
  - New premium calculation
  - Conversion fee

**Premium Management:**
- Premium schedule
- Payment reminders (SMS/Email):
  - 7 days before due date
  - On due date
  - 7 days after due date
  - 14 days after due date (final reminder)
- Grace period tracking (30 days for life, 14 days for non-life)
- Late payment fees
- Payment allocation
- Receipt generation
- Premium refund processing

**Policy Renewal:**
- Automatic renewal notices (90/60/30 days)
- Renewal quotation
- Sum insured adjustment (inflation)
- Premium recalculation
- Medical re-examination (if required)
- Inspection (for property)
- Renewal approval workflow
- Renewal payment
- Renewed policy issuance

**Policy Lapse Management:**
- Grace period expiry notification
- Lapse status update
- Reinstatement options
- Reinstatement requirements:
  - Outstanding premium payment
  - Late fees
  - Medical re-examination
  - Underwriter approval
- Reinstatement workflow

**Policy Cancellation:**
- Cancellation request
- Reason codes:
  - Client request
  - Non-payment
  - Fraud
  - Policy maturity
  - Death claim settled
- Pro-rata refund calculation (if applicable)
- No-claims bonus refund
- Cancellation certificate
- Notification to insurer and client

#### 5.3.4 Commission Management

**Commission Structure:**
- Commission percentage by product type
- Commission tier by broker level
- Bonus commission for targets
- Override commissions for managers

**Commission Calculation:**
- Automatic calculation on policy issuance
- Commission on new business
- Renewal commission (lower percentage)
- Pro-rata commission on cancellations (clawback)
- Commission adjustment for endorsements

**Commission Tracking:**
- Commission earned (pending payment)
- Commission paid
- Commission clawback (for early cancellations)
- Commission statements
- Commission payment schedule
- Tax deduction tracking

**Commission Payment:**
- Payment frequency (monthly/quarterly)
- Payment approval workflow
- Payment method:
  - Bank transfer
  - Mobile money
  - Cheque
- Payment advice generation
- Commission receipt

#### 5.3.5 Policy Reporting

**Standard Reports:**
- Policy register
- New business report
- Renewal report
- Lapsed policies report
- Policy cancellation report
- Premium collection report
- Outstanding premium report
- Policy maturity report
- Commission report
- Policy portfolio analysis

**NIC Regulatory Reports:**
- Monthly premium income report
- Policy count by class of business
- Geographic distribution report
- Commission paid report

**Export Formats:**
- PDF
- Excel
- CSV

---

### 5.4 Lead Management Module

> **Multi-Tenancy:** Leads are tenant-scoped. Each brokerage firm captures and manages its own leads independently. Lead assignment, scoring, and conversion tracking are isolated per tenant.

#### 5.4.1 Lead Capture

**Lead Sources:**
- Walk-in clients
- Phone inquiries
- Website contact form
- Email inquiries
- Social media leads
- Referrals (from existing clients)
- Marketing campaigns
- Third-party aggregators
- Events and exhibitions

**Lead Information:**
- Name
- Phone number (mandatory)
- Email address
- Product interest
- Source
- Date captured
- Capturing broker/agent
- Priority level (Hot, Warm, Cold)
- Notes

**Automatic Lead Assignment:**
- Round-robin distribution
- Geographic-based assignment
- Product specialization-based
- Workload-based
- Manual assignment option

#### 5.4.2 Lead Management Workflow

**Lead Stages:**
1. **New Lead** - Just captured, not contacted
2. **Contacted** - Initial contact made
3. **Qualified** - Expressed interest, potential identified
4. **Quoted** - Quotation provided
5. **Negotiation** - Discussing terms
6. **Converted** - Became a client (policy issued)
7. **Lost** - Not interested or went to competitor
8. **Nurturing** - Potential for future (follow-up later)

**Lead Actions:**
- Call logging
- Email tracking
- Meeting scheduling
- Quotation generation
- Follow-up reminders
- Status updates
- Notes and comments
- Conversion to client

**Lead Scoring:**
- Engagement score (calls, emails, meetings)
- Response time score
- Product fit score
- Budget alignment score
- Decision timeline score
- Overall lead score (0-100)

#### 5.4.3 Lead Follow-up System

**Automated Reminders:**
- Overdue follow-ups
- Scheduled callback reminders
- Quotation expiry reminders
- Meeting reminders
- Email, SMS, and in-app notifications

**Activity Tracking:**
- All calls logged
- All emails tracked
- All meetings recorded
- All documents shared tracked
- Timeline view of all activities

**Lead Communication:**
- Email templates (welcome, follow-up, quote, thank you)
- SMS templates
- WhatsApp Business templates (future)
- Personalization tokens (name, product, etc.)

#### 5.4.4 Lead Reporting & Analytics

**Lead Performance Metrics:**
- Total leads by source
- Conversion rate by source
- Average time to conversion
- Leads by stage
- Leads by broker/agent
- Lead response time
- Lost lead reasons

**Sales Funnel Visualization:**
- Leads at each stage
- Conversion rates between stages
- Drop-off points
- Bottleneck identification

---

### 5.5 Claims Management Module

> **Multi-Tenancy:** All claims data, timelines, and assessments are tenant-scoped. Claims submitted by one brokerage firm are invisible to other tenants. NIC compliance tracking operates independently per tenant.

#### 5.5.1 Claims Types

**Life Insurance Claims:**
- Death claims
- Maturity claims
- Surrender claims
- Loan against policy
- Critical illness claims (if rider exists)
- Total permanent disability claims

**Non-Life Insurance Claims:**
- Motor accident claims
- Motor theft claims
- Fire claims
- Burglary claims
- Water damage claims
- Business interruption claims
- Health insurance claims
- Travel insurance claims
- Liability claims

#### 5.5.2 Claims Submission Workflow

**Step 1: Claim Intimation**
- Claim notification (within 24-48 hours of incident)
- Claimant details
- Policy number
- Incident date and time
- Incident location
- Brief description
- Estimated loss amount
- Police report (if applicable)
- Hospital admission (for health/accident claims)

**Step 2: Claim Registration**
- Automatic claim number generation
- Acknowledgment sent to claimant (within 5 working days - NIC requirement)
- Claim assigned to Claims Officer
- Insurer notification
- Investigation initiation (if required)

**Step 3: Document Submission**
- Claim form (completed and signed)
- Policy document
- Premium payment receipts
- Identification documents

**Death Claims Documents:**
- Death certificate
- Police report (if unnatural death)
- Medical report
- Burial certificate
- Beneficiary identification
- Legal documents (will, letters of administration)

**Motor Claims Documents:**
- Police report
- Repair quotations (3 quotes)
- Photos of damaged vehicle
- Driving license
- Vehicle registration
- Insurance certificate

**Property Claims Documents:**
- Police report (for theft/burglary)
- Fire service report (for fire claims)
- Valuation report
- Repair quotations
- Purchase receipts of stolen/damaged items
- Photos/videos of damage

**Health Claims Documents:**
- Medical reports
- Hospital bills and receipts
- Prescription and pharmacy receipts
- Diagnostic reports (lab, X-ray, scan)
- Discharge summary

**Step 4: Document Verification**
- Document completeness check
- Document authenticity verification
- Cross-checking with policy terms
- Request for additional documents (if needed)
- Document approval

**Step 5: Claim Assessment**
- Loss adjuster appointment (for property/motor)
- Medical assessment (for health/disability)
- Investigation report review
- Claim amount determination
- Deductible application
- Depreciation calculation (if applicable)
- Policy limit verification
- Assessment report generation

**Step 6: Claim Approval/Rejection**
- Management review
- Approval decision
- Rejection reasons (if applicable):
  - Policy lapsed
  - Exclusion clause
  - Fraud suspected
  - Inadequate documentation
  - Pre-existing condition (health)
  - Late intimation
- Communication to claimant
- Appeal process information

**Step 7: Claim Settlement**
- Payment approval
- Payment processing:
  - Bank transfer to claimant account
  - Cashier's check
  - Repair facility payment (motor/property)
  - Hospital direct payment (health)
- Payment advice generation
- Discharge voucher
- Claim closure
- NIC reporting

#### 5.5.3 Claims Timeline Tracking

**NIC Compliance Requirements:**
- Acknowledgment: Within 5 working days
- Document review: 10 working days
- Decision communication: 30 working days from complete documentation
- Payment: Within 15 working days of approval

**System Features:**
- Automatic deadline calculation
- Red/amber/green status indicators
- Overdue claims dashboard
- Escalation alerts
- Aging report

**Delay Reason Codes:**
- Awaiting documents from claimant
- Awaiting investigation report
- Awaiting medical assessment
- Awaiting insurer decision
- Legal dispute
- Suspected fraud investigation
- Complex case requiring specialist input

#### 5.5.4 Claims Communication

**Communication Touchpoints:**
- Claim registration confirmation (SMS + Email)
- Acknowledgment letter
- Document deficiency notice
- Investigation appointment notification
- Status update (at each stage)
- Approval/rejection notification
- Payment advice
- Claim closure confirmation

**Internal Communication:**
- Claims Officer to Broker
- Broker to Insurer
- Claims Officer to Management
- Claims Officer to Investigation team
- All communications logged in system

#### 5.5.5 Claims Reporting

**Claims Dashboard:**
- Total claims registered
- Claims pending
- Claims approved
- Claims paid
- Claims rejected
- Average claim settlement time
- Claims ratio (claims paid / premium received)
- Claims by type
- Claims by insurer

**NIC Regulatory Reports:**
- Monthly claims statistics
- Quarterly claims analysis
- Claims settlement ratio
- Average claim processing time
- Claims rejected with reasons
- Outstanding claims report

---

### 5.6 Complaints Management Module

> **Multi-Tenancy:** Complaints are tenant-scoped. Each brokerage firm manages its own complaint register, resolution workflows, and NIC reporting independently.

#### 5.6.1 Complaint Types

**Service Complaints:**
- Poor customer service
- Delayed response
- Inadequate information
- Rude behavior
- Lack of follow-up

**Policy Complaints:**
- Misrepresentation of policy terms
- Hidden charges
- Incorrect policy details
- Endorsement issues
- Premium disputes

**Claims Complaints:**
- Claim rejection dispute
- Delay in claim settlement
- Inadequate claim amount
- Poor investigation
- Claim documentation issues

**Commission Complaints:**
- Commission not paid
- Incorrect commission calculation
- Unauthorized deductions
- Payment delays

#### 5.6.2 Complaint Management Workflow

**Step 1: Complaint Registration**
- Complaint source:
  - Phone call
  - Email
  - Walk-in
  - NIC referral
  - Social media
  - Website form
- Complainant details
- Policy number (if applicable)
- Complaint type
- Complaint description
- Supporting documents
- Complaint number generation
- Acknowledgment sent (within 24 hours)

**Step 2: Complaint Assignment**
- Automatic assignment based on complaint type
- Assignment to relevant department
- Notification to assigned officer
- Deadline setting (15 days for acknowledgment, 30 days for resolution - NIC)

**Step 3: Investigation**
- Facts gathering
- Document review
- Stakeholder consultation
- Root cause analysis
- Investigation report

**Step 4: Resolution**
- Resolution options:
  - Complaint justified - corrective action
  - Complaint partially justified - partial relief
  - Complaint unjustified - explanation provided
- Resolution communication
- Complainant acceptance

**Step 5: Closure**
- Complainant satisfaction survey
- Corrective measures implementation
- Complaint closure
- Learning and improvement recommendations
- NIC reporting (if required)

#### 5.6.3 Complaint Escalation

**Escalation Levels:**
1. Level 1: Customer Service Representative (0-5 days)
2. Level 2: Department Manager (5-15 days)
3. Level 3: Compliance Officer (15-30 days)
4. Level 4: Senior Management (30+ days)
5. External: National Insurance Commission (if unresolved)

**Escalation Triggers:**
- Deadline breach
- Complainant dissatisfaction
- Complex issue requiring senior input
- Legal implications
- Reputational risk

#### 5.6.4 Complaints Reporting

**Complaints Dashboard:**
- Total complaints received
- Complaints resolved
- Complaints pending
- Average resolution time
- Complaints by type
- Complaints by resolution status
- Repeat complaints

**NIC Regulatory Reports:**
- Monthly complaints register
- Quarterly complaints analysis
- Complaint resolution time
- Lessons learned report

---

### 5.7 Internal Messaging/Chat System Module

> **Multi-Tenancy:** The chat system is fully tenant-scoped. Users can only message colleagues within their own brokerage firm. Chat rooms, messages, and file sharing are completely isolated between tenants. No cross-tenant communication is possible through the internal chat.

#### 5.7.1 Chat System Overview

The internal messaging system provides a WhatsApp-like communication platform for team members to collaborate on client management, policy processing, claims handling, and general business operations. This enables real-time communication and reduces dependency on external messaging platforms.

#### 5.7.2 Chat Features

**Core Messaging:**
- One-on-one chats
- Group chats (departments, project teams, case-specific)
- Broadcast messages (admin to all users)
- Message read receipts (single tick, double tick, blue tick)
- Typing indicators
- Online/offline status
- Last seen timestamp

**Message Types:**
- Text messages
- File attachments (documents, images, PDFs)
- Voice notes (60 seconds max)
- Links with preview
- Emoji support
- Mentions (@username)
- Message replies/threads

**Message Management:**
- Edit sent messages (within 15 minutes)
- Delete messages (delete for me / delete for everyone)
- Forward messages
- Copy message text
- Star/favorite important messages
- Search messages (by keyword, sender, date range)
- Message reactions (like, thumbs up, etc.)

**Contextual Chat:**
- **Client-specific chats:**
  - Link chat to client record
  - Quick access to client details within chat
  - Discussion about client KYC, policies, claims
  - Tag messages with client ID for reference
  
- **Policy-specific chats:**
  - Link chat to policy number
  - Discuss underwriting issues
  - Premium payment follow-up
  - Renewal discussions
  
- **Claim-specific chats:**
  - Link chat to claim number
  - Discuss claim documentation
  - Assessment updates
  - Settlement coordination
  
- **Lead-specific chats:**
  - Link chat to lead ID
  - Strategy discussion for lead conversion
  - Quotation feedback
  - Follow-up coordination

**Group Chat Management:**
- Create group (with name and icon)
- Add/remove participants
- Group admin privileges:
  - Edit group info
  - Change group icon
  - Manage participants
  - Delete group
  - Restrict messaging to admins only
- Maximum participants: 256
- Group chat for:
  - Department teams
  - Project teams
  - Case-specific discussions
  - Training and announcements

**Notifications:**
- Desktop notifications
- Mobile push notifications
- In-app notification badge
- Sound alerts
- Notification settings:
  - Mute chats (1 hour, 8 hours, 1 week, always)
  - Mute groups
  - Custom notification sounds
  - Do Not Disturb mode

**File Sharing:**
- Supported formats: PDF, DOCX, XLSX, PNG, JPG, MP4
- Maximum file size: 25 MB
- Preview for images and PDFs
- Download and share options
- Automatic virus scanning
- Retention policy aligned with document management

**Search and Organization:**
- Global search across all chats
- Search within specific chat
- Filter by:
  - Unread messages
  - Starred messages
  - Media files
  - Documents
  - Links
- Archive chats
- Pin important chats to top

#### 5.7.3 Chat Security & Compliance

**Privacy:**
- End-to-end encryption (at rest and in transit)
- Access control based on user roles
- No screenshot protection (warning message)
- Message retention policy (7 years for compliance)
- Audit trail of all messages
- Export chat history for compliance/legal purposes

**Compliance Features:**
- All chat messages are logged
- Cannot be permanently deleted from system (soft delete only)
- Compliance officer can access all chats for audit
- Chat exports for NIC/legal inquiries
- Automatic flagging of sensitive keywords (AML, fraud indicators)

**Professional Use Policy:**
- Terms of use displayed on first login
- Acceptable use guidelines
- Prohibited content warnings
- Consequences of misuse

#### 5.7.4 Integration with Other Modules

**Client Management Integration:**
- Click on client name in chat to view full profile
- Initiate chat from client detail page
- Automatic client context in chat header
- Quick actions: Call, Email, View Policies, View Claims

**Policy Management Integration:**
- Share policy details in chat
- Discuss policy with team
- @mention claims officer for issues
- Link chat to policy workflow

**Claims Management Integration:**
- Claims team chat room for each claim
- Share claim documents in chat
- Discuss assessment and settlement
- Notify claimant via SMS/Email from chat

**Task Management:**
- Create tasks from chat messages
- Assign tasks to team members
- Track task completion
- Task reminders and notifications

#### 5.7.5 Chat Analytics

**Usage Metrics:**
- Total messages sent
- Active users
- Message volume by department
- Average response time
- Peak usage hours
- Most active users
- Group chat participation

**Productivity Insights:**
- Response time to client queries
- Time spent on claims discussion
- Collaboration patterns
- Information sharing effectiveness

---

### 5.8 Document Management Module

> **Multi-Tenancy:** All documents are stored in tenant-isolated storage paths. Each brokerage firm can only access documents belonging to their own tenant. Storage quotas and retention policies can be configured per tenant.

#### 5.8.1 Document Types

**Client Documents:**
- Ghana Card
- Passport photos
- Proof of address
- Employment letter
- Income documents
- Bank statements

**Policy Documents:**
- Proposal forms
- Medical reports
- Inspection reports
- Policy certificates
- Endorsement documents
- Premium receipts

**Claims Documents:**
- Claim forms
- Police reports
- Medical reports
- Repair quotations
- Photos/videos
- Settlement vouchers

**Compliance Documents:**
- KYC forms
- AML assessments
- Suspicious transaction reports
- Audit reports
- Regulatory correspondence

**Company Documents:**
- Broker license
- Registration certificates
- Financial statements
- Compliance certificates
- Employee records

#### 5.8.2 Document Storage & Retrieval

**Document Upload:**
- Drag-and-drop interface
- Bulk upload
- Mobile camera upload
- Scanner integration
- OCR for text extraction
- Automatic document categorization

**Document Metadata:**
- Document name
- Document type
- Upload date and time
- Uploaded by (user)
- Related to (client/policy/claim)
- File size
- File format
- Version number
- Tags for easy search

**Document Search:**
- Search by client name
- Search by policy number
- Search by claim number
- Search by document type
- Search by date range
- Full-text search (OCR enabled)
- Advanced filters

**Document Version Control:**
- Multiple versions of same document
- Version history
- Compare versions
- Restore previous version
- Track changes

#### 5.8.3 Document Security

**Access Control:**
- Role-based access
- Document-level permissions
- Watermarking for sensitive documents
- Download restrictions
- Print restrictions
- Prevent copy-paste

**Encryption:**
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Secure deletion (data wiping)

**Audit Trail:**
- Who uploaded
- Who viewed
- Who downloaded
- Who deleted
- When and from where (IP address)

#### 5.8.4 Document Retention Policy

**Retention Periods:**
- Client documents: 6 years after relationship ends
- Policy documents: 6 years after policy expiry
- Claims documents: 6 years after claim settlement
- Compliance documents: 6 years minimum
- Financial documents: 7 years (tax requirement)

**Archival Process:**
- Automatic archival after retention period
- Archival storage (cheaper, slower access)
- Restoration from archive (if needed)
- Permanent deletion after legal retention

**Compliance:**
- Cannot delete documents before retention period
- Audit log for all deletions
- Legal hold feature (prevent deletion for legal cases)

---

### 5.9 Reporting & Analytics Module

> **Multi-Tenancy:** All reports and analytics are tenant-scoped. Each brokerage firm sees dashboards and KPIs reflecting only their own data. The Platform Super Admin has access to a separate cross-tenant analytics dashboard for platform-wide metrics.

#### 5.9.1 Executive Dashboard

**Key Performance Indicators (KPIs):**
- Total clients
- Total active policies
- Total premium collected (MTD, YTD)
- Total claims paid (MTD, YTD)
- Claims ratio
- New business (policies, premium)
- Renewals (policies, premium)
- Lapses (policies, premium)
- Average policy value
- Commission earned
- Outstanding premiums
- Lead conversion rate

**Visual Widgets:**
- Line charts (premium trends)
- Bar charts (comparison)
- Pie charts (policy mix)
- Gauge charts (targets vs. actual)
- Heat maps (geographic distribution)
- Data tables (top performers)

**Filters:**
- Date range selector
- Broker/Agent filter
- Product type filter
- Insurer filter
- Region filter

**Export Options:**
- PDF report
- Excel export
- Scheduled reports (daily, weekly, monthly)
- Email distribution

#### 5.9.2 Business Intelligence Reports

**Sales Reports:**
- New business register
- Renewal business register
- Lapsed policies report
- Cancellation report
- Policy portfolio analysis
- Premium income analysis
- Commission analysis
- Sales target vs. achievement
- Broker performance comparison
- Product performance analysis

**Claims Reports:**
- Claims register
- Claims by type
- Claims by insurer
- Claims settlement ratio
- Average claim amount
- Claims processing time
- Outstanding claims report
- Claims aging report
- Claims rejection analysis
- Claims fraud indicators

**Financial Reports:**
- Premium collection report
- Outstanding premium report
- Commission payable report
- Commission paid report
- Receivables aging
- Cash flow report
- Profit & loss statement
- Balance sheet

**Compliance Reports:**
- KYC completion status
- AML risk assessment summary
- Suspicious transaction report
- Complaint register
- Complaint resolution time
- Regulatory submissions tracker
- Audit trail report
- Document retention status

**Client Reports:**
- Client register
- Client acquisition report
- Client retention rate
- Client lifetime value
- Client segmentation analysis
- Client satisfaction scores
- Birthday list
- Policy maturity list

#### 5.9.3 Predictive Analytics

**Machine Learning Models:**
- Churn prediction (clients likely to lapse)
- Lead scoring (likelihood to convert)
- Claims fraud detection
- Cross-sell/Up-sell recommendations
- Premium default prediction
- Customer lifetime value prediction

**Recommendation Engine:**
- Product recommendations based on client profile
- Next best action for brokers
- Renewal strategy suggestions
- Risk mitigation suggestions

---

### 5.10 Additional Modules

#### 5.10.1 Commission Reconciliation Module
- Match policies issued with commission statements from insurers
- Flag discrepancies
- Dispute management
- Commission payment workflow

#### 5.10.2 Task Management Module
- Create tasks with due dates
- Assign to users
- Task priorities (High, Medium, Low)
- Task reminders
- Task completion tracking
- Calendar view
- Kanban board view

#### 5.10.3 Email Integration
- Connect broker's email account
- Send emails from within system
- Track sent emails
- Email templates
- Auto-filing of emails to client/policy/claim records

#### 5.10.4 SMS Gateway Integration
- Send SMS notifications
- Bulk SMS for campaigns
- SMS templates
- SMS delivery reports
- Two-way SMS (receive replies)
- SMS cost tracking

#### 5.10.5 Mobile Money Integration
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money
- Premium collection via mobile money
- Claims payment via mobile money
- Commission payment via mobile money
- Transaction reconciliation

#### 5.10.6 Insurer Portal Integration
- API integration with major insurers
- Automatic quotation from insurer systems
- Policy issuance API
- Claims submission API
- Premium reconciliation
- Commission statements

---

### 5.11 Tenant Management Module

> This module is unique to the multi-tenant SaaS architecture. It manages the lifecycle of brokerage firms (tenants) on the platform, including onboarding, configuration, billing, and platform administration.

#### 5.11.1 Tenant Registration & Onboarding

**Self-Service Registration:**
- Brokerage firm name and slug (used for subdomain: `{slug}.ibms.com`)
- Company registration number (RGD number)
- NIC broker license number (validated)
- TIN (Tax Identification Number)
- Primary contact person (Tenant Administrator):
  - Full name
  - Email address
  - Phone number
  - Ghana Card number
- Physical address and digital address
- Business size (number of brokers/agents)
- Subscription plan selection

**Onboarding Workflow:**
1. Registration form submission
2. Automatic validation of NIC license (if API available)
3. Tenant record creation and subdomain provisioning (`{slug}.ibms.com`)
4. Tenant Administrator account creation with temporary password
5. Welcome email with login credentials and setup guide
6. First-login setup wizard:
   - Company logo upload
   - Brand colors selection
   - Default roles and permissions configuration
   - Insurer/carrier selection (which insurers the firm works with)
   - Commission structure setup
   - First user invitations (invite other staff members)
7. Onboarding completion notification to Platform Super Admin

**Verification:**
- Platform Super Admin reviews and approves new tenant registrations
- Manual verification of NIC license and company registration
- Approval/rejection notification sent to tenant contact
- Suspended accounts for pending verification (limited access)

#### 5.11.2 Tenant Configuration

**Company Branding:**
- Company name (displayed in header and documents)
- Company logo (used in dashboard, PDF reports, client communications)
- Brand primary color and accent color
- Custom favicon
- Custom login page background
- Company tagline/slogan
- Company address and contact details (for document headers/footers)

**Operational Settings:**
- Default currency (GHS - Ghana Cedis)
- Business hours (for SLA calculations)
- Fiscal year start date
- Default commission percentages per product type
- Premium payment grace periods
- Auto-renewal preferences
- Lead assignment rules (round-robin, geographic, manual)
- Notification preferences (email, SMS, in-app)

**Policy Numbering:**
- Custom policy number prefix (e.g., `SB-POL-`)
- Custom claim number prefix (e.g., `SB-CLM-`)
- Custom client number prefix (e.g., `SB-CLI-`)
- Custom lead number prefix (e.g., `SB-LED-`)
- Sequential numbering resets (yearly, never)

**Compliance Settings:**
- KYC/AML strictness level (standard, enhanced)
- AML risk scoring thresholds
- Mandatory fields configuration
- Document retention overrides (minimum 6 years, configurable higher)
- PEP screening configuration

**Integration Settings (Per Tenant):**
- SMS gateway credentials (Hubtel, Twilio, etc.)
- Email service credentials (SendGrid, SES, etc.)
- Payment gateway credentials (Paystack, Flutterwave, etc.)
- Mobile Money merchant IDs
- Insurer API credentials
- Each tenant manages their own third-party integrations

#### 5.11.3 Subscription & Billing

**Subscription Plans:**

| Feature | Basic | Professional | Enterprise |
|---------|-------|-------------|------------|
| Monthly Price | GHS 500 | GHS 1,500 | Custom |
| Max Users | 10 | 50 | Unlimited |
| Max Clients | 1,000 | 10,000 | Unlimited |
| Max Policies | 2,000 | 20,000 | Unlimited |
| Document Storage | 5 GB | 50 GB | Unlimited |
| SMS Credits/Month | 500 | 5,000 | Custom |
| Email Sends/Month | 2,000 | 20,000 | Unlimited |
| Chat System | ✓ | ✓ | ✓ |
| Claims Module | ✗ | ✓ | ✓ |
| Advanced Analytics | ✗ | ✓ | ✓ |
| API Access | ✗ | ✗ | ✓ |
| Custom Domain | ✗ | ✗ | ✓ |
| Dedicated Support | ✗ | ✗ | ✓ |
| SLA | 99.5% | 99.9% | 99.99% |

**Billing Cycle:**
- Monthly billing (default)
- Annual billing (10% discount)
- Invoice generation on the 1st of each month
- Payment due within 15 days
- Automatic payment collection (mobile money, card)
- Manual bank transfer option

**Usage Tracking:**
- Active users count
- Client count
- Policy count
- Document storage used
- SMS credits consumed
- Email sends consumed
- API calls (for Enterprise tier)

**Overage Handling:**
- Soft limits: Warning notification at 80% and 95% of plan limits
- Hard limits: Service degradation (cannot create new records) when limits exceeded
- Automatic plan upgrade suggestion
- Grace period: 7 days to upgrade before service restrictions

**Billing Management:**
- Invoice history and download (PDF)
- Payment history
- Payment method management (add/update cards, mobile money numbers)
- Subscription upgrade/downgrade
- Subscription cancellation with exit process
- Outstanding balance tracking
- Late payment notifications and penalties

#### 5.11.4 Tenant Administration

**Tenant Dashboard:**
- Subscription plan and usage summary
- Active users count
- Storage utilization
- Upcoming billing date and amount
- Account health score
- Quick links to configuration sections

**User Management Within Tenant:**
- Invite users via email
- Assign roles (from tenant-level roles: System Admin, Manager, Broker, etc.)
- Set user permissions (fine-grained)
- Activate/deactivate user accounts
- View user activity logs
- Manage user passwords (forced reset)

**Data Management:**
- Full data export (CSV, JSON) for all modules
- Data import tools (for migrating from another system)
- Data backup request (manual backup snapshot)
- Data deletion request (with regulatory compliance checks)

**Tenant Settings:**
- Update company information
- Change subscription plan
- Manage integrations
- Configure notification preferences
- Set up automated workflows
- Manage approval chains

#### 5.11.5 Platform Super Admin Dashboard

**Tenant Overview:**
- Total registered tenants
- Active tenants vs. suspended/deactivated
- New tenant registrations (this month)
- Tenant subscription distribution (Basic/Professional/Enterprise)
- Revenue summary (MRR - Monthly Recurring Revenue)

**Tenant Management:**
- Approve/reject new tenant registrations
- View tenant details and configuration
- Suspend tenant (for non-payment, TOS violation)
- Reactivate suspended tenant
- Deactivate tenant (permanent, with data archival)
- Impersonate tenant admin (for support, with audit logging)
- Force password reset for tenant users

**Platform Analytics:**
- Total users across all tenants
- Total clients across all tenants
- Total policies across all tenants
- Platform usage trends (growth, churn)
- Revenue analytics (by plan, by month, ARR)
- Feature usage analytics (most/least used modules)
- Performance metrics (response times, error rates per tenant)

**System Administration:**
- Global configuration (default settings for new tenants)
- Subscription plan management (create/edit plans, pricing)
- Feature flag management (enable/disable features globally or per tenant)
- Platform maintenance scheduling
- System health monitoring
- Database administration
- Background job monitoring

**Support Tools:**
- Tenant issue tracker
- Cross-tenant search (for support purposes, with audit trail)
- Tenant communication (announcements, maintenance notices)
- Knowledge base management
- Incident management

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance Requirements

**Response Time:**
- Page load time: < 3 seconds
- Search results: < 2 seconds
- Report generation: < 10 seconds (for standard reports)
- API response time: < 500 milliseconds
- Database query time: < 1 second
- File upload: < 5 seconds for 5MB file

**Throughput:**
- Support 500 concurrent users
- Handle 10,000 transactions per day
- Process 1,000 simultaneous searches

**Scalability:**
- Horizontal scaling capability
- Auto-scaling based on load
- **Multi-Tenant Scale Targets:**
  - Support up to 500 tenants (brokerage firms)
  - Support up to 500 concurrent users per tenant
  - Support up to 20,000 clients per tenant
  - Support up to 50,000 policies per tenant
  - Support up to 10,000 claims per year per tenant
  - Total platform capacity: 10 million clients, 25 million policies
  - Database size: Up to 5TB (shared across all tenants)
- Per-tenant resource isolation (no single tenant can degrade platform performance)
- Tenant-aware auto-scaling (scale services based on aggregate and individual tenant load)

### 6.2 Security Requirements

**Authentication:**
- Multi-factor authentication (2FA)
- Strong password policy
- Account lockout after failed attempts
- Session timeout (15 minutes of inactivity)
- Single sign-on (SSO) support

**Authorization:**
- Role-based access control (RBAC)
- Granular permissions
- Data access restrictions based on assignment
- **Tenant-scoped RBAC:** Roles and permissions are enforced within tenant boundaries
- Audit trail for all access
- **Tenant isolation:** No user can access data from another tenant (enforced at database level via RLS)

**Data Security:**
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Database encryption
- Secure key management
- Regular security patching

**Application Security:**
- Protection against OWASP Top 10:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)
  - Insecure Deserialization
  - Security Misconfiguration
  - Broken Authentication
  - Sensitive Data Exposure
  - XML External Entities (XXE)
  - Broken Access Control
  - Insufficient Logging & Monitoring
- Input validation and sanitization
- Output encoding
- Secure file upload
- Rate limiting to prevent DoS
- CAPTCHA for forms

**Network Security:**
- Web Application Firewall (WAF)
- DDoS protection
- Intrusion Detection System (IDS)
- Virtual Private Network (VPN) for admin access
- IP whitelisting for critical functions

**Backup & Disaster Recovery:**
- Daily automated backups
- Backup retention: 30 days
- Off-site backup storage
- Backup encryption
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 24 hours
- Disaster recovery plan
- Regular disaster recovery testing

**Compliance:**
- GDPR compliance (for future EU business)
- Data Protection Act 2012 compliance
- PCI DSS compliance (for payment card data)
- Regular security audits
- Penetration testing (annual)
- Vulnerability scanning (monthly)

### 6.3 Reliability Requirements

**Availability:**
- System uptime: 99.9% (excluding planned maintenance)
- Planned downtime: 4 hours per month (midnight to 4 AM)
- Unplanned downtime: < 1 hour per month

**Fault Tolerance:**
- Redundant servers
- Database replication
- Load balancing
- Automatic failover
- Graceful degradation

**Error Handling:**
- User-friendly error messages
- Detailed error logging
- Automatic error reporting
- Error recovery mechanisms

**Data Integrity:**
- Database constraints
- Data validation
- Transaction management (ACID properties)
- Regular data integrity checks
- Data corruption prevention

### 6.4 Usability Requirements

**User Interface:**
- Clean, intuitive design
- Consistent UI across modules
- Responsive design (mobile, tablet, desktop)
- Accessibility compliance (WCAG 2.1 Level AA)
- Support for visually impaired users
- Keyboard navigation support

**Ease of Use:**
- Maximum 3 clicks to reach any feature
- Inline help and tooltips
- Contextual help
- Search functionality throughout the application
- Breadcrumb navigation
- Undo functionality for critical actions

**Learnability:**
- User onboarding wizard
- Video tutorials
- User manual
- FAQ section
- In-app guidance
- Role-specific training materials

**Localization:**
- English (primary language)
- Potential for local language support (Twi, Ga, Ewe - future)
- Date format: DD/MM/YYYY
- Currency: Ghana Cedis (GHS)
- Time zone: GMT (Ghana Standard Time)
- Number format: 1,000.00

### 6.5 Maintainability Requirements

**Code Quality:**
- Clean, well-documented code
- Coding standards adherence
- Code comments
- Modular architecture
- Design patterns usage

**Testing:**
- Unit test coverage: > 80%
- Integration testing
- User acceptance testing (UAT)
- Performance testing
- Security testing

**Deployment:**
- Continuous Integration/Continuous Deployment (CI/CD)
- Zero-downtime deployment
- Rollback capability
- Blue-green deployment
- Feature flags for gradual rollout
- **Tenant-aware migrations:** Database migrations must not disrupt active tenants
- **Per-tenant feature flags:** Ability to enable/disable features for specific tenants

**Monitoring:**
- Application performance monitoring
- Error tracking
- Usage analytics
- Server monitoring
- Database monitoring
- Alerting for critical issues
- **Per-tenant monitoring:** Track resource usage, error rates, and performance per tenant
- **Tenant health dashboard:** Platform-wide view of all tenant statuses

**Documentation:**
- API documentation
- System architecture documentation
- Database schema documentation
- User documentation
- Admin documentation
- Deployment documentation
- Troubleshooting guide

### 6.6 Compatibility Requirements

**Browser Support:**
- Google Chrome (latest 2 versions)
- Mozilla Firefox (latest 2 versions)
- Microsoft Edge (latest 2 versions)
- Safari (latest 2 versions)

**Mobile Support:**
- iOS 14+ (iPhone, iPad)
- Android 9+ (all screen sizes)

**Operating System:**
- Windows 10+
- macOS 10.15+
- Linux (Ubuntu 20.04+)

**Third-Party Integration:**
- Payment gateways APIs
- SMS gateway APIs
- Email service providers
- Mobile money APIs
- Insurer APIs

---

## 7. TECHNICAL SPECIFICATIONS

### 7.1 System Requirements

#### 7.1.1 Development Environment

**Hardware Requirements (Developer Workstation):**
- Processor: Intel Core i5 or equivalent (8th gen or newer)
- RAM: 16 GB minimum (32 GB recommended)
- Storage: 256 GB SSD minimum
- Internet: Broadband connection (10 Mbps minimum)

**Software Requirements (Development Tools):**
- IDE: Visual Studio Code, Visual Studio 2022, or JetBrains IDEs
- Node.js 20 LTS (for frontend build tools)
- Git for version control
- Docker Desktop
- Database tools (pgAdmin, MySQL Workbench)
- API testing tools (Postman, Insomnia)
- Browser developer tools

#### 7.1.2 Production Environment

**Web Server:**
- Application Server:
  - CPU: 8 cores minimum
  - RAM: 32 GB minimum
  - Storage: 500 GB SSD
  - OS: Ubuntu Server 22.04 LTS or Windows Server 2022
  
**Database Server:**
- CPU: 8 cores minimum
- RAM: 64 GB minimum (for 20,000+ clients)
- Storage: 1 TB SSD (with expansion capability)
- OS: Ubuntu Server 22.04 LTS or Windows Server 2022

**File Storage:**
- Object storage: 5 TB minimum
- Scalable to 50 TB
- S3-compatible interface

**Load Balancer:**
- Nginx or HAProxy
- CPU: 4 cores
- RAM: 8 GB

**Redis Server (Cache):**
- CPU: 4 cores
- RAM: 16 GB
- Storage: 100 GB SSD

**Backup Server:**
- Storage: 2x production database size
- Automated backup scripts

**Network:**
- Bandwidth: 1 Gbps minimum
- Dedicated IP addresses
- SSL certificates
- DDoS protection

#### 7.1.3 Client Requirements

**Desktop Users:**
- Processor: Intel Core i3 or equivalent
- RAM: 4 GB minimum
- Browser: Chrome, Firefox, Edge, Safari (latest version)
- Internet: 2 Mbps minimum
- Screen resolution: 1366x768 minimum

**Mobile Users:**
- iOS 14+ or Android 9+
- 2 GB RAM minimum
- 100 MB free storage
- Internet: 1 Mbps minimum (3G/4G/5G/WiFi)

### 7.2 Software Architecture

#### 7.2.1 Architectural Pattern
- **Microservices Architecture** (Recommended)
  - Independent services for each module
  - Better scalability
  - Technology diversity
  - Fault isolation
  
- **Monolithic Architecture** (Alternative for small teams)
  - Single codebase
  - Easier to develop initially
  - Simpler deployment
  - Can be migrated to microservices later

#### 7.2.2 Design Patterns
- **Repository Pattern** - Data access abstraction
- **Factory Pattern** - Object creation
- **Observer Pattern** - Event handling
- **Strategy Pattern** - Algorithm selection
- **Dependency Injection** - Loose coupling
- **CQRS** - Command Query Responsibility Segregation (for complex modules)

#### 7.2.3 Communication Protocols
- **REST API** - Primary API protocol
- **GraphQL** - Alternative for complex queries (optional)
- **WebSocket** - Real-time chat and notifications
- **gRPC** - Inter-service communication (microservices)
- **Message Queue** - Asynchronous processing (RabbitMQ or Redis)

### 7.3 Development Standards

#### 7.3.1 Coding Standards
- Follow language-specific best practices:
  - .NET: Microsoft C# Coding Conventions
  - JavaScript/TypeScript: Airbnb Style Guide
  - Python: PEP 8
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused (< 50 lines)
- Avoid code duplication (DRY principle)

#### 7.3.2 Version Control
- Git workflow: GitFlow or GitHub Flow
- Branch naming conventions:
  - feature/feature-name
  - bugfix/bug-description
  - hotfix/critical-issue
  - release/version-number
- Commit message format: Conventional Commits
- Pull request reviews mandatory
- No direct commits to main/master branch

#### 7.3.3 Code Review Process
- All code changes must be reviewed
- Minimum 2 approvals required
- Automated code quality checks (linting)
- Security scanning
- Test coverage check
- Performance impact assessment

#### 7.3.4 Testing Standards
- Unit tests for all business logic
- Integration tests for API endpoints
- End-to-end tests for critical workflows
- Test coverage minimum: 80%
- Automated testing in CI/CD pipeline
- Manual testing for UI/UX

---

## 8. DATABASE SCHEMA

> [!IMPORTANT]
> **Multi-Tenancy Database Strategy:** The IBMS uses a **shared database, shared schema** approach with **Row-Level Security (RLS)** for tenant data isolation. Every table listed below (except the `tenants` and `tenant_subscriptions` tables themselves) **must include a `tenant_id UUID NOT NULL REFERENCES tenants(tenant_id)` column** as the first column after the primary key. All indexes should include `tenant_id` as a leading column for optimal query performance. PostgreSQL RLS policies (see Section 4.3.2) enforce automatic filtering on every query.

### 8.0 Multi-Tenancy Tables

#### 8.0.1 Tenants Table
```sql
CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_name VARCHAR(200) NOT NULL,           -- Brokerage firm name
    tenant_slug VARCHAR(100) UNIQUE NOT NULL,    -- Used for subdomain: {slug}.ibms.com
    company_registration_no VARCHAR(50),          -- RGD number
    nic_license_number VARCHAR(50),               -- NIC broker license
    tin VARCHAR(50),                               -- Tax Identification Number
    physical_address TEXT,
    digital_address VARCHAR(50),                  -- Ghana Post GPS
    primary_contact_name VARCHAR(100) NOT NULL,
    primary_contact_email VARCHAR(100) NOT NULL,
    primary_contact_phone VARCHAR(15) NOT NULL,
    logo_url VARCHAR(500),
    brand_primary_color VARCHAR(7) DEFAULT '#1a73e8',
    brand_accent_color VARCHAR(7) DEFAULT '#fbbc04',
    favicon_url VARCHAR(500),
    tagline VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'suspended', 'deactivated')),
    subscription_plan VARCHAR(20) NOT NULL DEFAULT 'basic'
        CHECK (subscription_plan IN ('basic', 'professional', 'enterprise')),
    max_users INT NOT NULL DEFAULT 10,
    max_clients INT NOT NULL DEFAULT 1000,
    max_policies INT NOT NULL DEFAULT 2000,
    max_storage_gb INT NOT NULL DEFAULT 5,
    custom_domain VARCHAR(200),                   -- Enterprise tier only
    settings JSONB DEFAULT '{}',                  -- Tenant-specific configurations
    verified_at TIMESTAMP,
    verified_by UUID,
    suspended_at TIMESTAMP,
    suspended_reason TEXT,
    deactivated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_tenants_slug ON tenants(tenant_slug);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_nic ON tenants(nic_license_number);
```

#### 8.0.2 Tenant Subscriptions Table
```sql
CREATE TABLE tenant_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('basic', 'professional', 'enterprise')),
    billing_cycle VARCHAR(10) NOT NULL DEFAULT 'monthly'
        CHECK (billing_cycle IN ('monthly', 'annual')),
    amount_ghs DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'past_due', 'cancelled', 'suspended')),
    current_period_start DATE NOT NULL,
    current_period_end DATE NOT NULL,
    next_billing_date DATE,
    payment_method VARCHAR(50),                   -- 'card', 'mobile_money', 'bank_transfer'
    payment_reference VARCHAR(100),
    auto_renew BOOLEAN DEFAULT TRUE,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_tenant ON tenant_subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON tenant_subscriptions(status);
CREATE INDEX idx_subscriptions_billing ON tenant_subscriptions(next_billing_date);
```

#### 8.0.3 Tenant Usage Tracking Table
```sql
CREATE TABLE tenant_usage (
    usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    active_users_count INT DEFAULT 0,
    clients_count INT DEFAULT 0,
    policies_count INT DEFAULT 0,
    storage_used_mb DECIMAL(10,2) DEFAULT 0,
    sms_sent INT DEFAULT 0,
    emails_sent INT DEFAULT 0,
    api_calls INT DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_tenant ON tenant_usage(tenant_id);
CREATE INDEX idx_usage_period ON tenant_usage(period_start, period_end);
```

#### 8.0.4 Multi-Tenancy Column Requirements

> The following table summarizes the `tenant_id` column and index requirements for all existing tables. Each table below must add:
> - `tenant_id UUID NOT NULL REFERENCES tenants(tenant_id)` as a column
> - A composite index including `tenant_id` as the leading column
> - Row-Level Security (RLS) policy for tenant isolation

| Table | Tenant Column | Composite Index | Notes |
|-------|--------------|-----------------|-------|
| `users` | `tenant_id` | `(tenant_id, email)` UNIQUE | Same email allowed in different tenants |
| `roles` | `tenant_id` | `(tenant_id, role_name)` UNIQUE | Tenant-specific roles |
| `permissions` | `tenant_id` | `(tenant_id, permission_name)` | Tenant-specific permissions |
| `clients` | `tenant_id` | `(tenant_id, ghana_card_number)` | Client data fully isolated |
| `beneficiaries` | `tenant_id` | `(tenant_id, client_id)` | Via client relationship |
| `policies` | `tenant_id` | `(tenant_id, policy_number)` UNIQUE | Policy numbers unique per tenant |
| `policy_payments` | `tenant_id` | `(tenant_id, policy_id)` | Payment records |
| `claims` | `tenant_id` | `(tenant_id, claim_number)` UNIQUE | Claim numbers unique per tenant |
| `leads` | `tenant_id` | `(tenant_id, status)` | Lead tracking |
| `complaints` | `tenant_id` | `(tenant_id, complaint_number)` | Complaint management |
| `chat_rooms` | `tenant_id` | `(tenant_id, room_type)` | Tenant-scoped chat |
| `chat_messages` | `tenant_id` | `(tenant_id, room_id, sent_at)` | Message isolation |
| `documents` | `tenant_id` | `(tenant_id, entity_type, entity_id)` | Document storage |
| `audit_logs` | `tenant_id` | `(tenant_id, action_timestamp)` | Audit trail |
| `insurers` | `tenant_id` | `(tenant_id, insurer_name)` | Tenant-specific insurer config |
| `products` | `tenant_id` | `(tenant_id, insurer_id)` | Product catalog |
| `commissions` | `tenant_id` | `(tenant_id, policy_id)` | Commission tracking |

### 8.1 Core Tables

#### 8.1.1 Users Table
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(role_id),
    is_active BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(100),
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    password_changed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
```

#### 8.1.2 Roles & Permissions Tables
```sql
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    permission_description TEXT,
    module VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
```

#### 8.1.3 Clients Table
```sql
CREATE TABLE clients (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_type VARCHAR(20) NOT NULL CHECK (client_type IN ('individual', 'corporate')),
    
    -- Personal Information (Individual)
    first_name VARCHAR(50),
    middle_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50),
    marital_status VARCHAR(20),
    occupation VARCHAR(100),
    employer_name VARCHAR(200),
    
    -- Corporate Information
    company_name VARCHAR(200),
    registration_number VARCHAR(50),
    tin VARCHAR(50),
    incorporation_date DATE,
    business_type VARCHAR(100),
    
    -- Identification
    ghana_card_number VARCHAR(20) UNIQUE,
    passport_number VARCHAR(20),
    drivers_license VARCHAR(20),
    
    -- Contact Information
    primary_phone VARCHAR(15) NOT NULL,
    alternative_phone VARCHAR(15),
    email VARCHAR(100),
    digital_address VARCHAR(20),
    physical_address TEXT,
    city VARCHAR(50),
    region VARCHAR(50),
    gps_coordinates POINT,
    
    -- KYC/AML
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
    kyc_approved_by UUID REFERENCES users(user_id),
    kyc_approved_at TIMESTAMP,
    aml_risk_level VARCHAR(20) CHECK (aml_risk_level IN ('low', 'medium', 'high')),
    is_pep BOOLEAN DEFAULT FALSE,
    source_of_funds VARCHAR(100),
    
    -- Banking
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_account_name VARCHAR(200),
    bank_branch VARCHAR(100),
    
    -- Assignment
    assigned_broker_id UUID REFERENCES users(user_id),
    
    -- Status
    client_status VARCHAR(20) DEFAULT 'active' CHECK (client_status IN ('active', 'inactive', 'suspended')),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_clients_ghana_card ON clients(ghana_card_number);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_broker ON clients(assigned_broker_id);
CREATE INDEX idx_clients_status ON clients(client_status);
```

#### 8.1.4 Beneficiaries Table
```sql
CREATE TABLE beneficiaries (
    beneficiary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    ghana_card_number VARCHAR(20),
    phone_number VARCHAR(15),
    address TEXT,
    percentage_allocation DECIMAL(5,2) CHECK (percentage_allocation > 0 AND percentage_allocation <= 100),
    guardian_name VARCHAR(150),
    guardian_phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_beneficiaries_client ON beneficiaries(client_id);
```

#### 8.1.5 Policies Table
```sql
CREATE TABLE policies (
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(client_id),
    insurer_id INT NOT NULL REFERENCES insurers(insurer_id),
    product_id INT NOT NULL REFERENCES products(product_id),
    
    -- Policy Details
    policy_type VARCHAR(20) NOT NULL CHECK (policy_type IN ('life', 'non-life')),
    coverage_type VARCHAR(100) NOT NULL,
    sum_insured DECIMAL(15,2) NOT NULL,
    premium_amount DECIMAL(15,2) NOT NULL,
    premium_frequency VARCHAR(20) NOT NULL CHECK (premium_frequency IN ('monthly', 'quarterly', 'semi-annual', 'annual', 'single')),
    
    -- Dates
    issue_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    next_premium_due_date DATE,
    
    -- Status
    policy_status VARCHAR(20) DEFAULT 'pending' CHECK (policy_status IN ('pending', 'active', 'lapsed', 'cancelled', 'matured')),
    
    -- Commission
    commission_percentage DECIMAL(5,2),
    commission_amount DECIMAL(15,2),
    commission_status VARCHAR(20) CHECK (commission_status IN ('pending', 'paid', 'clawed_back')),
    
    -- Assignment
    issued_by_broker_id UUID REFERENCES users(user_id),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_policies_client ON policies(client_id);
CREATE INDEX idx_policies_number ON policies(policy_number);
CREATE INDEX idx_policies_status ON policies(policy_status);
CREATE INDEX idx_policies_broker ON policies(issued_by_broker_id);
CREATE INDEX idx_policies_expiry ON policies(expiry_date);
```

#### 8.1.6 Claims Table
```sql
CREATE TABLE claims (
    claim_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    policy_id UUID NOT NULL REFERENCES policies(policy_id),
    client_id UUID NOT NULL REFERENCES clients(client_id),
    
    -- Claim Details
    claim_type VARCHAR(50) NOT NULL,
    incident_date TIMESTAMP NOT NULL,
    incident_location TEXT,
    incident_description TEXT NOT NULL,
    estimated_loss_amount DECIMAL(15,2),
    
    -- Processing
    claim_status VARCHAR(20) DEFAULT 'intimated' CHECK (claim_status IN (
        'intimated', 'documents_pending', 'under_review', 'investigation', 
        'approved', 'rejected', 'paid', 'closed'
    )),
    assigned_to UUID REFERENCES users(user_id),
    
    -- Assessment
    assessed_amount DECIMAL(15,2),
    approved_amount DECIMAL(15,2),
    rejection_reason TEXT,
    
    -- Dates
    intimation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledgment_date TIMESTAMP,
    decision_date TIMESTAMP,
    payment_date TIMESTAMP,
    closure_date TIMESTAMP,
    
    -- NIC Compliance
    is_within_acknowledgment_deadline BOOLEAN,
    is_within_processing_deadline BOOLEAN,
    delay_reason VARCHAR(100),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_claims_client ON claims(client_id);
CREATE INDEX idx_claims_number ON claims(claim_number);
CREATE INDEX idx_claims_status ON claims(claim_status);
CREATE INDEX idx_claims_assigned ON claims(assigned_to);
```

#### 8.1.7 Leads Table
```sql
CREATE TABLE leads (
    lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    product_interest VARCHAR(100),
    
    -- Lead Source
    source VARCHAR(50) NOT NULL CHECK (source IN (
        'walk-in', 'phone', 'website', 'email', 'social-media', 
        'referral', 'campaign', 'event', 'aggregator'
    )),
    source_details TEXT,
    
    -- Lead Status
    lead_stage VARCHAR(20) DEFAULT 'new' CHECK (lead_stage IN (
        'new', 'contacted', 'qualified', 'quoted', 
        'negotiation', 'converted', 'lost', 'nurturing'
    )),
    lead_score INT DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    priority VARCHAR(10) DEFAULT 'warm' CHECK (priority IN ('hot', 'warm', 'cold')),
    
    -- Assignment
    assigned_to UUID REFERENCES users(user_id),
    
    -- Conversion
    converted_to_client_id UUID REFERENCES clients(client_id),
    conversion_date TIMESTAMP,
    lost_reason TEXT,
    
    -- Follow-up
    next_follow_up_date DATE,
    last_contact_date DATE,
    
    -- Notes
    notes TEXT,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_leads_phone ON leads(phone_number);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_stage ON leads(lead_stage);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
```

#### 8.1.8 Complaints Table
```sql
CREATE TABLE complaints (
    complaint_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number VARCHAR(50) UNIQUE NOT NULL,
    complainant_name VARCHAR(150) NOT NULL,
    complainant_phone VARCHAR(15) NOT NULL,
    complainant_email VARCHAR(100),
    
    -- Related Records
    client_id UUID REFERENCES clients(client_id),
    policy_id UUID REFERENCES policies(policy_id),
    claim_id UUID REFERENCES claims(claim_id),
    
    -- Complaint Details
    complaint_type VARCHAR(50) NOT NULL CHECK (complaint_type IN (
        'service', 'policy', 'claims', 'commission', 'other'
    )),
    complaint_source VARCHAR(20) NOT NULL CHECK (complaint_source IN (
        'phone', 'email', 'walk-in', 'nic', 'social-media', 'website'
    )),
    complaint_description TEXT NOT NULL,
    
    -- Processing
    complaint_status VARCHAR(20) DEFAULT 'registered' CHECK (complaint_status IN (
        'registered', 'investigating', 'resolved', 'closed', 'escalated'
    )),
    assigned_to UUID REFERENCES users(user_id),
    escalation_level INT DEFAULT 1 CHECK (escalation_level BETWEEN 1 AND 4),
    
    -- Resolution
    resolution TEXT,
    resolution_date TIMESTAMP,
    complainant_satisfied BOOLEAN,
    
    -- Dates
    registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledgment_date TIMESTAMP,
    target_resolution_date DATE,
    
    -- NIC Compliance
    is_within_acknowledgment_deadline BOOLEAN,
    is_within_resolution_deadline BOOLEAN,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_complaints_number ON complaints(complaint_number);
CREATE INDEX idx_complaints_client ON complaints(client_id);
CREATE INDEX idx_complaints_policy ON complaints(policy_id);
CREATE INDEX idx_complaints_claim ON complaints(claim_id);
CREATE INDEX idx_complaints_status ON complaints(complaint_status);
```

#### 8.1.9 Chat Tables
```sql
-- Chat Rooms (One-on-one or Group)
CREATE TABLE chat_rooms (
    room_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type VARCHAR(20) NOT NULL CHECK (room_type IN ('direct', 'group', 'broadcast')),
    room_name VARCHAR(100),
    room_icon_url VARCHAR(500),
    
    -- Context Linking
    linked_to_type VARCHAR(20) CHECK (linked_to_type IN ('client', 'policy', 'claim', 'lead')),
    linked_to_id UUID,
    
    -- Group Settings
    is_admin_only BOOLEAN DEFAULT FALSE,
    max_participants INT DEFAULT 256,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id)
);

-- Chat Participants
CREATE TABLE chat_participants (
    participant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(room_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id),
    is_admin BOOLEAN DEFAULT FALSE,
    
    -- Preferences
    is_muted BOOLEAN DEFAULT FALSE,
    mute_until TIMESTAMP,
    
    -- Read Status
    last_read_at TIMESTAMP,
    unread_count INT DEFAULT 0,
    
    -- Status
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    
    UNIQUE(room_id, user_id)
);

-- Chat Messages
CREATE TABLE chat_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(room_id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Message Content
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN (
        'text', 'file', 'image', 'voice', 'link', 'system'
    )),
    message_text TEXT,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    file_mime_type VARCHAR(100),
    
    -- References
    reply_to_message_id UUID REFERENCES chat_messages(message_id),
    mentioned_users UUID[],
    
    -- Status
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    deleted_by UUID REFERENCES users(user_id),
    is_starred BOOLEAN DEFAULT FALSE,
    
    -- Delivery
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    read_by UUID[],
    read_at TIMESTAMP[],
    
    -- Audit (soft delete - never truly deleted)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_room ON chat_messages(room_id, sent_at DESC);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_participants_room ON chat_participants(room_id);
CREATE INDEX idx_chat_participants_user ON chat_participants(user_id);
```

#### 8.1.10 Documents Table
```sql
CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Categorization
    category VARCHAR(50) CHECK (category IN (
        'client', 'policy', 'claim', 'compliance', 'company', 'other'
    )),
    
    -- Linking
    linked_to_type VARCHAR(20),
    linked_to_id UUID,
    
    -- Version Control
    version_number INT DEFAULT 1,
    parent_document_id UUID REFERENCES documents(document_id),
    
    -- Metadata
    tags TEXT[],
    ocr_text TEXT,
    
    -- Access Control
    is_confidential BOOLEAN DEFAULT FALSE,
    access_restricted_to UUID[],
    
    -- Retention
    retention_years INT DEFAULT 6,
    deletion_scheduled_date DATE,
    is_archived BOOLEAN DEFAULT FALSE,
    archived_date DATE,
    
    -- Audit
    uploaded_by UUID NOT NULL REFERENCES users(user_id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP,
    last_accessed_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_documents_linked ON documents(linked_to_type, linked_to_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_uploaded ON documents(uploaded_by);
```

#### 8.1.11 Audit Log Table
```sql
CREATE TABLE audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    record_type VARCHAR(50),
    record_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Changes
    before_value JSONB,
    after_value JSONB,
    
    -- Status
    status VARCHAR(20) CHECK (status IN ('success', 'failure')),
    error_message TEXT,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_module ON audit_logs(module);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_record ON audit_logs(record_type, record_id);
```

### 8.2 Reference Tables

#### Insurers, Products, etc.
```sql
CREATE TABLE insurers (
    insurer_id SERIAL PRIMARY KEY,
    insurer_name VARCHAR(200) NOT NULL UNIQUE,
    license_number VARCHAR(50),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(15),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50) UNIQUE,
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('life', 'non-life')),
    product_category VARCHAR(100),
    insurer_id INT REFERENCES insurers(insurer_id),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- More reference tables as needed
```

---

## 9. API SPECIFICATIONS

### 9.1 API Architecture

**API Style:** RESTful API
**Base URL:** `https://{tenant-slug}.ibms.com/api/v1/` (tenant-specific) or `https://api.ibms.com/v1/` (platform-level)
**Authentication:** JWT (JSON Web Tokens) with `tenant_id` claim
**Content Type:** `application/json`
**Character Encoding:** UTF-8

**Tenant Context Resolution:**
- Tenant-specific endpoints: `tenant_id` is resolved from the subdomain in the request URL
- All JWT tokens include `tenant_id` as a claim: `{ "sub": "user_id", "tenant_id": "uuid", "role": "broker" }`
- Platform Super Admin endpoints (`/admin/*`) are only accessible from `admin.ibms.com`
- All data-modifying endpoints automatically scope operations to the authenticated user's `tenant_id`
- The `tenant_id` is **never** accepted as a request parameter (except for Platform Super Admin endpoints)

### 9.2 Authentication API

#### 9.2.1 User Login
```
POST /auth/login

Request:
{
  "username": "john.doe@example.com",
  "password": "SecureP@ssw0rd"
}

Response (Success - 200 OK):
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "tenant_id": "uuid",
    "tenant_name": "Star Brokerage Ltd",
    "tenant_slug": "starbrokerage",
    "username": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "broker",
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 3600,
    "two_factor_required": false
  }
}

Response (2FA Required - 200 OK):
{
  "success": true,
  "data": {
    "two_factor_required": true,
    "session_id": "temp_session_id"
  }
}

Response (Error - 401 Unauthorized):
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password"
  }
}
```

#### 9.2.2 Two-Factor Verification
```
POST /auth/verify-2fa

Request:
{
  "session_id": "temp_session_id",
  "otp_code": "123456"
}

Response (Success - 200 OK):
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 3600
  }
}
```

### 9.3 Client Management API

#### 9.3.1 Create Client
```
POST /clients

Headers:
Authorization: Bearer {access_token}

Request:
{
  "client_type": "individual",
  "first_name": "Kwame",
  "middle_name": "Agyei",
  "last_name": "Mensah",
  "date_of_birth": "1985-05-15",
  "gender": "male",
  "ghana_card_number": "GHA-123456789-0",
  "primary_phone": "+233244123456",
  "email": "kwame.mensah@example.com",
  "digital_address": "GA-123-4567",
  "physical_address": "123 Independence Avenue, Accra",
  "city": "Accra",
  "region": "Greater Accra",
  "occupation": "Engineer",
  "employer_name": "ABC Company Ltd"
}

Response (Success - 201 Created):
{
  "success": true,
  "data": {
    "client_id": "uuid",
    "client_number": "CLI-20260001",
    "message": "Client created successfully"
  }
}
```

#### 9.3.2 Get Client Details
```
GET /clients/{client_id}

Headers:
Authorization: Bearer {access_token}

Response (Success - 200 OK):
{
  "success": true,
  "data": {
    "client_id": "uuid",
    "client_number": "CLI-20260001",
    "client_type": "individual",
    "first_name": "Kwame",
    "last_name": "Mensah",
    // ... other client fields
    "policies": [
      {
        "policy_id": "uuid",
        "policy_number": "POL-20260001",
        "policy_type": "life",
        "status": "active",
        "sum_insured": 100000.00
      }
    ],
    "claims": [],
    "kyc_status": "approved",
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

#### 9.3.3 Search Clients
```
GET /clients?search=kwame&page=1&limit=20

Headers:
Authorization: Bearer {access_token}

Response (Success - 200 OK):
{
  "success": true,
  "data": {
    "clients": [
      {
        "client_id": "uuid",
        "client_number": "CLI-20260001",
        "full_name": "Kwame Agyei Mensah",
        "phone": "+233244123456",
        "email": "kwame.mensah@example.com",
        "kyc_status": "approved",
        "policy_count": 2
      }
      // ... more clients
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "total_pages": 5
    }
  }
}
```

### 9.4 Policy Management API

#### 9.4.1 Create Policy
```
POST /policies

Headers:
Authorization: Bearer {access_token}

Request:
{
  "client_id": "uuid",
  "insurer_id": 1,
  "product_id": 5,
  "policy_type": "life",
  "coverage_type": "Whole Life",
  "sum_insured": 100000.00,
  "premium_amount": 1200.00,
  "premium_frequency": "annual",
  "effective_date": "2026-02-01",
  "expiry_date": "2076-02-01"
}

Response (Success - 201 Created):
{
  "success": true,
  "data": {
    "policy_id": "uuid",
    "policy_number": "POL-20260001",
    "message": "Policy created successfully"
  }
}
```

#### 9.4.2 Get Policies Due for Renewal
```
GET /policies/renewals?days=30

Headers:
Authorization: Bearer {access_token}

Response (Success - 200 OK):
{
  "success": true,
  "data": {
    "policies": [
      {
        "policy_id": "uuid",
        "policy_number": "POL-20250001",
        "client_name": "Kwame Mensah",
        "expiry_date": "2026-03-15",
        "days_to_expiry": 30,
        "premium_amount": 1200.00,
        "renewal_status": "not_contacted"
      }
      // ... more policies
    ],
    "summary": {
      "total_policies": 50,
      "total_premium_value": 60000.00
    }
  }
}
```

### 9.5 Claims Management API

#### 9.5.1 Create Claim
```
POST /claims

Headers:
Authorization: Bearer {access_token}

Request:
{
  "policy_id": "uuid",
  "claim_type": "death",
  "incident_date": "2026-01-20",
  "incident_location": "Korle-Bu Teaching Hospital, Accra",
  "incident_description": "Policyholder passed away due to natural causes",
  "estimated_loss_amount": 100000.00
}

Response (Success - 201 Created):
{
  "success": true,
  "data": {
    "claim_id": "uuid",
    "claim_number": "CLM-20260001",
    "acknowledgment_deadline": "2026-01-27",
    "message": "Claim registered successfully. Acknowledgment sent to claimant."
  }
}
```

#### 9.5.2 Upload Claim Documents
```
POST /claims/{claim_id}/documents

Headers:
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Request:
Form Data:
- document_type: "death_certificate"
- file: [binary file data]

Response (Success - 201 Created):
{
  "success": true,
  "data": {
    "document_id": "uuid",
    "document_name": "death_certificate.pdf",
    "upload_status": "success"
  }
}
```

### 9.6 Chat API

#### 9.6.1 Create Chat Room
```
POST /chat/rooms

Headers:
Authorization: Bearer {access_token}

Request:
{
  "room_type": "group",
  "room_name": "Claims Team - CLM-20260001",
  "participants": ["user_uuid_1", "user_uuid_2", "user_uuid_3"],
  "linked_to_type": "claim",
  "linked_to_id": "claim_uuid"
}

Response (Success - 201 Created):
{
  "success": true,
  "data": {
    "room_id": "uuid",
    "room_name": "Claims Team - CLM-20260001",
    "created_at": "2026-02-13T10:00:00Z"
  }
}
```

#### 9.6.2 Send Message
```
POST /chat/messages

Headers:
Authorization: Bearer {access_token}

Request:
{
  "room_id": "room_uuid",
  "message_type": "text",
  "message_text": "Please review the medical report for this claim.",
  "reply_to_message_id": null,
  "mentioned_users": ["user_uuid_1"]
}

Response (Success - 201 Created):
{
  "success": true,
  "data": {
    "message_id": "uuid",
    "sent_at": "2026-02-13T10:05:00Z"
  }
}
```

#### 9.6.3 Get Messages (WebSocket)
```
WebSocket Connection: wss://api.ibms.com/v1/chat/ws?token={access_token}

Message Format (Receive):
{
  "event": "new_message",
  "data": {
    "message_id": "uuid",
    "room_id": "room_uuid",
    "sender_id": "user_uuid",
    "sender_name": "John Doe",
    "message_type": "text",
    "message_text": "Review complete. Approved.",
    "sent_at": "2026-02-13T10:10:00Z"
  }
}

Message Format (Send Read Receipt):
{
  "event": "message_read",
  "data": {
    "message_id": "uuid",
    "room_id": "room_uuid"
  }
}
```

### 9.7 Reporting API

#### 9.7.1 Generate Report
```
POST /reports/generate

Headers:
Authorization: Bearer {access_token}

Request:
{
  "report_type": "premium_collection",
  "date_from": "2026-01-01",
  "date_to": "2026-01-31",
  "format": "pdf",
  "filters": {
    "broker_id": "user_uuid",
    "policy_type": "life"
  }
}

Response (Success - 200 OK):
{
  "success": true,
  "data": {
    "report_id": "uuid",
    "download_url": "https://api.ibms.com/v1/reports/download/{report_id}",
    "expires_at": "2026-02-14T10:00:00Z"
  }
}
```

### 9.8 Error Handling

**Standard Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "field": "field_name",
    "details": {}
  }
}
```

**HTTP Status Codes:**
- 200: OK - Success
- 201: Created - Resource created
- 400: Bad Request - Validation error
- 401: Unauthorized - Authentication failed
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 409: Conflict - Duplicate resource
- 422: Unprocessable Entity - Semantic error
- 500: Internal Server Error - Server error
- 503: Service Unavailable - Maintenance

**Common Error Codes:**
- `INVALID_CREDENTIALS` - Invalid username or password
- `TOKEN_EXPIRED` - JWT token has expired
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `VALIDATION_ERROR` - Input validation failed
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DUPLICATE_ENTRY` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests

### 9.9 API Rate Limiting

- **Authenticated Requests:** 1000 requests per hour per user
- **Unauthenticated Requests:** 100 requests per hour per IP
- **Bulk Operations:** 10 requests per minute
- **File Uploads:** 20 uploads per hour

Rate limit headers included in every response:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1736779200
X-Tenant-ID: uuid
```

> **Multi-Tenancy Rate Limiting:** Rate limits are applied per-tenant. Each tenant has its own quota based on subscription plan (Basic: 1,000/hour, Professional: 5,000/hour, Enterprise: custom). Platform Super Admin endpoints have separate, higher limits.

### 9.10 Tenant Management API

> These endpoints are used for tenant lifecycle management. Tenant registration is publicly accessible; all other endpoints require authentication. Platform-level endpoints require Platform Super Admin role.

#### 9.10.1 Tenant Registration
```
POST /tenants/register

Request:
{
  "tenant_name": "Star Brokerage Ltd",
  "tenant_slug": "starbrokerage",
  "company_registration_no": "CS-123456",
  "nic_license_number": "NIC-BR-2024-001",
  "tin": "C0012345678",
  "primary_contact": {
    "name": "Kwame Asante",
    "email": "kwame@starbrokerage.com",
    "phone": "+233201234567",
    "ghana_card": "GHA-123456789-0"
  },
  "physical_address": "15 Independence Ave, Accra",
  "digital_address": "GA-123-4567",
  "subscription_plan": "professional"
}

Response (Success - 201 Created):
{
  "success": true,
  "data": {
    "tenant_id": "uuid",
    "tenant_slug": "starbrokerage",
    "subdomain": "starbrokerage.ibms.com",
    "status": "pending",
    "message": "Registration submitted. Awaiting verification."
  }
}
```

#### 9.10.2 Get Tenant Configuration
```
GET /tenant/config
Authorization: Bearer {jwt_token}

Response (200 OK):
{
  "success": true,
  "data": {
    "tenant_id": "uuid",
    "tenant_name": "Star Brokerage Ltd",
    "logo_url": "/uploads/logo.png",
    "brand_colors": {
      "primary": "#1a73e8",
      "accent": "#fbbc04"
    },
    "subscription": {
      "plan": "professional",
      "status": "active",
      "max_users": 50,
      "max_clients": 10000,
      "storage_gb": 50
    },
    "usage": {
      "active_users": 12,
      "clients": 3456,
      "storage_used_gb": 8.5
    },
    "settings": { ... }
  }
}
```

#### 9.10.3 Update Tenant Configuration
```
PUT /tenant/config
Authorization: Bearer {jwt_token}  (Tenant Admin only)

Request:
{
  "tenant_name": "Star Brokerage Ltd",
  "brand_primary_color": "#2196F3",
  "brand_accent_color": "#FF9800",
  "settings": {
    "policy_number_prefix": "SB-POL-",
    "fiscal_year_start": "01-01",
    "notification_preferences": {
      "email": true,
      "sms": true,
      "in_app": true
    }
  }
}

Response (200 OK):
{
  "success": true,
  "message": "Tenant configuration updated"
}
```

#### 9.10.4 Platform Super Admin - List All Tenants
```
GET /admin/tenants?status=active&page=1&per_page=20
Authorization: Bearer {jwt_token}  (Platform Super Admin only)
Host: admin.ibms.com

Response (200 OK):
{
  "success": true,
  "data": {
    "tenants": [
      {
        "tenant_id": "uuid",
        "tenant_name": "Star Brokerage Ltd",
        "tenant_slug": "starbrokerage",
        "status": "active",
        "plan": "professional",
        "users_count": 12,
        "clients_count": 3456,
        "created_at": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "per_page": 20,
      "total_pages": 3
    }
  }
}
```

#### 9.10.5 Platform Super Admin - Suspend/Activate Tenant
```
PATCH /admin/tenants/{tenant_id}/status
Authorization: Bearer {jwt_token}  (Platform Super Admin only)

Request:
{
  "status": "suspended",
  "reason": "Non-payment of subscription"
}

Response (200 OK):
{
  "success": true,
  "message": "Tenant suspended successfully"
}
```

#### 9.10.6 Tenant Subscription Management
```
GET /tenant/subscription
PUT /tenant/subscription/upgrade
POST /tenant/subscription/cancel
GET /tenant/invoices
GET /tenant/invoices/{invoice_id}
GET /tenant/usage
```

---

## 10. USER INTERFACE REQUIREMENTS

### 10.1 UI/UX Principles

- **Simplicity:** Clean, uncluttered interface
- **Consistency:** Uniform design across all modules
- **Efficiency:** Minimize clicks to complete tasks
- **Responsiveness:** Works seamlessly on all devices
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Feedback:** Clear confirmation of user actions
- **Error Prevention:** Validation before submission

### 10.2 Layout Structure

#### 10.2.1 Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]  Insurance Broker Management System    [User] [▼]  │
├─────────────────────────────────────────────────────────────┤
│ ☰ Menu                                                      │
├────────┬────────────────────────────────────────────────────┤
│        │  Dashboard / Clients / Policies / etc.             │
│        ├────────────────────────────────────────────────────┤
│        │                                                    │
│ [NAV]  │            MAIN CONTENT AREA                       │
│        │                                                    │
│ • Home │  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│ • Cl   │  │  KPI Card │  │  KPI Card │  │  KPI Card │    │
│ • Pol  │  └───────────┘  └───────────┘  └───────────┘    │
│ • Clm  │                                                    │
│ • Rep  │  ┌─────────────────────────────────────┐         │
│ • Set  │  │        Chart / Graph Area          │         │
│        │  └─────────────────────────────────────┘         │
│        │                                                    │
│        │  Recent Activity / Notifications                   │
└────────┴────────────────────────────────────────────────────┘
```

#### 10.2.2 Color Scheme
**Primary Colors:**
- Primary: #1976D2 (Blue) - Main actions, links
- Secondary: #388E3C (Green) - Success, confirmations
- Accent: #F57C00 (Orange) - Warnings, important notices
- Error: #D32F2F (Red) - Errors, deletions
- Info: #0288D1 (Light Blue) - Information messages

**Neutral Colors:**
- Background: #F5F5F5 (Light Gray)
- Surface: #FFFFFF (White)
- Text Primary: #212121 (Dark Gray)
- Text Secondary: #757575 (Medium Gray)
- Borders: #E0E0E0 (Light Gray)

#### 10.2.3 Typography
- **Headings:** Roboto Bold
  - H1: 32px
  - H2: 24px
  - H3: 20px
  - H4: 18px
  
- **Body Text:** Roboto Regular
  - Body: 16px
  - Small: 14px
  - Caption: 12px

### 10.3 Key UI Components

#### 10.3.1 Navigation
- **Sidebar Navigation** (Desktop)
  - Collapsible
  - Icons + text labels
  - Active item highlighted
  - Nested submenus for modules
  
- **Top Navigation** (Mobile)
  - Hamburger menu
  - User profile dropdown
  - Notifications icon with badge

#### 10.3.2 Forms
- Clear field labels (above or left of fields)
- Placeholder text for guidance
- Inline validation (real-time)
- Required field indicators (*)
- Help text below fields
- Clear error messages
- Progress indicator for multi-step forms
- Auto-save for long forms

#### 10.3.3 Tables & Lists
- Sortable columns
- Filterable data
- Search functionality
- Pagination (showing "1-20 of 500")
- Row actions (view, edit, delete)
- Bulk actions (checkboxes)
- Export options (PDF, Excel, CSV)
- Empty state messages
- Loading skeleton screens

#### 10.3.4 Modals & Dialogs
- Centered on screen
- Overlay background (semi-transparent)
- Close button (X) in top-right
- Clear title
- Action buttons at bottom (Cancel, Confirm)
- Confirmation for destructive actions
- Keyboard shortcuts (ESC to close)

#### 10.3.5 Notifications
- **Toast Notifications** (top-right corner)
  - Success (green)
  - Error (red)
  - Warning (orange)
  - Info (blue)
  - Auto-dismiss after 5 seconds
  - Dismiss button
  
- **Alert Banners** (top of page)
  - For important system messages
  - Dismissable
  - Persistent until dismissed

### 10.4 Responsive Design Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px
- **Large Desktop:** > 1440px

**Mobile Optimizations:**
- Collapsible sections
- Touch-friendly buttons (44x44px minimum)
- Simplified navigation
- Reduced data density
- Swipe gestures
- Bottom navigation bar

### 10.5 Key Screens

#### 10.5.1 Login Screen
- Company logo
- Username/email field
- Password field (with show/hide toggle)
- "Remember me" checkbox
- "Login" button
- "Forgot password?" link
- 2FA code input (if enabled)

#### 10.5.2 Dashboard
- Welcome message with user name
- KPI cards:
  - Total Clients
  - Active Policies
  - Premium Collected (MTD)
  - Claims Pending
  - Leads in Pipeline
- Quick actions buttons:
  - Add Client
  - Create Policy
  - Register Claim
- Charts:
  - Premium trend (line chart)
  - Policy mix (pie chart)
  - Top insurers (bar chart)
- Recent activity feed
- Upcoming tasks/reminders
- Renewal alerts

#### 10.5.3 Client List Screen
- Search bar (prominent at top)
- Filters panel (left sidebar or collapsible)
  - Status
  - Broker
  - Risk level
  - Date range
- Client table:
  - Client number
  - Name
  - Phone
  - Email
  - Policies count
  - KYC status
  - Actions (View, Edit, Chat)
- "Add New Client" button (top-right)
- Export button
- Pagination

#### 10.5.4 Client Profile Screen
- Client summary card (top)
  - Photo
  - Name
  - Client number
  - Contact information
  - KYC status badge
  - Assigned broker
- Tab navigation:
  - Personal Info
  - Policies
  - Claims
  - Documents
  - Communication Log
  - Beneficiaries
- Action buttons:
  - Edit Client
  - Add Policy
  - Send Message
  - Upload Document

#### 10.5.5 Policy Creation Form
- Multi-step form:
  - Step 1: Client Selection
  - Step 2: Product Selection
  - Step 3: Coverage Details
  - Step 4: Premium Calculation
  - Step 5: Review & Submit
- Progress indicator
- "Save as Draft" option
- Validation at each step
- Clear navigation (Previous, Next buttons)

#### 10.5.6 Claims Management Screen
- Claims dashboard (KPIs)
- Claims list with status colors:
  - Red: Overdue
  - Orange: Due soon
  - Green: On track
- Filter by status, type, assigned officer
- Claim details view:
  - Claim timeline (visual)
  - Documents checklist
  - Comments/notes section
  - Status update form
  - Action buttons (Approve, Reject, Request Docs)

#### 10.5.7 Chat Interface
- Chat list (left sidebar)
  - Search chats
  - Filter (All, Unread, Clients, Claims)
  - Chat items with:
    - Avatar
    - Name/Title
    - Last message preview
    - Timestamp
    - Unread badge
- Chat window (right side)
  - Chat header:
    - Name/Title
    - Online status
    - Context link (Client/Policy/Claim)
    - Actions (Call, Email, View Details)
  - Message area
    - Message bubbles (sender on right, others on left)
    - Timestamps
    - Read receipts
  - Message input:
    - Text input field
    - Emoji picker
    - File attachment
    - Send button

### 10.6 Accessibility Requirements

- **Keyboard Navigation:**
  - All interactive elements accessible via Tab key
  - Logical tab order
  - Focus indicators visible
  
- **Screen Reader Support:**
  - Proper ARIA labels
  - Semantic HTML elements
  - Alternative text for images
  - Form field labels
  
- **Color Contrast:**
  - Text contrast ratio: 4.5:1 minimum
  - UI contrast ratio: 3:1 minimum
  
- **Font Sizing:**
  - Scalable font sizes (rem/em units)
  - Support for browser zoom up to 200%
  
- **Animations:**
  - Respect prefers-reduced-motion setting
  - No flashing content

---

## 11. SECURITY REQUIREMENTS

### 11.1 Application Security

#### 11.1.1 Authentication Security
- **Password Requirements:**
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
  - Cannot be common passwords (check against list)
  - Cannot contain username
  - Password history: Cannot reuse last 5 passwords
  - Password expiry: 90 days

- **Account Lockout:**
  - Lock account after 5 failed login attempts
  - Lockout duration: 30 minutes
  - Email notification on lockout
  - Admin can unlock accounts

- **Session Management:**
  - Secure session cookies (HttpOnly, Secure, SameSite)
  - Session timeout: 15 minutes of inactivity
  - Absolute session timeout: 8 hours
  - Single session per user (optional setting)
  - Logout on browser close
  - Session invalidation on password change

- **Two-Factor Authentication:**
  - SMS OTP (6 digits, 5 minutes validity)
  - Email OTP (backup method)
  - TOTP app support (Google Authenticator, Microsoft Authenticator)
  - Backup codes for account recovery
  - Remember device for 30 days (optional)

#### 11.1.2 Authorization Security
- **Role-Based Access Control (RBAC):**
  - Granular permissions
  - Principle of least privilege
  - Deny by default
  - No privilege escalation vulnerabilities
  
- **Data Access Control:**
  - Brokers can only access assigned clients
  - Claims officers can only access assigned claims
  - Compliance officers can access all data (read-only)
  - Managers can access team data
  - Admins can access all data

#### 11.1.3 Data Security
- **Encryption at Rest:**
  - Database encryption: AES-256
  - File storage encryption: AES-256
  - Encryption key management: AWS KMS or HashiCorp Vault
  - Separate encryption keys per client (for sensitive data)

- **Encryption in Transit:**
  - TLS 1.3 (minimum TLS 1.2)
  - Strong cipher suites only
  - Certificate pinning (mobile apps)
  - HTTPS redirect (all HTTP to HTTPS)

- **Sensitive Data Handling:**
  - Ghana Card numbers: Encrypted + masked display (***-*****-**9-0)
  - Bank account numbers: Encrypted + masked
  - Passwords: Hashed with bcrypt (cost factor 12+)
  - No logging of sensitive data (PII, passwords, tokens)
  - Secure data wiping on deletion

#### 11.1.4 Input Validation
- **Server-Side Validation:**
  - Whitelist validation (allow known good)
  - Data type validation
  - Length validation
  - Range validation
  - Format validation (email, phone, Ghana Card)
  - Business logic validation

- **Client-Side Validation:**
  - Immediate user feedback
  - NOT relied upon for security
  - Supplements server-side validation

- **File Upload Security:**
  - Allowed file types: PDF, DOCX, XLSX, JPG, PNG
  - Maximum file size: 25 MB
  - Virus scanning (ClamAV or similar)
  - File content verification (not just extension)
  - Randomized file names
  - Files stored outside web root
  - No script execution in upload directory

#### 11.1.5 API Security
- **Authentication:**
  - JWT tokens
  - Token expiry: 1 hour
  - Refresh token: 7 days
  - Secure token storage (HttpOnly cookies or secure storage)

- **Authorization:**
  - Validate user permissions on every request
  - Scope-based access (read, write, delete)

- **Rate Limiting:**
  - Per user: 1000 requests/hour
  - Per IP (unauthenticated): 100 requests/hour
  - Progressive delays on suspicious activity

- **API Input Validation:**
  - Schema validation (JSON Schema)
  - SQL injection prevention (parameterized queries)
  - XSS prevention (output encoding)
  - CSRF protection (tokens)

#### 11.1.6 Third-Party Security
- **Dependency Management:**
  - Regular security updates
  - Vulnerability scanning (Snyk, npm audit)
  - Use trusted, maintained libraries only
  - Pin dependency versions

- **API Integration Security:**
  - API key security (environment variables, not hardcoded)
  - IP whitelisting where possible
  - Request signing
  - Webhook verification

#### 11.1.7 Tenant Isolation Security
- **Logical Isolation:**
  - Mandatory `tenant_id` in all database queries (RLS)
  - Application-level separate of tenant contexts
  - No cross-tenant data access allowed
- **Storage Isolation:**
  - Tenant-specific paths in object storage (`/tenant-id/files/`)
  - Strict access policies for file retrieval
- **Network Isolation (Optional - Enterprise):**
  - Dedicated VPC or subnet for high-value tenants (future)
- **Data Leak Prevention:**
  - Prevent tenant data from leaking into logs (masking PII)
  - Strict input validation to prevent SQL injection bypassing RLS

### 11.2 Infrastructure Security

#### 11.2.1 Network Security
- **Firewall:**
  - Application firewall (AWS WAF, Cloudflare)
  - Network firewall (Security Groups, VPC)
  - Database firewall (restrict to application servers only)
  - Deny all, allow specific

- **DDoS Protection:**
  - CDN with DDoS mitigation (Cloudflare)
  - Rate limiting
  - Auto-scaling to handle traffic spikes

- **Intrusion Detection:**
  - IDS/IPS deployment
  - Log monitoring (AWS GuardDuty, Suricata)
  - Alert on suspicious activity
  - Automated response rules

#### 11.2.2 Server Security
- **OS Hardening:**
  - Minimal installation (only necessary services)
  - Security patches (automated)
  - Disable unused services
  - File system permissions
  - Root access restricted

- **Application Server:**
  - Run as non-root user
  - Chroot environment (if applicable)
  - Resource limits (prevent resource exhaustion)
  - Error handling (no stack traces in production)

- **Database Server:**
  - Strong admin password
  - Separate user accounts per application
  - Least privilege access
  - Network isolation (private subnet)
  - Regular backups
  - Point-in-time recovery enabled

#### 11.2.3 Access Control
- **Administrative Access:**
  - VPN required for admin access
  - SSH key authentication (no passwords)
  - Bastion host for SSH
  - MFA for critical systems
  - Sudo logging

- **Audit Logging:**
  - Log all administrative actions
  - Centralized logging (ELK stack, CloudWatch)
  - Log retention: 1 year
  - Log tampering prevention (write-once storage)

### 11.3 Backup & Disaster Recovery

#### 11.3.1 Backup Strategy
- **Backup Types:**
  - Full backup: Weekly
  - Incremental backup: Daily
  - Transaction log backup: Hourly (for PITR)

- **Backup Storage:**
  - Primary backup: Same region
  - Secondary backup: Different region
  - Tertiary backup: Off-site (tape or cold storage)
  - Encryption: All backups encrypted

- **Backup Verification:**
  - Monthly restore tests
  - Integrity checks (checksums)
  - Backup monitoring and alerts

#### 11.3.2 Disaster Recovery
- **Recovery Objectives:**
  - Recovery Time Objective (RTO): 4 hours
  - Recovery Point Objective (RPO): 24 hours
  - Maximum data loss: 24 hours

- **DR Plan:**
  - Documented recovery procedures
  - Contact list (on-call team)
  - Regular DR drills (quarterly)
  - Failover procedures
  - Communication plan

- **High Availability:**
  - Database replication (master-slave or multi-master)
  - Application server clustering
  - Load balancing
  - Automatic failover
  - Health checks

### 11.4 Compliance & Auditing

#### 11.4.1 Audit Trail
- **What to Log:**
  - User authentication (login, logout, failed attempts)
  - User authorization (access attempts)
  - Data access (read, especially sensitive data)
  - Data modifications (create, update, delete)
  - Configuration changes
  - Security events (password changes, role changes)
  - API calls
  - File uploads/downloads

- **Log Format:**
  - Timestamp (ISO 8601, UTC)
  - User ID and name
  - Action performed
  - Resource accessed (type and ID)
  - IP address
  - User agent (for web)
  - Result (success/failure)
  - Before/after values (for updates)

- **Log Security:**
  - Write-only access for application
  - Encrypted storage
  - Tamper-evident (digital signatures or blockchain)
  - Regular review
  - Retention: 6 years (NIC requirement)

#### 11.4.2 Security Monitoring
- **Real-Time Monitoring:**
  - Failed login attempts (alert after 3 failures)
  - Privilege escalation attempts
  - Unusual data access patterns
  - SQL injection attempts
  - XSS attempts
  - API abuse (rate limit violations)
  - File upload anomalies

- **Security Dashboard:**
  - Security events (last 24 hours)
  - Failed login attempts
  - Locked accounts
  - Active sessions
  - API usage statistics
  - Vulnerability scan results

#### 11.4.3 Vulnerability Management
- **Vulnerability Scanning:**
  - Automated scans: Weekly
  - Manual penetration testing: Annually
  - Tools: OWASP ZAP, Nessus, Burp Suite

- **Patch Management:**
  - Security patches: Within 7 days of release
  - Critical patches: Within 24 hours
  - Regular patches: Monthly maintenance window
  - Patch testing before production deployment

- **Vulnerability Remediation:**
  - Critical: 24 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

### 11.5 Security Training
- **User Training:**
  - Security awareness training (annually)
  - Phishing awareness
  - Password best practices
  - Social engineering awareness
  - Data classification and handling

- **Developer Training:**
  - Secure coding practices
  - OWASP Top 10
  - Security testing
  - Code review checklist

---

## 12. INTEGRATION REQUIREMENTS

### 12.1 Payment Gateway Integration

#### 12.1.1 Mobile Money Integration
- **MTN Mobile Money**
  - API: MTN MoMo API
  - Collection API for premium payments
  - Disbursement API for claims/commission payments
  - Transaction status verification
  - Webhook for real-time notifications

- **Vodafone Cash**
  - API: Vodafone Cash API
  - Similar features to MTN MoMo

- **AirtelTigo Money**
  - API: AirtelTigo Money API
  - Similar features to MTN MoMo

**Features:**
- Initiate payment from system
- Customer completes payment on phone
- Automatic reconciliation
- Payment confirmation to client (SMS/Email)
- Retry mechanism for failed payments
- Refund processing

#### 12.1.2 Card Payment Integration
- **Payment Processors:**
  - Paystack (Recommended for Ghana)
  - Flutterwave
  - Stripe (for international cards)

**Features:**
- Credit/Debit card payments
- 3D Secure authentication
- PCI DSS compliance (tokenization)
- Recurring payments for premiums
- Payment links for remote clients
- Installment plans

#### 12.1.3 Bank Transfer Integration
- **Bank API Integration** (if available)
  - Direct debit setup
  - Standing order management
  - Real-time transfer status

**Manual Reconciliation:**
- Bank statement upload
- Automatic matching with pending premiums
- Manual matching interface for exceptions

### 12.2 SMS Gateway Integration

**Recommended Providers:**
- Hubtel (Ghana)
- Twilio (International)
- AfricasTalking

**Use Cases:**
- OTP for 2FA
- Premium payment reminders
- Policy renewal notifications
- Claim status updates
- Appointment reminders
- Promotional messages

**Features:**
- Send SMS via API
- Bulk SMS sending
- SMS templates
- Delivery reports
- Two-way SMS (receive replies)
- Cost per SMS tracking

### 12.3 Email Service Integration

**Providers:**
- SendGrid
- Amazon SES
- Mailgun

**Use Cases:**
- User registration confirmation
- Password reset
- Policy documents
- Claim documents
- Monthly statements
- Newsletters
- Compliance reports

**Features:**
- Transactional emails
- Email templates
- Attachment support (up to 25 MB)
- Email tracking (open, click rates)
- Bounce handling
- Unsubscribe management
- DKIM, SPF, DMARC configuration

### 12.4 Document Signing Integration

**Provider:**
- DocuSign
- Adobe Sign
- PandaDoc

**Use Cases:**
- Policy proposal signing
- Claim settlement discharge vouchers
- Employment contracts
- Confidentiality agreements

**Features:**
- E-signature capture
- Multi-party signing workflow
- Audit trail
- Legal compliance (e-SIGN Act)
- Mobile signing support

### 12.5 National Identification Integration

**Ghana Card Verification:**
- Integration with National Identification Authority (NIA) API (if available)
- Verify Ghana Card number authenticity
- Fetch cardholder details
- Photo verification
- Fallback: Manual verification process

### 12.6 Geolocation Services

**Google Maps API:**
- Digital address lookup
- GPS coordinates conversion
- Address autocomplete
- Distance calculation (for field visits)
- Maps display

**Alternative:**
- OpenStreetMap (free, open-source)

### 12.7 Insurance Company Integration

**Insurer Portal APIs:**
- Quotation request API
- Policy issuance API
- Premium reconciliation API
- Claims submission API
- Commission statement API

**Data Exchange Formats:**
- JSON (preferred)
- XML (legacy systems)
- CSV files (manual upload/download)

**Secure Communication:**
- API keys
- OAuth 2.0
- IP whitelisting
- Encryption (TLS)

### 12.8 Accounting Software Integration

**QuickBooks/Xero Integration:**
- Invoice synchronization
- Payment recording
- Commission expense tracking
- Financial report export

**Features:**
- Two-way sync
- Automatic reconciliation
- Chart of accounts mapping
- Tax calculation

### 12.9 Regulatory Reporting Integration

**NIC Reporting Portal:**
- Automated report submission (if API available)
- Report format compliance (XML, CSV)
- Submission confirmation
- Error handling and resubmission

### 12.10 Cloud Storage Integration

**Google Drive / Dropbox:**
- Document backup
- Shared document access
- Client document sharing
- Team collaboration

**Features:**
- Automatic sync
- Folder organization
- Access permissions
- Audit trail

---

## 13. TESTING REQUIREMENTS

### 13.1 Testing Strategy

#### 13.1.1 Testing Types
1. **Unit Testing** - Individual functions/methods
2. **Integration Testing** - Module interactions
3. **System Testing** - End-to-end workflows
4. **User Acceptance Testing (UAT)** - Real user scenarios
5. **Performance Testing** - Load and stress testing
6. **Security Testing** - Vulnerability assessment
7. **Compatibility Testing** - Browsers, devices, OS
8. **Regression Testing** - After bug fixes or new features

#### 13.1.2 Testing Tools

**Automated Testing:**
- **Unit Tests:**
  - .NET: xUnit, NUnit
  - Node.js: Jest, Mocha
  - Python: pytest, unittest
  
- **Integration Tests:**
  - Postman (API testing)
  - Newman (CLI for Postman)
  - REST Assured
  
- **End-to-End Tests:**
  - Selenium
  - Cypress
  - Playwright
  
- **Performance Testing:**
  - Apache JMeter
  - k6
  - Gatling

**Manual Testing:**
- Test case management: TestRail, Zephyr
- Bug tracking: Jira, GitHub Issues
- Exploratory testing: Session-based

### 13.2 Test Coverage

**Minimum Coverage:**
- Unit tests: 80% code coverage
- Integration tests: All API endpoints
- E2E tests: All critical user flows
- Manual tests: All UI screens

**Critical Flows to Test:**
1. User registration and login
2. Client registration with KYC
3. Policy creation and issuance
4. Claim submission and processing
5. Premium payment collection
6. Policy renewal workflow
7. Commission calculation
8. Chat messaging
9. Document upload and retrieval
10. Report generation

### 13.3 Test Environments

1. **Development** - Developers' local machines
2. **Testing/QA** - Dedicated test environment
3. **Staging** - Production-like environment
4. **Production** - Live environment

**Environment Parity:**
- Same infrastructure as production
- Same configuration (except secrets)
- Similar data volume (anonymized production data)

### 13.4 Performance Testing

**Load Testing:**
- Simulate 500 concurrent users
- Test for 2 hours sustained load
- Measure response times
- Identify bottlenecks

**Stress Testing:**
- Increase load until system breaks
- Identify maximum capacity
- Test recovery after crash

**Soak Testing:**
- Run at moderate load for 24+ hours
- Detect memory leaks
- Test long-term stability

**Performance Benchmarks:**
- Page load: < 3 seconds
- API response: < 500 ms
- Report generation: < 10 seconds
- Search: < 2 seconds
- Database query: < 1 second

### 13.5 Security Testing

**OWASP Top 10 Testing:**
- SQL Injection
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Broken Authentication
- Sensitive Data Exposure
- XML External Entities
- Broken Access Control
- Security Misconfiguration
- Insecure Deserialization
- Insufficient Logging

**Penetration Testing:**
- Annual third-party pen test
- Quarterly internal pen test
- Vulnerability scanning: Weekly

**Tools:**
- OWASP ZAP
- Burp Suite
- Nmap
- Nikto

### 13.6 User Acceptance Testing

**UAT Process:**
1. Prepare test cases based on requirements
2. Setup UAT environment with test data
3. Train UAT users
4. Execute test cases
5. Log defects
6. Retest after fixes
7. Sign-off

**UAT Participants:**
- Business stakeholders
- End users (brokers, managers, compliance)
- Subject matter experts

**UAT Criteria:**
- All critical features working
- No high-priority bugs
- Performance acceptable
- Security requirements met
- Compliance requirements met

### 13.7 Bug Management

**Bug Priority:**
- **P0 - Critical:** System down, data loss, security breach
- **P1 - High:** Major feature broken, workaround difficult
- **P2 - Medium:** Feature partially broken, workaround available
- **P3 - Low:** Minor issue, cosmetic, low impact

**Bug Workflow:**
1. Report (with screenshots, steps to reproduce)
2. Triage (assign priority and developer)
3. Fix
4. Code review
5. Test (by QA)
6. Retest (by reporter)
7. Close

**Bug Tracking:**
- Use Jira or GitHub Issues
- All bugs logged and tracked
- Regular bug review meetings
- Bug metrics (open, fixed, regression)

---

## 14. DEPLOYMENT STRATEGY

### 14.1 Deployment Environments

**Environments:**
1. **Development (Dev)**
   - Purpose: Active development
   - Deployment: Continuous (on every commit)
   - Data: Test data

2. **Testing/QA**
   - Purpose: Quality assurance testing
   - Deployment: Daily or on-demand
   - Data: Anonymized production-like data

3. **Staging**
   - Purpose: Pre-production validation
   - Deployment: Before production release
   - Data: Production copy (anonymized)

4. **Production**
   - Purpose: Live system for users
   - Deployment: Scheduled releases
   - Data: Real data

### 14.2 Deployment Process

#### 14.2.1 CI/CD Pipeline

**Continuous Integration:**
1. Developer commits code to Git
2. Automated build triggers
3. Run unit tests
4. Run code quality checks (linting)
5. Run security scans
6. Build artifacts (Docker image, binaries)
7. Store artifacts in registry

**Continuous Deployment:**
1. Deploy to Dev automatically
2. Deploy to QA on approval
3. Deploy to Staging on approval
4. Deploy to Production on scheduled release

**Tools:**
- CI/CD Platform: GitHub Actions, GitLab CI, Jenkins
- Container Registry: Docker Hub, AWS ECR
- Infrastructure as Code: Terraform, CloudFormation

#### 14.2.2 Deployment Strategy

**Blue-Green Deployment:**
- Two identical environments (Blue and Green)
- Blue is current production
- Deploy new version to Green
- Switch traffic from Blue to Green
- Keep Blue for quick rollback

**Rolling Deployment:**
- Gradually replace instances
- Zero downtime
- Automatic rollback on failure

**Canary Deployment:**
- Deploy to small subset of users (5%)
- Monitor metrics
- Gradually increase percentage
- Full rollout if no issues

### 14.3 Tenant Provisioning Strategy
- **Automated Provisioning:**
  - Scripted setup of new tenant environment
  - Creation of tenant record and admin user
  - DNS record creation (if using AWS Route53 or similar)
- **Database Migrations:**
  - Migrations run across the shared database
  - Zero-downtime migration strategy required
  - Backward compatibility maintenance
- **Feature Flags:**
  - Use feature flags to roll out features to specific tenants
  - "Canary" tenants receive updates first

### 14.4 Release Management

#### 14.3.1 Release Schedule
- **Major Releases:** Quarterly (Q1, Q2, Q3, Q4)
- **Minor Releases:** Monthly (new features)
- **Patch Releases:** As needed (bug fixes)
- **Hotfixes:** Immediate (critical bugs)

#### 14.3.2 Release Process
1. **Planning:** Define release scope
2. **Development:** Code and test features
3. **Testing:** QA and UAT
4. **Approval:** Stakeholder sign-off
5. **Deployment:** Release to production
6. **Monitoring:** Post-release monitoring
7. **Retrospective:** Lessons learned

#### 14.3.3 Release Notes
- Version number (semantic versioning: MAJOR.MINOR.PATCH)
- Release date
- New features
- Enhancements
- Bug fixes
- Known issues
- Upgrade instructions

### 14.5 Rollback Strategy

**When to Rollback:**
- Critical bugs in production
- Security vulnerabilities
- Performance degradation
- Data corruption

**Rollback Process:**
1. Identify issue
2. Decide to rollback
3. Execute rollback (switch Blue-Green or redeploy previous version)
4. Verify system stability
5. Communicate to users
6. Root cause analysis
7. Fix and re-release

**Rollback Time:** < 15 minutes

### 14.5 Database Migrations

**Migration Strategy:**
- Backwards-compatible migrations (additive only)
- Test migrations in QA first
- Automated migration scripts
- Rollback scripts for each migration
- Database backup before migration

**Migration Process:**
1. Backup database
2. Run migration script
3. Verify data integrity
4. Deploy application code
5. Smoke tests
6. Rollback if issues

### 14.6 Monitoring & Alerting

**Monitoring Tools:**
- Application: New Relic, DataDog, Application Insights
- Infrastructure: CloudWatch, Prometheus, Grafana
- Logs: ELK Stack (Elasticsearch, Logstash, Kibana)
- Uptime: UptimeRobot, Pingdom

**Metrics to Monitor:**
- Application response time
- Error rate
- Request rate
- CPU usage
- Memory usage
- Disk usage
- Database performance
- Queue length

**Alerting:**
- Critical alerts: SMS, Phone call
- High alerts: Email, Slack
- Medium alerts: Email
- Low alerts: Log only

**On-Call Rotation:**
- 24/7 on-call support
- Primary and secondary on-call engineers
- Escalation policy
- Incident response runbook

---

## 15. MAINTENANCE & SUPPORT

### 15.1 Maintenance Plan

#### 15.1.1 Preventive Maintenance
- **Weekly:**
  - Database optimization (VACUUM, ANALYZE)
  - Log rotation and cleanup
  - Disk space monitoring
  
- **Monthly:**
  - Security patches
  - Dependency updates
  - Performance review
  - Backup verification
  
- **Quarterly:**
  - Database index analysis
  - Code refactoring (technical debt)
  - Security audit
  - Disaster recovery drill
  
- **Annually:**
  - Penetration testing
  - Infrastructure review
  - Capacity planning
  - System upgrade

#### 15.1.2 Corrective Maintenance
- Bug fixes based on priority
- Performance optimization
- Security patches
- Data corruption fixes

#### 15.1.3 Adaptive Maintenance
- Feature enhancements
- UI/UX improvements
- New regulatory requirements
- Integration with new systems

#### 15.1.4 Perfective Maintenance
- Performance optimization
- Code quality improvements
- Documentation updates
- User experience enhancements

### 15.2 Support Model

#### 15.2.1 Support Tiers

**Tier 1 - Help Desk:**
- First point of contact
- Handle common issues
- Password resets
- Basic troubleshooting
- Ticket logging
- Response time: < 1 hour

**Tier 2 - Technical Support:**
- Complex technical issues
- System configuration
- Data issues
- Integration problems
- Response time: < 4 hours

**Tier 3 - Development Team:**
- Bug fixes
- Code changes
- Database issues
- Architecture decisions
- Response time: < 24 hours

**Tier 4 - Vendor Escalation:**
- Third-party issues
- Infrastructure problems
- Response time: Per vendor SLA

#### 15.2.2 Support Channels
- **Email:** support@ibms.com
- **Phone:** Toll-free number (Ghana)
- **In-App Chat:** Real-time support
- **Help Center:** Self-service knowledge base
- **Ticketing System:** For tracking and prioritization

#### 15.2.3 Support Hours
- **Business Hours:** Monday-Friday, 8:00 AM - 6:00 PM GMT
- **After Hours:** Emergency support (P0/P1 only)
- **Weekend Support:** On-call for critical issues

#### 15.2.4 SLA (Service Level Agreement)

**Uptime:**
- Target: 99.9% (43.8 minutes downtime/month)
- Planned maintenance: 4 hours/month (excluded)

**Response Times:**
| Priority | Response Time | Resolution Time |
|----------|--------------|-----------------|
| P0 - Critical | 15 minutes | 4 hours |
| P1 - High | 1 hour | 8 hours |
| P2 - Medium | 4 hours | 2 business days |
| P3 - Low | 24 hours | 5 business days |

### 15.3 User Training

#### 15.3.1 Training Types
- **Initial Training:** During system implementation
- **Role-Based Training:** Specific to user roles
- **Refresher Training:** Quarterly or on-demand
- **New Feature Training:** When new features released
- **Admin Training:** System administration

#### 15.3.2 Training Methods
- **Instructor-Led Training:** In-person or virtual
- **Video Tutorials:** Recorded step-by-step guides
- **User Manual:** Comprehensive documentation
- **Quick Reference Guides:** One-page cheat sheets
- **Webinars:** Monthly Q&A sessions

#### 15.3.3 Training Materials
- User guide (PDF and online)
- Video library
- Interactive tutorials
- FAQ section
- Troubleshooting guide

### 15.4 Documentation

#### 15.4.1 User Documentation
- Getting started guide
- User manual (per role)
- Feature guides
- Troubleshooting guide
- FAQ

#### 15.4.2 Technical Documentation
- System architecture diagram
- Database schema
- API documentation
- Integration guides
- Deployment guide
- Security guide

#### 15.4.3 Operations Documentation
- Runbook (day-to-day operations)
- Incident response plan
- Disaster recovery plan
- Backup and restore procedures
- Monitoring and alerting setup

### 15.5 Continuous Improvement

**Feedback Collection:**
- User surveys
- Feature requests
- Bug reports
- Support ticket analysis
- Usage analytics

**Review Meetings:**
- Monthly product review
- Quarterly roadmap planning
- Annual strategic review

**Improvement Process:**
1. Collect feedback
2. Prioritize improvements
3. Plan implementation
4. Develop and test
5. Release
6. Measure impact

---

## 16. PROJECT TIMELINE

### 16.1 Project Phases

#### Phase 1: Planning & Design (4 weeks)
**Weeks 1-4**
- Requirements finalization
- System architecture design
- Database design
- UI/UX design
- Technology stack finalization
- Team assembly
- Project kickoff

**Deliverables:**
- Final SRS document
- System architecture diagram
- Database schema
- UI mockups and prototypes
- Project plan

#### Phase 2: Development - Foundation (8 weeks)
**Weeks 5-12**
- Development environment setup
- **Multi-tenancy Architecture Implementation** (RLS, Context)
- **Tenant Management Module** (Registration, Admin)
- CI/CD pipeline setup
- Authentication module (Tenant-aware)
- User management module
- Role-based access control
- Basic UI framework
- Database setup

**Deliverables:**
- Working authentication system
- User management interface
- Dev environment ready

#### Phase 3: Development - Core Modules (8 weeks)
**Weeks 11-18**
- Client management module
- KYC/AML compliance features
- Policy management module
- Lead management module
- Document management module
- Email and SMS integration

**Deliverables:**
- Client management working
- Policy management working
- Lead management working

#### Phase 4: Development - Advanced Modules (6 weeks)
**Weeks 19-24**
- Claims management module
- Complaints management module
- Internal chat system
- Reporting and analytics
- Dashboard and KPIs
- Mobile app development (if in scope)

**Deliverables:**
- Claims processing working
- Chat system functional
- Reporting module complete

#### Phase 5: Integration & Testing (4 weeks)
**Weeks 25-28**
- Payment gateway integration
- Mobile money integration
- SMS gateway integration
- Email service integration
- Unit testing
- Integration testing
- Security testing

**Deliverables:**
- All integrations working
- Test reports

#### Phase 6: UAT & Bug Fixing (4 weeks)
**Weeks 29-32**
- User acceptance testing
- Bug fixing
- Performance optimization
- Security hardening
- Documentation completion

**Deliverables:**
- UAT sign-off
- Bug-free system
- Complete documentation

#### Phase 7: Deployment & Training (2 weeks)
**Weeks 33-34**
- Production environment setup
- Data migration (if applicable)
- System deployment
- User training
- Go-live

**Deliverables:**
- Live system
- Trained users
- Support handover

#### Phase 8: Post-Launch Support (4 weeks)
**Weeks 35-38**
- Hypercare support
- Bug fixes
- Performance monitoring
- User feedback collection
- Minor enhancements

**Deliverables:**
- Stable production system
- User adoption
- Project closure

### 16.2 Total Timeline
**Duration:** 38 weeks (~9 months)

**Note:** Timeline assumes:
- Dedicated development team (at least 5 developers)
- Full-time project manager
- QA engineers available
- No major scope changes

### 16.3 Team Composition

**Development Team:**
- 1 Project Manager
- 1 Business Analyst
- 1 UI/UX Designer
- 2 Backend Developers (.NET/Node.js/Django)
- 2 Frontend Developers (React/Angular)
- 1 Mobile Developer (if mobile app in scope)
- 1 Database Administrator/Architect
- 2 QA Engineers
- 1 DevOps Engineer
- 1 Security Specialist (part-time)

**Total Team Size:** 12-13 people

### 16.4 Milestones

| Milestone | Week | Deliverable |
|-----------|------|-------------|
| Project Kickoff | Week 1 | Approved SRS |
| Design Complete | Week 4 | Approved designs |
| Auth Module Complete | Week 10 | Working login |
| Core Modules Complete | Week 18 | Client & Policy management |
| Advanced Modules Complete | Week 24 | Claims, Chat, Reports |
| Integration Complete | Week 28 | All APIs integrated |
| UAT Sign-off | Week 32 | Approved by users |
| Go-Live | Week 34 | Production launch |
| Project Closure | Week 38 | Handover complete |

---

## 17. APPENDICES




### Appendix A: Glossary

**AML** - Anti-Money Laundering: Regulations to prevent money laundering and terrorism financing.

**API** - Application Programming Interface: A set of protocols for building software applications.

**CSRF** - Cross-Site Request Forgery: A security vulnerability that tricks users into performing unwanted actions.

**EDD** - Enhanced Due Diligence: Additional KYC checks for high-risk clients.

**Ghana Card** - National ID card issued by Ghana's National Identification Authority.

**JWT** - JSON Web Token: A compact token format for securely transmitting information.

**KYC** - Know Your Customer: The process of verifying the identity of clients.

**Multi-Tenancy** - Architecture where a single instance of software serves multiple distinct user groups (tenants).

**NIC** - National Insurance Commission: Ghana's insurance regulatory authority.

**OWASP** - Open Web Application Security Project: Non-profit focused on software security.

**PEP** - Politically Exposed Person: Individual with prominent public functions.

**RPO** - Recovery Point Objective: Maximum acceptable data loss measured in time.

**RTO** - Recovery Time Objective: Maximum acceptable downtime.

**RLS** - Row-Level Security: database security feature restricting access to rows based on user characteristics.

**SaaS** - Software as a Service: Distribution model where applications are hosted by a provider.

**SRS** - Software Requirements Specification: Document describing software system requirements.

**Tenant** - A brokerage firm subscribing to the IBMS platform.

**TLS** - Transport Layer Security: Cryptographic protocol for secure communication.

**UAT** - User Acceptance Testing: Testing by end users to validate system meets requirements.

**XSS** - Cross-Site Scripting: Security vulnerability allowing injection of malicious scripts.

### Appendix B: References

- Insurance Act 2021 (Act 1061), Ghana
- National Insurance Commission Guidelines
- Anti-Money Laundering Act 2020 (Act 1044), Ghana
- Data Protection Act 2012 (Act 843), Ghana
- FATF Recommendations on AML/CFT

### Appendix C: Acronyms

| Acronym | Full Form |
|---------|-----------|
| AES | Advanced Encryption Standard |
| API | Application Programming Interface |
| CDN | Content Delivery Network |
| CI/CD | Continuous Integration/Continuous Deployment |
| CRM | Customer Relationship Management |
| GDPR | General Data Protection Regulation |
| HTTPS | Hypertext Transfer Protocol Secure |
| IBMS | Insurance Broker Management System |
| MFA | Multi-Factor Authentication |
| OTP | One-Time Password |
| RBAC | Role-Based Access Control |
| REST | Representational State Transfer |
| RLS | Row-Level Security |
| SaaS | Software as a Service |
| SLA | Service Level Agreement |
| SMS | Short Message Service |
| SQL | Structured Query Language |
| SSL | Secure Sockets Layer |
| TIN | Tax Identification Number |
| UBO | Ultimate Beneficial Owner |
| UUID | Universally Unique Identifier |
| VPN | Virtual Private Network |

### Appendix D: Contact Information

**Project Owner:**
- Name: [Client Name]
- Email: [client@email.com]
- Phone: [+233XXXXXXXXX]

**Development Team:**
- Project Manager: [Name & Contact]
- Lead Developer: [Name & Contact]
- Lead QA: [Name & Contact]

**Support:**
- Email: support@ibms.com
- Phone: [Support Hotline]
- Website: www.ibms.com

---

## DOCUMENT APPROVAL

This Software Requirements Specification has been prepared for the development of the Insurance Broker Management System (IBMS) for Ghana. The document outlines all functional and non-functional requirements needed to build a complete, NIC-compliant insurance brokerage management system.

**Prepared By:**
- Name: [Your Name]
- Title: Business Analyst / Systems Architect
- Date: February 13, 2026
- Signature: ________________________

**Reviewed By:**
- Name: [Reviewer Name]
- Title: [Title]
- Date: _______________
- Signature: ________________________

**Approved By:**
- Name: [Client Name]
- Title: [Title/Position]
- Date: _______________
- Signature: ________________________

---

## DOCUMENT REVISION HISTORY

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-02-13 | [Your Name] | Initial version - Complete SRS |
| | | | |
| | | | |

---

**END OF DOCUMENT**

---

*This document contains 17 sections covering all aspects of the Insurance Broker Management System. It can be provided to developers, AI systems, or development agencies to build the complete solution.*

# 🏛️ IBMS — Full System Overview Document
> **Insurance Broker Management System (IBMS)**
> This document provides a complete, section-by-section breakdown of every module in the IBMS platform — written so that any developer, stakeholder, or external reviewer can understand what the system does and what each section is responsible for.

---

## 📋 Table of Contents

1. [Authentication & Access Control](#1-authentication--access-control)
2. [Super Admin Panel](#2-super-admin-panel)
3. [Dashboard (Main Home)](#3-dashboard-main-home)
4. [Clients Section](#4-clients-section)
5. [Carriers Section](#5-carriers-section)
6. [Policies Section](#6-policies-section)
7. [Claims Section](#7-claims-section)
8. [Leads & CRM Section](#8-leads--crm-section)
9. [Quotes Section](#9-quotes-section)
10. [Renewals Section](#10-renewals-section)
11. [Finance Section](#11-finance-section)
12. [Compliance Section](#12-compliance-section)
13. [Complaints & Escalations Section](#13-complaints--escalations-section)
14. [Documents Section](#14-documents-section)
15. [Tasks Section](#15-tasks-section)
16. [Calendar Section](#16-calendar-section)
17. [Chat & Messaging Section](#17-chat--messaging-section)
18. [Approvals Section](#18-approvals-section)
19. [Reports Section](#19-reports-section)
20. [Audit Logs Section](#20-audit-logs-section)
21. [Notifications Section](#21-notifications-section)
22. [Team & Departments Section](#22-team--departments-section)
23. [Settings Section](#23-settings-section)
24. [Integrations Section](#24-integrations-section)

---

## 1. Authentication & Access Control

### What It Does
The authentication system is the front door of the entire IBMS platform. Every user — from a junior broker to the platform owner — must pass through it to gain access.

### Key Functionalities

**A. Secure Login**
- Users log in with their email and password.
- The system supports **multi-tenant login**: if a user's email exists across multiple agency accounts (tenants), the system prompts them to select which agency to log into before proceeding.
- Passwords are securely hashed using **bcrypt** and never stored in plain text.

**B. Account Lockout Protection**
- After **5 consecutive failed login attempts**, the account is automatically locked for **30 minutes**.
- This prevents brute-force attacks on accounts.

**C. JWT Token System (Access + Refresh Tokens)**
- On successful login, the system issues two tokens:
  - **Access Token**: A short-lived JWT used for all API requests.
  - **Refresh Token**: A long-lived (7-day) token that automatically issues a new access token when it expires, so users don't have to log in every hour.
- The system enforces a **maximum of 5 concurrent sessions** per user. If a 6th device logs in, the oldest session is automatically revoked.
- **Token rotation** is enforced: every time a refresh token is used, it is retired and a brand new one is issued. If someone tries to reuse an old refresh token, the system detects a **token reuse attack** and immediately revokes ALL sessions for that user.

**D. Two-Factor Authentication (2FA)**
- Users can enable 2FA on their account for an extra layer of security.
- When 2FA is enabled, after entering the correct password, the system issues a temporary challenge instead of full tokens. The user must complete the 2FA step before gaining access.

**E. Password Reset Flow**
- A user who forgets their password clicks "Forgot Password" and receives a **time-limited (1-hour) reset link** via email.
- The reset token uses the same family-based hashing as refresh tokens to prevent replay attacks.
- After a successful password reset, all active sessions (refresh tokens) are immediately revoked — forcing the user to log in fresh on all devices.

**F. Team Invitations**
- Administrators can invite new team members by email.
- The invited user receives an email with a secure link to create their account and join the agency workspace.

**G. Role-Based Access Control (RBAC)**
- Every user is assigned a **role** that determines what they can see and do:
  - **PLATFORM_SUPER_ADMIN / SUPER_ADMIN**: Full god-mode access across all tenants. Access to the Super Admin Panel.
  - **ADMIN / OWNER**: Full access within their own agency (tenant).
  - **MANAGER**: Can manage team operations, approve actions, view all data.
  - **BROKER / AGENT**: Day-to-day operational access (clients, policies, claims, etc.).
  - **VIEWER**: Read-only access to key data.
- Admins **cannot** assign a role higher than their own.
- An admin cannot deactivate or delete their own account.

---

## 2. Super Admin Panel

### What It Does
The Super Admin Panel is a completely separate, restricted area of the application accessible **only** to the platform owners (PLATFORM_SUPER_ADMIN and SUPER_ADMIN roles). It provides a "god view" across all insurance agencies (tenants) using the IBMS platform.

Think of it as the **"Mission Control"** of the entire SaaS platform.

### Key Sections

**A. Platform Overview Dashboard**
- Displays **real-time KPIs** across the entire platform:
  - Total Tenants (agencies) vs. Active Tenants
  - New tenants joined this month
  - **Monthly Recurring Revenue (MRR)** and **Annual Recurring Revenue (ARR)**
  - MRR Growth % compared to last month
  - Number of active user sessions (in the last 30 minutes)
  - NIC Compliance flags across all agencies
  - System errors in the last 24 hours
- **Charts**: Tenant growth over 12 months, Monthly Revenue, MRR breakdown by subscription plan, and Top 5 Tenants by policy count.
- **Live Activity Feed**: A real-time feed of every significant action taken by any super admin (logins, tenant changes, config updates, etc.).

**B. Tenant Management**
- Lists every agency (tenant) registered on the platform.
- Super admins can:
  - View detailed profiles of each tenant (plan, status, NIC license, contact info).
  - Create new tenants (onboard new insurance agencies).
  - Activate or deactivate tenants.
  - Drill down into a specific tenant to see their users, policies, and activity.

**C. Subscription & Billing Management**
- Manages the commercial relationship with each agency.
- Tracks which subscription plan (e.g., Starter, Professional, Enterprise) each agency is on.
- Monitors subscription renewal dates.
- MRR and ARR calculations are driven by this data.

**D. User Management (Cross-Tenant)**
- Super admins can view all users across all agencies.
- Allows promoting a user, deactivating accounts at the platform level.

**E. System Health Monitor**
- Real-time health checks on all critical system services:
  - **PostgreSQL Database**: Checks database connectivity and response time. Marks as DEGRADED if response is over 1 second.
  - **Background Jobs Engine**: Monitors the queue. Flags DEGRADED if more than 10 jobs failed in 24 hours or 100+ jobs are queued.
  - **Email Service**: Monitors for email bounce/failure rates. Flags DEGRADED if more than 5 failures in the last hour.
- Maintains a **historical health log** for uptime tracking over the last 90 days.
- Reports **database size** and **active database connections**.

**F. Background Jobs Monitor**
- Shows the status of all system automation jobs (CRON tasks): queued, running, completed, or failed.
- Allows super admins to see if any scheduled task (like the daily renewal reminder) failed and why.

**G. NIC Compliance Monitoring**
- Provides a cross-tenant view of all agencies' NIC compliance scores.
- Flags any agency with a compliance score below 50 for immediate attention.

**H. Email Logs**
- A complete log of every email sent by the platform (welcome emails, renewal reminders, claim notifications, password resets).
- Shows the delivery status of each email (SENT, BOUNCED, FAILED) so support teams can diagnose communication issues.

**I. Error Tracker**
- Logs all system errors and exceptions.
- Shows the count of errors in the last 24 hours on the Overview dashboard.

**J. Feature Flags**
- Allows super admins to enable or disable specific features for the entire platform or for specific tenants without deploying new code.
- Example: Rolling out a new "Premium Financing" module only to selected beta tenants.

**K. Announcements**
- Super admins can publish platform-wide announcements (e.g., scheduled maintenance, new features) that are shown to all users.

**L. Platform Audit Logs**
- A separate, highly detailed audit trail of every action performed within the Super Admin Panel itself.
- Records the actor's email, role, IP address, browser information, the action taken, and what changed (before/after state).
- This is separate from the per-tenant audit log — it specifically tracks what the platform's own administrators are doing.

**M. Settings**
- Global platform configuration settings (e.g., default plans, system email addresses, platform name).

---

## 3. Dashboard (Main Home)

### What It Does
The main dashboard is the first screen a broker or manager sees after logging in. It is their **command center** — a single screen that summarizes the health and activity of their entire agency for the current day/month.

### What It Displays
- **KPI Cards**: Total Clients, Active Policies, Open Claims, total Premium volume for the period.
- **Monthly Trend Chart**: A 12-month bar/line chart showing new policies, renewals, cancellations, and premium collected each month.
- **Policy Mix**: A breakdown of policies by insurance type (Motor, Fire, Marine, Health, etc.) shown as percentages.
- **Claims Overview**: A snapshot of claims by status (Intimated, Under Review, Settled, Rejected).
- **Top Carriers**: The top 10 insurance companies by policy count and premium volume for the agency.
- **Recent Activity**: A feed of the last 20 actions taken within the system (new clients added, policies bound, claims filed).
- **Lapsed Policies**: Count and total premium of lapsed/expired policies representing "at risk" revenue.
- **Client Segments**: Corporate vs Individual client breakdown.
- **Client Concentration Risk**: Flags if a single client represents more than 30% of the agency's active premium (a risk management alert).

---

## 4. Clients Section

### What It Does
The Clients Section is the **central hub for managing the agency's most valuable asset — its client relationships.** Every policy, claim, and financial transaction is ultimately linked back to a client record.

### Key Functionalities

**A. Client Registry**
- Maintains a master list of all clients (individuals and corporate).
- Client types:
  - **INDIVIDUAL**: Private persons. Requires First Name, Last Name.
  - **CORPORATE**: Companies and businesses. Requires Company Name.
- Each client is automatically assigned a unique **Client Number** (e.g., `CLI-000001-A3F9E2`) on creation.
- Supports rich client profiles including: phone, email, region, city, digital address, Ghana Card number, date of birth, gender, occupation, and Tax Identification Number (TIN).
- When a new client is added, the system **automatically sends them a personalised welcome email** on behalf of the broker.
- Clients with active policies **cannot be deleted** from the system to protect data integrity.

**B. KYC (Know Your Customer) Management**
- Every client has a KYC status tracked on their profile:
  - **PENDING**: ID documents submitted but not yet verified.
  - **VERIFIED**: Client's identity has been confirmed.
  - **REJECTED**: Submitted documents were rejected.
  - **EXPIRED**: Previously verified documents have passed their validity date.
- Brokers can update the KYC status at any time, and all changes are recorded in the audit log.

**C. AML (Anti-Money Laundering) Risk Rating**
- Every client is assigned an AML Risk Level:
  - **LOW, MEDIUM, HIGH, CRITICAL**
- Clients flagged as HIGH or CRITICAL are permanently surfaced in the Compliance Dashboard for ongoing monitoring.
- There is also a dedicated **PEP (Politically Exposed Person)** flag. Clients marked as PEP are treated with heightened scrutiny.
- Clients requiring **Enhanced Due Diligence (EDD)** can be specifically flagged.

**D. Beneficiary Management**
- For life insurance clients, the system manages **policy beneficiaries**.
- You can add multiple beneficiaries per client, each with a percentage allocation.
- The system enforces that the total allocation across all beneficiaries **cannot exceed 100%**. It will throw an error if you try.
- Beneficiary records include: full name, relationship, phone, Ghana Card number, date of birth, and a guardian name (for minor beneficiaries).

**E. Next of Kin**
- Stores emergency contact and next of kin information for each client.

**F. Bank Details**
- Stores the client's bank account information (bank name, account name, account number, branch) for use in claim settlements and commission payments.

**G. Linked Records**
- From a client's profile, a broker can instantly see all linked:
  - Policies (active, lapsed, expired)
  - Claims (with status)
  - Invoices, transactions

**H. Filtering & Search**
- The client list supports powerful search by name, email, phone, or client number.
- Filters by: client type, status, KYC status, AML risk level, and region.
- Sorting by name, date created, status, etc.

---

## 5. Carriers Section

### What It Does
The Carriers Section is the **"Supply Chain Hub"** of the agency. It manages the agency's formal relationships with every insurance company (carrier) it is licensed to sell for.

### Key Functionalities

**A. Central Carrier Registry**
- A master directory of all insurance providers the agency works with.
- Carriers are classified into three types:
  - **NON_LIFE**: General insurers (Motor, Fire, Marine, Travel).
  - **LIFE**: Life insurance and pension product providers.
  - **REINSURERS**: Companies that insure the insurance companies.
- Each carrier record stores: name, short name, unique slug, NIC license number, website, phone, email, and contact person.

**B. Branding & Visual Identity**
- The system stores each carrier's official **Logo URL** and **Brand Color** (hex code).
- This data is used when generating quotes and policy documents, ensuring the broker's proposals look professional with the carrier's official branding.

**C. Status Management**
- Each carrier can be marked as ACTIVE or INACTIVE.
- Inactive carriers cannot be selected when creating new policies.

**D. Product Catalog Integration**
- Each carrier has a linked list of **Products** — the specific insurance products they offer (e.g., "Star Assurance Motor Comprehensive").
- When a broker creates a new policy, they select a carrier, and the system automatically presents the relevant products available from that carrier.
- Products define:
  - The insurance type (Motor, Fire, Marine, etc.)
  - The commission rate the agency earns for selling that product.

**E. Performance Tracking**
- A carrier's profile shows a **live count** of how many active products are linked to them.
- The system tracks which carriers are used for the most policies, supporting the agency owner in negotiating better commission rates with high-volume partners.

**F. NIC Portal Link**
- The section provides a direct shortcut to the **National Insurance Commission (NIC) online portal** so brokers can quickly verify that a carrier's operating license is current and valid.

---

## 6. Policies Section

### What It Does
The Policies Section is the **core revenue engine** of the agency. It manages the entire lifecycle of an insurance policy — from the moment it is drafted to when it expires, is cancelled, or is renewed.

### Policy Lifecycle States
```
DRAFT → COVER_NOTE → ACTIVE → LAPSED
                   ↘ CANCELLED
                   ↓
                 EXPIRED
LAPSED → (Reinstated) → ACTIVE
```

### Key Functionalities

**A. Policy Creation**
- Supports multiple insurance types, each with their own required data:
  - **MOTOR**: Requires vehicle details (registration, make, model, engine, chassis numbers).
  - **FIRE/PROPERTY**: Requires property details (address, type, value).
  - **MARINE**: Requires marine details (vessel type, cargo, voyage route).
  - **HEALTH, TRAVEL, PROFESSIONAL INDEMNITY, LIFE, etc.**
- Validates that the selected client and carrier both exist and belong to the same agency.
- Auto-selects the most appropriate product from the carrier based on the insurance type.
- Each policy gets a unique **Policy Number** (e.g., `POL-20260320-00001-A3F9E2`).
- Automatically calculates the **commission amount** from the product's commission rate.

**B. Policy Status Actions**
- **Issue Cover Note** (DRAFT → COVER_NOTE): Creates a temporary, short-term coverage certificate before the full policy document is issued.
- **Bind Policy** (DRAFT/COVER_NOTE → ACTIVE): Activates the policy. This triggers a cascade of automatic actions:
  - **Premium Installments**: If the premium frequency is Monthly, Quarterly, or Semi-Annual, the system automatically generates all the individual payment installment records for the policy year.
  - **Commission Record**: Automatically creates a commission record in the Finance section, with NIC Levy deducted.
  - **Calendar Events**: Automatically creates renewal reminder events in the Calendar at **90, 60, and 30 days before the policy expires**, so brokers never miss a renewal.
  - **Installment Reminders**: Creates calendar events for each installment due date.
- **Cancel Policy** (ACTIVE → CANCELLED): Requires a reason and a future effective date. Cannot back-date cancellations.
- **Lapse Policy** (ACTIVE → LAPSED): Marks the policy as lapsed due to non-payment or other reasons.
- **Reinstate Policy** (LAPSED → ACTIVE): Reactivates a lapsed policy (only if it hasn't passed its expiry date; otherwise, a new renewal must be created).

**C. Policy Endorsements**
- An endorsement is a formal amendment to an active policy (e.g., adding a named driver to motor insurance, increasing the sum insured).
- Endorsement types include: ADDITION, DELETION, AMENDMENT, SUSPENSION, REINSTATEMENT, etc.
- Endorsements go through an approval workflow: PENDING → APPROVED or REJECTED.
- When approved, if the endorsement includes a **premium adjustment**, the policy's premium amount is automatically updated.

**D. Premium Installment Tracking**
- View and manage all installment payment schedules for a policy.
- Mark individual installments as PAID, recording the payment date, amount, and reference.

**E. Policy Documents**
- Attach supporting documents directly to a policy record (e.g., the official policy document PDF, vehicle photos, property valuations).

**F. Auto-Expiry**
- A nightly automated job (CRON) runs at midnight and automatically sets all policies whose expiry date has passed to **EXPIRED** status. This is logged in the audit trail.

---

## 7. Claims Section

### What It Does
The Claims Section manages the full lifecycle of an insurance claim — from the moment a client first reports a loss to the final settlement payment. It enforces the legally mandated NIC timelines to keep the agency compliant.

### Claim Lifecycle & State Machine
```
INTIMATED → REGISTERED → UNDER_REVIEW → ASSESSED → APPROVED → SETTLED → CLOSED
                       ↘ DOCUMENTS_PENDING ↗
                                          ↘ REJECTED → (Appeal) → UNDER_REVIEW
```
Every transition is strictly enforced. The system will reject any attempt to skip a stage.

### Key Functionalities

**A. Claim Filing (Intimation)**
- To file a claim, a valid active (or recently expired) policy must be selected.
- The system validates that the **incident date falls within the policy period**. Claims outside the policy window are automatically rejected.
- Details captured: peril type (what happened), incident date, incident description, incident location, and the claimed amount.
- On creation, the system automatically calculates two NIC-mandated deadlines:
  - **5-Business-Day Acknowledgement Deadline**: The agency must acknowledge the claim within 5 working days.
  - **30-Day Processing Deadline**: The claim must be settled within 30 days.

**B. Acknowledge (Intimated → Registered)**
- The broker formally registers the claim in the system.
- The system automatically flags if the acknowledgement is happening **after the 5-day deadline**, marking it as overdue in the audit trail.

**C. Investigate (Registered → Under Review)**
- Moves the claim to the investigation stage.
- Allows assigning the claim to a specific assessor/user within the team.

**D. Approve (Under Review → Approved)**
- Manager or senior broker approves the claim with an approved amount.
- Validates that the **approved amount cannot exceed the policy's Sum Insured**.
- Automatically sends an **email notification to the client** informing them their claim has been approved.

**E. Reject (Under Review → Rejected)**
- Rejects the claim with a reason.
- Automatically sends an **email notification to the client** explaining the rejection.
- A rejected claim can be **reopened** (appealed) by providing appeal notes, moving it back to Under Review.

**F. Settle (Approved → Settled)**
- Records the final settlement amount, deductible, payment method, and reference.
- The system checks if the settlement is happening **after the 30-day deadline** and flags the claim accordingly.
- On settlement, the linked policy's **claim count and total claims value** are automatically updated.

**G. Claim Documents**
- Attach and manage supporting documents for a claim: photos of damage, police reports, medical reports, repair estimates, etc.

**H. Follow-Up / Chase Log**
- Brokers can log every interaction with the client or the carrier regarding a claim (phone calls, emails, site visits).
- Each log entry records: method, notes, contact name, next action, and the follow-up date.
- This creates a complete **audit trail of all chasing activity** for every claim.

**I. Overdue Detection**
- The claims list automatically flags overdue claims — both the 5-day acknowledgement overdue and the 30-day processing overdue.
- The overdue count is displayed as a KPI on the claims list page.

---

## 8. Leads & CRM Section

### What It Does
The Leads Section is the agency's **Customer Relationship Management (CRM)** tool. It tracks potential new clients from the moment they first show interest until they either convert into a paying client or are lost.

### Lead Lifecycle Stages
```
NEW → CONTACTED → QUALIFIED → QUOTED → NEGOTIATION → CONVERTED ✓
                                                    ↘ LOST ✗
                                    NURTURING (long-term hold)
```

### Key Functionalities

**A. Lead Creation & Tracking**
- Each lead gets a unique **Lead Number** (e.g., `LEAD-20260320-00001-B2C4D6`).
- Captures: contact name, email, phone, company name, products they are interested in, estimated premium value.
- Leads have a **Priority** rating: HOT, WARM, COLD — helping brokers focus on the most promising prospects.
- Leads can be assigned to a specific broker in the team.

**B. Lead Sources**
- Records where each lead came from: REFERRAL, WEBSITE, COLD_CALL, SOCIAL_MEDIA, WALK_IN, etc.

**C. Kanban Board View**
- The leads section offers a visual **Kanban board** where all leads are arranged in columns by their current stage.
- Brokers can drag and drop leads between stages (or use the stage change action) to update their progress.
- Stage counts (how many leads are in each column) are shown as summary statistics.

**D. Lead Conversion**
- When a lead is ready to become a client, brokers click "Convert to Client."
- The system **automatically creates a full Client record** from the lead's data (parsing the contact name into first and last name, copying email, phone, and company name).
- The lead is then marked as CONVERTED and linked to the newly created client record for full traceability.

**E. Follow-Up Scheduling**
- Each lead has a **"Next Follow-Up Date"** field so brokers always know when to call back.
- The Last Contact Date is automatically updated whenever the lead's stage changes.

---

## 9. Quotes Section

### What It Does
The Quotes Section allows brokers to **generate professional, multi-option insurance quotes** for clients — presenting them with a comparison of different carriers and premiums before they commit to a policy.

### Quote Lifecycle
```
DRAFT → SENT → ACCEPTED → (Policy Created)
             ↘ DECLINED
```

### Key Functionalities

**A. Quote Creation**
- Each quote gets a unique **Quote Number** (e.g., `QTE-20260320-0001-F4A2`).
- A quote is linked to a specific client and captures: insurance type, coverage type, sum insured requested, risk description, and a validity date.
- A single quote can contain **multiple options** — one for each carrier being compared:
  - Carrier name, premium amount, sum insured, commission rate/amount, excess/deductible, and coverage notes.
  - One option can be marked as the **Recommended** choice.

**B. Send Quote**
- Once the broker is satisfied with the quote document, they send it to the client (DRAFT → SENT).

**C. Client Response**
- The broker records the client's response:
  - **Accept**: The client agrees to proceed. The quote moves to ACCEPTED.
  - **Decline**: The client decides not to proceed. The quote moves to DECLINED.

**D. Policy Conversion**
- After a quote is accepted, the broker proceeds to create the full Policy in the Policies section, referencing the accepted quote.

---

## 10. Renewals Section

### What It Does
The Renewals Section ensures that **no policy ever silently expires** without the agency and the client being notified. It is a proactive retention tool.

### Key Functionalities

**A. Upcoming Renewals Dashboard**
- Shows all active policies expiring within the next 90 days (configurable).
- Each policy shows **days until expiry** and a renewal status:
  - **URGENT**: Expiring within 30 days.
  - **UPCOMING**: Expiring in 31–90 days.
- Filterable by insurance type and carrier.

**B. Policy Renewal**
- When renewing a policy, the system creates a **brand new policy record** linked to the old one (`previousPolicyId`).
- The new policy inherits all the core details (client, carrier, product, insurance type, vehicle/property details) from the old policy.
- The new policy starts the day after the old policy expires and runs for another full year.
- The new policy starts in **DRAFT** status and must be re-bound (activated) by the broker after review.
- The old policy is marked as `isRenewal: true` on the new record for full lineage tracking.

**C. Automated Renewal Reminder Emails (CRON)**
- Every morning at 9 AM, an automated robot scans all active policies.
- It sends **renewal reminder emails** to clients whose policy expires in exactly 90, 60, or 30 days.
- The email is personalised with the client's name, policy number, expiry date, current premium amount, and insurance type.
- Admins can also trigger a **manual bulk notify** for their entire agency at any time.

**D. Automated Policy Expiry (CRON)**
- Every night at midnight, the system scans for all active policies whose expiry date has passed and automatically transitions them to **EXPIRED** status. Every expiry is individually logged in the audit trail.

---

## 11. Finance Section

### What It Does
The Finance Section is the agency's **complete financial back-office.** It tracks every single Ghanaian Cedi (GHS) that flows through the business — from client premiums and carrier commissions to agency expenses and regulatory remittances.

The Finance section is broken into five sub-modules:

---

### 11A. Invoices
- Invoices are formal billing documents sent to clients for premiums due.
- Invoice lifecycle: `OUTSTANDING → PARTIAL → PAID` or `OVERDUE` or `CANCELLED`.
- A nightly CRON job at 1 AM automatically marks all unpaid invoices past their due date as **OVERDUE**.
- The invoice list shows three live aggregate totals: Total Outstanding, Total Overdue, Total Paid.
- When a payment is recorded against an invoice, the `amountPaid` field is updated automatically. When the invoice is fully paid, it moves to PAID status. Partial payments create PARTIAL status.

### 11B. Transactions (Payments Ledger)
- Records every individual money movement (inflow or outflow) in the system.
- Transaction types: PREMIUM (money from clients), COMMISSION (money from carriers), EXPENSE (money going out), REFUND.
- Payment methods supported: CASH, BANK_TRANSFER, MOBILE_MONEY (MTN, Vodafone, AirtelTigo), CHEQUE, CARD.
- For Mobile Money payments, the MoMo network and phone number are required.
- Each transaction gets a unique **Transaction Number** (e.g., `TXN-20260320-000001-A3B4C5`).
- **Account Types**: Transactions are categorised into:
  - **CLIENT_ACCOUNT**: Money held on behalf of clients (premiums received but not yet remitted to the carrier).
  - **AGENCY_ACCOUNT**: The agency's own money (commissions received, expenses paid).
- A **Ledger Summary** shows the total balance of both account types.
- When a Premium transaction is recorded against a policy, the system automatically marks the **next pending installment** as PAID.
- Transactions can be **Voided** (PAID → REFUNDED). Voiding a transaction linked to an invoice automatically reverses the invoice payment.

### 11C. Commissions
- Every time a policy is **Bound (activated)**, the system automatically creates a Commission record.
- The commission amount is calculated from the product's commission rate applied to the premium.
- **NIC Levy** (a percentage deducted by the National Insurance Commission) is automatically calculated and deducted to arrive at the **Net Commission** the agency actually earns.
- Commission lifecycle: `PENDING → EARNED → PAID`
  - A commission becomes EARNED when the premium has been remitted to the carrier.
  - A commission becomes PAID when the agency receives the money from the carrier.
- The commission list shows three live totals: Total Pending, Total Earned, Total Paid.
- Commissions can be filtered by broker (account officer), carrier, client, and status.

### 11D. Remittances
- A remittance is the act of **sending the client's premium money to the carrier** (the insurance company).
- This is a critical regulatory obligation — the agency collects premiums on behalf of the carrier and must remit them.
- Each remittance is tied to a specific policy and carrier. The system validates that the carrier matches the policy's carrier.
- Remittance lifecycle: `PENDING → PARTIAL → REMITTED`
- When a remittance is marked as REMITTED (fully confirmed), the system automatically moves all linked commissions from PENDING to **EARNED**, signalling that the agency has fulfilled its obligation and can now claim its commission.
- Each remittance gets a unique **Remittance Number** (e.g., `REM-20260320-00001-C5D6E7`).

### 11E. Expenses
- Tracks all agency operating costs (staff salaries, office rent, utility bills, marketing costs, etc.).
- Each expense can be categorised and assigned to a department.
- Expenses can optionally require **manager approval** before being processed.
- Lifecycle: `PENDING (awaiting approval) → APPROVED`
- When an expense is **Approved**, the system automatically creates a corresponding **EXPENSE transaction** in the payments ledger.
- Supports **bulk import** of up to 100 expenses at once (e.g., from a spreadsheet).

---

## 12. Compliance Section

### What It Does
The Compliance Section acts as the agency's **digital legal officer.** It proactively monitors the business for regulatory risks under the National Insurance Commission (NIC) Act 1061 and the Financial Intelligence Centre (FIC) anti-money laundering requirements.

### Key Functionalities

**A. Compliance Summary Dashboard**
Provides four real-time KPI blocks:
- **KYC Status Breakdown**: Count of clients in each KYC state (Pending, Verified, Rejected, Expired).
- **AML Risk Breakdown**: Count of clients at each risk level (Low, Medium, High, Critical).
- **NIC SLA Status**: Count of claims that are On Track, At Risk (within 2 days of deadline), or Overdue.
- **Complaint SLA Status**: Count of complaints Within SLA vs. SLA Breached.

**B. KYC Queue**
- Lists all clients in **PENDING or EXPIRED** KYC status.
- Shows how many days each client has been in that state.
- Allows the compliance officer to take action (verify, reject).

**C. AML High-Risk Screening**
- Lists all clients flagged as **HIGH or CRITICAL AML risk**.
- Shows how many active policies each high-risk client currently holds — a critical piece of information for risk management.

**D. NIC Deadline Monitor**
- Shows all open claims that are approaching or have breached their NIC deadlines:
  - **5-Business-Day Acknowledgement Deadline**: The claim must be formally acknowledged within 5 working days of being reported.
  - **30-Day Processing Deadline**: The claim must be settled within 30 calendar days.
- Each record shows whether each deadline has been breached and by how many days.

**E. PEP Quick-Screen Tool**
- A real-time search bar where compliance officers can type a name to check it against the agency's database of flagged individuals.
- The system searches for matches across clients marked as PEP (Politically Exposed Person) or those with HIGH/CRITICAL AML risk.
- Returns a clear **"MATCH"** or **"CLEAN"** result with full details of any matches found.

---

## 13. Complaints & Escalations Section

### What It Does
The Complaints Section manages the formal grievance process for client complaints, with built-in **SLA (Service Level Agreement) enforcement** tied to complaint priority.

### Complaint Lifecycle
```
REGISTERED → UNDER_INVESTIGATION → RESOLVED → CLOSED
                                ↘ ESCALATED → RESOLVED
           RESOLVED → (Reopened) → UNDER_INVESTIGATION
```

### SLA Timelines by Priority
| Priority | Resolution Deadline |
|----------|-------------------|
| CRITICAL | 1 day |
| HIGH | 3 days |
| MEDIUM | 5 days |
| LOW | 10 days |

### Key Functionalities

**A. Complaint Registration**
- Each complaint is automatically linked to the relevant client.
- Captures: subject, category, description, and priority.
- A unique **Complaint Number** (e.g., `CMP-20260320-0001-D7E8F9`) is generated.
- The SLA deadline is automatically calculated from the priority level at the time of creation.

**B. Assignment**
- Once registered, the complaint is assigned to a specific team member for investigation (REGISTERED → UNDER_INVESTIGATION).

**C. Escalation**
- If the investigation is not progressing, the complaint can be escalated.
- On escalation:
  - The priority is **automatically bumped up** one level (e.g., MEDIUM → HIGH).
  - A new, shorter SLA deadline is calculated.
  - The escalation level counter is incremented.
  - The complaint is reassigned to a more senior handler.

**D. Resolution**
- The handler resolves the complaint with a resolution description and category.
- The system calculates the **total time taken to resolve** (in hours).
- It automatically checks if the SLA deadline was breached at the time of resolution and flags it as `isBreached = true` if so.

**E. Closure**
- After a resolved complaint is reviewed and confirmed, it is moved to CLOSED.

**F. Reopen**
- A resolved complaint can be reopened if the client is not satisfied (RESOLVED → UNDER_INVESTIGATION).

**G. Escalations Dashboard**
- A combined view that shows all **urgent, overdue, or escalated items** across the entire agency:
  - Overdue Claims (past their acknowledgement or processing deadline).
  - Escalated Complaints (at ESCALATED status).
  - Critical Complaints (HIGH/CRITICAL priority, due within 24 hours).
- Items are sorted by how many hours overdue they are, putting the most urgent at the top.

---

## 14. Documents Section

### What It Does
The Documents Section is the agency's **central digital filing cabinet.** Every document uploaded anywhere in the system (client KYC IDs, policy documents, claim photos, expense receipts) is indexed and searchable here.

### Key Functionalities

**A. Document Upload & Categorisation**
- Documents are categorised by type: KYC, POLICY, CLAIM, INVOICE, COMPLIANCE, GENERAL, etc.
- Each document is linked to the entity it belongs to (e.g., `linkedEntityType: "CLIENT"`, `linkedEntityId: "abc123"`).
- Each document gets a unique **Document Number** (e.g., `DOC-20260320-00001-E8F9A1`).

**B. Document Search & Filtering**
- Search by document name.
- Filter by category, client, entity type, and date range.
- The document list shows a **breakdown of document count by category** (e.g., 45 KYC documents, 200 Policy documents).

**C. NIC 7-Year Retention Policy (Automated)**
- Under NIC regulations, insurance records must be retained for a minimum of **7 years.**
- When a broker attempts to delete a document, the system checks the document's age.
- If the document is less than 7 years old, it is **archived** (soft-deleted) rather than permanently removed. The broker receives an explanation message.
- Only documents older than 7 years can be fully purged from the system.

**D. Expiry Tracking**
- Documents can be given an expiry date (e.g., for KYC documents that expire).
- Expired documents are excluded from the active document list.

---

## 15. Tasks Section

### What It Does
The Tasks Section is a lightweight **internal task management system** for the agency team — similar to a work-focused to-do list. It ensures that important follow-up actions don't fall through the cracks.

### Key Functionalities

**A. Task Creation & Assignment**
- Tasks have a title, description, priority (LOW, MEDIUM, HIGH, URGENT), due date, and type.
- Tasks can be linked to other parts of the system via a `link` field (e.g., linking a task to a specific claim or client).
- When a task is assigned to a team member, they **automatically receive an email notification** with the task details.

**B. Task Status**
- Tasks move through: PENDING → IN_PROGRESS → REGISTERED (completed).
- When a task is marked complete, the `completedAt` timestamp is automatically recorded.

**C. "My Tasks" View**
- Every user can quickly see only the tasks assigned to them.

**D. Reassignment Notifications**
- If a task is reassigned to a different team member, the new assignee automatically receives an email notification.

---

## 16. Calendar Section

### What It Does
The Calendar Section provides a **shared team calendar** that automatically collects all important dates from across the system into one place.

### Key Functionalities

**A. Event Types**
- **POLICY**: Policy renewal reminders (automatically created when a policy is bound).
- **PAYMENT**: Premium installment due dates (automatically created when a policy is bound).
- **CLAIM**: Claim-related meetings and deadlines.
- **MEETING**: General internal or client meetings.
- **TASK**: Task due dates.
- **OTHER**: Miscellaneous events.

**B. Event Creation**
- Users can manually create events with a title, description, start/end time, location, and a list of attendees (other team members).
- The creator is automatically added as an attendee.

**C. Attendee Management**
- Add or remove attendees from events.
- The calendar view shows events where the user is either the creator or an invited attendee.

**D. Date Range Restriction**
- The calendar API enforces a maximum **90-day date range** per query to prevent performance issues.

**E. Auto-Population**
- The most powerful feature: the calendar is populated **automatically** without the broker having to do anything.
  - When a policy is bound: 3 renewal reminders (at 90, 60, 30 days before expiry) and all installment due date events are created automatically.
  - When a claim is filed: deadline dates appear automatically.

**F. Google Calendar Sync**
- Integrates with Google Calendar to push IBMS events to the broker's personal/professional Google Calendar.
- Also pulls events from Google Calendar back into IBMS, categorising them automatically based on keywords in the event title.

---

## 17. Chat & Messaging Section

### What It Does
The Chat Section provides a **real-time internal messaging system** for the agency team — so brokers and managers can communicate instantly without leaving the platform.

### Key Functionalities

**A. Room Types**
- **DIRECT messages**: A private, 1-on-1 conversation between two team members. The system prevents duplicate direct rooms — if a conversation already exists between two users, it reuses the existing room.
- **GROUP rooms**: Named group chats for teams or projects (e.g., "Claims Team," "Motor Division"). Require a room name.

**B. Real-Time Messaging**
- Messages are delivered in real-time using **WebSocket** connections (socket.io).
- Message types: TEXT, FILE, IMAGE, SYSTEM.

**C. Unread Message Counts**
- The chat room list shows an unread badge count for each room, showing how many messages were sent by others that have not been read yet.

**D. Message History (Pagination)**
- Older messages are loaded in pages (up to 100 at a time), with support for "load more" by passing a `before` timestamp.

**E. Read Receipts**
- Messages can be marked as READ, changing their `readStatus`.

**F. Participant Management**
- Users can be added to or removed from GROUP rooms.
- Participants cannot be added to or removed from DIRECT rooms (which are fixed at 2 people by design).

---

## 18. Approvals Section

### What It Does
The Approvals Section provides a **formal, traceable workflow** for actions that require management sign-off before they can be executed. It replaces informal WhatsApp approvals with a structured, audited process.

### Key Functionalities

**A. Approval Request Types**
- Any significant action can be routed through the approvals workflow: policy changes, large expense approvals, claim settlements above a threshold, etc.
- Each request has a type, subject, client name, amount, and can be linked to a specific entity (e.g., a Policy ID or Claim ID).

**B. Approval Lifecycle**
- `PENDING → APPROVED` or `REJECTED`
- Each request gets a unique reference number (e.g., `APR-20260320-00001-F9A1B2`).

**C. "My Requests" View**
- Every user can see all the approval requests they have personally submitted and their current status.

**D. Manager Decision**
- Approvers can approve or reject requests with notes explaining their decision.
- All decisions are logged in the audit trail.

---

## 19. Reports Section

### What It Does
The Reports Section is the agency's **business intelligence centre.** It transforms the raw data in the system into meaningful insights about business performance, risk exposure, and regulatory compliance.

### Available Reports

**A. Executive Dashboard Report**
The main report with a broad overview, supporting date range and filters (by carrier, product type, client type, account officer, region):
- Total Clients, Policies, Active Policies, Premium Volume, Claims, Commissions.
- Claims Ratio (Total Claims ÷ Total Policies × 100%).
- Policy mix by insurance type (with percentages).
- 12-month trend data (new policies, renewals, cancellations, premium by month).
- Claims breakdown by status.
- Top 10 Carriers by policy count and premium.
- Lapsed/Expired policy count and "premium at risk."
- Client segments (Corporate vs. Individual).
- **Client Concentration Risk Alert**: Flags any client representing more than 30% of active premium.

**B. Production Report**
- Groups policies by broker, carrier, or insurance type.
- Shows policy count, premium amount, and cancellation count per group.
- Used for assessing team member performance and carrier relationships.

**C. Claims Report**
- Breakdown of claims by status with count and total amount for each status.

**D. Renewals Report**
- Shows policies due for renewal in a period, how many were renewed, and the renewal rate %.

**E. Financial Report**
- Revenue (premiums + commissions), total expenses, net income.
- Outstanding invoice count and total value.

**F. NIC Quarterly Return**
- Generates the quarterly statutory report required by the NIC:
  - Total premium volume, new policies, active policies.
  - Claims summary (count, amounts, claims ratio, settled count).
  - Commission summary (gross, NIC levy, net).
  - Total remittances sent to carriers.
  - Complaint summary (total registered, SLA breached count).

**G. NIC Premium Register**
- A detailed line-by-line report of every policy in a period, formatted for NIC submission.
- Includes: policy number, client, carrier, broker, dates, sum insured, premium, commission, and remittance status.

**H. NIC Claims Register**
- A detailed line-by-line report of every claim in a period, formatted for NIC submission.
- Highlights which claims have breached the 5-day or 30-day NIC deadlines.
- Includes follow-up activity counts.

**I. FIC Suspicious Transaction Report (STR)**
- Identifies transactions that must be reported to the Financial Intelligence Centre:
  - All **cash transactions of GHS 20,000 or more**.
  - All transactions from clients classified as HIGH or CRITICAL AML risk.
- Includes a summary count and totals for easy reporting to authorities.

---

## 20. Audit Logs Section

### What It Does
The Audit Logs Section provides a **complete, immutable record of every significant action** taken by any user within the system. It is the system's "black box" — it cannot be edited or deleted.

### What Is Logged
Every module writes to the audit log on every meaningful action. Examples:
- `client.created`, `client.updated`, `client.kyc.updated`, `client.aml.updated`
- `policy.created`, `policy.bound`, `policy.cancelled`, `policy.expired`, `policy.renewed`
- `claim.created`, `claim.acknowledged`, `claim.approved`, `claim.settled`
- `invoice.created`, `invoice.sent`, `invoice.cancelled`
- `commission.received`, `remittance.created`
- `user.updated`, `user.deactivated`, `login.success`, `login.failed`

### What Each Log Entry Contains
- **Tenant ID**: Which agency the action occurred in.
- **User ID**: Who performed the action.
- **Action**: What was done (e.g., `claim.approved`).
- **Entity**: What type of record was affected (e.g., "Claim").
- **Entity ID**: The ID of the specific record affected.
- **Before State**: A JSON snapshot of the data before the change.
- **After State**: A JSON snapshot of the data after the change.
- **Timestamp**: When the action happened.
- **IP Address / User Agent**: For login events, where the login came from.

### Filtering & Search
- Filter by action, user, entity type, entity ID, and date range.
- Search by action name or entity type.
- View the full audit history of a specific record (e.g., see every change ever made to a particular policy).

---

## 21. Notifications Section

### What It Does
The Notifications Section delivers **real-time, in-app alerts** to users about important events that require their attention, without them having to constantly check every module.

### Key Functionalities

**A. Real-Time Delivery**
- Notifications are pushed instantly to connected users via **WebSocket** connections (socket.io).
- When a user's browser is open, they see notifications appear in real-time without refreshing the page.

**B. Notification Types**
- SYSTEM, POLICY, CLAIM, COMPLIANCE, TASK, PAYMENT, RENEWAL, APPROVAL, etc.

**C. Priority Levels**
- LOW, MEDIUM, HIGH, CRITICAL — affecting how notifications are displayed (e.g., critical notifications may be shown more prominently).

**D. Unread Badge Count**
- The notification bell in the navigation bar shows a live count of unread notifications.

**E. Actions**
- **Mark as Read**: Mark individual notifications as read.
- **Mark All as Read**: Clear all notifications at once.
- **Archive**: Remove a notification from the active list without deleting it permanently.

**F. Filtering**
- Filter notifications by type and read/unread status.

---

## 22. Team & Departments Section

### What It Does
The Team and Departments section allows agency owners and administrators to **organise their human resources** — structuring the team into departments and managing user accounts and access.

### Team (Users) Sub-Section

**What It Does**: Manages all user accounts within the agency.

- View all team members with their roles, branch assignments, and active status.
- Search by name, email; filter by role, active status, or branch.
- **Invite New Members**: Send email invitations to new team members to join the agency.
- **Activate / Deactivate Users**: Deactivating a user immediately revokes all their active sessions (refresh tokens), forcing them off the system.
- **Role Updates**: Administrators can change a user's role (subject to the constraint that you can only assign roles at or below your own level).
- **Department Assignment**: Assign users to specific departments.
- **Soft Delete**: Permanently remove a user account (cannot delete yourself).

### Departments Sub-Section

**What It Does**: Organises the agency into named functional units.

- Create departments with: name, unique code, description, head (a team member), branch, and a colour for visual identification.
- View each department with its head's details and current member count.
- Departments **cannot be deleted if they have assigned members** — you must reassign those users to another department first.

---

## 23. Settings Section

### What It Does
The Settings Section allows users to **personalise their experience** and administrators to configure the agency's master profile.

### Sub-Sections

**A. Tenant / Agency Settings (Admin Only)**
- Update the agency's official name, address, phone, email.
- Upload/change the agency's official **logo**.
- Set the agency's **primary brand colour**.
- Update the NIC License number.

**B. User Profile Settings**
- Any user can update their own: first name, last name, phone number, and profile avatar.
- Upload a profile photo.

**C. Change Password**
- Securely change your account password.
- Requires entering the current password for verification.
- The new password must be different from the current one.
- After a successful password change, **all other active sessions are automatically revoked** (forcing logout on other devices).

**D. Email Preferences**
- Configure which types of email notifications the user wants to receive.

---

## 24. Integrations Section

### What It Does
The Integrations Section connects the IBMS to **external third-party services**, eliminating the need to manually transfer data between systems. It turns the IBMS from a standalone application into the centre of the broker's entire digital ecosystem.

### Authentication Model
- All Google integrations use **OAuth 2.0** — the broker connects their Google account once through a secure browser flow. The system stores their access tokens (and refreshes them automatically in the background) so the broker never has to re-authenticate.
- Credentials are stored encrypted in the database, isolated per agency (`tenantId`), so no agency can ever see another's credentials.

### Active Integrations

**A. Google Calendar**
- **Push (IBMS → Google)**: Policy renewal reminders, claim meetings, and client follow-up appointments are pushed from IBMS to the broker's Google Calendar. Brokers get native phone/desktop notifications for key dates.
- **Pull (Google → IBMS)**: Events from the broker's Google Calendar (from 30 days ago to 90 days ahead) are pulled into IBMS and automatically categorised (POLICY, CLAIM, MEETING, etc.) based on keywords in the event title.
- **Automatic Sync**: A background CRON job keeps the calendars in sync without manual intervention.

**B. Google Drive**
- When documents are uploaded to IBMS, they are **automatically mirrored to a structured folder system** in the broker's Google Drive.
- The system creates an `IBMS Documents` root folder, with sub-folders by document category.
- Provides immediate remote backup of all critical agency files.
- A bulk `mirrorDocuments` function can scan for any IBMS files not yet backed up and upload them in the background.

**C. Google Sheets**
- One-click export of live agency data to **beautifully formatted Google Spreadsheets**.
- Supported exports: Clients, Policies, Claims, Commissions, Invoices, Renewals.
- The system programmatically formats the spreadsheet: bold headers, background colours, and auto-resized columns — not just a raw data dump.

### Sync Management
- The Integrations Service maintains a **sync event log** for every integration run. If a Google Drive upload fails, the failure is logged so an administrator can investigate.
- A **"Sync Now"** button in the UI triggers an immediate manual sync, overriding the scheduled automatic sync.

### Roadmap (Coming Soon)
- **Paystack (Payments)**: Accept premium payments via MTN Mobile Money, Bank Cards, and Apple Pay directly within IBMS, with automated reconciliation.
- **WhatsApp Business (Communication)**: Automatically send renewal alerts and policy PDFs to clients via WhatsApp for significantly higher response rates than email.

---

## 🏁 Summary

The IBMS platform covers the **complete operational lifecycle** of an insurance brokerage:

| Layer | Modules |
|---|---|
| **Client Acquisition** | Leads, Quotes |
| **Policy Management** | Clients, Carriers, Policies, Renewals |
| **Claims & Complaints** | Claims, Complaints, Escalations |
| **Financial Control** | Finance (Invoices, Transactions, Commissions, Remittances, Expenses) |
| **Regulatory Compliance** | Compliance, Reports (NIC, FIC) |
| **Operations & Productivity** | Tasks, Calendar, Chat, Approvals, Documents |
| **Platform Intelligence** | Audit Logs, Notifications, Reports Dashboard |
| **Administration** | Team, Departments, Settings, Integrations |
| **Platform Governance** | Super Admin Panel |

> "IBMS is not just a policy management tool — it is a fully integrated, compliance-aware, AI-ready operational platform built to run a modern West African insurance brokerage end-to-end."

---
*Document generated: 2026-03-20 | IBMS Final Edition*

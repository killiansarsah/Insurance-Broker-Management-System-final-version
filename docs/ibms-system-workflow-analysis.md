# IBMS Insurance Broker System Workflow Analysis

Date: 2026-04-12
Scope: Backend codebase analysis (clients, policies, finance/payments, claims, renewals)

## Executive Summary

This analysis maps the implemented workflow in the backend and compares it with standard broker-system expectations.

- The architecture is strong: modular NestJS design, Prisma relational model, multi-tenant boundaries, role-based access, and audit logging.
- Core business lifecycle is present end-to-end: client -> policy -> payment/invoice -> claims -> renewal.
- Main gaps are around payment-confirmation rigor and policy-status/payment-status consistency.

---

## 1. Client Management

### How clients are created, stored, and updated

- Clients are stored in the `Client` model with tenant scoping and broker assignment.
- Creation validates minimum type-specific identity data, then creates a tenant-scoped client number and assigns the creating user as broker.
- Updates are partial and role-scoped.
- Deletion is soft delete (`deletedAt`), with active-policy guardrails.

### How client types (individual/company) are handled

- Types are enum-driven: `INDIVIDUAL`, `CORPORATE`.
- Creation enforces:
  - `CORPORATE` requires `companyName`
  - `INDIVIDUAL` requires `firstName` and `lastName`

### Key implementation behavior

- Agent-level visibility is limited to assigned clients.
- Inline next-of-kin and bank details can be created during client onboarding.
- Welcome email is sent when email exists.

---

## 2. Policy Management

### How policies are created and linked to clients

- Policies link to `clientId`, `carrierId`, optional `productId`, and `brokerId`.
- Creation validates:
  - date range integrity (`endDate > startDate`)
  - required detail blocks for Motor / Fire / Marine
- If product is not provided, service auto-selects or auto-creates a fallback product.

### Default status on creation (draft/pending/active)

- Schema default: `DRAFT`.
- Runtime service behavior: uses `dto.status || 'ACTIVE'`.

Result: There is a mismatch between schema default and actual service default behavior.

### How policy data is structured

Core fields include:

- `sumInsured`
- `premiumAmount`
- `commissionRate` / `commissionAmount`
- `carrierId`, `productId`, `clientId`, `brokerId`
- `premiumFrequency`
- `paymentStatus` (present in schema)
- Optional line-of-business detail tables (vehicle/property/marine)

---

## 3. Payment / Premium Handling

### How payments are recorded and linked to policies

- Payments are primarily captured as `Transaction` records (finance transactions module).
- Transactions can link to:
  - `clientId`
  - `policyId`
  - `invoiceId`
- If linked to invoice, invoice payment totals/status are updated.
- If `type='PREMIUM'` and linked to policy, next pending installment is marked paid.

### What conditions mark a payment as valid/confirmed

Current behavior:

- New transaction is directly created with `paymentStatus='PAID'`.
- No gateway-confirmation/reconciliation stage in this creation flow.

### How payments affect policy status

- Payments affect invoices and installments.
- I did not find direct policy status transitions driven by payment events.
- `Policy.paymentStatus` exists in schema but is not consistently driven by transaction events in the analyzed flow.

---

## 4. Policy Status Logic

### When and how a policy changes status

Manual transitions via policy endpoints/services:

- `DRAFT/COVER_NOTE -> ACTIVE` via bind
- `DRAFT -> COVER_NOTE` via cover note issue
- `ACTIVE -> CANCELLED` via cancel
- `ACTIVE -> LAPSED` via lapse
- `LAPSED -> ACTIVE` via reinstate
- `ACTIVE -> SUSPENDED` via suspend
- `SUSPENDED -> ACTIVE` via unsuspend

Automatic transitions:

- Daily cron marks `ACTIVE` policies past expiry date as `EXPIRED`.

### Automatic vs manual

- Mostly manual transition endpoints.
- Automatic expiry is implemented.
- Automatic non-payment lapse was not found.

### Conditions controlling transitions

- State-guard checks exist before each transition (for example, only active policies can be cancelled/lapsed/suspended).
- Role checks apply at controller + scoped service logic.

---

## 5. Claims Management

### How claims are created and linked to policies

- Claims are linked to policy and client.
- Claim creation requires policy to be `ACTIVE` or `EXPIRED`.
- Incident date must fall within policy inception/expiry window.
- Initial status is `INTIMATED`.

### How claim status changes

Transition map is explicit and validated in service:

- `INTIMATED -> REGISTERED`
- `REGISTERED -> UNDER_REVIEW` (or documents pending path)
- `UNDER_REVIEW -> APPROVED/REJECTED`
- `APPROVED -> SETTLED`
- `SETTLED -> CLOSED`
- `REJECTED -> UNDER_REVIEW` (reopen path)

### What triggers approval/payment

- Approval is manual and constrained:
  - only from `UNDER_REVIEW`
  - approved amount cannot exceed policy sum insured
- Settlement is manual and moves to `SETTLED`.
- On settlement, policy claim counters are incremented.

Note on terminology:

- Your requested labels include "paid".
- Current implementation uses `SETTLED` and then `CLOSED` (no separate claim status value named `PAID`).

---

## 6. Renewals

### How renewal is detected or triggered

- Upcoming renewals are queried by expiry windows.
- Scheduled reminder emails run via cron (90/60/30-day cadence and manual bulk flows).

### New policy vs existing policy update

- Renewal creates a **new** policy record.
- New record is set as:
  - `status='DRAFT'`
  - `isRenewal=true`
  - `previousPolicyId=<old policy>`
- Old policy gets `renewalStatus='RENEWED'`.

### Expiry and renewal flow

- Daily cron auto-expires overdue active policies.
- Renewal generation is manual (endpoint-triggered), producing draft renewal policy for subsequent binding.

---

## 7. Overall System Workflow (End-to-End)

1. Create client (individual/corporate validation, broker assignment)
2. Create policy linked to client/carrier/product
3. Bind policy when needed (or policy may already be active depending on create payload/default)
4. Raise invoice and/or collect premium transaction
5. Transaction updates invoice and installment states
6. Policy remains governed by explicit status actions plus expiry cron
7. If incident occurs, create claim and process through review/approval/settlement
8. As expiry nears, reminders are sent
9. Renew endpoint creates next-term draft policy linked to prior policy
10. New renewal policy is then finalized through standard policy flow

---

## Final Check Against Standard Insurance Broker Systems

## What aligns well

- Multi-tenant segregation
- Role-based scope controls
- Audit trail patterns
- Claim workflow controls and transition validation
- Renewal-as-new-policy strategy (common in broker operations)

## Missing logic / incorrect flows / risk points

1. Policy default mismatch
- Schema default is `DRAFT`, but creation service defaults to `ACTIVE` if status omitted.
- Risk: bypassing intended underwriting/bind checkpoints.

2. Payment confirmation rigor
- Transaction creation marks payment as `PAID` immediately.
- Risk: weak control if external payment confirmation/reconciliation is required.

3. Policy payment-state orchestration gap
- `Policy.paymentStatus` exists but is not consistently synchronized from invoices/installments/transactions.
- Risk: policy-level payment status can become stale or non-authoritative.

4. No automatic non-payment lapse found
- `ACTIVE -> LAPSED` appears manual.
- Risk: overdue/unpaid policies may remain active unless actioned.

5. Claim status naming mismatch with requested business wording
- System uses `SETTLED` rather than `PAID` in claim lifecycle.
- Not inherently wrong, but terminology consistency is important for users and reports.

6. Renewal completion continuity
- Renewal creates draft successor policy but does not auto-bind.
- This is acceptable but operationally depends on user discipline and follow-through.

---

## Practical Conclusion

Your system is close to a solid broker-core platform and already covers major lifecycle domains well. The biggest improvements needed are around payment-state authority, stricter activation controls, and stronger automation for non-payment status handling.

# Phase 7: Claims & Complaints

## What This Phase Builds
- Claims lifecycle with NIC regulatory deadlines (5-day acknowledgement, 30-day settlement)
- Claim documents (metadata)
- Complaints management with SLA tracking + escalation
- Escalation endpoints

## Prerequisites
- Phase 6 ✅ (Policies module)

## Prompt

Using the existing NestJS project at `ibms-backend/`:

### Part A: Claims Module (`src/claims/`)

1. **`POST /api/v1/claims`** — JWT required, `@Permissions('claims', 'create')`.
   - Body: `CreateClaimDto`:
     - Required: `policyId` (@IsUUID), `claimType` (@IsEnum: MOTOR_ACCIDENT/MOTOR_THEFT/PROPERTY_DAMAGE/PROPERTY_FIRE/PROPERTY_FLOOD/HEALTH_INPATIENT/HEALTH_OUTPATIENT/LIFE_DEATH/LIFE_DISABILITY/MARINE_CARGO/MARINE_HULL/TRAVEL/LIABILITY/OTHER), `description` (@IsString @MinLength(20)), `incidentDate` (@IsDateString)
     - Optional: `claimAmount` (Decimal), `location`, `policeReportNumber`, `hospitalName`, `notes`
   - Auto-generate: `claimNumber` = `CLM-{YYYYMMDD}-{5-digit-seq}`
   - Defaults: `status = REPORTED`, `reportedDate = now`
   - NIC deadline tracking: `nicDeadline5Day = now + 5 business days`, `nicDeadline30Day = now + 30 calendar days`
   - Validate: policy exists in tenant, policy status is ACTIVE or EXPIRED (within grace period)
   - Copy from policy: `clientId`, `carrierId`, `insuranceType`
   - Increment `client.claimCount`
   - Audit log: `claim.created`
   - Returns: `ClaimResponseDto`

2. **`GET /api/v1/claims`** — JWT required, `@Permissions('claims', 'view')`.
   - ALWAYS filter by tenantId
   - Paginated
   - Searchable: `search` → claimNumber, client name, policy number
   - Filterable: `status`, `claimType`, `carrierId`, `policyId`, `clientId`, `isOverdue` (boolean — past NIC deadline)
   - Date range: `reportedFrom`, `reportedTo`, `incidentFrom`, `incidentTo`
   - Sortable: `sortBy` (claimNumber, claimAmount, reportedDate, incidentDate, nicDeadline5Day), `sortOrder`
   - Include: client (name), policy (number), carrier (name)
   - Returns: paginated `ClaimSummaryDto[]` with totalCount, `overdueCount`, `totalClaimAmount`

3. **`GET /api/v1/claims/:id`** — JWT required, `@Permissions('claims', 'view')`.
   - Include: client, policy, carrier, claimDocuments, statusHistory (from audit log)
   - Returns: `ClaimDetailResponseDto`

4. **`PATCH /api/v1/claims/:id`** — JWT required, `@Permissions('claims', 'edit')`.
   - Can update: claimAmount, description, location, notes
   - Audit log: `claim.updated`

5. **Claim status transitions:**

   **`POST /api/v1/claims/:id/acknowledge`** — `@Permissions('claims', 'edit')`
   - REPORTED → ACKNOWLEDGED
   - Sets `acknowledgedDate = now`
   - Check: warn if past nicDeadline5Day (still allow, but flag isOverdue5Day = true)
   - Body: `AcknowledgeClaimDto` — `notes` (@IsOptional)
   - Audit log: `claim.acknowledged`

   **`POST /api/v1/claims/:id/investigate`** — `@Permissions('claims', 'edit')`
   - ACKNOWLEDGED → UNDER_INVESTIGATION
   - Body: `InvestigateClaimDto` — `assignedTo` (@IsUUID @IsOptional, user who'll investigate), `notes`
   - Audit log: `claim.investigation_started`

   **`POST /api/v1/claims/:id/approve`** — `@Permissions('claims', 'approve')`
   - UNDER_INVESTIGATION → APPROVED
   - Body: `ApproveClaimDto` — `approvedAmount` (Decimal, required), `notes`
   - Validate: `approvedAmount <= sumInsured` of the policy
   - Sets `approvedAmount`, `approvedDate = now`
   - Audit log: `claim.approved`

   **`POST /api/v1/claims/:id/reject`** — `@Permissions('claims', 'approve')`
   - UNDER_INVESTIGATION → REJECTED
   - Body: `RejectClaimDto` — `reason` (@IsString @MinLength(10)), `notes`
   - Sets `rejectedReason`, `rejectedDate = now`
   - Audit log: `claim.rejected`

   **`POST /api/v1/claims/:id/settle`** — `@Roles('ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER')`
   - APPROVED → SETTLED
   - Body: `SettleClaimDto` — `settledAmount` (Decimal), `paymentMethod`, `paymentReference`, `notes`
   - Sets `settledAmount`, `settledDate = now`
   - Check: warn if past nicDeadline30Day (flag isOverdue30Day = true)
   - Audit log: `claim.settled`

   **`POST /api/v1/claims/:id/reopen`** — `@Roles('ADMIN', 'TENANT_ADMIN')`
   - REJECTED → UNDER_INVESTIGATION (appeal)
   - Body: `ReopenClaimDto` — `reason`
   - Audit log: `claim.reopened`

6. **Claim Documents:**

   **`POST /api/v1/claims/:claimId/documents`** — `@Permissions('claims', 'edit')`
   - Body: `CreateClaimDocumentDto` — `name`, `type` (POLICE_REPORT/MEDICAL_REPORT/REPAIR_ESTIMATE/PHOTO/INVOICE/OTHER), `url` (for now, just store a URL string), `notes`
   - Audit log: `claim.document.added`

   **`GET /api/v1/claims/:claimId/documents`** — list claim docs

   **`DELETE /api/v1/claims/:claimId/documents/:id`** — `@Permissions('claims', 'delete')`

### Part B: Complaints Module (`src/complaints/`)

1. **`POST /api/v1/complaints`** — JWT required, `@Permissions('complaints', 'create')`.
   - Body: `CreateComplaintDto`:
     - Required: `clientId` (@IsUUID), `subject` (@IsString @MinLength(5)), `description` (@IsString @MinLength(20)), `category` (@IsEnum: SERVICE_DELAY/CLAIM_DISPUTE/PREMIUM_ISSUE/POLICY_ERROR/STAFF_CONDUCT/COMMUNICATION/OTHER), `priority` (@IsEnum: LOW/MEDIUM/HIGH/CRITICAL)
     - Optional: `policyId`, `claimId`, `preferredResolution`
   - Auto-generate: `complaintNumber` = `CMP-{YYYYMMDD}-{4-digit-seq}`
   - Defaults: `status = OPEN`
   - SLA calculation: LOW=10 days, MEDIUM=5 days, HIGH=3 days, CRITICAL=1 day — set `slaDeadline`
   - Audit log: `complaint.created`

2. **`GET /api/v1/complaints`** — JWT required, `@Permissions('complaints', 'view')`.
   - Paginated, filterable: `status`, `category`, `priority`, `isOverdue` (past SLA deadline), `assignedToId`
   - Sortable: by priority (CRITICAL first), createdAt, slaDeadline
   - Returns: `ComplaintSummaryDto[]` with overdueCount

3. **`GET /api/v1/complaints/:id`** — with full relations (client, policy, claim, assignedTo, audit trail)

4. **`PATCH /api/v1/complaints/:id`** — update fields (description, category, priority)

5. **Status transitions:**

   **`POST /api/v1/complaints/:id/assign`** — `@Permissions('complaints', 'edit')`
   - Body: `AssignComplaintDto` — `assignedToId` (@IsUUID)
   - OPEN → IN_PROGRESS
   - Audit log: `complaint.assigned`

   **`POST /api/v1/complaints/:id/escalate`** — `@Permissions('complaints', 'edit')`
   - IN_PROGRESS → ESCALATED
   - Body: `EscalateComplaintDto` — `reason`, `escalatedToId` (@IsUUID)
   - Priority auto-bumped one level (MEDIUM→HIGH, HIGH→CRITICAL)
   - SLA deadline recalculated
   - Audit log: `complaint.escalated`

   **`POST /api/v1/complaints/:id/resolve`** — `@Permissions('complaints', 'resolve')`
   - IN_PROGRESS or ESCALATED → RESOLVED
   - Body: `ResolveComplaintDto` — `resolution` (@IsString @MinLength(10)), `resolutionCategory` (@IsEnum: POLICY_CORRECTED/REFUND_ISSUED/CLAIM_REPROCESSED/APOLOGY_SENT/PROCESS_CHANGED/NO_ACTION_REQUIRED)
   - Sets: `resolvedAt = now`, `resolvedById` from JWT
   - Calculate: `resolutionTime = resolvedAt - createdAt` (in hours)
   - Audit log: `complaint.resolved`

   **`POST /api/v1/complaints/:id/reopen`** — `@Permissions('complaints', 'edit')`
   - RESOLVED → IN_PROGRESS (client not satisfied)
   - Body: `reason`
   - Audit log: `complaint.reopened`

   **`POST /api/v1/complaints/:id/close`** — `@Roles('ADMIN', 'TENANT_ADMIN')`
   - RESOLVED → CLOSED (final)
   - Audit log: `complaint.closed`

### Part C: Escalations Endpoint

**`GET /api/v1/escalations`** — JWT required, `@Permissions('complaints', 'view')`.
- Returns combined view of:
  - Overdue claims (past NIC 5-day or 30-day deadlines)
  - Escalated complaints
  - High/Critical priority open complaints near SLA deadline
- Sorted by urgency (most urgent first)
- Returns: `EscalationItemDto[]` — { type: 'CLAIM'|'COMPLAINT', id, reference, subject, deadline, overdueByHours, priority }

## Verification Checklist
- [ ] `npm run build` — zero errors
- [ ] Create claim for active policy → claimNumber generated, NIC deadlines set
- [ ] `GET /api/v1/claims?isOverdue=true` → correctly identifies overdue claims
- [ ] Acknowledge within 5 days → isOverdue5Day = false
- [ ] Full lifecycle: REPORTED → ACKNOWLEDGED → UNDER_INVESTIGATION → APPROVED → SETTLED
- [ ] Reject claim with reason → correct status + audit
- [ ] Reopen rejected claim → back to UNDER_INVESTIGATION
- [ ] Try to create claim for policy in different tenant → 404
- [ ] Create complaint with CRITICAL priority → SLA deadline = 1 day
- [ ] Assign → escalate → resolve workflow works
- [ ] Escalation bumps priority: MEDIUM → HIGH
- [ ] `GET /api/v1/escalations` → shows combined overdue items
- [ ] Complaint resolution time calculated correctly
- [ ] Tenant isolation on all endpoints
- [ ] No `console.log`, no `any` types

After all checks pass, update `CHECKPOINT.md`: mark Phase 7 `[x]`.

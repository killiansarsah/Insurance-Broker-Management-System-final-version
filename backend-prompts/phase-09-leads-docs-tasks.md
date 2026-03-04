# Phase 9: Leads, Documents, Tasks, Calendar, Approvals, Notifications

## What This Phase Builds
- Leads (Kanban pipeline: PROSPECT → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → WON → LOST)
- Documents (file metadata + URL storage, categorized)
- Tasks (assignment, priority, due dates)
- Calendar events (meetings, reminders, follow-ups)
- Approval workflow (generic, usable by endorsements/expenses/etc.)
- Notifications (in-app, stored in DB)

## Prerequisites
- Phase 6 ✅ (Policies — for approvals linking)
- Phase 8 ✅ (Finance — expenses use approvals)

## Prompt

Using the existing NestJS project at `ibms-backend/`:

### Part A: Leads Module (`src/leads/`)

1. **`POST /api/v1/leads`** — JWT required, `@Permissions('leads', 'create')`.
   - Body: `CreateLeadDto`:
     - Required: `firstName`, `lastName`, `email` (@IsEmail), `phone`, `source` (@IsEnum: REFERRAL/WALK_IN/ONLINE/COLD_CALL/SOCIAL_MEDIA/EVENT/PARTNER)
     - Optional: `companyName`, `insuranceType` (@IsEnum), `estimatedPremium` (Decimal), `notes`, `assignedToId` (@IsUUID)
   - Defaults: `status = PROSPECT`, `stage = PROSPECT`
   - Auto-set: `tenantId`, `createdById`
   - Audit log: `lead.created`

2. **`GET /api/v1/leads`** — paginated, filterable: stage, source, assignedToId, insuranceType, dateRange
   - Returns with `stageCounts`: { PROSPECT: n, CONTACTED: n, QUALIFIED: n, PROPOSAL: n, NEGOTIATION: n, WON: n, LOST: n }

3. **`GET /api/v1/leads/kanban`** — returns leads grouped by stage for Kanban view
   - Structure: `{ [stage]: LeadSummaryDto[] }`

4. **`GET /api/v1/leads/:id`** — full detail with assignedTo user, activities (from audit log)

5. **`PATCH /api/v1/leads/:id`** — update lead fields

6. **`PATCH /api/v1/leads/:id/stage`** — `@Permissions('leads', 'edit')`
   - Body: `UpdateLeadStageDto` — `stage` (@IsEnum), `notes` (@IsOptional)
   - Validates: forward or backward movement allowed
   - If WON: prompt conversion to client (optional `convertToClient: boolean`)
   - If `convertToClient = true`: create Client from lead data, link leadId → clientId
   - Audit log: `lead.stage.changed` with oldStage → newStage

7. **`POST /api/v1/leads/:id/convert`** — `@Permissions('leads', 'edit')`
   - Explicitly convert lead to client
   - Creates Client record, copies: firstName, lastName, email, phone, companyName, source
   - Updates lead: status = CONVERTED, convertedClientId = new client ID
   - Audit log: `lead.converted`

### Part B: Documents Module (`src/documents/`)

1. **`POST /api/v1/documents`** — JWT required, `@Permissions('documents', 'upload')`.
   - Body: `CreateDocumentDto`:
     - Required: `name` (@IsString), `type` (@IsEnum: POLICY/CLAIM/INVOICE/RECEIPT/KYC/CONTRACT/REPORT/CORRESPONDENCE/OTHER), `fileUrl` (@IsUrl — for now, store URL; file upload in future phase), `fileSize` (@IsInt), `mimeType` (@IsString)
     - Optional: `clientId`, `policyId`, `claimId`, `category`, `tags` (string[]), `expiryDate`, `notes`
   - Auto-generate: `documentNumber` = `DOC-{YYYYMMDD}-{5-digit-seq}`
   - Auto-set: `uploadedById` from JWT
   - Audit log: `document.uploaded`

2. **`GET /api/v1/documents`** — paginated, filterable: type, clientId, policyId, claimId, tags, dateRange, search (name)
   - Returns summary: `totalDocuments`, `byType` counts

3. **`GET /api/v1/documents/:id`** — full detail

4. **`PATCH /api/v1/documents/:id`** — update name, tags, notes, category
   - Audit log: `document.updated`

5. **`DELETE /api/v1/documents/:id`** — `@Permissions('documents', 'delete')`
   - Soft delete
   - Audit log: `document.deleted`

### Part C: Tasks Module (`src/tasks/`)

1. **`POST /api/v1/tasks`** — JWT required.
   - Body: `CreateTaskDto`:
     - Required: `title` (@IsString @MinLength(3)), `priority` (@IsEnum: LOW/MEDIUM/HIGH/URGENT)
     - Optional: `description`, `dueDate` (@IsDateString), `assignedToId` (@IsUUID), `clientId`, `policyId`, `claimId`, `category` (@IsEnum: FOLLOW_UP/RENEWAL/CLAIM_REVIEW/DOCUMENTATION/COMPLIANCE/MEETING/OTHER)
   - Defaults: `status = TODO`, `createdById` from JWT
   - If no `assignedToId` → assigned to self
   - Audit log: `task.created`

2. **`GET /api/v1/tasks`** — paginated, filterable: status (TODO/IN_PROGRESS/DONE/CANCELLED), priority, assignedToId, dueDate range, category, `overdue` (boolean)
   - Default sort: priority DESC, dueDate ASC

3. **`GET /api/v1/tasks/my`** — shortcut: tasks assigned to current JWT user

4. **`GET /api/v1/tasks/:id`** — full detail

5. **`PATCH /api/v1/tasks/:id`** — update title, description, priority, dueDate, assignedToId
   - Audit log if assignee changed: `task.reassigned`

6. **`PATCH /api/v1/tasks/:id/status`** — `UpdateTaskStatusDto` — `status`
   - TODO → IN_PROGRESS → DONE
   - Any → CANCELLED
   - If DONE: set `completedAt = now`
   - Audit log: `task.status.changed`

### Part D: Calendar Module (`src/calendar/`)

1. **`POST /api/v1/calendar/events`** — JWT required.
   - Body: `CreateCalendarEventDto`:
     - Required: `title` (@IsString), `startTime` (@IsDateString), `endTime` (@IsDateString), `type` (@IsEnum: MEETING/FOLLOW_UP/REMINDER/RENEWAL/SITE_VISIT/TRAINING/OTHER)
     - Optional: `description`, `location`, `isAllDay` (boolean), `clientId`, `policyId`, `attendeeIds` (@IsUUID[] @IsOptional), `color` (@IsString @IsOptional), `recurrence` (@IsEnum: NONE/DAILY/WEEKLY/MONTHLY/YEARLY, default NONE)
   - Validate: `endTime > startTime`
   - If attendeeIds: create CalendarAttendee records for each
   - Auto-add creator as attendee (status = ACCEPTED)
   - Audit log: `event.created`

2. **`GET /api/v1/calendar/events`** — JWT required.
   - Required: `from` and `to` date params (max range: 90 days)
   - Returns events where current user is creator OR attendee
   - Include attendee names and statuses

3. **`GET /api/v1/calendar/events/:id`** — full detail with attendees

4. **`PATCH /api/v1/calendar/events/:id`** — update (only creator can edit)

5. **`DELETE /api/v1/calendar/events/:id`** — soft delete (only creator)

6. **`POST /api/v1/calendar/events/:id/rsvp`** — any invited user
   - Body: `RsvpDto` — `status` (@IsEnum: ACCEPTED/DECLINED/TENTATIVE)

### Part E: Approvals Module (`src/approvals/`)

1. **`POST /api/v1/approvals`** — internal use (called by other modules, not direct API).
   - Creates approval request: `entityType` (ENDORSEMENT/EXPENSE/CLAIM/POLICY_CANCELLATION), `entityId`, `requestedById`, `description`
   - Auto-assign approvers based on entity type + amount thresholds (configurable per tenant)
   - Status: PENDING

2. **`GET /api/v1/approvals`** — lists approvals for current user (as approver)
   - Filterable: `status` (PENDING/APPROVED/REJECTED), `entityType`

3. **`GET /api/v1/approvals/my-requests`** — approvals I've requested

4. **`POST /api/v1/approvals/:id/approve`** — `@Permissions('approvals', 'approve')`
   - Body: `ApprovalDecisionDto` — `notes`
   - Triggers callback on original entity (e.g., endorsement → approved)
   - Audit log: `approval.approved`

5. **`POST /api/v1/approvals/:id/reject`** — `@Permissions('approvals', 'approve')`
   - Body: `ApprovalDecisionDto` — `notes`, `reason`
   - Triggers callback on original entity
   - Audit log: `approval.rejected`

### Part F: Notifications Module (`src/notifications/`)

1. **`POST /api/v1/notifications`** — internal only (not exposed as public API). Called by other modules.
   - Creates notification: `userId`, `title`, `message`, `type` (@IsEnum: SYSTEM/TASK/APPROVAL/CLAIM/POLICY/RENEWAL/PAYMENT/REMINDER), `link` (frontend URL to navigate to), `metadata` (Json)

2. **`GET /api/v1/notifications`** — JWT required.
   - Lists notifications for current user
   - Paginated, filterable: `isRead` (boolean), `type`
   - Sorted: unread first, then by createdAt DESC

3. **`GET /api/v1/notifications/unread-count`** — returns `{ count: number }`

4. **`PATCH /api/v1/notifications/:id/read`** — mark single notification as read

5. **`POST /api/v1/notifications/mark-all-read`** — marks all as read for current user

6. **`DELETE /api/v1/notifications/:id`** — soft delete (hide from user)

7. **Integration points:** After building this module, add notification calls to:
   - Invitation sent → notify inviter on acceptance
   - Claim status change → notify assignee
   - Task assigned → notify assignee
   - Approval request → notify approver
   - Policy expiring within 30 days → notify assigned broker
   - Invoice overdue → notify finance users

## Verification Checklist
- [ ] `npm run build` — zero errors
- [ ] Create lead → stage PROSPECT, shown in kanban
- [ ] Move lead through pipeline: PROSPECT → CONTACTED → QUALIFIED → PROPOSAL → WON
- [ ] Convert lead to client → Client record created, lead marked CONVERTED
- [ ] `GET /api/v1/leads/kanban` → grouped by stage correctly
- [ ] Upload document linked to policy → success
- [ ] Filter documents `?type=POLICY&policyId=xxx` → correct results
- [ ] Create task with due date → shown in `GET /api/v1/tasks/my`
- [ ] Mark task DONE → `completedAt` set
- [ ] Overdue tasks filter works
- [ ] Create calendar event with 2 attendees → both see it in their calendar
- [ ] RSVP as DECLINED → correct status
- [ ] Create approval request → approver sees it in `GET /api/v1/approvals`
- [ ] Approve → original entity updated
- [ ] `GET /api/v1/notifications` → shows recent notifications
- [ ] `GET /api/v1/notifications/unread-count` → correct count
- [ ] Mark all read → count = 0
- [ ] Tenant isolation on all endpoints
- [ ] No `console.log`, no `any` types

After all checks pass, update `CHECKPOINT.md`: mark Phase 9 `[x]`.

# Phase 10: Chat, Reports, Compliance, Audit, Departments, Settings

## What This Phase Builds
- Real-time chat (WebSocket via Socket.io)
- Reports & analytics (dashboard aggregations, chart data)
- Compliance (KYC queue, AML screening)
- Audit log (read-only API)
- Departments management
- Tenant settings

## Prerequisites
- Phase 9 ✅ (All core modules exist)

## Prompt

Using the existing NestJS project at `ibms-backend/`:

### Part A: Chat Module (`src/chat/`)

Use `@nestjs/websockets` with Socket.io adapter (`@nestjs/platform-socket.io`).

1. **REST endpoints:**

   **`POST /api/v1/chat/rooms`** — JWT required.
   - Body: `CreateChatRoomDto`:
     - `type` (@IsEnum: DIRECT/GROUP/CHANNEL), `name` (@IsString, required for GROUP/CHANNEL), `participantIds` (@IsUUID[])
   - For DIRECT: exactly 2 participants (creator + one other). Check no existing DIRECT room between same pair.
   - Auto-add creator as participant (role = ADMIN for GROUP, MEMBER for DIRECT)
   - Returns: `ChatRoomResponseDto`

   **`GET /api/v1/chat/rooms`** — JWT required.
   - Lists rooms where current user is participant
   - Returns: room info + lastMessage preview + unreadCount per room

   **`GET /api/v1/chat/rooms/:id/messages`** — JWT required.
   - Paginated (cursor-based: `before` message ID, `limit` default 50)
   - Only if current user is participant
   - Returns: `ChatMessageDto[]`

   **`POST /api/v1/chat/rooms/:id/participants`** — only room admin
   - Add participant to GROUP/CHANNEL

   **`DELETE /api/v1/chat/rooms/:id/participants/:userId`** — only room admin or self (leave)

2. **WebSocket Gateway (`ChatGateway`):**

   Namespace: `/chat`

   Authentication: Extract JWT from `handshake.auth.token` or `handshake.headers.authorization`. Validate JWT in `handleConnection`. Reject if invalid/expired. Store `userId` and `tenantId` on socket.

   Events (client → server):
   - `join_room` — { roomId } → join Socket.io room, send back recent messages
   - `send_message` — { roomId, content, type?: 'TEXT'|'IMAGE'|'FILE' } → save to DB, broadcast to room, update lastMessage
   - `typing` — { roomId, isTyping } → broadcast to room (exclude sender)
   - `mark_read` — { roomId, messageId } → update read receipt

   Events (server → client):
   - `new_message` — broadcast to room members
   - `user_typing` — broadcast typing indicator
   - `message_read` — broadcast read receipt
   - `user_online` / `user_offline` — track presence

   **Messages saved to DB:** ChatMessage model with senderId, roomId, content, type, createdAt, readBy (Json array of { userId, readAt })

   **Presence:** Track connected socket IDs per user. On connect → emit `user_online`. On disconnect (all sockets for user) → emit `user_offline`.

### Part B: Reports Module (`src/reports/`)

1. **`GET /api/v1/reports/dashboard`** — JWT required, `@Permissions('reports', 'view')`.
   Returns comprehensive dashboard data:
   ```json
   {
     "overview": {
       "totalClients": "number",
       "totalPolicies": "number",
       "activePolicies": "number",
       "totalPremium": "Decimal",
       "totalClaims": "number",
       "openClaims": "number",
       "claimsRatio": "Decimal (percentage)",
       "totalCommissions": "Decimal"
     },
     "policyMix": [{ "insuranceType": "string", "count": "number", "premium": "Decimal", "percentage": "Decimal" }],
     "monthlyTrend": [{ "month": "2025-01", "newPolicies": "number", "renewals": "number", "cancellations": "number", "premium": "Decimal" }],
     "claimsOverview": {
       "reported": "number",
       "acknowledged": "number",
       "investigating": "number",
       "approved": "number",
       "settled": "number",
       "rejected": "number",
       "totalClaimAmount": "Decimal",
       "totalSettledAmount": "Decimal",
       "averageSettlementDays": "number",
       "overdueNIC": "number"
     },
     "topCarriers": [{ "name": "string", "policyCount": "number", "premium": "Decimal" }],
     "recentActivity": [{ "type": "string", "description": "string", "timestamp": "DateTime", "userId": "string", "userName": "string" }]
   }
   ```
   - Date range filter: `from`, `to` (default: current month)
   - Redis cache: 5 minutes TTL, invalidated on data changes

2. **`GET /api/v1/reports/production`** — production report
   - Breakdown by: broker/agent (userId), carrier, insurance type, branch
   - Columns: policyCount, premiumAmount, commissionAmount, cancelledCount, lossRatio
   - Date range required

3. **`GET /api/v1/reports/claims`** — claims report
   - Breakdown by: carrier, insurance type, claim type, status
   - Columns: count, totalClaimed, totalApproved, totalSettled, averageDays, overdueCount
   - Date range required

4. **`GET /api/v1/reports/renewals`** — renewal performance
   - Breakdown by: month, carrier, broker
   - Columns: dueCount, renewedCount, declinedCount, renewalRate (percentage)

5. **`GET /api/v1/reports/financial`** — financial summary
   - Revenue: premium collected, commissions earned
   - Expenses: by category
   - Net income
   - Cash flow: monthly inflow vs outflow
   - Outstanding: unpaid invoices, pending commissions

6. **`GET /api/v1/reports/compliance`** — NIC compliance
   - Overdue claims (5-day, 30-day)
   - KYC status breakdown
   - AML screening status
   - Complaint SLA compliance

### Part C: Compliance Module (`src/compliance/`)

1. **`GET /api/v1/compliance/kyc-queue`** — `@Roles('ADMIN', 'TENANT_ADMIN', 'COMPLIANCE_OFFICER')`
   - Lists clients with KYC status PENDING or EXPIRED
   - Sorted by client creation date (oldest first)
   - Shows: clientName, ghanaCardNumber, status, daysPending

2. **`GET /api/v1/compliance/aml-screening`** — `@Roles('ADMIN', 'TENANT_ADMIN', 'COMPLIANCE_OFFICER')`
   - Lists clients with AML status NOT_SCREENED or FLAGGED
   - Shows: clientName, status, activePolicies, totalPremium, flagReason

3. **`GET /api/v1/compliance/nic-deadlines`** — `@Permissions('claims', 'view')`
   - Lists claims approaching or past NIC deadlines
   - Columns: claimNumber, type, deadline5Day (date + status), deadline30Day (date + status), daysOverdue

4. **`GET /api/v1/compliance/summary`** — dashboard widget data
   - KYC: pending, verified, rejected, expired counts
   - AML: not_screened, clear, flagged, blocked counts
   - NIC: on_track, at_risk (within 2 days of deadline), overdue counts
   - Complaint SLA: within_sla, at_risk, breached counts

### Part D: Audit Log (`src/audit/`)

1. **`GET /api/v1/audit`** — JWT required, `@Roles('ADMIN', 'TENANT_ADMIN')`.
   - READ-ONLY. No create/update/delete endpoints exposed.
   - Paginated
   - Filterable: `action` (string, e.g. "claim.created"), `userId`, `entityType`, `entityId`, `dateRange`
   - Searchable: `search` → action, description
   - Returns: `AuditLogDto[]` — id, action, entityType, entityId, userId, userName, description, metadata (Json), ipAddress, userAgent, createdAt

2. **`GET /api/v1/audit/entity/:entityType/:entityId`** — history for specific entity
   - E.g., `GET /api/v1/audit/entity/policy/uuid-here` → all audit entries for that policy

### Part E: Departments Module (`src/departments/`)

1. **`POST /api/v1/departments`** — `@Roles('TENANT_ADMIN')`.
   - Body: `CreateDepartmentDto` — `name`, `description`, `headId` (@IsUUID @IsOptional, must be user in tenant)
   - Audit log: `department.created`

2. **`GET /api/v1/departments`** — JWT required. With head user info and member count.

3. **`PATCH /api/v1/departments/:id`** — `@Roles('TENANT_ADMIN')`

4. **`DELETE /api/v1/departments/:id`** — `@Roles('TENANT_ADMIN')`. Only if no users assigned.

### Part F: Settings Module (`src/settings/`)

1. **`GET /api/v1/settings`** — JWT required. Returns current tenant settings:
   - Company info: name, logo, address, phone, email, website, registration numbers
   - Preferences: currency (default GHS), dateFormat, timezone (default Africa/Accra), language
   - Business rules: commission default rate, approval thresholds, password policy, session timeout
   - Notification preferences: email enabled, sms enabled, in-app enabled

2. **`PATCH /api/v1/settings`** — `@Roles('TENANT_ADMIN')`.
   - Update any settings. Stored in tenant record or a separate TenantSettings model.
   - Audit log: `settings.updated`

3. **`GET /api/v1/settings/profile`** — current user profile
4. **`PATCH /api/v1/settings/profile`** — update own profile (firstName, lastName, phone, avatarUrl)
5. **`POST /api/v1/settings/change-password`** — change own password
   - Body: `ChangePasswordDto` — `currentPassword`, `newPassword` (validates complexity)
   - Verify current password with bcrypt
   - Hash new password
   - Revoke all other refresh tokens (force re-login on other devices)
   - Audit log: `user.password.changed`

## Verification Checklist
- [ ] `npm run build` — zero errors
- [ ] Create DIRECT chat room between 2 users → success
- [ ] Create GROUP room → success
- [ ] WebSocket connect with JWT → authenticated
- [ ] WebSocket connect with invalid JWT → disconnected
- [ ] Send message via WebSocket → saved to DB, broadcast to room
- [ ] Typing indicator broadcasts to other participants
- [ ] `GET /api/v1/chat/rooms` → shows unreadCount
- [ ] `GET /api/v1/reports/dashboard` → all aggregations correct
- [ ] Dashboard data cached in Redis (second call faster)
- [ ] Production report breakdown by carrier → correct numbers
- [ ] KYC queue shows PENDING clients sorted by age
- [ ] AML screening shows NOT_SCREENED clients
- [ ] NIC deadline report shows overdue claims
- [ ] `GET /api/v1/audit` → shows all recorded actions
- [ ] `GET /api/v1/audit/entity/policy/:id` → shows policy history
- [ ] Create department → success
- [ ] Delete department with users → error
- [ ] `GET /api/v1/settings` → returns tenant settings
- [ ] Change password with wrong current → error
- [ ] Change password → all other sessions revoked
- [ ] Tenant isolation on all endpoints
- [ ] No `console.log`, no `any` types

After all checks pass, update `CHECKPOINT.md`: mark Phase 10 `[x]`.

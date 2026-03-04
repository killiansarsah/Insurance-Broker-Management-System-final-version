# Phase 4: Invitation System & User Management

## What This Phase Builds
- Send email invitations with secure tokens (48h expiry)
- Accept invite → create account → auto-login
- Validate/revoke invitations
- User CRUD (list, update, deactivate, soft-delete)
- Role enforcement (cannot escalate above own role)

## Prerequisites
- Phase 3 ✅ (Auth module with JWT + guards)

## Prompt

Using the existing NestJS project at `ibms-backend/`:

1. **`src/invitations/` module:**

   **`POST /api/v1/invitations`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Body: `CreateInvitationDto` — `email` (@IsEmail), `role` (@IsEnum(UserRole)), `branchId` (@IsUUID @IsOptional)
   - Validates: email not already a user in this tenant, no PENDING invitation for this email in this tenant
   - Invited role must NOT be higher than inviter's role in hierarchy
   - Generate token: `crypto.randomBytes(32).toString('hex')`
   - Store invitation with `expiresAt = now + 48 hours`
   - Log invite URL to server: `${FRONTEND_URL}/accept-invite?token=${token}`
   - Audit log: `invitation.sent`
   - Returns: `InvitationResponseDto`

   **`GET /api/v1/invitations`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Lists all invitations for current tenant (from JWT tenantId)
   - Paginated (page, limit from PaginationDto)
   - Filterable by `status` query param (PENDING/ACCEPTED/EXPIRED/REVOKED)
   - Auto-expire: before returning results, update any PENDING invitations past `expiresAt` to EXPIRED
   - Returns: paginated `InvitationResponseDto[]`

   **`DELETE /api/v1/invitations/:id`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Find invitation by ID AND tenantId (from JWT)
   - Must be PENDING status
   - Set status = REVOKED
   - Audit log: `invitation.revoked`

   **`GET /api/v1/invitations/validate/:token`** — `@Public()`
   - Find invitation by token
   - Check: exists? expired? already accepted/revoked?
   - If valid: return `{ valid: true, email, tenantName, role }`
   - If invalid: return `{ valid: false, reason: "expired" | "already_used" | "revoked" | "not_found" }`

   **`POST /api/v1/invitations/accept`** — `@Public()`
   - Body: `AcceptInvitationDto` — `token` (@IsString @MinLength(32)), `firstName` (@IsString @MinLength(1)), `lastName` (@IsString @MinLength(1)), `password` (@IsString @MinLength(8) @Matches complexity regex)
   - Validate token (same checks as validate endpoint)
   - Create user: email from invitation, role from invitation, tenantId from invitation, branchId from invitation, hash password with bcrypt cost 12
   - Mark invitation: status = ACCEPTED, acceptedAt = now
   - Issue JWT access token + refresh token cookie (same as login flow)
   - Audit log: `invitation.accepted`, `user.created`
   - Returns: `AuthResponseDto` (accessToken + user)

2. **`src/users/` module:**

   **`GET /api/v1/users`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Lists users for current tenant. ALWAYS filters by tenantId from JWT.
   - Paginated (PaginationDto)
   - Searchable: `search` query param matches firstName, lastName, email
   - Filterable: `role`, `isActive`, `branchId` query params
   - Excludes soft-deleted users (deletedAt IS NULL)
   - Returns: paginated `UserResponseDto[]` (NEVER includes passwordHash)

   **`GET /api/v1/users/:id`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')` OR requesting own profile.
   - Find by ID AND tenantId
   - Returns: `UserResponseDto`

   **`PATCH /api/v1/users/:id`** — JWT required.
   - Self: can update firstName, lastName, phone, avatarUrl
   - Admin+: can also update role, branchId, isActive
   - Cannot change role to one higher than own role
   - Cannot deactivate yourself
   - Audit log: `user.updated` with before/after
   - Returns: `UserResponseDto`

   **`POST /api/v1/users/:id/deactivate`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Set isActive = false
   - Cannot deactivate yourself
   - Revoke all refresh tokens for this user
   - Audit log: `user.deactivated`

   **`POST /api/v1/users/:id/reactivate`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Set isActive = true
   - Audit log: `user.reactivated`

   **`DELETE /api/v1/users/:id`** — JWT required, `@Roles('TENANT_ADMIN', 'ADMIN')`.
   - Soft delete: set deletedAt = now
   - Cannot delete yourself
   - Revoke all refresh tokens
   - Audit log: `user.deleted`

3. **DTOs with full class-validator** for every endpoint. Separate Create/Update/Response DTOs.

4. **`InvitationResponseDto`**: id, email, role, status, branchId, invitedByName, expiresAt, acceptedAt, createdAt
   — NEVER includes the token

## Verification Checklist
- [ ] `npm run build` — zero errors
- [ ] Log in as SIC admin → `POST /api/v1/invitations` with email `test@example.com`, role `BROKER` → invitation created, URL in server console
- [ ] `GET /api/v1/invitations` → shows the pending invitation
- [ ] `GET /api/v1/invitations/validate/:token` → `{ valid: true, email: "test@example.com", tenantName: "SIC Insurance", role: "BROKER" }`
- [ ] `POST /api/v1/invitations/accept` with name + password → user created, JWT returned
- [ ] `GET /api/v1/auth/me` with new JWT → shows new user as BROKER in SIC tenant
- [ ] Reuse same token → error (already accepted)
- [ ] Wait or manually expire a token → validate returns `{ valid: false, reason: "expired" }`
- [ ] SIC admin `GET /api/v1/users` → sees SIC users only (not Enterprise users)
- [ ] Enterprise admin `GET /api/v1/invitations` → sees Enterprise invitations only (tenant isolation)
- [ ] Broker tries `POST /api/v1/invitations` → 403 (insufficient role)
- [ ] Admin tries to invite as SUPER_ADMIN → 403 (cannot escalate above own role)
- [ ] Admin tries to delete themselves → 400 (cannot delete self)
- [ ] `DELETE /api/v1/invitations/:id` → status set to REVOKED
- [ ] Validate revoked token → `{ valid: false, reason: "revoked" }`
- [ ] No `console.log`, no `any` types, no hardcoded secrets

After all checks pass, update `CHECKPOINT.md`: mark Phase 4 `[x]` and append results to Verification Log.

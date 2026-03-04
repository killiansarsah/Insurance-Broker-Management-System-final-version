# Phase 3: Auth Module (Login, JWT, Password Reset)

## What This Phase Builds
- JWT authentication with RS256 (asymmetric keys)
- Login with tenant resolution (subdomain/slug)
- Refresh token rotation (HttpOnly cookies)
- Account lockout after failed attempts
- Password forgot/reset flow
- JwtAuthGuard (full implementation)
- RolesGuard with hierarchy
- Tenant context injection

## Prerequisites
- Phase 1 ✅ (NestJS scaffold)
- Phase 2 ✅ (Database schema + seed data)

## Prompt

Using the existing NestJS project at `ibms-backend/`:

1. **`src/auth/auth.module.ts`** — imports PassportModule, JwtModule (RS256, reads private key from file path in env), PrismaModule, ConfigModule, TenantsModule

2. **`src/auth/strategies/jwt.strategy.ts`** — Passport JWT strategy:
   - Reads RS256 public key from file path (`JWT_ACCESS_PUBLIC_KEY_PATH`)
   - Algorithm: RS256
   - Extracts token from Authorization Bearer header
   - Validates payload: checks user exists in DB, is active, not soft-deleted, not locked
   - Returns `{ userId: payload.sub, tenantId: payload.tenantId, role: payload.role }`

3. **Implement `src/common/guards/jwt-auth.guard.ts`** (replace placeholder from Phase 1):
   - Extends `AuthGuard('jwt')`
   - Checks for `@Public()` metadata — if present, skip validation
   - On auth failure, return `401 Unauthorized` (generic message)

4. **Implement `src/common/guards/roles.guard.ts`** (replace placeholder from Phase 1):
   - Reads `@Roles()` metadata
   - Uses role hierarchy: `platform_super_admin(8) > super_admin(7) > tenant_admin(6) = admin(6) > branch_manager(5) > senior_broker(4) > broker(3) > secretary(2) = data_entry(2) > viewer(1)`
   - User with higher hierarchy level automatically passes lower-level checks
   - If no `@Roles()` on endpoint, allow all authenticated users

5. **`src/auth/auth.service.ts`:**

   **`login(email, password, tenantSlug)`:**
   - Resolve tenant by slug → fail if not found or inactive
   - Find user by `(tenantId, email)` where `deletedAt IS NULL`
   - Check `lockedUntil` — if locked and not expired, return 423 with remaining time
   - Compare password with bcrypt
   - On FAILURE: increment `failedAttempts`, if >= 5 set `lockedUntil` = now + 30 minutes, audit log `login.failed`
   - On SUCCESS: reset `failedAttempts` to 0, clear `lockedUntil`, update `lastLoginAt`, audit log `login.success`
   - Issue access token + refresh token
   - Return `{ accessToken, user: UserResponseDto }`

   **`issueAccessToken(user)`:**
   - Read private key from file
   - Sign JWT with RS256, payload: `{ sub: user.id, tenantId: user.tenantId, role: user.role }`
   - Expiry from env `JWT_ACCESS_EXPIRY` (default 15m)

   **`issueRefreshToken(userId, ipAddress, userAgent)`:**
   - Generate 64 random bytes (crypto.randomBytes)
   - Hash with bcrypt (cost 10) for storage
   - Save to `refresh_tokens` table: tokenHash, userId, expiresAt (7 days), ipAddress, userAgent
   - Return raw token (for cookie)

   **`refreshTokens(rawRefreshToken, ipAddress, userAgent)`:**
   - Find all non-revoked refresh tokens for user
   - Compare rawRefreshToken against each tokenHash with bcrypt
   - If NO match → 401
   - If matched token is REVOKED → **Token reuse attack detected**: revoke ALL tokens for this user, return 401
   - If matched token is EXPIRED → revoke it, return 401
   - **Rotation**: revoke old token (set revokedAt), create new refresh token (link old → new via replacedBy), issue new access token
   - Return `{ accessToken }` + new refresh cookie

   **`forgotPassword(email, tenantSlug)`:**
   - Resolve tenant (silently ignore if not found)
   - Find user (silently ignore if not found)
   - ALWAYS return `{ message: "If that email exists, a reset link has been sent" }` — NEVER reveal whether email exists
   - If user found: generate crypto.randomBytes(32) token, hash it, store in `password_resets` with expiresAt = 1 hour
   - Log the reset URL to server console: `${FRONTEND_URL}/reset-password?token=${rawToken}`

   **`resetPassword(token, newPassword)`:**
   - Find password reset by token hash comparison
   - If not found, expired, or already used → 410 Gone
   - Validate password: min 8, uppercase, lowercase, number, special char
   - Hash new password with bcrypt cost 12
   - Update user's passwordHash
   - Mark reset token as used (set usedAt)
   - Revoke ALL refresh tokens for this user (force re-login everywhere)
   - Audit log `password.reset`

   **`logout(rawRefreshToken)`:**
   - Find and revoke the matching refresh token
   - Return success

6. **`src/auth/auth.controller.ts`:**
   - `POST /api/v1/auth/login` — `@Public()`, `@Throttle({ default: { ttl: 900000, limit: 10 } })` (10 per 15 min). Body: LoginDto. Returns AuthResponseDto + sets refresh cookie.
   - `POST /api/v1/auth/refresh` — `@Public()`. Reads `refreshToken` from cookie. Returns new AuthResponseDto + new cookie.
   - `POST /api/v1/auth/logout` — JWT required. Reads cookie, revokes token, clears cookie.
   - `GET /api/v1/auth/me` — JWT required. Returns UserResponseDto from `@CurrentUser()`.
   - `POST /api/v1/auth/forgot-password` — `@Public()`, `@Throttle({ default: { ttl: 3600000, limit: 5 } })`. Body: ForgotPasswordDto.
   - `POST /api/v1/auth/reset-password` — `@Public()`. Body: ResetPasswordDto.

   **Cookie settings for refresh token:**
   ```typescript
   {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'strict',
     path: '/api/v1/auth/refresh',
     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
   }
   ```

7. **DTOs (with full class-validator):**
   - `LoginDto`: `email` (@IsEmail), `password` (@IsString @IsNotEmpty), `tenantSlug` (@IsString @Matches(/^[a-z0-9-]+$/))
   - `ForgotPasswordDto`: `email` (@IsEmail), `tenantSlug` (@IsString)
   - `ResetPasswordDto`: `token` (@IsString @MinLength(32)), `newPassword` (@IsString @MinLength(8) @Matches regex for complexity)
   - `UserResponseDto`: id, tenantId, email, firstName, lastName, phone, role, branchId, avatarUrl, isActive, lastLoginAt, createdAt — **NEVER** passwordHash, twoFactorSecret, failedAttempts, lockedUntil
   - `AuthResponseDto`: `accessToken` (string), `user` (UserResponseDto)

8. **`src/tenants/tenants.module.ts` + `tenants.service.ts`:**
   - `findBySlug(slug: string)` — find tenant by slug, return null if not found
   - `findById(id: string)` — find tenant by ID
   - Cache results in a simple Map with 5-min TTL

9. **Apply globally in `app.module.ts`:**
   - `APP_GUARD` → JwtAuthGuard (all routes protected by default, `@Public()` opts out)
   - `APP_GUARD` → RolesGuard
   - `APP_GUARD` → ThrottlerGuard
   - `APP_FILTER` → GlobalExceptionFilter

## Verification Checklist
- [ ] `npm run build` — zero errors
- [ ] Generate RS256 keys in `keys/` folder
- [ ] Create `.env` from `.env.example` with real DATABASE_URL and key paths
- [ ] `POST /api/v1/auth/login` with `{ email: "admin@sic.com", password: "Admin@123", tenantSlug: "sic-insurance" }` → 200 + JWT + Set-Cookie
- [ ] `POST /api/v1/auth/login` with wrong password → 401 "Invalid credentials"
- [ ] `POST /api/v1/auth/login` with wrong email → 401 "Invalid credentials" (SAME message)
- [ ] 5 failed logins → 423 Locked with remaining time
- [ ] `GET /api/v1/auth/me` with valid JWT → user profile (NO passwordHash field)
- [ ] `GET /api/v1/auth/me` without JWT → 401
- [ ] `POST /api/v1/auth/refresh` with valid cookie → new access token + new cookie
- [ ] Reuse old refresh token after rotation → 401 (reuse attack, all tokens revoked)
- [ ] `POST /api/v1/auth/forgot-password` → always returns generic message regardless of email
- [ ] `POST /api/v1/auth/reset-password` with valid token → password updated
- [ ] Reuse reset token → 410 Gone
- [ ] `POST /api/v1/auth/logout` → cookie cleared
- [ ] No `console.log`, no `any` types, no hardcoded secrets

After all checks pass, update `CHECKPOINT.md`: mark Phase 3 `[x]` and append results to Verification Log.

# IBMS Backend — Master Instructions for AI

## IMPORTANT: Read CHECKPOINT.md first before doing ANY work.

Paste this block at the TOP of every phase prompt you give to an AI:

---

```
READ the file CHECKPOINT.md FIRST.
Do NOT rebuild anything marked ✅.
Build ONLY the phase specified below.

MANDATORY SECURITY RULES — apply to ALL code:
1. NEVER hardcode API keys, passwords, secrets, or connection strings — use .env
2. NEVER use `any` type — always explicit types
3. NEVER use console.log — use NestJS Logger service
4. EVERY protected endpoint must have @UseGuards(JwtAuthGuard)
5. EVERY database query must filter by tenantId from JWT — NEVER from request body
6. EVERY DTO field must have class-validator decorators
7. NEVER return passwordHash, twoFactorSecret, tokenHash, or stack traces in responses
8. NEVER return different error messages for "user not found" vs "wrong password"
9. Passwords: bcrypt cost 12. Money: Decimal type. Soft deletes: deletedAt field.
10. All list endpoints: paginated (default 20, max 100)
11. Use the existing Prisma schema — do NOT modify tables from completed phases
12. After building, update CHECKPOINT.md marking this phase ✅ and log verification results
```

---

## How to Use These Prompts

1. Open the phase prompt file (e.g., `phase-01-scaffold.md`)
2. Copy the master instruction block above + the phase content
3. Paste into your AI tool (Cursor, GitHub Copilot Agent, etc.)
4. Let the AI build
5. Run the verification steps listed at the bottom of each phase
6. If all pass, the AI updates CHECKPOINT.md
7. Move to the next phase

## If Switching AI Tools Mid-Build

Give the new AI:
1. This file (`MASTER_INSTRUCTIONS.md`)
2. The `CHECKPOINT.md` file
3. The prompt for the current incomplete phase
4. Say: "Read CHECKPOINT.md. Continue building the incomplete phase."

## Phase Order (strict — do not skip)

| Phase | Depends On | Prompt File |
|-------|-----------|-------------|
| 1 | Nothing | `phase-01-scaffold.md` |
| 2 | Phase 1 | `phase-02-database.md` |
| 3 | Phase 2 | `phase-03-auth.md` |
| 4 | Phase 3 | `phase-04-invitations.md` |
| 5 | Phase 3 | `phase-05-clients-carriers.md` |
| 6 | Phase 5 | `phase-06-policies-renewals.md` |
| 7 | Phase 6 | `phase-07-claims-complaints.md` |
| 8 | Phase 6 | `phase-08-finance.md` |
| 9 | Phase 5 | `phase-09-leads-docs-tasks.md` |
| 10 | All above | `phase-10-chat-reports.md` |
| 11 | Phase 10 | `phase-11-frontend-connection.md` |

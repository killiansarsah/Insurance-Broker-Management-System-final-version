/**
 * RBAC Seed Helpers — Flat 6-Tier Role Architecture
 *
 * The current schema uses a flat `role: SystemRole` enum + `permissions: String[]`
 * directly on the User model. There are no junction tables.
 *
 * This module provides:
 *  - LEGACY_ROLE_MAP: maps old role strings → new SystemRole enum values
 *  - DEFAULT_ROLE_PERMISSIONS: default permission arrays per role
 *  - seedRbac: no-op stub (kept for import compatibility)
 *  - migrateExistingUsersToRbac: migrates users missing the flat `role` field
 */
import { PrismaClient } from '@prisma/client';
import { DEFAULT_ROLE_PERMISSIONS } from '../src/common/constants/default-permissions';

// ─── LEGACY ROLE MAPPING ─────────────────────────────────
// Maps old UserRole enum values → new SystemRole enum values
export const LEGACY_ROLE_MAP: Record<string, string> = {
  PLATFORM_SUPER_ADMIN: 'PLATFORM_SUPER_ADMIN',
  SUPER_ADMIN: 'ADMINISTRATOR',
  TENANT_ADMIN: 'ADMINISTRATOR',
  ADMIN: 'ADMINISTRATOR',
  FINANCE_MANAGER: 'MANAGER',
  UNDERWRITER: 'MANAGER',
  SENIOR_BROKER: 'MANAGER',
  BRANCH_MANAGER: 'SUPERVISOR',
  COMPLIANCE_OFFICER: 'SUPERVISOR',
  BROKER: 'AGENT',
  SECRETARY: 'AGENT',
  DATA_ENTRY: 'AGENT',
  VIEWER: 'AGENT',
  AGENT: 'AGENT',
};

// Re-export for convenience
export { DEFAULT_ROLE_PERMISSIONS };

/**
 * seedRbac — no-op stub kept for import compatibility.
 * The flat schema has no role/permission tables to seed.
 * Returns a roleMap stub so callers don't need to change.
 */
export async function seedRbac(_prisma: PrismaClient): Promise<{
  roleMap: Record<string, string>;
  permissionMap: Record<string, string>;
}> {
  console.log('\n🔐 RBAC: Flat schema in use — no junction tables to seed.');
  // roleMap is a stub; callers use LEGACY_ROLE_MAP directly for role assignment
  return { roleMap: {}, permissionMap: {} };
}

/**
 * migrateExistingUsersToRbac — migrates users who have no `role` set
 * (created before the flat schema refactor) to the AGENT role default.
 */
export async function migrateExistingUsersToRbac(
  prisma: PrismaClient,
  _roleMap: Record<string, string>,
): Promise<void> {
  console.log('\n🔄 Checking for users missing flat role assignment...');

  const usersWithoutRole = await prisma.user.findMany({
    where: {
      // role defaults to AGENT in schema but check for edge cases
      deletedAt: null,
      role: undefined,
    },
    select: { id: true, email: true },
  });

  if (usersWithoutRole.length === 0) {
    console.log('   ✅ All users have role assignments. Nothing to migrate.');
    return;
  }

  for (const user of usersWithoutRole) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'AGENT',
        permissions: DEFAULT_ROLE_PERMISSIONS['AGENT'] ?? [],
      },
    });
  }

  console.log(`   ✅ Migrated ${usersWithoutRole.length} users to AGENT role.`);
}

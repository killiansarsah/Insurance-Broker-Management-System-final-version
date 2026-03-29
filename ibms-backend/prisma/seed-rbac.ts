/**
 * RBAC Seed Data — System Roles, Permissions, and Default RolePermission Mappings
 *
 * This module is called by the main seed.ts to populate the RBAC tables.
 * All roles are created as global system defaults (tenantId: null, isSystem: true).
 */
import { PrismaClient } from '@prisma/client';

// ─── SYSTEM ROLES ────────────────────────────────────────
export const SYSTEM_ROLES = [
  { name: 'WORKSPACE_OWNER', description: 'Top authority — billing, tenant management, full control' },
  { name: 'ADMINISTRATOR', description: 'Full company control — user management, configuration' },
  { name: 'MANAGER', description: 'Operational leadership — approvals, reports, financial oversight' },
  { name: 'SUPERVISOR', description: 'Team oversight — branch management, limited approvals' },
  { name: 'AGENT', description: 'Daily operations — policies, claims, leads, client management' },
] as const;

// ─── GRANULAR PERMISSIONS ────────────────────────────────
export const PERMISSIONS = [
  { action: 'tenant:manage', description: 'Manage workspace settings & billing' },
  { action: 'users:manage', description: 'Invite, edit, deactivate users' },
  { action: 'roles:manage', description: 'Create custom roles, assign permissions' },
  { action: 'policies:create', description: 'Create new policies' },
  { action: 'policies:approve', description: 'Approve pending policies' },
  { action: 'policies:read', description: 'View policy details' },
  { action: 'claims:create', description: 'Submit new claims' },
  { action: 'claims:approve', description: 'Approve/reject claims' },
  { action: 'claims:read', description: 'View claim details' },
  { action: 'finances:manage', description: 'Process payments, manage invoices' },
  { action: 'finances:read', description: 'View financial reports' },
  { action: 'commissions:manage', description: 'Process and reconcile commissions' },
  { action: 'reports:view', description: 'Access dashboards and analytics' },
  { action: 'approvals:process', description: 'Handle approval workflows' },
  { action: 'clients:manage', description: 'Create and edit client records' },
  { action: 'clients:read', description: 'View client information' },
  { action: 'leads:manage', description: 'Manage sales pipeline and leads' },
  { action: 'documents:manage', description: 'Upload and manage documents' },
] as const;

// ─── DEFAULT ROLE-PERMISSION MATRIX ──────────────────────
// Each role inherits ALL permissions of the tiers below it, plus its own
const ROLE_PERMISSIONS: Record<string, string[]> = {
  WORKSPACE_OWNER: [
    'tenant:manage', 'users:manage', 'roles:manage',
    'policies:create', 'policies:approve', 'policies:read',
    'claims:create', 'claims:approve', 'claims:read',
    'finances:manage', 'finances:read', 'commissions:manage',
    'reports:view', 'approvals:process',
    'clients:manage', 'clients:read',
    'leads:manage', 'documents:manage',
  ],
  ADMINISTRATOR: [
    'users:manage', 'roles:manage',
    'policies:create', 'policies:approve', 'policies:read',
    'claims:create', 'claims:approve', 'claims:read',
    'finances:manage', 'finances:read', 'commissions:manage',
    'reports:view', 'approvals:process',
    'clients:manage', 'clients:read',
    'leads:manage', 'documents:manage',
  ],
  MANAGER: [
    'policies:create', 'policies:approve', 'policies:read',
    'claims:create', 'claims:approve', 'claims:read',
    'finances:manage', 'finances:read', 'commissions:manage',
    'reports:view', 'approvals:process',
    'clients:manage', 'clients:read',
    'leads:manage', 'documents:manage',
  ],
  SUPERVISOR: [
    'policies:create', 'policies:read',
    'claims:create', 'claims:read',
    'finances:read',
    'reports:view', 'approvals:process',
    'clients:manage', 'clients:read',
    'leads:manage', 'documents:manage',
  ],
  AGENT: [
    'policies:create', 'policies:read',
    'claims:create', 'claims:read',
    'finances:read',
    'reports:view',
    'clients:manage', 'clients:read',
    'leads:manage', 'documents:manage',
  ],
};

// ─── LEGACY ROLE MAPPING ─────────────────────────────────
// Maps old UserRole enum values → new system role names
export const LEGACY_ROLE_MAP: Record<string, string> = {
  PLATFORM_SUPER_ADMIN: 'WORKSPACE_OWNER',
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

// ─── SEED FUNCTION ───────────────────────────────────────
export async function seedRbac(prisma: PrismaClient): Promise<{
  roleMap: Record<string, string>;
  permissionMap: Record<string, string>;
}> {
  console.log('\n🔐 Seeding RBAC system...');

  // 1. Upsert system roles (global, tenantId = null)
  const roleMap: Record<string, string> = {};
  for (const role of SYSTEM_ROLES) {
    const r = await prisma.role.upsert({
      where: { tenantId_name: { tenantId: null as any, name: role.name } },
      update: { description: role.description },
      create: {
        name: role.name,
        description: role.description,
        isSystem: true,
        tenantId: null,
      },
    });
    roleMap[role.name] = r.id;
  }
  console.log(`   ✅ System Roles: ${SYSTEM_ROLES.length} upserted`);

  // 2. Upsert permissions
  const permissionMap: Record<string, string> = {};
  for (const perm of PERMISSIONS) {
    const p = await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: { action: perm.action, description: perm.description },
    });
    permissionMap[perm.action] = p.id;
  }
  console.log(`   ✅ Permissions: ${PERMISSIONS.length} upserted`);

  // 3. Assign permissions to roles (RolePermission junction)
  let rpCount = 0;
  for (const [roleName, actions] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleMap[roleName];
    if (!roleId) continue;

    for (const action of actions) {
      const permissionId = permissionMap[action];
      if (!permissionId) continue;

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId },
      });
      rpCount++;
    }
  }
  console.log(`   ✅ RolePermission mappings: ${rpCount} upserted`);

  return { roleMap, permissionMap };
}

// ─── MIGRATE EXISTING USERS ─────────────────────────────
// This function migrates users who have old-style role assignments
// (created before the RBAC refactor) to the new UserRoleMapping system.
export async function migrateExistingUsersToRbac(
  prisma: PrismaClient,
  roleMap: Record<string, string>,
): Promise<void> {
  console.log('\n🔄 Migrating existing users to new RBAC roles...');

  // Find users without any UserRoleMapping
  const usersWithoutRoles = await prisma.user.findMany({
    where: {
      userRoleMappings: { none: {} },
      deletedAt: null,
    },
    select: { id: true, email: true, jobTitle: true },
  });

  if (usersWithoutRoles.length === 0) {
    console.log('   ✅ All users already have role mappings. Nothing to migrate.');
    return;
  }

  // Default unmapped users to AGENT role
  const agentRoleId = roleMap['AGENT'];
  let migrated = 0;

  for (const user of usersWithoutRoles) {
    await prisma.userRoleMapping.create({
      data: { userId: user.id, roleId: agentRoleId },
    });
    migrated++;
  }

  console.log(`   ✅ Migrated ${migrated} users to AGENT role (no previous mapping found)`);
}

/**
 * CP-2: Migrate existing junction-table RBAC data to flat role + permissions fields.
 *
 * Run: npx ts-node scripts/migrate-to-flat-rbac.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LEGACY_ROLE_ALIASES: Record<string, string> = {
  PLATFORM_SUPER_ADMIN: 'PLATFORM_SUPER_ADMIN',
  SUPER_ADMIN: 'WORKSPACE_OWNER',
  TENANT_ADMIN: 'ADMINISTRATOR',
  ADMIN: 'ADMINISTRATOR',
  FINANCE_MANAGER: 'MANAGER',
  UNDERWRITER: 'MANAGER',
  SENIOR_BROKER: 'MANAGER',
  BRANCH_MANAGER: 'SUPERVISOR',
  COMPLIANCE_OFFICER: 'SUPERVISOR',
  CLAIMS_HANDLER: 'SUPERVISOR',
  BROKER: 'AGENT',
  SECRETARY: 'AGENT',
  DATA_ENTRY: 'AGENT',
  VIEWER: 'AGENT',
  // Canonical names map to themselves
  WORKSPACE_OWNER: 'WORKSPACE_OWNER',
  ADMINISTRATOR: 'ADMINISTRATOR',
  MANAGER: 'MANAGER',
  SUPERVISOR: 'SUPERVISOR',
  AGENT: 'AGENT',
};

const ROLE_LEVEL: Record<string, number> = {
  PLATFORM_SUPER_ADMIN: 10,
  WORKSPACE_OWNER: 8,
  ADMINISTRATOR: 7,
  MANAGER: 5,
  SUPERVISOR: 4,
  AGENT: 2,
};

async function main() {
  console.log('=== CP-2: Migrating to flat RBAC ===\n');

  const users = await prisma.user.findMany({
    include: {
      userRoleMappings: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  console.log(`Found ${users.length} users to migrate.\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of users) {
    try {
      // Skip users already migrated (have a non-AGENT role set or non-empty permissions)
      if (
        (user as any).role !== 'AGENT' ||
        ((user as any).permissions && (user as any).permissions.length > 0)
      ) {
        // Check if it was already explicitly set
        if (user.userRoleMappings.length === 0) {
          skipped++;
          continue;
        }
      }

      if (user.userRoleMappings.length === 0) {
        // No junction mappings — default to AGENT with empty permissions
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: 'AGENT' as any,
            permissions: [],
          },
        });
        migrated++;
        console.log(`  [DEFAULT] ${user.email} → AGENT (no mappings)`);
        continue;
      }

      // Find highest role from junction mappings
      let highestRole = 'AGENT';
      let highestLevel = 0;

      for (const mapping of user.userRoleMappings) {
        const roleName = mapping.role.name;
        const canonical = LEGACY_ROLE_ALIASES[roleName] ?? 'AGENT';
        const level = ROLE_LEVEL[canonical] ?? 0;
        if (level > highestLevel) {
          highestLevel = level;
          highestRole = canonical;
        }
      }

      // Collect all permissions from all role mappings
      const permSet = new Set<string>();
      for (const mapping of user.userRoleMappings) {
        for (const rp of mapping.role.permissions) {
          permSet.add(rp.permission.action);
        }
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: highestRole as any,
          permissions: [...permSet],
        },
      });

      migrated++;
      console.log(
        `  [OK] ${user.email} → ${highestRole} (${permSet.size} permissions)`,
      );
    } catch (err) {
      errors++;
      console.error(`  [ERROR] ${user.email}: ${err}`);
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`  Migrated: ${migrated}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`  Total:    ${users.length}`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

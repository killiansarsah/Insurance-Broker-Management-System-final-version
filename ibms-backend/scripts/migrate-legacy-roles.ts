import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LEGACY_TO_CANONICAL: Record<string, string> = {
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
  CLAIMS_HANDLER: 'SUPERVISOR',
};

async function main() {
  const canonicalNames = [
    'WORKSPACE_OWNER',
    'ADMINISTRATOR',
    'MANAGER',
    'SUPERVISOR',
    'AGENT',
  ];

  const canonicalDescriptions: Record<string, string> = {
    WORKSPACE_OWNER: 'Top authority',
    ADMINISTRATOR: 'Administrative control',
    MANAGER: 'Operational management',
    SUPERVISOR: 'Team supervision',
    AGENT: 'Daily operations',
  };

  for (const roleName of canonicalNames) {
    const existing = await prisma.role.findFirst({
      where: { tenantId: null, name: roleName },
      select: { id: true },
    });

    if (existing) {
      await prisma.role.update({
        where: { id: existing.id },
        data: { isSystem: true },
      });
    } else {
      await prisma.role.create({
        data: {
          tenantId: null,
          isSystem: true,
          name: roleName,
          description: canonicalDescriptions[roleName],
        },
      });
    }
  }

  const canonicalRoles = await prisma.role.findMany({
    where: {
      tenantId: null,
      isSystem: true,
      name: { in: canonicalNames },
    },
    select: { id: true, name: true },
  });

  const canonicalRoleIdByName = new Map(
    canonicalRoles.map((role) => [role.name, role.id]),
  );

  const legacyRoleNames = Object.keys(LEGACY_TO_CANONICAL);

  const legacyMappings = await prisma.userRoleMapping.findMany({
    where: {
      role: {
        name: { in: legacyRoleNames },
      },
    },
    select: {
      id: true,
      userId: true,
      role: { select: { name: true } },
    },
  });

  let createdCanonicalMappings = 0;
  let deletedLegacyMappings = 0;

  for (const mapping of legacyMappings) {
    const legacyName = mapping.role.name;
    const canonicalName = LEGACY_TO_CANONICAL[legacyName];
    const canonicalRoleId = canonicalRoleIdByName.get(canonicalName);

    if (!canonicalName || !canonicalRoleId) {
      continue;
    }

    await prisma.userRoleMapping.upsert({
      where: {
        userId_roleId: {
          userId: mapping.userId,
          roleId: canonicalRoleId,
        },
      },
      update: {},
      create: {
        userId: mapping.userId,
        roleId: canonicalRoleId,
      },
    });
    createdCanonicalMappings++;

    await prisma.userRoleMapping.delete({ where: { id: mapping.id } });
    deletedLegacyMappings++;
  }

  const pendingInvitations = await prisma.invitation.findMany({
    where: {
      status: 'PENDING',
      role: { in: legacyRoleNames },
    },
    select: { id: true, role: true },
  });

  let updatedInvitations = 0;
  for (const invitation of pendingInvitations) {
    const canonicalName = LEGACY_TO_CANONICAL[invitation.role];
    if (!canonicalName) {
      continue;
    }

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { role: canonicalName },
    });
    updatedInvitations++;
  }

  console.log('Legacy role migration complete.');
  console.log(`Canonical mappings upserted: ${createdCanonicalMappings}`);
  console.log(`Legacy mappings removed: ${deletedLegacyMappings}`);
  console.log(`Pending invitations normalized: ${updatedInvitations}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

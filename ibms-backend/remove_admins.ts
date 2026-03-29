import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting removal of extra PLATFORM_SUPER_ADMINs or SUPER_ADMINs...');

  const protectedEmail = 'killiansarsah@gmail.com';

  // Find users with super admin roles (excluding protected email)
  const superAdminMappings = await prisma.userRoleMapping.findMany({
    where: {
      role: { name: { in: ['PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN'] } },
      user: { email: { not: protectedEmail } },
    },
    include: { user: { select: { id: true, email: true } }, role: { select: { name: true } } },
  });

  if (superAdminMappings.length === 0) {
    console.log('✅ No extra Super Admins found. Your environment is already clean!');
    return;
  }

  console.log(`🗑️ Removing super admin roles from ${superAdminMappings.length} mappings...`);

  for (const mapping of superAdminMappings) {
    console.log(`- Removing Admin Access for: ${mapping.user.email} (${mapping.role.name})`);
  }

  // Remove the super admin role mappings
  await prisma.userRoleMapping.deleteMany({
    where: { id: { in: superAdminMappings.map(m => m.id) } },
  });

  // Soft-delete and deactivate these users
  const userIds = [...new Set(superAdminMappings.map(m => m.user.id))];
  await prisma.user.updateMany({
    where: { id: { in: userIds } },
    data: { isActive: false, deletedAt: new Date() },
  });

  console.log(`✅ Successfully removed super admin access from ${superAdminMappings.length} mappings.`);
  console.log(`🛡️ Remaining active Super Admin: ${protectedEmail}`);
}

main()
  .catch(e => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

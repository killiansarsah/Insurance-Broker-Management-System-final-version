import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting removal of extra PLATFORM_SUPER_ADMINs or SUPER_ADMINs...');

  // Identify the core email we want to protect
  const protectedEmail = 'killiansarsah@gmail.com';

  const superAdmins = await prisma.user.findMany({
    where: {
      role: {
        in: ['PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN'],
      },
      email: {
        not: protectedEmail
      }
    },
  });

  if (superAdmins.length === 0) {
    console.log('✅ No extra Super Admins found. Your environment is already clean!');
    return;
  }

  console.log(`🗑️ Downgrading & Soft-Deleting ${superAdmins.length} extra admins due to database foreign-key constraints...`);
  
  for (const admin of superAdmins) {
    console.log(`- Removing Admin Access for: ${admin.email} (${admin.role})`);
  }

  // Update them to a locked out status, wiping their role and soft-deleting them
  const updateResult = await prisma.user.updateMany({
    where: {
      id: {
        in: superAdmins.map(admin => admin.id),
      },
    },
    data: {
      role: 'VIEWER',        // Strip super admin role completely
      isActive: false,       // Prevent login entirely
      deletedAt: new Date(), // Soft delete them from the system view
    }
  });

  console.log(`✅ Successfully removed super admin access from ${updateResult.count} users.`);
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

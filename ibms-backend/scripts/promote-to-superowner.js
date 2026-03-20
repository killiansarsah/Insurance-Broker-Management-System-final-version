const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'killiansarsah100@gmail.com';
  const updatedUser = await prisma.user.update({
    where: {
      tenantId_email: {
        tenantId: 'c0634bf9-3822-4bc4-8c4c-cda6db635092',
        email
      }
    },
    data: { role: 'PLATFORM_SUPER_ADMIN' }
  });
  console.log('User role updated successfully to PLATFORM_SUPER_ADMIN:', updatedUser.role);
}

main().finally(() => prisma.$disconnect());

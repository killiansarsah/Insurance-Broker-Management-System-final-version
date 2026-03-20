const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emails = ['admin@sic.com', 'admin@enterprise.com'];
  for (const email of emails) {
    const tenant = await prisma.user.findFirst({ where: { email } });
    if (tenant) {
      const updatedUser = await prisma.user.update({
        where: { tenantId_email: { tenantId: tenant.tenantId, email } },
        data: { role: 'PLATFORM_SUPER_ADMIN' }
      });
      console.log(`Updated ${email} to PLATFORM_SUPER_ADMIN`);
    }
  }
}

main().finally(() => prisma.$disconnect());

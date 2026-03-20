const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const roles = ['PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'];
    for (const r of roles) {
      const users = await prisma.user.findMany({
        where: { role: r },
        select: { email: true }
      });
      console.log(`${r} Users:`, users.map(u => u.email));
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

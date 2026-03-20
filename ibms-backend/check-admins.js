const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const rolesToCheck = ['PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'];
    for (const role of rolesToCheck) {
      const users = await prisma.user.findMany({ where: { role } });
      console.log(role + ' Users:', users.map(u => u.email));
    }
  } catch(e) { console.error('Error:', e); }
}
main().finally(() => prisma.\());

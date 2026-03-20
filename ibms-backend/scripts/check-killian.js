const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { email: 'killiansarsah100@gmail.com' }
  });
  console.log('User killiansarsah100@gmail.com info:', users.map(u => ({ id: u.id, tenantId: u.tenantId, role: u.role })));
}
main().finally(() => prisma.$disconnect());

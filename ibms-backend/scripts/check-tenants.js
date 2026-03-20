const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const tenants = await prisma.tenant.findMany({ select: { name: true, slug: true, id: true } });
    console.log('Tenants:', tenants);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

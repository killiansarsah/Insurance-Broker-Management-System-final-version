const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const carriers = await prisma.carrier.findMany({ include: { products: true } });
  console.log(JSON.stringify(carriers.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productsCount: c.products.length
  })), null, 2));
}
main().finally(() => prisma.$disconnect());

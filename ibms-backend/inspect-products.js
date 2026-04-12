const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.product.count();
  console.log('Total products in database: ' + count);
  if (count > 0) {
      const products = await prisma.product.findMany();
      console.log(JSON.stringify(products, null, 2));
  }
}
main().finally(() => prisma.$disconnect());

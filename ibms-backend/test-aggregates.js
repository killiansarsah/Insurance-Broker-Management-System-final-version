const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const res = await prisma.commission.aggregate({ _sum: { commissionAmount: true }, where: { status: 'PENDING' } });
    console.log("DB PENDING SUM:", res);
    await prisma.$disconnect();
}
main();

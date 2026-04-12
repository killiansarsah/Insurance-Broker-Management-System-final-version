const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const carriers = await prisma.carrier.findMany({ select: { slug: true, name: true, logoUrl: true } });
    console.log(JSON.stringify(carriers, null, 2));
}
main();

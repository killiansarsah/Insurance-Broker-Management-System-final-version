import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
    try {
        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where: { deletedAt: null },
                skip: 0,
                take: 20,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    lastLoginAt: true,
                    lockedUntil: true,
                    createdAt: true,
                    tenantId: true,
                    tenant: { select: { name: true } },
                },
            }),
            prisma.user.count({ where: { deletedAt: null } }),
        ]);
        console.log("Success! Data length:", data.length);
    } catch(e) {
        console.error("FAIL", e);
    }
}
main().finally(() => prisma.$disconnect());

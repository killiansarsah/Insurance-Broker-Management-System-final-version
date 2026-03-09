import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const tenant = await prisma.tenant.findUnique({ where: { slug: 'sic-insurance' } });
        if (!tenant) throw new Error('Tenant not found');
        console.log('Tenant:', tenant.id);

        const user = await prisma.user.findUnique({
            where: { tenantId_email: { tenantId: tenant.id, email: 'admin@sic.com' } },
        });
        console.log('User:', user?.id);

        if (user) {
            await prisma.auditLog.create({
                data: {
                    tenantId: tenant.id,
                    userId: user.id,
                    action: 'login.failed',
                    entity: 'user',
                    entityId: user.id,
                    ipAddress: '127.0.0.1',
                    userAgent: 'test-agent',
                },
            });
            console.log('AuditLog created');
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();

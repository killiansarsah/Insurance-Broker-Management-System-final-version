import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting super admin creation...');
  const passwordHash = await bcrypt.hash('killiansarsah@12345', 12);
  
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Platform Core',
        slug: 'platform-core',
      }
    });
  }

  const roleName = 'PLATFORM_SUPER_ADMIN';

  const user = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'killiansarsah@gmail.com'
      }
    },
    update: {
      passwordHash,
    },
    create: {
      tenantId: tenant.id,
      email: 'killiansarsah@gmail.com',
      passwordHash,
      firstName: 'Killian',
      lastName: 'Sarsah',
      phone: '+233000000000',
      isActive: true,
      mustChangePassword: false,
    }
  });

  // Ensure the role exists, then assign via UserRoleMapping
  let role = await prisma.role.findFirst({
    where: { name: roleName, OR: [{ tenantId: tenant.id }, { tenantId: null, isSystem: true }] },
  });
  if (!role) {
    role = await prisma.role.create({
      data: { name: roleName, tenantId: tenant.id, isSystem: true },
    });
  }
  await prisma.userRoleMapping.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });

  const assignedRoles = await prisma.userRoleMapping.findMany({
    where: { userId: user.id },
    select: { role: { select: { name: true } } },
  });

  console.log('✅ Super Admin account created/updated successfully!');
  console.log(`Email: ${user.email}`);
  console.log(`Roles: ${assignedRoles.map(m => m.role.name).join(', ')}`);
  console.log(`Tenant: ${tenant.name}`);
}

main()
  .catch(e => {
    console.error('Failed to create super admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

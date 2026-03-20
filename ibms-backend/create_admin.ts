import { PrismaClient, UserRole } from '@prisma/client';
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

  // Determine the correct role string from the enum
  let role: UserRole = 'SUPER_ADMIN' as UserRole;
  if ('PLATFORM_SUPER_ADMIN' in UserRole) {
    role = 'PLATFORM_SUPER_ADMIN' as UserRole;
  } else if ('SUPER_ADMIN' in UserRole) {
    role = 'SUPER_ADMIN' as UserRole;
  } else {
    // Fallback if schema doesn't have it explicitly mapped in typescript
    console.log('Roles available:', Object.keys(UserRole));
  }

  const user = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'killiansarsah@gmail.com'
      }
    },
    update: {
      passwordHash,
      role: role,
    },
    create: {
      tenantId: tenant.id,
      email: 'killiansarsah@gmail.com',
      passwordHash,
      firstName: 'Killian',
      lastName: 'Sarsah',
      role: role,
      phone: '+233000000000',
      isActive: true,
      mustChangePassword: false,
    }
  });

  console.log('✅ Super Admin account created/updated successfully!');
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
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

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== Assigning Correct Roles ===\n');

  // superadmin@brokerium.com -> PLATFORM_SUPER_ADMIN (not in SystemRole enum check, handled separately)
  // killiansarsah@gmail.com -> already WORKSPACE_OWNER, leave as is

  // Admin users -> ADMINISTRATOR
  const adminEmails = [
    'admin@sic.com',
    'admin@enterprise.com',
    'killiansarsah100@gmail.com',
    'kelvinelikem@gmail.com',
  ];
  for (const email of adminEmails) {
    await prisma.$executeRawUnsafe(
      "UPDATE users SET role = 'ADMINISTRATOR' WHERE email = $1",
      email
    );
  }
  console.log('Set ADMINISTRATOR for:', adminEmails.join(', '));

  // Manager users -> MANAGER
  const managerEmails = [
    'manager@sic.com',
    'manager@enterprise.com',
  ];
  for (const email of managerEmails) {
    await prisma.$executeRawUnsafe(
      "UPDATE users SET role = 'MANAGER' WHERE email = $1",
      email
    );
  }
  console.log('Set MANAGER for:', managerEmails.join(', '));

  // Sr. Broker / Finance / Compliance -> SUPERVISOR
  const supervisorEmails = [
    'srbroker@sic.com',
    'srbroker@enterprise.com',
    'finance@sic.com',
    'finance@enterprise.com',
    'compliance@sic.com',
    'compliance@enterprise.com',
    'underwriter@sic.com',
    'underwriter@enterprise.com',
  ];
  for (const email of supervisorEmails) {
    await prisma.$executeRawUnsafe(
      "UPDATE users SET role = 'SUPERVISOR' WHERE email = $1",
      email
    );
  }
  console.log('Set SUPERVISOR for:', supervisorEmails.join(', '));

  // superadmin -> PLATFORM_SUPER_ADMIN (if enum value exists)
  try {
    await prisma.$executeRawUnsafe(
      "UPDATE users SET role = 'PLATFORM_SUPER_ADMIN' WHERE email = 'superadmin@brokerium.com'"
    );
    console.log('Set PLATFORM_SUPER_ADMIN for: superadmin@brokerium.com');
  } catch (e) {
    console.log('Could not set PLATFORM_SUPER_ADMIN (enum may not exist):', e.message);
  }

  // Everyone else (broker1-5, agent1-2, dataentry, viewer, test) stays AGENT — correct!

  // Show final state
  const finalRoles = await prisma.$queryRawUnsafe(
    "SELECT email, role::text as role FROM users ORDER BY role, email"
  );
  console.log('\nFinal DB state:');
  console.table(finalRoles);

  console.log('\n=== Role Assignment Complete ===');
}

main()
  .catch(console.error)
  .finally(function() { return prisma.$disconnect(); });

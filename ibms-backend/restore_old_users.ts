import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const usersToRestore = [
  // SIC Insurance
  { firstName: 'Ama', lastName: 'Boateng', email: 'manager@sic.com', role: 'BRANCH_MANAGER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Killian', lastName: 'Asante', email: 'srbroker@sic.com', role: 'BRANCH_MANAGER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Kofi', lastName: 'Adjei', email: 'compliance@sic.com', role: 'COMPLIANCE_OFFICER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Akua', lastName: 'Owusu', email: 'finance@sic.com', role: 'FINANCE_MANAGER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Abena', lastName: 'Nkrumah', email: 'broker1@sic.com', role: 'BROKER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Yaw', lastName: 'Agyeman', email: 'broker2@sic.com', role: 'BROKER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Adjoa', lastName: 'Osei', email: 'broker3@sic.com', role: 'BROKER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Kojo', lastName: 'Appiah', email: 'broker4@sic.com', role: 'BROKER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Efua', lastName: 'Bonsu', email: 'broker5@sic.com', role: 'BROKER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Nana', lastName: 'Darko', email: 'underwriter@sic.com', role: 'UNDERWRITER', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Akosua', lastName: 'Frimpong', email: 'agent1@sic.com', role: 'AGENT', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Kweku', lastName: 'Gyasi', email: 'agent2@sic.com', role: 'AGENT', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Adwoa', lastName: 'Kumi', email: 'dataentry@sic.com', role: 'DATA_ENTRY', tenantSlug: 'sic-insurance', isActive: true },
  { firstName: 'Fiifi', lastName: 'Acheampong', email: 'viewer@sic.com', role: 'VIEWER', tenantSlug: 'sic-insurance', isActive: true },
  
  // Enterprise
  { firstName: 'Ama', lastName: 'Boateng', email: 'manager@enterprise.com', role: 'BRANCH_MANAGER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Kwesi', lastName: 'Asante', email: 'srbroker@enterprise.com', role: 'SENIOR_BROKER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Kofi', lastName: 'Adjei', email: 'compliance@enterprise.com', role: 'COMPLIANCE_OFFICER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Akua', lastName: 'Owusu', email: 'finance@enterprise.com', role: 'FINANCE_MANAGER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Abena', lastName: 'Nkrumah', email: 'broker1@enterprise.com', role: 'BROKER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Yaw', lastName: 'Agyeman', email: 'broker2@enterprise.com', role: 'BROKER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Adjoa', lastName: 'Osei', email: 'broker3@enterprise.com', role: 'BROKER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Kojo', lastName: 'Appiah', email: 'broker4@enterprise.com', role: 'BROKER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Efua', lastName: 'Bonsu', email: 'broker5@enterprise.com', role: 'BROKER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Nana', lastName: 'Darko', email: 'underwriter@enterprise.com', role: 'UNDERWRITER', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Akosua', lastName: 'Frimpong', email: 'agent1@enterprise.com', role: 'AGENT', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Kweku', lastName: 'Gyasi', email: 'agent2@enterprise.com', role: 'AGENT', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Adwoa', lastName: 'Kumi', email: 'dataentry@enterprise.com', role: 'DATA_ENTRY', tenantSlug: 'enterprise-insurance', isActive: true },
  { firstName: 'Fiifi', lastName: 'Acheampong', email: 'viewer@enterprise.com', role: 'VIEWER', tenantSlug: 'enterprise-insurance', isActive: true },

  // Other
  { firstName: 'Test', lastName: 'User', email: 'test@example.com', role: 'BROKER', tenantSlug: 'sic-insurance', isActive: true },
  
  // Inactive Users
  { firstName: 'killian', lastName: 'sarsah', email: 'killiansarsah100@gmail.com', role: 'VIEWER', tenantSlug: 'sic-insurance', isActive: false },
  { firstName: 'Killian', lastName: 'sarsah', email: 'admin@sic.com', role: 'VIEWER', tenantSlug: 'sic-insurance', isActive: false },
  { firstName: 'Enterprise', lastName: 'Admin', email: 'admin@enterprise.com', role: 'VIEWER', tenantSlug: 'enterprise-insurance', isActive: false },
];

async function main() {
  console.log('Restoring old user accounts with Ibms@2024 password...');
  
  const passwordHash = await bcrypt.hash('Ibms@2024', 12);
  
  for (const userData of usersToRestore) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: userData.tenantSlug }
    });

    if (!tenant) {
      console.warn(`[WARN] Tenant ${userData.tenantSlug} not found for ${userData.email}`);
      continue;
    }

    const branch = await prisma.branch.findFirst({
      where: { tenantId: tenant.id }
    });

    try {
      const user = await prisma.user.upsert({
        where: {
          tenantId_email: {
            tenantId: tenant.id,
            email: userData.email
          }
        },
        update: {
          passwordHash,
          isActive: userData.isActive,
          firstName: userData.firstName,
          lastName: userData.lastName,
          ...(userData.isActive === false ? { mustChangePassword: false } : {}),
        },
        create: {
          tenantId: tenant.id,
          email: userData.email,
          passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: '+233000000000',
          isActive: userData.isActive,
          mustChangePassword: false,
          branchId: branch?.id,
        }
      });

      // Assign role via UserRoleMapping
      let role = await prisma.role.findFirst({
        where: { name: userData.role, OR: [{ tenantId: tenant.id }, { tenantId: null, isSystem: true }] },
      });
      if (!role) {
        role = await prisma.role.create({
          data: { name: userData.role, tenantId: tenant.id },
        });
      }
      await prisma.userRoleMapping.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });

      console.log(`✅ Restored: ${userData.email} (${userData.role}) -> ${userData.isActive ? 'Active' : 'Inactive'}`);
    } catch (err: any) {
      console.error(`❌ Failed to restore: ${userData.email}`, err.message);
    }
  }

  console.log('Finished restoring user accounts!');
}

main()
  .catch(e => {
    console.error('Failed to run script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database status...\n');

    const tenantCount = await prisma.tenant.count();
    const userCount = await prisma.user.count();
    const branchCount = await prisma.branch.count();
    const carrierCount = await prisma.carrier.count();
    const productCount = await prisma.product.count();

    console.log('📊 Database Status:');
    console.log(`   ✅ Tenants:  ${tenantCount}`);
    console.log(`   ✅ Users:    ${userCount}`);
    console.log(`   ✅ Branches: ${branchCount}`);
    console.log(`   ✅ Carriers: ${carrierCount}`);
    console.log(`   ✅ Products: ${productCount}`);

    if (tenantCount === 0) {
      console.log('\n⚠️  Database is empty! Run: npx prisma db seed');
    } else {
      console.log('\n✅ Database is seeded!');
      
      const users = await prisma.user.findMany({
        select: { email: true, firstName: true, lastName: true, role: true }
      });
      
      console.log('\n👥 Admin Users:');
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.firstName} ${u.lastName}) - ${u.role}`);
      });
      console.log('\n🔑 Default Password: Admin@123');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

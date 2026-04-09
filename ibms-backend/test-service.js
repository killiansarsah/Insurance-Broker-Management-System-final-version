const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { CommissionsService } = require('./dist/finance/commissions/commissions.service');

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(CommissionsService);
  
  // Hardcoded for testing; assuming one tenant for now
  const prisma = app.get('PrismaService');
  const tenant = await prisma.tenant.findFirst();
  const user = await prisma.user.findFirst({ where: { role: { name: 'ADMINISTRATOR' } } });
  
  const metrics = await service.getMetrics(tenant.id, user.id);
  console.log("METRICS RES:", metrics);
  
  await app.close();
}
main().catch(console.error);

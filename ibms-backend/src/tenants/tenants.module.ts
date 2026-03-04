import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TenantsService } from './tenants.service.js';

@Module({
  imports: [PrismaModule],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}

import { Module } from '@nestjs/common';
import { RenewalsController } from './renewals.controller';
import { RenewalsService } from './renewals.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PoliciesModule } from '../policies/policies.module';

@Module({
  imports: [PrismaModule, PoliciesModule],
  controllers: [RenewalsController],
  providers: [RenewalsService],
})
export class RenewalsModule {}

import { Module } from '@nestjs/common';
import { RenewalsController } from './renewals.controller';
import { RenewalsService } from './renewals.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RenewalsController],
  providers: [RenewalsService],
})
export class RenewalsModule {}

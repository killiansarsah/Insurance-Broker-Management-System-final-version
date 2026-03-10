import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { ComplianceCronService } from './compliance-cron.service';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [ComplianceController],
  providers: [ComplianceService, ComplianceCronService],
  exports: [ComplianceService],
})
export class ComplianceModule {}

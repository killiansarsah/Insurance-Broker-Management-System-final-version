import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailService } from './email.service';
import { EnhancedEmailService } from './enhanced-email.service';
import { EmailTemplatesService } from './email-templates.service';
import {
  EmailAdminController,
  EmailPreferencesController,
} from './email-admin.controller';

@Global()
@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [EmailService, EnhancedEmailService, EmailTemplatesService],
  controllers: [EmailAdminController, EmailPreferencesController],
  exports: [EmailService, EnhancedEmailService, EmailTemplatesService],
})
export class EmailModule {}

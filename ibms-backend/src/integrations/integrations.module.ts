import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { GoogleOAuthService } from './google/google-oauth.service';
import { GoogleOAuthController } from './google/google-oauth.controller';
import { GoogleCalendarService } from './google/google-calendar.service';
import { GoogleCalendarController } from './google/google-calendar.controller';
import { GoogleSheetsService } from './google/google-sheets.service';
import { GoogleSheetsController } from './google/google-sheets.controller';
import { GoogleDriveService } from './google/google-drive.service';
import { GoogleDriveController } from './google/google-drive.controller';
import { GoogleSyncSchedulerService } from './google/google-sync-scheduler.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [
    IntegrationsController,
    GoogleOAuthController,
    GoogleCalendarController,
    GoogleSheetsController,
    GoogleDriveController,
  ],
  providers: [
    IntegrationsService,
    GoogleOAuthService,
    GoogleCalendarService,
    GoogleSheetsService,
    GoogleDriveService,
    GoogleSyncSchedulerService,
  ],
  exports: [
    IntegrationsService,
    GoogleOAuthService,
    GoogleCalendarService,
    GoogleSheetsService,
    GoogleDriveService,
  ],
})
export class IntegrationsModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

// Services
import { PlatformAuditService } from './services/platform-audit.service.js';
import { SystemHealthService } from './services/system-health.service.js';

// Controllers
import { OverviewController } from './controllers/overview.controller.js';
import { SystemHealthController } from './controllers/system-health.controller.js';
import { TenantManagementController } from './controllers/tenant-management.controller.js';
import { UserManagementController } from './controllers/user-management.controller.js';
import { ImpersonationController } from './controllers/impersonation.controller.js';
import { BillingController } from './controllers/billing.controller.js';
import { NicComplianceController } from './controllers/nic-compliance.controller.js';
import { ErrorTrackingController } from './controllers/error-tracking.controller.js';
import { AuditLogsController } from './controllers/audit-logs.controller.js';
import { BackgroundJobsController } from './controllers/background-jobs.controller.js';
import { EmailLogsController } from './controllers/email-logs.controller.js';
import { AnnouncementsController } from './controllers/announcements.controller.js';
import { FeatureFlagsController } from './controllers/feature-flags.controller.js';
import { SettingsController } from './controllers/settings.controller.js';

@Module({
  imports: [PrismaModule, AuthModule, NotificationsModule],
  providers: [PlatformAuditService, SystemHealthService],
  controllers: [
    OverviewController,
    SystemHealthController,
    TenantManagementController,
    UserManagementController,
    ImpersonationController,
    BillingController,
    NicComplianceController,
    ErrorTrackingController,
    AuditLogsController,
    BackgroundJobsController,
    EmailLogsController,
    AnnouncementsController,
    FeatureFlagsController,
    SettingsController,
  ],
  exports: [PlatformAuditService, SystemHealthService],
})
export class PlatformAdminModule {}

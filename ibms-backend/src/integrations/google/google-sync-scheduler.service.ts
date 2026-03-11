import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleCalendarService } from './google-calendar.service';
import { GoogleDriveService } from './google-drive.service';

/**
 * Scheduled sync service — runs cron jobs to auto-sync
 * Google Calendar and Google Drive based on each tenant's syncFrequency setting.
 */
@Injectable()
export class GoogleSyncSchedulerService {
  private readonly logger = new Logger(GoogleSyncSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly calendarService: GoogleCalendarService,
    private readonly driveService: GoogleDriveService,
  ) {}

  /**
   * Runs every 15 minutes.
   * Syncs integrations with syncFrequency = '15m'.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleFrequent() {
    await this.syncByFrequency('15m');
  }

  /**
   * Runs every hour.
   * Syncs integrations with syncFrequency = '1h'.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourly() {
    await this.syncByFrequency('1h');
  }

  /**
   * Runs every 6 hours (4x/day).
   * Syncs integrations with syncFrequency = '6h'.
   */
  @Cron('0 */6 * * *')
  async handleSixHourly() {
    await this.syncByFrequency('6h');
  }

  /**
   * Runs daily at 2 AM.
   * Syncs integrations with syncFrequency = '24h'.
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDaily() {
    await this.syncByFrequency('24h');
  }

  /**
   * Core sync logic: find all connected Google integrations with the given frequency,
   * group by tenant, and trigger the appropriate sync for each service.
   */
  private async syncByFrequency(frequency: string) {
    const integrations = await this.prisma.integration.findMany({
      where: {
        connected: true,
        syncFrequency: frequency,
        serviceKey: { in: ['google-calendar', 'google-drive'] },
      },
    });

    if (integrations.length === 0) return;

    // Group by tenant
    const byTenant = new Map<string, string[]>();
    for (const int of integrations) {
      const keys = byTenant.get(int.tenantId) ?? [];
      keys.push(int.serviceKey);
      byTenant.set(int.tenantId, keys);
    }

    this.logger.log(
      `Scheduled sync (${frequency}): ${byTenant.size} tenant(s), ${integrations.length} integration(s)`,
    );

    for (const [tenantId, serviceKeys] of byTenant) {
      // Find any user in this tenant to use as the "pull" user for calendar
      const user = await this.prisma.user.findFirst({
        where: { tenantId, isActive: true },
        select: { id: true },
      });
      if (!user) continue;

      for (const serviceKey of serviceKeys) {
        try {
          if (serviceKey === 'google-calendar') {
            const result = await this.calendarService.syncAll(
              tenantId,
              user.id,
            );
            this.logger.log(
              `Calendar sync [${tenantId}]: pushed ${result.push.pushed}, pulled ${result.pull.pulled}`,
            );
          } else if (serviceKey === 'google-drive') {
            const result = await this.driveService.mirrorDocuments(tenantId);
            this.logger.log(
              `Drive mirror [${tenantId}]: mirrored ${result.mirrored}, skipped ${result.skipped}`,
            );
          }
        } catch (err: any) {
          this.logger.error(
            `Scheduled sync failed [${tenantId}/${serviceKey}]: ${err.message}`,
          );
        }
      }
    }
  }
}

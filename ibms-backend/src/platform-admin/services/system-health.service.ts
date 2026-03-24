import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { ServiceHealthStatus } from '@prisma/client';

export interface ServiceHealth {
  serviceName: string;
  status: ServiceHealthStatus;
  responseTimeMs: number;
  errorMessage?: string;
}

@Injectable()
export class SystemHealthService {
  private readonly logger = new Logger(SystemHealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkAll(): Promise<ServiceHealth[]> {
    const results: ServiceHealth[] = [];

    results.push(await this.checkDatabase());
    results.push(await this.checkBackgroundJobs());
    results.push(await this.checkEmailService());

    // Store all results
    for (const result of results) {
      await this.prisma.systemHealthCheck.create({
        data: {
          serviceName: result.serviceName,
          status: result.status,
          responseTimeMs: result.responseTimeMs,
          errorMessage: result.errorMessage ?? null,
        },
      });
    }

    return results;
  }

  async checkDatabase(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTimeMs = Date.now() - start;
      const status: ServiceHealthStatus =
        responseTimeMs > 1000 ? 'DEGRADED' : 'HEALTHY';
      return { serviceName: 'PostgreSQL Database', status, responseTimeMs };
    } catch (error) {
      return {
        serviceName: 'PostgreSQL Database',
        status: 'DOWN',
        responseTimeMs: Date.now() - start,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkBackgroundJobs(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const failedCount = await this.prisma.backgroundJob.count({
        where: {
          status: 'FAILED',
          completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });
      const queuedCount = await this.prisma.backgroundJob.count({
        where: { status: 'QUEUED' },
      });
      const responseTimeMs = Date.now() - start;

      let status: ServiceHealthStatus = 'HEALTHY';
      if (failedCount > 10 || queuedCount > 100) status = 'DEGRADED';
      if (failedCount > 50) status = 'DOWN';

      return { serviceName: 'Background Jobs', status, responseTimeMs };
    } catch (error) {
      return {
        serviceName: 'Background Jobs',
        status: 'DOWN',
        responseTimeMs: Date.now() - start,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkEmailService(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const recentFailures = await this.prisma.emailLog.count({
        where: {
          status: { in: ['BOUNCED', 'FAILED'] },
          createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
        },
      });
      const responseTimeMs = Date.now() - start;
      let status: ServiceHealthStatus = 'HEALTHY';
      if (recentFailures > 5) status = 'DEGRADED';
      if (recentFailures > 20) status = 'DOWN';

      return { serviceName: 'Email Service', status, responseTimeMs };
    } catch (error) {
      return {
        serviceName: 'Email Service',
        status: 'DOWN',
        responseTimeMs: Date.now() - start,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getHealthHistory(serviceName?: string, hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const where: Record<string, unknown> = { checkedAt: { gte: since } };
    if (serviceName) where.serviceName = serviceName;

    return this.prisma.systemHealthCheck.findMany({
      where,
      orderBy: { checkedAt: 'desc' },
      take: 500,
    });
  }

  async getUptimeHistory(days = 90) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.prisma.systemHealthCheck.findMany({
      where: { checkedAt: { gte: since } },
      orderBy: { checkedAt: 'asc' },
      select: {
        serviceName: true,
        status: true,
        checkedAt: true,
        responseTimeMs: true,
      },
    });
  }

  async getDatabaseStats() {
    const activeConnections = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT count(*) FROM pg_stat_activity WHERE state = 'active'
    `;
    const dbSize = await this.prisma.$queryRaw<{ size: string }[]>`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `;

    return {
      activeConnections: Number(activeConnections[0]?.count ?? 0),
      databaseSize: dbSize[0]?.size ?? 'Unknown',
    };
  }
}

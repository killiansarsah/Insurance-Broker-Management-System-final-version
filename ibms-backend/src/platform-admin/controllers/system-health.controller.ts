import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SystemHealthService } from '../services/system-health.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';

@Controller('platform-admin/system-health')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')
export class SystemHealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly healthService: SystemHealthService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async getHealth(@CurrentUser() user: AuthenticatedUser) {
    const services = await this.healthService.checkAll();
    return { data: { services } };
  }

  @Get('db')
  async getDatabaseHealth() {
    const dbStats = await this.healthService.getDatabaseStats();
    const dbCheck = await this.healthService.checkDatabase();
    return {
      data: {
        ...dbStats,
        status: dbCheck.status,
        responseTimeMs: dbCheck.responseTimeMs,
      },
    };
  }

  @Get('uptime-history')
  async getUptimeHistory() {
    const history = await this.healthService.getUptimeHistory(90);
    return { data: history };
  }

  @Get('incidents')
  async getIncidents() {
    const incidents = await this.prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { createdBy: { select: { firstName: true, lastName: true, email: true } } },
    });
    return { data: incidents };
  }

  @Post('incidents')
  async createIncident(
    @Body() body: { title: string; severity: 'INFO' | 'WARN' | 'CRITICAL'; affectedServices: string[] },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const incident = await this.prisma.incident.create({
      data: {
        title: body.title,
        severity: body.severity,
        affectedServices: body.affectedServices,
        createdById: user.sub,
      },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      severity: body.severity,
      action: 'INCIDENT_CREATED',
      resourceType: 'Incident',
      resourceId: incident.id,
      description: `Incident created: ${body.title}`,
    });

    return { data: incident };
  }

  @Patch('incidents/:id')
  async updateIncident(
    @Param('id') id: string,
    @Body() body: { status?: 'OPEN' | 'RESOLVED'; rootCause?: string; resolutionNotes?: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const before = await this.prisma.incident.findUnique({ where: { id } });
    const incident = await this.prisma.incident.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.rootCause && { rootCause: body.rootCause }),
        ...(body.resolutionNotes && { resolutionNotes: body.resolutionNotes }),
        ...(body.status === 'RESOLVED' && { resolvedAt: new Date() }),
      },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'INCIDENT_UPDATED',
      resourceType: 'Incident',
      resourceId: id,
      description: `Incident updated: ${incident.title}`,
      beforeState: before as Record<string, unknown>,
      afterState: incident as unknown as Record<string, unknown>,
    });

    return { data: incident };
  }
}

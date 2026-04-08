import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';
import type { AuditCategory, AuditSeverity, AuditStatus } from '@prisma/client';

@Controller('platform-admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('WORKSPACE_OWNER')
export class AuditLogsController {
  constructor(private readonly auditService: PlatformAuditService) {}

  @Get()
  async getLogs(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('category') category?: AuditCategory,
    @Query('severity') severity?: AuditSeverity,
    @Query('tenantId') tenantId?: string,
    @Query('actorId') actorId?: string,
    @Query('status') status?: AuditStatus,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditService.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      severity,
      tenantId,
      actorId,
      status,
      search,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  async getLogDetails(@Param('id') id: string) {
    const log = await this.auditService['prisma'].platformAuditLog.findUnique({
      where: { id },
      include: {
        actor: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });
    return { data: log };
  }
}

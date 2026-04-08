import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';
import type { ErrorSeverity } from '@prisma/client';

@Controller('platform-admin/errors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('WORKSPACE_OWNER')
export class ErrorTrackingController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async getErrors(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('severity') severity?: ErrorSeverity,
    @Query('resolved') resolved?: string,
    @Query('tenantId') tenantId?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (severity) where.severity = severity;
    if (resolved) where.resolved = resolved === 'true';
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { errorType: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.errorLog.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { lastSeenAt: 'desc' },
        include: {
          tenant: { select: { name: true } },
          resolvedBy: { select: { email: true } },
        },
      }),
      this.prisma.errorLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Patch(':id')
  async updateError(
    @Param('id') id: string,
    @Body() body: { resolved?: boolean; notes?: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const before = await this.prisma.errorLog.findUnique({ where: { id } });
    if (!before)
      throw new HttpException('Error log not found', HttpStatus.NOT_FOUND);

    const errorLog = await this.prisma.errorLog.update({
      where: { id },
      data: {
        ...(body.resolved !== undefined && { resolved: body.resolved }),
        ...(body.notes && { notes: body.notes }),
        ...(body.resolved
          ? { resolvedAt: new Date(), resolvedById: user.sub }
          : {}),
      },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'ERROR',
      action: body.resolved ? 'ERROR_RESOLVED' : 'ERROR_UPDATED',
      resourceType: 'ErrorLog',
      resourceId: id,
      description: body.resolved
        ? `Resolved error: ${errorLog.errorType}`
        : `Updated error notes: ${errorLog.errorType}`,
      metadata: { notes: body.notes },
    });

    return { data: errorLog };
  }
}

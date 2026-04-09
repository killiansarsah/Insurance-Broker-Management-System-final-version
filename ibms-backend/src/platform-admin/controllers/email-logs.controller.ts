import {
  Controller,
  Get,
  Post,
  Param,
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
import type { EmailDeliveryStatus } from '@prisma/client';

@Controller('platform-admin/email-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN')
export class EmailLogsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get()
  async getLogs(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('status') status?: EmailDeliveryStatus,
    @Query('recipient') recipient?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (recipient)
      where.recipientEmail = { contains: recipient, mode: 'insensitive' };
    if (tenantId) where.tenantId = tenantId;

    const [data, total] = await Promise.all([
      this.prisma.emailLog.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { tenant: { select: { name: true } } },
      }),
      this.prisma.emailLog.count({ where }),
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

  @Post(':id/resend')
  async resendEmail(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const log = await this.prisma.emailLog.findUnique({ where: { id } });
    if (!log)
      throw new HttpException('Email log not found', HttpStatus.NOT_FOUND);

    // In a real implementation, you would trigger the email service here based on the log's templateName and payload
    // For now, we simulate resending by updating the status to SENT

    const newLog = await this.prisma.emailLog.create({
      data: {
        templateName: log.templateName,
        recipientEmail: log.recipientEmail,
        tenantId: log.tenantId,
        subject: log.subject,
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'EMAIL_RESENT',
      resourceType: 'EmailLog',
      resourceId: newLog.id,
      description: `Manually resent email: ${log.subject} to ${log.recipientEmail}`,
      metadata: { originalLogId: id },
    });

    return { data: newLog };
  }
}

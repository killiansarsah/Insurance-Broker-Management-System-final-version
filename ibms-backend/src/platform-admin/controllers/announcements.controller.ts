import {
  Controller,
  Get,
  Post,
  Delete,
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
import { NotificationsService } from '../../notifications/notifications.service.js';
import { NotificationType, NotificationPriority } from '@prisma/client';

@Controller('platform-admin/announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('WORKSPACE_OWNER')
export class AnnouncementsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  async getAnnouncements(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { reads: true } },
          createdBy: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.announcement.count({ where }),
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

  @Post()
  async create(
    @Body()
    body: {
      title: string;
      body: string;
      type: 'INFO' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';
      targetType: 'ALL' | 'BY_PLAN' | 'SPECIFIC';
      targetIds?: string[];
      delivery: 'IN_APP' | 'EMAIL' | 'BOTH';
      isPinned?: boolean;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const announcement = await this.prisma.announcement.create({
      data: {
        title: body.title,
        body: body.body,
        type: body.type,
        targetType: body.targetType,
        targetIds: body.targetIds,
        delivery: body.delivery,
        isPinned: body.isPinned ?? false,
        createdById: user.sub,
        sentAt: new Date(),
      },
    });

    // Determine target users
    let targetUsers = [];
    if (body.targetType === 'ALL') {
      targetUsers = await this.prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, tenantId: true },
      });
    } else if (body.targetType === 'BY_PLAN') {
      // Find tenants on Enterprise plan
      const enterpriseTenants = await this.prisma.tenant.findMany({
        where: { plan: 'ENTERPRISE' },
        select: { id: true },
      });
      const tenantIds = enterpriseTenants.map((t) => t.id);
      targetUsers = await this.prisma.user.findMany({
        where: { tenantId: { in: tenantIds }, isActive: true },
        select: { id: true, tenantId: true },
      });
    } else if (
      body.targetType === 'SPECIFIC' &&
      body.targetIds &&
      body.targetIds.length > 0
    ) {
      targetUsers = await this.prisma.user.findMany({
        where: { tenantId: { in: body.targetIds }, isActive: true },
        select: { id: true, tenantId: true },
      });
    }

    // Map priority
    let priority: NotificationPriority = NotificationPriority.MEDIUM;
    if (body.type === 'CRITICAL') priority = NotificationPriority.URGENT;
    if (body.type === 'WARNING') priority = NotificationPriority.HIGH;

    // Dispatch system notifications immediately to the selected users
    if (['IN_APP', 'BOTH'].includes(body.delivery)) {
      await Promise.allSettled(
        targetUsers.map((u) =>
          this.notificationsService.create(u.tenantId, {
            userId: u.id,
            title: `System Announcement: ${body.title}`,
            message: body.body,
            type: NotificationType.SYSTEM,
            priority,
          }),
        ),
      );
    }

    // Delivery via EMAIL is handled implicitly by background mailer in full-scale deployment
    // Currently relying on just IN_APP for realtime visibility.

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'ANNOUNCEMENT_CREATED',
      resourceType: 'Announcement',
      resourceId: announcement.id,
      description: `New announcement broadcasted to ${targetUsers.length} users: ${body.title}`,
    });

    return { data: announcement };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const ann = await this.prisma.announcement.findUnique({ where: { id } });
    if (!ann)
      throw new HttpException('Announcement not found', HttpStatus.NOT_FOUND);

    await this.prisma.announcement.delete({ where: { id } });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'ANNOUNCEMENT_DELETED',
      resourceType: 'Announcement',
      resourceId: id,
      description: `Announcement deleted: ${ann.title}`,
    });

    return { data: { success: true } };
  }
}

import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';

@Controller('platform-admin/announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')
export class AnnouncementsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
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
        include: { _count: { select: { reads: true } }, createdBy: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.announcement.count({ where }),
    ]);

    return { data, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
  }

  @Post()
  async create(
    @Body() body: { title: string; body: string; type: 'INFO'|'WARNING'|'CRITICAL'|'MAINTENANCE'; targetType: 'ALL'|'BY_PLAN'|'SPECIFIC'; targetIds?: string[]; delivery: 'IN_APP'|'EMAIL'|'BOTH'; isPinned?: boolean },
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
        sentAt: new Date(), // If scheduled, this would differ
      },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'SYSTEM',
      action: 'ANNOUNCEMENT_CREATED',
      resourceType: 'Announcement',
      resourceId: announcement.id,
      description: `New announcement broadcasted: ${body.title}`,
    });

    return { data: announcement };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const ann = await this.prisma.announcement.findUnique({ where: { id } });
    if (!ann) throw new HttpException('Announcement not found', HttpStatus.NOT_FOUND);

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

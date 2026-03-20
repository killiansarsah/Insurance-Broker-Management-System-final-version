import { Controller, Get, Patch, Param, Body, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';

@Controller('platform-admin/billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')
export class BillingController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get('subscriptions')
  async getSubscriptions(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
    @Query('plan') plan?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (plan) where.plan = plan;
    if (tenantId) where.tenantId = tenantId;

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { tenant: { select: { name: true, slug: true } } },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return { data, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
  }

  @Get('subscriptions/:id')
  async getSubscription(@Param('id') id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        tenant: { select: { name: true, adminEmail: true, phone: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!subscription) throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    return { data: subscription };
  }

  @Patch('subscriptions/:id')
  async updateSubscription(
    @Param('id') id: string,
    @Body() body: { status?: 'ACTIVE' | 'OVERDUE' | 'CANCELLED' | 'TRIAL'; plan?: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE'; amountGhs?: number },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const before = await this.prisma.subscription.findUnique({ where: { id }, include: { tenant: true } });
    if (!before) throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);

    const subscription = await this.prisma.subscription.update({
      where: { id },
      data: body,
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: before.tenantId,
      category: 'BILLING',
      action: 'SUBSCRIPTION_UPDATED',
      resourceType: 'Subscription',
      resourceId: id,
      description: `Subscription updated for ${before.tenant.name}`,
      beforeState: before as unknown as Record<string, unknown>,
      afterState: subscription as unknown as Record<string, unknown>,
    });

    return { data: subscription };
  }

  @Get('payments')
  async getPayments(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (tenantId) where.tenantId = tenantId;

    const [data, total] = await Promise.all([
      this.prisma.platformPayment.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { tenant: { select: { name: true } } },
      }),
      this.prisma.platformPayment.count({ where }),
    ]);

    return { data, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
  }
}

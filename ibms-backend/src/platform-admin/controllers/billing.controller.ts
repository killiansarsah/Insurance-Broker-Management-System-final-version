import {
  Controller,
  Get,
  Post,
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

const PLAN_AMOUNTS: Record<string, number> = {
  BASIC: 299,
  PROFESSIONAL: 599,
  ENTERPRISE: 1299,
};

@Controller('platform-admin/billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN')
export class BillingController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  // ─── Stats Overview ──────────────────────────────────────────────────────────

  @Get('stats')
  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [allActive, overdue, newSubs, churned, trials] = await Promise.all([
      this.prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        select: { amountGhs: true, billingCycle: true },
      }),
      this.prisma.subscription.findMany({
        where: { status: 'OVERDUE' },
        select: { amountGhs: true },
      }),
      this.prisma.subscription.findMany({
        where: { status: 'ACTIVE', createdAt: { gte: thirtyDaysAgo } },
        select: { amountGhs: true },
      }),
      this.prisma.subscription.findMany({
        where: { status: 'CANCELLED', updatedAt: { gte: thirtyDaysAgo } },
        select: { amountGhs: true },
      }),
      this.prisma.subscription.count({ where: { status: 'TRIAL' } }),
    ]);

    // Normalise to monthly value
    const mrr = allActive.reduce((sum, s) => {
      const amount = Number(s.amountGhs);
      const monthly =
        s.billingCycle === 'ANNUAL' ? amount / 12 : amount;
      return sum + monthly;
    }, 0);

    const overdueBalance = overdue.reduce((s, x) => s + Number(x.amountGhs), 0);
    const newRevenue30d = newSubs.reduce((s, x) => s + Number(x.amountGhs), 0);
    const churnedRevenue = churned.reduce((s, x) => s + Number(x.amountGhs), 0);

    return {
      data: {
        mrr: Math.round(mrr * 100) / 100,
        overdueBalance,
        newRevenue30d,
        churnedRevenue,
        activeTrials: trials,
        mrrGrowth: 0, // requires historical snapshot — placeholder
        churnGrowth: 0,
      },
    };
  }

  // ─── Subscriptions ───────────────────────────────────────────────────────────

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
        include: {
          tenant: {
            select: {
              name: true,
              slug: true,
              tenantStatus: true,
              trialEndsAt: true,
              adminEmail: true,
            },
          },
        },
      }),
      this.prisma.subscription.count({ where }),
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

  @Get('subscriptions/:id')
  async getSubscription(@Param('id') id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        tenant: {
          select: {
            name: true,
            adminEmail: true,
            phone: true,
            trialEndsAt: true,
            tenantStatus: true,
          },
        },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!subscription)
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    return { data: subscription };
  }

  @Patch('subscriptions/:id')
  async updateSubscription(
    @Param('id') id: string,
    @Body()
    body: {
      status?: 'ACTIVE' | 'OVERDUE' | 'CANCELLED' | 'TRIAL';
      plan?: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
      amountGhs?: number;
      billingCycle?: 'MONTHLY' | 'ANNUAL';
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const before = await this.prisma.subscription.findUnique({
      where: { id },
      include: { tenant: true },
    });
    if (!before)
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);

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

  /**
   * Atomically convert a TRIAL subscription to a paid ACTIVE plan.
   * This is the primary onboarding action for a trial tenant that wants to subscribe.
   *
   * Steps performed in a single transaction:
   *  1. Validate the subscription is currently TRIAL
   *  2. Update Subscription → status=ACTIVE, amountGhs=plan rate, correct period dates
   *  3. Update Tenant → tenantStatus=ACTIVE, trialEndsAt=null
   *  4. Write TRIAL_CONVERTED audit event
   */
  @Post('subscriptions/:id/convert')
  async convertTrialToPaid(
    @Param('id') id: string,
    @Body()
    body: {
      plan: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
      billingCycle: 'MONTHLY' | 'ANNUAL';
      amountGhs?: number; // override for custom pricing
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const sub = await this.prisma.subscription.findUnique({
      where: { id },
      include: { tenant: true },
    });
    if (!sub)
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    if (sub.status !== 'TRIAL')
      throw new HttpException(
        `Cannot convert: subscription is already ${sub.status}`,
        HttpStatus.BAD_REQUEST,
      );

    const amount =
      body.amountGhs ??
      (body.billingCycle === 'ANNUAL'
        ? (PLAN_AMOUNTS[body.plan] ?? 299) * 12 * 0.9 // 10% annual discount
        : (PLAN_AMOUNTS[body.plan] ?? 299));

    const now = new Date();
    const periodEnd =
      body.billingCycle === 'ANNUAL'
        ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    const [subscription] = await this.prisma.$transaction([
      this.prisma.subscription.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          plan: body.plan,
          billingCycle: body.billingCycle,
          amountGhs: amount,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      }),
      this.prisma.tenant.update({
        where: { id: sub.tenantId },
        data: {
          tenantStatus: 'ACTIVE',
          isActive: true,
          plan: body.plan,
          billingCycle: body.billingCycle,
          trialEndsAt: null, // clear trial expiry
        },
      }),
    ]);

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: sub.tenantId,
      tenantName: sub.tenant.name,
      category: 'BILLING',
      action: 'TRIAL_CONVERTED',
      resourceType: 'Subscription',
      resourceId: id,
      description: `Trial converted to paid ${body.plan} (${body.billingCycle}) for ${sub.tenant.name}. Rate: ₵${amount}/period.`,
      metadata: {
        fromStatus: 'TRIAL',
        toStatus: 'ACTIVE',
        plan: body.plan,
        billingCycle: body.billingCycle,
        amountGhs: amount,
        periodEnd: periodEnd.toISOString(),
      },
    });

    return { data: subscription };
  }

  /**
   * Send a payment or trial-expiry reminder email to the tenant admin.
   */
  @Post('subscriptions/:id/remind')
  async sendReminder(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const sub = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        tenant: { select: { name: true, adminEmail: true, trialEndsAt: true } },
      },
    });
    if (!sub)
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);

    // Queue an email log entry so the email service picks it up
    await this.prisma.emailLog.create({
      data: {
        tenantId: sub.tenantId,
        recipientEmail: sub.tenant.adminEmail ?? '',
        subject:
          sub.status === 'TRIAL'
            ? `Your Brokerium trial expires soon — upgrade now`
            : `Payment reminder: Subscription overdue for ${sub.tenant.name}`,
        templateName:
          sub.status === 'TRIAL' ? 'trial-expiry-reminder' : 'payment-reminder',
        status: 'SENT',
        sentAt: new Date(),
        providerResponse: {
          triggeredBy: user.email,
          subscriptionId: id,
          subscriptionStatus: sub.status,
          trialEndsAt: sub.tenant.trialEndsAt?.toISOString() ?? null,
        },
      },
    });

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: sub.tenantId,
      tenantName: sub.tenant.name,
      category: 'BILLING',
      action: 'PAYMENT_REMINDER_SENT',
      resourceType: 'Subscription',
      resourceId: id,
      description: `Payment / trial reminder dispatched to ${sub.tenant.adminEmail} for ${sub.tenant.name}`,
    });

    return { data: { success: true, sentTo: sub.tenant.adminEmail } };
  }

  /**
   * Sync all subscription statuses — marks expired trials as OVERDUE,
   * flags overdue ACTIVE subscriptions past their billing date.
   */
  @Post('sync')
  async syncPaymentStatuses(@CurrentUser() user: AuthenticatedUser) {
    const now = new Date();

    // 1. Expired trials → OVERDUE
    const expiredTrials = await this.prisma.subscription.findMany({
      where: { status: 'TRIAL', currentPeriodEnd: { lt: now } },
      select: { id: true, tenantId: true },
    });
    if (expiredTrials.length > 0) {
      await this.prisma.subscription.updateMany({
        where: { id: { in: expiredTrials.map((s) => s.id) } },
        data: { status: 'OVERDUE' },
      });
    }

    // 2. Active subscriptions past period end → OVERDUE
    const overdueActive = await this.prisma.subscription.findMany({
      where: { status: 'ACTIVE', currentPeriodEnd: { lt: now } },
      select: { id: true },
    });
    if (overdueActive.length > 0) {
      await this.prisma.subscription.updateMany({
        where: { id: { in: overdueActive.map((s) => s.id) } },
        data: { status: 'OVERDUE' },
      });
    }

    await this.audit.log({
      actorId: user.sub,
      actorEmail: user.email,
      actorRole: user.role,
      category: 'BILLING',
      action: 'PAYMENT_GATEWAY_SYNCED',
      resourceType: 'Subscription',
      description: `Manual sync: ${expiredTrials.length} expired trials → OVERDUE, ${overdueActive.length} active subscriptions → OVERDUE`,
    });

    return {
      data: {
        expiredTrialsMarked: expiredTrials.length,
        overdueActiveMarked: overdueActive.length,
        syncedAt: now.toISOString(),
      },
    };
  }

  // ─── Payments ────────────────────────────────────────────────────────────────

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
}

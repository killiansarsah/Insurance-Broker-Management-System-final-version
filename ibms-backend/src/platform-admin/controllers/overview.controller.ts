import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PlatformAuditService } from '../services/platform-audit.service.js';

@Controller('platform-admin/overview')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_SUPER_ADMIN')
export class OverviewController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: PlatformAuditService,
  ) {}

  @Get('stats')
  async getStats(@CurrentUser() user: AuthenticatedUser) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last30min = new Date(now.getTime() - 30 * 60 * 1000);

    const [
      totalTenants,
      activeTenants,
      tenantsThisMonth,
      subscriptions,
      lastMonthSubscriptions,
      nicFlags,
      errorsLast24h,
      activeSessions,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { isActive: true } }),
      this.prisma.tenant.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        select: { amountGhs: true },
      }),
      this.prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          createdAt: { lte: endOfLastMonth },
        },
        select: { amountGhs: true },
      }),
      this.prisma.nicCompliance.count({
        where: { complianceScore: { lt: 50 } },
      }),
      this.prisma.errorLog.count({ where: { createdAt: { gte: last24h } } }),
      this.prisma.user.count({ where: { lastLoginAt: { gte: last30min } } }),
    ]);

    const mrr = subscriptions.reduce((sum, s) => sum + Number(s.amountGhs), 0);
    const lastMrr = lastMonthSubscriptions.reduce(
      (sum, s) => sum + Number(s.amountGhs),
      0,
    );
    const mrrGrowth = lastMrr > 0 ? ((mrr - lastMrr) / lastMrr) * 100 : 0;
    const arr = mrr * 12;

    return {
      data: {
        totalTenants,
        activeTenants,
        tenantsThisMonth,
        mrr: Number(mrr.toFixed(2)),
        arr: Number(arr.toFixed(2)),
        mrrGrowth: Number(mrrGrowth.toFixed(1)),
        churnRate: 0,
        nicFlags,
        errorsLast24h,
        activeSessions,
        activeTenantsPercent:
          totalTenants > 0
            ? Number(((activeTenants / totalTenants) * 100).toFixed(1))
            : 0,
      },
    };
  }

  @Get('charts')
  async getCharts() {
    const now = new Date();
    const months: { month: string; total: number; active: number }[] = [];
    const revenue: { month: string; revenue: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0,
        23,
        59,
        59,
      );
      const label = start.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });

      const [total, active, subs] = await Promise.all([
        this.prisma.tenant.count({ where: { createdAt: { lte: end } } }),
        this.prisma.tenant.count({
          where: { createdAt: { lte: end }, isActive: true },
        }),
        this.prisma.subscription.findMany({
          where: {
            status: 'ACTIVE',
            currentPeriodStart: { lte: end },
            currentPeriodEnd: { gte: start },
          },
          select: { amountGhs: true },
        }),
      ]);

      months.push({ month: label, total, active });
      revenue.push({
        month: label,
        revenue: subs.reduce((s, sub) => s + Number(sub.amountGhs), 0),
      });
    }

    // MRR by plan
    const planBreakdown = await this.prisma.subscription.groupBy({
      by: ['plan'],
      where: { status: 'ACTIVE' },
      _sum: { amountGhs: true },
      _count: true,
    });

    const mrrByPlan = planBreakdown.map((p) => ({
      plan: p.plan,
      mrr: Number(p._sum.amountGhs ?? 0),
      count: p._count,
    }));

    // Simulated API Volume data
    const apiVolume = [
      { day: 'Mon', success: 4120, failed: 120 },
      { day: 'Tue', success: 3804, failed: 240 },
      { day: 'Wed', success: 5200, failed: 95 },
      { day: 'Thu', success: 4210, failed: 110 },
      { day: 'Fri', success: 6100, failed: 55 },
      { day: 'Sat', success: 2900, failed: 12 },
      { day: 'Sun', success: 2100, failed: 8 },
    ];

    return {
      data: {
        tenantGrowth: months,
        monthlyRevenue: revenue,
        mrrByPlan,
        apiVolume,
      },
    };
  }

  @Get('activity-feed')
  async getActivityFeed() {
    const logs = await this.prisma.platformAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        actorEmail: true,
        actorRole: true,
        category: true,
        severity: true,
        action: true,
        description: true,
        tenantName: true,
        createdAt: true,
        status: true,
      },
    });
    return { data: logs };
  }

  @Get('top-tenants')
  async getTopTenants() {
    const tenants = await this.prisma.tenant.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        _count: { select: { policies: true } },
      },
      orderBy: { policies: { _count: 'desc' } },
      take: 5,
    });

    const totalPolicies = await this.prisma.policy.count();

    const data = tenants.map((t, i) => ({
      rank: i + 1,
      name: t.name,
      policyCount: t._count.policies,
      percentOfTotal:
        totalPolicies > 0
          ? Number(((t._count.policies / totalPolicies) * 100).toFixed(1))
          : 0,
    }));

    return { data };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(tenantId: string, from?: string, to?: string) {
    const dateFrom = from
      ? new Date(from)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const dateTo = to ? new Date(to) : new Date();

    const [
      totalClients,
      totalPolicies,
      activePolicies,
      totalClaims,
      openClaims,
      totalPremiumAgg,
      totalClaimAmountAgg,
      totalSettledAgg,
      totalCommissionsAgg,
      claimsByStatus,
      topCarriers,
      recentActivity,
      policyMixData,
      overdueNIC,
    ] = await Promise.all([
      this.prisma.client.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.policy.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.policy.count({
        where: { tenantId, status: 'ACTIVE', deletedAt: null },
      }),
      this.prisma.claim.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.claim.count({
        where: {
          tenantId,
          deletedAt: null,
          status: {
            in: [
              'INTIMATED',
              'REGISTERED',
              'DOCUMENTS_PENDING',
              'UNDER_REVIEW',
            ],
          },
        },
      }),
      this.prisma.policy.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { premiumAmount: true },
      }),
      this.prisma.claim.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { claimAmount: true },
      }),
      this.prisma.claim.aggregate({
        where: { tenantId, deletedAt: null, status: 'SETTLED' },
        _sum: { settledAmount: true },
      }),
      this.prisma.commission.aggregate({
        where: { tenantId },
        _sum: { commissionAmount: true },
      }),
      this.prisma.claim.groupBy({
        by: ['status'],
        where: { tenantId, deletedAt: null },
        _count: { id: true },
      }),
      this.prisma.policy.groupBy({
        by: ['carrierId'],
        where: { tenantId, deletedAt: null },
        _count: { id: true },
        _sum: { premiumAmount: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      this.prisma.auditLog.findMany({
        where: { tenantId, createdAt: { gte: dateFrom, lte: dateTo } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      // policyMix: breakdown by insuranceType
      this.prisma.policy.groupBy({
        by: ['insuranceType'],
        where: { tenantId, deletedAt: null },
        _count: { id: true },
        _sum: { premiumAmount: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      // overdueNIC: open claims past processing deadline
      this.prisma.claim.count({
        where: {
          tenantId,
          deletedAt: null,
          status: {
            in: [
              'INTIMATED',
              'REGISTERED',
              'DOCUMENTS_PENDING',
              'UNDER_REVIEW',
            ],
          },
          processingDeadline: { lt: new Date() },
        },
      }),
    ]);

    const totalPremium = totalPremiumAgg._sum.premiumAmount ?? 0;
    const totalClaimAmount = totalClaimAmountAgg._sum.claimAmount ?? 0;
    const totalSettled = totalSettledAgg._sum.settledAmount ?? 0;
    const totalCommissions = totalCommissionsAgg._sum.commissionAmount ?? 0;

    const claimsStatusMap: Record<string, number> = {};
    for (const s of claimsByStatus) {
      claimsStatusMap[s.status] = s._count.id;
    }

    // Fetch carrier names for topCarriers
    const carrierIds = topCarriers.map((c) => c.carrierId);
    const carriers = await this.prisma.carrier.findMany({
      where: { id: { in: carrierIds } },
      select: { id: true, name: true },
    });
    const carrierMap = new Map(carriers.map((c) => [c.id, c.name]));

    // policyMix with percentages
    const totalPolicyCount = policyMixData.reduce(
      (sum, p) => sum + p._count.id,
      0,
    );
    const policyMix = policyMixData.map((p) => ({
      insuranceType: p.insuranceType ?? 'Unknown',
      count: p._count.id,
      premium: p._sum.premiumAmount ?? 0,
      percentage:
        totalPolicyCount > 0
          ? Number(((p._count.id / totalPolicyCount) * 100).toFixed(2))
          : 0,
    }));

    // monthlyTrend: last 12 months — computed from policies created grouped by month
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const [monthlyPolicies, monthlyCancellations] = await Promise.all([
      this.prisma.policy.findMany({
        where: {
          tenantId,
          deletedAt: null,
          createdAt: { gte: twelveMonthsAgo },
        },
        select: { createdAt: true, status: true, premiumAmount: true },
      }),
      this.prisma.policy.findMany({
        where: {
          tenantId,
          deletedAt: null,
          status: 'CANCELLED',
          createdAt: { gte: twelveMonthsAgo },
        },
        select: { createdAt: true },
      }),
    ]);

    const monthMap = new Map<
      string,
      {
        newPolicies: number;
        renewals: number;
        cancellations: number;
        premium: number;
      }
    >();

    // Build last 12 months keys
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, {
        newPolicies: 0,
        renewals: 0,
        cancellations: 0,
        premium: 0,
      });
    }

    for (const p of monthlyPolicies) {
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const entry = monthMap.get(key);
      if (entry) {
        entry.newPolicies++;
        entry.premium += Number(p.premiumAmount ?? 0);
      }
    }
    for (const c of monthlyCancellations) {
      const key = `${c.createdAt.getFullYear()}-${String(c.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const entry = monthMap.get(key);
      if (entry) entry.cancellations++;
    }

    const monthlyTrend = Array.from(monthMap.entries()).map(
      ([month, data]) => ({ month, ...data }),
    );

    return {
      overview: {
        totalClients,
        totalPolicies,
        activePolicies,
        totalPremium,
        totalClaims,
        openClaims,
        claimsRatio:
          totalPolicies > 0
            ? Number(((totalClaims / totalPolicies) * 100).toFixed(2))
            : 0,
        totalCommissions,
      },
      policyMix,
      monthlyTrend,
      claimsOverview: {
        intimated: claimsStatusMap['INTIMATED'] ?? 0,
        registered: claimsStatusMap['REGISTERED'] ?? 0,
        documentsPending: claimsStatusMap['DOCUMENTS_PENDING'] ?? 0,
        underReview: claimsStatusMap['UNDER_REVIEW'] ?? 0,
        assessed: claimsStatusMap['ASSESSED'] ?? 0,
        approved: claimsStatusMap['APPROVED'] ?? 0,
        settled: claimsStatusMap['SETTLED'] ?? 0,
        rejected: claimsStatusMap['REJECTED'] ?? 0,
        closed: claimsStatusMap['CLOSED'] ?? 0,
        totalClaimAmount,
        totalSettledAmount: totalSettled,
        overdueNIC,
      },
      topCarriers: topCarriers.map((c) => ({
        carrierId: c.carrierId,
        name: carrierMap.get(c.carrierId) ?? 'Unknown',
        policyCount: c._count.id,
        premium: c._sum.premiumAmount ?? 0,
      })),
      recentActivity: recentActivity.map((a) => ({
        type: a.entity,
        action: a.action,
        description: `${a.action} on ${a.entity}${a.entityId ? ` (${a.entityId.slice(0, 8)})` : ''}`,
        timestamp: a.createdAt,
        userId: a.userId,
        userName: a.user ? `${a.user.firstName} ${a.user.lastName}` : 'System',
      })),
    };
  }

  async production(
    tenantId: string,
    from: string,
    to: string,
    groupBy?: string,
  ) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const policies = await this.prisma.policy.findMany({
      where: {
        tenantId,
        deletedAt: null,
        createdAt: { gte: dateFrom, lte: dateTo },
      },
      select: {
        id: true,
        brokerId: true,
        carrierId: true,
        insuranceType: true,
        premiumAmount: true,
        status: true,
        broker: { select: { id: true, firstName: true, lastName: true } },
        carrier: { select: { id: true, name: true } },
      },
    });

    const grouped = new Map<
      string,
      {
        key: string;
        label: string;
        policyCount: number;
        premiumAmount: number;
        cancelledCount: number;
      }
    >();

    for (const p of policies) {
      const key =
        groupBy === 'carrier'
          ? p.carrierId
          : groupBy === 'insuranceType'
            ? (p.insuranceType ?? 'Unknown')
            : p.brokerId;
      const label =
        groupBy === 'carrier'
          ? (p.carrier?.name ?? 'Unknown')
          : groupBy === 'insuranceType'
            ? (p.insuranceType ?? 'Unknown')
            : p.broker
              ? `${p.broker.firstName} ${p.broker.lastName}`
              : 'Unassigned';

      const entry = grouped.get(key) ?? {
        key,
        label,
        policyCount: 0,
        premiumAmount: 0,
        cancelledCount: 0,
      };
      entry.policyCount++;
      entry.premiumAmount += Number(p.premiumAmount ?? 0);
      if (p.status === 'CANCELLED') entry.cancelledCount++;
      grouped.set(key, entry);
    }

    return { data: Array.from(grouped.values()), dateRange: { from, to } };
  }

  async claimsReport(tenantId: string, from: string, to: string) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const byStatus = await this.prisma.claim.groupBy({
      by: ['status'],
      where: {
        tenantId,
        deletedAt: null,
        createdAt: { gte: dateFrom, lte: dateTo },
      },
      _count: { id: true },
      _sum: { claimAmount: true },
    });

    return {
      byStatus: byStatus.map((s) => ({
        status: s.status,
        count: s._count.id,
        totalAmount: s._sum.claimAmount ?? 0,
      })),
      dateRange: { from, to },
    };
  }

  async renewalsReport(tenantId: string, from: string, to: string) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const policies = await this.prisma.policy.findMany({
      where: {
        tenantId,
        deletedAt: null,
        expiryDate: { gte: dateFrom, lte: dateTo },
      },
      select: { id: true, status: true },
    });

    const due = policies.length;
    const renewed = policies.filter((p) => p.status === 'ACTIVE').length;
    const declined = policies.filter(
      (p) => p.status === 'CANCELLED' || p.status === 'LAPSED',
    ).length;

    return {
      summary: {
        dueCount: due,
        renewedCount: renewed,
        declinedCount: declined,
        renewalRate: due > 0 ? Number(((renewed / due) * 100).toFixed(2)) : 0,
      },
      dateRange: { from, to },
    };
  }

  async financialReport(tenantId: string, from: string, to: string) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const [premiums, commissions, expenses, outstandingInvoices] =
      await Promise.all([
        this.prisma.transaction.aggregate({
          where: {
            tenantId,
            type: 'PREMIUM',
            createdAt: { gte: dateFrom, lte: dateTo },
          },
          _sum: { amount: true },
        }),
        this.prisma.commission.aggregate({
          where: { tenantId, createdAt: { gte: dateFrom, lte: dateTo } },
          _sum: { commissionAmount: true },
        }),
        this.prisma.expense.aggregate({
          where: {
            tenantId,
            status: 'APPROVED',
            createdAt: { gte: dateFrom, lte: dateTo },
          },
          _sum: { amount: true },
        }),
        this.prisma.invoice.aggregate({
          where: {
            tenantId,
            status: { in: ['OUTSTANDING', 'OVERDUE'] },
          },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

    const premiumRevenue = Number(premiums._sum.amount ?? 0);
    const commissionRevenue = Number(commissions._sum.commissionAmount ?? 0);
    const totalExpenses = Number(expenses._sum.amount ?? 0);

    return {
      revenue: {
        premiums: premiumRevenue,
        commissions: commissionRevenue,
        total: premiumRevenue + commissionRevenue,
      },
      expenses: totalExpenses,
      netIncome: premiumRevenue + commissionRevenue - totalExpenses,
      outstanding: {
        invoiceCount: outstandingInvoices._count.id,
        invoiceAmount: Number(outstandingInvoices._sum.amount ?? 0),
      },
      dateRange: { from, to },
    };
  }

  async complianceReport(tenantId: string) {
    const [overdue5Day, overdue30Day, kycPending, complaintsBreached] =
      await Promise.all([
        this.prisma.claim.count({
          where: {
            tenantId,
            deletedAt: null,
            status: 'INTIMATED',
            acknowledgmentDeadline: { lt: new Date() },
          },
        }),
        this.prisma.claim.count({
          where: {
            tenantId,
            deletedAt: null,
            status: {
              in: [
                'INTIMATED',
                'REGISTERED',
                'DOCUMENTS_PENDING',
                'UNDER_REVIEW',
              ],
            },
            processingDeadline: { lt: new Date() },
          },
        }),
        this.prisma.client.count({
          where: { tenantId, deletedAt: null, kycStatus: 'PENDING' },
        }),
        this.prisma.complaint.count({
          where: {
            tenantId,
            isBreached: true,
            status: { notIn: ['RESOLVED', 'CLOSED'] },
          },
        }),
      ]);

    return {
      nicDeadlines: { overdue5Day, overdue30Day },
      kycPending,
      complaintsBreached,
    };
  }
}

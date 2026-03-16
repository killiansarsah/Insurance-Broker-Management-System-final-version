import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(
    tenantId: string,
    from?: string,
    to?: string,
    filters?: {
      insurer?: string;
      product?: string;
      clientType?: string;
      accountOfficer?: string;
      region?: string;
    },
  ) {
    const dateFrom = from
      ? new Date(from)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const dateTo = to ? new Date(to) : new Date();
    const dateRange = { gte: dateFrom, lte: dateTo };

    // Resolve carrier ID if insurer string is passed
    let carrierId: string | undefined;
    if (filters?.insurer) {
      const carrier = await this.prisma.carrier.findFirst({
        where: { tenantId, name: { contains: filters.insurer, mode: 'insensitive' } },
      });
      if (carrier) carrierId = carrier.id;
    }

    // Resolve product map
    const productMap: Record<string, any> = {
      'Motor': 'MOTOR',
      'Health': 'HEALTH',
      'Fire / Property': 'FIRE',
      'Marine': 'MARINE',
      'Professional Indemnity': 'PROFESSIONAL_INDEMNITY',
      'Travel': 'TRAVEL',
    };
    const insuranceType = filters?.product ? productMap[filters.product] : undefined;

    // Resolve client type
    const clientTypeMap: Record<string, any> = {
      'Corporate': 'CORPORATE',
      'SME': 'CORPORATE',
      'Retail / Individual': 'INDIVIDUAL',
    };
    const cType = filters?.clientType ? clientTypeMap[filters.clientType] : undefined;
    const accountOfficer = filters?.accountOfficer;

    const basePolicyWhere: Prisma.PolicyWhereInput = {
      tenantId,
      deletedAt: null,
      createdAt: dateRange,
      ...(carrierId && { carrierId }),
      ...(insuranceType && { insuranceType }),
      ...(cType && { client: { type: cType } }),
      ...(accountOfficer && { brokerId: accountOfficer }), // Note: UI dropdown passes string names, but usually accountOfficer in UI should pass ID or we ignore for now if name is hard to map
    };

    const baseClaimWhere: Prisma.ClaimWhereInput = {
      tenantId,
      deletedAt: null,
      createdAt: dateRange,
      ...(carrierId && { policy: { carrierId } }),
      ...(insuranceType && { policy: { insuranceType } }),
      ...(cType && { policy: { client: { type: cType } } }),
    };

    const baseClientWhere: Prisma.ClientWhereInput = {
      tenantId,
      deletedAt: null,
      createdAt: dateRange,
      ...(cType && { type: cType }),
    };

    const baseCommWhere: Prisma.CommissionWhereInput = {
      tenantId,
      createdAt: dateRange,
      ...(carrierId && { policy: { carrierId } }),
      ...(insuranceType && { policy: { insuranceType } }),
    };

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
      lapsedCount,
      lapsedPremiumAgg,
      clientSegmentsData,
      clientConcentrationData,
    ] = await Promise.all([
      this.prisma.client.count({ where: baseClientWhere }),
      this.prisma.policy.count({ where: basePolicyWhere }),
      this.prisma.policy.count({
        where: { ...basePolicyWhere, status: 'ACTIVE' },
      }),
      this.prisma.claim.count({ where: baseClaimWhere }),
      this.prisma.claim.count({
        where: {
          ...baseClaimWhere,
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
        where: basePolicyWhere,
        _sum: { premiumAmount: true },
      }),
      this.prisma.claim.aggregate({
        where: baseClaimWhere,
        _sum: { claimAmount: true },
      }),
      this.prisma.claim.aggregate({
        where: { ...baseClaimWhere, status: 'SETTLED' },
        _sum: { settledAmount: true },
      }),
      this.prisma.commission.aggregate({
        where: baseCommWhere,
        _sum: { commissionAmount: true },
      }),
      this.prisma.claim.groupBy({
        by: ['status'],
        where: baseClaimWhere,
        _count: { id: true },
      }),
      this.prisma.policy.groupBy({
        by: ['carrierId'],
        where: basePolicyWhere,
        _count: { id: true },
        _sum: { premiumAmount: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      this.prisma.auditLog.findMany({
        where: { tenantId, createdAt: dateRange }, // Audit log doesn't filter perfectly by client type, keep it simple
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      // policyMix: breakdown by insuranceType
      this.prisma.policy.groupBy({
        by: ['insuranceType'],
        where: basePolicyWhere,
        _count: { id: true },
        _sum: { premiumAmount: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      // overdueNIC: open claims past processing deadline
      this.prisma.claim.count({
        where: {
          ...baseClaimWhere,
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
      // lapsed & expired policy count
      this.prisma.policy.count({
        where: { ...basePolicyWhere, status: { in: ['LAPSED', 'EXPIRED'] } },
      }),
      // lapsed / expired premium at risk
      this.prisma.policy.aggregate({
        where: { ...basePolicyWhere, status: { in: ['LAPSED', 'EXPIRED'] } },
        _sum: { premiumAmount: true },
      }),
      // client segments breakdown (corporate vs individual)
      this.prisma.client.groupBy({
        by: ['type'],
        where: baseClientWhere,
        _count: { id: true },
      }),
      // client concentration: premium grouped by client
      this.prisma.policy.groupBy({
        by: ['clientId'],
        where: { ...basePolicyWhere, status: 'ACTIVE' },
        _sum: { premiumAmount: true },
        orderBy: { _sum: { premiumAmount: 'desc' } },
        take: 10,
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
      // Lapsed / expired metrics
      lapsedPolicies: {
        count: lapsedCount,
        premiumAtRisk: lapsedPremiumAgg._sum.premiumAmount ?? 0,
      },
      // Client segments (real data)
      clientSegments: clientSegmentsData.map((s) => ({
        type: s.type,
        count: s._count.id,
        pct: totalClients > 0
          ? Number(((s._count.id / totalClients) * 100).toFixed(1))
          : 0,
      })),
      // Client concentration risk (top clients by premium)
      clientConcentration: await (async () => {
        const totalActivePremium = Number(totalPremium);
        if (!totalActivePremium || !clientConcentrationData.length) {
          return { alerts: [], topClients: [] };
        }
        const clientIds = clientConcentrationData.map((c) => c.clientId);
        const clients = await this.prisma.client.findMany({
          where: { id: { in: clientIds } },
          select: { id: true, firstName: true, lastName: true, companyName: true, type: true },
        });
        const clientNameMap = new Map(clients.map((c) => [
          c.id,
          c.type === 'CORPORATE' ? (c.companyName ?? 'Unknown') : `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || 'Unknown',
        ]));
        const topClients = clientConcentrationData.map((c) => {
          const premium = Number(c._sum.premiumAmount ?? 0);
          const pct = Number(((premium / totalActivePremium) * 100).toFixed(1));
          return {
            clientId: c.clientId,
            name: clientNameMap.get(c.clientId) ?? 'Unknown',
            premium,
            pct,
            alert: pct > 30,
          };
        });
        const alerts = topClients.filter((c) => c.alert);
        return { alerts, topClients };
      })(),
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

  async nicQuarterlyReturn(tenantId: string, year: number, quarter: number) {
    const qStart = new Date(year, (quarter - 1) * 3, 1);
    const qEnd = new Date(year, quarter * 3, 0, 23, 59, 59, 999);

    const [
      premiumVolume,
      claimVolume,
      claimCount,
      settledCount,
      commissionAgg,
      nicLevyAgg,
      remittanceAgg,
      policyCount,
      newPolicies,
      complaintCount,
      complaintBreached,
    ] = await Promise.all([
      this.prisma.policy.aggregate({
        where: { tenantId, deletedAt: null, createdAt: { gte: qStart, lte: qEnd } },
        _sum: { premiumAmount: true },
      }),
      this.prisma.claim.aggregate({
        where: { tenantId, deletedAt: null, createdAt: { gte: qStart, lte: qEnd } },
        _sum: { claimAmount: true },
      }),
      this.prisma.claim.count({
        where: { tenantId, deletedAt: null, createdAt: { gte: qStart, lte: qEnd } },
      }),
      this.prisma.claim.count({
        where: { tenantId, deletedAt: null, status: 'SETTLED', createdAt: { gte: qStart, lte: qEnd } },
      }),
      this.prisma.commission.aggregate({
        where: { tenantId, createdAt: { gte: qStart, lte: qEnd } },
        _sum: { commissionAmount: true, nicLevy: true, netCommission: true },
      }),
      this.prisma.commission.aggregate({
        where: { tenantId, createdAt: { gte: qStart, lte: qEnd } },
        _sum: { nicLevy: true },
      }),
      this.prisma.remittance.aggregate({
        where: { tenantId, status: 'REMITTED', createdAt: { gte: qStart, lte: qEnd } },
        _sum: { amountRemitted: true },
      }),
      this.prisma.policy.count({
        where: { tenantId, deletedAt: null, status: 'ACTIVE' },
      }),
      this.prisma.policy.count({
        where: { tenantId, deletedAt: null, createdAt: { gte: qStart, lte: qEnd } },
      }),
      this.prisma.complaint.count({
        where: { tenantId, createdAt: { gte: qStart, lte: qEnd } },
      }),
      this.prisma.complaint.count({
        where: { tenantId, isBreached: true, createdAt: { gte: qStart, lte: qEnd } },
      }),
    ]);

    const totalPremium = Number(premiumVolume._sum.premiumAmount ?? 0);
    const totalClaims = Number(claimVolume._sum.claimAmount ?? 0);
    const claimsRatio = totalPremium > 0 ? Number(((totalClaims / totalPremium) * 100).toFixed(2)) : 0;

    return {
      period: { year, quarter, from: qStart, to: qEnd },
      premiums: {
        totalVolume: totalPremium,
        newPolicies,
        activePolicies: policyCount,
      },
      claims: {
        totalAmount: totalClaims,
        count: claimCount,
        settledCount,
        claimsRatio,
      },
      commissions: {
        totalEarned: Number(commissionAgg._sum.commissionAmount ?? 0),
        nicLevy: Number(nicLevyAgg._sum.nicLevy ?? 0),
        netCommission: Number(commissionAgg._sum.netCommission ?? 0),
      },
      remittances: {
        totalRemitted: Number(remittanceAgg._sum.amountRemitted ?? 0),
      },
      complaints: {
        total: complaintCount,
        slaBreached: complaintBreached,
      },
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

  // ─── NIC PREMIUM REGISTER ──────────────────────────
  async nicPremiumRegister(tenantId: string, from: string, to: string) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const policies = await this.prisma.policy.findMany({
      where: {
        tenantId,
        deletedAt: null,
        createdAt: { gte: dateFrom, lte: dateTo },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true, companyName: true, clientNumber: true, type: true },
        },
        carrier: { select: { id: true, name: true, shortName: true, licenseNumber: true } },
        broker: { select: { id: true, firstName: true, lastName: true } },
        remittances: {
          select: { id: true, status: true, amountRemitted: true, remittanceDate: true },
        },
      },
    });

    return {
      reportTitle: 'NIC Premium Register',
      period: { from: dateFrom, to: dateTo },
      generatedAt: new Date(),
      data: policies.map((p) => ({
        policyNumber: p.policyNumber,
        insuranceType: p.insuranceType,
        policyType: p.policyType,
        clientName: p.client.companyName || `${p.client.firstName} ${p.client.lastName}`,
        clientNumber: p.client.clientNumber,
        clientType: p.client.type,
        carrierName: p.carrier.name,
        carrierLicense: p.carrier.licenseNumber,
        brokerName: `${p.broker.firstName} ${p.broker.lastName}`,
        inceptionDate: p.inceptionDate,
        expiryDate: p.expiryDate,
        sumInsured: p.sumInsured,
        premiumAmount: p.premiumAmount,
        commissionRate: p.commissionRate,
        commissionAmount: p.commissionAmount,
        premiumFrequency: p.premiumFrequency,
        currency: p.currency,
        status: p.status,
        remittanceStatus: p.remittances.length > 0
          ? (p.remittances.every(r => r.status === 'REMITTED') ? 'REMITTED' : 'PARTIAL')
          : 'NOT_REMITTED',
        totalRemitted: p.remittances.reduce((s, r) => s + Number(r.amountRemitted), 0),
        createdAt: p.createdAt,
      })),
      summary: {
        totalPolicies: policies.length,
        totalPremium: policies.reduce((s, p) => s + Number(p.premiumAmount), 0),
        totalSumInsured: policies.reduce((s, p) => s + Number(p.sumInsured), 0),
        totalCommission: policies.reduce((s, p) => s + Number(p.commissionAmount), 0),
      },
    };
  }

  // ─── NIC CLAIMS REGISTER ───────────────────────────
  async nicClaimsRegister(tenantId: string, from: string, to: string) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const claims = await this.prisma.claim.findMany({
      where: {
        tenantId,
        deletedAt: null,
        createdAt: { gte: dateFrom, lte: dateTo },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true, companyName: true, clientNumber: true },
        },
        policy: {
          select: { id: true, policyNumber: true, insuranceType: true, carrier: { select: { name: true } } },
        },
        assessor: { select: { id: true, firstName: true, lastName: true } },
        followUps: {
          select: { id: true, method: true, followUpDate: true, note: true },
          orderBy: { followUpDate: 'desc' },
          take: 5,
        },
      },
    });

    const now = new Date();

    return {
      reportTitle: 'NIC Claims Register',
      period: { from: dateFrom, to: dateTo },
      generatedAt: new Date(),
      data: claims.map((c) => ({
        claimNumber: c.claimNumber,
        policyNumber: c.policy.policyNumber,
        insuranceType: c.policy.insuranceType,
        carrierName: c.policy.carrier?.name ?? 'Unknown',
        clientName: c.client.companyName || `${c.client.firstName} ${c.client.lastName}`,
        clientNumber: c.client.clientNumber,
        incidentDate: c.incidentDate,
        incidentDescription: c.incidentDescription,
        incidentLocation: c.incidentLocation,
        claimAmount: c.claimAmount,
        assessedAmount: c.assessedAmount,
        settledAmount: c.settledAmount,
        currency: c.currency,
        status: c.status,
        intimationDate: c.intimationDate,
        registrationDate: c.registrationDate,
        acknowledgmentDeadline: c.acknowledgmentDeadline,
        processingDeadline: c.processingDeadline,
        settlementDate: c.settlementDate,
        isOverdue: c.isOverdue,
        nic5DayBreached: c.status === 'INTIMATED' && c.acknowledgmentDeadline < now,
        nic30DayBreached: now > c.processingDeadline && !['SETTLED', 'CLOSED', 'REJECTED'].includes(c.status),
        assessorName: c.assessor ? `${c.assessor.firstName} ${c.assessor.lastName}` : null,
        followUpCount: c.followUps.length,
        lastFollowUp: c.followUps[0] ?? null,
        createdAt: c.createdAt,
      })),
      summary: {
        totalClaims: claims.length,
        totalClaimAmount: claims.reduce((s, c) => s + Number(c.claimAmount), 0),
        totalSettled: claims.filter(c => c.status === 'SETTLED').length,
        totalSettledAmount: claims.reduce((s, c) => s + Number(c.settledAmount ?? 0), 0),
        overdue5Day: claims.filter(c => c.status === 'INTIMATED' && c.acknowledgmentDeadline < now).length,
        overdue30Day: claims.filter(c => now > c.processingDeadline && !['SETTLED', 'CLOSED', 'REJECTED'].includes(c.status)).length,
      },
    };
  }

  // ─── FIC SUSPICIOUS TRANSACTION REPORT ─────────────
  async ficSuspiciousTransactions(tenantId: string, from?: string, to?: string) {
    const dateFrom = from ? new Date(from) : new Date(new Date().getFullYear(), 0, 1);
    const dateTo = to ? new Date(to) : new Date();

    // Flag transactions meeting FIC STR criteria:
    // 1. Cash transactions ≥ GHS 20,000
    // 2. Multiple transactions from same client in short period
    // 3. Clients with HIGH/CRITICAL AML risk
    const [largeCash, highRiskClients] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          tenantId,
          paymentMethod: 'CASH',
          amount: { gte: 20000 },
          createdAt: { gte: dateFrom, lte: dateTo },
        },
        include: {
          client: {
            select: { id: true, firstName: true, lastName: true, companyName: true, clientNumber: true, amlRiskLevel: true },
          },
          policy: { select: { policyNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.findMany({
        where: {
          tenantId,
          deletedAt: null,
          amlRiskLevel: { in: ['HIGH', 'CRITICAL'] },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true,
          clientNumber: true,
          amlRiskLevel: true,
          isPep: true,
          transactions: {
            where: { createdAt: { gte: dateFrom, lte: dateTo } },
            select: { id: true, transactionNumber: true, amount: true, type: true, paymentMethod: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
    ]);

    return {
      reportTitle: 'FIC Suspicious Transaction Report (STR)',
      period: { from: dateFrom, to: dateTo },
      generatedAt: new Date(),
      largeCashTransactions: largeCash.map(t => ({
        transactionNumber: t.transactionNumber,
        amount: t.amount,
        type: t.type,
        paymentMethod: t.paymentMethod,
        clientName: t.client ? (t.client.companyName || `${t.client.firstName} ${t.client.lastName}`) : 'Unknown',
        clientNumber: t.client?.clientNumber,
        amlRiskLevel: t.client?.amlRiskLevel,
        policyNumber: t.policy?.policyNumber,
        date: t.createdAt,
      })),
      highRiskClientActivity: highRiskClients.map(c => ({
        clientName: c.companyName || `${c.firstName} ${c.lastName}`,
        clientNumber: c.clientNumber,
        amlRiskLevel: c.amlRiskLevel,
        isPep: c.isPep,
        transactionCount: c.transactions.length,
        totalAmount: c.transactions.reduce((s, t) => s + Number(t.amount), 0),
        transactions: c.transactions,
      })),
      summary: {
        largeCashCount: largeCash.length,
        largeCashTotal: largeCash.reduce((s, t) => s + Number(t.amount), 0),
        highRiskClientCount: highRiskClients.length,
        highRiskTransactionCount: highRiskClients.reduce((s, c) => s + c.transactions.length, 0),
      },
    };
  }
}

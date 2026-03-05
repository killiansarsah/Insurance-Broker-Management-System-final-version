import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinanceDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(tenantId: string, from?: string, to?: string) {
    const now = new Date();
    const startDate = from ? new Date(from) : new Date(now.getFullYear(), 0, 1);
    const endDate = to ? new Date(to) : now;

    const dateFilter = {
      createdAt: { gte: startDate, lte: endDate },
    };

    const [
      premiumCollected,
      premiumOutstanding,
      commissionsEarned,
      commissionsPending,
      claimsPaid,
      totalExpenses,
      overdueInvoices,
      overdueAmount,
      paymentMethodBreakdown,
    ] = await Promise.all([
      // Total Premium Collected
      this.prisma.transaction.aggregate({
        where: {
          tenantId,
          type: 'PREMIUM',
          paymentStatus: 'PAID',
          ...dateFilter,
        },
        _sum: { amount: true },
      }),

      // Total Premium Outstanding (unpaid invoices)
      this.prisma.invoice.aggregate({
        where: {
          tenantId,
          status: { in: ['OUTSTANDING', 'PARTIAL'] },
        },
        _sum: { amount: true },
      }),

      // Total Commissions Earned
      this.prisma.commission.aggregate({
        where: {
          tenantId,
          status: { in: ['EARNED', 'PAID'] },
          ...dateFilter,
        },
        _sum: { commissionAmount: true },
      }),

      // Total Commissions Pending
      this.prisma.commission.aggregate({
        where: { tenantId, status: 'PENDING' },
        _sum: { commissionAmount: true },
      }),

      // Total Claims Paid (look at claim settlements from transactions)
      this.prisma.transaction.aggregate({
        where: {
          tenantId,
          type: 'REFUND',
          paymentStatus: 'PAID',
          ...dateFilter,
        },
        _sum: { amount: true },
      }),

      // Total Expenses
      this.prisma.expense.aggregate({
        where: {
          tenantId,
          status: 'APPROVED',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),

      // Overdue invoice count
      this.prisma.invoice.count({
        where: { tenantId, status: 'OVERDUE' },
      }),

      // Overdue invoice amount
      this.prisma.invoice.aggregate({
        where: { tenantId, status: 'OVERDUE' },
        _sum: { amount: true },
      }),

      // Payment method breakdown
      this.prisma.transaction.groupBy({
        by: ['paymentMethod'],
        where: { tenantId, paymentStatus: 'PAID', ...dateFilter },
        _count: { id: true },
        _sum: { amount: true },
      }),
    ]);

    const totalPremiumVal = Number(premiumCollected._sum.amount || 0);
    const totalCommissionsVal = Number(
      commissionsEarned._sum.commissionAmount || 0,
    );
    const totalClaimsVal = Number(claimsPaid._sum.amount || 0);
    const totalExpensesVal = Number(totalExpenses._sum.amount || 0);

    // Generate monthly revenue breakdown (past 12 months)
    const monthlyRevenue: {
      month: string;
      premium: number;
      commission: number;
      claims: number;
      expenses: number;
    }[] = [];

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0,
        23,
        59,
        59,
      );
      const monthLabel = monthStart.toISOString().slice(0, 7);

      const [premiumMonth, commissionMonth, claimsMonth, expenseMonth] =
        await Promise.all([
          this.prisma.transaction.aggregate({
            where: {
              tenantId,
              type: 'PREMIUM',
              paymentStatus: 'PAID',
              createdAt: { gte: monthStart, lte: monthEnd },
            },
            _sum: { amount: true },
          }),
          this.prisma.commission.aggregate({
            where: {
              tenantId,
              status: { in: ['EARNED', 'PAID'] },
              createdAt: { gte: monthStart, lte: monthEnd },
            },
            _sum: { commissionAmount: true },
          }),
          this.prisma.transaction.aggregate({
            where: {
              tenantId,
              type: 'REFUND',
              paymentStatus: 'PAID',
              createdAt: { gte: monthStart, lte: monthEnd },
            },
            _sum: { amount: true },
          }),
          this.prisma.expense.aggregate({
            where: {
              tenantId,
              status: 'APPROVED',
              date: { gte: monthStart, lte: monthEnd },
            },
            _sum: { amount: true },
          }),
        ]);

      monthlyRevenue.push({
        month: monthLabel,
        premium: Number(premiumMonth._sum.amount || 0),
        commission: Number(commissionMonth._sum.commissionAmount || 0),
        claims: Number(claimsMonth._sum.amount || 0),
        expenses: Number(expenseMonth._sum.amount || 0),
      });
    }

    return {
      totalPremiumCollected: totalPremiumVal,
      totalPremiumOutstanding: Number(premiumOutstanding._sum.amount || 0),
      totalCommissionsEarned: totalCommissionsVal,
      totalCommissionsPending: Number(
        commissionsPending._sum.commissionAmount || 0,
      ),
      totalClaimsPaid: totalClaimsVal,
      totalExpenses: totalExpensesVal,
      netIncome:
        totalPremiumVal +
        totalCommissionsVal -
        totalClaimsVal -
        totalExpensesVal,
      overdueInvoices,
      overdueAmount: Number(overdueAmount._sum.amount || 0),
      monthlyRevenue,
      paymentMethodBreakdown: paymentMethodBreakdown.map((entry) => ({
        method: entry.paymentMethod,
        count: entry._count.id,
        total: Number(entry._sum.amount || 0),
      })),
    };
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionQueryDto } from './dto/commission-query.dto';
import { ReceiveCommissionDto } from './dto/receive-commission.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  private async logAudit(
    tenantId: string,
    userId: string,
    action: string,
    entityId: string,
    after: Record<string, unknown> | null = null,
  ) {
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        entity: 'Commission',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, query: CommissionQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      carrierId,
      brokerId,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.CommissionWhereInput = {
      tenantId,
      ...(status && { status }),
      ...(brokerId && { brokerId }),
      ...(carrierId && { policy: { carrierId } }),
      ...((dateFrom || dateTo) && {
        createdAt: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        OR: [
          { insurerName: { contains: search, mode: 'insensitive' as const } },
          {
            policy: {
              policyNumber: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
        ],
      }),
    };

    const allowedSortFields = ['commissionAmount', 'createdAt', 'status'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const [total, items, pendingAgg, earnedAgg, paidAgg] = await Promise.all([
      this.prisma.commission.count({ where }),
      this.prisma.commission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          policy: {
            select: { id: true, policyNumber: true, insuranceType: true },
          },
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              companyName: true,
            },
          },
          broker: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.commission.aggregate({
        where: { tenantId, status: 'PENDING' },
        _sum: { commissionAmount: true },
      }),
      this.prisma.commission.aggregate({
        where: { tenantId, status: 'EARNED' },
        _sum: { commissionAmount: true },
      }),
      this.prisma.commission.aggregate({
        where: { tenantId, status: 'PAID' },
        _sum: { commissionAmount: true },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalPending: pendingAgg._sum.commissionAmount || 0,
        totalEarned: earnedAgg._sum.commissionAmount || 0,
        totalPaid: paidAgg._sum.commissionAmount || 0,
      },
    };
  }

  // ─── RECEIVE ────────────────────────────────────────
  async receive(
    id: string,
    tenantId: string,
    userId: string,
    dto: ReceiveCommissionDto,
  ) {
    const commission = await this.prisma.commission.findUnique({
      where: { id, tenantId },
    });
    if (!commission) throw new NotFoundException('Commission not found');
    if (commission.status !== 'PENDING' && commission.status !== 'EARNED') {
      throw new BadRequestException(
        'Only PENDING or EARNED commissions can be received',
      );
    }

    const updated = await this.prisma.commission.update({
      where: { id },
      data: {
        status: 'PAID',
        datePaid: new Date(dto.receivedDate),
      },
    });

    // Auto-create a COMMISSION transaction
    const txnNumber = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      (await this.prisma.transaction.count()) + 1,
    ).padStart(6, '0')}`;

    await this.prisma.transaction.create({
      data: {
        tenantId,
        transactionNumber: txnNumber,
        type: 'COMMISSION',
        amount: dto.receivedAmount,
        currency: 'GHS',
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PAID',
        reference: dto.reference,
        policyId: commission.policyId,
        clientId: commission.clientId,
        processedById: userId,
        processedAt: new Date(),
        notes: `Commission received for policy ${commission.policyId}`,
      },
    });

    await this.logAudit(tenantId, userId, 'commission.received', id, {
      receivedAmount: dto.receivedAmount,
      reference: dto.reference,
    });
    return updated;
  }
}

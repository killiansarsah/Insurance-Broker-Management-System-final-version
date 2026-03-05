import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { VoidTransactionDto } from './dto/void-transaction.dto';
import { InvoicesService } from '../invoices/invoices.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoicesService: InvoicesService,
  ) {}

  private async generateTransactionNumber(): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.transaction.count();
    return `TXN-${dateStr}-${String(count + 1).padStart(6, '0')}`;
  }

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
        entity: 'Transaction',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(tenantId: string, userId: string, dto: CreateTransactionDto) {
    // Validate MoMo phone when using mobile money
    if (dto.paymentMethod === 'MOBILE_MONEY' && !dto.momoPhone) {
      throw new BadRequestException(
        'momoPhone is required for Mobile Money payments',
      );
    }

    const transactionNumber = await this.generateTransactionNumber();

    const transaction = await this.prisma.transaction.create({
      data: {
        tenantId,
        transactionNumber,
        type: dto.type,
        amount: dto.amount,
        currency: 'GHS',
        paymentMethod: dto.paymentMethod,
        paymentStatus: 'PAID',
        momoNetwork: dto.momoNetwork,
        momoPhone: dto.momoPhone,
        reference: dto.reference,
        clientId: dto.clientId,
        policyId: dto.policyId,
        invoiceId: dto.invoiceId,
        processedById: userId,
        processedAt: new Date(),
        notes: dto.notes ?? dto.description,
      },
    });

    // If linked to invoice, update invoice paidAmount
    if (dto.invoiceId) {
      await this.invoicesService.recordPayment(dto.invoiceId, dto.amount);
    }

    // If PREMIUM payment linked to policy, try to mark matching installment as PAID
    if (dto.policyId && dto.type === 'PREMIUM') {
      const installment = await this.prisma.premiumInstallment.findFirst({
        where: {
          policyId: dto.policyId,
          status: 'PENDING',
        },
        orderBy: { dueDate: 'asc' },
      });
      if (installment) {
        await this.prisma.premiumInstallment.update({
          where: { id: installment.id },
          data: {
            status: 'PAID',
            paidDate: new Date(),
          },
        });
      }
    }

    await this.logAudit(
      tenantId,
      userId,
      'transaction.created',
      transaction.id,
    );
    return transaction;
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, query: TransactionQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      paymentMethod,
      status,
      clientId,
      policyId,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      tenantId,
      ...(type && { type }),
      ...(paymentMethod && { paymentMethod }),
      ...(status && { paymentStatus: status }),
      ...(clientId && { clientId }),
      ...(policyId && { policyId }),
      ...((dateFrom || dateTo) && {
        createdAt: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        OR: [
          {
            transactionNumber: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          { reference: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const allowedSortFields = ['transactionNumber', 'amount', 'createdAt'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const [total, items, inflowAgg, outflowAgg] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              companyName: true,
            },
          },
          policy: { select: { id: true, policyNumber: true } },
        },
      }),
      this.prisma.transaction.aggregate({
        where: {
          tenantId,
          type: { in: ['PREMIUM', 'COMMISSION'] },
          paymentStatus: 'PAID',
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          tenantId,
          type: { in: ['REFUND', 'EXPENSE'] },
          paymentStatus: 'PAID',
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalInflow: inflowAgg._sum.amount || 0,
        totalOutflow: outflowAgg._sum.amount || 0,
      },
    };
  }

  // ─── FIND ONE ───────────────────────────────────────
  async findOne(id: string, tenantId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id, tenantId },
      include: {
        client: true,
        policy: {
          select: { id: true, policyNumber: true, insuranceType: true },
        },
        invoice: {
          select: { id: true, invoiceNumber: true, status: true },
        },
        processedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  // ─── VOID (PAID → REFUNDED) ────────────────────────
  async void(
    id: string,
    tenantId: string,
    userId: string,
    dto: VoidTransactionDto,
  ) {
    const transaction = await this.findOne(id, tenantId);
    if (transaction.paymentStatus !== 'PAID') {
      throw new BadRequestException('Only PAID transactions can be voided');
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: { paymentStatus: 'REFUNDED' },
    });

    // Reverse invoice payment if linked
    if (transaction.invoiceId) {
      await this.invoicesService.reversePayment(
        transaction.invoiceId,
        Number(transaction.amount),
      );
    }

    await this.logAudit(tenantId, userId, 'transaction.voided', id, {
      reason: dto.reason,
    });
    return updated;
  }
}

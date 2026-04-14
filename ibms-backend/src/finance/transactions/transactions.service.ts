import { getUserRoleLevel } from '../../common/constants/role-utils.js';
import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { VoidTransactionDto } from './dto/void-transaction.dto';
import { InvoicesService } from '../invoices/invoices.service';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import {
  ROLE_LEVEL,
} from '../../common/constants/role-hierarchy.js';
import { PoliciesService } from '../../policies/policies.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly invoicesService: InvoicesService,
    @Inject(forwardRef(() => PoliciesService))
    private readonly policiesService: PoliciesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private async generateTransactionNumber(
    tenantId: string,
    client?: {
      transaction: {
        count: (args: { where: { tenantId: string } }) => Promise<number>;
      };
    },
  ): Promise<string> {
    const db = client ?? this.prisma;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await db.transaction.count({ where: { tenantId } });
    const hex = randomBytes(3).toString('hex').toUpperCase();
    return `TXN-${dateStr}-${String(count + 1).padStart(6, '0')}-${hex}`;
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

  private async assertClientWritableByActor(
    tenantId: string,
    userId: string,
    client: { assignedBrokerId: string | null },
  ): Promise<void> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    if (actorLevel >= supervisorLevel) return;

    if (client.assignedBrokerId !== userId) {
      throw new BadRequestException(
        'You can only create transactions for your assigned clients',
      );
    }
  }

  private async buildTransactionScopeWhere(
    tenantId: string,
    userId: string,
  ): Promise<Prisma.TransactionWhereInput> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    if (actorLevel >= supervisorLevel) {
      return { tenantId };
    }

    return {
      tenantId,
      OR: [
        { processedById: userId },
        { client: { assignedBrokerId: userId } },
        { policy: { client: { assignedBrokerId: userId } } },
        { invoice: { client: { assignedBrokerId: userId } } },
      ],
    };
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(tenantId: string, userId: string, dto: CreateTransactionDto) {
    // Validate MoMo phone when using mobile money
    if (dto.paymentMethod === 'MOBILE_MONEY' && !dto.momoPhone) {
      throw new BadRequestException(
        'momoPhone is required for Mobile Money payments',
      );
    }

    let relatedClient: { assignedBrokerId: string | null } | null = null;

    if (dto.clientId) {
      relatedClient = await this.prisma.client.findUnique({
        where: { id: dto.clientId, tenantId },
        select: { assignedBrokerId: true },
      });
    } else if (dto.invoiceId) {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: dto.invoiceId, tenantId },
        select: {
          client: {
            select: { assignedBrokerId: true },
          },
        },
      });
      relatedClient = invoice?.client ?? null;
    } else if (dto.policyId) {
      const policy = await this.prisma.policy.findUnique({
        where: { id: dto.policyId, tenantId },
        select: {
          client: {
            select: { assignedBrokerId: true },
          },
        },
      });
      relatedClient = policy?.client ?? null;
    }

    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    if (actorLevel < supervisorLevel && !relatedClient) {
      throw new BadRequestException(
        'Agent-level transaction creation requires a linked assigned client',
      );
    }

    if (relatedClient) {
      await this.assertClientWritableByActor(tenantId, userId, relatedClient);
    }

    // Supervisors+ can auto-approve; agents always create as PENDING
    const isSupervisor = actorLevel >= supervisorLevel;
    const initialStatus = isSupervisor ? 'PAID' : 'PENDING';

    return await this.prisma.$transaction(async (tx) => {
      const transactionNumber = await this.generateTransactionNumber(
        tenantId,
        tx,
      );

      const transaction = await tx.transaction.create({
        data: {
          tenantId,
          transactionNumber,
          type: dto.type,
          accountType: dto.accountType ?? 'CLIENT_ACCOUNT',
          amount: dto.amount,
          currency: 'GHS',
          paymentMethod: dto.paymentMethod,
          paymentStatus: initialStatus,
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

      // Only apply financial side-effects if auto-approved (supervisor+)
      if (isSupervisor) {
        // Auto-bind logic: if this is a PREMIUM payment for a DRAFT policy, bind it BEFORE applying side effects
        if (dto.type === 'PREMIUM' && dto.policyId) {
          try {
            const linkedPolicy = await tx.policy.findUnique({
              where: { id: dto.policyId },
              select: { status: true },
            });
            if (linkedPolicy && linkedPolicy.status === 'DRAFT') {
              await this.policiesService.bind(
                dto.policyId,
                tenantId,
                userId,
                tx, // Pass the same transaction context
              );
              this.logger.log(
                `Auto-bound DRAFT policy ${dto.policyId} during transaction creation`,
              );
            }
          } catch (err) {
            this.logger.warn(`Auto-bind failed in create: ${(err as Error).message}`);
          }
        }

        await this.applyPaymentSideEffects(tx, dto, transaction.id);
      }

      // Trigger notification for large payments that need approval
      if (initialStatus === 'PENDING' && Number(dto.amount) >= 10000) {
        // Find all supervisors and admins in this tenant
        const supervisors = await tx.user.findMany({
          where: {
            tenantId,
            role: { in: ['SUPERVISOR', 'ADMINISTRATOR', 'MANAGER', 'WORKSPACE_OWNER', 'PLATFORM_SUPER_ADMIN'] },
          },
          select: { id: true },
        });

        for (const supervisor of supervisors) {
          await this.notificationsService.create(tenantId, {
            userId: supervisor.id,
            title: 'Payment Approval Required',
            message: `A large payment of GHS ${Number(dto.amount).toLocaleString()} was recorded and needs your approval.`,
            type: 'FINANCE',
            priority: 'HIGH',
            link: `/dashboard/finance/transactions?search=${transactionNumber}`,
          });
        }
      }

      await this.logAudit(
        tenantId,
        userId,
        'transaction.created',
        transaction.id,
        { paymentStatus: initialStatus },
      );
      return transaction;
    });
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, userId: string, query: TransactionQueryDto) {
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

    const scopeWhere = await this.buildTransactionScopeWhere(tenantId, userId);

    const where: Prisma.TransactionWhereInput = {
      ...scopeWhere,
      ...(type && { type }),
      ...(paymentMethod && { paymentMethod }),
      ...(status && { paymentStatus: status }),
      ...(clientId && { clientId }),
      ...(policyId && { policyId }),
      ...(query.accountType && { accountType: query.accountType }),
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
          ...scopeWhere,
          type: { in: ['PREMIUM', 'COMMISSION'] },
          paymentStatus: 'PAID',
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...scopeWhere,
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

  // ─── LEDGER SUMMARY ─────────────────────────────────
  async ledgerSummary(tenantId: string, userId: string) {
    const scopeWhere = await this.buildTransactionScopeWhere(tenantId, userId);

    const [clientAcc, agencyAcc] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          ...scopeWhere,
          accountType: 'CLIENT_ACCOUNT',
          paymentStatus: 'PAID',
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...scopeWhere,
          accountType: 'AGENCY_ACCOUNT',
          paymentStatus: 'PAID',
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);
    return {
      clientAccount: {
        total: clientAcc._sum.amount || 0,
        count: clientAcc._count.id,
      },
      agencyAccount: {
        total: agencyAcc._sum.amount || 0,
        count: agencyAcc._count.id,
      },
    };
  }

  // ─── FIND ONE ───────────────────────────────────────
  async findOne(id: string, tenantId: string, userId: string) {
    const scopeWhere = await this.buildTransactionScopeWhere(tenantId, userId);

    const transaction = await this.prisma.transaction.findFirst({
      where: { id, ...scopeWhere },
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
    const transaction = await this.findOne(id, tenantId, userId);
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

  // ─── APPROVE (PENDING → PAID) ──────────────────────
  async approve(
    id: string,
    tenantId: string,
    userId: string,
  ) {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;
    if (actorLevel < supervisorLevel) {
      throw new BadRequestException(
        'Only supervisory roles and above can approve transactions',
      );
    }

    const transaction = await this.findOne(id, tenantId, userId);
    if (transaction.paymentStatus !== 'PENDING') {
      throw new BadRequestException(
        'Only PENDING transactions can be approved',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      // 1. Fetch policy status inside tx to check for auto-bind
      if (transaction.type === 'PREMIUM' && transaction.policyId) {
        const linkedPolicy = await tx.policy.findUnique({
          where: { id: transaction.policyId },
          select: { status: true },
        });

        // 2. AUTO-BIND FIRST: If policy is DRAFT, bind it so installments exist
        if (linkedPolicy && linkedPolicy.status === 'DRAFT') {
          await this.policiesService.bind(
            transaction.policyId,
            tenantId,
            userId,
            tx, // Pass the transaction context
          );
          this.logger.log(`Auto-bound DRAFT policy ${transaction.policyId} during approval`);
        }
      }

      // 3. Update Transaction status
      const result = await tx.transaction.update({
        where: { id },
        data: {
          paymentStatus: 'PAID',
          processedAt: new Date(),
        },
      });

      // 4. Apply financial side-effects (now installments are guaranteed to exist if it was DRAFT)
      await this.applyPaymentSideEffects(tx, {
        type: transaction.type as any,
        invoiceId: transaction.invoiceId ?? undefined,
        policyId: transaction.policyId ?? undefined,
        amount: Number(transaction.amount),
      }, id);

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'transaction.approved',
          entity: 'Transaction',
          entityId: id,
          after: {
            previousStatus: 'PENDING',
            newStatus: 'PAID',
            approvedBy: userId,
          } as Prisma.InputJsonObject,
        },
      });

      return result;
    });

    return updated;
  }

  // ─── REJECT (PENDING → REJECTED) ───────────────────
  async reject(
    id: string,
    tenantId: string,
    userId: string,
    reason: string,
  ) {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;
    if (actorLevel < supervisorLevel) {
      throw new BadRequestException(
        'Only supervisory roles and above can reject transactions',
      );
    }

    const transaction = await this.findOne(id, tenantId, userId);
    if (transaction.paymentStatus !== 'PENDING') {
      throw new BadRequestException(
        'Only PENDING transactions can be rejected',
      );
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: { paymentStatus: 'REFUNDED' },
    });

    await this.logAudit(tenantId, userId, 'transaction.rejected', id, {
      reason,
    });

    return updated;
  }

  // ─── SHARED: Apply invoice/installment updates ─────
  private async applyPaymentSideEffects(
    tx: Prisma.TransactionClient,
    data: {
      type?: string;
      invoiceId?: string;
      policyId?: string;
      amount: number;
    },
    transactionId: string,
  ) {
    // If linked to invoice, update invoice paidAmount
    if (data.invoiceId) {
      await this.invoicesService.recordPayment(data.invoiceId, data.amount);
    }

    // If PREMIUM payment linked to policy, mark the next pending installment as PAID
    if (data.policyId && data.type === 'PREMIUM') {
      const installment = await tx.premiumInstallment.findFirst({
        where: {
          policyId: data.policyId,
          status: 'PENDING',
        },
        orderBy: { dueDate: 'asc' },
      });
      if (installment) {
        await tx.premiumInstallment.update({
          where: { id: installment.id },
          data: {
            status: 'PAID',
            paidDate: new Date(),
          },
        });
      }

      // Update policy paymentStatus using centralized method
      await this.policiesService.syncPaymentStatus(data.policyId, tx);
    }
  }
}

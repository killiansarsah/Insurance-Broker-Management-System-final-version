import { getUserRoleLevel } from '../../common/constants/role-utils.js';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { UpdateInvoiceDto, CancelInvoiceDto } from './dto/invoice-actions.dto';
import { Prisma } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomBytes } from 'crypto';
import {
  ROLE_LEVEL,
} from '../../common/constants/role-hierarchy.js';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async generateInvoiceNumber(tenantId: string): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.invoice.count({ where: { tenantId } });
    const hex = randomBytes(3).toString('hex').toUpperCase();
    return `INV-${dateStr}-${String(count + 1).padStart(5, '0')}-${hex}`;
  }

  private async assertClientWritableByActor(
    tenantId: string,
    userId: string,
    client: { assignedBrokerId: string | null },
  ): Promise<void> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    // Supervisory roles can manage invoices tenant-wide.
    if (actorLevel >= supervisorLevel) return;

    // Agent-level users can only manage invoices for assigned clients.
    if (client.assignedBrokerId !== userId) {
      throw new BadRequestException(
        'You can only manage invoices for your assigned clients',
      );
    }
  }

  private async buildInvoiceScopeWhere(
    tenantId: string,
    userId: string,
    baseWhere: Prisma.InvoiceWhereInput = {},
  ): Promise<Prisma.InvoiceWhereInput> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    if (actorLevel >= supervisorLevel) {
      return {
        AND: [{ tenantId }, baseWhere],
      };
    }

    return {
      AND: [
        { tenantId },
        baseWhere,
        {
          client: {
            assignedBrokerId: userId,
          },
        },
      ],
    };
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
        entity: 'Invoice',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(tenantId: string, userId: string, dto: CreateInvoiceDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId, tenantId },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientWritableByActor(tenantId, userId, client);

    if (dto.policyId) {
      const policy = await this.prisma.policy.findUnique({
        where: { id: dto.policyId, tenantId },
      });
      if (!policy) throw new NotFoundException('Policy not found');
    }

    const invoiceNumber = await this.generateInvoiceNumber(tenantId);
    const now = new Date();
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const invoice = await this.prisma.invoice.create({
      data: {
        tenantId,
        invoiceNumber,
        clientId: dto.clientId,
        policyId: dto.policyId,
        description: dto.description,
        amount: dto.amount,
        amountPaid: 0,
        status: 'OUTSTANDING',
        currency: 'GHS',
        dateIssued: now,
        dateDue: dueDate,
        notes: dto.notes,
      },
    });

    await this.logAudit(tenantId, userId, 'invoice.created', invoice.id);
    return invoice;
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, actorUserId: string, query: InvoiceQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      clientId,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const baseWhere: Prisma.InvoiceWhereInput = {
      ...(status && { status }),
      ...(clientId && { clientId }),
      ...((dateFrom || dateTo) && {
        dateIssued: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' as const } },
          {
            client: {
              firstName: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            client: {
              lastName: { contains: search, mode: 'insensitive' as const },
            },
          },
        ],
      }),
    };

    const where = await this.buildInvoiceScopeWhere(
      tenantId,
      actorUserId,
      baseWhere,
    );

    const allowedSortFields = [
      'invoiceNumber',
      'amount',
      'dateIssued',
      'dateDue',
      'createdAt',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const [total, items, outstandingAgg, overdueAgg, paidAgg] =
      await Promise.all([
        this.prisma.invoice.count({ where }),
        this.prisma.invoice.findMany({
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
        this.prisma.invoice.aggregate({
          where: await this.buildInvoiceScopeWhere(tenantId, actorUserId, {
            status: 'OUTSTANDING',
          }),
          _sum: { amount: true },
        }),
        this.prisma.invoice.aggregate({
          where: await this.buildInvoiceScopeWhere(tenantId, actorUserId, {
            status: 'OVERDUE',
          }),
          _sum: { amount: true },
        }),
        this.prisma.invoice.aggregate({
          where: await this.buildInvoiceScopeWhere(tenantId, actorUserId, {
            status: 'PAID',
          }),
          _sum: { amountPaid: true },
        }),
      ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalOutstanding: outstandingAgg._sum.amount || 0,
        totalOverdue: overdueAgg._sum.amount || 0,
        totalPaid: paidAgg._sum.amountPaid || 0,
      },
    };
  }

  // ─── FIND ONE ───────────────────────────────────────
  async findOne(id: string, tenantId: string, actorUserId: string) {
    const where = await this.buildInvoiceScopeWhere(tenantId, actorUserId, {
      id,
    });

    const invoice = await this.prisma.invoice.findFirst({
      where,
      include: {
        client: true,
        policy: {
          select: { id: true, policyNumber: true, insuranceType: true },
        },
        transactions: true,
      },
    });
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
    return invoice;
  }

  // ─── UPDATE (OUTSTANDING only) ──────────────────────
  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateInvoiceDto,
  ) {
    const invoice = await this.findOne(id, tenantId, userId);
    await this.assertClientWritableByActor(tenantId, userId, invoice.client);

    if (invoice.status !== 'OUTSTANDING') {
      throw new BadRequestException('Only OUTSTANDING invoices can be edited');
    }

    const updated = await this.prisma.invoice.update({
      where: { id },
      data: {
        amount: dto.amount,
        description: dto.description,
        notes: dto.notes,
      },
    });
    await this.logAudit(tenantId, userId, 'invoice.updated', id);
    return updated;
  }

  // ─── SEND (OUTSTANDING → stays OUTSTANDING, sets sentAt via audit) ─
  async send(id: string, tenantId: string, userId: string) {
    const invoice = await this.findOne(id, tenantId, userId);
    await this.assertClientWritableByActor(tenantId, userId, invoice.client);

    if (invoice.status !== 'OUTSTANDING') {
      throw new BadRequestException('Only OUTSTANDING invoices can be sent');
    }

    await this.logAudit(tenantId, userId, 'invoice.sent', id, {
      sentAt: new Date().toISOString(),
    });
    return { ...invoice, sentAt: new Date() };
  }

  // ─── CANCEL (OUTSTANDING → CANCELLED) ──────────────
  async cancel(
    id: string,
    tenantId: string,
    userId: string,
    dto: CancelInvoiceDto,
  ) {
    const invoice = await this.findOne(id, tenantId, userId);
    if (invoice.status !== 'OUTSTANDING') {
      throw new BadRequestException(
        'Only OUTSTANDING invoices can be cancelled',
      );
    }

    const updated = await this.prisma.invoice.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await this.logAudit(tenantId, userId, 'invoice.cancelled', id, {
      reason: dto.reason,
    });
    return updated;
  }

  // ─── RECORD PAYMENT (called from TransactionsService) ─
  async recordPayment(invoiceId: string, amount: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const newAmountPaid = Number(invoice.amountPaid) + amount;
    const fullyPaid = newAmountPaid >= Number(invoice.amount);

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        amountPaid: newAmountPaid,
        status: fullyPaid ? 'PAID' : 'PARTIAL',
        datePaid: fullyPaid ? new Date() : undefined,
      },
    });
  }

  // ─── REVERSE PAYMENT (called on void) ──────────────
  async reversePayment(invoiceId: string, amount: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    if (!invoice) return;

    const newAmountPaid = Math.max(0, Number(invoice.amountPaid) - amount);
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        amountPaid: newAmountPaid,
        status: newAmountPaid > 0 ? 'PARTIAL' : 'OUTSTANDING',
        datePaid: null,
      },
    });
  }

  // ─── CRON: Mark overdue ─────────────────────────────
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async markOverdueInvoices() {
    this.logger.log('Running daily invoice overdue check...');
    const now = new Date();

    const result = await this.prisma.invoice.updateMany({
      where: {
        status: 'OUTSTANDING',
        dateDue: { lt: now },
      },
      data: { status: 'OVERDUE' },
    });

    if (result.count > 0) {
      this.logger.log(`Marked ${result.count} invoices as OVERDUE`);
    }
  }
}

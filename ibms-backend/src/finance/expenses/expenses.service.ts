import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto, ImportExpensesDto } from './dto/create-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpensesService {
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
        entity: 'Expense',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(tenantId: string, userId: string, dto: CreateExpenseDto) {
    const expense = await this.prisma.expense.create({
      data: {
        tenantId,
        date: new Date(dto.date),
        description: dto.description,
        category: dto.category,
        amount: dto.amount,
        currency: 'GHS',
        vendor: dto.vendor,
        receiptUrl: dto.receiptUrl,
        department: dto.department,
        status: dto.approvalRequired ? 'PENDING' : 'APPROVED',
        notes: dto.notes,
      },
    });

    await this.logAudit(tenantId, userId, 'expense.created', expense.id);
    return expense;
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, query: ExpenseQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      category,
      department,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseWhereInput = {
      tenantId,
      ...(status && { status }),
      ...(category && { category }),
      ...(department && { department }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        OR: [
          { description: { contains: search, mode: 'insensitive' as const } },
          { vendor: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const allowedSortFields = ['amount', 'date', 'category', 'createdAt'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const [total, items] = await Promise.all([
      this.prisma.expense.count({ where }),
      this.prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          approvedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── APPROVE (PENDING → APPROVED) ──────────────────
  async approve(id: string, tenantId: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id, tenantId },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING expenses can be approved');
    }

    const updated = await this.prisma.expense.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: userId,
      },
    });

    // Auto-create an EXPENSE transaction
    const txnNumber = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      (await this.prisma.transaction.count()) + 1,
    ).padStart(6, '0')}`;

    await this.prisma.transaction.create({
      data: {
        tenantId,
        transactionNumber: txnNumber,
        type: 'EXPENSE',
        amount: expense.amount,
        currency: 'GHS',
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PAID',
        processedById: userId,
        processedAt: new Date(),
        notes: `Expense: ${expense.description}`,
      },
    });

    await this.logAudit(tenantId, userId, 'expense.approved', id);
    return updated;
  }

  // ─── BULK IMPORT ────────────────────────────────────
  async bulkImport(tenantId: string, userId: string, dto: ImportExpensesDto) {
    if (dto.expenses.length > 100) {
      throw new BadRequestException('Maximum 100 expenses per import');
    }

    const results: {
      created: number;
      errors: { row: number; message: string }[];
    } = {
      created: 0,
      errors: [],
    };

    for (let i = 0; i < dto.expenses.length; i++) {
      try {
        await this.create(tenantId, userId, dto.expenses[i]);
        results.created++;
      } catch (err) {
        results.errors.push({
          row: i + 1,
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return results;
  }
}

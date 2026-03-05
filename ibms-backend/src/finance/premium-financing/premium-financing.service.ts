import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePremiumFinancingDto,
  PfQueryDto,
  PayPfInstallmentDto,
} from './dto/premium-financing.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PremiumFinancingService {
  constructor(private readonly prisma: PrismaService) {}

  private async generatePfNumber(): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.premiumFinancing.count();
    return `PF-${dateStr}-${String(count + 1).padStart(4, '0')}`;
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
        entity: 'PremiumFinancing',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(
    tenantId: string,
    userId: string,
    dto: CreatePremiumFinancingDto,
  ) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: dto.policyId, tenantId },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId, tenantId },
    });
    if (!client) throw new NotFoundException('Client not found');

    const applicationNumber = await this.generatePfNumber();

    // Calculate interest: annual rate → monthly approximation
    const totalInterest = (dto.financedAmount * dto.interestRate) / 100;
    const totalRepayment = dto.financedAmount + totalInterest;
    const monthlyInstallment = totalRepayment / dto.numberOfInstallments;
    const interestRateMonthly = dto.interestRate / 12;

    // Create PF record + installments in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const pf = await tx.premiumFinancing.create({
        data: {
          tenantId,
          applicationNumber,
          clientId: dto.clientId,
          policyId: dto.policyId,
          totalPremium: dto.financedAmount,
          downPaymentPct: 0,
          downPayment: 0,
          financedAmount: dto.financedAmount,
          interestRateMonthly,
          totalInterest,
          totalRepayment,
          monthlyInstallment,
          numberOfInstallments: dto.numberOfInstallments,
          installmentsPaid: 0,
          amountPaid: 0,
          outstandingBalance: totalRepayment,
          status: 'ACTIVE',
          financier: dto.financier,
        },
      });

      // Generate installment schedule
      const installments: Prisma.PFInstallmentCreateManyInput[] = [];
      const startDate = new Date(dto.startDate);
      for (let i = 0; i < dto.numberOfInstallments; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i + 1);
        installments.push({
          tenantId,
          pfId: pf.id,
          number: i + 1,
          dueDate,
          amount: monthlyInstallment,
          status: 'PENDING',
        });
      }

      await tx.pFInstallment.createMany({ data: installments });

      return pf;
    });

    await this.logAudit(
      tenantId,
      userId,
      'premium_financing.created',
      result.id,
    );
    return result;
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, query: PfQueryDto) {
    const { page = 1, limit = 20, status, clientId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PremiumFinancingWhereInput = {
      tenantId,
      ...(status && { status }),
      ...(clientId && { clientId }),
    };

    const [total, items] = await Promise.all([
      this.prisma.premiumFinancing.count({ where }),
      this.prisma.premiumFinancing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── FIND ONE ───────────────────────────────────────
  async findOne(id: string, tenantId: string) {
    const pf = await this.prisma.premiumFinancing.findUnique({
      where: { id, tenantId },
      include: {
        client: true,
        policy: {
          select: { id: true, policyNumber: true, insuranceType: true },
        },
        installments: { orderBy: { number: 'asc' } },
      },
    });
    if (!pf) throw new NotFoundException('Premium financing not found');
    return pf;
  }

  // ─── PAY INSTALLMENT ───────────────────────────────
  async payInstallment(
    pfId: string,
    installmentId: string,
    tenantId: string,
    userId: string,
    dto: PayPfInstallmentDto,
  ) {
    const pf = await this.findOne(pfId, tenantId);
    const installment = await this.prisma.pFInstallment.findUnique({
      where: { id: installmentId },
    });
    if (!installment || installment.pfId !== pfId) {
      throw new NotFoundException('Installment not found');
    }
    if (installment.status !== 'PENDING') {
      throw new BadRequestException('Installment is not PENDING');
    }

    // Update installment
    await this.prisma.pFInstallment.update({
      where: { id: installmentId },
      data: { status: 'PAID', paidDate: new Date(dto.paidDate) },
    });

    // Update PF totals
    const newInstallmentsPaid = pf.installmentsPaid + 1;
    const newAmountPaid = Number(pf.amountPaid) + dto.paidAmount;
    const newOutstanding = Number(pf.totalRepayment) - newAmountPaid;
    const allPaid = newInstallmentsPaid >= pf.numberOfInstallments;

    await this.prisma.premiumFinancing.update({
      where: { id: pfId },
      data: {
        installmentsPaid: newInstallmentsPaid,
        amountPaid: newAmountPaid,
        outstandingBalance: Math.max(0, newOutstanding),
        status: allPaid ? 'COMPLETED' : undefined,
      },
    });

    // Auto-create transaction
    const txnNumber = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      (await this.prisma.transaction.count()) + 1,
    ).padStart(6, '0')}`;

    await this.prisma.transaction.create({
      data: {
        tenantId,
        transactionNumber: txnNumber,
        type: 'PREMIUM',
        amount: dto.paidAmount,
        currency: 'GHS',
        paymentMethod: dto.paymentMethod,
        paymentStatus: 'PAID',
        reference: dto.reference,
        policyId: pf.policyId,
        clientId: pf.clientId,
        processedById: userId,
        processedAt: new Date(),
        notes: `PF installment ${installment.number} for ${pf.applicationNumber}`,
      },
    });

    await this.logAudit(
      tenantId,
      userId,
      'pf.installment.paid',
      installmentId,
      { pfId, installmentNumber: installment.number },
    );
    return { installmentPaid: installment.number, allPaid };
  }
}

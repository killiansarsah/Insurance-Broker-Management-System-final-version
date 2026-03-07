import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
import { CancelPolicyDto } from './dto/cancel-policy.dto';
import { ReinstatePolicyDto } from './dto/reinstate-policy.dto';
import { CreateEndorsementDto } from './dto/endorsements/create-endorsement.dto';
import { PayInstallmentDto } from './dto/installments/pay-installment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PoliciesService {
  constructor(private readonly prisma: PrismaService) { }

  private async generatePolicyNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.policy.count();
    const padded = String(count + 1).padStart(5, '0');
    return `POL-${dateStr}-${padded}`;
  }

  private async logAudit(
    tenantId: string,
    userId: string,
    action: string,
    entityId: string,
    before: Record<string, unknown> | null = null,
    after: Record<string, unknown> | null = null,
  ) {
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        entity: 'Policy',
        entityId,
        before: before ? (before as Prisma.InputJsonObject) : Prisma.JsonNull,
        after: after ? (after as Prisma.InputJsonObject) : Prisma.JsonNull,
      },
    });
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(tenantId: string, userId: string, dto: CreatePolicyDto) {
    if (dto.insuranceType === 'MOTOR' && !dto.vehicleDetails) {
      throw new BadRequestException(
        'vehicleDetails are required for MOTOR insurance',
      );
    }
    if (dto.insuranceType === 'FIRE' && !dto.propertyDetails) {
      throw new BadRequestException(
        'propertyDetails are required for FIRE/PROPERTY insurance',
      );
    }
    if (dto.insuranceType === 'MARINE' && !dto.marineDetails) {
      throw new BadRequestException(
        'marineDetails are required for MARINE insurance',
      );
    }

    if (new Date(dto.endDate) <= new Date(dto.startDate)) {
      throw new BadRequestException(
        'endDate must be strictly greater than startDate',
      );
    }

    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId, tenantId },
    });
    if (!client) throw new NotFoundException('Client not found');

    const carrier = await this.prisma.carrier.findUnique({
      where: { id: dto.carrierId, tenantId },
    });
    if (!carrier) throw new NotFoundException('Carrier not found');

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, carrierId: dto.carrierId },
    });
    if (!product)
      throw new NotFoundException(
        'Product not found or does not belong to the carrier',
      );

    const policyNumber =
      dto.policyNumber || (await this.generatePolicyNumber());
    const currency = dto.currency || 'GHS';
    let commission = dto.commission;

    if (commission === undefined || commission === null) {
      const rate = product.commissionRate || new Prisma.Decimal(0);
      commission = Number(dto.premiumAmount) * (Number(rate) / 100);
    }

    return await this.prisma.$transaction(async (tx) => {
      const createdPolicy = await tx.policy.create({
        data: {
          tenant: { connect: { id: tenantId } },
          client: { connect: { id: dto.clientId } },
          carrier: { connect: { id: dto.carrierId } },
          product: { connect: { id: dto.productId } },
          broker: { connect: { id: userId } },
          insuranceType: dto.insuranceType,
          policyType: 'NON_LIFE',
          policyNumber,
          inceptionDate: new Date(dto.startDate),
          expiryDate: new Date(dto.endDate),
          premiumAmount: dto.premiumAmount,
          sumInsured: dto.sumInsured,
          premiumFrequency: dto.premiumFrequency,
          commissionRate: product.commissionRate,
          commissionAmount: commission,
          status: 'DRAFT',
          currency,
          coverageDetails: dto.coverageDetails,
          vehicleDetails: dto.vehicleDetails
            ? {
              create:
                dto.vehicleDetails as unknown as Prisma.VehicleDetailCreateWithoutPolicyInput,
            }
            : undefined,
          propertyDetails: dto.propertyDetails
            ? {
              create:
                dto.propertyDetails as unknown as Prisma.PropertyDetailCreateWithoutPolicyInput,
            }
            : undefined,
          marineDetails: dto.marineDetails
            ? {
              create:
                dto.marineDetails as unknown as Prisma.MarineDetailCreateWithoutPolicyInput,
            }
            : undefined,
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'policy.created',
          entity: 'Policy',
          entityId: createdPolicy.id,
          after: createdPolicy as unknown as Prisma.InputJsonObject,
        },
      });

      return createdPolicy;
    });
  }

  // ─── FIND ALL (with search, totalPremium) ───────────
  async findAll(tenantId: string, query: PolicyQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      insuranceType,
      carrierId,
      clientId,
      premiumFrequency,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.PolicyWhereInput = {
      tenantId,
      ...(status && { status }),
      ...(insuranceType && { insuranceType }),
      ...(carrierId && { carrierId }),
      ...(clientId && { clientId }),
      ...(premiumFrequency && { premiumFrequency }),
      ...(search && {
        OR: [
          { policyNumber: { contains: search, mode: 'insensitive' as const } },
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
      ...((startDateFrom || startDateTo) && {
        inceptionDate: {
          ...(startDateFrom && { gte: new Date(startDateFrom) }),
          ...(startDateTo && { lte: new Date(startDateTo) }),
        },
      }),
      ...((endDateFrom || endDateTo) && {
        expiryDate: {
          ...(endDateFrom && { gte: new Date(endDateFrom) }),
          ...(endDateTo && { lte: new Date(endDateTo) }),
        },
      }),
    };

    const allowedSortFields = [
      'policyNumber',
      'premiumAmount',
      'inceptionDate',
      'expiryDate',
      'createdAt',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const [total, items, totalPremiumAgg] = await Promise.all([
      this.prisma.policy.count({ where }),
      this.prisma.policy.findMany({
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
          carrier: { select: { id: true, name: true } },
          product: { select: { id: true, name: true } },
        },
      }),
      this.prisma.policy.aggregate({
        where,
        _sum: { premiumAmount: true },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalPremium: totalPremiumAgg._sum.premiumAmount || 0,
      },
    };
  }

  // ─── FIND ONE ───────────────────────────────────────
  async findOne(id: string, tenantId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
      include: {
        client: true,
        carrier: true,
        product: true,
        vehicleDetails: true,
        propertyDetails: true,
        marineDetails: true,
        endorsements: {
          include: {
            requestedBy: { select: { firstName: true, lastName: true } },
          },
        },
        installments: true,
        policyDocuments: true,
        claims: {
          select: {
            id: true,
            claimNumber: true,
            status: true,
            claimAmount: true,
          },
        },
      },
    });

    if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
    return policy;
  }

  // ─── UPDATE ─────────────────────────────────────────
  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdatePolicyDto,
  ) {
    const policy = await this.findOne(id, tenantId);

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.policy.update({
        where: { id },
        data: {
          premiumAmount: dto.premiumAmount,
          sumInsured: dto.sumInsured,
          expiryDate: dto.endDate ? new Date(dto.endDate) : undefined,
          coverageDetails: dto.coverageDetails,
          premiumFrequency: dto.premiumFrequency,
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'policy.updated',
          entity: 'Policy',
          entityId: id,
          before: policy as unknown as Prisma.InputJsonObject,
          after: updated as unknown as Prisma.InputJsonObject,
        },
      });

      return updated;
    });
  }

  // ─── BIND (DRAFT → ACTIVE) ─────────────────────────
  async bind(id: string, tenantId: string, userId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
      include: {
        carrier: { select: { name: true } },
        product: { select: { name: true } },
      },
    });
    if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
    if (policy.status !== 'DRAFT')
      throw new BadRequestException('Only DRAFT policies can be bound');

    return await this.prisma.$transaction(async (tx) => {
      const bound = await tx.policy.update({
        where: { id },
        data: {
          status: 'ACTIVE',
        },
      });

      const installmentsData: Prisma.PremiumInstallmentCreateManyInput[] = [];
      const amount = Number(policy.premiumAmount);
      let numInstallments = 1;

      if (policy.premiumFrequency === 'MONTHLY') numInstallments = 12;
      else if (policy.premiumFrequency === 'QUARTERLY') numInstallments = 4;
      else if (policy.premiumFrequency === 'SEMI_ANNUAL') numInstallments = 2;

      const installmentAmount = new Prisma.Decimal(amount / numInstallments);
      const startDate = new Date(policy.inceptionDate);

      for (let i = 1; i <= numInstallments; i++) {
        const dueDate = new Date(startDate);
        if (policy.premiumFrequency === 'MONTHLY')
          dueDate.setMonth(dueDate.getMonth() + (i - 1));
        else if (policy.premiumFrequency === 'QUARTERLY')
          dueDate.setMonth(dueDate.getMonth() + (i - 1) * 3);
        else if (policy.premiumFrequency === 'SEMI_ANNUAL')
          dueDate.setMonth(dueDate.getMonth() + (i - 1) * 6);

        installmentsData.push({
          tenantId,
          policyId: id,
          installmentNumber: i,
          dueDate,
          amount: installmentAmount,
          status: 'PENDING',
        });
      }

      await (tx as Prisma.TransactionClient).premiumInstallment.createMany({
        data: installmentsData,
      });

      // Auto-create commission record (spec: Phase 8, Part C, #3)
      const premiumAmount = Number(policy.premiumAmount);
      const commissionRate = Number(policy.commissionRate);
      const commissionAmount = Number(policy.commissionAmount);
      const nicLevyRate = 0.03; // NIC 3% levy
      const nicLevy = commissionAmount * nicLevyRate;
      const netCommission = commissionAmount - nicLevy;

      await (tx as Prisma.TransactionClient).commission.create({
        data: {
          tenantId,
          policyId: id,
          clientId: policy.clientId,
          insurerName: policy.carrier?.name ?? 'Unknown',
          productType: policy.product?.name,
          premiumAmount,
          commissionRate,
          commissionAmount,
          nicLevy,
          netCommission,
          status: 'PENDING',
          brokerId: policy.brokerId,
          dateEarned: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'policy.bound',
          entity: 'Policy',
          entityId: id,
        },
      });

      return bound;
    });
  }

  // ─── CANCEL (ACTIVE → CANCELLED) ───────────────────
  async cancel(
    id: string,
    tenantId: string,
    userId: string,
    dto: CancelPolicyDto,
  ) {
    const policy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
    });
    if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
    if (policy.status !== 'ACTIVE')
      throw new BadRequestException('Only ACTIVE policies can be cancelled');

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.policy.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          expiryDate: new Date(dto.effectiveDate),
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'policy.cancelled',
          entity: 'Policy',
          entityId: id,
          after: { reason: dto.reason } as Prisma.InputJsonObject,
        },
      });

      return updated;
    });
  }

  // ─── LAPSE (ACTIVE → LAPSED) ───────────────────────
  async lapse(id: string, tenantId: string, userId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
    });
    if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
    if (policy.status !== 'ACTIVE')
      throw new BadRequestException('Only ACTIVE policies can be lapsed');

    const lapsed = await this.prisma.policy.update({
      where: { id },
      data: { status: 'LAPSED' },
    });

    await this.logAudit(tenantId, userId, 'policy.lapsed', id);
    return lapsed;
  }

  // ─── REINSTATE (LAPSED → ACTIVE) ───────────────────
  async reinstate(
    id: string,
    tenantId: string,
    userId: string,
    dto: ReinstatePolicyDto,
  ) {
    const policy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
    });
    if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
    if (policy.status !== 'LAPSED')
      throw new BadRequestException('Only LAPSED policies can be reinstated');

    const reinstated = await this.prisma.policy.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    await this.logAudit(tenantId, userId, 'policy.reinstated', id, null, {
      reason: dto.reason,
    } as Prisma.InputJsonObject);

    return reinstated;
  }

  // ─── ENDORSEMENTS ──────────────────────────────────
  async createEndorsement(
    policyId: string,
    tenantId: string,
    userId: string,
    dto: CreateEndorsementDto,
  ) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId, tenantId },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    const endorsement = await this.prisma.policyEndorsement.create({
      data: {
        tenantId,
        policyId,
        type: dto.type,
        description: dto.description,
        effectiveDate: new Date(dto.effectiveDate),
        premiumAdjustment: dto.premiumAdjustment,
        status: 'PENDING',
        requestedById: userId,
      },
    });

    await this.logAudit(
      tenantId,
      userId,
      'endorsement.created',
      endorsement.id,
    );

    return endorsement;
  }

  async approveEndorsement(
    policyId: string,
    endorsementId: string,
    tenantId: string,
    userId: string,
  ) {
    const endorsement = await this.prisma.policyEndorsement.findFirst({
      where: { id: endorsementId, policyId, tenantId },
    });
    if (!endorsement) throw new NotFoundException('Endorsement not found');
    if (endorsement.status !== 'PENDING')
      throw new BadRequestException(
        'Only PENDING endorsements can be approved',
      );

    return await this.prisma.$transaction(async (tx) => {
      const approved = await tx.policyEndorsement.update({
        where: { id: endorsementId },
        data: { status: 'APPROVED', approvedById: userId },
      });

      if (endorsement.premiumAdjustment) {
        const policy = await tx.policy.findUnique({
          where: { id: policyId },
        });
        if (policy) {
          const newPremium =
            Number(policy.premiumAmount) +
            Number(endorsement.premiumAdjustment);
          await tx.policy.update({
            where: { id: policyId },
            data: { premiumAmount: newPremium },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'endorsement.approved',
          entity: 'PolicyEndorsement',
          entityId: endorsementId,
        },
      });

      return approved;
    });
  }

  async rejectEndorsement(
    policyId: string,
    endorsementId: string,
    tenantId: string,
    userId: string,
    reason: string,
  ) {
    const endorsement = await this.prisma.policyEndorsement.findFirst({
      where: { id: endorsementId, policyId, tenantId },
    });
    if (!endorsement) throw new NotFoundException('Endorsement not found');
    if (endorsement.status !== 'PENDING')
      throw new BadRequestException(
        'Only PENDING endorsements can be rejected',
      );

    const rejected = await this.prisma.policyEndorsement.update({
      where: { id: endorsementId },
      data: { status: 'REJECTED' },
    });

    await this.logAudit(
      tenantId,
      userId,
      'endorsement.rejected',
      endorsementId,
      null,
      { reason } as Record<string, unknown>,
    );

    return rejected;
  }

  // ─── INSTALLMENTS ──────────────────────────────────
  async listInstallments(policyId: string, tenantId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId, tenantId },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    return this.prisma.premiumInstallment.findMany({
      where: { policyId, tenantId },
      orderBy: { installmentNumber: 'asc' },
    });
  }

  async payInstallment(
    policyId: string,
    installmentId: string,
    tenantId: string,
    userId: string,
    dto: PayInstallmentDto,
  ) {
    const installment = await this.prisma.premiumInstallment.findFirst({
      where: { id: installmentId, policyId, tenantId },
    });
    if (!installment) throw new NotFoundException('Installment not found');
    if (installment.status === 'PAID')
      throw new BadRequestException('Installment is already paid');

    const paid = await this.prisma.premiumInstallment.update({
      where: { id: installmentId },
      data: {
        status: 'PAID',
        paidDate: new Date(dto.paidDate),
      },
    });

    await this.logAudit(
      tenantId,
      userId,
      'installment.paid',
      installmentId,
      null,
      {
        paidAmount: dto.paidAmount,
        paymentMethod: dto.paymentMethod,
        reference: dto.reference,
      } as Record<string, unknown>,
    );

    return paid;
  }
}

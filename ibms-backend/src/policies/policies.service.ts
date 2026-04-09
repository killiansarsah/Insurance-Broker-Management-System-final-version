import { getUserRoleLevel } from '../common/constants/role-utils.js';
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
import { randomBytes } from 'crypto';
import { NIC_LEVY_RATE } from '../common/constants/nic.constants';
import {
  ROLE_LEVEL,
} from '../common/constants/role-hierarchy.js';

@Injectable()
export class PoliciesService {
  constructor(private readonly prisma: PrismaService) {}

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
        'You can only manage policies for your assigned clients',
      );
    }
  }

  private async assertPolicyWritableByActor(
    tenantId: string,
    userId: string,
    policy: { brokerId: string; client: { assignedBrokerId: string | null } },
  ): Promise<void> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    if (actorLevel >= supervisorLevel) return;

    if (
      policy.brokerId !== userId &&
      policy.client.assignedBrokerId !== userId
    ) {
      throw new BadRequestException(
        'You can only manage policies you own or assigned-client policies',
      );
    }
  }

    private async buildPolicyScopeWhere(
      tenantId: string,
      userId: string,
    ): Promise<Prisma.PolicyWhereInput> {
      const actorLevel = await getUserRoleLevel(this.prisma, userId);
      const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

      if (actorLevel >= supervisorLevel) {
        return { tenantId };
      }

      return {
        tenantId,
        OR: [{ brokerId: userId }, { client: { assignedBrokerId: userId } }],
      };
    }

  private async generatePolicyNumber(
    tenantId: string,
    client?: {
      policy: {
        count: (args: { where: { tenantId: string } }) => Promise<number>;
      };
    },
  ): Promise<string> {
    const db = client ?? this.prisma;
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await db.policy.count({ where: { tenantId } });
    const padded = String(count + 1).padStart(5, '0');
    const hex = randomBytes(3).toString('hex').toUpperCase();
    return `POL-${dateStr}-${padded}-${hex}`;
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

    await this.assertClientWritableByActor(tenantId, userId, client);

    const carrier = await this.prisma.carrier.findUnique({
      where: { id: dto.carrierId, tenantId },
    });
    if (!carrier) throw new NotFoundException('Carrier not found');

    let productId = dto.productId;
    if (!productId) {
      // Auto-select a product matching the insurance type from this carrier
      const autoProduct = await this.prisma.product.findFirst({
        where: { carrierId: dto.carrierId, insuranceType: dto.insuranceType },
      });
      if (!autoProduct) {
        // Fall back to any product from this carrier
        const fallback = await this.prisma.product.findFirst({
          where: { carrierId: dto.carrierId },
        });
        if (!fallback)
          throw new NotFoundException(
            'No products found for this carrier. Please add a product first.',
          );
        productId = fallback.id;
      } else {
        productId = autoProduct.id;
      }
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId, carrierId: dto.carrierId },
    });
    if (!product)
      throw new NotFoundException(
        'Product not found or does not belong to the carrier',
      );

    const currency = dto.currency || 'GHS';
    let commission = dto.commission;

    if (commission === undefined || commission === null) {
      const rate = product.commissionRate || new Prisma.Decimal(0);
      commission = Number(dto.premiumAmount) * (Number(rate) / 100);
    }

    return await this.prisma.$transaction(async (tx) => {
      const policyNumber =
        dto.policyNumber || (await this.generatePolicyNumber(tenantId, tx));
      const createdPolicy = await tx.policy.create({
        data: {
          tenant: { connect: { id: tenantId } },
          client: { connect: { id: dto.clientId } },
          carrier: { connect: { id: dto.carrierId } },
          product: { connect: { id: productId } },
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

  async getMetrics(tenantId: string, userId: string) {
    const scopeWhere = await this.buildPolicyScopeWhere(tenantId, userId);
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      activePolicies,
      totalPremiumAgg,
      expiringSoon,
      pendingDraft,
      lapsedPolicies,
      newThisMonth
    ] = await Promise.all([
      this.prisma.policy.count({ where: { AND: [scopeWhere, { status: 'ACTIVE' }] } }),
      this.prisma.policy.aggregate({
        where: scopeWhere,
        _sum: { premiumAmount: true }
      }),
      this.prisma.policy.count({
        where: {
          AND: [
            scopeWhere,
            { status: 'ACTIVE' },
            { expiryDate: { lte: in30Days, gte: now } }
          ]
        }
      }),
      this.prisma.policy.count({
        where: { AND: [scopeWhere, { status: { in: ['PENDING', 'DRAFT'] } }] }
      }),
      this.prisma.policy.count({
        where: { AND: [scopeWhere, { status: 'LAPSED' }] }
      }),
      this.prisma.policy.count({
        where: { AND: [scopeWhere, { inceptionDate: { gte: firstDayOfMonth } }] }
      })
    ]);

    return {
      activePolicies,
      totalPremium: totalPremiumAgg._sum.premiumAmount || 0,
      expiringSoon,
      pendingDraft,
      lapsedPolicies,
      newThisMonth
    };
  }

  // ─── FIND ALL (with search, totalPremium) ───────────
  async findAll(tenantId: string, userId: string, query: PolicyQueryDto) {
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

    const baseWhere: Prisma.PolicyWhereInput = {
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

    const scopeWhere = await this.buildPolicyScopeWhere(tenantId, userId);
    const where: Prisma.PolicyWhereInput = {
      AND: [scopeWhere, baseWhere],
    };

    const allowedSortFields = [
      'policyNumber',
      'premiumAmount',
      'status',
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
          broker: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.policy.aggregate({
        where,
        _sum: { premiumAmount: true },
      }),
    ]);

    const now = new Date();
    const mappedItems = items.map((policy) => {
      const expiry = new Date(policy.expiryDate);
      const diffTime = expiry.getTime() - now.getTime();
      const daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const { client, carrier, broker, ...rest } = policy as any;
      const clientName = client?.companyName
        ? client.companyName
        : `${client?.firstName || ''} ${client?.lastName || ''}`.trim() ||
          'Unknown Client';
      const brokerName = broker
        ? `${broker.firstName} ${broker.lastName}`
        : 'Unassigned';

      return {
        ...rest,
        clientName,
        insurerName: carrier?.name || 'Unknown Insurer',
        brokerName,
        daysToExpiry,
      };
    });

    return {
      items: mappedItems,
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
  async findOne(id: string, tenantId: string, userId?: string) {
    const where: Prisma.PolicyWhereInput = userId
      ? {
          AND: [await this.buildPolicyScopeWhere(tenantId, userId), { id }],
        }
      : { id, tenantId };

    const policy = await this.prisma.policy.findFirst({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            companyName: true,
            phone: true,
            email: true,
            type: true,
          },
        },
        carrier: true,
        product: true,
        broker: { select: { id: true, firstName: true, lastName: true } },
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

    const { client, carrier, broker, ...rest } = policy as any;
    const clientName = client?.companyName
      ? client.companyName
      : `${client?.firstName || ''} ${client?.lastName || ''}`.trim() ||
        'Unknown Client';
    const brokerName = broker
      ? `${broker.firstName} ${broker.lastName}`
      : 'Unassigned';

    const now = new Date();
    const expiry = new Date(policy.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...policy,
      clientName,
      insurerName: carrier?.name || 'Unknown Insurer',
      brokerName,
      daysToExpiry,
    };
  }

  // ─── UPDATE ─────────────────────────────────────────
  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdatePolicyDto,
  ) {
    const updateData: Record<string, unknown> = {};
    if (dto.policyNumber !== undefined)
      updateData.policyNumber = dto.policyNumber;
    if (dto.premiumAmount !== undefined)
      updateData.premiumAmount = dto.premiumAmount;
    if (dto.sumInsured !== undefined) updateData.sumInsured = dto.sumInsured;
    if (dto.startDate !== undefined)
      updateData.inceptionDate = new Date(dto.startDate);
    if (dto.endDate !== undefined)
      updateData.expiryDate = new Date(dto.endDate);
    if (dto.coverageDetails !== undefined)
      updateData.coverageDetails = dto.coverageDetails;
    if (dto.premiumFrequency !== undefined)
      updateData.premiumFrequency = dto.premiumFrequency;
    if (dto.commission !== undefined) {
      updateData.commissionRate = dto.commission;
      const premium = dto.premiumAmount ?? 0;
      updateData.commissionAmount = (premium * dto.commission) / 100;
    }
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No fields to update');
    }
    const policy = await this.findOne(id, tenantId, userId);
    const writablePolicy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
      select: {
        brokerId: true,
        client: { select: { assignedBrokerId: true } },
      },
    });
    if (!writablePolicy)
      throw new NotFoundException(`Policy with ID ${id} not found`);
    await this.assertPolicyWritableByActor(tenantId, userId, writablePolicy);

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.policy.update({
        where: { id },
        data: updateData,
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
        client: { select: { assignedBrokerId: true } },
      },
    });
    if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
    await this.assertPolicyWritableByActor(tenantId, userId, policy);

    if (policy.status !== 'DRAFT' && policy.status !== 'COVER_NOTE')
      throw new BadRequestException(
        'Only DRAFT or COVER_NOTE policies can be bound',
      );

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
      const nicLevy = commissionAmount * NIC_LEVY_RATE;
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
        },
      });

      // ─── AUTO-CREATE CALENDAR EVENTS ──────────────────
      // Renewal reminders at 90/60/30 days before expiry
      if (policy.expiryDate) {
        const expiryMs = new Date(policy.expiryDate).getTime();
        const policyNum = policy.policyNumber;
        for (const daysBefore of [90, 60, 30]) {
          const reminderDate = new Date(
            expiryMs - daysBefore * 24 * 60 * 60 * 1000,
          );
          if (reminderDate > new Date()) {
            await (tx as Prisma.TransactionClient).calendarEvent.create({
              data: {
                tenantId,
                title: `Renewal Reminder: ${policyNum} (${daysBefore}d)`,
                description: `Policy ${policyNum} expires in ${daysBefore} days. Initiate renewal process.`,
                startDate: reminderDate,
                endDate: new Date(reminderDate.getTime() + 30 * 60 * 1000),
                type: 'POLICY',
                createdById: userId,
              },
            });
          }
        }
      }

      // Installment due date reminders
      for (const inst of installmentsData) {
        const dueDate = new Date(inst.dueDate);
        if (dueDate > new Date()) {
          await (tx as Prisma.TransactionClient).calendarEvent.create({
            data: {
              tenantId,
              title: `Premium Due: ${policy.policyNumber} #${inst.installmentNumber}`,
              description: `Installment ${inst.installmentNumber} of ${numInstallments} due. Amount: ${inst.amount}`,
              startDate: dueDate,
              endDate: new Date(dueDate.getTime() + 30 * 60 * 1000),
              type: 'PAYMENT',
              createdById: userId,
            },
          });
        }
      }

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

  // ─── ISSUE COVER NOTE (DRAFT → COVER_NOTE) ─────────
  async issueCoverNote(id: string, tenantId: string, userId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
      include: {
        client: { select: { assignedBrokerId: true } },
      },
    });
    if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
    await this.assertPolicyWritableByActor(tenantId, userId, policy);

    if (policy.status !== 'DRAFT')
      throw new BadRequestException(
        'Only DRAFT policies can be issued as cover notes',
      );

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.policy.update({
        where: { id },
        data: { status: 'COVER_NOTE' },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'policy.cover_note_issued',
          entity: 'Policy',
          entityId: id,
        },
      });

      return updated;
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
      include: {
        client: { select: { assignedBrokerId: true } },
      },
    });
    if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
    await this.assertPolicyWritableByActor(tenantId, userId, policy);

    if (policy.status !== 'ACTIVE')
      throw new BadRequestException('Only ACTIVE policies can be cancelled');

    const effectiveDate = new Date(dto.effectiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (effectiveDate < today) {
      throw new BadRequestException('effectiveDate cannot be in the past');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.policy.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          expiryDate: effectiveDate,
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
    return await this.prisma.$transaction(async (tx) => {
      const policy = await tx.policy.findUnique({
        where: { id, tenantId },
        include: {
          client: { select: { assignedBrokerId: true } },
        },
      });
      if (!policy)
        throw new NotFoundException(`Policy with ID ${id} not found`);
      await this.assertPolicyWritableByActor(tenantId, userId, policy);

      if (policy.status !== 'ACTIVE')
        throw new BadRequestException('Only ACTIVE policies can be lapsed');

      const lapsed = await tx.policy.update({
        where: { id },
        data: { status: 'LAPSED' },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'policy.lapsed',
          entity: 'Policy',
          entityId: id,
          before: Prisma.JsonNull,
          after: Prisma.JsonNull,
        },
      });

      return lapsed;
    });
  }

  // ─── REINSTATE (LAPSED → ACTIVE) ───────────────────
  async reinstate(
    id: string,
    tenantId: string,
    userId: string,
    dto: ReinstatePolicyDto,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const policy = await tx.policy.findUnique({
        where: { id, tenantId },
        include: {
          client: { select: { assignedBrokerId: true } },
        },
      });
      if (!policy)
        throw new NotFoundException(`Policy with ID ${id} not found`);
      await this.assertPolicyWritableByActor(tenantId, userId, policy);

      if (policy.status !== 'LAPSED')
        throw new BadRequestException('Only LAPSED policies can be reinstated');

      if (policy.expiryDate && new Date(policy.expiryDate) < new Date())
        throw new BadRequestException(
          'Cannot reinstate a policy past its expiry date – create a renewal instead',
        );

      const reinstated = await tx.policy.update({
        where: { id },
        data: { status: 'ACTIVE' },
      });

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'policy.reinstated',
          entity: 'Policy',
          entityId: id,
          before: Prisma.JsonNull,
          after: { reason: dto.reason } as Prisma.InputJsonObject,
        },
      });

      return reinstated;
    });
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
      include: {
        client: { select: { assignedBrokerId: true } },
      },
    });
    if (!policy) throw new NotFoundException('Policy not found');
    await this.assertPolicyWritableByActor(tenantId, userId, policy);

    const effectiveDate = new Date(dto.effectiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (effectiveDate < today) {
      throw new BadRequestException('effectiveDate cannot be in the past');
    }

    const endorsement = await this.prisma.policyEndorsement.create({
      data: {
        tenantId,
        policyId,
        type: dto.type,
        description: dto.description,
        effectiveDate,
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
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId, tenantId },
      select: {
        brokerId: true,
        client: { select: { assignedBrokerId: true } },
      },
    });
    if (!policy) throw new NotFoundException('Policy not found');
    await this.assertPolicyWritableByActor(tenantId, userId, policy);

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

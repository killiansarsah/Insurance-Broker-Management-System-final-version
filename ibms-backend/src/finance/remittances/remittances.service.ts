import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateRemittanceDto,
  RemittanceQueryDto,
  ConfirmRemittanceDto,
} from './dto/remittance.dto';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class RemittancesService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateRemittanceNumber(tenantId: string): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.remittance.count({ where: { tenantId } });
    const hex = randomBytes(3).toString('hex').toUpperCase();
    return `REM-${dateStr}-${String(count + 1).padStart(5, '0')}-${hex}`;
  }

  private async logAudit(
    tenantId: string,
    userId: string,
    action: string,
    entityId: string,
    before?: object,
    after?: object,
  ) {
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        entity: 'Remittance',
        entityId,
        before: before ? (before as Prisma.InputJsonValue) : undefined,
        after: after ? (after as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  async create(tenantId: string, userId: string, dto: CreateRemittanceDto) {
    // Validate policy exists and belongs to tenant
    const policy = await this.prisma.policy.findFirst({
      where: { id: dto.policyId, tenantId },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    // Validate carrier exists and belongs to tenant
    const carrier = await this.prisma.carrier.findFirst({
      where: { id: dto.carrierId, tenantId },
    });
    if (!carrier) throw new NotFoundException('Carrier not found');

    // Validate carrier matches policy carrier
    if (policy.carrierId !== dto.carrierId) {
      throw new BadRequestException(
        'Carrier does not match the policy carrier',
      );
    }

    const remittanceNumber = await this.generateRemittanceNumber(tenantId);

    const remittance = await this.prisma.remittance.create({
      data: {
        tenantId,
        remittanceNumber,
        carrierId: dto.carrierId,
        policyId: dto.policyId,
        premiumAmount: dto.premiumAmount,
        amountRemitted: dto.amountRemitted,
        status:
          dto.amountRemitted >= dto.premiumAmount ? 'REMITTED' : 'PARTIAL',
        remittanceDate: dto.remittanceDate
          ? new Date(dto.remittanceDate)
          : new Date(),
        paymentMethod: dto.paymentMethod,
        reference: dto.reference,
        notes: dto.notes,
        processedById: userId,
      },
      include: {
        carrier: { select: { name: true, shortName: true } },
        policy: {
          select: {
            policyNumber: true,
            client: {
              select: { firstName: true, lastName: true, companyName: true },
            },
          },
        },
      },
    });

    // If fully remitted, mark linked commissions as EARNED
    if (remittance.status === 'REMITTED') {
      await this.prisma.commission.updateMany({
        where: {
          tenantId,
          policyId: dto.policyId,
          status: 'PENDING',
        },
        data: {
          status: 'EARNED',
          dateEarned: new Date(),
          remittanceId: remittance.id,
        },
      });
    }

    await this.logAudit(tenantId, userId, 'CREATE', remittance.id, undefined, {
      remittanceNumber,
      carrierId: dto.carrierId,
      policyId: dto.policyId,
      amountRemitted: dto.amountRemitted,
    });

    return remittance;
  }

  async findAll(tenantId: string, query: RemittanceQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.RemittanceWhereInput = { tenantId };

    if (query.status) where.status = query.status;
    if (query.carrierId) where.carrierId = query.carrierId;
    if (query.policyId) where.policyId = query.policyId;

    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    if (query.search) {
      where.OR = [
        { remittanceNumber: { contains: query.search, mode: 'insensitive' } },
        { reference: { contains: query.search, mode: 'insensitive' } },
        {
          carrier: {
            name: { contains: query.search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.remittance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          carrier: { select: { name: true, shortName: true } },
          policy: {
            select: {
              policyNumber: true,
              client: {
                select: {
                  firstName: true,
                  lastName: true,
                  companyName: true,
                },
              },
            },
          },
          processedBy: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.remittance.count({ where }),
    ]);

    // Aggregates
    const aggregates = await this.prisma.remittance.aggregate({
      where: { tenantId },
      _sum: {
        amountRemitted: true,
        premiumAmount: true,
      },
    });

    const pendingCount = await this.prisma.remittance.count({
      where: { tenantId, status: 'PENDING' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalRemitted: aggregates._sum.amountRemitted || 0,
        totalPremium: aggregates._sum.premiumAmount || 0,
        pendingCount,
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const remittance = await this.prisma.remittance.findFirst({
      where: { id, tenantId },
      include: {
        carrier: true,
        policy: {
          include: {
            client: true,
          },
        },
        processedBy: { select: { firstName: true, lastName: true } },
        commissions: true,
        transactions: true,
      },
    });

    if (!remittance) throw new NotFoundException('Remittance not found');
    return remittance;
  }

  async confirm(
    id: string,
    tenantId: string,
    userId: string,
    dto: ConfirmRemittanceDto,
  ) {
    const remittance = await this.prisma.remittance.findFirst({
      where: { id, tenantId },
    });
    if (!remittance) throw new NotFoundException('Remittance not found');
    if (remittance.status === 'REMITTED') {
      throw new BadRequestException('Remittance already confirmed');
    }

    const updated = await this.prisma.remittance.update({
      where: { id },
      data: {
        status: 'REMITTED',
        remittanceDate: new Date(dto.remittanceDate),
        paymentMethod: dto.paymentMethod,
        reference: dto.reference,
        notes: dto.notes,
        processedById: userId,
      },
      include: {
        carrier: { select: { name: true, shortName: true } },
        policy: {
          select: { policyNumber: true },
        },
      },
    });

    // Mark linked commissions as EARNED now that remittance is confirmed
    await this.prisma.commission.updateMany({
      where: {
        tenantId,
        policyId: remittance.policyId,
        status: 'PENDING',
      },
      data: {
        status: 'EARNED',
        dateEarned: new Date(),
        remittanceId: id,
      },
    });

    await this.logAudit(
      tenantId,
      userId,
      'CONFIRM',
      id,
      { status: remittance.status },
      { status: 'REMITTED' },
    );

    return updated;
  }
}

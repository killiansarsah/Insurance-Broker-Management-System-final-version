import { getUserRoleLevel } from '../common/constants/role-utils.js';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateApprovalDto,
  ApprovalQueryDto,
  ApprovalDecisionDto,
} from './dto/approval.dto';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import {
  ROLE_LEVEL,
} from '../common/constants/role-hierarchy.js';

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateRefNumber(tenantId: string): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.approval.count({ where: { tenantId } });
    const hex = randomBytes(3).toString('hex').toUpperCase();
    return `APR-${dateStr}-${String(count + 1).padStart(5, '0')}-${hex}`;
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
        entity: 'Approval',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  async create(tenantId: string, userId: string, dto: CreateApprovalDto) {
    const refNumber = await this.generateRefNumber(tenantId);

    const approval = await this.prisma.approval.create({
      data: {
        tenantId,
        refNumber,
        type: dto.type,
        subject: dto.subject,
        clientName: dto.clientName,
        amount: dto.amount,
        linkedEntityType: dto.linkedEntityType,
        linkedEntityId: dto.linkedEntityId,
        notes: dto.notes,
        requestedById: userId,
        status: 'PENDING',
      },
    });

    await this.logAudit(tenantId, userId, 'approval.created', approval.id);
    return approval;
  }

  async findAll(tenantId: string, userId: string, query: ApprovalQueryDto) {
    const { page = 1, limit = 20, status, type, sortOrder = 'desc' } = query;

    const skip = (page - 1) * limit;
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    const where: Prisma.ApprovalWhereInput = {
      tenantId,
      ...(actorLevel < supervisorLevel && { requestedById: userId }),
      ...(status && { status }),
      ...(type && { type }),
    };

    const [total, items] = await Promise.all([
      this.prisma.approval.count({ where }),
      this.prisma.approval.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
        include: {
          requestedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
          approvedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMyRequests(tenantId: string, userId: string) {
    return this.prisma.approval.findMany({
      where: { tenantId, requestedById: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        approvedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async approve(
    id: string,
    tenantId: string,
    userId: string,
    dto: ApprovalDecisionDto,
  ) {
    const approval = await this.prisma.approval.findUnique({
      where: { id, tenantId },
    });
    if (!approval) throw new NotFoundException('Approval not found');
    if (approval.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING approvals can be approved');
    }

    const updated = await this.prisma.approval.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: userId,
        notes: dto.notes,
      },
    });

    await this.logAudit(tenantId, userId, 'approval.approved', id, {
      notes: dto.notes,
    });
    return updated;
  }

  async reject(
    id: string,
    tenantId: string,
    userId: string,
    dto: ApprovalDecisionDto,
  ) {
    const approval = await this.prisma.approval.findUnique({
      where: { id, tenantId },
    });
    if (!approval) throw new NotFoundException('Approval not found');
    if (approval.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING approvals can be rejected');
    }

    const updated = await this.prisma.approval.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedById: userId,
        notes: dto.reason ?? dto.notes,
      },
    });

    await this.logAudit(tenantId, userId, 'approval.rejected', id, {
      reason: dto.reason,
    });
    return updated;
  }
}

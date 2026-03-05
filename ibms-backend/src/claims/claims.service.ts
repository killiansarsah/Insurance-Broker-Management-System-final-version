import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { ClaimQueryDto } from './dto/claim-query.dto';
import {
  UpdateClaimDto,
  AcknowledgeClaimDto,
  InvestigateClaimDto,
  ApproveClaimDto,
  RejectClaimDto,
  SettleClaimDto,
  ReopenClaimDto,
  CreateClaimDocumentDto,
} from './dto/claim-actions.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateClaimNumber(): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.claim.count();
    return `CLM-${dateStr}-${String(count + 1).padStart(5, '0')}`;
  }

  private addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) added++;
    }
    return result;
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
        entity: 'Claim',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(tenantId: string, userId: string, dto: CreateClaimDto) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: dto.policyId, tenantId },
    });
    if (!policy) throw new NotFoundException('Policy not found in this tenant');
    if (policy.status !== 'ACTIVE' && policy.status !== 'EXPIRED') {
      throw new BadRequestException(
        'Claims can only be filed for ACTIVE or EXPIRED policies',
      );
    }

    const now = new Date();
    const claimNumber = await this.generateClaimNumber();

    const claim = await this.prisma.claim.create({
      data: {
        tenantId,
        claimNumber,
        status: 'INTIMATED',
        policyId: dto.policyId,
        clientId: policy.clientId,
        insuranceType: policy.insuranceType,
        incidentDate: new Date(dto.incidentDate),
        incidentDescription: dto.description,
        incidentLocation: dto.location,
        claimAmount: dto.claimAmount ?? 0,
        intimationDate: now,
        acknowledgmentDeadline: this.addBusinessDays(now, 5),
        processingDeadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await this.logAudit(tenantId, userId, 'claim.created', claim.id);
    return claim;
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, query: ClaimQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      carrierId,
      policyId,
      clientId,
      isOverdue,
      reportedFrom,
      reportedTo,
      incidentFrom,
      incidentTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const now = new Date();

    const where: Prisma.ClaimWhereInput = {
      tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(policyId && { policyId }),
      ...(clientId && { clientId }),
      ...(carrierId && { policy: { carrierId } }),
      ...(isOverdue === true && {
        OR: [
          { acknowledgmentDeadline: { lt: now }, status: 'INTIMATED' },
          {
            processingDeadline: { lt: now },
            status: { notIn: ['SETTLED', 'CLOSED'] },
          },
        ],
      }),
      ...(search && {
        OR: [
          { claimNumber: { contains: search, mode: 'insensitive' as const } },
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
      ...((reportedFrom || reportedTo) && {
        intimationDate: {
          ...(reportedFrom && { gte: new Date(reportedFrom) }),
          ...(reportedTo && { lte: new Date(reportedTo) }),
        },
      }),
      ...((incidentFrom || incidentTo) && {
        incidentDate: {
          ...(incidentFrom && { gte: new Date(incidentFrom) }),
          ...(incidentTo && { lte: new Date(incidentTo) }),
        },
      }),
    };

    const allowedSortFields = [
      'claimNumber',
      'claimAmount',
      'intimationDate',
      'incidentDate',
      'acknowledgmentDeadline',
      'createdAt',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const [total, items, totalClaimAmountAgg, overdueCount] = await Promise.all(
      [
        this.prisma.claim.count({ where }),
        this.prisma.claim.findMany({
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
        this.prisma.claim.aggregate({
          where,
          _sum: { claimAmount: true },
        }),
        this.prisma.claim.count({
          where: {
            tenantId,
            deletedAt: null,
            OR: [
              { acknowledgmentDeadline: { lt: now }, status: 'INTIMATED' },
              {
                processingDeadline: { lt: now },
                status: { notIn: ['SETTLED', 'CLOSED'] },
              },
            ],
          },
        }),
      ],
    );

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalClaimAmount: totalClaimAmountAgg._sum.claimAmount || 0,
        overdueCount,
      },
    };
  }

  // ─── FIND ONE ───────────────────────────────────────
  async findOne(id: string, tenantId: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id, tenantId },
      include: {
        client: true,
        policy: {
          select: {
            id: true,
            policyNumber: true,
            insuranceType: true,
            sumInsured: true,
            premiumAmount: true,
          },
        },
        assessor: {
          select: { id: true, firstName: true, lastName: true },
        },
        claimDocuments: true,
      },
    });
    if (!claim) throw new NotFoundException(`Claim with ID ${id} not found`);
    return claim;
  }

  // ─── UPDATE ─────────────────────────────────────────
  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateClaimDto,
  ) {
    await this.findOne(id, tenantId);
    const updated = await this.prisma.claim.update({
      where: { id },
      data: {
        claimAmount: dto.claimAmount,
        incidentDescription: dto.description,
        incidentLocation: dto.location,
      },
    });
    await this.logAudit(tenantId, userId, 'claim.updated', id);
    return updated;
  }

  // ─── ACKNOWLEDGE (INTIMATED → REGISTERED) ──────────
  async acknowledge(
    id: string,
    tenantId: string,
    userId: string,
    dto: AcknowledgeClaimDto,
  ) {
    const claim = await this.findOne(id, tenantId);
    if (claim.status !== 'INTIMATED') {
      throw new BadRequestException(
        'Only INTIMATED claims can be acknowledged',
      );
    }

    const now = new Date();
    const isOverdue5Day = now > new Date(claim.acknowledgmentDeadline);

    const updated = await this.prisma.claim.update({
      where: { id },
      data: {
        status: 'REGISTERED',
        registrationDate: now,
        isOverdue: isOverdue5Day,
      },
    });

    await this.logAudit(tenantId, userId, 'claim.acknowledged', id, {
      isOverdue5Day,
      notes: dto.notes,
    });
    return { ...updated, isOverdue5Day };
  }

  // ─── INVESTIGATE (REGISTERED → UNDER_REVIEW) ───────
  async investigate(
    id: string,
    tenantId: string,
    userId: string,
    dto: InvestigateClaimDto,
  ) {
    const claim = await this.findOne(id, tenantId);
    if (claim.status !== 'REGISTERED') {
      throw new BadRequestException(
        'Only REGISTERED claims can move to investigation',
      );
    }

    const updated = await this.prisma.claim.update({
      where: { id },
      data: {
        status: 'UNDER_REVIEW',
        assessorId: dto.assignedTo,
      },
    });

    await this.logAudit(tenantId, userId, 'claim.investigation_started', id, {
      assignedTo: dto.assignedTo,
      notes: dto.notes,
    });
    return updated;
  }

  // ─── APPROVE (UNDER_REVIEW → APPROVED) ─────────────
  async approve(
    id: string,
    tenantId: string,
    userId: string,
    dto: ApproveClaimDto,
  ) {
    const claim = await this.prisma.claim.findUnique({
      where: { id, tenantId },
      include: {
        policy: { select: { sumInsured: true } },
      },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    if (claim.status !== 'UNDER_REVIEW') {
      throw new BadRequestException('Only claims UNDER_REVIEW can be approved');
    }
    if (dto.approvedAmount > Number(claim.policy.sumInsured)) {
      throw new BadRequestException(
        'Approved amount cannot exceed policy sum insured',
      );
    }

    const updated = await this.prisma.claim.update({
      where: { id },
      data: {
        status: 'APPROVED',
        assessedAmount: dto.approvedAmount,
      },
    });

    await this.logAudit(tenantId, userId, 'claim.approved', id, {
      approvedAmount: dto.approvedAmount,
      notes: dto.notes,
    });
    return updated;
  }

  // ─── REJECT (UNDER_REVIEW → REJECTED) ──────────────
  async reject(
    id: string,
    tenantId: string,
    userId: string,
    dto: RejectClaimDto,
  ) {
    const claim = await this.findOne(id, tenantId);
    if (claim.status !== 'UNDER_REVIEW') {
      throw new BadRequestException('Only claims UNDER_REVIEW can be rejected');
    }

    const updated = await this.prisma.claim.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: dto.reason,
      },
    });

    await this.logAudit(tenantId, userId, 'claim.rejected', id, {
      reason: dto.reason,
      notes: dto.notes,
    });
    return updated;
  }

  // ─── SETTLE (APPROVED → SETTLED) ───────────────────
  async settle(
    id: string,
    tenantId: string,
    userId: string,
    dto: SettleClaimDto,
  ) {
    const claim = await this.findOne(id, tenantId);
    if (claim.status !== 'APPROVED') {
      throw new BadRequestException('Only APPROVED claims can be settled');
    }

    const now = new Date();
    const isOverdue30Day = now > new Date(claim.processingDeadline);

    const updated = await this.prisma.claim.update({
      where: { id },
      data: {
        status: 'SETTLED',
        settledAmount: dto.settledAmount,
        settlementDate: now,
        isOverdue: claim.isOverdue || isOverdue30Day,
      },
    });

    await this.logAudit(tenantId, userId, 'claim.settled', id, {
      settledAmount: dto.settledAmount,
      paymentMethod: dto.paymentMethod,
      paymentReference: dto.paymentReference,
      isOverdue30Day,
      notes: dto.notes,
    });
    return { ...updated, isOverdue30Day };
  }

  // ─── REOPEN (REJECTED → UNDER_REVIEW) ──────────────
  async reopen(
    id: string,
    tenantId: string,
    userId: string,
    dto: ReopenClaimDto,
  ) {
    const claim = await this.findOne(id, tenantId);
    if (claim.status !== 'REJECTED') {
      throw new BadRequestException('Only REJECTED claims can be reopened');
    }

    const updated = await this.prisma.claim.update({
      where: { id },
      data: {
        status: 'UNDER_REVIEW',
        rejectionReason: null,
      },
    });

    await this.logAudit(tenantId, userId, 'claim.reopened', id, {
      reason: dto.reason,
    });
    return updated;
  }

  // ─── DOCUMENTS ─────────────────────────────────────
  async addDocument(
    claimId: string,
    tenantId: string,
    userId: string,
    dto: CreateClaimDocumentDto,
  ) {
    await this.findOne(claimId, tenantId);
    const doc = await this.prisma.claimDocument.create({
      data: {
        tenantId,
        claimId,
        name: dto.name,
        type: dto.type,
        url: dto.url,
      },
    });

    await this.logAudit(tenantId, userId, 'claim.document.added', doc.id);
    return doc;
  }

  async listDocuments(claimId: string, tenantId: string) {
    await this.findOne(claimId, tenantId);
    return this.prisma.claimDocument.findMany({
      where: { claimId, tenantId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async removeDocument(
    claimId: string,
    docId: string,
    tenantId: string,
    userId: string,
  ) {
    const doc = await this.prisma.claimDocument.findFirst({
      where: { id: docId, claimId, tenantId },
    });
    if (!doc) throw new NotFoundException('Document not found');

    await this.prisma.claimDocument.delete({ where: { id: docId } });
    await this.logAudit(tenantId, userId, 'claim.document.removed', docId);
    return { deleted: true };
  }
}

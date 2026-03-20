import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnhancedEmailService } from '../email/enhanced-email.service';
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
import { CreateClaimFollowUpDto } from './dto/claim-follow-up.dto';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class ClaimsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EnhancedEmailService,
  ) {}

  private async generateClaimNumber(tenantId: string, client?: { claim: { count: (args: { where: { tenantId: string } }) => Promise<number> } }): Promise<string> {
    const db = client ?? this.prisma;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await db.claim.count({ where: { tenantId } });
    const hex = randomBytes(3).toString('hex').toUpperCase();
    return `CLM-${dateStr}-${String(count + 1).padStart(5, '0')}-${hex}`;
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

  private getValidTransitions(currentStatus: string): string[] {
    const map: Record<string, string[]> = {
      INTIMATED: ['REGISTERED'],
      REGISTERED: ['UNDER_REVIEW', 'DOCUMENTS_PENDING'],
      DOCUMENTS_PENDING: ['UNDER_REVIEW'],
      UNDER_REVIEW: ['ASSESSED', 'REJECTED'],
      ASSESSED: ['APPROVED', 'REJECTED'],
      APPROVED: ['SETTLED'],
      REJECTED: ['UNDER_REVIEW'],
      SETTLED: ['CLOSED'],
      CLOSED: [],
    };
    return map[currentStatus] || [];
  }

  private async enforceTransitionAndLog(
    tx: Prisma.TransactionClient,
    claim: any,
    toStatus: any,
    userId: string,
    tenantId: string,
    notes?: string,
  ) {
    const valid = this.getValidTransitions(claim.status);
    if (!valid.includes(toStatus)) {
      throw new BadRequestException(`Invalid transition from ${claim.status} to ${toStatus}`);
    }

    await tx.claimStatusHistory.create({
      data: {
        tenantId,
        claimId: claim.id,
        fromStatus: claim.status,
        toStatus,
        changedBy: userId,
        notes,
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

    if (
      new Date(dto.incidentDate) < new Date(policy.inceptionDate) ||
      new Date(dto.incidentDate) > new Date(policy.expiryDate)
    ) {
      throw new BadRequestException(
        'Incident date falls outside the policy period. Claim cannot be lodged.',
      );
    }

    const now = new Date();

    return await this.prisma.$transaction(async (tx) => {
      const claimNumber = await this.generateClaimNumber(tenantId, tx);

      const claim = await tx.claim.create({
        data: {
          tenantId,
          claimNumber,
          status: 'INTIMATED',
          policyId: dto.policyId,
          clientId: policy.clientId,
          insuranceType: policy.insuranceType,
          perilType: dto.perilType,
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
    });
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
    const claim = await this.findOne(id, tenantId);
    
    const updateData: Record<string, unknown> = {};
    if (dto.claimAmount !== undefined) updateData.claimAmount = dto.claimAmount;
    if (dto.description !== undefined) updateData.incidentDescription = dto.description;
    if (dto.location !== undefined) updateData.incidentLocation = dto.location;
    if (dto.insurerReference !== undefined) updateData.insurerReference = dto.insurerReference;
    if (dto.insurerSubmissionDate !== undefined) updateData.insurerSubmissionDate = dto.insurerSubmissionDate;
    if (dto.deductibleAmount !== undefined) updateData.deductibleAmount = dto.deductibleAmount;
    if (dto.notes !== undefined) updateData.appealNotes = dto.notes; // Basic mapping

    if (Object.keys(updateData).length === 0 && dto.assessedAmount === undefined) {
      throw new BadRequestException('No fields to update');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.assessedAmount !== undefined) {
        await this.enforceTransitionAndLog(tx, claim, 'ASSESSED', userId, tenantId, 'Assessed via update endpoint');
        updateData.assessedAmount = dto.assessedAmount;
        updateData.assessmentDate = new Date();
        updateData.status = 'ASSESSED';
      }

      return await tx.claim.update({
        where: { id },
        data: updateData,
      });
    });

    await this.logAudit(tenantId, userId, 'claim.updated', id, updateData);
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

    const updated = await this.prisma.$transaction(async (tx) => {
      await this.enforceTransitionAndLog(tx, claim, 'REGISTERED', userId, tenantId, dto.notes);
      
      return await tx.claim.update({
        where: { id },
        data: {
          status: 'REGISTERED',
          registrationDate: now,
          isOverdue: isOverdue5Day,
        },
      });
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

    const updated = await this.prisma.$transaction(async (tx) => {
      await this.enforceTransitionAndLog(tx, claim, 'UNDER_REVIEW', userId, tenantId, dto.notes);
      
      return await tx.claim.update({
        where: { id },
        data: {
          status: 'UNDER_REVIEW',
          assessorId: dto.assignedTo,
        },
      });
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
        client: { select: { firstName: true, lastName: true, email: true } },
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

    const updated = await this.prisma.$transaction(async (tx) => {
      await this.enforceTransitionAndLog(tx, claim, 'APPROVED', userId, tenantId, dto.notes);

      return await tx.claim.update({
        where: { id },
        data: {
          status: 'APPROVED',
          assessedAmount: dto.approvedAmount,
        },
      });
    });

    if (claim.client?.email) {
      const clientName = `${claim.client.firstName} ${claim.client.lastName}`;
      await this.emailService.sendClaimStatusUpdate(
        claim.client.email,
        clientName,
        claim.claimNumber,
        'UNDER_REVIEW',
        'APPROVED',
        dto.approvedAmount,
        dto.notes,
      );
    }

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
    const claim = await this.prisma.claim.findUnique({
      where: { id, tenantId },
      include: {
        client: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    if (claim.status !== 'UNDER_REVIEW') {
      throw new BadRequestException('Only claims UNDER_REVIEW can be rejected');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await this.enforceTransitionAndLog(tx, claim, 'REJECTED', userId, tenantId, dto.notes);

      return await tx.claim.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: dto.reason,
        },
      });
    });

    if (claim.client?.email) {
      const clientName = `${claim.client.firstName} ${claim.client.lastName}`;
      await this.emailService.sendClaimStatusUpdate(
        claim.client.email,
        clientName,
        claim.claimNumber,
        'UNDER_REVIEW',
        'REJECTED',
        Number(claim.claimAmount),
        dto.reason,
      );
    }

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

    const updated = await this.prisma.$transaction(async (tx) => {
      await this.enforceTransitionAndLog(tx, claim, 'SETTLED', userId, tenantId, dto.notes);

      const settled = await tx.claim.update({
        where: { id },
        data: {
          status: 'SETTLED',
          settledAmount: dto.settledAmount,
          settlementDate: now,
          deductibleAmount: dto.deductibleAmount,
          isOverdue: claim.isOverdue || isOverdue30Day,
        },
      });

      // Update Policy claim statistics (GAP-8)
      await tx.policy.update({
        where: { id: claim.policyId },
        data: {
          claimCount: { increment: 1 },
          totalClaimsValue: { increment: dto.settledAmount },
        },
      });

      return settled;
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

    const updated = await this.prisma.$transaction(async (tx) => {
      await this.enforceTransitionAndLog(tx, claim, 'UNDER_REVIEW', userId, tenantId, dto.appealNotes);

      return await tx.claim.update({
        where: { id },
        data: {
          status: 'UNDER_REVIEW',
          rejectionReason: null,
          appealNotes: dto.appealNotes,
        },
      });
    });

    await this.logAudit(tenantId, userId, 'claim.reopened', id, {
      reason: dto.reason,
      appealNotes: dto.appealNotes,
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
        type: dto.type as any,
        url: dto.url,
        uploadedBy: userId,
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

  // ─── FOLLOW-UP / CHASE LOG ──────────────────────────

  async addFollowUp(
    claimId: string,
    tenantId: string,
    userId: string,
    dto: CreateClaimFollowUpDto,
  ) {
    await this.findOne(claimId, tenantId);

    const followUp = await this.prisma.claimFollowUp.create({
      data: {
        tenantId,
        claimId,
        userId,
        method: dto.method,
        note: dto.note,
        contactName: dto.contactName,
        nextAction: dto.nextAction,
        followUpDate: dto.followUpDate
          ? new Date(dto.followUpDate)
          : new Date(),
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    await this.logAudit(tenantId, userId, 'claim.follow_up.added', claimId, {
      method: dto.method,
      note: dto.note,
    });

    return followUp;
  }

  async listFollowUps(claimId: string, tenantId: string) {
    await this.findOne(claimId, tenantId);

    return this.prisma.claimFollowUp.findMany({
      where: { claimId, tenantId },
      orderBy: { followUpDate: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });
  }
}

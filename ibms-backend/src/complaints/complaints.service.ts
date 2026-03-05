import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintQueryDto } from './dto/complaint-query.dto';
import {
  UpdateComplaintDto,
  AssignComplaintDto,
  EscalateComplaintDto,
  ResolveComplaintDto,
  ReopenComplaintDto,
} from './dto/complaint-actions.dto';
import { Prisma, ComplaintPriority } from '@prisma/client';

const SLA_DAYS: Record<string, number> = {
  LOW: 10,
  MEDIUM: 5,
  HIGH: 3,
  CRITICAL: 1,
};

const PRIORITY_ORDER: ComplaintPriority[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
];

@Injectable()
export class ComplaintsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateComplaintNumber(): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.complaint.count();
    return `CMP-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }

  private calculateSlaDeadline(priority: string): Date {
    const days = SLA_DAYS[priority] ?? 5;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    return deadline;
  }

  private bumpPriority(current: ComplaintPriority): ComplaintPriority {
    const idx = PRIORITY_ORDER.indexOf(current);
    if (idx < PRIORITY_ORDER.length - 1) {
      return PRIORITY_ORDER[idx + 1];
    }
    return current;
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
        entity: 'Complaint',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(tenantId: string, userId: string, dto: CreateComplaintDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId, tenantId },
    });
    if (!client) throw new NotFoundException('Client not found');

    const complaintNumber = await this.generateComplaintNumber();
    const slaDeadline = this.calculateSlaDeadline(dto.priority);

    const complaint = await this.prisma.complaint.create({
      data: {
        tenantId,
        complaintNumber,
        status: 'REGISTERED',
        priority: dto.priority,
        complainantName:
          client.companyName ||
          `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim(),
        complainantPhone: client.phone,
        complainantEmail: client.email,
        subject: dto.subject,
        category: dto.category,
        description: dto.description,
        slaDeadline,
      },
    });

    await this.logAudit(tenantId, userId, 'complaint.created', complaint.id);
    return complaint;
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, query: ComplaintQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      category,
      priority,
      isOverdue,
      assignedToId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const now = new Date();

    const where: Prisma.ComplaintWhereInput = {
      tenantId,
      ...(status && { status }),
      ...(category && { category }),
      ...(priority && { priority }),
      ...(assignedToId && { assignedToId }),
      ...(isOverdue === true && {
        slaDeadline: { lt: now },
        status: { notIn: ['RESOLVED', 'CLOSED'] },
      }),
      ...(search && {
        OR: [
          {
            complaintNumber: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            subject: { contains: search, mode: 'insensitive' as const },
          },
          {
            complainantName: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const allowedSortFields = [
      'priority',
      'createdAt',
      'slaDeadline',
      'complaintNumber',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const [total, items, overdueCount] = await Promise.all([
      this.prisma.complaint.count({ where }),
      this.prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          assignedTo: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.complaint.count({
        where: {
          tenantId,
          slaDeadline: { lt: now },
          status: { notIn: ['RESOLVED', 'CLOSED'] },
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
        overdueCount,
      },
    };
  }

  // ─── FIND ONE ───────────────────────────────────────
  async findOne(id: string, tenantId: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id, tenantId },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    return complaint;
  }

  // ─── UPDATE ─────────────────────────────────────────
  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateComplaintDto,
  ) {
    await this.findOne(id, tenantId);
    const updated = await this.prisma.complaint.update({
      where: { id },
      data: {
        description: dto.description,
        category: dto.category,
        priority: dto.priority,
      },
    });
    await this.logAudit(tenantId, userId, 'complaint.updated', id);
    return updated;
  }

  // ─── ASSIGN (REGISTERED → ASSIGNED) ────────────────
  async assign(
    id: string,
    tenantId: string,
    userId: string,
    dto: AssignComplaintDto,
  ) {
    const complaint = await this.findOne(id, tenantId);
    if (complaint.status !== 'REGISTERED') {
      throw new BadRequestException(
        'Only REGISTERED complaints can be assigned',
      );
    }

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: {
        status: 'UNDER_INVESTIGATION',
        assignedToId: dto.assignedToId,
      },
    });

    await this.logAudit(tenantId, userId, 'complaint.assigned', id, {
      assignedToId: dto.assignedToId,
    });
    return updated;
  }

  // ─── ESCALATE (UNDER_INVESTIGATION → ESCALATED) ────
  async escalate(
    id: string,
    tenantId: string,
    userId: string,
    dto: EscalateComplaintDto,
  ) {
    const complaint = await this.findOne(id, tenantId);
    if (complaint.status !== 'UNDER_INVESTIGATION') {
      throw new BadRequestException(
        'Only complaints UNDER_INVESTIGATION can be escalated',
      );
    }

    const newPriority = this.bumpPriority(complaint.priority);
    const newSlaDeadline = this.calculateSlaDeadline(newPriority);

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: {
        status: 'ESCALATED',
        priority: newPriority,
        slaDeadline: newSlaDeadline,
        escalationLevel: complaint.escalationLevel + 1,
        assignedToId: dto.escalatedToId,
      },
    });

    await this.logAudit(tenantId, userId, 'complaint.escalated', id, {
      reason: dto.reason,
      escalatedToId: dto.escalatedToId,
      newPriority,
    });
    return updated;
  }

  // ─── RESOLVE (UNDER_INVESTIGATION|ESCALATED → RESOLVED) ─
  async resolve(
    id: string,
    tenantId: string,
    userId: string,
    dto: ResolveComplaintDto,
  ) {
    const complaint = await this.findOne(id, tenantId);
    if (
      complaint.status !== 'UNDER_INVESTIGATION' &&
      complaint.status !== 'ESCALATED'
    ) {
      throw new BadRequestException(
        'Only IN_PROGRESS or ESCALATED complaints can be resolved',
      );
    }

    const now = new Date();
    const resolutionTimeHours = Math.round(
      (now.getTime() - new Date(complaint.createdAt).getTime()) /
        (1000 * 60 * 60),
    );

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: now,
        resolutionDetails: dto.resolution,
        isBreached: now > new Date(complaint.slaDeadline),
      },
    });

    await this.logAudit(tenantId, userId, 'complaint.resolved', id, {
      resolution: dto.resolution,
      resolutionCategory: dto.resolutionCategory,
      resolutionTimeHours,
    });
    return { ...updated, resolutionTimeHours };
  }

  // ─── REOPEN (RESOLVED → UNDER_INVESTIGATION) ───────
  async reopen(
    id: string,
    tenantId: string,
    userId: string,
    dto: ReopenComplaintDto,
  ) {
    const complaint = await this.findOne(id, tenantId);
    if (complaint.status !== 'RESOLVED') {
      throw new BadRequestException('Only RESOLVED complaints can be reopened');
    }

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: {
        status: 'UNDER_INVESTIGATION',
        resolvedAt: null,
        resolutionDetails: null,
      },
    });

    await this.logAudit(tenantId, userId, 'complaint.reopened', id, {
      reason: dto.reason,
    });
    return updated;
  }

  // ─── CLOSE (RESOLVED → CLOSED) ─────────────────────
  async close(id: string, tenantId: string, userId: string) {
    const complaint = await this.findOne(id, tenantId);
    if (complaint.status !== 'RESOLVED') {
      throw new BadRequestException('Only RESOLVED complaints can be closed');
    }

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: { status: 'CLOSED' },
    });

    await this.logAudit(tenantId, userId, 'complaint.closed', id);
    return updated;
  }

  // ─── ESCALATIONS DASHBOARD ─────────────────────────
  async getEscalations(tenantId: string) {
    const now = new Date();

    const [overdueClaims, escalatedComplaints, criticalComplaints] =
      await Promise.all([
        this.prisma.claim.findMany({
          where: {
            tenantId,
            deletedAt: null,
            status: { notIn: ['SETTLED', 'CLOSED'] },
            OR: [
              { acknowledgmentDeadline: { lt: now }, status: 'INTIMATED' },
              { processingDeadline: { lt: now } },
            ],
          },
          select: {
            id: true,
            claimNumber: true,
            acknowledgmentDeadline: true,
            processingDeadline: true,
            status: true,
          },
          orderBy: { acknowledgmentDeadline: 'asc' },
          take: 50,
        }),
        this.prisma.complaint.findMany({
          where: {
            tenantId,
            status: 'ESCALATED',
          },
          select: {
            id: true,
            complaintNumber: true,
            subject: true,
            slaDeadline: true,
            priority: true,
          },
          orderBy: { slaDeadline: 'asc' },
          take: 50,
        }),
        this.prisma.complaint.findMany({
          where: {
            tenantId,
            priority: { in: ['HIGH', 'CRITICAL'] },
            status: { notIn: ['RESOLVED', 'CLOSED'] },
            slaDeadline: {
              lte: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          select: {
            id: true,
            complaintNumber: true,
            subject: true,
            slaDeadline: true,
            priority: true,
          },
          orderBy: { slaDeadline: 'asc' },
          take: 50,
        }),
      ]);

    const items: Array<{
      type: string;
      id: string;
      reference: string;
      subject: string;
      deadline: Date;
      overdueByHours: number;
      priority: string;
    }> = [];

    for (const claim of overdueClaims) {
      const deadline =
        claim.status === 'INTIMATED'
          ? claim.acknowledgmentDeadline
          : claim.processingDeadline;
      const overdueByHours = Math.max(
        0,
        Math.round((now.getTime() - deadline.getTime()) / (1000 * 60 * 60)),
      );
      items.push({
        type: 'CLAIM',
        id: claim.id,
        reference: claim.claimNumber,
        subject: `Claim ${claim.claimNumber} overdue`,
        deadline,
        overdueByHours,
        priority: overdueByHours > 48 ? 'CRITICAL' : 'HIGH',
      });
    }

    for (const complaint of [...escalatedComplaints, ...criticalComplaints]) {
      const overdueByHours = Math.max(
        0,
        Math.round(
          (now.getTime() - new Date(complaint.slaDeadline).getTime()) /
            (1000 * 60 * 60),
        ),
      );
      if (!items.some((i) => i.id === complaint.id)) {
        items.push({
          type: 'COMPLAINT',
          id: complaint.id,
          reference: complaint.complaintNumber,
          subject: complaint.subject,
          deadline: complaint.slaDeadline,
          overdueByHours,
          priority: complaint.priority,
        });
      }
    }

    items.sort((a, b) => b.overdueByHours - a.overdueByHours);
    return items;
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto, UpdateLeadStageDto } from './dto/lead-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Prisma, LeadStatus } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateLeadNumber(): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.lead.count();
    return `LEAD-${dateStr}-${String(count + 1).padStart(5, '0')}`;
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
        entity: 'Lead',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  // ─── CREATE ─────────────────────────────────────────
  async create(tenantId: string, userId: string, dto: CreateLeadDto) {
    const leadNumber = await this.generateLeadNumber();

    const lead = await this.prisma.lead.create({
      data: {
        tenantId,
        leadNumber,
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        source: dto.source,
        companyName: dto.companyName,
        productInterest: dto.productInterest ?? [],
        estimatedPremium: dto.estimatedPremium,
        priority: dto.priority ?? 'WARM',
        assignedBrokerId: dto.assignedBrokerId ?? userId,
        notes: dto.notes,
        status: 'NEW',
      },
    });

    await this.logAudit(tenantId, userId, 'lead.created', lead.id);
    return lead;
  }

  // ─── FIND ALL ───────────────────────────────────────
  async findAll(tenantId: string, query: LeadQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      source,
      priority,
      assignedBrokerId,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {
      tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(source && { source }),
      ...(priority && { priority }),
      ...(assignedBrokerId && { assignedBrokerId }),
      ...((dateFrom || dateTo) && {
        createdAt: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        OR: [
          { contactName: { contains: search, mode: 'insensitive' as const } },
          { companyName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { leadNumber: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const allowedSortFields = [
      'contactName',
      'estimatedPremium',
      'createdAt',
      'status',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    // Get stage counts
    const stageCounts = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { tenantId, deletedAt: null },
      _count: { id: true },
    });

    const stageCountMap: Record<string, number> = {};
    for (const s of stageCounts) {
      stageCountMap[s.status] = s._count.id;
    }

    const [total, items] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          assignedBroker: {
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
        stageCounts: stageCountMap,
      },
    };
  }

  // ─── KANBAN ─────────────────────────────────────────
  async kanban(tenantId: string) {
    const leads = await this.prisma.lead.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        leadNumber: true,
        contactName: true,
        companyName: true,
        status: true,
        priority: true,
        source: true,
        estimatedPremium: true,
        nextFollowUpDate: true,
        createdAt: true,
        assignedBroker: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    const grouped: Record<string, typeof leads> = {};
    const allStatuses: LeadStatus[] = [
      'NEW',
      'CONTACTED',
      'QUALIFIED',
      'QUOTED',
      'NEGOTIATION',
      'CONVERTED',
      'LOST',
      'NURTURING',
    ];
    for (const s of allStatuses) {
      grouped[s] = [];
    }
    for (const lead of leads) {
      grouped[lead.status].push(lead);
    }

    return grouped;
  }

  // ─── FIND ONE ───────────────────────────────────────
  async findOne(id: string, tenantId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id, tenantId },
      include: {
        assignedBroker: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        convertedClient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!lead || lead.deletedAt) {
      throw new NotFoundException(`Lead ${id} not found`);
    }
    return lead;
  }

  // ─── UPDATE ─────────────────────────────────────────
  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateLeadDto,
  ) {
    await this.findOne(id, tenantId);

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        companyName: dto.companyName,
        productInterest: dto.productInterest,
        estimatedPremium: dto.estimatedPremium,
        priority: dto.priority,
        assignedBrokerId: dto.assignedBrokerId,
        nextFollowUpDate: dto.nextFollowUpDate
          ? new Date(dto.nextFollowUpDate)
          : undefined,
        notes: dto.notes,
      },
    });

    await this.logAudit(tenantId, userId, 'lead.updated', id);
    return updated;
  }

  // ─── CHANGE STAGE ───────────────────────────────────
  async changeStage(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateLeadStageDto,
  ) {
    const lead = await this.findOne(id, tenantId);
    const oldStatus = lead.status;

    if (oldStatus === dto.status) {
      throw new BadRequestException('Lead is already in this stage');
    }

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        status: dto.status,
        lastContactDate: new Date(),
      },
    });

    await this.logAudit(tenantId, userId, 'lead.stage.changed', id, {
      oldStage: oldStatus,
      newStage: dto.status,
      notes: dto.notes,
    });

    // Auto-convert to client if requested and stage is CONVERTED
    if (dto.convertToClient && dto.status === 'CONVERTED') {
      const conversionResult = await this.convert(id, tenantId, userId);
      return { ...updated, convertedClient: conversionResult.client };
    }

    return updated;
  }

  // ─── CONVERT TO CLIENT ──────────────────────────────
  async convert(id: string, tenantId: string, userId: string) {
    const lead = await this.findOne(id, tenantId);

    if (lead.convertedClientId) {
      throw new BadRequestException('Lead already converted');
    }

    // Parse name into firstName/lastName
    const nameParts = lead.contactName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const result = await this.prisma.$transaction(async (tx) => {
      // Generate client number
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const clientCount = await tx.client.count();
      const clientNumber = `CLT-${dateStr}-${String(clientCount + 1).padStart(5, '0')}`;

      // Create client from lead data
      const client = await tx.client.create({
        data: {
          tenantId,
          clientNumber,
          firstName,
          lastName,
          email: lead.email ?? undefined,
          phone: lead.phone ?? '',
          companyName: lead.companyName,
          status: 'ACTIVE',
          type: lead.companyName ? 'CORPORATE' : 'INDIVIDUAL',
        },
      });

      // Update lead with converted reference
      await tx.lead.update({
        where: { id },
        data: {
          status: 'CONVERTED',
          convertedClientId: client.id,
          convertedAt: new Date(),
        },
      });

      return client;
    });

    await this.logAudit(tenantId, userId, 'lead.converted', id, {
      clientId: result.id,
    });

    return { lead: { id, status: 'CONVERTED' }, client: result };
  }
}

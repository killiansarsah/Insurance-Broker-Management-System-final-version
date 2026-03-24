import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import type { AuditCategory, AuditSeverity, AuditStatus } from '@prisma/client';

export interface AuditLogPayload {
  actorId: string;
  actorEmail: string;
  actorRole: string;
  tenantId?: string;
  tenantName?: string;
  sessionId?: string;
  impersonatedById?: string;
  category: AuditCategory;
  severity?: AuditSeverity;
  action: string;
  resourceType?: string;
  resourceId?: string;
  description: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  status?: AuditStatus;
}

@Injectable()
export class PlatformAuditService {
  private readonly logger = new Logger(PlatformAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(payload: AuditLogPayload): Promise<void> {
    try {
      await this.prisma.platformAuditLog.create({
        data: {
          actorId: payload.actorId,
          actorEmail: payload.actorEmail,
          actorRole: payload.actorRole,
          tenantId: payload.tenantId ?? null,
          tenantName: payload.tenantName ?? null,
          sessionId: payload.sessionId ?? null,
          impersonatedById: payload.impersonatedById ?? null,
          category: payload.category,
          severity: payload.severity ?? 'INFO',
          action: payload.action,
          resourceType: payload.resourceType ?? null,
          resourceId: payload.resourceId ?? null,
          description: payload.description,
          beforeState: payload.beforeState
            ? (payload.beforeState as Prisma.InputJsonValue)
            : undefined,
          afterState: payload.afterState
            ? (payload.afterState as Prisma.InputJsonValue)
            : undefined,
          metadata: payload.metadata
            ? (payload.metadata as Prisma.InputJsonValue)
            : undefined,
          ipAddress: payload.ipAddress ?? null,
          userAgent: payload.userAgent ?? null,
          requestId: payload.requestId ?? null,
          status: payload.status ?? 'SUCCESS',
        },
      });
    } catch (error) {
      this.logger.error('Failed to write platform audit log', error);
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    category?: AuditCategory;
    severity?: AuditSeverity;
    tenantId?: string;
    actorId?: string;
    status?: AuditStatus;
    search?: string;
    startDate?: string;
    endDate?: string;
    sort?: 'asc' | 'desc';
  }) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 50, 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params.category) where.category = params.category;
    if (params.severity) where.severity = params.severity;
    if (params.tenantId) where.tenantId = params.tenantId;
    if (params.actorId) where.actorId = params.actorId;
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { description: { contains: params.search, mode: 'insensitive' } },
        { actorEmail: { contains: params.search, mode: 'insensitive' } },
        { action: { contains: params.search, mode: 'insensitive' } },
        { ipAddress: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate)
        (where.createdAt as Record<string, unknown>).gte = new Date(
          params.startDate,
        );
      if (params.endDate)
        (where.createdAt as Record<string, unknown>).lte = new Date(
          params.endDate,
        );
    }

    const [data, total] = await Promise.all([
      this.prisma.platformAuditLog.findMany({
        where,
        orderBy: { createdAt: params.sort === 'asc' ? 'asc' : 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.platformAuditLog.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

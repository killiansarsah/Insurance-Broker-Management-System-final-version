import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class AuditQueryDto {
  page?: number = 1;
  limit?: number = 20;
  action?: string;
  userId?: string;
  entity?: string;
  entityId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: AuditQueryDto) {
    const {
      page = 1,
      limit = 20,
      action,
      userId,
      entity,
      entityId,
      dateFrom,
      dateTo,
      search,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {
      tenantId,
      ...(action && { action }),
      ...(userId && { userId }),
      ...(entity && { entity }),
      ...(entityId && { entityId }),
      ...((dateFrom || dateTo) && {
        createdAt: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        OR: [
          { action: { contains: search, mode: 'insensitive' as const } },
          { entity: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByEntity(tenantId: string, entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { tenantId, entity: entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }
}

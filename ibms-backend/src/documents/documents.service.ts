import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

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
        entity: 'Document',
        entityId,
        after: after ? (after as Prisma.InputJsonObject) : undefined,
      },
    });
  }

  private async generateDocumentNumber(): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.document.count();
    return `DOC-${dateStr}-${String(count + 1).padStart(5, '0')}`;
  }

  async create(tenantId: string, userId: string, dto: CreateDocumentDto) {
    const documentNumber = await this.generateDocumentNumber();

    const doc = await this.prisma.document.create({
      data: {
        tenantId,
        name: `${documentNumber} - ${dto.name}`,
        category: dto.category,
        url: dto.fileUrl,
        sizeBytes: dto.fileSize,
        mimeType: dto.mimeType,
        uploadedById: userId,
        linkedEntityType: dto.linkedEntityType,
        linkedEntityId: dto.linkedEntityId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });

    await this.logAudit(tenantId, userId, 'document.uploaded', doc.id);
    return doc;
  }

  async findAll(tenantId: string, query: DocumentQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      linkedEntityType,
      linkedEntityId,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.DocumentWhereInput = {
      tenantId,
      ...(category && { category }),
      ...(linkedEntityType && { linkedEntityType }),
      ...(linkedEntityId && { linkedEntityId }),
      ...((dateFrom || dateTo) && {
        createdAt: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        name: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const allowedSortFields = ['name', 'sizeBytes', 'createdAt', 'category'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const [total, items, byCategory] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          uploadedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.document.groupBy({
        by: ['category'],
        where: { tenantId },
        _count: { id: true },
      }),
    ]);

    const byTypeMap: Record<string, number> = {};
    for (const cat of byCategory) {
      byTypeMap[cat.category] = cat._count.id;
    }

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalDocuments: total,
        byType: byTypeMap,
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id, tenantId },
      include: {
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);
    return doc;
  }

  async update(
    id: string,
    tenantId: string,
    userId: string,
    dto: UpdateDocumentDto,
  ) {
    await this.findOne(id, tenantId);
    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        name: dto.name,
        category: dto.category,
      },
    });
    await this.logAudit(tenantId, userId, 'document.updated', id);
    return updated;
  }

  async remove(id: string, tenantId: string, userId: string) {
    await this.findOne(id, tenantId);
    await this.prisma.document.delete({ where: { id } });
    await this.logAudit(tenantId, userId, 'document.deleted', id);
    return { deleted: true };
  }
}

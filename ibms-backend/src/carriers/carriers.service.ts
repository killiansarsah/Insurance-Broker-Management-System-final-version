import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { CarrierQueryDto } from './dto/carrier-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CarriersService {
  constructor(private readonly prisma: PrismaService) { }

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
        entity: 'Carrier',
        entityId,
        before: before ? (before as Prisma.InputJsonObject) : Prisma.JsonNull,
        after: after ? (after as Prisma.InputJsonObject) : Prisma.JsonNull,
      },
    });
  }

  async create(tenantId: string, userId: string, dto: CreateCarrierDto) {
    const existing = await this.prisma.carrier.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug: dto.slug,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Carrier with slug ${dto.slug} already exists for this tenant`,
      );
    }

    const carrier = await this.prisma.carrier.create({
      data: {
        tenantId,
        name: dto.name,
        shortName: dto.shortName,
        slug: dto.slug,
        type: dto.type,
        licenseNumber: dto.licenseNumber,
        status: dto.status ?? 'ACTIVE',
        website: dto.website,
        logoUrl: dto.logoUrl,
        brandColor: dto.brandColor,
        phone: dto.phone,
        email: dto.email,
        contactPerson: dto.contactPerson,
        address: dto.address,
      },
    });

    await this.logAudit(
      tenantId,
      userId,
      'carrier.created',
      carrier.id,
      null,
      carrier,
    );
    return carrier;
  }

  async findAll(tenantId: string, query: CarrierQueryDto) {
    const { page = 1, limit = 20, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CarrierWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortName: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.carrier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      this.prisma.carrier.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(tenantId: string, id: string) {
    const carrier = await this.prisma.carrier.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        products: true,
      },
    });

    if (!carrier) {
      throw new NotFoundException('Carrier not found');
    }

    return carrier;
  }

  async update(
    tenantId: string,
    userId: string,
    id: string,
    dto: UpdateCarrierDto,
  ) {
    const carrier = await this.prisma.carrier.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!carrier) throw new NotFoundException('Carrier not found');

    if (dto.slug && dto.slug !== carrier.slug) {
      const existing = await this.prisma.carrier.findUnique({
        where: { tenantId_slug: { tenantId, slug: dto.slug } },
      });
      if (existing) {
        throw new BadRequestException(
          `Carrier with slug ${dto.slug} already exists for this tenant`,
        );
      }
    }

    const updated = await this.prisma.carrier.update({
      where: { id },
      data: {
        name: dto.name,
        shortName: dto.shortName,
        slug: dto.slug,
        type: dto.type,
        licenseNumber: dto.licenseNumber,
        status: dto.status,
        website: dto.website,
        logoUrl: dto.logoUrl,
        brandColor: dto.brandColor,
        phone: dto.phone,
        email: dto.email,
        contactPerson: dto.contactPerson,
        address: dto.address,
      },
    });

    await this.logAudit(
      tenantId,
      userId,
      'carrier.updated',
      id,
      carrier,
      updated,
    );
    return updated;
  }
}

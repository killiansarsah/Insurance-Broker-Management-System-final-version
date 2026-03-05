import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CarrierProductsService {
    constructor(private readonly prisma: PrismaService) { }

    private async logAudit(tenantId: string, userId: string, action: string, entityId: string, before: Record<string, unknown> | null = null, after: Record<string, unknown> | null = null) {
        await this.prisma.auditLog.create({
            data: {
                tenantId,
                userId,
                action,
                entity: 'Product',
                entityId,
                before: before ? (before as any) : undefined,
                after: after ? (after as any) : undefined,
            },
        });
    }

    async create(tenantId: string, userId: string, carrierId: string, dto: CreateProductDto) {
        const carrier = await this.prisma.carrier.findFirst({ where: { id: carrierId, tenantId, deletedAt: null } });
        if (!carrier) throw new NotFoundException('Carrier not found');

        const existing = await this.prisma.product.findUnique({
            where: {
                tenantId_code: {
                    tenantId,
                    code: dto.code,
                },
            },
        });

        if (existing) {
            throw new BadRequestException(`Product with code ${dto.code} already exists for this tenant`);
        }

        const product = await this.prisma.product.create({
            data: {
                tenantId,
                carrierId,
                name: dto.name,
                code: dto.code,
                insuranceType: dto.insuranceType,
                description: dto.description,
                commissionRate: dto.commissionRate,
                isActive: dto.isActive ?? true,
            },
        });

        await this.logAudit(tenantId, userId, 'product.created', product.id, null, product);
        return product;
    }

    async findAll(tenantId: string, carrierId: string, query: ProductQueryDto) {
        const { page = 1, limit = 20, search, insuranceType, isActive } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            tenantId,
            carrierId,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (insuranceType) where.insuranceType = insuranceType;
        if (isActive !== undefined) where.isActive = String(isActive) === 'true';

        const [data, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.product.count({ where }),
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

    async update(tenantId: string, userId: string, carrierId: string, id: string, dto: UpdateProductDto) {
        const product = await this.prisma.product.findFirst({ where: { id, tenantId, carrierId } });
        if (!product) throw new NotFoundException('Product not found');

        if (dto.code && dto.code !== product.code) {
            const existing = await this.prisma.product.findUnique({
                where: { tenantId_code: { tenantId, code: dto.code } },
            });
            if (existing) throw new BadRequestException(`Product with code ${dto.code} already exists for this tenant`);
        }

        const updated = await this.prisma.product.update({
            where: { id },
            data: {
                name: dto.name,
                code: dto.code,
                insuranceType: dto.insuranceType,
                description: dto.description,
                commissionRate: dto.commissionRate,
                isActive: dto.isActive,
            },
        });

        await this.logAudit(tenantId, userId, 'product.updated', id, product, updated);
        return updated;
    }
}

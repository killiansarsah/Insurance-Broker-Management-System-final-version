import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteQueryDto } from './dto/quote-query.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateQuoteNumber(tenantId: string): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.quote.count({ where: { tenantId } });
    const padded = String(count + 1).padStart(4, '0');
    const hex = randomBytes(2).toString('hex').toUpperCase();
    return `QTE-${dateStr}-${padded}-${hex}`;
  }

  async create(tenantId: string, userId: string, dto: CreateQuoteDto) {
    const quoteNumber = await this.generateQuoteNumber(tenantId);

    return this.prisma.quote.create({
      data: {
        tenantId,
        quoteNumber,
        clientId: dto.clientId,
        insuranceType: dto.insuranceType,
        coverageType: dto.coverageType,
        policyType: dto.policyType ?? 'non-life',
        sumInsuredRequested: dto.sumInsuredRequested,
        riskDescription: dto.riskDescription,
        validUntil: new Date(dto.validUntil),
        preparedById: userId,
        options: dto.options
          ? {
              create: dto.options.map((opt) => ({
                carrierName: opt.carrierName,
                premium: opt.premium,
                sumInsured: opt.sumInsured,
                commissionRate: opt.commissionRate,
                commissionAmount: opt.commissionAmount,
                excessOrDeductible: opt.excessOrDeductible,
                coverageNotes: opt.coverageNotes,
                isRecommended: opt.isRecommended ?? false,
              })),
            }
          : undefined,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            companyName: true,
            phone: true,
            email: true,
          },
        },
        options: true,
        preparedBy: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async findAll(tenantId: string, query: QuoteQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId, deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.insuranceType) where.insuranceType = query.insuranceType;
    if (query.clientId) where.clientId = query.clientId;
    if (query.dateFrom || query.dateTo) {
      where.requestDate = {};
      if (query.dateFrom) where.requestDate.gte = new Date(query.dateFrom);
      if (query.dateTo) where.requestDate.lte = new Date(query.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              companyName: true,
              phone: true,
              email: true,
            },
          },
          options: true,
          preparedBy: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.quote.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id, tenantId },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            companyName: true,
            phone: true,
            email: true,
          },
        },
        options: true,
        preparedBy: { select: { firstName: true, lastName: true } },
      },
    });
    if (!quote || quote.deletedAt)
      throw new NotFoundException(`Quote with ID ${id} not found`);
    return quote;
  }

  async update(id: string, tenantId: string, dto: UpdateQuoteDto) {
    const quote = await this.findOne(id, tenantId);
    if (quote.status !== 'DRAFT')
      throw new BadRequestException('Only DRAFT quotes can be edited');

    const { options, ...data } = dto;
    const updateData: any = { ...data };
    if (data.validUntil) updateData.validUntil = new Date(data.validUntil);

    return this.prisma.$transaction(async (tx) => {
      if (options) {
        await tx.quoteOption.deleteMany({ where: { quoteId: id } });
        await tx.quoteOption.createMany({
          data: options.map((opt) => ({
            quoteId: id,
            carrierName: opt.carrierName ?? '',
            premium: opt.premium ?? 0,
            sumInsured: opt.sumInsured ?? 0,
            commissionRate: opt.commissionRate ?? 0,
            commissionAmount: opt.commissionAmount ?? 0,
            excessOrDeductible: opt.excessOrDeductible,
            coverageNotes: opt.coverageNotes,
            isRecommended: opt.isRecommended ?? false,
            isSelected: opt.isSelected ?? false,
          })),
        });
      }

      return tx.quote.update({
        where: { id },
        data: updateData,
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              companyName: true,
              phone: true,
              email: true,
            },
          },
          options: true,
          preparedBy: { select: { firstName: true, lastName: true } },
        },
      });
    });
  }

  async send(id: string, tenantId: string) {
    const quote = await this.findOne(id, tenantId);
    if (quote.status !== 'DRAFT')
      throw new BadRequestException('Only DRAFT quotes can be sent');

    return this.prisma.quote.update({
      where: { id },
      data: { status: 'SENT', sentDate: new Date() },
    });
  }

  async accept(id: string, tenantId: string) {
    const quote = await this.findOne(id, tenantId);
    if (quote.status !== 'SENT')
      throw new BadRequestException('Only SENT quotes can be accepted');

    return this.prisma.quote.update({
      where: { id },
      data: { status: 'ACCEPTED', responseDate: new Date() },
    });
  }

  async decline(id: string, tenantId: string) {
    const quote = await this.findOne(id, tenantId);
    if (quote.status !== 'SENT')
      throw new BadRequestException('Only SENT quotes can be declined');

    return this.prisma.quote.update({
      where: { id },
      data: { status: 'DECLINED', responseDate: new Date() },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.quote.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientQueryDto } from './dto/client-query.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UpdateAmlDto } from './dto/update-aml.dto';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { CreateNextOfKinDto } from './dto/create-next-of-kin.dto';
import { UpdateNextOfKinDto } from './dto/update-next-of-kin.dto';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
    constructor(private readonly prisma: PrismaService) { }

    private async generateClientNumber(tenantId: string): Promise<string> {
        const count = await this.prisma.client.count({ where: { tenantId } });
        const padded = String(count + 1).padStart(6, '0');
        return `CLI-${padded}`;
    }

    private async logAudit(tenantId: string, userId: string, action: string, entityId: string, before: Record<string, unknown> | null = null, after: Record<string, unknown> | null = null) {
        await this.prisma.auditLog.create({
            data: {
                tenantId,
                userId,
                action,
                entity: 'Client',
                entityId,
                before: before ? (before as any) : undefined,
                after: after ? (after as any) : undefined,
            },
        });
    }

    async create(tenantId: string, userId: string, dto: CreateClientDto) {
        if (dto.type === 'CORPORATE' && !dto.companyName) {
            throw new BadRequestException('companyName is required for CORPORATE clients');
        }
        if (dto.type === 'INDIVIDUAL' && (!dto.firstName || !dto.lastName)) {
            throw new BadRequestException('firstName and lastName are required for INDIVIDUAL clients');
        }

        const clientNumber = await this.generateClientNumber(tenantId);

        // Explicitly unwrap dto to ensure only prisma fields are passed
        const client = await this.prisma.client.create({
            data: {
                tenantId,
                clientNumber,
                type: dto.type,
                firstName: dto.firstName,
                lastName: dto.lastName,
                companyName: dto.companyName,
                phone: dto.phone,
                email: dto.email,
                region: dto.region,
                city: dto.city,
                digitalAddress: dto.digitalAddress,
                ghanaCardNumber: dto.ghanaCardNumber,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                gender: dto.gender,
                occupation: dto.occupation,
                isPep: dto.isPep,
                eddRequired: dto.eddRequired,
            },
        });

        await this.logAudit(tenantId, userId, 'client.created', client.id, null, client);
        return client;
    }

    async findAll(tenantId: string, query: ClientQueryDto) {
        const { page = 1, limit = 20, search, type, status, kycStatus, amlRiskLevel, region, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.ClientWhereInput = {
            tenantId,
            deletedAt: null,
        };

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { clientNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) where.type = type;
        if (status) where.status = status;
        if (kycStatus) where.kycStatus = kycStatus;
        if (amlRiskLevel) where.amlRiskLevel = amlRiskLevel;
        if (region) where.region = region;

        let orderBy: Prisma.ClientOrderByWithRelationInput = { [sortBy]: sortOrder };

        // Safety check for valid columns
        const validSortColumns = ['firstName', 'lastName', 'companyName', 'createdAt', 'updatedAt', 'status'];
        if (!validSortColumns.includes(sortBy)) {
            orderBy = { createdAt: 'desc' };
        }

        const [data, total] = await this.prisma.$transaction([
            this.prisma.client.findMany({
                where,
                skip,
                take: limit,
                orderBy,
            }),
            this.prisma.client.count({ where }),
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
        const client = await this.prisma.client.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                beneficiaries: true,
                nextOfKin: true,
                bankDetails: true,
                policies: {
                    select: { id: true, policyNumber: true, status: true, insuranceType: true }
                },
                claims: {
                    select: { id: true, claimNumber: true, status: true }
                }
            },
        });

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        return client;
    }

    async update(tenantId: string, userId: string, id: string, dto: UpdateClientDto) {
        const client = await this.prisma.client.findFirst({ where: { id, tenantId, deletedAt: null } });
        if (!client) throw new NotFoundException('Client not found');

        const updated = await this.prisma.client.update({
            where: { id },
            data: {
                type: dto.type,
                status: dto.status,
                firstName: dto.firstName,
                lastName: dto.lastName,
                companyName: dto.companyName,
                phone: dto.phone,
                email: dto.email,
                region: dto.region,
                city: dto.city,
                digitalAddress: dto.digitalAddress,
                ghanaCardNumber: dto.ghanaCardNumber,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
                gender: dto.gender,
                occupation: dto.occupation,
                isPep: dto.isPep,
                eddRequired: dto.eddRequired,
            },
        });

        await this.logAudit(tenantId, userId, 'client.updated', id, client, updated);
        return updated;
    }

    async remove(tenantId: string, userId: string, id: string) {
        const client = await this.prisma.client.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: { policies: { where: { status: 'ACTIVE' } } },
        });

        if (!client) throw new NotFoundException('Client not found');

        if (client.policies.length > 0) {
            throw new BadRequestException('Cannot delete client with active policies');
        }

        const deleted = await this.prisma.client.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        await this.logAudit(tenantId, userId, 'client.deleted', id, client, deleted);
        return { success: true, message: 'Client soft deleted' };
    }

    // --- KYC & AML --- //

    async updateKyc(tenantId: string, userId: string, id: string, dto: UpdateKycDto) {
        const client = await this.prisma.client.findFirst({ where: { id, tenantId, deletedAt: null } });
        if (!client) throw new NotFoundException('Client not found');

        const updated = await this.prisma.client.update({
            where: { id },
            data: { kycStatus: dto.kycStatus },
        });

        await this.logAudit(tenantId, userId, 'client.kyc.updated', id, { kycStatus: client.kycStatus }, { kycStatus: dto.kycStatus, notes: dto.notes });
        return updated;
    }

    async updateAml(tenantId: string, userId: string, id: string, dto: UpdateAmlDto) {
        const client = await this.prisma.client.findFirst({ where: { id, tenantId, deletedAt: null } });
        if (!client) throw new NotFoundException('Client not found');

        const updated = await this.prisma.client.update({
            where: { id },
            data: { amlRiskLevel: dto.amlRiskLevel },
        });

        // Note: To flag active policies if BLOCKED, that logic belongs in PolicyService, emitting an event here would be ideal.
        await this.logAudit(tenantId, userId, 'client.aml.updated', id, { amlRiskLevel: client.amlRiskLevel }, { amlRiskLevel: dto.amlRiskLevel, notes: dto.notes });
        return updated;
    }

    // --- BENEFICIARIES --- //

    private async validateBeneficiaryPercentage(tenantId: string, clientId: string, newPercentage: number, ignoreBeneficiaryId?: string) {
        const existing = await this.prisma.beneficiary.findMany({ where: { clientId, tenantId } });
        let total = newPercentage;

        for (const ben of existing) {
            if (ignoreBeneficiaryId && ben.id === ignoreBeneficiaryId) continue;
            total += Number(ben.percentage);
        }

        if (total > 100) {
            throw new BadRequestException(`Total beneficiary percentage cannot exceed 100%. Current proposed total: ${total}%`);
        }
    }

    async createBeneficiary(tenantId: string, clientId: string, dto: CreateBeneficiaryDto) {
        const client = await this.prisma.client.findFirst({ where: { id: clientId, tenantId, deletedAt: null } });
        if (!client) throw new NotFoundException('Client not found');

        await this.validateBeneficiaryPercentage(tenantId, clientId, dto.percentage);

        return this.prisma.beneficiary.create({
            data: {
                tenantId,
                clientId,
                fullName: dto.fullName,
                relationship: dto.relationship,
                percentage: dto.percentage,
                phone: dto.phone,
                ghanaCardNumber: dto.ghanaCardNumber,
                guardianName: dto.guardianName,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
            },
        });
    }

    async getBeneficiaries(tenantId: string, clientId: string) {
        return this.prisma.beneficiary.findMany({ where: { tenantId, clientId } });
    }

    async updateBeneficiary(tenantId: string, clientId: string, id: string, dto: UpdateBeneficiaryDto) {
        const ben = await this.prisma.beneficiary.findFirst({ where: { id, tenantId, clientId } });
        if (!ben) throw new NotFoundException('Beneficiary not found');

        if (dto.percentage !== undefined) {
            await this.validateBeneficiaryPercentage(tenantId, clientId, dto.percentage, id);
        }

        return this.prisma.beneficiary.update({
            where: { id },
            data: {
                fullName: dto.fullName,
                relationship: dto.relationship,
                percentage: dto.percentage,
                phone: dto.phone,
                ghanaCardNumber: dto.ghanaCardNumber,
                guardianName: dto.guardianName,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
            },
        });
    }

    async removeBeneficiary(tenantId: string, clientId: string, id: string) {
        const ben = await this.prisma.beneficiary.findFirst({ where: { id, tenantId, clientId } });
        if (!ben) throw new NotFoundException('Beneficiary not found');

        await this.prisma.beneficiary.delete({ where: { id } });
        return { success: true };
    }

    // --- NEXT OF KIN --- //

    async createNextOfKin(tenantId: string, clientId: string, dto: CreateNextOfKinDto) {
        const client = await this.prisma.client.findFirst({ where: { id: clientId, tenantId, deletedAt: null } });
        if (!client) throw new NotFoundException('Client not found');

        return this.prisma.nextOfKin.create({
            data: {
                tenantId,
                clientId,
                fullName: dto.fullName,
                relationship: dto.relationship,
                phone: dto.phone,
                address: dto.address,
            },
        });
    }

    async getNextOfKin(tenantId: string, clientId: string) {
        return this.prisma.nextOfKin.findMany({ where: { tenantId, clientId } });
    }

    // --- BANK DETAILS --- //

    async createBankDetail(tenantId: string, clientId: string, dto: CreateBankDetailDto) {
        const client = await this.prisma.client.findFirst({ where: { id: clientId, tenantId, deletedAt: null } });
        if (!client) throw new NotFoundException('Client not found');

        return this.prisma.bankDetail.create({
            data: {
                tenantId,
                clientId,
                bankName: dto.bankName,
                accountName: dto.accountName,
                accountNumber: dto.accountNumber,
                branch: dto.branch,
            },
        });
    }

    async getBankDetails(tenantId: string, clientId: string) {
        return this.prisma.bankDetail.findMany({ where: { tenantId, clientId } });
    }
}

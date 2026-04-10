import { getUserRoleLevel } from '../common/constants/role-utils.js';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientQueryDto } from './dto/client-query.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UpdateAmlDto } from './dto/update-aml.dto';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { CreateNextOfKinDto } from './dto/create-next-of-kin.dto';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { Prisma } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import {
  ExportClientsDto,
  ExportFormat,
  ExportType,
} from './dto/export-clients.dto';
import {
  ROLE_LEVEL,
} from '../common/constants/role-hierarchy.js';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private async assertClientReadableByActor(
    tenantId: string,
    userId: string,
    client: { assignedBrokerId: string | null },
  ): Promise<void> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    if (actorLevel >= supervisorLevel) return;

    if (client.assignedBrokerId !== userId) {
      throw new NotFoundException('Client not found');
    }
  }

  private async generateClientNumber(tenantId: string): Promise<string> {
    const last = await this.prisma.client.findFirst({
      where: { tenantId, clientNumber: { startsWith: 'CLI-' } },
      orderBy: { createdAt: 'desc' },
      select: { clientNumber: true },
    });
    if (last && last.clientNumber) {
      const match = last.clientNumber.match(/CLI-(\d+)/);
      if (match) return `CLI-${parseInt(match[1]) + 1}`;
    }
    const count = await this.prisma.client.count({ where: { tenantId } });
    return `CLI-${10000 + count + 1}`;
  }

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
        entity: 'Client',
        entityId,
        before: before ? (before as Prisma.InputJsonObject) : Prisma.JsonNull,
        after: after ? (after as Prisma.InputJsonObject) : Prisma.JsonNull,
      },
    });
  }

  async create(tenantId: string, userId: string, dto: CreateClientDto) {
    if (dto.type === 'CORPORATE' && !dto.companyName) {
      throw new BadRequestException(
        'companyName is required for CORPORATE clients',
      );
    }
    if (dto.type === 'INDIVIDUAL' && (!dto.firstName || !dto.lastName)) {
      throw new BadRequestException(
        'firstName and lastName are required for INDIVIDUAL clients',
      );
    }

    const clientNumber = await this.generateClientNumber(tenantId);

    const client = await this.prisma.client.create({
      data: {
        tenantId,
        clientNumber,
        type: dto.type,
        firstName: dto.firstName,
        lastName: dto.lastName,
        companyName: dto.companyName,
        phone: dto.phone,
        alternatePhone: dto.alternatePhone,
        email: dto.email,
        region: dto.region,
        city: dto.city,
        digitalAddress: dto.digitalAddress,
        postalAddress: dto.postalAddress,
        ghanaCardNumber: dto.ghanaCardNumber,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        nationality: dto.nationality,
        maritalStatus: dto.maritalStatus,
        occupation: dto.occupation,
        employerName: dto.employerName,
        employerAddress: dto.employerAddress,
        sourceOfFunds: dto.sourceOfFunds,
        purposeOfRelationship: dto.purposeOfRelationship,
        expectedVolume: dto.expectedVolume,
        preferredCommunication: dto.preferredCommunication,
        tin: dto.tin,
        registrationNumber: dto.registrationNumber,
        dateOfIncorporation: dto.dateOfIncorporation
          ? new Date(dto.dateOfIncorporation)
          : null,
        industry: dto.industry,
        contactPerson: dto.contactPerson,
        contactPersonPhone: dto.contactPersonPhone,
        isPep: dto.isPep,
        eddRequired: dto.eddRequired,
        assignedBrokerId: userId,
      },
      include: {
        policies: {
          select: { id: true },
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
    });

    // Auto-create next-of-kin if inline data provided
    if (dto.nextOfKinName && dto.nextOfKinPhone) {
      await this.prisma.nextOfKin.create({
        data: {
          tenantId,
          clientId: client.id,
          fullName: dto.nextOfKinName,
          relationship: dto.nextOfKinRelationship || 'Not specified',
          phone: dto.nextOfKinPhone,
          address: dto.nextOfKinAddress,
        },
      });
    }

    // Auto-create bank detail if inline data provided
    if (dto.bankName && dto.bankAccountNumber) {
      await this.prisma.bankDetail.create({
        data: {
          tenantId,
          clientId: client.id,
          bankName: dto.bankName,
          accountName: dto.bankAccountName || '',
          accountNumber: dto.bankAccountNumber,
          branch: dto.bankBranch || '',
        },
      });
    }

    if (client.email) {
      const clientName =
        client.firstName || client.companyName || 'Valued Client';
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, email: true, phone: true },
      });
      if (user) {
        await this.emailService.sendWelcomeEmail(
          client.email,
          clientName,
          `${user.firstName} ${user.lastName}`,
          user.email,
          user.phone || 'N/A',
        );
      }
    }

    await this.logAudit(
      tenantId,
      userId,
      'client.created',
      client.id,
      null,
      client,
    );
    return client;
  }

  async getMetrics(tenantId: string, userId: string) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, kycVerified, highRisk, newThisMonth] = await Promise.all([
      this.prisma.client.count({ where: { tenantId } }),
      this.prisma.client.count({ where: { tenantId, kycStatus: 'VERIFIED' } }),
      this.prisma.client.count({
        where: {
          tenantId,
          OR: [{ amlRiskLevel: 'HIGH' }, { amlRiskLevel: 'CRITICAL' }],
        },
      }),
      this.prisma.client.count({
        where: {
          tenantId,
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      }),
    ]);

    return { total, kycVerified, highRisk, newThisMonth };
  }


  async findAll(tenantId: string, userId: string, query: ClientQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      status,
      kycStatus,
      amlRiskLevel,
      region,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    const where: Prisma.ClientWhereInput = {
      tenantId,
      deletedAt: null,
      ...(actorLevel < supervisorLevel && { assignedBrokerId: userId }),
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

    // Safety check for valid columns
    const validSortColumns = [
      'firstName',
      'lastName',
      'companyName',
      'createdAt',
      'updatedAt',
      'status',
    ];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';

    const orderBy: Prisma.ClientOrderByWithRelationInput = {
      [safeSortBy]: sortOrder,
    };

    const [rawData, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          assignedBroker: {
            select: { firstName: true, lastName: true },
          },
          policies: {
            select: {
              status: true,
              premiumAmount: true,
            },
          },
        },
      }),
      this.prisma.client.count({ where }),
    ]);

    const data = rawData.map((client) => {
      const { policies, assignedBroker, ...rest } = client as any;

      const activePolicies =
        policies?.filter((p: any) => p.status === 'ACTIVE').length || 0;
      const totalPolicies = policies?.length || 0;

      const totalPremium =
        policies

          ?.filter((p: any) => p.status === 'ACTIVE' || p.status === 'PENDING')

          .reduce(
            (sum: number, p: any) => sum + Number(p.premiumAmount || 0),
            0,
          ) || 0;

      const assignedBrokerName = assignedBroker
        ? `${assignedBroker.firstName} ${assignedBroker.lastName}`
        : null;

      return {
        ...rest,
        activePolicies,
        totalPolicies,
        totalPremium,
        assignedBrokerName,
      };
    });

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

  async export(
    tenantId: string,
    userId: string,
    userName: string,
    dto: ExportClientsDto,
  ): Promise<Buffer> {
    const actorLevel = await getUserRoleLevel(this.prisma, userId);
    const supervisorLevel = ROLE_LEVEL['SUPERVISOR'] ?? 4;

    const where: Prisma.ClientWhereInput = {
      tenantId,
      deletedAt: null,
      ...(actorLevel < supervisorLevel && { assignedBrokerId: userId }),
    };

    if (dto.exportType === ExportType.FILTERED && dto.filters) {
      const f = dto.filters;
      if (f.search) {
        where.OR = [
          { firstName: { contains: f.search, mode: 'insensitive' } },
          { lastName: { contains: f.search, mode: 'insensitive' } },
          { companyName: { contains: f.search, mode: 'insensitive' } },
          { email: { contains: f.search, mode: 'insensitive' } },
          { phone: { contains: f.search, mode: 'insensitive' } },
          { clientNumber: { contains: f.search, mode: 'insensitive' } },
        ];
      }
      if (f.type) where.type = f.type;
      if (f.status) where.status = f.status;
      if (f.kycStatus) where.kycStatus = f.kycStatus;
      if (f.amlRiskLevel) where.amlRiskLevel = f.amlRiskLevel;
      if (f.region) where.region = f.region;
      if (f.startDate && f.endDate) {
        where.createdAt = {
          gte: new Date(f.startDate),
          lte: new Date(f.endDate),
        };
      }
    }

    const clients = await this.prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedBroker: { select: { firstName: true, lastName: true } },
        bankDetails: true,
        _count: { select: { policies: { where: { status: 'ACTIVE' } } } },
      },
    });

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    const agencyName = tenant?.name || 'Brokerium';

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Clients');

    let headers: string[] = [];
    let keys: string[] = [];

    if (dto.exportType === ExportType.BASIC) {
      headers = [
        'Client Number',
        'Type',
        'Full Name',
        'Phone',
        'Email',
        'Status',
        'Date Registered',
      ];
      keys = [
        'clientNumber',
        'type',
        'fullName',
        'phone',
        'email',
        'status',
        'createdAt',
      ];
    } else if (dto.exportType === ExportType.KYC) {
      headers = [
        'Name',
        'Ghana Card Number',
        'KYC Status',
        'AML Risk Level',
        'PEP',
        'Date Verified',
        'Documents Uploaded',
      ];
      keys = [
        'fullName',
        'ghanaCardNumber',
        'kycStatus',
        'amlRiskLevel',
        'isPep',
        'updatedAt',
        'hasDocs',
      ];
    } else if (dto.exportType === ExportType.FINANCE) {
      headers = [
        'Name',
        'Bank Name',
        'Account Name',
        'Account Number',
        'Branch',
        'MoMo Network',
        'MoMo Number',
      ];
      keys = [
        'fullName',
        'bankName',
        'accountName',
        'accountNumber',
        'branch',
        'momoNetwork',
        'momoNumber',
      ];
    } else {
      headers = [
        'Client Number',
        'Client Type',
        'First Name',
        'Middle Name',
        'Last Name',
        'Company Name',
        'Date of Birth (DD/MM/YYYY)',
        'Gender',
        'Marital Status',
        'Nationality',
        'Ghana Card Number',
        'TIN',
        'Phone Primary',
        'Phone Secondary',
        'Email',
        'Digital Address',
        'Residential Address',
        'City',
        'Region',
        'Occupation',
        'Employer',
        'Industry',
        'KYC Status',
        'AML Risk Level',
        'PEP (Yes/No)',
        'Source of Funds',
        'Purpose of Relationship',
        'Expected Annual Volume',
        'Bank Name',
        'Account Name',
        'Account Number',
        'Branch',
        'MoMo Network',
        'MoMo Number',
        'Account Officer',
        'Active Policies (count)',
        'Date Registered',
        'Status',
      ];
    }

    if (dto.format === ExportFormat.XLSX) {
      // Create column mapping to figure out letter dynamically or just let ExcelJS handle it if we only merge

      // Calculate how many columns we have for header merge length
      const lastColLetter =
        headers.length > 26
          ? String.fromCharCode(64 + Math.floor((headers.length - 1) / 26)) +
            String.fromCharCode(65 + ((headers.length - 1) % 26))
          : String.fromCharCode(64 + headers.length);

      sheet.mergeCells(`A1:${lastColLetter}1`);
      sheet.getCell('A1').value =
        `${agencyName} — Client Export — ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
      sheet.getCell('A1').font = { bold: true, size: 14 };

      sheet.mergeCells(`A2:${lastColLetter}2`);
      sheet.getCell('A2').value =
        `Total clients: ${clients.length} | Exported by: ${userName} | Generated: ${new Date().toLocaleString('en-GB')}`;

      // row 3 is blank

      const headerRow = sheet.getRow(4);
      headerRow.values = headers;
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      // Apply segmented colors and clean borders to header
      headerRow.eachCell((cell) => {
        const text = cell.value?.toString() || '';
        let bgColor = 'FF0F172A'; // Default Slate 900
        
        const basic = ['Client Number', 'Client Type', 'First Name', 'Middle Name', 'Last Name', 'Company Name', 'Full Name'];
        const demog = ['Date of Birth (DD/MM/YYYY)', 'Gender', 'Marital Status', 'Nationality', 'Ghana Card Number', 'TIN'];
        const cont = ['Phone Primary', 'Phone Secondary', 'Phone', 'Email', 'Digital Address', 'Residential Address', 'City', 'Region'];
        const emp = ['Occupation', 'Employer', 'Industry'];
        const kyc = ['KYC Status', 'AML Risk Level', 'PEP', 'PEP (Yes/No)', 'Source of Funds', 'Purpose of Relationship', 'Date Verified', 'Documents Uploaded'];
        const fin = ['Expected Annual Volume', 'Bank Name', 'Account Name', 'Account Number', 'Branch', 'MoMo Network', 'MoMo Number'];
        
        if (basic.includes(text)) bgColor = 'FFEA580C'; // Orange 600
        else if (demog.includes(text)) bgColor = 'FF1D4ED8'; // Blue 700
        else if (cont.includes(text)) bgColor = 'FF4338CA'; // Indigo 700
        else if (emp.includes(text)) bgColor = 'FF0F766E'; // Teal 700
        else if (kyc.includes(text)) bgColor = 'FFBE123C'; // Rose 700
        else if (fin.includes(text)) bgColor = 'FF047857'; // Emerald 700
        else bgColor = 'FF374151'; // Gray 700 (Metrics, Status)

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgColor }
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF1E293B' } },
          left: { style: 'thin', color: { argb: 'FF1E293B' } },
          bottom: { style: 'thin', color: { argb: 'FF1E293B' } },
          right: { style: 'thin', color: { argb: 'FF1E293B' } },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });


      sheet.views = [{ state: 'frozen', ySplit: 4 }];
    } else {
      sheet.addRow(headers);
    }

    for (let i = 0; i < clients.length; i++) {
      const c = clients[i];
      const fullName =
        c.type === 'CORPORATE'
          ? c.companyName || ''
          : `${c.firstName || ''} ${c.lastName || ''}`.trim();
      const primaryBank = c.bankDetails?.[0];

      const formatPhone = (phone?: string | null) => (phone ? `'${phone}` : ''); // Leading zero protection
      const formatDate = (date?: Date | null) =>
        date ? new Date(date).toLocaleDateString('en-GB') : '';

      const record: any = {};

      if (dto.exportType === ExportType.BASIC) {
        record.clientNumber = c.clientNumber;
        record.type = c.type;
        record.fullName = fullName;
        record.phone = formatPhone(c.phone);
        record.email = c.email || '';
        record.status = c.status;
        record.createdAt = formatDate(c.createdAt);
      } else if (dto.exportType === ExportType.KYC) {
        record.fullName = fullName;
        record.ghanaCardNumber = c.ghanaCardNumber || '';
        record.kycStatus = c.kycStatus;
        record.amlRiskLevel = c.amlRiskLevel;
        record.isPep = c.isPep ? 'Yes' : 'No';
        record.updatedAt = formatDate(c.updatedAt);
        record.hasDocs = 'N/A';
      } else if (dto.exportType === ExportType.FINANCE) {
        record.fullName = fullName;
        record.bankName = primaryBank?.bankName || '';
        record.accountName = primaryBank?.accountName || '';
        record.accountNumber = primaryBank?.accountNumber
          ? `'${primaryBank.accountNumber}`
          : '';
        record.branch = primaryBank?.branch || '';
        record.momoNetwork = '';
        record.momoNumber = '';
      } else {
        record.clientNumber = c.clientNumber;
        record.clientType = c.type;
        record.firstName = c.firstName || '';
        record.middleName = '';
        record.lastName = c.lastName || '';
        record.companyName = c.companyName || '';
        record.dateOfBirth = formatDate(c.dateOfBirth);
        record.gender = c.gender || '';
        record.maritalStatus = c.maritalStatus || '';
        record.nationality = c.nationality || '';
        record.ghanaCardNumber = c.ghanaCardNumber || '';
        record.tin = c.tin || '';
        record.phonePrimary = formatPhone(c.phone);
        record.phoneSecondary = formatPhone(c.alternatePhone);
        record.email = c.email || '';
        record.digitalAddress = c.digitalAddress || '';
        record.residentialAddress = c.postalAddress || '';
        record.city = c.city || '';
        record.region = c.region || '';
        record.occupation = c.occupation || '';
        record.employer = c.employerName || '';
        record.industry = c.industry || '';
        record.kycStatus = c.kycStatus;
        record.amlRiskLevel = c.amlRiskLevel;
        record.pep = c.isPep ? 'Yes' : 'No';
        record.sourceOfFunds = c.sourceOfFunds || '';
        record.purposeOfRelationship = c.purposeOfRelationship || '';
        record.expectedAnnualVolume = c.expectedVolume
          ? `GHS ${c.expectedVolume}`
          : '';
        record.bankName = primaryBank?.bankName || '';
        record.accountName = primaryBank?.accountName || '';
        record.accountNumber = primaryBank?.accountNumber
          ? `'${primaryBank.accountNumber}`
          : '';
        record.branch = primaryBank?.branch || '';
        record.momoNetwork = '';
        record.momoNumber = '';
        record.accountOfficer = c.assignedBroker
          ? `${c.assignedBroker.firstName} ${c.assignedBroker.lastName}`
          : '';
        record.activePolicies = c._count?.policies || 0;
        record.createdAt = formatDate(c.createdAt);
        record.status = c.status;
      }

      const rowValues = keys.length
        ? keys.map((k) => record[k])
        : headers.map((_, idx) => Object.values(record)[idx]);

      const row = sheet.addRow(rowValues);
      if (dto.format === ExportFormat.XLSX) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC' }, // Crisp White / Slate 50 alternating
        };
        // Apply crisp subtle borders to all data cells
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } }, // Slate 200
            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
      }
    }

    if (dto.format === ExportFormat.XLSX) {
      const bottomRow = sheet.addRow([
        `Total records exported: ${clients.length}`,
      ]);
      bottomRow.font = { bold: true };

      // Auto-fit columns
      sheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell?.({ includeEmpty: true }, (cell, rowNumber) => {
          if (rowNumber < 4) return; // Skip title/meta rows to avoid stretching columns
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        // Set width with a realistic minimum and maximum so it doesn't become huge
        column.width = Math.min(Math.max(maxLength + 2, 10), 35);
      });
    }

    // Fire & forget audit
    this.logAudit(tenantId, userId, 'client.exported', 'Export', null, {
      exportType: dto.exportType,
      format: dto.format,
      count: clients.length,
      filters: dto.filters,
    }).catch(console.error);

    if (dto.format === ExportFormat.CSV) {
      const buffer = await workbook.csv.writeBuffer();
      return Buffer.concat([
        Buffer.from('\uFEFF', 'utf8'),
        Buffer.from(buffer as ArrayBuffer),
      ]) as any;
    } else {
      return (await workbook.xlsx.writeBuffer()) as any;
    }
  }

  async findOne(tenantId: string, userId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        beneficiaries: true,
        nextOfKin: true,
        bankDetails: true,
        policies: {
          select: {
            id: true,
            policyNumber: true,
            status: true,
            insuranceType: true,
          },
        },
        claims: {
          select: { id: true, claimNumber: true, status: true },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.assertClientReadableByActor(tenantId, userId, client);

    return client;
  }

  async update(
    tenantId: string,
    userId: string,
    id: string,
    dto: UpdateClientDto,
  ) {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

    const updated = await this.prisma.client.update({
      where: { id },
      data: {
        type: dto.type,
        status: dto.status,
        firstName: dto.firstName,
        lastName: dto.lastName,
        companyName: dto.companyName,
        phone: dto.phone,
        alternatePhone: dto.alternatePhone,
        email: dto.email,
        region: dto.region,
        city: dto.city,
        digitalAddress: dto.digitalAddress,
        postalAddress: dto.postalAddress,
        ghanaCardNumber: dto.ghanaCardNumber,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        nationality: dto.nationality,
        maritalStatus: dto.maritalStatus,
        occupation: dto.occupation,
        employerName: dto.employerName,
        employerAddress: dto.employerAddress,
        sourceOfFunds: dto.sourceOfFunds,
        purposeOfRelationship: dto.purposeOfRelationship,
        expectedVolume: dto.expectedVolume,
        preferredCommunication: dto.preferredCommunication,
        tin: dto.tin,
        registrationNumber: dto.registrationNumber,
        dateOfIncorporation: dto.dateOfIncorporation
          ? new Date(dto.dateOfIncorporation)
          : undefined,
        industry: dto.industry,
        contactPerson: dto.contactPerson,
        contactPersonPhone: dto.contactPersonPhone,
        isPep: dto.isPep,
        eddRequired: dto.eddRequired,
      },
    });

    await this.logAudit(
      tenantId,
      userId,
      'client.updated',
      id,
      client,
      updated,
    );
    return updated;
  }

  async remove(tenantId: string, userId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { policies: { where: { status: 'ACTIVE' } } },
    });

    if (!client) throw new NotFoundException('Client not found');

    if (client.policies.length > 0) {
      throw new BadRequestException(
        'Cannot delete client with active policies',
      );
    }

    const deleted = await this.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.logAudit(
      tenantId,
      userId,
      'client.deleted',
      id,
      client,
      deleted,
    );
    return { success: true, message: 'Client soft deleted' };
  }

  // --- KYC & AML --- //

  async updateKyc(
    tenantId: string,
    userId: string,
    id: string,
    dto: UpdateKycDto,
  ) {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!client) throw new NotFoundException('Client not found');

    const updated = await this.prisma.client.update({
      where: { id },
      data: { kycStatus: dto.kycStatus },
    });

    await this.logAudit(
      tenantId,
      userId,
      'client.kyc.updated',
      id,
      { kycStatus: client.kycStatus },
      { kycStatus: dto.kycStatus, notes: dto.notes },
    );
    return updated;
  }

  async updateAml(
    tenantId: string,
    userId: string,
    id: string,
    dto: UpdateAmlDto,
  ) {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!client) throw new NotFoundException('Client not found');

    const updated = await this.prisma.client.update({
      where: { id },
      data: { amlRiskLevel: dto.amlRiskLevel },
    });

    // Note: To flag active policies if BLOCKED, that logic belongs in PolicyService, emitting an event here would be ideal.
    await this.logAudit(
      tenantId,
      userId,
      'client.aml.updated',
      id,
      { amlRiskLevel: client.amlRiskLevel },
      { amlRiskLevel: dto.amlRiskLevel, notes: dto.notes },
    );
    return updated;
  }

  // --- BENEFICIARIES --- //

  private async validateBeneficiaryPercentage(
    tenantId: string,
    clientId: string,
    newPercentage: number,
    ignoreBeneficiaryId?: string,
  ) {
    const existing = await this.prisma.beneficiary.findMany({
      where: { clientId, tenantId },
    });
    let total = newPercentage;

    for (const ben of existing) {
      if (ignoreBeneficiaryId && ben.id === ignoreBeneficiaryId) continue;
      total += Number(ben.percentage);
    }

    if (total > 100) {
      throw new BadRequestException(
        `Total beneficiary percentage cannot exceed 100%. Current proposed total: ${total}%`,
      );
    }
  }

  async createBeneficiary(
    tenantId: string,
    userId: string,
    clientId: string,
    dto: CreateBeneficiaryDto,
  ) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId, deletedAt: null },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

    await this.validateBeneficiaryPercentage(
      tenantId,
      clientId,
      dto.percentage,
    );

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

  async getBeneficiaries(tenantId: string, userId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId, deletedAt: null },
      select: { assignedBrokerId: true },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

    return this.prisma.beneficiary.findMany({ where: { tenantId, clientId } });
  }

  async updateBeneficiary(
    tenantId: string,
    userId: string,
    clientId: string,
    id: string,
    dto: UpdateBeneficiaryDto,
  ) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId, deletedAt: null },
      select: { assignedBrokerId: true },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

    const ben = await this.prisma.beneficiary.findFirst({
      where: { id, tenantId, clientId },
    });
    if (!ben) throw new NotFoundException('Beneficiary not found');

    if (dto.percentage !== undefined) {
      await this.validateBeneficiaryPercentage(
        tenantId,
        clientId,
        dto.percentage,
        id,
      );
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

  async removeBeneficiary(
    tenantId: string,
    userId: string,
    clientId: string,
    id: string,
  ) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId, deletedAt: null },
      select: { assignedBrokerId: true },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

    const ben = await this.prisma.beneficiary.findFirst({
      where: { id, tenantId, clientId },
    });
    if (!ben) throw new NotFoundException('Beneficiary not found');

    await this.prisma.beneficiary.delete({ where: { id } });
    return { success: true };
  }

  // --- NEXT OF KIN --- //

  async createNextOfKin(
    tenantId: string,
    userId: string,
    clientId: string,
    dto: CreateNextOfKinDto,
  ) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId, deletedAt: null },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

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

  async getNextOfKin(tenantId: string, userId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId, deletedAt: null },
      select: { assignedBrokerId: true },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

    return this.prisma.nextOfKin.findMany({ where: { tenantId, clientId } });
  }

  // --- BANK DETAILS --- //

  async createBankDetail(
    tenantId: string,
    userId: string,
    clientId: string,
    dto: CreateBankDetailDto,
  ) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId, deletedAt: null },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

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

  async getBankDetails(tenantId: string, userId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId, deletedAt: null },
      select: { assignedBrokerId: true },
    });
    if (!client) throw new NotFoundException('Client not found');

    await this.assertClientReadableByActor(tenantId, userId, client);

    return this.prisma.bankDetail.findMany({ where: { tenantId, clientId } });
  }
}

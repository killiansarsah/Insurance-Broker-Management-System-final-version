import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPrisma = {
  client: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  beneficiary: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  nextOfKin: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  bankDetail: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
  tenant: {
    findUnique: jest.fn(),
  },
};

const mockEmail = {
  sendWelcomeEmail: jest.fn(),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeClient = (overrides = {}) => ({
  id: 'client-1',
  tenantId: 'tenant-1',
  clientNumber: 'CLI-10001',
  type: 'INDIVIDUAL',
  firstName: 'Jane',
  lastName: 'Smith',
  companyName: null,
  email: 'jane@example.com',
  phone: '0244000000',
  alternatePhone: null,
  region: 'Greater Accra',
  city: 'Accra',
  digitalAddress: null,
  postalAddress: null,
  ghanaCardNumber: null,
  dateOfBirth: null,
  gender: 'FEMALE',
  nationality: 'Ghanaian',
  maritalStatus: null,
  occupation: null,
  employerName: null,
  employerAddress: null,
  sourceOfFunds: null,
  purposeOfRelationship: null,
  expectedVolume: null,
  preferredCommunication: null,
  tin: null,
  registrationNumber: null,
  dateOfIncorporation: null,
  industry: null,
  contactPerson: null,
  contactPersonPhone: null,
  isPep: false,
  eddRequired: false,
  status: 'ACTIVE',
  kycStatus: 'PENDING',
  amlRiskLevel: 'LOW',
  deletedAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  policies: [],
  ...overrides,
});

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmail },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  // ── create ──────────────────────────────────────────────────────────────────

  describe('create', () => {
    const baseDto = {
      type: 'INDIVIDUAL' as const,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '0244000000',
    };

    it('should create an INDIVIDUAL client successfully', async () => {
      const client = makeClient();
      mockPrisma.client.findFirst.mockResolvedValue({
        clientNumber: 'CLI-10000',
      });
      mockPrisma.client.create.mockResolvedValue(client);
      mockPrisma.user.findUnique.mockResolvedValue({
        firstName: 'Agent',
        lastName: 'One',
        email: 'agent@example.com',
        phone: '0200000000',
      });
      mockEmail.sendWelcomeEmail.mockResolvedValue(undefined);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.create('tenant-1', 'user-1', baseDto as any);

      expect(result).toHaveProperty('id', 'client-1');
      expect(mockPrisma.client.create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException for CORPORATE client without companyName', async () => {
      await expect(
        service.create('tenant-1', 'user-1', {
          type: 'CORPORATE',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for INDIVIDUAL client without firstName', async () => {
      await expect(
        service.create('tenant-1', 'user-1', {
          type: 'INDIVIDUAL',
          lastName: 'Smith',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for INDIVIDUAL client without lastName', async () => {
      await expect(
        service.create('tenant-1', 'user-1', {
          type: 'INDIVIDUAL',
          firstName: 'Jane',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should auto-create next-of-kin when inline data is provided', async () => {
      const client = makeClient();
      mockPrisma.client.findFirst.mockResolvedValue(null);
      mockPrisma.client.count.mockResolvedValue(0);
      mockPrisma.client.create.mockResolvedValue(client);
      mockPrisma.nextOfKin = { create: jest.fn().mockResolvedValue({}) } as any;
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.create('tenant-1', 'user-1', {
        ...baseDto,
        nextOfKinName: 'John Smith',
        nextOfKinPhone: '0244111111',
        nextOfKinRelationship: 'Spouse',
      } as any);

      expect(mockPrisma.nextOfKin.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            fullName: 'John Smith',
            phone: '0244111111',
          }),
        }),
      );
    });

    it('should not send welcome email when client has no email', async () => {
      const client = makeClient({ email: null });
      mockPrisma.client.findFirst.mockResolvedValue(null);
      mockPrisma.client.count.mockResolvedValue(0);
      mockPrisma.client.create.mockResolvedValue(client);
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.create('tenant-1', 'user-1', {
        type: 'INDIVIDUAL',
        firstName: 'Jane',
        lastName: 'Smith',
      } as any);

      expect(mockEmail.sendWelcomeEmail).not.toHaveBeenCalled();
    });
  });

  // ── findAll ─────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return paginated clients with meta', async () => {
      const clients = [makeClient()];
      mockPrisma.$transaction.mockResolvedValue([clients, 1]);

      const result = await service.findAll('tenant-1', 'user-1', {
        page: 1,
        limit: 20,
      } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toMatchObject({ total: 1, page: 1, limit: 20 });
    });

    it('should apply search filter', async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAll('tenant-1', 'user-1', {
        search: 'Jane',
        page: 1,
        limit: 20,
      } as any);

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should apply type filter', async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAll('tenant-1', 'user-1', {
        type: 'INDIVIDUAL',
        page: 1,
        limit: 20,
      } as any);

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should compute activePolicies and totalPremium per client', async () => {
      const clientWithPolicies = {
        ...makeClient(),
        policies: [
          { status: 'ACTIVE', premiumAmount: 1000 },
          { status: 'ACTIVE', premiumAmount: 500 },
          { status: 'EXPIRED', premiumAmount: 200 },
        ],
        assignedBroker: null,
      };
      mockPrisma.$transaction.mockResolvedValue([[clientWithPolicies], 1]);

      const result = await service.findAll('tenant-1', 'user-1', {
        page: 1,
        limit: 20,
      } as any);

      expect(result.data[0].activePolicies).toBe(2);
      expect(result.data[0].totalPremium).toBe(1500);
    });
  });

  // ── findOne ─────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const client = makeClient();
      mockPrisma.client.findFirst.mockResolvedValue(client);

      const result = await service.findOne('tenant-1', 'user-1', 'client-1');

      expect(result).toHaveProperty('id', 'client-1');
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(service.findOne('tenant-1', 'user-1', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── update ──────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update a client and log audit', async () => {
      const client = makeClient();
      const updated = { ...client, phone: '0244999999' };
      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.client.update.mockResolvedValue(updated);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.update('tenant-1', 'user-1', 'client-1', {
        phone: '0244999999',
      } as any);

      expect(result.phone).toBe('0244999999');
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.update('tenant-1', 'user-1', 'nonexistent', {} as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── remove ──────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should soft-delete a client with no active policies', async () => {
      const client = { ...makeClient(), policies: [] };
      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.client.update.mockResolvedValue({
        ...client,
        deletedAt: new Date(),
      });
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.remove('tenant-1', 'user-1', 'client-1');

      expect(result).toEqual({ success: true, message: 'Client soft deleted' });
    });

    it('should throw BadRequestException when client has active policies', async () => {
      const client = {
        ...makeClient(),
        policies: [{ id: 'pol-1', status: 'ACTIVE' }],
      };
      mockPrisma.client.findFirst.mockResolvedValue(client);

      await expect(
        service.remove('tenant-1', 'user-1', 'client-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.remove('tenant-1', 'user-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── updateKyc ───────────────────────────────────────────────────────────────

  describe('updateKyc', () => {
    it('should update KYC status', async () => {
      const client = makeClient();
      const updated = { ...client, kycStatus: 'VERIFIED' };
      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.client.update.mockResolvedValue(updated);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.updateKyc('tenant-1', 'user-1', 'client-1', {
        kycStatus: 'VERIFIED',
      } as any);

      expect(result.kycStatus).toBe('VERIFIED');
    });

    it('should throw NotFoundException for unknown client', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.updateKyc('tenant-1', 'user-1', 'bad-id', {
          kycStatus: 'VERIFIED',
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── updateAml ───────────────────────────────────────────────────────────────

  describe('updateAml', () => {
    it('should update AML risk level', async () => {
      const client = makeClient();
      const updated = { ...client, amlRiskLevel: 'HIGH' };
      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.client.update.mockResolvedValue(updated);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.updateAml('tenant-1', 'user-1', 'client-1', {
        amlRiskLevel: 'HIGH',
      } as any);

      expect(result.amlRiskLevel).toBe('HIGH');
    });
  });

  // ── createBeneficiary ───────────────────────────────────────────────────────

  describe('createBeneficiary', () => {
    it('should create a beneficiary when total percentage ≤ 100', async () => {
      const client = makeClient();
      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.beneficiary.findMany.mockResolvedValue([
        { id: 'ben-0', percentage: 40 },
      ]);
      mockPrisma.beneficiary.create.mockResolvedValue({
        id: 'ben-1',
        fullName: 'Child One',
        percentage: 60,
      });

      const result = await service.createBeneficiary('tenant-1', 'user-1', 'client-1', {
        fullName: 'Child One',
        relationship: 'Child',
        percentage: 60,
      } as any);

      expect(result).toHaveProperty('id', 'ben-1');
    });

    it('should throw BadRequestException when total percentage exceeds 100', async () => {
      const client = makeClient();
      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.beneficiary.findMany.mockResolvedValue([
        { id: 'ben-0', percentage: 80 },
      ]);

      await expect(
        service.createBeneficiary('tenant-1', 'user-1', 'client-1', {
          fullName: 'Child Two',
          relationship: 'Child',
          percentage: 30,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.createBeneficiary('tenant-1', 'user-1', 'bad-client', {
          fullName: 'X',
          relationship: 'Child',
          percentage: 50,
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── removeBeneficiary ───────────────────────────────────────────────────────

  describe('removeBeneficiary', () => {
    it('should delete a beneficiary', async () => {
      mockPrisma.beneficiary.findFirst.mockResolvedValue({ id: 'ben-1' });
      mockPrisma.beneficiary.delete.mockResolvedValue({});

      const result = await service.removeBeneficiary(
        'tenant-1',
        'user-1',
        'client-1',
        'ben-1',
      );

      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException when beneficiary does not exist', async () => {
      mockPrisma.beneficiary.findFirst.mockResolvedValue(null);

      await expect(
        service.removeBeneficiary('tenant-1', 'user-1', 'client-1', 'bad-ben'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── createNextOfKin ─────────────────────────────────────────────────────────

  describe('createNextOfKin', () => {
    it('should create next-of-kin for a valid client', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(makeClient());
      mockPrisma.nextOfKin.create.mockResolvedValue({ id: 'nok-1' });

      const result = await service.createNextOfKin('tenant-1', 'user-1', 'client-1', {
        fullName: 'John Smith',
        relationship: 'Spouse',
        phone: '0244111111',
      } as any);

      expect(result).toHaveProperty('id', 'nok-1');
    });

    it('should throw NotFoundException for unknown client', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.createNextOfKin('tenant-1', 'user-1', 'bad-client', {} as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── createBankDetail ────────────────────────────────────────────────────────

  describe('createBankDetail', () => {
    it('should create a bank detail for a valid client', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(makeClient());
      mockPrisma.bankDetail.create.mockResolvedValue({ id: 'bd-1' });

      const result = await service.createBankDetail('tenant-1', 'user-1', 'client-1', {
        bankName: 'GCB Bank',
        accountName: 'Jane Smith',
        accountNumber: '1234567890',
        branch: 'Accra Main',
      } as any);

      expect(result).toHaveProperty('id', 'bd-1');
    });

    it('should throw NotFoundException for unknown client', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.createBankDetail('tenant-1', 'user-1', 'bad-client', {} as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

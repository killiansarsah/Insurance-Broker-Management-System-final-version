import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, EndorsementType, PaymentMethod } from '@prisma/client';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPrisma = {
  policy: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  client: {
    findUnique: jest.fn(),
  },
  carrier: {
    findUnique: jest.fn(),
  },
  product: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
  },
  premiumInstallment: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
  },
  policyEndorsement: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  commission: {
    create: jest.fn(),
  },
  calendarEvent: {
    create: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makePolicy = (overrides = {}) => ({
  id: 'policy-1',
  tenantId: 'tenant-1',
  clientId: 'client-1',
  carrierId: 'carrier-1',
  productId: 'product-1',
  brokerId: 'user-1',
  insuranceType: 'MOTOR',
  policyType: 'NON_LIFE',
  policyNumber: 'POL-20240101-00001-ABC123',
  inceptionDate: new Date('2024-01-01'),
  expiryDate: new Date('2025-01-01'),
  premiumAmount: new Prisma.Decimal(1000),
  sumInsured: new Prisma.Decimal(50000),
  premiumFrequency: 'ANNUAL',
  commissionRate: new Prisma.Decimal(10),
  commissionAmount: new Prisma.Decimal(100),
  status: 'DRAFT',
  currency: 'GHS',
  coverageDetails: null,
  deletedAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  client: {
    id: 'client-1',
    firstName: 'John',
    lastName: 'Doe',
    companyName: null,
    phone: '0244000000',
    email: 'john@example.com',
    type: 'INDIVIDUAL',
  },
  carrier: {
    id: 'carrier-1',
    name: 'Test Insurance Co',
  },
  product: {
    id: 'product-1',
    name: 'Motor Insurance',
  },
  broker: {
    id: 'user-1',
    firstName: 'Jane',
    lastName: 'Smith',
  },
  vehicleDetails: null,
  propertyDetails: null,
  marineDetails: null,
  endorsements: [],
  installments: [],
  policyDocuments: [],
  claims: [],
  ...overrides,
});

const makeClient = (overrides = {}) => ({
  id: 'client-1',
  tenantId: 'tenant-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  ...overrides,
});

const makeCarrier = (overrides = {}) => ({
  id: 'carrier-1',
  tenantId: 'tenant-1',
  name: 'Test Insurance Co',
  ...overrides,
});

const makeProduct = (overrides = {}) => ({
  id: 'product-1',
  carrierId: 'carrier-1',
  name: 'Motor Insurance',
  insuranceType: 'MOTOR',
  commissionRate: new Prisma.Decimal(10),
  ...overrides,
});

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('PoliciesService', () => {
  let service: PoliciesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliciesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
  });

  // ─── CREATE ─────────────────────────────────────────

  describe('create', () => {
    const createDto = {
      clientId: 'client-1',
      carrierId: 'carrier-1',
      insuranceType: 'MOTOR' as const,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      premiumAmount: 1000,
      sumInsured: 50000,
      premiumFrequency: 'ANNUAL' as const,
      vehicleDetails: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        registrationNumber: 'GR-1234-20',
      },
    };

    it('should create a policy successfully', async () => {
      const mockPolicy = makePolicy();
      mockPrisma.client.findUnique.mockResolvedValue(makeClient());
      mockPrisma.carrier.findUnique.mockResolvedValue(makeCarrier());
      mockPrisma.product.findFirst.mockResolvedValue(makeProduct());
      mockPrisma.product.findUnique.mockResolvedValue(makeProduct());
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { create: jest.fn().mockResolvedValue(mockPolicy) },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      const result = await service.create('tenant-1', 'user-1', createDto);

      expect(result).toEqual(mockPolicy);
      expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'client-1', tenantId: 'tenant-1' },
      });
      expect(mockPrisma.carrier.findUnique).toHaveBeenCalledWith({
        where: { id: 'carrier-1', tenantId: 'tenant-1' },
      });
    });

    it('should throw NotFoundException when client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await expect(
        service.create('tenant-1', 'user-1', createDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when carrier not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(makeClient());
      mockPrisma.carrier.findUnique.mockResolvedValue(null);

      await expect(
        service.create('tenant-1', 'user-1', createDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when MOTOR policy missing vehicleDetails', async () => {
      const dtoWithoutVehicle = { ...createDto, vehicleDetails: undefined };

      await expect(
        service.create('tenant-1', 'user-1', dtoWithoutVehicle),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when FIRE policy missing propertyDetails', async () => {
      const dtoFire = {
        ...createDto,
        insuranceType: 'FIRE' as const,
        vehicleDetails: undefined,
      };

      await expect(
        service.create('tenant-1', 'user-1', dtoFire),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when MARINE policy missing marineDetails', async () => {
      const dtoMarine = {
        ...createDto,
        insuranceType: 'MARINE' as const,
        vehicleDetails: undefined,
      };

      await expect(
        service.create('tenant-1', 'user-1', dtoMarine),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when endDate is before startDate', async () => {
      const dtoBadDates = {
        ...createDto,
        startDate: '2025-01-01',
        endDate: '2024-01-01',
      };

      await expect(
        service.create('tenant-1', 'user-1', dtoBadDates),
      ).rejects.toThrow(BadRequestException);
    });

    it('should auto-select product when productId not provided', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(makeClient());
      mockPrisma.carrier.findUnique.mockResolvedValue(makeCarrier());
      mockPrisma.product.findFirst.mockResolvedValue(makeProduct());
      mockPrisma.product.findUnique.mockResolvedValue(makeProduct());
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { create: jest.fn().mockResolvedValue(makePolicy()) },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      await service.create('tenant-1', 'user-1', createDto);

      expect(mockPrisma.product.findFirst).toHaveBeenCalledWith({
        where: { carrierId: 'carrier-1', insuranceType: 'MOTOR' },
      });
    });

    it('should calculate commission from product rate when not provided', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(makeClient());
      mockPrisma.carrier.findUnique.mockResolvedValue(makeCarrier());
      mockPrisma.product.findFirst.mockResolvedValue(makeProduct());
      mockPrisma.product.findUnique.mockResolvedValue(makeProduct());
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { create: jest.fn().mockResolvedValue(makePolicy()) },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      await service.create('tenant-1', 'user-1', createDto);

      // Commission should be 10% of 1000 = 100
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  // ─── FIND ALL ───────────────────────────────────────

  describe('findAll', () => {
    it('should return paginated policies with filters', async () => {
      const mockPolicies = [makePolicy()];
      mockPrisma.policy.count.mockResolvedValue(1);
      mockPrisma.policy.findMany.mockResolvedValue(mockPolicies);
      mockPrisma.policy.aggregate.mockResolvedValue({
        _sum: { premiumAmount: new Prisma.Decimal(1000) },
      });

      const result = await service.findAll('tenant-1', 'user-1', { page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPremium).toEqual(new Prisma.Decimal(1000));
    });

    it('should apply search filter', async () => {
      mockPrisma.policy.count.mockResolvedValue(0);
      mockPrisma.policy.findMany.mockResolvedValue([]);
      mockPrisma.policy.aggregate.mockResolvedValue({
        _sum: { premiumAmount: null },
      });

      await service.findAll('tenant-1', 'user-1', {
        page: 1,
        limit: 10,
        search: 'POL-123',
      });

      expect(mockPrisma.policy.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                policyNumber: expect.objectContaining({ contains: 'POL-123' }),
              }),
            ]),
          }),
        }),
      );
    });

    it('should apply status filter', async () => {
      mockPrisma.policy.count.mockResolvedValue(0);
      mockPrisma.policy.findMany.mockResolvedValue([]);
      mockPrisma.policy.aggregate.mockResolvedValue({
        _sum: { premiumAmount: null },
      });

      await service.findAll('tenant-1', 'user-1', {
        page: 1,
        limit: 10,
        status: 'ACTIVE',
      });

      expect(mockPrisma.policy.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'ACTIVE' }),
        }),
      );
    });

    it('should calculate daysToExpiry correctly', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const mockPolicy = makePolicy({ expiryDate: futureDate });
      mockPrisma.policy.count.mockResolvedValue(1);
      mockPrisma.policy.findMany.mockResolvedValue([mockPolicy]);
      mockPrisma.policy.aggregate.mockResolvedValue({
        _sum: { premiumAmount: new Prisma.Decimal(1000) },
      });

      const result = await service.findAll('tenant-1', 'user-1', { page: 1, limit: 10 });

      expect(result.items[0].daysToExpiry).toBe(30);
    });
  });

  // ─── FIND ONE ───────────────────────────────────────

  describe('findOne', () => {
    it('should return a policy with all relations', async () => {
      const mockPolicy = makePolicy();
      mockPrisma.policy.findUnique.mockResolvedValue(mockPolicy);

      const result = await service.findOne('policy-1', 'tenant-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('policy-1');
      expect(result.clientName).toBe('John Doe');
      expect(result.insurerName).toBe('Test Insurance Co');
      expect(result.brokerName).toBe('Jane Smith');
    });

    it('should throw NotFoundException when policy not found', async () => {
      mockPrisma.policy.findUnique.mockResolvedValue(null);

      await expect(service.findOne('policy-1', 'tenant-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should use companyName for corporate clients', async () => {
      const corporatePolicy = makePolicy({
        client: {
          ...makePolicy().client,
          firstName: null,
          lastName: null,
          companyName: 'Acme Corp',
        },
      });
      mockPrisma.policy.findUnique.mockResolvedValue(corporatePolicy);

      const result = await service.findOne('policy-1', 'tenant-1');

      expect(result.clientName).toBe('Acme Corp');
    });
  });

  // ─── UPDATE ─────────────────────────────────────────

  describe('update', () => {
    it('should update a policy successfully', async () => {
      const existingPolicy = makePolicy();
      const updatedPolicy = {
        ...existingPolicy,
        premiumAmount: new Prisma.Decimal(2000),
      };

      mockPrisma.policy.findUnique.mockResolvedValue(existingPolicy);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { update: jest.fn().mockResolvedValue(updatedPolicy) },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      const result = await service.update('policy-1', 'tenant-1', 'user-1', {
        premiumAmount: 2000,
      });

      expect(result.premiumAmount).toEqual(new Prisma.Decimal(2000));
    });

    it('should throw BadRequestException when no fields to update', async () => {
      mockPrisma.policy.findUnique.mockResolvedValue(makePolicy());

      await expect(
        service.update('policy-1', 'tenant-1', 'user-1', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should recalculate commission when commission rate changes', async () => {
      const existingPolicy = makePolicy();
      mockPrisma.policy.findUnique.mockResolvedValue(existingPolicy);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { update: jest.fn().mockResolvedValue(existingPolicy) },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      await service.update('policy-1', 'tenant-1', 'user-1', {
        commission: 15,
        premiumAmount: 1000,
      });

      // Commission should be 15% of 1000 = 150
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  // ─── BIND ───────────────────────────────────────────

  describe('bind', () => {
    it('should bind a DRAFT policy to ACTIVE', async () => {
      const draftPolicy = makePolicy({ status: 'DRAFT' });
      const activePolicy = { ...draftPolicy, status: 'ACTIVE' };

      mockPrisma.policy.findUnique.mockResolvedValue(draftPolicy);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { update: jest.fn().mockResolvedValue(activePolicy) },
          premiumInstallment: { createMany: jest.fn() },
          commission: { create: jest.fn() },
          calendarEvent: { create: jest.fn() },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      const result = await service.bind('policy-1', 'tenant-1', 'user-1');

      expect(result.status).toBe('ACTIVE');
    });

    it('should throw BadRequestException when policy is not DRAFT or COVER_NOTE', async () => {
      const activePolicy = makePolicy({ status: 'ACTIVE' });
      mockPrisma.policy.findUnique.mockResolvedValue(activePolicy);

      await expect(
        service.bind('policy-1', 'tenant-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create installments for MONTHLY frequency', async () => {
      const monthlyPolicy = makePolicy({
        status: 'DRAFT',
        premiumFrequency: 'MONTHLY',
        premiumAmount: new Prisma.Decimal(12000),
      });

      mockPrisma.policy.findUnique.mockResolvedValue(monthlyPolicy);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { update: jest.fn().mockResolvedValue(monthlyPolicy) },
          premiumInstallment: { createMany: jest.fn() },
          commission: { create: jest.fn() },
          calendarEvent: { create: jest.fn() },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      await service.bind('policy-1', 'tenant-1', 'user-1');

      // Should create 12 installments for monthly
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should create commission record with NIC levy', async () => {
      const policy = makePolicy({ status: 'DRAFT' });
      mockPrisma.policy.findUnique.mockResolvedValue(policy);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { update: jest.fn().mockResolvedValue(policy) },
          premiumInstallment: { createMany: jest.fn() },
          commission: { create: jest.fn() },
          calendarEvent: { create: jest.fn() },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      await service.bind('policy-1', 'tenant-1', 'user-1');

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  // ─── CANCEL ─────────────────────────────────────────

  describe('cancel', () => {
    it('should cancel an ACTIVE policy', async () => {
      const activePolicy = makePolicy({ status: 'ACTIVE' });
      const cancelledPolicy = { ...activePolicy, status: 'CANCELLED' };

      mockPrisma.policy.findUnique.mockResolvedValue(activePolicy);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { update: jest.fn().mockResolvedValue(cancelledPolicy) },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      const result = await service.cancel('policy-1', 'tenant-1', 'user-1', {
        reason: 'Client request',
        effectiveDate: '2024-06-01',
      });

      expect(result.status).toBe('CANCELLED');
    });

    it('should throw BadRequestException when policy is already cancelled', async () => {
      const cancelledPolicy = makePolicy({ status: 'CANCELLED' });
      mockPrisma.policy.findUnique.mockResolvedValue(cancelledPolicy);

      await expect(
        service.cancel('policy-1', 'tenant-1', 'user-1', {
          reason: 'Test',
          effectiveDate: '2024-06-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when effectiveDate is in the past', async () => {
      const activePolicy = makePolicy({ status: 'ACTIVE' });
      mockPrisma.policy.findUnique.mockResolvedValue(activePolicy);

      await expect(
        service.cancel('policy-1', 'tenant-1', 'user-1', {
          reason: 'Test',
          effectiveDate: '2020-01-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── REINSTATE ──────────────────────────────────────

  describe('reinstate', () => {
    it('should reinstate a LAPSED policy', async () => {
      const lapsedPolicy = makePolicy({ status: 'LAPSED' });
      const activePolicy = { ...lapsedPolicy, status: 'ACTIVE' };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: {
            findUnique: jest.fn().mockResolvedValue(lapsedPolicy),
            update: jest.fn().mockResolvedValue(activePolicy),
          },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      const result = await service.reinstate('policy-1', 'tenant-1', 'user-1', {
        reason: 'Client paid outstanding premium',
      });

      expect(result.status).toBe('ACTIVE');
    });

    it('should throw BadRequestException when policy is not lapsed', async () => {
      const activePolicy = makePolicy({ status: 'ACTIVE' });
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { findUnique: jest.fn().mockResolvedValue(activePolicy) },
        };
        return callback(tx);
      });

      await expect(
        service.reinstate('policy-1', 'tenant-1', 'user-1', { reason: 'Test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when policy is past expiry date', async () => {
      const expiredPolicy = makePolicy({
        status: 'LAPSED',
        expiryDate: new Date('2020-01-01'),
      });
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { findUnique: jest.fn().mockResolvedValue(expiredPolicy) },
        };
        return callback(tx);
      });

      await expect(
        service.reinstate('policy-1', 'tenant-1', 'user-1', { reason: 'Test' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── CREATE ENDORSEMENT ─────────────────────────────

  describe('createEndorsement', () => {
    it('should create an endorsement for an ACTIVE policy', async () => {
      const activePolicy = makePolicy({ status: 'ACTIVE' });
      const endorsement = {
        id: 'endorsement-1',
        policyId: 'policy-1',
        type: EndorsementType.COVERAGE_CHANGE,
        description: 'Add flood coverage',
        premiumAdjustment: 500,
        effectiveDate: new Date('2024-06-01'),
        status: 'PENDING',
      };

      mockPrisma.policy.findUnique.mockResolvedValue(activePolicy);
      mockPrisma.policyEndorsement.create.mockResolvedValue(endorsement);

      const result = await service.createEndorsement(
        'policy-1',
        'tenant-1',
        'user-1',
        {
          type: EndorsementType.COVERAGE_CHANGE,
          description: 'Add flood coverage',
          premiumAdjustment: 500,
          effectiveDate: '2024-06-01',
        },
      );

      expect(result).toBeDefined();
      expect(result.type).toBe(EndorsementType.COVERAGE_CHANGE);
    });

    it('should throw NotFoundException when policy not found', async () => {
      mockPrisma.policy.findUnique.mockResolvedValue(null);

      await expect(
        service.createEndorsement('policy-1', 'tenant-1', 'user-1', {
          type: EndorsementType.COVERAGE_CHANGE,
          description: 'Test',
          premiumAdjustment: 100,
          effectiveDate: '2024-06-01',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when effectiveDate is in the past', async () => {
      const activePolicy = makePolicy({ status: 'ACTIVE' });
      mockPrisma.policy.findUnique.mockResolvedValue(activePolicy);

      await expect(
        service.createEndorsement('policy-1', 'tenant-1', 'user-1', {
          type: EndorsementType.COVERAGE_CHANGE,
          description: 'Test',
          premiumAdjustment: 100,
          effectiveDate: '2020-01-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── APPROVE ENDORSEMENT ────────────────────────────

  describe('approveEndorsement', () => {
    it('should approve a PENDING endorsement', async () => {
      const pendingEndorsement = {
        id: 'endorsement-1',
        policyId: 'policy-1',
        status: 'PENDING',
        premiumAdjustment: 500,
      };
      const approvedEndorsement = { ...pendingEndorsement, status: 'APPROVED' };

      mockPrisma.policyEndorsement.findFirst.mockResolvedValue(
        pendingEndorsement,
      );
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policyEndorsement: {
            update: jest.fn().mockResolvedValue(approvedEndorsement),
          },
          policy: {
            findUnique: jest.fn().mockResolvedValue(makePolicy()),
            update: jest.fn(),
          },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      const result = await service.approveEndorsement(
        'policy-1',
        'endorsement-1',
        'tenant-1',
        'user-1',
      );

      expect(result.status).toBe('APPROVED');
    });

    it('should throw BadRequestException when endorsement is not PENDING', async () => {
      const approvedEndorsement = {
        id: 'endorsement-1',
        policyId: 'policy-1',
        status: 'APPROVED',
      };
      mockPrisma.policyEndorsement.findFirst.mockResolvedValue(
        approvedEndorsement,
      );

      await expect(
        service.approveEndorsement(
          'policy-1',
          'endorsement-1',
          'tenant-1',
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── REJECT ENDORSEMENT ─────────────────────────────

  describe('rejectEndorsement', () => {
    it('should reject a PENDING endorsement', async () => {
      const pendingEndorsement = {
        id: 'endorsement-1',
        policyId: 'policy-1',
        status: 'PENDING',
      };
      const rejectedEndorsement = { ...pendingEndorsement, status: 'REJECTED' };

      mockPrisma.policyEndorsement.findFirst.mockResolvedValue(
        pendingEndorsement,
      );
      mockPrisma.policyEndorsement.update.mockResolvedValue(
        rejectedEndorsement,
      );

      const result = await service.rejectEndorsement(
        'policy-1',
        'endorsement-1',
        'tenant-1',
        'user-1',
        'Not approved',
      );

      expect(result.status).toBe('REJECTED');
    });

    it('should throw BadRequestException when endorsement is not PENDING', async () => {
      const approvedEndorsement = {
        id: 'endorsement-1',
        policyId: 'policy-1',
        status: 'APPROVED',
      };
      mockPrisma.policyEndorsement.findFirst.mockResolvedValue(
        approvedEndorsement,
      );

      await expect(
        service.rejectEndorsement(
          'policy-1',
          'endorsement-1',
          'tenant-1',
          'user-1',
          'Test',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── LIST INSTALLMENTS ──────────────────────────────

  describe('listInstallments', () => {
    it('should return installments for a policy', async () => {
      const installments = [
        { id: 'inst-1', installmentNumber: 1, status: 'PENDING' },
        { id: 'inst-2', installmentNumber: 2, status: 'PAID' },
      ];

      mockPrisma.policy.findUnique.mockResolvedValue(makePolicy());
      mockPrisma.premiumInstallment.findMany.mockResolvedValue(installments);

      const result = await service.listInstallments('policy-1', 'tenant-1');

      expect(result).toHaveLength(2);
      expect(result[0].installmentNumber).toBe(1);
    });

    it('should throw NotFoundException when policy not found', async () => {
      mockPrisma.policy.findUnique.mockResolvedValue(null);

      await expect(
        service.listInstallments('policy-1', 'tenant-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── PAY INSTALLMENT ────────────────────────────────

  describe('payInstallment', () => {
    it('should mark an installment as paid', async () => {
      const installment = {
        id: 'installment-1',
        policyId: 'policy-1',
        status: 'PENDING',
        amount: new Prisma.Decimal(1000),
      };
      const paidInstallment = { ...installment, status: 'PAID' };

      mockPrisma.premiumInstallment.findFirst.mockResolvedValue(installment);
      mockPrisma.premiumInstallment.update.mockResolvedValue(paidInstallment);

      const result = await service.payInstallment(
        'policy-1',
        'installment-1',
        'tenant-1',
        'user-1',
        {
          paidAmount: 1000,
          paidDate: '2024-01-15',
          paymentMethod: PaymentMethod.BANK_TRANSFER,
        },
      );

      expect(result.status).toBe('PAID');
    });

    it('should throw NotFoundException when installment not found', async () => {
      mockPrisma.premiumInstallment.findFirst.mockResolvedValue(null);

      await expect(
        service.payInstallment(
          'policy-1',
          'installment-1',
          'tenant-1',
          'user-1',
          {
            paidAmount: 1000,
            paidDate: '2024-01-15',
            paymentMethod: PaymentMethod.BANK_TRANSFER,
          },
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when installment is already paid', async () => {
      const paidInstallment = {
        id: 'installment-1',
        policyId: 'policy-1',
        status: 'PAID',
      };
      mockPrisma.premiumInstallment.findFirst.mockResolvedValue(
        paidInstallment,
      );

      await expect(
        service.payInstallment(
          'policy-1',
          'installment-1',
          'tenant-1',
          'user-1',
          {
            paidAmount: 1000,
            paidDate: '2024-01-15',
            paymentMethod: PaymentMethod.BANK_TRANSFER,
          },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── ISSUE COVER NOTE ───────────────────────────────

  describe('issueCoverNote', () => {
    it('should issue a cover note for a DRAFT policy', async () => {
      const draftPolicy = makePolicy({ status: 'DRAFT' });
      const coverNotePolicy = { ...draftPolicy, status: 'COVER_NOTE' };

      mockPrisma.policy.findUnique.mockResolvedValue(draftPolicy);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { update: jest.fn().mockResolvedValue(coverNotePolicy) },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      const result = await service.issueCoverNote(
        'policy-1',
        'tenant-1',
        'user-1',
      );

      expect(result.status).toBe('COVER_NOTE');
    });

    it('should throw BadRequestException when policy is not DRAFT', async () => {
      const activePolicy = makePolicy({ status: 'ACTIVE' });
      mockPrisma.policy.findUnique.mockResolvedValue(activePolicy);

      await expect(
        service.issueCoverNote('policy-1', 'tenant-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── LAPSE ──────────────────────────────────────────

  describe('lapse', () => {
    it('should lapse an ACTIVE policy', async () => {
      const activePolicy = makePolicy({ status: 'ACTIVE' });
      const lapsedPolicy = { ...activePolicy, status: 'LAPSED' };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: {
            findUnique: jest.fn().mockResolvedValue(activePolicy),
            update: jest.fn().mockResolvedValue(lapsedPolicy),
          },
          auditLog: { create: jest.fn() },
        };
        return callback(tx);
      });

      const result = await service.lapse('policy-1', 'tenant-1', 'user-1');

      expect(result.status).toBe('LAPSED');
    });

    it('should throw BadRequestException when policy is not ACTIVE', async () => {
      const draftPolicy = makePolicy({ status: 'DRAFT' });
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          policy: { findUnique: jest.fn().mockResolvedValue(draftPolicy) },
        };
        return callback(tx);
      });

      await expect(
        service.lapse('policy-1', 'tenant-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

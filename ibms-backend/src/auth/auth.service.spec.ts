import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { TenantsService } from '../tenants/tenants.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('bcrypt');

const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  refreshToken: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  passwordReset: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
};

const mockJwt = {
  signAsync: jest.fn().mockResolvedValue('mock-access-token'),
};

const mockConfig = {
  get: jest.fn().mockReturnValue('http://localhost:3000'),
};

const mockTenants = {
  findBySlug: jest.fn(),
};

const mockEmail = {
  sendPasswordReset: jest.fn(),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeUser = (overrides = {}) => ({
  id: 'user-1',
  tenantId: 'tenant-1',
  email: 'test@example.com',
  passwordHash: '$2b$12$hashedpassword',
  firstName: 'John',
  lastName: 'Doe',
  phone: null,
  jobTitle: null,
  branchId: null,
  avatarUrl: null,
  isActive: true,
  lastLoginAt: null,
  failedAttempts: 0,
  lockedUntil: null,
  deletedAt: null,
  createdAt: new Date('2024-01-01'),
  twoFactorEnabled: false,
  twoFactorSecret: null,
  userRoleMappings: [{ role: { name: 'BROKER' } }],
  ...overrides,
});

const makeRefreshToken = (overrides = {}) => ({
  id: 'rt-1',
  userId: 'user-1',
  tokenHash: '$2b$10$hashedtoken',
  tokenFamily: 'abcdef1234567890',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  revokedAt: null,
  replacedBy: null,
  ipAddress: null,
  userAgent: null,
  createdAt: new Date(),
  ...overrides,
});

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
        { provide: TenantsService, useValue: mockTenants },
        { provide: EmailService, useValue: mockEmail },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ── issueAccessToken ────────────────────────────────────────────────────────

  describe('issueAccessToken', () => {
    it('should sign a JWT with sub, tenantId, and roles', async () => {
      const token = await service.issueAccessToken({
        id: 'user-1',
        tenantId: 'tenant-1',
        roles: ['BROKER'],
        permissions: ['policies:create', 'policies:read'],
      });

      expect(mockJwt.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        tenantId: 'tenant-1',
        roles: ['BROKER'],
        role: 'BROKER',
        permissions: ['policies:create', 'policies:read'],
      });
      expect(token).toBe('mock-access-token');
    });
  });

  // ── login ───────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should return accessToken and user on successful login', async () => {
      const user = makeUser();
      mockTenants.findBySlug.mockResolvedValue({ id: 'tenant-1', isActive: true });
      mockPrisma.user.findFirst.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue(user);
      mockPrisma.auditLog.create.mockResolvedValue({});
      mockPrisma.refreshToken.findMany.mockResolvedValue([]);
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

      const result = await service.login(
        'test@example.com',
        'password123',
        'my-tenant',
      );

      expect(result).toHaveProperty('accessToken', 'mock-access-token');
      expect(result).toHaveProperty('user');
      expect((result as any).user.email).toBe('test@example.com');
    });

    it('should throw UNAUTHORIZED when tenant is not found', async () => {
      mockTenants.findBySlug.mockResolvedValue(null);

      await expect(
        service.login('test@example.com', 'password', 'bad-tenant'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw UNAUTHORIZED when tenant is inactive', async () => {
      mockTenants.findBySlug.mockResolvedValue({ id: 'tenant-1', isActive: false });

      await expect(
        service.login('test@example.com', 'password', 'inactive-tenant'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw UNAUTHORIZED when user is not found', async () => {
      mockTenants.findBySlug.mockResolvedValue({ id: 'tenant-1', isActive: true });
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.login('notfound@example.com', 'password', 'my-tenant'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw UNAUTHORIZED when user is soft-deleted', async () => {
      mockTenants.findBySlug.mockResolvedValue({ id: 'tenant-1', isActive: true });
      mockPrisma.user.findFirst.mockResolvedValue(makeUser({ deletedAt: new Date() }));

      await expect(
        service.login('test@example.com', 'password', 'my-tenant'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw 423 when account is locked', async () => {
      mockTenants.findBySlug.mockResolvedValue({ id: 'tenant-1', isActive: true });
      mockPrisma.user.findFirst.mockResolvedValue(
        makeUser({ lockedUntil: new Date(Date.now() + 60_000) }),
      );

      await expect(
        service.login('test@example.com', 'password', 'my-tenant'),
      ).rejects.toThrow(HttpException);
    });

    it('should increment failedAttempts on wrong password', async () => {
      const user = makeUser({ failedAttempts: 2 });
      mockTenants.findBySlug.mockResolvedValue({ id: 'tenant-1', isActive: true });
      mockPrisma.user.findFirst.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.auditLog.create.mockResolvedValue({});

      await expect(
        service.login('test@example.com', 'wrongpassword', 'my-tenant'),
      ).rejects.toThrow(HttpException);

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ failedAttempts: 3 }),
        }),
      );
    });

    it('should lock account after 5 failed attempts', async () => {
      const user = makeUser({ failedAttempts: 4 });
      mockTenants.findBySlug.mockResolvedValue({ id: 'tenant-1', isActive: true });
      mockPrisma.user.findFirst.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.auditLog.create.mockResolvedValue({});

      await expect(
        service.login('test@example.com', 'wrongpassword', 'my-tenant'),
      ).rejects.toThrow(HttpException);

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            failedAttempts: 5,
            lockedUntil: expect.any(Date),
          }),
        }),
      );
    });

    it('should return requiresTwoFactor when 2FA is enabled', async () => {
      const user = makeUser({ twoFactorEnabled: true });
      mockTenants.findBySlug.mockResolvedValue({ id: 'tenant-1', isActive: true });
      mockPrisma.user.findFirst.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue(user);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.login('test@example.com', 'password', 'my-tenant');

      expect(result).toHaveProperty('requiresTwoFactor', true);
      expect(result).toHaveProperty('userId', 'user-1');
    });

    it('should return requiresTenantSelection when user exists in multiple tenants', async () => {
      const userWithTenant = {
        ...makeUser(),
        tenant: { id: 'tenant-1', name: 'Tenant A', slug: 'tenant-a', isActive: true },
      };
      const userWithTenant2 = {
        ...makeUser({ id: 'user-2', tenantId: 'tenant-2' }),
        tenant: { id: 'tenant-2', name: 'Tenant B', slug: 'tenant-b', isActive: true },
      };
      mockPrisma.user.findMany.mockResolvedValue([userWithTenant, userWithTenant2]);

      const result = await service.login('test@example.com', 'password', undefined);

      expect(result).toHaveProperty('requiresTenantSelection', true);
      expect((result as any).tenants).toHaveLength(2);
    });
  });

  // ── refreshTokens ───────────────────────────────────────────────────────────

  describe('refreshTokens', () => {
    it('should throw UNAUTHORIZED when no refresh token provided', async () => {
      await expect(service.refreshTokens(undefined)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw UNAUTHORIZED when token is not found', async () => {
      mockPrisma.refreshToken.findMany.mockResolvedValue([]);

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(
        HttpException,
      );
    });

    it('should detect token reuse attack and revoke all tokens', async () => {
      const revokedToken = makeRefreshToken({ revokedAt: new Date() });
      mockPrisma.refreshToken.findMany.mockResolvedValue([revokedToken]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      await expect(service.refreshTokens('abcdef1234567890sometoken')).rejects.toThrow(
        HttpException,
      );

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          data: { revokedAt: expect.any(Date) },
        }),
      );
    });

    it('should throw UNAUTHORIZED when token is expired', async () => {
      const expiredToken = makeRefreshToken({
        expiresAt: new Date(Date.now() - 1000),
      });
      mockPrisma.refreshToken.findMany.mockResolvedValue([expiredToken]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.refreshToken.update.mockResolvedValue({});

      await expect(service.refreshTokens('abcdef1234567890sometoken')).rejects.toThrow(
        HttpException,
      );
    });

    it('should rotate tokens on valid refresh', async () => {
      const validToken = makeRefreshToken();
      const user = makeUser();
      mockPrisma.refreshToken.findMany
        .mockResolvedValueOnce([validToken]) // find candidates
        .mockResolvedValueOnce([]); // find active tokens for session limit
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-2' });
      mockPrisma.refreshToken.update.mockResolvedValue({});
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.refreshTokens('abcdef1234567890sometoken');

      expect(result).toHaveProperty('accessToken', 'mock-access-token');
      expect(result).toHaveProperty('user');
      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        }),
      );
    });
  });

  // ── forgotPassword ──────────────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('should return generic message even when user not found (security)', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const result = await service.forgotPassword('notfound@example.com');

      expect(result).toHaveProperty('message');
      expect(mockEmail.sendPasswordReset).not.toHaveBeenCalled();
    });

    it('should send reset email when user exists', async () => {
      const user = makeUser();
      mockPrisma.user.findFirst.mockResolvedValue(user);
      mockPrisma.passwordReset.create.mockResolvedValue({});
      mockEmail.sendPasswordReset.mockResolvedValue(undefined);

      const result = await service.forgotPassword('test@example.com');

      expect(result).toHaveProperty('message');
      expect(mockEmail.sendPasswordReset).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
        expect.any(String),
      );
    });
  });

  // ── resetPassword ───────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    it('should throw BAD_REQUEST when password is too short', async () => {
      await expect(service.resetPassword('sometoken', 'short')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw GONE when token is not found', async () => {
      mockPrisma.passwordReset.findMany.mockResolvedValue([]);

      await expect(
        service.resetPassword('abcdef1234567890sometoken', 'newpassword123'),
      ).rejects.toThrow(HttpException);
    });

    it('should reset password and revoke all refresh tokens', async () => {
      const resetRecord = {
        id: 'pr-1',
        email: 'test@example.com',
        tenantId: 'tenant-1',
        token: '$2b$12$hashedtoken',
        tokenFamily: 'abcdef1234567890',
        expiresAt: new Date(Date.now() + 3600_000),
        usedAt: null,
        createdAt: new Date(),
      };
      const user = makeUser();
      mockPrisma.passwordReset.findMany.mockResolvedValue([resetRecord]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$12$newhash');
      mockPrisma.user.findFirst.mockResolvedValue(user);
      mockPrisma.user.update.mockResolvedValue(user);
      mockPrisma.passwordReset.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.resetPassword(
        'abcdef1234567890sometoken',
        'newpassword123',
      );

      expect(result).toHaveProperty('message', 'Password reset');
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          data: { revokedAt: expect.any(Date) },
        }),
      );
    });
  });

  // ── logout ──────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('should return success even with no token', async () => {
      const result = await service.logout(undefined);
      expect(result).toEqual({ success: true });
    });

    it('should revoke the matching refresh token', async () => {
      const token = makeRefreshToken();
      mockPrisma.refreshToken.findMany.mockResolvedValue([token]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.refreshToken.update.mockResolvedValue({});

      const result = await service.logout('abcdef1234567890sometoken');

      expect(result).toEqual({ success: true });
      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { revokedAt: expect.any(Date) },
        }),
      );
    });
  });

  // ── getProfile ──────────────────────────────────────────────────────────────

  describe('getProfile', () => {
    it('should return user DTO without sensitive fields', async () => {
      const user = makeUser();
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getProfile('user-1');

      expect(result).toHaveProperty('id', 'user-1');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('twoFactorSecret');
    });

    it('should throw NOT_FOUND when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent')).rejects.toThrow(
        HttpException,
      );
    });
  });
});

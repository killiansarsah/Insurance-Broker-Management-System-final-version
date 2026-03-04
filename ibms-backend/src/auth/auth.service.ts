import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TenantsService } from '../tenants/tenants.service.js';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const REFRESH_TOKEN_BYTES = 64;
const REFRESH_TOKEN_HASH_COST = 10;
const PASSWORD_HASH_COST = 12;

interface AuthUser {
  id: string;
  tenantId: string;
  role: string;
}

interface UserRecord {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  branchId: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  failedAttempts: number;
  lockedUntil: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
}

interface RefreshTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedBy: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

interface PasswordResetRecord {
  id: string;
  email: string;
  tenantId: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private tenants: TenantsService,
  ) { }
  private readonly logger = new Logger(AuthService.name);

  private userToDto(user: UserRecord) {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      branchId: user.branchId,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async issueAccessToken(user: AuthUser) {
    const payload = { sub: user.id, tenantId: user.tenantId, role: user.role };
    return this.jwt.signAsync(payload);
  }

  async issueRefreshToken(userId: string, ipAddress?: string, userAgent?: string) {
    const raw = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
    const tokenHash = await bcrypt.hash(raw, REFRESH_TOKEN_HASH_COST);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const created = await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });

    return { raw, id: created.id };
  }

  async login(email: string, password: string, tenantSlug: string, ipAddress?: string, userAgent?: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant || !tenant.isActive) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.prisma.user.findUnique({ where: { tenantId_email: { tenantId: tenant.id, email } } }) as UserRecord | null;
    if (!user || user.deletedAt || !user.isActive) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMs = user.lockedUntil.getTime() - Date.now();
      throw new HttpException({ message: 'Account locked', remainingMs }, 423);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      const failed = (user.failedAttempts ?? 0) + 1;
      const updateData: { failedAttempts: number; lockedUntil?: Date } = { failedAttempts: failed };
      if (failed >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
      await this.prisma.user.update({ where: { id: user.id }, data: updateData });
      await this.prisma.auditLog.create({ data: { tenantId: tenant.id, userId: user.id, action: 'login.failed', entity: 'user', entityId: user.id, ipAddress, userAgent } });
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // success
    await this.prisma.user.update({ where: { id: user.id }, data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() } });
    await this.prisma.auditLog.create({ data: { tenantId: tenant.id, userId: user.id, action: 'login.success', entity: 'user', entityId: user.id, ipAddress, userAgent } });

    const accessToken = await this.issueAccessToken({ id: user.id, tenantId: tenant.id, role: user.role });
    const created = await this.issueRefreshToken(user.id, ipAddress, userAgent);

    return { accessToken, user: this.userToDto(user), refreshRaw: created.raw };
  }

  async refreshTokens(rawRefreshToken: string | undefined, ipAddress?: string, userAgent?: string) {
    if (!rawRefreshToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // Find ALL tokens (including revoked) to detect reuse attacks
    const candidates = await this.prisma.refreshToken.findMany({
      where: {},
      orderBy: { createdAt: 'desc' },
    }) as RefreshTokenRecord[];

    let matched: RefreshTokenRecord | null = null;
    for (const t of candidates) {
      if (!t.tokenHash) continue;
      const ok = await bcrypt.compare(rawRefreshToken, t.tokenHash);
      if (ok) {
        matched = t;
        break;
      }
    }

    if (!matched) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // Token reuse attack: if the matched token is already revoked,
    // someone is replaying an old token → revoke ALL tokens for this user
    if (matched.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: matched.userId },
        data: { revokedAt: new Date() },
      });
      this.logger.warn(`Token reuse attack detected for userId=${matched.userId}`);
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // Expired token
    if (matched.expiresAt && matched.expiresAt < new Date()) {
      await this.prisma.refreshToken.update({ where: { id: matched.id }, data: { revokedAt: new Date() } });
      throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED);
    }

    // Rotation: create new token, link replacedBy on old, revoke old
    const newCreated = await this.issueRefreshToken(matched.userId, ipAddress, userAgent);
    await this.prisma.refreshToken.update({
      where: { id: matched.id },
      data: { revokedAt: new Date(), replacedBy: newCreated.id },
    });

    const user = await this.prisma.user.findUnique({ where: { id: matched.userId } }) as UserRecord | null;
    if (!user) throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);

    const accessToken = await this.issueAccessToken({ id: user.id, tenantId: user.tenantId, role: user.role });

    return { accessToken, refreshRaw: newCreated.raw };
  }

  async forgotPassword(email: string, tenantSlug: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    const generic = { message: 'If that email exists, a reset link has been sent' };
    if (!tenant) return generic;

    const user = await this.prisma.user.findUnique({ where: { tenantId_email: { tenantId: tenant.id, email } } }) as UserRecord | null;
    if (!user) return generic;

    const raw = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(raw, PASSWORD_HASH_COST);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordReset.create({ data: { tenantId: tenant.id, email: user.email, token: tokenHash, expiresAt } });
    this.logger.log(`Password reset URL: ${this.config.get<string>('FRONTEND_URL')}/reset-password?token=${raw}`);

    return generic;
  }

  async resetPassword(rawToken: string, newPassword: string) {
    const candidates = await this.prisma.passwordReset.findMany({
      where: { usedAt: null },
      orderBy: { createdAt: 'desc' },
    }) as PasswordResetRecord[];

    let matched: PasswordResetRecord | null = null;
    for (const r of candidates) {
      const ok = await bcrypt.compare(rawToken, r.token);
      if (ok) {
        matched = r;
        break;
      }
    }

    if (!matched) throw new HttpException('Reset token invalid or expired', HttpStatus.GONE);
    if (matched.expiresAt && matched.expiresAt < new Date()) throw new HttpException('Reset token invalid or expired', HttpStatus.GONE);
    if (matched.usedAt) throw new HttpException('Reset token invalid or expired', HttpStatus.GONE);

    const hashed = await bcrypt.hash(newPassword, PASSWORD_HASH_COST);
    const user = await this.prisma.user.findFirst({ where: { tenantId: matched.tenantId, email: matched.email } }) as UserRecord | null;
    if (!user) throw new HttpException('Reset token invalid or expired', HttpStatus.GONE);
    await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashed } });
    await this.prisma.passwordReset.update({ where: { id: matched.id }, data: { usedAt: new Date() } });
    await this.prisma.refreshToken.updateMany({ where: { userId: user.id }, data: { revokedAt: new Date() } });
    await this.prisma.auditLog.create({ data: { tenantId: matched.tenantId, userId: user.id, action: 'password.reset', entity: 'user', entityId: user.id } });

    return { message: 'Password reset' };
  }

  async logout(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) return { success: true };

    const tokens = await this.prisma.refreshToken.findMany({ where: {} }) as RefreshTokenRecord[];
    for (const t of tokens) {
      const ok = await bcrypt.compare(rawRefreshToken, t.tokenHash);
      if (ok) {
        await this.prisma.refreshToken.update({ where: { id: t.id }, data: { revokedAt: new Date() } });
        break;
      }
    }

    return { success: true };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } }) as UserRecord | null;
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.userToDto(user);
  }
}

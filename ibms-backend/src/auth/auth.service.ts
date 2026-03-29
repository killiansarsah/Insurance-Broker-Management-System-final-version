import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TenantsService } from '../tenants/tenants.service.js';
import { EmailService } from '../email/email.service.js';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const REFRESH_TOKEN_BYTES = 64;
const REFRESH_TOKEN_HASH_COST = 10;
const PASSWORD_HASH_COST = 12;

interface AuthUser {
  id: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
}

interface UserRecord {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  jobTitle: string | null;
  branchId: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  failedAttempts: number;
  lockedUntil: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  userRoleMappings?: { role: { name: string; permissions?: { permission: { action: string } }[] } }[];
}

interface RefreshTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  tokenFamily: string | null;
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
  tokenFamily: string | null;
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
    private email: EmailService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  // Reusable Prisma include for the full RBAC join chain (single query, no N+1)
  private readonly RBAC_INCLUDE = {
    userRoleMappings: {
      select: {
        role: {
          select: {
            name: true,
            permissions: {
              select: { permission: { select: { action: true } } },
            },
          },
        },
      },
    },
  } as const;

  /** Build AuthUser payload from a UserRecord with full RBAC join */
  private buildAuthUser(user: UserRecord, tenantId?: string): AuthUser {
    return {
      id: user.id,
      tenantId: tenantId ?? user.tenantId,
      roles: this.getRoles(user),
      permissions: this.getPermissions(user),
    };
  }

  private getRoles(user: UserRecord): string[] {
    return user.userRoleMappings?.map((m) => m.role.name) ?? [];
  }

  private getPermissions(user: UserRecord): string[] {
    const perms = new Set<string>();
    for (const mapping of user.userRoleMappings ?? []) {
      for (const rp of mapping.role.permissions ?? []) {
        perms.add(rp.permission.action);
      }
    }
    return [...perms];
  }

  private userToDto(user: UserRecord) {
    const roles = this.getRoles(user);
    const permissions = this.getPermissions(user);
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      roles,
      role: roles[0] ?? 'AGENT',
      permissions,
      jobTitle: user.jobTitle,
      branchId: user.branchId,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async issueAccessToken(user: AuthUser) {
    const primaryRole = user.roles[0] ?? 'AGENT';
    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      roles: user.roles,
      role: primaryRole,
      permissions: user.permissions,
    };
    return this.jwt.signAsync(payload);
  }

  private readonly MAX_SESSIONS_PER_USER = 5;

  async issueRefreshToken(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const raw = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
    const tokenHash = await bcrypt.hash(raw, REFRESH_TOKEN_HASH_COST);
    const tokenFamily = raw.substring(0, 16);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Enforce concurrent session limit: keep only the newest N-1 tokens
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    if (activeTokens.length >= this.MAX_SESSIONS_PER_USER) {
      const toRevoke = activeTokens
        .slice(this.MAX_SESSIONS_PER_USER - 1)
        .map((t) => t.id);
      await this.prisma.refreshToken.updateMany({
        where: { id: { in: toRevoke } },
        data: { revokedAt: new Date() },
      });
    }

    const created = await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        tokenFamily,
        expiresAt,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });

    return { raw, id: created.id };
  }

  async login(
    email: string,
    password: string,
    tenantSlug: string | undefined,
    ipAddress?: string,
    userAgent?: string,
  ) {
    let user: UserRecord | null = null;
    let tenantId: string;

    if (tenantSlug) {
      // Explicit tenant provided — use direct lookup
      const tenant = await this.tenants.findBySlug(tenantSlug);
      if (!tenant || !tenant.isActive) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      tenantId = tenant.id;
      user = (await this.prisma.user.findFirst({
        where: { tenantId: tenant.id, email },
        include: this.RBAC_INCLUDE,
      })) as UserRecord | null;
    } else {
      // No tenant slug — auto-resolve by looking up email across all tenants
      const candidates = (await this.prisma.user.findMany({
        where: { email, deletedAt: null, isActive: true },
        include: {
          ...this.RBAC_INCLUDE,
          tenant: {
            select: { id: true, name: true, slug: true, isActive: true },
          },
        },
      })) as (UserRecord & {
        tenant: { id: string; name: string; slug: string; isActive: boolean };
      })[];

      // Filter to active tenants only
      const active = candidates.filter((c) => c.tenant.isActive);

      if (active.length === 0) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      if (active.length > 1) {
        // Multiple tenants — return list for user to choose
        return {
          requiresTenantSelection: true,
          tenants: active.map((c) => ({
            slug: c.tenant.slug,
            name: c.tenant.name,
          })),
        };
      }

      // Exactly one tenant — auto-resolve
      user = active[0];
      tenantId = active[0].tenant.id;
    }

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
      const updateData: { failedAttempts: number; lockedUntil?: Date } = {
        failedAttempts: failed,
      };
      if (failed >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
      await this.prisma.auditLog.create({
        data: {
          tenantId,
          userId: user.id,
          action: 'login.failed',
          entity: 'user',
          entityId: user.id,
          ipAddress,
          userAgent,
        },
      });
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // success
    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: user.id,
        action: 'login.success',
        entity: 'user',
        entityId: user.id,
        ipAddress,
        userAgent,
      },
    });

    // If 2FA is enabled, return a challenge instead of full tokens
    if (user.twoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        userId: user.id,
        tenantId,
      };
    }

    const accessToken = await this.issueAccessToken(
      this.buildAuthUser(user, tenantId),
    );
    const created = await this.issueRefreshToken(user.id, ipAddress, userAgent);

    return { accessToken, user: this.userToDto(user), refreshRaw: created.raw };
  }

  /**
   * Complete login after successful 2FA verification.
   */
  async completeTwoFactorLogin(
    userId: string,
    tenantId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: this.RBAC_INCLUDE,
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.issueAccessToken(
      this.buildAuthUser(user as UserRecord, tenantId),
    );
    const created = await this.issueRefreshToken(user.id, ipAddress, userAgent);

    return { accessToken, user: this.userToDto(user), refreshRaw: created.raw };
  }

  async refreshTokens(
    rawRefreshToken: string | undefined,
    ipAddress?: string,
    userAgent?: string,
  ) {
    if (!rawRefreshToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // Use tokenFamily prefix to narrow candidates before expensive bcrypt
    const tokenFamily = rawRefreshToken.substring(0, 16);
    const candidates = (await this.prisma.refreshToken.findMany({
      where: { tokenFamily },
      orderBy: { createdAt: 'desc' },
    })) as RefreshTokenRecord[];

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
      this.logger.warn(
        `Token reuse attack detected for userId=${matched.userId}`,
      );
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // Expired token
    if (matched.expiresAt && matched.expiresAt < new Date()) {
      await this.prisma.refreshToken.update({
        where: { id: matched.id },
        data: { revokedAt: new Date() },
      });
      throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED);
    }

    // Rotation: create new token, link replacedBy on old, revoke old
    const newCreated = await this.issueRefreshToken(
      matched.userId,
      ipAddress,
      userAgent,
    );
    await this.prisma.refreshToken.update({
      where: { id: matched.id },
      data: { revokedAt: new Date(), replacedBy: newCreated.id },
    });

    const user = (await this.prisma.user.findUnique({
      where: { id: matched.userId },
      include: this.RBAC_INCLUDE,
    })) as UserRecord | null;
    if (!user)
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);

    const accessToken = await this.issueAccessToken(
      this.buildAuthUser(user),
    );

    return {
      accessToken,
      user: this.userToDto(user),
      refreshRaw: newCreated.raw,
    };
  }

  async forgotPassword(email: string, tenantSlug?: string) {
    const generic = {
      message: 'If that email exists, a reset link has been sent',
    };

    let tenantIdStr: string | undefined = undefined;

    if (tenantSlug) {
      const tenant = await this.tenants.findBySlug(tenantSlug);
      if (!tenant) return generic;
      tenantIdStr = tenant.id;
    }

    const user = (await this.prisma.user.findFirst({
      where: {
        email,
        ...(tenantIdStr && { tenantId: tenantIdStr }),
      },
    })) as UserRecord | null;

    if (!user) return generic;

    const raw = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(raw, PASSWORD_HASH_COST);
    const tokenFamily = raw.substring(0, 16);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordReset.create({
      data: {
        tenantId: user.tenantId,
        email: user.email,
        token: tokenHash,
        tokenFamily,
        expiresAt,
      },
    });

    const frontendUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    await this.email.sendPasswordReset(user.email, raw, frontendUrl);

    return generic;
  }

  async resetPassword(rawToken: string, newPassword: string) {
    if (newPassword.length < 8) {
      throw new HttpException(
        'Password must be at least 8 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokenFamily = rawToken.substring(0, 16);
    const candidates = (await this.prisma.passwordReset.findMany({
      where: { usedAt: null, tokenFamily },
      orderBy: { createdAt: 'desc' },
    })) as PasswordResetRecord[];

    let matched: PasswordResetRecord | null = null;
    for (const r of candidates) {
      const ok = await bcrypt.compare(rawToken, r.token);
      if (ok) {
        matched = r;
        break;
      }
    }

    if (!matched)
      throw new HttpException(
        'Reset token invalid or expired',
        HttpStatus.GONE,
      );
    if (matched.expiresAt && matched.expiresAt < new Date())
      throw new HttpException(
        'Reset token invalid or expired',
        HttpStatus.GONE,
      );
    if (matched.usedAt)
      throw new HttpException(
        'Reset token invalid or expired',
        HttpStatus.GONE,
      );

    const hashed = await bcrypt.hash(newPassword, PASSWORD_HASH_COST);
    const user = (await this.prisma.user.findFirst({
      where: { tenantId: matched.tenantId, email: matched.email },
    })) as UserRecord | null;
    if (!user)
      throw new HttpException(
        'Reset token invalid or expired',
        HttpStatus.GONE,
      );
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashed, failedAttempts: 0, lockedUntil: null },
    });
    await this.prisma.passwordReset.update({
      where: { id: matched.id },
      data: { usedAt: new Date() },
    });
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revokedAt: new Date() },
    });
    await this.prisma.auditLog.create({
      data: {
        tenantId: matched.tenantId,
        userId: user.id,
        action: 'password.reset',
        entity: 'user',
        entityId: user.id,
      },
    });

    return { message: 'Password reset' };
  }

  async logout(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) return { success: true };

    const tokenFamily = rawRefreshToken.substring(0, 16);
    const tokens = (await this.prisma.refreshToken.findMany({
      where: { tokenFamily },
    })) as RefreshTokenRecord[];
    for (const t of tokens) {
      const ok = await bcrypt.compare(rawRefreshToken, t.tokenHash);
      if (ok) {
        await this.prisma.refreshToken.update({
          where: { id: t.id },
          data: { revokedAt: new Date() },
        });
        break;
      }
    }

    return { success: true };
  }

  async getProfile(userId: string) {
    const user = (await this.prisma.user.findUnique({
      where: { id: userId },
    })) as UserRecord | null;
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.userToDto(user);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { JwtPayload } from '../../common/types/jwt-payload.types.js';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKey: fs.readFileSync(
        config.get<string>(
          'JWT_ACCESS_PUBLIC_KEY_PATH',
          'keys/jwtRS256.public.pem',
        ),
        'utf8',
      ),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
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
        },
      });

      if (!user) return null;
      if (user.deletedAt) return null;
      if (!user.isActive) return null;
      if (user.lockedUntil && user.lockedUntil > new Date()) return null;

      const roles = user.userRoleMappings.map((m) => m.role.name);

      // Deduplicate permissions from all role mappings
      const permSet = new Set<string>();
      for (const mapping of user.userRoleMappings) {
        for (const rp of (mapping.role as any).permissions ?? []) {
          permSet.add(rp.permission.action);
        }
      }

      return {
        sub: user.id,
        tenantId: payload.tenantId,
        roles,
        role: roles[0] ?? 'AGENT',
        permissions: [...permSet],
        email: user.email,
      };
    } catch (err: unknown) {
      this.logger.error(
        'JWT validation error',
        err instanceof Error ? err.stack : String(err),
      );
      return null;
    }
  }
}

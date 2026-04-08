import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';

/**
 * PermissionsGuard — Fail-Closed permission check.
 *
 * Reads `permissions[]` from the JWT-validated request user object
 * and checks against the `@RequirePermission()` metadata.
 *
 * SECURITY: On any error → deny access (Fail-Closed per OWASP A01).
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );

      // No @RequirePermission() decorator → allow (open endpoint)
      if (!requiredPermissions || requiredPermissions.length === 0) return true;

      const req = context
        .switchToHttp()
        .getRequest<{ user?: { permissions?: string[] } }>();
      const user = req.user;

      // No user → deny
      if (!user) return false;

      const userPermissions = user.permissions ?? [];
      if (userPermissions.length === 0) return false;

      // User must have at least ONE of the required permissions
      const hasPermission = requiredPermissions.some((p) =>
        userPermissions.includes(p),
      );

      if (!hasPermission) {
        this.logger.warn(
          `Permission denied: user missing ${requiredPermissions.join(', ')}`,
        );
      }

      return hasPermission;
    } catch (err) {
      // FAIL-CLOSED: any error → deny access
      this.logger.error('PermissionsGuard error — denying access', err);
      return false;
    }
  }
}

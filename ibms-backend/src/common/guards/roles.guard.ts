import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_LEVEL } from '../constants/role-hierarchy.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context
      .switchToHttp()
      .getRequest<{ user?: { role?: string } }>();
    const user = req.user;
    if (!user?.role) return false;

    const userLevel = ROLE_LEVEL[user.role] ?? 0;
    return requiredRoles.some((r) => userLevel >= (ROLE_LEVEL[r] ?? 0));
  }
}

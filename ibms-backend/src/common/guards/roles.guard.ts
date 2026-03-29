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
      .getRequest<{ user?: { role?: string; roles?: string[] } }>();
    const user = req.user;
    if (!user) return false;

    // Gather all assigned roles (prefer roles array, fall back to role string)
    const assignedRoles = user.roles?.length ? user.roles : user.role ? [user.role] : [];
    if (assignedRoles.length === 0) return false;

    // Get the user's highest privilege level across all assigned roles
    const userLevel = Math.max(...assignedRoles.map((r) => ROLE_LEVEL[r] ?? 0));

    for (const role of requiredRoles) {
      const requiredLevel = ROLE_LEVEL[role] ?? 0;
      if (userLevel >= requiredLevel) return true;
    }

    return false;
  }
}

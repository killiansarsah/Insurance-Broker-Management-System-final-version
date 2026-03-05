import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_LEVEL } from '../constants/role-hierarchy.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.role) return false;

    const userLevel = ROLE_LEVEL[user.role] ?? 0;

    for (const role of requiredRoles) {
      const requiredLevel = ROLE_LEVEL[role] ?? 0;
      if (userLevel >= requiredLevel) return true;
    }

    return false;
  }
}

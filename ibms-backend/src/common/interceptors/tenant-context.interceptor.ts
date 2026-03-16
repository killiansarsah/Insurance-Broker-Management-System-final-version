import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Interceptor that sets the PostgreSQL RLS tenant context
 * on every authenticated request. This activates the Row-Level
 * Security policies defined in prisma/rls.sql, providing
 * defense-in-depth tenant isolation at the database layer.
 *
 * Usage: Applied globally in AppModule or per-controller.
 */
@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { tenantId?: string } }>();
    const tenantId = request.user?.tenantId;

    if (tenantId) {
      await this.prisma.setTenantContext(tenantId);
    }

    return next.handle();
  }
}

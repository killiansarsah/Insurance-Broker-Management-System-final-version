import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, NextFunction } from 'express';

/**
 * Defence-in-depth CSRF protection via Origin header validation.
 * Rejects state-changing requests (POST/PUT/PATCH/DELETE) whose
 * Origin does not match the configured CORS origins.
 *
 * Combined with SameSite=strict cookies and Authorization Bearer tokens,
 * this provides layered CSRF mitigation.
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private allowedOrigins: string[];

  constructor(private config: ConfigService) {
    this.allowedOrigins = this.config.get<string[]>('cors.origins', [
      'http://localhost:3000',
    ]);
  }

  use(req: Request, _res: Response, next: NextFunction) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
      return next();
    }

    const origin = req.get('origin');
    // If no Origin header (e.g. same-origin non-CORS request, server-to-server), allow
    if (!origin) {
      return next();
    }

    if (this.allowedOrigins.includes(origin)) {
      return next();
    }

    throw new ForbiddenException('Cross-origin request rejected');
  }
}

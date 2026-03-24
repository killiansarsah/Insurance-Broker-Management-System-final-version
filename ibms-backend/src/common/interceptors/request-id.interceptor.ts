import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';

const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Assigns a unique request ID to every incoming request.
 * If the client sends an `X-Request-Id` header it is preserved;
 * otherwise a new UUIDv4 is generated.
 * The ID is echoed back in the response header and attached
 * to `req.requestId` for downstream logging.
 */
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { requestId?: string }>();
    const res = http.getResponse<Response>();

    const requestId =
      (req.headers[REQUEST_ID_HEADER] as string) || randomUUID();
    req.requestId = requestId;
    res.setHeader(REQUEST_ID_HEADER, requestId);

    return next.handle().pipe(
      tap(() => {
        /* noop — ensures header is set even on success */
      }),
    );
  }
}

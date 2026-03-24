import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prisma } from '@prisma/client';

type Decimal = Prisma.Decimal;

function convertDecimals(obj: unknown): unknown {
  if (
    obj &&
    typeof obj === 'object' &&
    'toNumber' in obj &&
    typeof (obj as any).toNumber === 'function'
  ) {
    return (obj as any).toNumber();
  }
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDecimals);
  }
  if (obj instanceof Date) {
    return obj;
  }
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = convertDecimals(value);
    }
    return result;
  }
  return obj;
}

@Injectable()
export class DecimalSerializationInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map(convertDecimals));
  }
}

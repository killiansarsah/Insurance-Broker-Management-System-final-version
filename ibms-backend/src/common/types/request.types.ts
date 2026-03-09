import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    tenantId: string;
    role: string;
    email: string;
  };
}

export interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

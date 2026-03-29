export interface JwtPayload {
  sub: string;
  tenantId: string;
  roles: string[];
  role: string; // backward compat: primary role (first in array)
  permissions: string[]; // granular permission actions (e.g. 'policies:create')
  email: string;
  iat?: number;
  exp?: number;
}

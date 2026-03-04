export interface JwtPayload {
  sub: string;
  tenantId: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

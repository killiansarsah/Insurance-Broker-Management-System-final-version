export const ROLE_LEVEL: Record<string, number> = {
  PLATFORM_SUPER_ADMIN: 10,
  WORKSPACE_OWNER: 8,
  ADMINISTRATOR: 7,
  MANAGER: 5,
  SUPERVISOR: 4,
  AGENT: 2,
};

export const CANONICAL_ROLES = [
  'PLATFORM_SUPER_ADMIN',
  'WORKSPACE_OWNER',
  'ADMINISTRATOR',
  'MANAGER',
  'SUPERVISOR',
  'AGENT',
] as const;

export type CanonicalRole = (typeof CANONICAL_ROLES)[number];

export const ROLE_LEVEL: Record<string, number> = {
  PLATFORM_SUPER_ADMIN: 8,
  SUPER_ADMIN: 7,
  TENANT_ADMIN: 6,
  ADMIN: 6,
  BRANCH_MANAGER: 5,
  COMPLIANCE_OFFICER: 4,
  FINANCE_MANAGER: 4,
  SENIOR_BROKER: 4,
  BROKER: 3,
  UNDERWRITER: 3,
  AGENT: 2,
  SECRETARY: 2,
  DATA_ENTRY: 2,
  VIEWER: 1,
};

export function canAssignRole(
  assignerRole: string,
  targetRole: string,
): boolean {
  const assignerLevel = ROLE_LEVEL[assignerRole] ?? 0;
  const targetLevel = ROLE_LEVEL[targetRole] ?? 0;
  return assignerLevel >= targetLevel;
}

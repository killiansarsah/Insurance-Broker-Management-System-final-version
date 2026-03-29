// ─── New 5-Tier System Roles ─────────────────────────────
// These are the canonical role names going forward.
// Legacy names below are kept for backward compatibility
// during the transition period (Checkpoints 2-5).
export const ROLE_LEVEL: Record<string, number> = {
  // New 5-tier system roles
  WORKSPACE_OWNER: 8,
  ADMINISTRATOR: 7,
  MANAGER: 5,
  SUPERVISOR: 4,
  AGENT: 2,

  // Legacy role names (backward compat — maps to same levels)
  PLATFORM_SUPER_ADMIN: 8,
  SUPER_ADMIN: 7,
  TENANT_ADMIN: 7,
  ADMIN: 7,
  BRANCH_MANAGER: 4,
  COMPLIANCE_OFFICER: 4,
  FINANCE_MANAGER: 5,
  SENIOR_BROKER: 5,
  BROKER: 2,
  UNDERWRITER: 5,
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

import { PrismaService } from '../../prisma/prisma.service.js';
import { ROLE_LEVEL } from './role-hierarchy.js';

/**
 * Get the role level for a user by reading the flat `role` field.
 * Replaces the old getActorMaxRoleLevel() pattern that queried junction tables.
 */
export async function getUserRoleLevel(
  prisma: PrismaService,
  userId: string,
): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) return 0;
  return ROLE_LEVEL[user.role] ?? 0;
}

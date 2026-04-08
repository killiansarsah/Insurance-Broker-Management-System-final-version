import { IsEmail, IsIn, IsOptional, IsUUID } from 'class-validator';
import { CANONICAL_ROLES } from '../../common/constants/role-hierarchy.js';

export class CreateInvitationDto {
  @IsEmail()
  email!: string;

  @IsIn(CANONICAL_ROLES)
  role!: string;

  @IsUUID()
  @IsOptional()
  branchId?: string;
}

import { IsEnum, IsBoolean, IsOptional } from 'class-validator';

export enum SystemRoleEnum {
  PLATFORM_SUPER_ADMIN = 'PLATFORM_SUPER_ADMIN',
  WORKSPACE_OWNER = 'WORKSPACE_OWNER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  MANAGER = 'MANAGER',
  SUPERVISOR = 'SUPERVISOR',
  AGENT = 'AGENT',
}

export class ChangeRoleDto {
  @IsEnum(SystemRoleEnum)
  role: SystemRoleEnum;

  @IsBoolean()
  @IsOptional()
  resetPermissions?: boolean;
}

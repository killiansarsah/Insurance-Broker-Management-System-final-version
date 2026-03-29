import { IsEmail, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail()
  email!: string;

  @IsString()
  role!: string;

  @IsUUID()
  @IsOptional()
  branchId?: string;
}

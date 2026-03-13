import { IsEmail, IsString, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  tenantSlug?: string;
}

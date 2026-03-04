import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  tenantSlug!: string;
}

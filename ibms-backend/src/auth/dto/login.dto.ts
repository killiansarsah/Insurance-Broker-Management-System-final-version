import { IsEmail, IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  tenantSlug!: string;
}

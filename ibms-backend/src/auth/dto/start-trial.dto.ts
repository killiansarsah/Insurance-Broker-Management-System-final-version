import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class StartTrialDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  companyName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s-]{7,20}$/)
  phone?: string;
}
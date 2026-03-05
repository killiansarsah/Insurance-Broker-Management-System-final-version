import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNumber,
  IsPositive,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LeadSource, LeadPriority } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  contactName!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(LeadSource)
  source!: LeadSource;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  productInterest?: string[];

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  estimatedPremium?: number;

  @IsEnum(LeadPriority)
  @IsOptional()
  priority?: LeadPriority;

  @IsUUID()
  @IsOptional()
  assignedBrokerId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

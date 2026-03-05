import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNumber,
  IsPositive,
  IsUUID,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LeadPriority } from '@prisma/client';

export class UpdateLeadDto {
  @IsString()
  @IsOptional()
  contactName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

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

  @IsDateString()
  @IsOptional()
  nextFollowUpDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

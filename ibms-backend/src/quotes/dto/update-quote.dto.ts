import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InsuranceType, QuoteStatus } from '@prisma/client';

export class UpdateQuoteOptionDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  carrierName?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  premium?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sumInsured?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  commissionRate?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  commissionAmount?: number;

  @IsString()
  @IsOptional()
  excessOrDeductible?: string;

  @IsString()
  @IsOptional()
  coverageNotes?: string;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

  @IsBoolean()
  @IsOptional()
  isSelected?: boolean;
}

export class UpdateQuoteDto {
  @IsEnum(InsuranceType)
  @IsOptional()
  insuranceType?: InsuranceType;

  @IsString()
  @IsOptional()
  coverageType?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sumInsuredRequested?: number;

  @IsString()
  @IsOptional()
  riskDescription?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuoteOptionDto)
  @IsOptional()
  options?: UpdateQuoteOptionDto[];
}

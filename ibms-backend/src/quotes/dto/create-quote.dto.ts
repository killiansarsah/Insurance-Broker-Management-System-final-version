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
import { InsuranceType } from '@prisma/client';

export class CreateQuoteOptionDto {
  @IsString()
  carrierName!: string;

  @IsNumber()
  @Type(() => Number)
  premium!: number;

  @IsNumber()
  @Type(() => Number)
  sumInsured!: number;

  @IsNumber()
  @Type(() => Number)
  commissionRate!: number;

  @IsNumber()
  @Type(() => Number)
  commissionAmount!: number;

  @IsString()
  @IsOptional()
  excessOrDeductible?: string;

  @IsString()
  @IsOptional()
  coverageNotes?: string;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;
}

export class CreateQuoteDto {
  @IsString()
  clientId!: string;

  @IsEnum(InsuranceType)
  insuranceType!: InsuranceType;

  @IsString()
  @IsOptional()
  coverageType?: string;

  @IsString()
  @IsOptional()
  policyType?: string;

  @IsNumber()
  @Type(() => Number)
  sumInsuredRequested!: number;

  @IsString()
  @IsOptional()
  riskDescription?: string;

  @IsDateString()
  validUntil!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteOptionDto)
  @IsOptional()
  options?: CreateQuoteOptionDto[];
}

import {
  IsString,
  IsUUID,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InsuranceType, PremiumFrequency } from '@prisma/client';
import { CreateVehicleDetailsDto } from './details/create-vehicle-details.dto';
import { CreatePropertyDetailsDto } from './details/create-property-details.dto';
import { CreateMarineDetailsDto } from './details/create-marine-details.dto';

export class CreatePolicyDto {
  @IsUUID()
  clientId!: string;

  @IsUUID()
  carrierId!: string;

  @IsUUID()
  productId!: string;

  @IsEnum(InsuranceType)
  insuranceType!: InsuranceType;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @Type(() => Number)
  @IsNumber()
  premiumAmount!: number;

  @Type(() => Number)
  @IsNumber()
  sumInsured!: number;

  @IsEnum(PremiumFrequency)
  premiumFrequency!: PremiumFrequency;

  @IsString()
  @IsOptional()
  policyNumber?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  commission?: number;

  @IsString()
  @IsOptional()
  coverageDetails?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVehicleDetailsDto)
  vehicleDetails?: CreateVehicleDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePropertyDetailsDto)
  propertyDetails?: CreatePropertyDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMarineDetailsDto)
  marineDetails?: CreateMarineDetailsDto;
}

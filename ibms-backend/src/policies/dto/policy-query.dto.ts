import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PolicyStatus, InsuranceType, PremiumFrequency } from '@prisma/client';

export class PolicyQueryDto extends PaginationDto {
  @IsEnum(PolicyStatus)
  @IsOptional()
  status?: PolicyStatus;

  @IsEnum(InsuranceType)
  @IsOptional()
  insuranceType?: InsuranceType;

  @IsString()
  @IsOptional()
  carrierId?: string;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsEnum(PremiumFrequency)
  @IsOptional()
  premiumFrequency?: PremiumFrequency;

  @IsString()
  @IsOptional()
  startDateFrom?: string;

  @IsString()
  @IsOptional()
  startDateTo?: string;

  @IsString()
  @IsOptional()
  endDateFrom?: string;

  @IsString()
  @IsOptional()
  endDateTo?: string;
}

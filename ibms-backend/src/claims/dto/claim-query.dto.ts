import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ClaimStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ClaimQueryDto extends PaginationDto {
  @IsEnum(ClaimStatus)
  @IsOptional()
  status?: ClaimStatus;

  @IsString()
  @IsOptional()
  carrierId?: string;

  @IsString()
  @IsOptional()
  policyId?: string;

  @IsString()
  @IsOptional()
  clientId?: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isOverdue?: boolean;

  @IsString()
  @IsOptional()
  reportedFrom?: string;

  @IsString()
  @IsOptional()
  reportedTo?: string;

  @IsString()
  @IsOptional()
  incidentFrom?: string;

  @IsString()
  @IsOptional()
  incidentTo?: string;
}

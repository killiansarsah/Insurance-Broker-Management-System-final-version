import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ApprovalType, ApprovalStatus } from '@prisma/client';

export class CreateApprovalDto {
  @IsEnum(ApprovalType)
  type!: ApprovalType;

  @IsString()
  subject!: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  linkedEntityType?: string;

  @IsString()
  @IsOptional()
  linkedEntityId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ApprovalQueryDto extends PaginationDto {
  @IsEnum(ApprovalStatus)
  @IsOptional()
  status?: ApprovalStatus;

  @IsEnum(ApprovalType)
  @IsOptional()
  type?: ApprovalType;
}

export class ApprovalDecisionDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

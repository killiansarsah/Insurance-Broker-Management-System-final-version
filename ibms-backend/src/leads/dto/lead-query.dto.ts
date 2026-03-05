import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { LeadStatus, LeadSource, LeadPriority } from '@prisma/client';

export class LeadQueryDto extends PaginationDto {
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsEnum(LeadSource)
  @IsOptional()
  source?: LeadSource;

  @IsEnum(LeadPriority)
  @IsOptional()
  priority?: LeadPriority;

  @IsString()
  @IsOptional()
  assignedBrokerId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}

export class UpdateLeadStageDto {
  @IsEnum(LeadStatus)
  status!: LeadStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  convertToClient?: boolean;
}

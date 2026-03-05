import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CommissionStatus } from '@prisma/client';

export class CommissionQueryDto extends PaginationDto {
  @IsEnum(CommissionStatus)
  @IsOptional()
  status?: CommissionStatus;

  @IsString()
  @IsOptional()
  carrierId?: string;

  @IsString()
  @IsOptional()
  brokerId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}

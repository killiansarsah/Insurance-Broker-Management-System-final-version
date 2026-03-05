import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ExpenseStatus } from '@prisma/client';

export class ExpenseQueryDto extends PaginationDto {
  @IsEnum(ExpenseStatus)
  @IsOptional()
  status?: ExpenseStatus;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}

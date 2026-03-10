import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { QuoteStatus, InsuranceType } from '@prisma/client';

export class QuoteQueryDto extends PaginationDto {
  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @IsEnum(InsuranceType)
  @IsOptional()
  insuranceType?: InsuranceType;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}

import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DocumentCategory } from '@prisma/client';

export class DocumentQueryDto extends PaginationDto {
  @IsEnum(DocumentCategory)
  @IsOptional()
  category?: DocumentCategory;

  @IsString()
  @IsOptional()
  linkedEntityType?: string;

  @IsString()
  @IsOptional()
  linkedEntityId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}

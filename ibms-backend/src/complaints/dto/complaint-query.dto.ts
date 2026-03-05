import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ComplaintStatus, ComplaintPriority } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ComplaintQueryDto extends PaginationDto {
  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(ComplaintPriority)
  @IsOptional()
  priority?: ComplaintPriority;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isOverdue?: boolean;

  @IsString()
  @IsOptional()
  assignedToId?: string;
}

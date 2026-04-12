import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CarrierStatus } from '@prisma/client';

export class CarrierQueryDto extends PaginationDto {
  @IsEnum(CarrierStatus)
  @IsOptional()
  status?: CarrierStatus;
}

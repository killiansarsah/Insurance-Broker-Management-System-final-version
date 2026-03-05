import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CarrierQueryDto extends PaginationDto {
  @IsString()
  @IsOptional()
  status?: string;
}

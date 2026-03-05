import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { InsuranceType } from '@prisma/client';

export class ProductQueryDto extends PaginationDto {

    @IsEnum(InsuranceType)
    @IsOptional()
    insuranceType?: InsuranceType;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

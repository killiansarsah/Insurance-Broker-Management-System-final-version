import { IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class UserQueryDto extends PaginationDto {
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsUUID()
    @IsOptional()
    branchId?: string;
}

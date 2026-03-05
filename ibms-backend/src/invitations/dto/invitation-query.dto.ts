import { IsEnum, IsOptional } from 'class-validator';
import { InvitationStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class InvitationQueryDto extends PaginationDto {
    @IsEnum(InvitationStatus)
    @IsOptional()
    status?: InvitationStatus;
}

import { IsEnum, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { KycStatus } from '@prisma/client';

export class UpdateKycDto {
    @IsEnum(KycStatus)
    @IsNotEmpty()
    kycStatus!: KycStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}

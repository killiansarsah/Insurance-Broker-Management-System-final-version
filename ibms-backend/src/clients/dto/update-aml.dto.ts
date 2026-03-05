import { IsEnum, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { AmlRiskLevel } from '@prisma/client';

export class UpdateAmlDto {
    @IsEnum(AmlRiskLevel)
    @IsNotEmpty()
    amlRiskLevel!: AmlRiskLevel;

    @IsString()
    @IsOptional()
    notes?: string;
}

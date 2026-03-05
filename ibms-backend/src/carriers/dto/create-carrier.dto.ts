import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength, IsEnum } from 'class-validator';
import { CarrierType } from '@prisma/client';

export class CreateCarrierDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name!: string;

    @IsString()
    @IsNotEmpty()
    shortName!: string;

    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsEnum(CarrierType)
    @IsNotEmpty()
    type!: CarrierType;

    @IsString()
    @IsOptional()
    licenseNumber?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    website?: string;

    @IsString()
    @IsOptional()
    logoUrl?: string;

    @IsString()
    @IsOptional()
    brandColor?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    contactPerson?: string;

    @IsString()
    @IsOptional()
    address?: string;
}

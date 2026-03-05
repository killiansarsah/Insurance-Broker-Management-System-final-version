import { IsEnum, IsString, IsNotEmpty, IsOptional, IsEmail, IsDateString, IsBoolean } from 'class-validator';
import { ClientType, Gender, KycStatus, AmlRiskLevel } from '@prisma/client';

export class CreateClientDto {
    @IsEnum(ClientType)
    @IsNotEmpty()
    type!: ClientType;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    companyName?: string;

    @IsString()
    @IsNotEmpty()
    phone!: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    region?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    digitalAddress?: string;

    @IsString()
    @IsOptional()
    ghanaCardNumber?: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @IsString()
    @IsOptional()
    occupation?: string;

    @IsBoolean()
    @IsOptional()
    isPep?: boolean;

    @IsBoolean()
    @IsOptional()
    eddRequired?: boolean;
}

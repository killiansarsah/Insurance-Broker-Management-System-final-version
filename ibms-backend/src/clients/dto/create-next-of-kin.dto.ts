import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNextOfKinDto {
    @IsString()
    @IsNotEmpty()
    fullName!: string;

    @IsString()
    @IsNotEmpty()
    relationship!: string;

    @IsString()
    @IsNotEmpty()
    phone!: string;

    @IsString()
    @IsOptional()
    address?: string;
}

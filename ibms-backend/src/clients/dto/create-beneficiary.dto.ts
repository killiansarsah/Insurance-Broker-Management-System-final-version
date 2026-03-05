import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsDateString } from 'class-validator';

export class CreateBeneficiaryDto {
    @IsString()
    @IsNotEmpty()
    fullName!: string;

    @IsString()
    @IsNotEmpty()
    relationship!: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @IsString()
    @IsOptional()
    ghanaCardNumber?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    @IsNotEmpty()
    percentage!: number;

    @IsString()
    @IsOptional()
    guardianName?: string;
}

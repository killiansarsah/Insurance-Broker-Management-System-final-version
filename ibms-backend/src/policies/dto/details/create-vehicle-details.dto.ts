import { IsString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { MotorCoverType } from '@prisma/client';

export class CreateVehicleDetailsDto {
  @IsString()
  registrationNumber!: string;

  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  @Min(1900)
  year!: number;

  @IsString()
  @IsOptional()
  chassisNumber?: string;

  @IsString()
  @IsOptional()
  engineNumber?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  bodyType?: string;

  @IsInt()
  @IsOptional()
  seatingCapacity?: number;

  @IsString()
  @IsOptional()
  usageType?: string;

  @IsEnum(MotorCoverType)
  @IsOptional()
  motorCoverType?: MotorCoverType;
}

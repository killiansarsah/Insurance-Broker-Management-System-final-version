import {
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNumber,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClaimDto {
  @IsUUID()
  policyId!: string;

  @IsString()
  @MinLength(20)
  description!: string;

  @IsDateString()
  incidentDate!: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  claimAmount?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  policeReportNumber?: string;

  @IsString()
  @IsOptional()
  hospitalName?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

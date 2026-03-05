import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RenewPolicyDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  premiumAmount!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  sumInsured?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

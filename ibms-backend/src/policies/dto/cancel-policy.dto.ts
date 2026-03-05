import { IsString, IsDateString, MinLength } from 'class-validator';

export class CancelPolicyDto {
  @IsString()
  @MinLength(5)
  reason!: string;

  @IsDateString()
  effectiveDate!: string;
}

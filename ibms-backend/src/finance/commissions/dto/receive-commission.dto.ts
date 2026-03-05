import {
  IsNumber,
  IsPositive,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiveCommissionDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  receivedAmount!: number;

  @IsDateString()
  receivedDate!: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

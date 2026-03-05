import {
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNumber,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsUUID()
  clientId!: string;

  @IsUUID()
  @IsOptional()
  policyId?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

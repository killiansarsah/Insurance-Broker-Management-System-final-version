import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInvoiceDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CancelInvoiceDto {
  @IsString()
  @MinLength(5)
  reason!: string;
}

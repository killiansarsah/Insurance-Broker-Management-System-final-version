import {
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class PayInstallmentDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  paidAmount!: number;

  @IsDateString()
  paidDate!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  reference?: string;
}

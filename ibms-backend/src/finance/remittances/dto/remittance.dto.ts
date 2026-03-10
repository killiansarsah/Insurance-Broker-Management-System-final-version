import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, RemittanceStatus } from '@prisma/client';

export class CreateRemittanceDto {
  @IsUUID()
  carrierId!: string;

  @IsUUID()
  policyId!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  premiumAmount!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amountRemitted!: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsDateString()
  @IsOptional()
  remittanceDate?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class RemittanceQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(RemittanceStatus)
  @IsOptional()
  status?: RemittanceStatus;

  @IsUUID()
  @IsOptional()
  carrierId?: string;

  @IsUUID()
  @IsOptional()
  policyId?: string;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class ConfirmRemittanceDto {
  @IsDateString()
  remittanceDate!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

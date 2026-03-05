import {
  IsString,
  IsEnum,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType, PaymentMethod, MoMoNetwork } from '@prisma/client';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type!: TransactionType;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsDateString()
  date!: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsUUID()
  @IsOptional()
  policyId?: string;

  @IsUUID()
  @IsOptional()
  invoiceId?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  claimId?: string;

  @IsString()
  @IsOptional()
  chequeNumber?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsEnum(MoMoNetwork)
  @IsOptional()
  momoNetwork?: MoMoNetwork;

  @IsString()
  @IsOptional()
  momoPhone?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

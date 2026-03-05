import {
  IsUUID,
  IsDateString,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PFStatus, PaymentMethod } from '@prisma/client';

export class CreatePremiumFinancingDto {
  @IsUUID()
  policyId!: string;

  @IsUUID()
  clientId!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  financedAmount!: number;

  @Type(() => Number)
  @IsNumber()
  interestRate!: number;

  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(12)
  numberOfInstallments!: number;

  @IsDateString()
  startDate!: string;

  @IsString()
  @IsOptional()
  financier?: string;
}

export class PfQueryDto extends PaginationDto {
  @IsEnum(PFStatus)
  @IsOptional()
  status?: PFStatus;

  @IsString()
  @IsOptional()
  clientId?: string;
}

export class PayPfInstallmentDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  paidAmount!: number;

  @IsDateString()
  paidDate!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  reference?: string;
}

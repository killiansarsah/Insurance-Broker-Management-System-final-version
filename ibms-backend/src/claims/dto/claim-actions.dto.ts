import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateClaimDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  claimAmount?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  assessedAmount?: number;

  @IsString()
  @MinLength(20)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  insurerReference?: string;

  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  insurerSubmissionDate?: Date;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  deductibleAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AcknowledgeClaimDto {
  @IsString()
  @IsOptional()
  notes?: string;
}

export class InvestigateClaimDto {
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ApproveClaimDto {
  @Type(() => Number)
  @IsNumber()
  approvedAmount!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class RejectClaimDto {
  @IsString()
  @MinLength(10)
  reason!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class SettleClaimDto {
  @Type(() => Number)
  @IsNumber()
  settledAmount!: number;

  @IsString()
  paymentMethod!: string;

  @IsString()
  @IsOptional()
  paymentReference?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  deductibleAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ReopenClaimDto {
  @IsString()
  @MinLength(5)
  reason!: string;

  @IsString()
  @IsOptional()
  appealNotes?: string;
}

export class CreateClaimDocumentDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsString()
  url!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

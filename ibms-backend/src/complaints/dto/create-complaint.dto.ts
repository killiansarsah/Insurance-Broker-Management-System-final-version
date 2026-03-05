import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ComplaintPriority } from '@prisma/client';

export class CreateComplaintDto {
  @IsUUID()
  clientId!: string;

  @IsString()
  @MinLength(5)
  subject!: string;

  @IsString()
  @MinLength(20)
  description!: string;

  @IsString()
  category!: string;

  @IsEnum(ComplaintPriority)
  priority!: ComplaintPriority;

  @IsUUID()
  @IsOptional()
  policyId?: string;

  @IsUUID()
  @IsOptional()
  claimId?: string;

  @IsString()
  @IsOptional()
  preferredResolution?: string;
}

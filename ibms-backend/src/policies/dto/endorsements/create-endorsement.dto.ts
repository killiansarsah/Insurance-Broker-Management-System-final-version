import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EndorsementType } from '@prisma/client';

export class CreateEndorsementDto {
  @IsEnum(EndorsementType)
  type!: EndorsementType;

  @IsString()
  description!: string;

  @IsDateString()
  effectiveDate!: string;

  @Type(() => Number)
  @IsNumber()
  premiumAdjustment!: number;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}

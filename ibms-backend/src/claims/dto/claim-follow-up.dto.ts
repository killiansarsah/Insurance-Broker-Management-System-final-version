import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ChaseMethod } from '@prisma/client';

export class CreateClaimFollowUpDto {
  @IsEnum(ChaseMethod)
  method!: ChaseMethod;

  @IsString()
  @MinLength(5)
  note!: string;

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsString()
  @IsOptional()
  nextAction?: string;

  @IsDateString()
  @IsOptional()
  followUpDate?: string;
}

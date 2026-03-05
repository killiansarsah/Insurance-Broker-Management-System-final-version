import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsBoolean,
  MinLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsString()
  category!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsDateString()
  date!: string;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsString()
  @IsOptional()
  vendor?: string;

  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsBoolean()
  @IsOptional()
  approvalRequired?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ImportExpensesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseDto)
  expenses!: CreateExpenseDto[];
}

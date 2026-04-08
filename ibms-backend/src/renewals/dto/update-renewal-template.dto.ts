import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRenewalTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  triggerDays?: number;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  htmlContent?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

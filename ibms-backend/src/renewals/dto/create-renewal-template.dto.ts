import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRenewalTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  triggerDays!: number;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  htmlContent!: string;

  @IsBoolean()
  isActive!: boolean;
}

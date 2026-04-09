import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDetailsDto {
  @IsString()
  @IsOptional()
  propertyAddress?: string;

  @IsString()
  @IsOptional()
  propertyType?: string;

  @IsString()
  @IsOptional()
  constructionType?: string;

  @IsInt()
  @Min(1800)
  @IsOptional()
  yearBuilt?: number;

  @Type(() => Number)
  @IsOptional()
  estimatedValue?: number;

  @IsString()
  @IsOptional()
  occupancyType?: string;
}

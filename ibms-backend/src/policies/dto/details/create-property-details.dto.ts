import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDetailsDto {
  @IsString()
  @IsOptional()
  propertyType?: string;

  @IsString()
  address!: string;

  @IsString()
  @IsOptional()
  constructionType?: string;

  @IsInt()
  @Min(1800)
  @IsOptional()
  yearBuilt?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  numberOfFloors?: number;

  @IsString()
  @IsOptional()
  occupancyType?: string;

  // Decimal mapped dynamically via validation layer
  @Type(() => Number)
  @IsOptional()
  squareMeters?: number;
}

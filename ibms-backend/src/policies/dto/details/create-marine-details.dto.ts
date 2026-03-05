import { IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMarineDetailsDto {
  @IsString()
  vesselName!: string;

  @IsString()
  @IsOptional()
  vesselType?: string;

  @IsString()
  @IsOptional()
  imoNumber?: string;

  @Type(() => Number)
  @IsOptional()
  grossTonnage?: number;

  @IsString()
  @IsOptional()
  voyageFrom?: string;

  @IsString()
  @IsOptional()
  voyageTo?: string;

  @IsString()
  @IsOptional()
  cargoDescription?: string;

  @Type(() => Number)
  @IsOptional()
  cargoValue?: number;
}

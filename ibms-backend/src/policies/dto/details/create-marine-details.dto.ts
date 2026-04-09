import { IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMarineDetailsDto {
  @IsString()
  @IsOptional()
  vesselName?: string;

  @IsString()
  @IsOptional()
  imoNumber?: string;

  @IsString()
  @IsOptional()
  voyageRoute?: string;

  @IsString()
  @IsOptional()
  cargoDescription?: string;

  @Type(() => Number)
  @IsOptional()
  cargoValue?: number;

  @IsString()
  @IsOptional()
  conveyanceType?: string;

}

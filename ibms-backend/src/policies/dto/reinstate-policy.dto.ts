import { IsString, MinLength } from 'class-validator';

export class ReinstatePolicyDto {
  @IsString()
  @MinLength(5)
  reason!: string;
}

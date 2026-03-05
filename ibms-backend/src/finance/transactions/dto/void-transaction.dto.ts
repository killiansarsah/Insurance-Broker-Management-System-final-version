import { IsString, MinLength } from 'class-validator';

export class VoidTransactionDto {
  @IsString()
  @MinLength(5)
  reason!: string;
}

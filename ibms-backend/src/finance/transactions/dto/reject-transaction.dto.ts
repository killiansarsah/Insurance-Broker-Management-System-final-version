import { IsString, MinLength } from 'class-validator';

export class RejectTransactionDto {
  @IsString()
  @MinLength(5)
  reason!: string;
}

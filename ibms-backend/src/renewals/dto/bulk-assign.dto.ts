import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class BulkAssignDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  policyIds!: string[];

  @IsString()
  brokerId!: string;
}

import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class BulkRemindDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  policyIds!: string[];
}

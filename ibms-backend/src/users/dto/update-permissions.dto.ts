import { IsArray, IsString, ArrayUnique } from 'class-validator';
import { ALL_PERMISSIONS } from '../../common/constants/permissions';

export class UpdatePermissionsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  permissions: string[];
}

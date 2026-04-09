import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePolicyDto } from './create-policy.dto';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVehicleDetailsDto } from './details/create-vehicle-details.dto';
import { CreatePropertyDetailsDto } from './details/create-property-details.dto';
import { CreateMarineDetailsDto } from './details/create-marine-details.dto';

export class UpdatePolicyDto extends PartialType(
  PickType(CreatePolicyDto, [
    'policyNumber',
    'premiumAmount',
    'sumInsured',
    'startDate',
    'endDate',
    'coverageDetails',
    'premiumFrequency',
    'commission',
    'renewalStatus',
    'lapseReason',
  ]),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVehicleDetailsDto)
  vehicleDetails?: CreateVehicleDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePropertyDetailsDto)
  propertyDetails?: CreatePropertyDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMarineDetailsDto)
  marineDetails?: CreateMarineDetailsDto;
}

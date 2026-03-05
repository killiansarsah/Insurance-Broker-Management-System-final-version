import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePolicyDto } from './create-policy.dto';

export class UpdatePolicyDto extends PartialType(
  PickType(CreatePolicyDto, [
    'premiumAmount',
    'sumInsured',
    'endDate',
    'coverageDetails',
    'premiumFrequency',
  ]),
) {}

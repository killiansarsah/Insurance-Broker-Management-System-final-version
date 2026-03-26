import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePolicyDto } from './create-policy.dto';

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
) {}

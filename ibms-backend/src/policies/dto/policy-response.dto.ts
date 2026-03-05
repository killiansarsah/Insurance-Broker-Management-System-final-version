import { PolicyStatus, InsuranceType, PremiumFrequency } from '@prisma/client';

export class PolicyResponseDto {
  id!: string;
  policyNumber!: string;
  insuranceType!: InsuranceType;
  startDate!: Date;
  endDate!: Date;
  premiumAmount!: number;
  sumInsured!: number;
  premiumFrequency!: PremiumFrequency;
  status!: PolicyStatus;
  currency!: string;
  commission!: number;
  coverageDetails!: string | null;
  clientId!: string;
  carrierId!: string;
  productId!: string;
}

export class PolicyDetailResponseDto extends PolicyResponseDto {
  client?: any;
  carrier?: any;
  product?: any;
  vehicleDetails?: any[];
  propertyDetails?: any[];
  marineDetails?: any[];
  endorsements?: any[];
  installments?: any[];
  documents?: any[];
  claims?: any[];
}

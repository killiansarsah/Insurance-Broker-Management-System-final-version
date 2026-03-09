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
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string | null;
    phone?: string | null;
    email?: string | null;
    type?: string;
  };
  carrier?: { id: string; name: string; shortName?: string };
  product?: { id: string; name: string; code?: string };
  vehicleDetails?: Record<string, unknown>[];
  propertyDetails?: Record<string, unknown>[];
  marineDetails?: Record<string, unknown>[];
  endorsements?: Record<string, unknown>[];
  installments?: Record<string, unknown>[];
  documents?: Record<string, unknown>[];
  claims?: { id: string; claimNumber: string; status: string; claimAmount: number }[];
}

import { PolicyStatus, InsuranceType, PremiumFrequency } from '@prisma/client';

export class PolicySummaryDto {
  id!: string;
  policyNumber!: string;
  insuranceType!: InsuranceType;
  startDate!: Date;
  endDate!: Date;
  status!: PolicyStatus;
  premiumAmount!: number;
  premiumFrequency!: PremiumFrequency;
  client!: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
  };
  carrier!: { id: string; name: string };
  product!: { id: string; name: string };
}

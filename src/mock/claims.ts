import { Claim, ClaimStatus } from '@/types';
import { policies } from './policies';

function getRandomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function generateClaims(count: number): Claim[] {
    return Array.from({ length: count }, (_, i) => {
        const policy = policies[i % policies.length];
        const incidentDate = getRandomDate(new Date(2023, 0, 1), new Date());
        // Report date 1-5 days after incident
        const reportDate = new Date(new Date(incidentDate).getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString();

        const amount = Math.floor(Math.random() * 50000) + 1000;

        // Status logic
        const statuses = ['intimated', 'registered', 'under_review', 'assessed', 'approved', 'settled', 'rejected', 'closed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)] as ClaimStatus;

        return {
            id: `CLM-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
            policyId: policy.id,
            policyNumber: policy.policyNumber,
            clientId: policy.clientId,
            clientName: policy.clientName || 'Unknown Client',
            claimNumber: `CLM-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
            incidentDate,
            incidentDescription: `Claim for ${policy.insuranceType} incident. ${policy.insuranceType === 'motor' ? 'Collision with third party vehicle.' :
                policy.insuranceType === 'fire' ? 'Fire damage to property.' :
                    policy.insuranceType === 'health' ? 'Medical expenses reimbursement.' :
                        'General loss reported.'
                }`,
            incidentLocation: 'Accra, Ghana',
            status,
            claimAmount: amount,
            assessedAmount: status === 'assessed' || status === 'approved' || status === 'settled' ? amount * 0.9 : undefined,
            settledAmount: status === 'settled' ? amount * 0.9 : undefined,
            approvedAmount: status === 'approved' || status === 'settled' ? amount * 0.9 : undefined, // Not in type but useful mock logic if type changes? Wait, types has claimAmount, assessedAmount, settledAmount.
            currency: 'GHS',
            intimationDate: reportDate,
            registrationDate: status !== 'intimated' ? reportDate : undefined,
            acknowledgmentDeadline: new Date(new Date(reportDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            processingDeadline: new Date(new Date(reportDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isOverdue: false,
            createdAt: reportDate,
            updatedAt: reportDate,
        } as unknown as Claim;
    });
}

export const claims: Claim[] = generateClaims(25);

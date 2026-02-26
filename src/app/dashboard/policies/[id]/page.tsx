import { mockPolicies } from '@/mock/policies';
import PolicyDetailClient from './policy-detail-page';

// Static export — pre-generate all policy detail routes
export function generateStaticParams() {
    return mockPolicies.map((policy) => ({
        id: policy.id,
    }));
}

export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PolicyDetailClient policyId={id} />;
}

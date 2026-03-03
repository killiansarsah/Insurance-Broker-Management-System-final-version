import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockPolicies } from '@/mock/policies';
import PolicyDetailClient from './policy-detail-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const policy = mockPolicies.find((p) => p.id === id);
    if (!policy) return { title: 'Policy not found' };
    return {
        title: `Policy ${policy.policyNumber}`,
        description: `Details for policy ${policy.policyNumber}.`,
        openGraph: {
            title: `Policy ${policy.policyNumber}`,
            description: `Details for policy ${policy.policyNumber}.`,
            type: 'article',
        },
        alternates: { canonical: `/dashboard/policies/${id}` },
    };
}

// Static export — pre-generate all policy detail routes
export function generateStaticParams() {
    return mockPolicies.map((policy) => ({
        id: policy.id,
    }));
}

export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const policy = mockPolicies.find((p) => p.id === id);
    if (!policy) notFound();
    return <PolicyDetailClient policyId={id} />;
}

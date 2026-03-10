import type { Metadata } from 'next';
import PolicyDetailClient from './policy-detail-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Policy Details',
        description: 'View policy details and endorsements.',
        alternates: { canonical: `/dashboard/policies/${id}` },
    };
}

export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PolicyDetailClient policyId={id} />;
}

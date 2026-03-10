import type { Metadata } from 'next';
import ClaimDetailClient from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Claim Details',
        description: 'View claim details and follow-ups.',
        alternates: { canonical: `/dashboard/claims/${id}` },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ClaimDetailClient id={id} />;
}

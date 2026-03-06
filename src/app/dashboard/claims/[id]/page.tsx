import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { useClaim } from '@/hooks/api/use-claims';
import { claims } from '@/hooks/api';
import ClaimDetailClient from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const claim = claims.find((c) => c.id === id);
    if (!claim) return { title: 'Claim not found' };
    return {
        title: `Claim ${claim.claimNumber}`,
        description: `Claim ${claim.claimNumber} — ${claim.clientName}.`,
        openGraph: {
            title: `Claim ${claim.claimNumber}`,
            description: `Claim ${claim.claimNumber} — ${claim.clientName}.`,
            type: 'article',
        },
        alternates: { canonical: `/dashboard/claims/${id}` },
    };
}

// Generate static params for static export
export async function generateStaticParams() {
    return claims.map((claim) => ({
        id: claim.id,
    }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const claim = claims.find((c) => c.id === id);
    if (!claim) notFound();
    return <ClaimDetailClient params={params} />;
}

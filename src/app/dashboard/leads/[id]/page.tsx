import type { Metadata } from 'next';
import LeadDetailClient from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Lead Details',
        description: 'View lead profile and pipeline.',
        alternates: { canonical: `/dashboard/leads/${id}` },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <LeadDetailClient id={id} />;
}

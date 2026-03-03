import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockLeads } from '@/mock/leads';
import LeadDetailClient from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const lead = mockLeads.find((l) => l.id === id);
    if (!lead) return { title: 'Lead not found' };
    const name = lead.companyName || lead.contactName;
    return {
        title: name,
        description: `View lead profile for ${name}.`,
        openGraph: {
            title: name,
            description: `View lead profile for ${name}.`,
            type: 'article',
        },
        alternates: { canonical: `/dashboard/leads/${id}` },
    };
}

export async function generateStaticParams() {
    return mockLeads.map((lead) => ({
        id: lead.id,
    }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const lead = mockLeads.find((l) => l.id === id);
    if (!lead) notFound();
    return <LeadDetailClient />;
}

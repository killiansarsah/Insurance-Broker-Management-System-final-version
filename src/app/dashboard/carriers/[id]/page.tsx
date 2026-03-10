import type { Metadata } from 'next';
import CarrierDetailClient from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Carrier Details',
        description: 'View carrier products and contact info.',
        alternates: { canonical: `/dashboard/carriers/${id}` },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CarrierDetailClient carrierId={id} />;
}

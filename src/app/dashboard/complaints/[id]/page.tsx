import type { Metadata } from 'next';
import ComplaintDetailPage from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Complaint Details',
        description: 'View complaint details and SLA compliance.',
        alternates: { canonical: `/dashboard/complaints/${id}` },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ComplaintDetailPage id={id} />;
}

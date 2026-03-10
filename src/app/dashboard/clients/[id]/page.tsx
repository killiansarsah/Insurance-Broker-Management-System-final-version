import type { Metadata } from 'next';
import ClientProfilePage from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Client Profile',
        description: 'View client profile and policies.',
        alternates: { canonical: `/dashboard/clients/${id}` },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ClientProfilePage id={id} />;
}

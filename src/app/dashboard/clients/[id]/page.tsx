import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockClients, getClientDisplayName } from '@/mock/clients';
import ClientProfilePage from './client-page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const client = mockClients.find((c) => c.id === id);
    if (!client) return { title: 'Client not found' };
    return {
        title: getClientDisplayName(client),
        description: `View profile and policies for ${getClientDisplayName(client)}.`,
        openGraph: {
            title: getClientDisplayName(client),
            description: `View profile and policies for ${getClientDisplayName(client)}.`,
            type: 'article',
        },
        alternates: { canonical: `/dashboard/clients/${id}` },
    };
}

export async function generateStaticParams() {
    return mockClients.map((client) => ({
        id: client.id,
    }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = mockClients.find((c) => c.id === id);
    if (!client) notFound();
    return <ClientProfilePage />;
}

import { mockClients } from '@/mock/clients';
import ClientProfilePage from './client-page';

export async function generateStaticParams() {
    return mockClients.map((client) => ({
        id: client.id,
    }));
}

export default function Page() {
    return <ClientProfilePage />;
}

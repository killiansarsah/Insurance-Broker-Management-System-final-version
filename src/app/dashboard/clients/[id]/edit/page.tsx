import { mockClients } from '@/mock/clients';
import EditClientPage from './edit-client-page';

export async function generateStaticParams() {
    return mockClients.map((client) => ({
        id: client.id,
    }));
}

export default function Page() {
    return <EditClientPage />;
}

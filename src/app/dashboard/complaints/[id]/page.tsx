import { MOCK_COMPLAINTS } from '@/mock/documents-complaints';
import ComplaintDetailPage from './client-page';

// Generate static params for static export
export async function generateStaticParams() {
    return MOCK_COMPLAINTS.map((c) => ({
        id: c.id,
    }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <ComplaintDetailPage params={params} />;
}


import { carriers } from '@/mock/carriers';
import CarrierDetailClient from './client-page';

// Required for static export
export function generateStaticParams() {
    return carriers.map((carrier) => ({
        id: carrier.slug,
    }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    return <CarrierDetailClient params={params} />;
}

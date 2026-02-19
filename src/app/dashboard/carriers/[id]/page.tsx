
import { carriers } from '@/mock/carriers';
import { carrierProducts } from '@/mock/carrier-products';
import CarrierDetailClient from './client-page';
import { notFound } from 'next/navigation';

// Required for static export
export function generateStaticParams() {
    return carriers.map((carrier) => ({
        id: carrier.slug,
    }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const carrier = carriers.find((c) => c.slug === id);

    if (!carrier) {
        notFound();
    }

    // Filter products for this carrier using the carrier's ID
    const products = carrierProducts.filter(p => p.carrierId === carrier.id);

    return <CarrierDetailClient carrier={carrier} products={products} />;
}
